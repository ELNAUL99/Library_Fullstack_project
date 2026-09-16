# Deployment Guide (AWS Free Plan)

This project deploys as two independent pieces:

- **Backend**: .NET 7 API + PostgreSQL → **AWS App Runner** (container) + **Amazon RDS for PostgreSQL**, image built and pushed by **GitHub Actions**.
- **Frontend**: React SPA → **Vercel Hobby** (separate step, later in this doc).

Everything below is done in the AWS Console + GitHub Settings UI — no local `aws` CLI needed. Once the wiring is in place, every push to `main` that touches `backend/**` auto-deploys.

---

## AWS Free Plan reality check — read before starting

You're on the [AWS Free Plan](https://aws.amazon.com/free/) (the July-2025 model, not the older 12-month Free Tier). Key facts, straight from the AWS terms:

- Free Plan ends after **6 months OR when your $200 in credits is depleted**, whichever comes first.
- **When it ends, AWS closes your account** — resources are inaccessible. Data is retained for 90 days, then permanently deleted.
- **You will not be silently billed.** Unlike Azure's Pay-As-You-Go trap, AWS does not auto-upgrade you to a paid plan. To keep the app running past the 85-day mark you have to explicitly click *"Upgrade to a paid plan"* — don't do that unless you mean it.

### What this deploy will consume

Rough estimate for a hobby-scale demo, per month:

| Resource | Config | ~Credit burn |
|----------|--------|--------------|
| App Runner | 0.25 vCPU / 0.5 GB, min 1 instance | ~$5 |
| RDS PostgreSQL | `db.t3.micro`, single-AZ, 20 GB gp3 | ~$15 |
| ECR | one repo, few hundred MB stored | ~$0.10 |
| Data transfer | modest | ~$0 |
| **Total** | | **~$20/month** |

With $120 in credits, that's about **6 months of runway** — comfortably longer than the 6-month plan window. If your usage stays low, you might see the plan expire before the credits do.

### Tear-down (do this before day 85 if you don't want to upgrade)

1. Delete App Runner service.
2. Delete RDS instance (uncheck "final snapshot" to avoid a lingering charge).
3. Delete ECR repository.
4. Optional: delete the IAM user created for GitHub Actions.

After that, the app is off, and even if the plan converted, there would be nothing to bill.

---

## 1. One-time AWS setup

Open [https://console.aws.amazon.com](https://console.aws.amazon.com). Pick a region close to you (e.g. `eu-north-1` Stockholm, `eu-west-1` Ireland, `us-east-1` N. Virginia). **Stay in the same region for every step below** — RDS, ECR, and App Runner all need to be in the same region.

### 1.1 RDS PostgreSQL

1. Console search → **RDS** → **Databases** → **Create database**.
2. Engine: **PostgreSQL**. Version: 15.x (default is fine).
3. Templates: **Free tier** (this pins you to Free-Tier-eligible sizes).
4. Settings:
   - DB instance identifier: `library-db`
   - Master username: `libraryadmin`
   - Master password: pick a strong one, save it now — you'll need it for the connection string.
5. Instance configuration: `db.t3.micro` (should be the default under Free tier).
6. Storage: **20 GB gp3**. Uncheck "Enable storage autoscaling" (avoids surprise growth into paid territory).
7. Connectivity:
   - **Public access**: **Yes** (simpler than putting App Runner in a VPC; RDS will still require your master password).
   - **VPC security group**: **Create new**, name it `library-db-sg`.
8. Additional configuration:
   - Initial database name: `librarydb`
   - Backup retention: 1 day (minimum).
   - Deletion protection: off (makes clean-up on day 85 easier).
9. **Create database**. Wait 5–10 min.

Once it says **Available**, click the DB → **Connectivity & security** → copy the **Endpoint** (looks like `library-db.xxxx.us-east-1.rds.amazonaws.com`) and note the **Port** (5432).

Then: click the security group `library-db-sg` → **Inbound rules** → **Edit inbound rules** → **Add rule**:
- Type: **PostgreSQL** (port 5432)
- Source: **Anywhere-IPv4** (`0.0.0.0/0`)
- Save. (App Runner outbound IPs aren't stable, so restricting by source is impractical for the hobby plan. Postgres itself is still password-protected.)

### 1.2 ECR (container registry)

1. Console search → **ECR** → **Repositories** → **Create repository**.
2. Visibility: **Private**.
3. Repository name: `library-backend`.
4. Leave the rest as defaults → **Create**.

Note the **URI** shown for the repo (looks like `123456789012.dkr.ecr.us-east-1.amazonaws.com/library-backend`) — mostly informational, the workflow figures it out.

### 1.3 IAM user for GitHub Actions

1. Console search → **IAM** → **Users** → **Create user**.
2. Name: `github-actions-library`. **Do NOT** grant console access.
3. Set permissions → **Attach policies directly** → attach:
   - `AmazonEC2ContainerRegistryFullAccess`
   - `AWSAppRunnerFullAccess`

   (You can tighten these later; both are AWS-managed policies.)
4. **Create user**.
5. Open the new user → **Security credentials** tab → **Create access key** → Use case: **Application running outside AWS**. Copy the **Access key ID** and **Secret access key**. **You won't see the secret again.**

### 1.4 GitHub secrets and variables

Open the repo on GitHub → **Settings → Secrets and variables → Actions**.

**Secrets tab → New repository secret**, add two:

| Name | Value |
|------|-------|
| `AWS_ACCESS_KEY_ID` | from step 1.3 |
| `AWS_SECRET_ACCESS_KEY` | from step 1.3 |

**Variables tab → New repository variable**, add three:

| Name | Value |
|------|-------|
| `AWS_REGION` | e.g. `us-east-1` (whatever you picked) |
| `ECR_REPOSITORY` | `library-backend` |
| `APP_RUNNER_SERVICE_ARN` | leave empty for now — you'll fill this in after step 1.5 |

### 1.5 First image push (via the workflow)

Trigger the workflow **manually** so the initial image lands in ECR before App Runner is created:

1. GitHub repo → **Actions** tab → **Deploy backend to AWS App Runner** → **Run workflow** → **Run**.
2. Wait for the run to go green (~3 min). The last "Trigger App Runner deployment" step is skipped because `APP_RUNNER_SERVICE_ARN` is empty — expected.
3. Confirm in AWS Console → **ECR** → your repo — you should now see two tags: `latest` and one that matches the commit SHA.

### 1.6 Create the App Runner service

1. Console search → **App Runner** → **Create service**.
2. Source and deployment:
   - **Container registry**.
   - Provider: **Amazon ECR**.
   - Container image URI: click **Browse** → pick `library-backend`, tag `latest`.
   - Deployment settings: **Automatic** (App Runner watches ECR for new `:latest` pushes).
   - ECR access role: **Create new service role** (App Runner will make one).
3. Configure service:
   - Service name: `library-backend`
   - Virtual CPU: **0.25 vCPU**, Memory: **0.5 GB** (smallest, cheapest).
   - **Environment variables** — click **Add environment variable** for each:

     | Name | Value |
     |------|-------|
     | `ASPNETCORE_ENVIRONMENT` | `Production` |
     | `ConnectionStrings__DefaultConnection` | `Host=<rds-endpoint>;Port=5432;Database=librarydb;Username=libraryadmin;Password=<your-password>;SSL Mode=Require;Trust Server Certificate=true` |
     | `Jwt__Secret` | a long random string, ≥ 32 chars. Generate with `openssl rand -base64 48` locally, or a password manager. |
     | `Jwt__Issuer` | `library-api` |
     | `Jwt__Audience` | `library-users` |
     | `Cors__AllowedOrigins` | your Vercel URL, e.g. `https://library-fullstack-project-git-main-elnaul99s-projects.vercel.app`. Comma-separated for multiple. |

   - Port: **8080** (matches the Dockerfile).
   - Health check: **HTTP**, path `/`, everything else default. Swagger UI at `/` returns 200.
4. **Create & deploy**. Wait ~5 min. Status goes `Operation in progress` → `Running`.
5. Copy the **Default domain** — looks like `abcd1234.us-east-1.awsapprunner.com`. That's your backend URL.

### 1.7 Wire the workflow to auto-deploy

Back on the service page, copy the **Service ARN** (top of the page or under Configuration → Service overview) — starts with `arn:aws:apprunner:...`.

GitHub → **Settings → Secrets and variables → Actions → Variables tab** → edit `APP_RUNNER_SERVICE_ARN` → paste. Save.

From now on, every push to `main` that touches `backend/**` builds a new image and triggers App Runner to redeploy.

---

## 2. Point the frontend at the live backend

Once App Runner reports a healthy URL:

1. Edit `frontend/.env.production` in the repo:
   ```env
   REACT_APP_API_URL=https://<your-apprunner-domain>.awsapprunner.com
   ```
2. Commit + push. Vercel auto-rebuilds and redeploys the frontend against the live backend.
3. In App Runner → **Configuration → Environment variables**, make sure `Cors__AllowedOrigins` includes the Vercel URL. If not, add it and click **Deploy** (top right).

Update the README's **Live URL** placeholder to point at the Vercel URL.

---

## 3. Verify

- Backend root (Swagger): `https://<apprunner-domain>.awsapprunner.com/`
- Sample: `https://<apprunner-domain>.awsapprunner.com/Books?page=1&pageSize=3` — should return `{items, totalItems, ...}`.
- Frontend: your Vercel URL. Log in / register (registration creates a user + assigns `CUSTOMER` role). The frontend calls the App Runner backend, no mixed-content issue (both HTTPS).

If the frontend loads but calls hang or 404, open browser devtools → Network — the most common causes are:
- `Cors__AllowedOrigins` on App Runner doesn't exactly match the Vercel origin (trailing slash, wrong subdomain).
- RDS security group blocking (`0.0.0.0/0` inbound on 5432 is required with public access).
- Migration on startup failed — check App Runner logs (Service → **Logs** → **Application logs**).

---

## 4. Alt path: if the plan expires and you don't want to upgrade

Your data is retained for 90 days after Free Plan closure. Options:

- **Do nothing**: AWS deletes everything at day 90 after expiry. No bill.
- **Move to Render + Neon** (both permanently free, no card): create a Render free web service pointing at this repo's Dockerfile, and a Neon free Postgres. Update Vercel's `REACT_APP_API_URL` to the Render URL. Notes for that path aren't in this doc yet — ask and I'll write them.
- **Fall back to local backend**: the README's "Try it live" section already documents this; nothing to change.

---

## 5. Future work

### 5.1 Bump to .NET 8

.NET 7 is in extended support only. Change:
- `backend/backend.csproj`: `<TargetFramework>net7.0</TargetFramework>` → `net8.0`
- `backend/Dockerfile`: `mcr.microsoft.com/dotnet/sdk:7.0` → `8.0`, same for `aspnet:7.0` → `8.0`
- Bump `Microsoft.AspNetCore.*`, `Microsoft.EntityFrameworkCore.*`, `Npgsql.EntityFrameworkCore.PostgreSQL` to 8.x.

Nothing on the AWS side needs to change — the container just runs whatever .NET version its base image includes.

### 5.2 Reduce Swagger exposure

`Program.cs` currently registers Swagger unconditionally. In a public deployment you probably want to gate it behind an env check or an admin route.

### 5.3 Rotate the IAM access key

The `AWS_ACCESS_KEY_ID` / `AWS_SECRET_ACCESS_KEY` secrets are long-lived credentials. AWS recommends rotating every 90 days, or migrating to GitHub OIDC (which uses short-lived tokens minted at run time — more setup, no secrets stored). See [Configuring OpenID Connect in Amazon Web Services](https://docs.github.com/en/actions/deployment/security-hardening-your-deployments/configuring-openid-connect-in-amazon-web-services).
