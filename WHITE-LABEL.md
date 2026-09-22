# White-labelling a self-hosted Pages CMS

Because we host Pages CMS ourselves, we can make it look like our own tool. Editors sign in at our address, see our name and logo, and work in our colours. The software underneath is still Pages CMS, and we are not hiding that. The goal is a CMS that feels like part of the service we sell, not a third-party product the client was sent to.

This section explains what can be changed, what it takes, and how to keep those changes when Pages CMS releases an update.

## What can be changed

There are two kinds of change. Some are settings, done in a dashboard or a config file, with no code involved. Others are small edits to the CMS's own code, made once by an AI agent in our copy of the CMS repository.

### Settings, no code

- **The address.** The CMS lives at our own domain, for example `cms.ouragency.com`, instead of a random hosting address. This is done once in the hosting dashboard and DNS. It is the single biggest thing, and most clients never notice anything else.
- **The name editors see when they connect GitHub.** Pages CMS uses a GitHub App to read and write the website. The app's name shows on the "authorise" screen and as the author of every automatic save. We name it after our agency. If the name is changed later, one setting on the hosting side has to be updated to match, because the name is also part of the app's web address.
- **The sender of emails.** Invitations and sign-in codes are sent by email. One setting on the hosting side controls the sender name and address, for example `Our Agency CMS <cms@ouragency.com>`.
- **The wording of saves in the website's history.** Each save is recorded in the website repository with a message like "Update home page (via Pages CMS)". A short block in the website's `.pages.yml` file changes that wording, and can record the editor as the author instead of the app. This is the only change that is per website. Everything else is per CMS.

### Small code edits, done once

These live in our copy of the CMS repository. Each is a plain text or image swap in one file. An agent can do all four in a few minutes.

- **Favicon.** The little icon in the browser tab. One image file.
- **Sign-in page.** Our logo above the form, and "Sign in to Our Agency" instead of "Sign in to Pages CMS".
- **Tab title.** "Our Agency" in the browser tab everywhere in the CMS.
- **Terms and Privacy links.** The sign-in page says editors agree to a Terms of Service and a Privacy Policy. Out of the box, those link to the Pages CMS website. Under our name, they must point to our own pages, or be removed. This is a legal point, not a cosmetic one.
- **Colour.** The green used on buttons, links and highlights is defined in one stylesheet. Swapping it for our brand colour recolours the whole CMS, in light and dark mode.

### Example

For the LWP setup, we made the following changes:

- Address: `cms.testmywork.xyz`.
- Sign-in page: an "L" mark and "Sign in to LWP Test".
- Tab title and favicon: "LWP Test" and the same mark.
- Colour: purple `#6A3AE0` throughout.
- Terms and Privacy links: pointed at placeholder pages until real ones exist.

Total: five files touched, all small. The About dialog, the emails and the help links still say Pages CMS, and that is fine.

## Things to keep in mind

- **One CMS serves all clients.** The name, logo, colour, sender and GitHub App name are our agency's branding, not a client's. If a client wants their own logo on the sign-in page, they need their own CMS: a separate hosting service, database and GitHub App. That is doable, but it is another thing to back up and restore.
- **Keep the edits small.** Change text, images and colour values only. Do not restructure files or move things around. Small edits almost never clash with updates from Pages CMS; large ones will.
- **Leave the help links alone.** Several pages link to the Pages CMS documentation. Those are useful to editors and to us. Rewriting every mention of Pages CMS is a lot of work for no benefit and makes updates painful.
- **Keep a short list of what was changed.** Which files, and what they say now. It takes a minute to write and saves guesswork after every update.
- **Check the licence.** Pages CMS is released under the MIT licence, which allows this kind of rebranding. If that ever changes, revisit this section.

## When Pages CMS releases an update

Our copy of the CMS is a separate repository, so updates do not arrive on their own. We pull them in when we choose. Our branding edits are part of our repository's history, so an update merges the new Pages CMS code with our changes. It does not replace our files.

The one thing that can happen is a clash: Pages CMS changed a line that we also changed. The update then pauses and asks which version to keep. For branding lines, ours. For everything else, theirs. It is a small job, and the sign-in page is the only file where it is at all likely.

To update safely:

1. **Back up first.** Press Back up now in the CMS, and confirm the CMS repository's own weekly backup is recent. If the update goes badly, the previous version can be restored.
2. **Ask the agent to pull the update on a branch, not straight onto main.** It fetches the latest Pages CMS code, merges it, and resolves any clashes, keeping our branding. Nothing is live yet.
3. **Read the release notes.** The agent should summarise what changed and whether any setting on the hosting side needs adding or changing. New versions sometimes need a new setting or a database step.
4. **Merge the branch.** Hosting builds the new version on its own and it is live a couple of minutes later. Auto deploy must be switched on for the service, otherwise the build has to be started by hand in the hosting dashboard.
5. **Check three things.** Sign out and look at the sign-in page: our logo, name and colour should still be there. Sign in and open a site. Make one small edit and save it. If the sign-in page has gone back to green or says Pages CMS, a clash was resolved the wrong way, and the agent can redo the branding lines in a minute.
6. **If something is broken and not obvious,** roll back. The hosting dashboard lists earlier deployments, and any successful one can be made live again with one click while the problem is looked at.

Do not update in a hurry, and do not update just because a new version exists. Once a month, or when a release fixes something we care about, is plenty.
