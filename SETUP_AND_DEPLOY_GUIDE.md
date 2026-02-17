# Step-by-step: Run the project, push to GitHub, and deploy on Vercel

**Already set up (nothing else assumed):**  
The person following this guide has **Git** installed and **connected to GitHub**, and **Node.js 20** installed. They have **not** set up anything else related to coding (no project folder, no database, no Vercel, no terminal experience with this project).

**Note:** The project uses **PostgreSQL** for the database. If you (or the person who sent the zip) previously used SQLite, set `DATABASE_URL` in `.env` to a Postgres connection string as in Step 1.3–1.4 below.

This guide walks them through:  
**1)** Extracting the .zip and running the project on their computer  
**2)** Pushing this project to their GitHub account  
**3)** Deploying it on Vercel so the app works online  

You can use these steps to assist someone over WhatsApp (or any chat). No other developer experience is required.

---

## Part 1 — Get the project running on your computer

### Step 1.1 — Receive and extract the .zip file

1. **Receive the .zip file** (e.g. via WhatsApp or email).  
   The file might be named something like `PAK.zip` or `pak-app.zip`.

2. **Save it** to a folder you can find easily (e.g. **Desktop** or **Documents**).

3. **Extract (unzip) the file:**
   - **Windows:** Right-click the .zip file → **Extract All…** → choose a folder (e.g. **Desktop**) → **Extract**.
   - **Mac:** Double-click the .zip file. A new folder with the same name (without .zip) will appear next to it.

4. **Open the extracted folder.**  
   You should see files and folders like `app`, `src`, `prisma`, `package.json`, `.env.example`, etc.  
   This folder is your **project folder**. Remember its location (e.g. `Desktop\PAK`).

---

### Step 1.2 — Check Node.js (you already have Node 20)

We assume **Node.js 20** is already installed. Just confirm it works.

1. **Windows:** Open **PowerShell** or **Command Prompt** (search for "PowerShell" or "cmd" in the Start menu).  
   **Mac:** Open **Terminal** (search "Terminal" in Spotlight).

2. In that terminal, type:  
   ```bash
   node -v
   ```  
   You should see something like `v20.x.x`. If you see “not recognized” or an error, install Node 20 from **https://nodejs.org** (LTS version) and try again.

---

### Step 1.3 — Create a free database (Neon)

The app needs a **database** to store data. We use a free online database from **Neon**.

1. Go to: **https://neon.tech**
2. Click **Sign up** (you can use Google or GitHub).
3. After logging in, click **Create a project** (or **New Project**).
4. Choose a **project name** (e.g. `pak-visa`) and a **region** (pick one close to you).
5. Click **Create project**.
6. On the next screen you will see a **connection string**. It looks like:  
   `postgresql://username:password@ep-xxx.region.aws.neon.tech/neondb?sslmode=require`
7. Click **Copy** (or select and copy the whole string).  
   **Keep this string safe** — you will paste it in the next step.  
   You can also find it later in Neon: your project → **Connection details** → **Connection string**.

---

### Step 1.4 — Configure the project (environment variables)

1. **Open the project folder** (the one you extracted from the .zip).

2. Find the file **`.env.example`** in the project folder.  
   (If you don’t see it, turn on “Show hidden files” in your file explorer.)

3. **Copy** `.env.example` and **paste** it in the **same folder**.  
   **Rename** the copy to exactly: **`.env`**  
   (so you have both `.env.example` and `.env`).

4. **Open** the `.env` file with a text editor (Notepad, Notepad++, VS Code, etc.).

5. **Edit** these three lines (replace the placeholder values):

   - **DATABASE_URL**  
     Paste the long **Neon connection string** you copied in Step 1.3.  
     It should look like:  
     `DATABASE_URL="postgresql://user:password@ep-xxx.region.aws.neon.tech/neondb?sslmode=require"`

   - **ADMIN_PASSWORD**  
     Choose a password you will use to log in to the admin area.  
     Example:  
     `ADMIN_PASSWORD="MySecurePassword123"`

   - **NEXT_PUBLIC_BASE_URL**  
     For running on your computer, leave it as:  
     `NEXT_PUBLIC_BASE_URL="http://localhost:3000"`  
     (You will change this to your Vercel URL after deployment.)

6. **Save** the `.env` file and close it.

---

### Step 1.5 — Install dependencies and prepare the database

1. Open **PowerShell** (Windows) or **Terminal** (Mac).

2. **Go to the project folder** (replace the path with your actual path):  
   - **Windows (PowerShell):**  
     ```powershell
     cd C:\Users\YourName\Desktop\PAK
     ```  
   - **Mac:**  
     ```bash
     cd ~/Desktop/PAK
     ```  
   Use the real path where you extracted the project (e.g. if the folder is in Documents, use `Documents\PAK` or `~/Documents/PAK`).

3. **Install dependencies** (this may take 1–2 minutes):  
   ```bash
   npm install
   ```

4. **Create the database tables** (uses the DATABASE_URL from your .env):  
   ```bash
   npx prisma db push
   ```  
   You should see a message that the database is in sync.

---

### Step 1.6 — Run the project

1. In the **same** terminal, run:  
   ```bash
   npm run dev
   ```

2. Wait until you see a line like:  
   `- Local: http://localhost:3000`

3. **Open your browser** and go to: **http://localhost:3000**

4. You should be redirected to the **admin** page.  
   - If you see a **login** page, enter the **ADMIN_PASSWORD** you set in `.env`.  
   - After logging in you can create visas, see the list, and use the app.

5. To **stop** the project later: in the terminal press **Ctrl + C**.

---

## Part 2 — Push the project to GitHub

We assume **Git** is already installed and **connected to GitHub** (e.g. you have a GitHub account and have used Git before). We only need to create a **new empty repository** for this project and push the project folder to it.

### Step 2.1 — Check Git (optional)

In PowerShell or Terminal, type `git --version`. You should see a version number. If not, install Git from **https://git-scm.com/downloads** and ensure your GitHub account is set up.

---

### Step 2.2 — Create a new repository on GitHub

1. Go to: **https://github.com** and log in (or create an account).
2. Click the **+** (top right) → **New repository**.
3. **Repository name:** e.g. `pak-visa` or `PAK` (any name you like).
4. Choose **Private** or **Public**.
5. **Do not** check “Add a README” or “Add .gitignore” (the project already has these).
6. Click **Create repository**.
7. On the next screen you will see a URL like:  
   `https://github.com/YourUsername/pak-visa.git`  
   **Copy this URL** — you will need it in the next step.

---

### Step 2.3 — Push the project folder to GitHub

1. Open **PowerShell** or **Terminal** and go to the **project folder** (same as before):  
   ```bash
   cd C:\Users\YourName\Desktop\PAK
   ```  
   (Use your real path.)

2. **Initialize Git** (only needed once per project):  
   ```bash
   git init
   ```

3. **Add all files** (this does not upload yet):  
   ```bash
   git add .
   ```

4. **Commit** (save a snapshot):  
   ```bash
   git commit -m "Initial commit - PAK Visa project"
   ```

5. **Connect to your GitHub repo** (replace the URL with your actual repo URL from Step 2.2):  
   ```bash
   git remote add origin https://github.com/YourUsername/pak-visa.git
   ```

6. **Push** (upload to GitHub):  
   ```bash
   git branch -M main
   git push -u origin main
   ```  
   - If Git asks for **username** and **password**:  
     - Username: your GitHub username.  
     - Password: use a **Personal Access Token**, not your GitHub password.  
       To create one: GitHub → **Settings** → **Developer settings** → **Personal access tokens** → **Tokens (classic)** → **Generate new token**. Give it a name, check **repo**, then generate and copy the token. Paste it when Git asks for password.

7. **Refresh your GitHub repository page.** You should see all project files there.

---

## Part 3 — Deploy on Vercel

### Step 3.1 — Sign up and import the project

1. Go to: **https://vercel.com**
2. Click **Sign up** (you can use **Continue with GitHub**).
3. After logging in, click **Add New…** → **Project**.
4. **Import** your GitHub repository:  
   - If you see a list of repos, select the one you pushed (e.g. `pak-visa`).  
   - If you don’t see it, click **Import Git Repository** and paste your repo URL, then **Import**.

---

### Step 3.2 — Configure environment variables (important)

Before deploying, Vercel needs the same **environment variables** as your `.env` file.

1. On the Vercel “Configure Project” page, find **Environment Variables**.
2. Add these **three** variables (one by one):

   | Name                 | Value                                                                 |
   |----------------------|-----------------------------------------------------------------------|
   | `DATABASE_URL`       | Your **Neon connection string** (same as in your .env)                |
   | `ADMIN_PASSWORD`     | The same **admin password** you use locally                           |
   | `NEXT_PUBLIC_BASE_URL` | Leave **empty for now** (we set it after first deploy — see below) |

   For each variable:  
   - Enter **Name** and **Value**.  
   - Choose **Production** (and optionally Preview if you want).  
   - Click **Add** (or Save).

3. **Do not** put your real `.env` file or secrets in the repo. Only set them in Vercel’s Environment Variables.

---

### Step 3.3 — Deploy

1. Click **Deploy**.
2. Wait a few minutes. Vercel will run `npm install`, `prisma generate`, `prisma db push`, and `next build`.
3. When it finishes, you will see **Congratulations** and a link like:  
   `https://pak-visa-xxx.vercel.app`  
   **Open that link** — your app is now live.

---

### Step 3.4 — Set the production URL (so QR codes and links work)

1. **Copy** your Vercel app URL (e.g. `https://pak-visa-xxx.vercel.app`).
2. In Vercel: go to your **Project** → **Settings** → **Environment Variables**.
3. **Edit** `NEXT_PUBLIC_BASE_URL`:  
   - Set value to your full Vercel URL **with no slash at the end**, e.g.  
     `https://pak-visa-xxx.vercel.app`
4. **Save**.
5. Go to **Deployments** → open the **⋯** menu on the latest deployment → **Redeploy** (or push a small change to trigger a new deploy).  
   This makes the app use the correct URL for QR codes and links.

---

## Quick reference

| What you want to do        | Command or action                                      |
|----------------------------|--------------------------------------------------------|
| Run project locally        | `npm run dev` → open http://localhost:3000            |
| Stop local server          | In terminal: **Ctrl + C**                              |
| Push new changes to GitHub | `git add .` → `git commit -m "message"` → `git push`  |
| Redeploy on Vercel         | New push to `main` auto-deploys, or Redeploy in Vercel |

---

## Troubleshooting

- **“node” or “npm” not found**  
  Install Node.js from https://nodejs.org and restart the terminal (and computer if needed).

- **“prisma” or “prisma db push” fails**  
  Check that `.env` exists and `DATABASE_URL` is the full Neon connection string (in quotes). Run `npm install` again, then `npx prisma db push`.

- **Login page doesn’t accept password**  
  Make sure `ADMIN_PASSWORD` in `.env` (and in Vercel) matches what you type (no extra spaces).

- **Vercel build fails**  
  Ensure all three environment variables are set in Vercel (DATABASE_URL, ADMIN_PASSWORD, NEXT_PUBLIC_BASE_URL). For first deploy, NEXT_PUBLIC_BASE_URL can be your Vercel URL.

- **QR codes or links point to localhost after deploy**  
  Set `NEXT_PUBLIC_BASE_URL` in Vercel to your full Vercel URL (e.g. `https://your-app.vercel.app`) and redeploy.

---

You can share this guide with the person who will run and deploy the project, or use it step by step to assist them over WhatsApp or any chat.
