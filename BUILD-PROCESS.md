# How the Good Bricks website was built

This document explains, step by step and in plain English, how the Good Bricks real estate website was built. It is written so that anyone can follow along, even without a technical background.

**What we are building:** A website for a fictional real estate business called Good Bricks. It shows properties for sale and the agents who sell them. The content (properties, agents, home page text) is managed through a content editor called Pages CMS, so nobody needs to touch code to update the site.

**The tools involved:**

- **Astro** – the framework that turns our content into a fast, static website.
- **GitHub** – where the website's files and content live. Think of it as a shared, versioned folder in the cloud.
- **Pages CMS** – a friendly editing interface that reads and writes files directly in the GitHub folder. Ours is self-hosted at https://cms.testmywork.xyz.
- **Cloudflare Pages** – the hosting service that publishes the site to the internet and rebuilds it every time content changes.

---

## Step 1 – Create the shared folder on GitHub and connect the CMS

**Why:** Pages CMS does not have its own database. It edits files that live in a GitHub repository (a "repo"). So the first thing we need is a repo, and the CMS must be allowed to access it.

**What was done:**

1. Created a new public repository called `good-bricks` inside the `T-LakshanOrg` organisation on GitHub. Address: https://github.com/T-LakshanOrg/good-bricks
2. Turned the local project folder on the computer into a git project and pointed it at that GitHub repo, so files can be pushed up to it.
3. Checked that the Pages CMS GitHub App (called `pages-cms-testmywork`) is installed on the organisation. It is, but it is set to "only selected repositories", so the new repo must be added to its list.

**Action needed by the site owner (could not be done automatically):**

The account used here does not have permission to change the app's repository list. An organisation owner should:

1. Go to https://github.com/organizations/T-LakshanOrg/settings/installations
2. Click **Configure** next to `pages-cms-testmywork`.
3. Under "Repository access", add `good-bricks` and save.

Once that is done, the repo will appear in the Pages CMS dashboard at https://cms.testmywork.xyz.


---

## Step 2 – Set up the Astro project

**Why:** The shared folder from Step 1 was empty apart from notes. Before anyone can edit content or see a website, there has to be an actual website project in that folder — the skeleton that turns content into web pages. This step creates that skeleton and the styling toolkit we will use for the rest of the build.

**The two new tools:**

- **Astro** – the website framework: it takes our content and page templates and bakes them into plain, ready-made HTML files, which is what makes the finished site fast and cheap to host.
- **Tailwind CSS** – a styling toolkit that lets us design pages by adding small, descriptive labels (like `text-3xl` for "large text") directly to page elements, instead of writing separate stylesheet files.

**What was done:**

1. Created a new Astro project using the "minimal" starter — a deliberately bare template with no example pages to delete later, since Step 3 will add our own content and pages.
2. Moved that project into the existing folder, keeping this document and the existing ignore list intact, and merged in the extra ignore entries the Astro starter suggested.
3. Added Tailwind CSS (version 4) using Astro's own `astro add tailwind` command, and imported its stylesheet on the home page so the styling is actually switched on.
4. Set two options in the project's configuration file (`astro.config.mjs`): the site is built as a fully static set of files, and a placeholder web address is recorded for it.
5. Replaced the starter's placeholder home page with a simple "Good Bricks" page, used only to prove that the framework and the styling are both working. Real pages come in a later step.
6. Checked that the site builds successfully and that the local preview server starts and serves the page.

**Commands run:**

```bash
# Create the Astro project (minimal template, install dependencies, no new git repo)
npm create astro@latest good-bricks -- --template minimal --install --no-git --no-ai --skip-houston --yes

# Add Tailwind CSS
npx astro add tailwind --yes

# Check it builds, and that the local preview works
npm run build
npm run dev
```

**Versions used:** Node.js v24.18.1, Astro 7.3.2, Tailwind CSS 4.3.3 (with the `@tailwindcss/vite` plugin 4.3.3).

**Decisions worth noting:**

- **No Cloudflare adapter.** Astro offers an add-on called `@astrojs/cloudflare`, and it is easy to assume it is required when hosting on Cloudflare. It is not. That adapter exists for sites that build pages on the fly, on a server, each time a visitor asks for one. Good Bricks is the opposite: every page is built ahead of time, so Cloudflare Pages simply serves finished files. Adding the adapter would add complexity for no benefit, so it was left out.
- **Building into a folder that was not empty.** Astro's project creator insists on an empty folder, but ours already held this document and the git history. So the project was created in a temporary folder and then moved in, which preserved everything from Step 1.
- **No TypeScript setting was chosen.** Older guides show a `--typescript strict` option. Current Astro removed it and applies the strict setting to every new project automatically, which is what we wanted anyway.
- **The placeholder web address** is set to `https://good-bricks.pages.dev` — the default address Cloudflare Pages will give us. It should be updated if the site later moves to a custom domain.
- **For the later hosting step:** Cloudflare Pages will need its build command set to `npm run build` and its output directory set to `dist`. Because this project was built with Node.js 24, Cloudflare may also need a `NODE_VERSION` setting to match.
