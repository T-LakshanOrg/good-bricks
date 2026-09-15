# How to build an Astro website with a self-hosted Pages CMS

This guide explains, step by step and in plain English, how to set up a content-managed website using Astro and a self-hosted Pages CMS, hosted on Cloudflare Pages. It is written so that anyone can follow along, even without a technical background.

The example used throughout is a small real estate site with properties and agents, but the same steps work for any content-driven website: a blog, a portfolio, a restaurant menu, a team directory, and so on.

**The tools involved:**

- **Astro** – the framework that turns your content into a fast, static website.
- **GitHub** – where the website's files and content live. Think of it as a shared, versioned folder in the cloud.
- **Pages CMS** – a friendly editing interface that reads and writes files directly in that GitHub folder. Self-hosted means you run it yourself on your own web address, rather than using the hosted version at pagescms.org.
- **Cloudflare Pages** – the hosting service that publishes the site to the internet and rebuilds it every time content changes.

**What you need before starting:**

- A GitHub account, and a GitHub organisation (or personal account) where the repository will live.
- A running self-hosted Pages CMS instance, with its GitHub App already created and installed on your organisation. (Setting up the CMS itself is outside the scope of this guide; see the Pages CMS documentation for that.)
- Node.js version 22 or newer installed on your computer.
- A Cloudflare account (free plan is fine).

Wherever this guide says `YOUR-ORG`, `YOUR-REPO`, `YOUR-CMS-URL` or `your-cms-app`, substitute your own values.

---

## Step 1 – Create the shared folder on GitHub and connect the CMS

**Why:** Pages CMS does not have its own database. It edits files that live in a GitHub repository (a "repo"). So the first thing you need is a repo, and the CMS must be given permission to access it.

**What to do:**

1. Create a new repository on GitHub, for example `YOUR-ORG/YOUR-REPO`. Public or private both work. Leave it empty (no README) so the next step has a clean folder.
2. On your computer, create an empty project folder, turn it into a git project, and point it at that repo:

   ```bash
   git init -b main
   git remote add origin https://github.com/YOUR-ORG/YOUR-REPO.git
   ```

3. Add a `.gitignore` file so build output and secrets are never uploaded. A good starting point:

   ```
   node_modules/
   dist/
   .astro/
   .env
   .env.*
   .DS_Store
   ```

4. Give the Pages CMS GitHub App access to the new repo. The app was installed when the CMS was set up, but it is often configured to see "only selected repositories", so the new repo has to be added:
   - Go to `https://github.com/organizations/YOUR-ORG/settings/installations` (or `https://github.com/settings/installations` for a personal account).
   - Click **Configure** next to your Pages CMS app.
   - Under "Repository access", add the new repo and save.

   Only an organisation owner can do this. If you are not an owner, ask one to do it for you.

5. Make a first commit and push it, so the repo is no longer empty:

   ```bash
   git add -A
   git commit -m "Initial commit"
   git push -u origin main
   ```

**How to check it worked:** Log in to your CMS at `YOUR-CMS-URL`. The new repo should appear in the list of repositories you can open. It will say there is no configuration yet, which is expected until a later step.

---

## Step 2 – Set up the Astro project

**Why:** Before anyone can edit content or see a website, there has to be an actual website project in the folder. This step creates that skeleton and the styling toolkit used for the rest of the build.

**The two new tools:**

- **Astro** – the website framework. It takes your content and page templates and bakes them into plain HTML files, which is what makes the finished site fast and cheap to host.
- **Tailwind CSS** – a styling toolkit that lets you design pages by adding small descriptive labels (like `text-3xl` for "large text") directly to page elements, instead of writing separate stylesheet files.

**What to do:**

1. Create a new Astro project using the "minimal" starter. This is a deliberately bare template with no example pages to delete later.

   Astro's project creator insists on an empty folder. Because your folder already contains `.gitignore` and git history, create the project in a temporary folder first, then move its contents into your project folder:

   ```bash
   # Run this one level above your project folder, or in a temporary location
   npm create astro@latest temp-site -- --template minimal --install --no-git --yes

   # Move everything (including hidden files) into your project folder, then remove the temp folder
   rsync -a temp-site/ /path/to/YOUR-REPO/
   rm -rf temp-site
   ```

   If the starter includes its own `.gitignore`, merge its entries with yours rather than replacing the file.

2. From inside the project folder, add Tailwind CSS:

   ```bash
   npx astro add tailwind --yes
   ```

   This installs Tailwind version 4 as a Vite plugin (the current recommended method) and creates `src/styles/global.css`. Make sure that stylesheet is imported by your pages or layout, otherwise the styling is not switched on.

3. Open `astro.config.mjs` and set two options:

   ```js
   export default defineConfig({
     output: 'static',
     site: 'https://YOUR-REPO.pages.dev', // placeholder, update when you know the real address
     vite: { plugins: [tailwindcss()] },
   });
   ```

   `output: 'static'` means every page is built ahead of time as a finished file. `site` is your public web address, used for things like sitemaps and social sharing links.

4. Check that the site builds and that the local preview server works:

   ```bash
   npm run build
   npm run dev
   ```

   Open the address shown (usually `http://localhost:4321`) in a browser. You should see the starter page.

5. Commit the result:

   ```bash
   git add -A
   git commit -m "Scaffold Astro project with Tailwind"
   ```

**Versions used when this guide was written:** Node.js 24, Astro 7.3, Tailwind CSS 4.3. Newer versions should work the same way.

**Decisions worth noting:**

- **No Cloudflare adapter.** Astro offers an add-on called `@astrojs/cloudflare`, and it is easy to assume it is required when hosting on Cloudflare. It is not. That adapter exists for sites that build pages on the fly on a server for each visitor. A static site is the opposite: every page is built ahead of time, so Cloudflare Pages simply serves finished files. Adding the adapter would add complexity for no benefit.
- **No TypeScript flag.** Older guides show a `--typescript strict` option. Current Astro removed it and applies the strict setting to every new project automatically.
- **Stopping the dev server.** In recent Astro versions the dev server keeps running in the background. Use `npx astro dev stop` to stop it, rather than just closing the terminal.
- **For the later hosting step:** Cloudflare Pages needs its build command set to `npm run build` and its output directory set to `dist`. If your local Node.js version is newer than Cloudflare's default, you may also need to set a `NODE_VERSION` environment variable to match.

