# Deployment Guide

This project deploys as two independent pieces:

- **Backend**: .NET 7 API + PostgreSQL → **Azure App Service** (Linux) + **Azure Database for PostgreSQL flexible server**, deployed via **GitHub Actions**.
- **Frontend**: React SPA → **Vercel** (separate step, later in this doc).

No local `az` CLI is needed. All Azure setup is done through the portal once, then GitHub Actions handles every future deploy on `push` to `main`.

---

## 1. Backend — one-time Azure setup (portal)

You need an Azure subscription (Free trial or Pay-As-You-Go, both work).

### 1.1 Resource group

1. https://portal.azure.com → **Resource groups** → **Create**.
2. Subscription: your subscription.
3. Resource group: `library-rg`.
4. Region: pick one close to you (e.g. `North Europe`, `West Europe`, `East US`).
5. **Review + create** → **Create**.

### 1.2 Postgres server

1. Portal search bar → **Azure Database for PostgreSQL flexible servers** → **Create**.
2. Subscription/Resource group: same as above.
3. Server name: `library-pg-<something-unique>` (must be globally unique — e.g. `library-pg-elnaul99`).
4. Region: same as the resource group.
5. Workload type: **Development** (cheapest tier).
6. Compute + storage: keep the default (Burstable B1ms, 32 GB).
7. Availability zone: any.
8. **Authentication method**: **PostgreSQL authentication only**.
9. Admin username: `libraryadmin`. Password: pick a strong one — save it, you'll need it in a moment.
10. **Next: Networking** → **Public access (allowed IP addresses)** → check both:
    - **Allow public access from any Azure service within Azure to this server**
    - **Add current client IP address** (only needed if you want to connect from your Mac too)
11. **Review + create** → **Create**. Wait ~5 minutes.

Once created, open the server → **Databases** → **Add** → name it `librarydb` → **Save**.

### 1.3 App Service

1. Portal search bar → **App Services** → **Create** → **Web App**.
2. Subscription/Resource group: same.
3. Name: `backend-library` (must be globally unique; if taken, e.g. `backend-library-elnaul99` — **remember what you pick, you'll need to update the workflow file**).
4. Publish: **Code**.
5. Runtime stack: **.NET 7 (STS)** — if only newer versions are shown, pick the closest LTS and I'll bump the workflow.
6. Operating System: **Linux**.
7. Region: same.
8. Pricing plan: **Basic B1** (~$13/mo, single small instance) or **Free F1** if you want zero cost and can accept cold starts + no custom domain.
9. **Review + create** → **Create**. Wait ~2 minutes.

### 1.4 App Service configuration

Open the new App Service → left menu **Settings → Environment variables** → **App settings** tab. Click **+ Add** for each of the below.

**Connection string** (special — use the **Connection strings** tab, not App settings):

| Name | Value | Type |
|------|-------|------|
| `DefaultConnection` | `Host=<pg-server-name>.postgres.database.azure.com;Port=5432;Database=librarydb;Username=libraryadmin;Password=<password-you-picked>;SSL Mode=Require;Trust Server Certificate=true` | **Custom** |

Replace `<pg-server-name>` with the name from step 1.2 (e.g. `library-pg-elnaul99`), and `<password-you-picked>` with the admin password.

**App settings**:

| Name | Value |
|------|-------|
| `ASPNETCORE_ENVIRONMENT` | `Production` |
| `Jwt__Secret` | Something long and random. Generate with `openssl rand -base64 48` locally, or use any password manager. Must be at least 32 chars. |
| `Jwt__Issuer` | `library-api` |
| `Jwt__Audience` | `library-users` |
| `Cors__AllowedOrigins` | Leave empty for now; fill in once the Vercel frontend URL exists, e.g. `https://library-frontend.vercel.app` |

**Save** at the top. This will restart the App Service.

### 1.5 GitHub Actions secret

Back in the App Service → **Overview** → **Get publish profile** (button in the top command bar). A `.PublishSettings` file downloads.

1. Open your repo on GitHub: https://github.com/ELNAUL99/Library_Fullstack_project
2. **Settings → Secrets and variables → Actions → New repository secret**.
3. Name: `AZURE_WEBAPP_PUBLISH_PROFILE`.
4. Value: paste the entire contents of the `.PublishSettings` file you just downloaded (yes, the whole XML).
5. **Add secret**.

### 1.6 Update the workflow's app name

`.github/workflows/deploy-backend.yml` has `AZURE_WEBAPP_NAME: backend-library` at the top. If you used a different name in step 1.3, edit that line to match, commit, push.

### 1.7 First deploy

Any push to `main` that touches `backend/**` (or the workflow file) triggers the deploy. You can also trigger it manually: **Actions** tab on GitHub → **Deploy backend to Azure App Service** → **Run workflow**.

Once green:

- API root: `https://<app-name>.azurewebsites.net/`
- Swagger UI: `https://<app-name>.azurewebsites.net/` (the app already sets `RoutePrefix = string.Empty`).

On first request the app runs `dbContext.Database.MigrateAsync()` and creates the schema; if seeding is enabled it also creates roles and promotes any matching admin user.

---

## 2. Frontend — Vercel

Once the backend URL is live:

1. https://vercel.com/new → **Import** the GitHub repo.
2. Framework preset: **Create React App**.
3. Root directory: `frontend`.
4. Build command: `npm run build` (default).
5. Output directory: `build` (default).
6. **Environment Variables**:
   - `REACT_APP_API_URL` = `https://<app-name>.azurewebsites.net`
7. **Deploy**.

Vercel returns a URL like `https://library-frontend-xxx.vercel.app`.

Now go back to the Azure App Service **Configuration** and set:

- `Cors__AllowedOrigins` = `https://library-frontend-xxx.vercel.app`

Save (App Service restarts). Login and API calls from the deployed frontend will now succeed.

---

## 3. Future work

### 3.1 Bump to .NET 8

.NET 7 is in extended support only — Microsoft has ended mainstream support. When convenient:

- Change `backend/backend.csproj`: `<TargetFramework>net7.0</TargetFramework>` → `net8.0`.
- Bump `Microsoft.AspNetCore.*`, `Microsoft.EntityFrameworkCore.*`, `Npgsql.EntityFrameworkCore.PostgreSQL` to `8.x`.
- Update `.github/workflows/deploy-backend.yml`: `DOTNET_VERSION: "8.0.x"`.
- In the App Service, **Settings → Configuration → General settings → Stack settings**: switch runtime to **.NET 8 (LTS)**.

### 3.2 Reduce Swagger exposure

`Program.cs` currently registers Swagger unconditionally. In production you probably want to gate it behind an env check or an admin route.

### 3.3 Rotate the JWT secret you set in App Settings

The user-secrets value (`"your-very-long-secret-key"`) is a dev placeholder. The one you set in App Service should be long and random — see 1.4 above.
