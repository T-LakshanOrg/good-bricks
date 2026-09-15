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

---

## Step 5 – Build the website pages and design

**Why:** Up to now the project has content and a CMS that can edit it, but nothing a visitor would want to look at. This step turns the content into an actual website: a home page, a page listing everything you have for sale, a page for each individual property, a page for each member of staff, and a sensible page for when somebody follows a broken link. It is also the step where the site gets a look. The important discipline here is that the design is a container and the content fills it – every heading, every phone number, every picture must come out of the content files rather than being typed into the templates, because anything typed into a template is invisible to the CMS and can only ever be changed by asking an agent again.

**Ask your AI agent to:**

- Create one shared layout that every page uses. It holds everything that is the same on every page: the page title and description that search engines and social media read, the header with your site name and navigation, and the footer with your contact details, address, social links, small print and the current year. The navigation links come from the settings file, so adding a link in the CMS adds it to every page at once.
- Build a small set of reusable pieces rather than writing each page from scratch: a property card, a person card, a section heading, and the large introductory panel at the top of the home page. Each one is written once and used in several places, so the site stays consistent and a change to a card changes it everywhere.
- Format prices properly using the currency stored with each property, so a price saved as a plain number appears as a pound figure with thousands separators. Do not let the currency symbol be typed into a template.
- Build the home page from the home settings file: the big heading, the supporting paragraph, the button and its destination, and the main image all come from there, as do the two section headings and the number of properties to show. Show featured properties first and then the newest ones, up to that number, with a link through to the full list. Below that, show everybody on the team.
- Build a page listing all properties, newest first. A simple way to let visitors narrow things down is to group the list by status and put a row of links at the top that jump to each group. That needs no clever machinery, works on a site made of plain files, and is easy to understand.
- Build a page for each individual property showing its pictures, title, full address, price, status, type, the key facts, the list of features, and the longer description written underneath the fields in the content file. Alongside all of that, show a panel for the member of staff the property is linked to, with their photograph, name, job title, phone number, email address and a link through to their own page.
- Build a page listing everybody on the team, and a page for each person showing their photograph, job title, contact details and longer biography – and underneath, a grid of every property linked to them. This is the same link as on the property page, read from the other end: one property points at one person, and that person's page finds every property pointing back.
- Hide facts that do not apply rather than printing them as zero. A building plot has no bedrooms, and "0 bedrooms" reads as a mistake.
- Add a not-found page that matches the rest of the site and offers a way back to the main sections.
- Follow a clear design brief. The one used here was: simple, clean and modern, in the manner of a good estate agency – a warm neutral palette with a single accent colour, a strong difference in size and weight between headings and body text, generous space, content laid out in card grids, and no decorative tricks. Ask for a pairing of two web fonts, one for headings and one for body text, with ordinary system fonts named as a fallback so the page still reads properly if the fonts are slow to arrive.
- Make sure it works on a phone as well as a desktop. Grids should drop from several columns to one, the header should not crowd itself, and nothing should ever be cut off at the side or force sideways scrolling.
- Build the site and confirm every page is generated – one for the home page, one for each list, one for each property, one for each member of staff, and the not-found page. Then run the site locally and look at it, at both a wide window and a narrow one, and fix anything that looks wrong.
- Commit the result.

**How to check it worked:**

- Open the local preview and click through the whole site as a visitor would: home page, the property list, a property, the agent panel on that property, that agent's page, and back to one of their properties. Every one of those links should work.
- Check that the same person appears on both sides of the link. If a property says it is being sold by a particular person, that person's page must list that property. If it does not, the link is wired one way only.
- Drag the browser window narrow, as narrow as a phone. Everything should stack into a single readable column with nothing hanging off the edge.
- Open a content file, change something obvious – a price, a heading, a phone number in the settings – and save it. The preview should update on its own within a second or two, and the change should appear everywhere that value is used. If a piece of text does not change, it was typed into a template instead of coming from content, and that is worth fixing straight away.
- Type a web address that does not exist and confirm you get your own not-found page rather than a blank error.

**Good to know:**

- A clear design brief is worth more than a long one. Two or three sentences describing the feeling you want, the kind of business it is for, and anything you definitely do not want will get you much further than a list of adjectives. Naming two or three real websites you admire helps enormously, because the agent can describe what those sites actually do and apply the same thinking rather than guessing at your taste.
- A shared layout is the single biggest labour saver on the whole site. The header and footer exist in exactly one file, so changing the footer changes it on every page, including pages that do not exist yet.
- Keep fixed wording out of the templates. It is very easy for an agent to type a section heading straight into a page because it is quicker, and equally easy for you not to notice until the day somebody wants to reword it and finds no box for it in the CMS. Anything an editor might plausibly want to change belongs in a content file, and the settings files exist precisely for the odd sentences that belong to no collection.
- The placeholder pictures are only there so the layout has something to hold. Every one of them can be replaced through the CMS by uploading a real photograph, with no involvement from an agent and no change to the code.
- Navigation links point wherever you tell them to, including at pages that do not exist yet. The sample navigation here includes a lettings link and a contact link with no pages behind them, so they land on the not-found page. That is harmless while you are building, but worth either building or removing before anyone else sees the site.
- Ask for the list of pages the build produced and read it. It is the quickest way to spot that a whole section quietly failed to generate, and it takes five seconds.

---

## Step 6 – Put the site online with Cloudflare

**Why:** Everything so far has run on one computer. The website exists, the CMS can edit it, but nobody else can see any of it. This step puts the site on the internet on Cloudflare's network, and – more importantly – wires it up so that it rebuilds itself. That second part is what makes the CMS actually useful. When somebody edits a property in the CMS, the CMS saves that change to GitHub. Something then has to notice the change, rebuild the site from the new content, and publish the result. If nobody sets that up, every edit made in the CMS sits in GitHub doing nothing until a person runs a build by hand, which defeats the whole point.

One thing worth knowing before you start, because Cloudflare's own documentation is in the middle of changing on this point. Cloudflare has two products that can host a website: Pages, which is the older one, and Workers, which is the newer one. Pages still works and is not being switched off, but Cloudflare now tells people to start new projects on Workers, and all new features are going there. Astro's own deployment guide says the same thing. So this site is hosted as a Worker. It is still a plain static site – the Worker does nothing except hand out the pages that were built ahead of time.

**Ask your AI agent to:**

- Add a Cloudflare configuration file at the top level of the project. It needs a name for the project, a compatibility date set to the day you set it up, and a setting pointing at the folder the build produces – for this kind of site that is the dist folder. It should also say to serve your own not-found page when a visitor asks for an address that does not exist, otherwise they get Cloudflare's blank one instead of the nice one you built in step 5.
- Install the Cloudflare command line tool as a project dependency rather than relying on whatever version happens to be available. Cloudflare's build service reads the version from your project file, so pinning it here means the version that builds your site online is the same one that was tested locally.
- Add a small file recording which version of Node the project needs. Cloudflare's build machines currently default to Node 24, which is what this project uses, so in practice this changes nothing today – but it stops your site breaking silently on the day Cloudflare changes its default.
- Build the site and publish it once from the command line. This creates the project on your Cloudflare account and gives you a live address immediately, so you can see the site working before you touch the dashboard. The address is your project name followed by your Cloudflare subdomain and then workers.dev.
- Update the site address in the Astro configuration file to the real live address, replacing whatever placeholder was there from step 1. Some of what the site produces for search engines and social media needs the full address to be correct.
- Check the live site, not just the local one: the home page, a list page, an individual property page, and a deliberately wrong address to confirm the not-found page appears.
- Commit the result.

**Do this yourself:** The publishing from the command line above is a one-off push. It does not connect anything to GitHub, so it will not repeat itself when the CMS saves an edit. Connecting the repository can only be done in Cloudflare's dashboard, and it is the step that makes the whole thing automatic. It takes about two minutes.

1. Sign in to the Cloudflare dashboard and choose Workers & Pages from the menu on the left.
2. In the list, click the project your agent just published. It will be there under the name from the configuration file.
3. Go to Settings, then Build, and click Connect.
4. Choose GitHub as the provider. The first time you do this, Cloudflare asks to install its GitHub app on your account or organisation. Approve it, and when it asks which repositories it may see, either allow all of them or pick just this one. If the repository belongs to an organisation rather than your personal account, and you are not an owner of that organisation, GitHub will send the request to an owner for approval and nothing will work until they approve it. Chase that before assuming something is broken.
5. Pick your repository from the list.
6. Set the production branch to main, or whichever branch your CMS saves to.
7. Set the build command to the npm build command for the project, and leave the deploy command at Cloudflare's default, which publishes the Worker. Leave the root directory empty unless the site lives in a sub-folder of the repository.
8. If you did not add the Node version file to the project, add a build variable here instead, named NODE_VERSION, with the value 24. Note that build variables live under Settings, Build – they are a different list from the variables under Settings, Variables and Secrets, which are for code running on the live site and are not read during the build.
9. Save. Cloudflare will run a build straight away.

One thing that catches people out: the project name shown in the Cloudflare dashboard must match the name written in the configuration file in the repository. If those two disagree, every build fails with a confusing error. If you ever rename one, rename the other.

**How to check it worked:**

- Open the live address in a browser. The home page should load, and clicking through to a property and to a member of staff should work exactly as it did locally.
- Go to your CMS, make a small and obvious edit to a property – change a price, or a headline – and save it.
- Go back to the Cloudflare dashboard, to your project, and look at the builds list. Within a few seconds a new build should appear and start running. Watch it go green.
- Refresh the live site and confirm your edit is there. If it is, the whole chain is working: CMS saves to GitHub, GitHub tells Cloudflare, Cloudflare rebuilds and publishes. From this point on, nobody needs to run a command to change the website.
- Type a web address that does not exist and confirm you still get your own not-found page rather than a blank Cloudflare error.

**Good to know:**

- Every commit to your production branch triggers a build, whether it came from the CMS or from an agent working on the code. There is no way to make a small content change without a rebuild, and that is fine – it is how the whole thing is designed.
- Builds take a minute or two. An editor who saves a change and immediately refreshes the live site will not see it yet. This is the single most common cause of someone thinking the CMS is broken. Tell your editors to wait a couple of minutes.
- The free plan is generous for a site like this – visitors reading static pages are not charged, and the free plan includes a monthly allowance of builds that a small site will not come close to using. You do not need to enter card details to get a site online.
- The workers.dev address is real and permanent, but it is not what you want on a business card. A custom domain can be added later, at any point, without rebuilding anything, from the same project settings. Be aware that a custom domain on a Worker has to use Cloudflare's own nameservers, so the domain needs to be moved to Cloudflare first.
- Commits to branches other than your production branch get built too, and produce their own separate preview address that leaves the live site untouched. That is a good way to try something risky without anyone noticing.
- Cloudflare's own naming is genuinely confusing at the moment. The dashboard menu says Workers & Pages, the documentation talks about Pages in a lot of older pages, and plenty of guides written a year or two ago will tell you to create a Pages project. Both products exist and both work. This site is a Worker. If you are following someone else's instructions and they tell you to click something you cannot find, check first whether they were writing about Pages.
