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

