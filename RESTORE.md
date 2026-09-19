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

## Part 2: The CMS software repository

Use this part when the repository that holds the CMS's own code is deleted or damaged. This was also tested for real.

**Not urgent.** The CMS keeps running. The hosting platform keeps the last build it made and serves it. Nobody notices until the CMS next needs to be redeployed, which only happens when the code changes.

**No GitHub bin for this one.** The CMS repository is a fork of the public Pages CMS project, and GitHub does not keep deleted forks for restoring. The backup file is the only way back. The fallback, if the backup were ever unusable, is to fork the public project again and re-add the backup workflow file.

**What you will see while it is gone.** The CMS works as normal. In Railway, the CMS service's Settings page still names the old repository, with a "Could not load branches" error underneath.

### Step 1: Download and unpack the backup

Same as Part 1, but from the cms folder in the bucket. Ask your agent to unpack it and check it. In the test, the file came out with all five branches, all 51 tags, and 493 commits on main, matching what was on GitHub before deletion.

### Step 2: Put it back on GitHub

Same as Part 1: your agent creates an empty repository with the old name and pushes everything, including every branch and tag. One difference: the restored repository is a plain repository, not a fork. The Sync fork button on GitHub is gone. Upstream updates are still possible; your agent pulls them from the public project with git instead.

### Step 3: Reconnect Railway

Railway builds and runs the CMS from this repository, so it needs the new one.

1. In Railway, open the CMS service, then Settings. Under Source Repo, click Disconnect.
2. Connect a repository again and pick the restored one, branch main. If it is not offered, use the link to configure the GitHub app and tick the repository. The new repository has a new identity and has to be granted again.
3. Railway may not build on its own. Click Deploy. Wait for the deployment to complete and check the CMS still opens and lets you sign in.

In the test the deployment completed and the CMS came back exactly as before. The database and settings were never involved, so nobody had to sign in again.

### Step 4: Reconnect the backups

Same as Part 1: add the three secrets to the new repository from the password manager. This repository has no Back up now button, so ask your agent to run the backup once from GitHub to prove it works. In the test it passed and saved a fresh 3.3 MB file to the bucket. The upload log showed one failed attempt followed by a successful retry, which is normal and needs no action.

### What came back on its own, and what had to be redone

Came back with the backup file: the whole CMS code, all branches, all tags, all history.

Had to be redone: the Railway source link, the three backup secrets. Lost for good: the fork link to the public project, which is cosmetic.

## Part 3: The CMS itself, when Railway is lost

Use this part when the Railway project or account that runs the CMS is gone, or when you want to move the CMS to a new Railway account. This was tested for real by rebuilding the CMS in a brand-new Railway account from the backups alone, then moving the CMS address across.

You need the newest database file from the bucket, the CMS settings from the password manager, and the R2 key. The CMS code comes from GitHub, or from the cms folder in the bucket if GitHub is gone too, in which case do Part 2 first.

**If you still have the old Railway account**, take a fresh database backup before starting: open the Backup CRON service and click Run Now. A new file appears in the bucket's cms/database folder within a minute.

### Step 1: Download the database backup

In the bucket, open cms, then database, and download the newest file. Its name is the date and time it was taken. Ask your agent to check it: it should be a complete Postgres archive with a dozen tables. In the test it was, and the agent unzipped it ready for loading.

### Step 2: Deploy the CMS code

In the new Railway account, create a project and choose Deploy from GitHub repo. Connect GitHub, pick the organisation and the CMS repository, and deploy. The first build fails, because the CMS has no settings yet. That is expected.

### Step 3: Create the database and load the backup

1. In the same project, add PostgreSQL from Railway's database menu.
2. Open it, go to Settings, then Networking, and click Add Public Access. Then press Deploy at the top of the project to activate it. This opens a door to the database from outside, which we close again at the end.
3. Click Connect on the Postgres service, choose Public Network, and copy the connection URL. It contains the database password, so treat it as a secret: do not paste it into chats or documents.
4. On a computer with the Postgres tools installed, run the restore program against that URL with the unzipped backup file. Your agent writes the command for you, with a placeholder where the URL goes. You paste the URL in and run it yourself. It prints nothing when it works.
5. Ask your agent for a check query and run it the same way. In the test it showed three user accounts, one collaborator, and three sessions, exactly what the live CMS had.

Two things caught us during the test. Railway's own Database tab may sit on "attempting to connect" for a long time; it says nothing about whether the load worked, so use the check query instead. And a command with quote marks inside quote marks confused the terminal; keeping the query in a file avoids that.

### Step 4: Give the CMS its settings

1. Open the CMS service, then Variables, then Raw Editor. Paste the full set of settings from the password manager.
2. Make sure the database line points at the new database. It should read `DATABASE_URL="${{Postgres.DATABASE_URL}}"`. Railway fills in the real address itself.
3. Open the CMS service's Settings. Under Build, set Custom Build Command to `npx next build`. Under Deploy, set Pre-deploy Command to `npm run db:migrate`.
4. Press Deploy at the top of the project and wait for the deployment to complete.

The two commands in step 3 matter. Without them the build fails at the very end with no clear message. The reason: the CMS updates its database tables as part of its normal build, but Railway does not let a build reach the project's database. The first command builds the CMS without that update. The second runs the update straight after, when the database can be reached. In the test these two settings existed only in the old Railway project and in nobody's notes, and the build failed twice before we found them by looking at the old project. If the old project had really been gone, this would have cost hours.

To check the CMS is running before moving its address: in the CMS service's Settings, under Networking, click Generate Domain, then press Deploy to apply it. Open the address Railway gives you. The sign-in page should appear. Signing in will not work yet, because the CMS expects its real address.

### Step 5: Move the CMS address across

1. In the new CMS service's Settings, under Networking, add the CMS's address as a custom domain, with the same port as the generated domain. If Railway says "Not available", the address is still attached to the old Railway service. Remove it there first. If the old project was deleted, the address is already free. If the old account is locked rather than deleted, ask Railway support to release it.
2. Railway shows two DNS records: a CNAME for the address, and a TXT record beginning `_railway-verify`. Both already exist in Cloudflare from the original setup, holding the old project's values. Edit them to the new values rather than adding new ones. Keep the proxy switch grey, DNS only. Skip Railway's one-click Cloudflare button; it asks for access to your Cloudflare account and the manual edit takes a minute.
3. Wait. In the test the DNS change was instant, but the address did not answer for about four minutes while Railway issued the security certificate.
4. Open the CMS address. The sign-in page should load.

Administrators have to sign in again, because the saved sign-ins in the backup are older than the ones in their browsers. In the test, the administrator signed in with GitHub, saw the site and its collaborator list, and saved an edit that reached the live website.

Collaborators sign in the same way as before, by email with a one-time code, at the CMS's own address. In the test the collaborator signed in, saw the site, and saved an edit that reached the live website. Their record came back with the database, so nobody had to be invited again. One trap: signing in at the public Pages CMS website instead of your own CMS address shows "No repositories yet", because that is a different CMS with a different database.

### Step 6: Put the database backup helper back

The new Railway project has no backup helper yet, so the new database is not being backed up. Add it the same way as in the original setup: deploy the Postgres S3 Backups template into the project, give it the R2 key and bucket details from the password manager, point its database address at the new Postgres, and set its daily schedule. Run it once and check a new file appears in the bucket's cms/database folder.

### Step 7: Tidy up

1. On the new Postgres service, remove the public access you added in Step 3. The CMS does not need it.
2. If the old Railway project still exists, stop or delete its backup helper. Otherwise it keeps uploading copies of the old, abandoned database into the same folder, and the newest file in the bucket is no longer the right one.
3. Delete the old project when you are sure the new one works.

### What came back on its own, and what had to be redone

Came back from the backups: the CMS code, every user account, every collaborator and which site they belong to, and the CMS's connection to GitHub.

Had to be redone by hand: the settings, pasted from the password manager; the two custom build and deploy commands, which were in nobody's notes; the address, moved in Railway and in Cloudflare DNS; the backup helper. Everyone had to sign in once more.

Nothing on the live website changed at any point.

