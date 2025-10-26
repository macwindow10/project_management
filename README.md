<div align="center">

# 📦 Project Management App

[![Next.js](https://img.shields.io/badge/Next.js-000?logo=next.js&logoColor=fff)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=fff)](https://www.typescriptlang.org/)
[![Prisma](https://img.shields.io/badge/Prisma-2D3748?logo=prisma&logoColor=fff)](https://www.prisma.io/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind-38B2AC?logo=tailwindcss&logoColor=fff)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](#-license)

Modern, compact, and icon-driven project management built with Next.js App Router.

</div>

---

## ✨ Features

- **Dashboard landing** at `/dashboard` (root `/` redirects)
- **Projects, Persons, Hardware** management
  - Compact, professional cards
  - Icon-only actions: Edit ✏️, Delete 🗑️, Add ➕
  - Attachments with file icons and sizes
- **File uploads** stored under `public/uploads` via API route
- **Person avatars**: uses uploaded picture URL when available, with graceful fallback
- **Type-safe** API and UI with TypeScript

## 🖼️ Screenshots

> Place screenshots in `public/screenshots/` and they will render here automatically.

<p>
  <img alt="Dashboard" src="/screenshots/dashboard.png" width="45%" />
  <img alt="Projects" src="/screenshots/projects.png" width="45%" />
</p>
<p>
  <img alt="Persons" src="/screenshots/persons.png" width="45%" />
  <img alt="Hardware" src="/screenshots/hardware.png" width="45%" />
</p>

## 🧭 Navigation

- `/dashboard` — main landing
- `/projects` — list, create, edit, delete projects; upload attachments
- `/persons` — manage people; upload picture (stored URL is rendered on cards)
- `/hardware` — manage hardware; assign to persons

## 🛠️ Tech Stack

- Next.js App Router, React, TypeScript
- Tailwind CSS for styling
- Prisma ORM (database configured in your Prisma schema)

## 🚀 Getting Started

1) Install deps
```bash
npm install
# or yarn / pnpm / bun
```

2) (Optional) Initialize database (adjust to your setup)
```bash
# inspect prisma/schema.prisma then run migrations
npx prisma migrate dev
npx prisma generate
```

3) Run the dev server
```bash
npm run dev
```

4) Open the app
```
http://localhost:3000
```
Root will redirect to `/dashboard`.

## 📂 Project Structure

```
app/
  api/              # REST API routes (projects, persons, hardware, upload)
  components/       # Reusable UI (forms, etc.)
  dashboard/        # Landing page
  persons/          # Persons list page
  projects/         # Projects list page
  hardware/         # Hardware list page
  page.tsx          # Redirects "/" to "/dashboard"
public/
  uploads/          # Saved files (created at runtime)
  screenshots/      # Place README images here (optional)
```

## 📸 File Uploads

- Upload endpoint: `POST /api/upload`
- Files saved to `public/uploads` and returned as `{ files: [{ fileName, fileUrl, fileType, fileSize }] }`
- Forms merge uploaded files into their `attachments` or `picture` fields and submit to the API

## ✅ Development Notes

- Persons: `picture` field stores the uploaded `fileUrl`
- Projects: attachments are recreated during updates from the submitted `attachments` array
- Hardware: date formatting handled in UI

## 🧪 Troubleshooting

- If images don’t render, verify the saved `fileUrl` is reachable under `/uploads/...`
- If DB writes fail, check Prisma database configuration and run migrations
- Use browser devtools console and server logs; extensive logging is added to upload and update flows

## 🤝 Contributing

1) Fork and create a feature branch
2) Make changes with clear commits
3) Open a PR describing the change and screenshots if UI-related

## 📄 License

MIT. See LICENSE file if present.

