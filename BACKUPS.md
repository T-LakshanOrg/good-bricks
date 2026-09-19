# How to back up a website that uses a self-hosted Pages CMS

This guide explains, in plain English, how a website edited through a self-hosted Pages CMS is backed up, and what to do if something goes wrong. It is meant to give anyone a clear picture of the process, technical or not.

It does not contain the technical setup. The files that do the actual work live inside the website's repository, and an AI coding agent (such as Claude Code, Codex, or similar) can set them up by reading them. This guide tells you what they do and who does what.

It is a companion to the build guide, but it stands on its own.

## What gets backed up

A Pages CMS setup has three separate pieces. Each one needs its own backup.

- **The website itself.** Everything lives in one GitHub repository: every page, every piece of content, every image, the website code, and the full history of edits. Every save in the CMS is recorded there. A copy of this repository is a complete copy of the website. This is the backup that matters most.
- **The CMS software.** The CMS is built from a GitHub repository too. A copy of it means the CMS can be rebuilt from scratch.
- **The CMS's database.** A small list of who can log in and which sites each person may edit. It holds no website content. Losing it means re-inviting the editors, so a backup saves that work.

One more thing is copied by hand, once: **the CMS's settings and keys**. These let the CMS talk to GitHub and unlock what it stores. They go into a password manager, not into any automated backup.

## Where backups go

All backups go to one storage bucket on Cloudflare R2. A bucket is simply a private folder in the cloud where files can be uploaded and downloaded. Each website has its own folder inside it, and the CMS has one of its own.

Cloudflare is a good home for backups for a few reasons. It is separate from GitHub, so a problem with GitHub, or with the GitHub account, cannot take the backups down with it. Its free plan holds far more than small websites need, and downloading a backup costs nothing, which matters on the day you actually need one. It can delete old backups by itself after a number of days you choose, so storage never fills up and nobody has to tidy it. And if the website is already hosted on Cloudflare, the backups live in an account you already use.

Between 30 and 90 days of backups is typical.

## How the website backup works

- **Every week**, GitHub makes a complete copy of the website's repository, packs it into a single file, and uploads it to the bucket. Nobody has to do anything.
- **Any time**, an editor can press **Back up now** inside the CMS. That does the same thing straight away, for example before a big change. The record shows who pressed it.
- **Every backup checks itself** before uploading. It opens the file it just made and confirms a working copy of the website can be restored from it. This is automatic. If the check fails, nothing is uploaded and the run shows as failed on GitHub.
- The backup never deletes anything. Only the storage bucket's own rule removes old files.

## How the CMS backup works

- **The CMS software** is backed up the same way as a website: weekly, into its own folder in the bucket.
- **The CMS database.** A database is where a program keeps its records. For the CMS, that is the list of editors and which sites each one may open. The database lives on the platform that hosts the CMS, and that platform cannot send copies anywhere else on its own. So a small helper program is added next to the CMS, on the same platform. On a schedule, usually once a day, it saves the whole database as one file and uploads that file to the bucket, just like the website backups. Once set up, it runs by itself.
- **The settings and keys.** When the CMS was set up, it was given a few pieces of information: its web address, the keys that let it talk to GitHub, and a secret code it uses to scramble the private parts of its database. These were typed into the hosting platform once and are not stored anywhere else, so no automatic backup can reach them. Copy them into a password manager by hand when the CMS is set up, and again whenever one changes. They belong with the database backup: the private parts of a restored database can only be read with the same secret code they were written with. Two more things live only on the hosting platform and belong in the same password manager entry: the CMS service's custom build and pre-deploy commands, and the full settings block of the database backup helper. A restore test showed that without them, rebuilding the CMS stalls.

## Setting it up: who does what

**You do, once:** Create the storage bucket in Cloudflare, choose how many days to keep backups, and create a key that allows uploading to it. Keep the key in your password manager.

**You do, for each website:** Add that key to the website's repository settings on GitHub, as three secret values. Their names are listed at the top of the backup file. This is what lets the weekly backup sign in to the bucket.

**Your AI agent does, for each website:** Add two small files to the repository. One tells GitHub how to run the backup. The other adds the Back up now button to the CMS. Once these are on the main branch, backups start on their own.

**You do, once for the CMS:** Add the database helper on the CMS's hosting platform and give it the same key. Copy the CMS's settings and keys into your password manager.

## Checking that backups are happening

- Open the storage bucket in Cloudflare. Each site's folder should contain a fresh file with a date in its name, no older than a week.
- The database folder should gain a new file every day.
- On GitHub, the repository's Actions tab lists every backup run and whether it passed.
- Press Back up now in the CMS. A new file should appear in the bucket within a couple of minutes.
- Once, after setting up, ask your agent to take a backup file and rebuild the site from it. If the site builds, the backup is complete.

## Getting a website back

The full, tested, step-by-step version is in RESTORE.md. In short:

If the repository is lost, damaged, or locked:

1. Download the latest backup file from the bucket.
2. Ask your AI agent to turn it into a new GitHub repository. The file contains everything, history included.
3. Reconnect the CMS to the new repository and reconnect the hosting, as described in the build guide. These connections are not part of the backup.

If the CMS is lost: rebuild it from the CMS software backup, load the latest database snapshot, and enter the settings and keys from the password manager. Editors can then log in again.

## Good to know

- Backups run at a fixed time in UTC, early on Sunday morning.
- The three secret values cannot be read back out of GitHub once saved. Keep them in the password manager from day one.
- Railway can also keep its own daily copies of the database volume, switched on from the volume's Backups tab. It is a handy same-day undo, but those copies vanish if the volume or project is deleted, so it is an extra, not a replacement for the bucket.
- On a public repository, GitHub pauses scheduled backups after two months with no edits at all. Pressing Back up now restarts them. Private repositories are not affected.
- Keep a short note in the repository of who has CMS access to the site. Then a website backup on its own tells you who to re-invite.
- Adding another website means copying the same two files into its repository and adding the same three secrets. Everything else is automatic.
