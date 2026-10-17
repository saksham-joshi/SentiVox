# Senti-Vox Frontend

The beautiful, responsive web interface for Senti-Vox, built with **Next.js 16**, **React 19**, and **Tailwind CSS v4**.

<div align="center">

[![Bun](https://img.shields.io/badge/Bun-000000?style=for-the-badge&logo=bun&logoColor=white)](https://bun.sh)
[![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)](https://nextjs.org)
[![React](https://img.shields.io/badge/React_19-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://react.dev)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_v4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com)
[![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)](https://supabase.com)
[![Express.js](https://img.shields.io/badge/Express.js-%23404d59.svg?style=for-the-badge&logo=express&logoColor=%2361DAFB)](https://expressjs.com/)
[![Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)

</div>

## 📂 Folder Structure

This directory contains the Next.js application source code.

| Directory         | Description                                            |
| :---------------- | :----------------------------------------------------- |
| **`api/`**        | API clients and data fetching logic (Redis, Supabase). |
| **`app/`**        | The App Router directory containing pages and layouts. |
| **`components/`** | Reusable UI components.                                |
| **`db/`**         | Postgres interface, schemas etc..                      |  
| **`lib/`**        | Utility functions, helpers, and types.                 |
| **`lua/`**        | Lua scripts for Redis                                  |
| **`public/`**     | Static assets like images and fonts.                   |
| **`svg/`**        | SVG assets for logos and icons.                        |

## 🛠️ Technologies Used

- **[Bun](https://bun.sh)**: Used as the package manager and runtime.
- **[Next.js 16](https://nextjs.org)**: Latest version of the Next.js framework.
- **[React 19](https://react.dev)**: Leveraging latest React features.
- **[Tailwind CSS v4](https://tailwindcss.com)**: For styling and design system.
- **[Lucide React](https://lucide.dev)**: For the icon set.
- **[Simple icons](https://simpleicons.org)**: For the icon & logos set.
- **[Supabase](https://supabase.com)**: Used for postgresql.
- **[Upstash](https://upstash.com)**: Used Redis service for OTP Authentication and Rate Limiting using API Keys
- **[Express.js](https://expressjs.com/)**: Used for Cron feature keeping the Redis and PostgreSql awake.
- **[Node.js](https://nodejs.org/)**: Used as runtime for express.js app (cron).


## ⚡ Getting Started

### Prerequisites

- **Bun**: Ensure you have [Bun](https://bun.sh) installed.

### Installation

```bash
# Navigate to the site directory
cd site

# Install dependencies
bun install
```

### Environment Setup

Create a `.env` file in the root of the `site` directory and populate it with the following keys (Supabase URL, Resend, Redis, etc.).
```env
POSTGRES_PASSWORD=
AUTH_EMAIL=
AUTH_EMAIL_PASSWORD=
FREE_TOKEN_PASSWORD=
DEDUCT_TOKEN_PASSWORD=
DELETE_API_KEY_PASSWORD=
ROTATE_API_KEY_PASSWORD=
POSTGRESQL_SITE_ROLE_PASSWORD=
OTP_REDIS_URL=
OTP_REDIS_TOKEN=
DATABASE_URL=
JWT_SECRET=
```

### Development

To start the development server:

```bash
bun run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## 🚀 Deployment

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new).

Check out the [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
