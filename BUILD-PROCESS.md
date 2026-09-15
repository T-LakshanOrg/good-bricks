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

