# How to build an Astro website with a self-hosted Pages CMS

This guide explains, step by step and in plain English, how to set up a content-managed website using Astro and a self-hosted Pages CMS, hosted on Cloudflare Pages.

It is written for non-developers who work with an AI coding agent (such as Claude Code, Codex, or similar). You will not need to write or read code. Each step tells you what the step is for, what to ask your AI agent to do, what you need to do yourself, and how to check that it worked.

The example used throughout is a small real estate site with properties and agents, but the same steps work for any content-driven website: a blog, a portfolio, a menu, a team directory, and so on.

**The tools involved:**

- **Astro** – the framework that turns your content into a fast, static website.
- **GitHub** – where the website's files and content live. Think of it as a shared, versioned folder in the cloud.
- **Pages CMS** – a friendly editing interface that reads and writes files directly in that GitHub folder. Self-hosted means you run it yourself on your own web address, rather than using the hosted version at pagescms.org.
- **Cloudflare Pages** – the hosting service that publishes the site to the internet and rebuilds it every time content changes.

**What you need before starting:**

- A GitHub account, and a GitHub organisation (or personal account) where the repository will live.
- A running self-hosted Pages CMS, with its GitHub App already created and installed on your organisation. Setting up the CMS itself is outside the scope of this guide.
- An AI coding agent set up on your computer, with Node.js installed (version 22 or newer). Your agent can check this for you.
- A Cloudflare account. The free plan is enough.

---

## Step 1 – Create the shared folder on GitHub and connect the CMS

**Why:** Pages CMS does not have its own database. It edits files that live in a GitHub repository (a "repo"). So the first thing you need is a repo, and the CMS must be given permission to access it.

**Ask your AI agent to:**

- Create a new, empty GitHub repository in your organisation with the name you choose.
- Turn your local project folder into a git project connected to that repository.
- Add a standard ignore list so that temporary files, build output and secrets are never uploaded.
- Make a first commit and push it, so the repository is no longer empty.

Your agent will need to be logged in to GitHub on your computer. If it is not, it will tell you how to log in.

**Do this yourself:**

Give the Pages CMS GitHub App access to the new repository. The app was installed when the CMS was set up, but it is usually configured to see "only selected repositories", so the new repo has to be added by hand:

1. Open your organisation's settings on GitHub, then go to "GitHub Apps" under "Third-party access" (or "Installed GitHub Apps").
2. Click **Configure** next to your Pages CMS app.
3. Under "Repository access", add the new repository and save.

Only an organisation owner can do this. Your AI agent cannot do it for you, because GitHub does not allow it through the normal login. If you are not an owner, ask one to do it.

**How to check it worked:**

- The repository exists on GitHub and contains at least one commit.
- When you log in to your Pages CMS, the new repository appears in the list. It will say there is no configuration yet. That is expected until a later step.

---

## Step 2 – Set up the Astro project

**Why:** Before anyone can edit content or see a website, there has to be an actual website project in the folder. This step creates that skeleton and the styling toolkit used for the rest of the build.

**The two new tools:**

- **Astro** – the website framework. It takes your content and page templates and bakes them into plain HTML files, which is what makes the finished site fast and cheap to host.
- **Tailwind CSS** – a styling toolkit that lets the agent design pages quickly and consistently.

**Ask your AI agent to:**

- Create a new Astro project inside the existing folder, using Astro's minimal starter template (no example pages), keeping the files from Step 1.
- Add Tailwind CSS using Astro's own "add" command, which installs the current recommended version.
- Configure the project as a fully static site, and set the site's web address to a placeholder for now. It can be updated once the real address is known.
- Not add the Cloudflare adapter. It is only needed for sites that build pages on demand on a server. A static site does not need it. Agents sometimes add it out of habit, so it is worth saying this explicitly.
- Check that the site builds without errors and that the local preview works.
- Remove any starter README file, then commit the result.

**How to check it worked:**

- Your agent reports a successful build.
- When the agent runs the local preview, you can open the address it gives you (usually localhost, port 4321) in your browser and see a page.

**Good to know:**

- In recent Astro versions the local preview server keeps running in the background after the agent is done with it. If something seems stuck on that port later, ask the agent to stop the Astro dev server.
- Make a note for the hosting step later: Cloudflare Pages will need the build command "npm run build" and the output folder "dist". Your agent can confirm these from the project.

**Versions used when this guide was written:** Node.js 24, Astro 7, Tailwind CSS 4. Newer versions should work the same way.

