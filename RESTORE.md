# How to get the website back from a backup

This guide is the companion to BACKUPS.md. That one explains how backups are made. This one explains what to do on the day you need them, in plain English, one step at a time.

Every step here was tested for real: the website repository was deleted on purpose and brought back from its backup, following exactly these steps.

## Before you start

You need to be able to sign in to three places:

- **Cloudflare**, where the backups are stored and where the website is hosted.
- **GitHub**, where the repository lives.
- **Pages CMS**, as an administrator.

You also need the password manager entry for the backup key. And you need an AI coding agent, or a person comfortable with git, for one step in the middle. Everything else is clicking through dashboards.

## Part 1: The website repository

Use this part when the website's GitHub repository is deleted, damaged, locked, or its history has been wiped.

**First, check GitHub's own bin.** GitHub keeps a deleted repository for 90 days. Sign in, open your settings, and look under Deleted repositories. If it is there, press Restore and you are done. Nothing else in this guide is needed. Only carry on if it is not there, or if the repository exists but its contents are wrong.

**What you will see while the repository is gone.** The live website keeps working. Cloudflare holds the last build and serves it, so visitors notice nothing. The CMS still lists the site, but opening it shows "Access denied. You do not have permission to access this repository." Nobody can edit until the repository is back.

### Step 1: Download the backup

1. Sign in to Cloudflare and open R2 Object Storage, then the backups bucket.
2. Open the sites folder, then the folder with the website's name.
3. Download the newest file. The date and time are in its name. Put it somewhere easy to find, such as your Downloads folder.

### Step 2: Unpack the backup

Ask your AI agent to unpack the backup file into a new folder and check it. This is the one step that needs git. The agent will:

1. Turn the backup file into a normal project folder. This is a single git command; the file contains every commit, so the folder comes out with the full history.
2. Check the latest commit matches the last thing anyone saved, and that the main branch is there.
3. Build the website from the folder. If the build succeeds, the backup is complete and nothing is missing.

In the test, the folder came out with all eighteen commits, the same latest commit that was on GitHub before deletion, and the site built cleanly.

### Step 3: Put it back on GitHub

Your agent can do this whole step. It creates a new, completely empty repository on GitHub with the same name and owner as before, then pushes the unpacked folder into it. Within a minute the repository is back online with its full history.

If you prefer to create the repository yourself: on GitHub, choose New repository under the same organisation, give it the old name, keep the same visibility, and leave every option unticked. No README, no licence. It must be empty, or the push will be refused.

The repository is back, but nothing is connected to it yet. GitHub thinks of it as a brand-new repository, and so does everything that was linked to the old one. The next steps reconnect each of them.

**What the CMS does on its own.** As soon as the repository is back, administrators who sign in to the CMS with GitHub can open the site again, with no reconnecting. That is because the CMS uses their own GitHub access, and they can already reach the new repository. Collaborators cannot. The CMS forgets a site's collaborators the moment its repository is deleted, so the list comes back empty and each of them sees Access denied until they are invited again. Step 5 covers that.

### Step 4: Reconnect the hosting

The website is hosted as a Cloudflare Worker, and the Worker was linked to the old repository. The Worker itself, its address, and its custom domain are untouched. Only the link needs redoing.

1. In Cloudflare, open Workers & Pages and click the website's Worker. Go to Settings, then Builds.
2. You will see a warning about an internal issue with the Git installation, and the old repository still named. This is expected: Cloudflare is pointing at a repository that no longer exists.
3. Write down the build settings shown on this page. In the test they were: build command `npm run build`, deploy command `npx wrangler deploy`, production branch `main`, root directory `/`.
4. Click Disconnect.
5. Click Connect. If the organisation that owns the repository is not offered, choose to add a new GitHub connection and pick the organisation. GitHub then asks which repositories Cloudflare may see. Tick the restored repository and confirm. The new repository has a new identity, so it has to be granted again even though the name is the same.
6. Back in Cloudflare, pick the repository, the production branch, and enter the build settings from step 3. Click Connect.
7. Nothing builds yet. Cloudflare builds when the next commit is pushed. Either save something in the CMS, or ask your agent to push a small change. Watch the build in the Worker's Deployments tab. When it goes green, the hosting is reconnected.

In the test, the first push after reconnecting built green within two minutes, and the live address served the site as before.

### Step 5: Reconnect the CMS

The CMS has its own GitHub App, and that app was granted the old repository. It has to be granted the new one, even though the name is the same. Until then, opening the site in the CMS may work for administrators, but saving fails with the message "Resource not accessible by integration".

1. On GitHub, open the organisation's settings and go to GitHub Apps under Third-party access. The app is the one named after your CMS.
2. Click Configure next to it.
3. Under Repository access, tick the restored repository and save.
4. Back in the CMS, open the site and save a small edit to a page. The save should go through, a commit should appear on GitHub, and Cloudflare should rebuild the site within a couple of minutes. Check the live page shows the change. If it does, the whole chain works again: CMS to GitHub to Cloudflare.
In the test, an administrator's save failed with that exact message until the app was granted the repository. Straight after, the save went through, Cloudflare built within two minutes, and the live home page showed the new heading.

5. In the CMS, open the site's Collaborators tab and invite each collaborator again. The list was emptied when the repository was deleted. This is why the backup guide suggests keeping a note of who has access.

In the test, the re-invited collaborator got no email, because their account already existed. Access was immediate. They could open the site and save an edit, which appeared on GitHub as a commit made by the CMS's app and was live on the website two minutes later.

### Step 6: Reconnect the backups

The three secret values that let the weekly backup sign in to the storage bucket were stored on the old repository, so they are gone.

1. On GitHub, open the repository's Settings, then Secrets and variables, then Actions.
2. Add the three secrets again. Their names are listed at the top of the backup workflow file in the repository, and their values are in the password manager.
3. In the CMS, press Back up now. On GitHub, under Actions, the run should pass and a new file should appear in the bucket. From then on, the weekly backups carry on as before.

In the test, the first press failed because the secrets were still missing, and the second failed because the account id had been pasted with the whole web address around it. The third press passed and a new file appeared in the bucket. Failed runs stay in the Actions list; they are harmless.

One lesson from the test: the secret values cannot be read back out of GitHub once saved. In the test they had not been kept in the password manager, and had to be copied from the database backup helper on the hosting platform, which uses the same key. Keep them in the password manager from the start.

### What came back on its own, and what had to be redone

Came back with the backup file:

- Every page, image, and setting, and the full edit history.
- The website code, the CMS configuration, and the backup workflow.
- Administrator access in the CMS, for anyone who signs in with GitHub and belongs to the organisation.

Had to be redone by hand:

- The link from the Cloudflare Worker to the repository.
- The CMS's GitHub App access to the repository.
- The list of collaborators in the CMS.
- The three backup secrets on GitHub.
- Any GitHub collaborators on the repository itself.

Nothing on the live website changed at any point. Visitors saw the site throughout.

