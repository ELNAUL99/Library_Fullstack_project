# Library Fullstack Project

![TypeScript](https://img.shields.io/badge/TypeScript-v.4-green)
![SASS](https://img.shields.io/badge/SASS-v.4-hotpink)
![React](https://img.shields.io/badge/React-v.18-blue)
![Redux Toolkit](https://img.shields.io/badge/Redux-v.1.9-brown)
![.NET Core](https://img.shields.io/badge/.NET%20Core-v.7-purple)
![EF Core](https://img.shields.io/badge/EF%20Core-v.7-cyan)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-v.14-darkblue)

A fullstack Library Management System built with a **React + TypeScript** frontend and a **.NET Core 7 + EF Core + PostgreSQL** backend. The application supports role-based authentication (JWT), book catalog management, rentals, and an admin dashboard.

---

## Try it live — read this first

> The frontend is deployed on Vercel, but **the backend is not hosted anywhere**. The deployed UI is wired to talk to a backend running on **your own machine** at `http://localhost:5131`. Open the live URL without a local backend running and you'll see the login page, but every API call will fail.

**Live URL:** _to be filled in after first Vercel deploy — see [DEPLOY.md](./DEPLOY.md)_

### To actually use the deployed demo, in this order

1. **Clone this repo** and set up PostgreSQL (see [Prerequisites](#prerequisites) + [Database](#4-database)).
2. **Start the backend** on port 5131:
   ```bash
   cd backend
   dotnet run --urls http://localhost:5131
   ```
3. **Open the live URL** in your browser. Log in / register. The frontend will call your local backend.

### Browser mixed-content note

The live site is HTTPS but calls `http://localhost:5131`. Modern Chromium browsers (Chrome, Edge, Brave) and Firefox treat `http://localhost` as a "potentially trustworthy" origin and allow the call. **Safari blocks it**. If you're on Safari, either:
- Use Chrome/Firefox for the demo, or
- Run the frontend locally too (`cd frontend && npm start`), which serves over plain HTTP so no mixed-content rule applies.

---

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Installation & Setup](#installation--setup)
  - [Backend](#backend)
  - [Frontend](#frontend)
  - [Database](#database)
- [Environment Variables](#environment-variables)
- [Running the Application](#running-the-application)
- [API Overview](#api-overview)
- [Database Schema](#database-schema)
- [Testing](#testing)
- [Deployment Notes](#deployment-notes)
- [Code Improvements](#code-improvements)
- [License](#license)

---

## Features

- **User Authentication**: Register/Login with JWT tokens, role-based access control (`CUSTOMER` / `ADMIN`).
- **Book Catalog**: Browse books, authors, categories, and publishers.
- **Book Copies**: Track individual copies of books and their availability.
- **Rentals**: Users can rent available copies; admins can manage all rentals and view expired/not-expired rentals.
- **Admin Dashboard**: Protected admin pages for managing books, authors, categories, publishers, and rentals.
- **User Profile**: View and edit user profiles.
- **Global Error Handling**: Centralized exception middleware with standardized error responses.
- **CORS Configured**: Ready for local development and deployed frontend integration.

---

## Tech Stack

### Frontend
- **React 18** with TypeScript
- **Redux Toolkit** for state management
- **React Router DOM** for client-side routing
- **Axios** for HTTP requests
- **SASS** for styling
- **Material-UI (MUI) v5** for UI components

### Backend
- **.NET 7**
- **Entity Framework Core 7** with PostgreSQL
- **ASP.NET Core Identity** for user/role management
- **JWT Bearer Authentication**
- **Swagger/OpenAPI** for API documentation
- **xUnit** for unit testing

### Database
- **PostgreSQL 14**
- Code-first migrations with EF Core
- Snake-case naming convention
- Automatic `CreatedAt` / `UpdatedAt` timestamps

---

## Project Structure

```
Library_Fullstack_project/
├── backend/                    # .NET Core Web API
│   ├── Controllers/            # API controllers (Book, Rental, User, etc.)
│   ├── DTOs/                   # Data Transfer Objects
│   ├── Db/                     # DbContext, interceptors, config extensions
│   ├── Middleware/             # Global exception middleware
│   ├── Migrations/             # EF Core migrations
│   ├── Models/                 # Entity models (Book, User, Rental, etc.)
│   ├── Services/               # Business logic & interfaces
│   │   └── Impl/               # Service implementations
│   ├── Program.cs              # App entry point & DI configuration
│   └── backend.csproj
│
├── backend.Tests/              # xUnit test project
│   ├── UserDTOTests.cs
│   └── backend.Tests.csproj
│
├── frontend/                   # React SPA
│   ├── public/
│   ├── src/
│   │   ├── components/         # Reusable components (Header, cards, notifications)
│   │   ├── config/             # API endpoint configuration
│   │   ├── hooks/              # Custom React hooks
│   │   ├── layout/             # Layout wrappers
│   │   ├── page/               # Application pages
│   │   │   ├── admin/          # Admin dashboard pages
│   │   │   └── Book/           # Book-related pages
│   │   ├── redux/              # Redux store & reducers
│   │   ├── routing/            # Route definitions
│   │   ├── services/           # API client (Axios wrapper)
│   │   ├── style/              # SCSS stylesheets
│   │   ├── types/              # TypeScript type definitions
│   │   ├── App.tsx
│   │   └── index.tsx
│   ├── package.json
│   └── tsconfig.json
│
├── fs13-FullStack.sln          # Visual Studio solution file
├── CODE_IMPROVEMENTS.md        # Documented fixes & enhancements
├── package.json                # Root npm scripts (concurrently run both)
└── README.md
```

---

## Prerequisites

- [.NET 7 SDK](https://dotnet.microsoft.com/download/dotnet/7.0)
- [Node.js 18+](https://nodejs.org/)
- [PostgreSQL 14+](https://www.postgresql.org/download/)
- (Optional) [Visual Studio 2022](https://visualstudio.microsoft.com/) or [VS Code](https://code.visualstudio.com/)

---

## Installation & Setup

### 1. Clone the repository

```bash
git clone https://github.com/ELNAUL99/Library_Fullstack_project.git
cd Library_Fullstack_project
```

### 2. Backend

```bash
cd backend
```

#### Restore packages
```bash
dotnet restore
```

#### Configure database connection
Update `appsettings.json` (or `appsettings.Development.json`):

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Host=localhost;Port=5432;Database=library_db;Username=postgres;Password=your_password"
  },
  "Jwt": {
    "Secret": "your-super-secret-jwt-key-min-32-chars!!",
    "Issuer": "LibraryApi",
    "Audience": "LibraryClient"
  }
}
```

> **Security Note**: The backend currently uses relaxed password policy settings for development. Change these in `Program.cs` before production use.

#### Apply migrations & create database
```bash
dotnet ef database update
```

#### Run the backend
```bash
dotnet run --urls http://localhost:5131
```
The API will start on `http://localhost:5131` — that's the URL both the
local frontend (`.env`) and the deployed Vercel frontend (`.env.production`)
expect. Swagger UI is served at the root URL.

---

### 3. Frontend

Open a new terminal:

```bash
cd frontend
```

#### Install dependencies
```bash
npm install
```

#### Configure environment variables
Create a `.env` file in the `frontend/` directory for local dev:

```env
REACT_APP_API_URL=http://localhost:5131
```

> See `frontend/.env.example` for the template.
>
> `frontend/.env.production` is committed to the repo and sets the same
> localhost URL — that's the file Vercel uses for the deployed build.
> Change it only if you host the backend somewhere public.

#### Run the frontend
```bash
npm start
```
The React dev server will start at `http://localhost:3000`.

---

### 4. Database

The project uses **PostgreSQL** with **Entity Framework Core** code-first migrations.

- On first run, the application seeds two roles automatically: `CUSTOMER` and `ADMIN`.
- The database schema includes tables for:
  - **Users** (ASP.NET Identity extended)
  - **Books** (title, ISBN, description)
  - **Authors**
  - **Categories**
  - **Publishers**
  - **Copies** (individual book copies with availability)
  - **Rentals** (user rentals with due dates & return status)

#### Creating a new migration
```bash
cd backend
dotnet ef migrations add MigrationName
```

---

## Environment Variables

### Backend (`backend/appsettings.json` or user secrets)
| Variable | Description |
|----------|-------------|
| `ConnectionStrings:DefaultConnection` | PostgreSQL connection string |
| `Jwt:Secret` | JWT signing key (min 32 characters) |
| `Jwt:Issuer` | JWT issuer |
| `Jwt:Audience` | JWT audience |

### Frontend (`frontend/.env`)
| Variable | Description |
|----------|-------------|
| `REACT_APP_API_URL` | Base URL of the backend API |

---

## Running the Application

### Option A: Run separately
1. Start PostgreSQL.
2. Start backend: `cd backend && dotnet run`.
3. Start frontend: `cd frontend && npm start`.

### Option B: Run both from root (if root `package.json` is configured)
```bash
npm install
npm start
```

---

## API Overview

| Endpoint | Method | Auth | Description |
|----------|--------|------|-------------|
| `/api/v1/register` | POST | Public | User registration |
| `/api/v1/login` | POST | Public | User login (returns JWT) |
| `/api/v1/profile` | GET | Bearer | Get current user profile |
| `/api/v1/users/{id}` | PUT | Bearer | Update user profile |
| `/api/v1/books` | GET/POST | Public/Admin | List / create books |
| `/api/v1/books/{id}/categories` | POST | Admin | Add category to book |
| `/api/v1/books/{id}/authors` | POST | Admin | Add author to book |
| `/api/v1/rentals` | GET | Admin | List all rentals |
| `/api/v1/rentals` | POST | Bearer | Create a rental |
| `/api/v1/rentals/user/all` | GET | Bearer | Get current user's rentals |
| `/api/v1/rentals/expired` | GET | Admin | Get expired rentals (paginated) |
| `/api/v1/rentals/notexpired` | GET | Admin | Get active rentals (paginated) |

Full API documentation is available via **Swagger UI** when the backend is running.

---

## Database Schema

### Core Entities

| Entity | Key Fields | Relationships |
|--------|-----------|---------------|
| **User** | Id, UserName, Email, PasswordHash | Has many Rentals |
| **Book** | Id, Title, ISBN, Description | Has many Copies, Authors, Categories |
| **Author** | Id, Name | Many-to-many with Books |
| **Category** | Id, Name | Many-to-many with Books |
| **Publisher** | Id, Name | Has many Copies |
| **Copy** | Id, IsAvailable | Belongs to Book & Publisher; has many Rentals |
| **Rental** | Id, DateRented, DueDate, Returned | Belongs to User & Copy |

### Indexes
- `Books.Title` — Unique
- `Books.ISBN` — Unique
- `Authors.Name` — Unique
- `Categories.Name` — Unique
- `Users.UserName` — Unique
- `Users.Email` — Unique

---

## Testing

### Backend Tests
```bash
cd backend.Tests
dotnet test
```

Includes:
- User DTO mapping tests
- Unit test scaffolding (xUnit)

### Frontend Tests
```bash
cd frontend
npm test
```

---

## Deployment Notes

### Current setup

- **Frontend**: deployed on Vercel (Hobby / free tier — no card required).
- **Backend**: **not currently hosted anywhere.** The old Azure App Service (`backend-library.azurewebsites.net`) was deleted; DNS no longer resolves. Anyone visiting the live URL must run the backend locally on port 5131 — see [Try it live](#try-it-live--read-this-first) at the top of this README.

### Frontend build

- `frontend/.env.production` sets `REACT_APP_API_URL=http://localhost:5131`. Vercel picks this up at build time; the deployed bundle targets a locally-running API.
- `frontend/build` (git-ignored) is the local production build output; Vercel builds its own copy from `main`.

### Backend

- `Program.cs` reads `Cors:AllowedOrigins` from configuration (comma-separated). For a Vercel demo, set it to your Vercel URL (e.g. `https://library-frontend.vercel.app`); locally it defaults to `http://localhost:3000`.
- `dbContext.Database.MigrateAsync()` runs at startup, so a fresh Postgres gets its schema on first boot without a manual `dotnet ef database update`.
- Swagger is exposed at the app root in all environments. Restrict it before you host the backend anywhere public.

### Full deploy guide

- Frontend + backend (Azure) walkthrough with pipeline: [DEPLOY.md](./DEPLOY.md).
- Not yet used, kept for the day the backend gets hosted again.

---

## Code Improvements

See [`CODE_IMPROVEMENTS.md`](./CODE_IMPROVEMENTS.md) for a detailed log of fixes and enhancements, including:

- RentalDTO constructor bug fix
- Missing service registrations in DI container
- Enhanced error handling in controllers
- New standardized DTOs (`ErrorResponseDTO`, `PaginatedResponseDTO`)
- Global exception middleware
- Frontend API client centralization with Axios interceptors
- Redux thunk refactoring

---

## License

This project is for educational purposes. Feel free to use and modify.

---

*Built with .NET 7, React 18, and PostgreSQL.*
