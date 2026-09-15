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

---

## Step 3 – Define the content structure

**Why:** Before a CMS can offer someone a tidy form to fill in, the website has to agree on what its content actually is. This step writes that agreement down: which kinds of content the site has, what fields each one has, and which of those fields are required. Astro then checks every content file against those rules each time the site is built, so a missing price or a misspelled status is caught immediately rather than showing up as a blank space on the live site.

**Two words worth knowing:**

- A **collection** is a group of content items that all share the same shape. For example, properties and agents would be two collections: many properties, all with the same fields, and many agents, all with the same fields. Each item is one file in a folder.
- **Frontmatter** is the block of fields at the very top of a content file, above the main text. It holds the structured facts – title, price, date, and so on – while the text underneath holds the longer description. When someone edits an item in the CMS, the boxes on the form are the frontmatter fields, and the big text area at the bottom is the text below it.

**Ask your AI agent to:**

- Create a content configuration file that defines your collections, and for each one, list every field with its kind: plain text, number, true/false, date, a list of items, or a fixed set of choices. For example, a property's status could be limited to for sale, sold, under offer or to let, which means the CMS shows a dropdown instead of a free text box, and nobody can invent a fifth option by accident.
- Mark which fields are required and which are optional, and give sensible defaults where one makes sense, such as the currency or the number of items to show on the home page.
- Set up a link from one collection to another where it makes sense – for example, each property recording which agent is selling it. In the editing interface this appears as a dropdown listing the agents, and the property file simply stores which agent was chosen. Ask the agent to make the site tolerant about the exact form of that stored value, because the CMS can be configured to save either the agent's file name or its full location, and the site should accept either.
- Add one or two settings files for the things that are not a collection at all but still need editing – the site name, contact details, navigation links, footer text, and the wording of the home page. These are single files with their own set of fields, and the CMS will present each as one page of settings rather than a list.
- Put all images in a public media folder, organised into sub-folders such as one for property photos, one for staff portraits, and one for general site imagery.
- Store image paths in content as web addresses beginning with a slash and the media folder name, not as locations on disk. This is the form the CMS writes when it uploads a picture, and the form a browser needs to display one.
- Generate simple neutral placeholder images so that every property and every agent has a picture from the start. These are only stand-ins for the real photographs and can be replaced through the CMS later.
- Create realistic sample content: a handful of items in each collection, covering the different statuses and types, with a few marked as featured, each linked to one of the people, and with some people having more than one item. Sample content is not filler – it is how you find out whether the fields you chose are the right ones before anybody starts typing real content.
- Fill in the settings files, then build the site and confirm it passes without complaints.
- Make a very simple temporary home page that lists each item with the name of the linked person next to it, purely to prove the link between the two collections works. A later step replaces it with the real design.
- Commit the result.

**How to check it worked:**

- Your agent reports a successful build with no content errors.
- The temporary home page lists every sample item, and each one shows the name of the person it is linked to. If the links were wrong, the names would be missing.
- Opening one of the content files shows a readable block of fields at the top and ordinary text underneath. It should look like something a person could edit by hand, because that is exactly what the CMS will be writing.

**Good to know:**

- Getting the field names right now saves real work later. The CMS configuration in the next step is essentially a second description of these same fields, written for the editing interface rather than for the website, and the two have to agree. Keep the names short, lowercase and descriptive.
- A fixed set of choices is nearly always better than a free text box for anything the site will filter or sort by. Free text invites typos, and a typo silently breaks a filter.
- Images live in the public folder rather than alongside the content because the CMS uploads them to a folder in the repository and writes a plain web address into the content. Keeping that folder public means the address the CMS writes is the address the browser can actually load, with nothing in between to go wrong.
- Dates are worth storing even when nothing displays them yet. They are what lets the site show newest items first.
- If you later decide a collection needs another field, adding it is straightforward – but removing or renaming one after people have written content is not, because existing files will no longer match. Spend a few extra minutes on the field list now.

---

## Step 4 – Describe the content to the CMS

**Why:** Step 3 told the website what its content is. The CMS cannot read that. It needs its own description of the same thing, written for the editing interface: which collections to show in the sidebar, what each form field is called, whether a field is a dropdown or a date picker or a picture chooser, and where uploaded images should go. That description lives in one configuration file at the top level of the repository. Get it right and someone who has never seen the project can open the CMS and edit the site sensibly on their first afternoon. Get it wrong and they see a wall of blank text boxes, or the site stops building because the CMS saved something the website does not accept.

**Ask your AI agent to:**

- Look up the current documentation for the CMS configuration file before writing anything. The available field types and their settings change between versions, and a configuration written from memory is the most common reason the CMS refuses to load a repository.
- Create the configuration file at the top level of the repository, and set the media section first: the folder inside the repository where uploaded pictures are saved, and the public web address they should be written as. These are two different things and both have to match what the website expects.
- Describe each collection from step 3 in turn, using exactly the same field names. Where a field is a fixed set of choices, list the choices with the exact stored value and a readable label next to it, so the editor sees "Under offer" while the file still stores the machine-friendly version.
- Use the right kind of field for each one rather than defaulting to text: numbers for prices and room counts, a true/false switch for the featured flag, a date picker for the publication date, a picture chooser for the main image, a picture chooser that accepts several images for a gallery, and a repeatable text field for the list of key features.
- Set up the link between the two collections as a reference field pointing at the people collection, so the editor gets a dropdown. Ask specifically that the dropdown shows each person's real name rather than their file name, and that what gets saved is the same form the website was told to accept in step 3.
- Describe the settings files too. They are single files rather than lists, so each becomes one page of settings, and any repeating groups inside them – navigation links, social links – need describing as repeatable groups with their own inner fields.
- Mark the required fields as required, copy across the default values from step 3, and add a short plain-English note to any field where an editor might reasonably guess wrong, such as which unit a floor area is in.
- Check the configuration against the content structure from step 3 and against the sample content, rather than by eye: every field named in one should appear in the other, and every choice in every dropdown should match exactly. Then build the site again to confirm nothing has broken.
- Commit the result.

**Do this yourself:**

Log in to your self-hosted CMS and open the repository. You will only see it if the CMS's GitHub App was given access to it back in step 1 – if the repository is missing from the list, that is where to look first, not at the configuration file.

Once it opens, check that the collections and the settings pages appear in the sidebar with the labels you expected. Open one property. Confirm the dropdowns offer the right choices, that the date field shows a calendar, and that the main image shows a preview of the existing picture rather than a broken box. Open the agent dropdown and confirm it lists your people by name. Save the item without changing anything, and confirm the CMS accepts it.

**How to check it worked:**

- The CMS opens the repository without an error banner. If the configuration file has a problem, the CMS says so on the way in and names the part it could not understand.
- Every collection and every settings page from step 3 is present, and nothing extra is.
- Opening an existing item shows all of its content already filled in. If a field comes up empty when the file clearly has a value in it, the name in the configuration does not match the name in the content – that is the single most common mistake at this step.
- Images preview, and the agent dropdown lists people by their names.
- The site still builds after you save an item through the CMS.

**Good to know:**

- The configuration file must sit at the very top level of the repository, not inside a sub-folder, and it applies to the branch it is on. It is read fresh every time the CMS opens the repository, so a change to it takes effect immediately – there is no redeploy and no restart involved.
- It has to mirror the content structure from step 3 exactly. The two files are describing the same content to two different audiences, and neither one can compensate for a mistake in the other. Any time you add or rename a field later, you are editing both.
- The two media settings are easy to confuse. One is where the file is stored inside the repository, the other is the address written into the content so a browser can load it. They are deliberately different, and they must both be right or pictures will upload successfully and then fail to display.
- Dropdowns are worth the extra few lines. The stored value stays short and machine-friendly, the editor sees ordinary English, and nobody can type a fifth status that the website has never heard of.
- Short field descriptions are cheap to write and save a surprising number of questions later. They appear under the field in the editing form.
