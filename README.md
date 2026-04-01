## Visa QR Admin project

This is a fullstack Next.js application for managing visa-style applicant records. It provides:jf


- **Admin pages** (protected by a simple password) to create and edit applicants
- **Backend API** using **Prisma** with a **PostgreSQL** database (e.g. [Neon](https://neon.tech) or Vercel Postgres)
- **Automatic MRZ-style code** generation based on the applicant's details
- **Automatic QR code** generation that links to a public read-only page for each applicant

### Main flows

- **Create applicant**: `Admin → /admin?tab=new` (or `/admin/new` which redirects there)
  - Fill-in all required fields (names, dates, passport, visa details, etc.)
  - On save, the backend:
    - Stores the record in the database via Prismaaaa
    - Generates the MRZ-style codebbbbb
    - Generates a QR code (PNG as a data URL) that encodes the public verification URL
- **List & edit applicants**: `Admin → /admin?tab=list` (or `/admin/list` which redirects there)
  - Shows all applicants with:
    - Key details
    - The QR code image
    - Links to edit or open the public view
- **Public verification page**: `/e-visa/verify/[id]` (also reachable via `/u/[id]` redirect)
  - Read-only page designed to be opened by scanning the QR code

### Admin protection

Admin pages under `/admin/*` are protected by a simple password and cookie:

- Set `ADMIN_PASSWORD` in `.env`
- Visit `/admin/login`, enter the password, then you will be able to access:
  - `/admin` (login or dashboard with `?tab=new` or `?tab=list`)
  - `/admin/edit/[id]` (edit applicant)

### Setup & development

**For a full step-by-step guide** (extract zip → install → run → push to GitHub → deploy on Vercel), see **[SETUP_AND_DEPLOY_GUIDE.md](./SETUP_AND_DEPLOY_GUIDE.md)**. It is written for non-developers and can be used to assist someone over WhatsApp or chat.

1. **Install dependencies**

   ```bash
   npm install
   ```

2. **Configure environment**

   Copy `.env.example` to `.env` and set:

   - `DATABASE_URL` – PostgreSQL connection string (e.g. from [Neon](https://neon.tech) or Vercel Postgres)
   - `ADMIN_PASSWORD` – your admin password
   - `NEXT_PUBLIC_BASE_URL` – app URL (e.g. `http://localhost:3000` locally, or your Vercel URL in production)

3. **Database (Prisma + PostgreSQL)**

   The app uses PostgreSQL (for both local and Vercel). Create tables with:

   ```bash
   npx prisma db push
   ```

4. **Run the dev server**

   ```bash
   npm run dev
   ```

   Then open `http://localhost:3000` in your browser.

### Project structure (high level)

- `app/`
  - `layout.tsx` – global layout
  - `page.tsx` – landing page with links to admin pages
  - `admin/`
    - `layout.tsx` – layout for admin section
    - `login/page.tsx` – password-based admin login
    - `new/page.tsx` – create applicant form
    - `list/page.tsx` – list of all applicants with edit/public links and QR images
    - `edit/[id]/page.tsx` – edit selected applicant
  - `e-visa/verify/[id]/page.tsx` – public verification page; `u/[id]` redirects here
- `app/api/`
  - `admin/login/route.ts` – admin login (sets auth cookie)
  - `applicants/route.ts` – `GET` list, `POST` create applicant
  - `applicants/[id]/route.ts` – `GET` single, `PUT` update
- `src/lib/`
  - `prisma.ts` – Prisma client
  - `codes.ts` – MRZ-style code generation helper
- `prisma/schema.prisma` – DB schema (`Applicant` model)

You can now customize the design, extend the applicant fields, or integrate real file uploads as needed.

