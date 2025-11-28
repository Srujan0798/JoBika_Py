# 🛡️ Vercel Project Settings Guide

You asked to understand the Vercel settings and ensure everything is "future-proof". Here is a breakdown of the important options and how we have configured them for stability.

## 1. ✅ Build & Development Settings (The Most Important)
**Location:** Settings > Build & Development

| Setting | What it does | Our Configuration | Why? |
| :--- | :--- | :--- | :--- |
| **Framework Preset** | Tells Vercel how to build your app. | **`Other`** | We are using a custom Python setup, not a standard framework like Next.js. |
| **Build Command** | Command to compile your code. | **(Empty)** | **Zero Config**: Vercel automatically detects `requirements.txt` and installs dependencies. No custom command needed. |
| **Output Directory** | Where build artifacts go. | **(Empty)** | We don't have a build step that produces static files; we serve everything dynamically. |
| **Install Command** | Command to install dependencies. | **(Empty)** | Vercel automatically runs `pip install -r requirements.txt`. |

**Future Proofing:** By leaving these empty, we rely on Vercel's standard Python handling. If Vercel updates their build system, your app will automatically benefit without breaking custom scripts.

---

## 2. 🐍 Python Version (Crucial for Stability)
**Location:** Configured in code (`runtime.txt`)

We have created a file named `runtime.txt` with the content:
```text
python-3.11.5
```

**Why this matters:**
- Vercel defaults to the latest Python version.
- If Vercel updates to Python 3.13 or 3.14 in the future, it *could* break your app if you didn't specify a version.
- **We fixed this:** By having `runtime.txt`, we force Vercel to use Python 3.11. Your app will **always** use this version, ensuring it never breaks due to an upgrade.

---

## 3. 🔑 Environment Variables (Security)
**Location:** Settings > Environment Variables

This is where you store secrets. You should have:

| Key | Value | Purpose |
| :--- | :--- | :--- |
| `SECRET_KEY` | (Your Secret String) | Encrypts session data (login cookies). |
| `VERCEL` | `1` (Automatically set by Vercel) | We use this in `server.py` to switch to `/tmp` storage. |

**Future Proofing:**
- Never commit secrets to GitHub. Always put them here.
- If you add Supabase later, you will add `DATABASE_URL` here.

---

## 4. 🌐 General Settings
**Location:** Settings > General

- **Root Directory:** `./` (Default). This is correct because your `requirements.txt` and `vercel.json` are in the main folder.
- **Node.js Version:** Irrelevant for us (we use Python).

---

## 5. ⚡ Functions (Serverless)
**Location:** Settings > Functions

- **Region:** Defaults to Washington, D.C. (iad1).
- **Memory:** Defaults to 1024MB. This is plenty for your app.
- **Max Duration:** Defaults to 10s (Hobby) or 15s (Pro).
  - *Note:* If your job scraper takes longer than 10s, it might time out.
  - **Fix:** We made the scraper fast, but for long tasks, we use background threads (which have limitations on serverless) or cron jobs.

---

## 🚀 Summary: You are Safe!

We have configured the project code-side to override/handle the settings automatically:
1. **`vercel.json`**: Handles routing (`rewrites`).
2. **`runtime.txt`**: Locks the Python version (Stability).
3. **`requirements.txt`**: Defines dependencies.
4. **`api/index.py`**: Entry point for the server.

**You do NOT need to change anything in the Vercel Dashboard.** The defaults + our code configuration make it robust and future-proof.
