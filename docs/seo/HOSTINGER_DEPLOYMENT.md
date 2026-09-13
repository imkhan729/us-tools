# Hostinger Deployment Guide for USOnlineTools

This document provides step-by-step instructions for deploying the updated static SEO build to Hostinger via **Hostinger Git** or **File Manager / FTP**.

---

## 1. Primary Deployment Method: Hostinger Git (Recommended)

Hostinger's built-in Git deployment pulls directly from the `hostinger-deploy` branch into your website's `public_html`.

### Step 1: Open Hostinger hPanel
1. Log in to [Hostinger hPanel](https://hpanel.hostinger.com).
2. Select your hosting plan for **usonlinetools.com**.
3. Under the **Advanced** section in the left sidebar, click on **Git**.

### Step 2: Configure Git Repository (or Auto-Deploy)
- **Repository**: `https://github.com/imkhan729/us-tools.git`
- **Branch**: `hostinger-deploy`
- **Install Path**: `public_html` (ensure it targets the root of public_html)

### Step 3: Trigger Deployment
- If the repository is already connected: Click **Deploy** / **Pull** on the `hostinger-deploy` branch to fetch commit `cd2bb51`.
- If creating a new connection: Click **Create** and wait for Hostinger to complete the clone and deployment.

---

## 2. Alternative Method: Manual Upload via File Manager / FTP

If you prefer direct file upload:
1. Open **File Manager** in hPanel.
2. Navigate to `domains/usonlinetools.com/public_html/`.
3. Upload all files and folders located **inside** the local `hostinger-public/` directory:
   - `.htaccess`
   - `index.html`
   - `404.html`
   - `robots.txt`
   - `sitemap.xml` and all 18 sub-sitemaps (`sitemap-*.xml`)
   - `llms.txt` and `llms-full.txt`
   - `ads.txt`
   - `assets/` folder
   - All 430 static category and tool directories (`math/`, `finance/`, `construction/`, etc.)

> **IMPORTANT**: Make sure the hidden file `.htaccess` is uploaded to the root of `public_html` to enable document root rewriting and avoid root 404 errors.

---

## 3. Post-Deployment Verification Checklist

Once deployed in Hostinger, verify the live endpoints:
- [ ] Root Homepage: `https://usonlinetools.com/` returns **200 OK** (not 404).
- [ ] Robots File: `https://usonlinetools.com/robots.txt` returns **200 OK**.
- [ ] Master Sitemap: `https://usonlinetools.com/sitemap.xml` returns **200 OK** and lists 18 sub-sitemaps.
- [ ] Canonical URLs: `https://usonlinetools.com/math/online-percentage-calculator` renders interactive calculator and returns **200 OK**.
- [ ] Direct 301 Redirects: `https://usonlinetools.com/percentage-calculator` redirects with 301 to `/math/online-percentage-calculator`.
- [ ] 404 Error Handling: Non-existent paths return custom 404 page with `noindex`.

---

## 4. Rollback Instructions

If any server-side anomaly occurs:
1. In Hostinger Git: Switch branch or reset to previous commit `0a8cafe` and click **Deploy**.
2. Alternatively, restore your most recent Hostinger daily backup via **hPanel $\rightarrow$ Files $\rightarrow$ Backups**.
