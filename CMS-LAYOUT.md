# How to change the layout of a self-hosted Pages CMS

This guide explains how to make the editing screens in your own Pages CMS easier to use: a sidebar for publishing details, short fields sitting side by side, and a sensible order. It uses the Properties editor on this site as the worked example.

You do not need to write code yourself. Each part says what to ask your AI agent to do, and what you do yourself in GitHub and Railway.

---

## The short version

- There are **two repositories**. The website repository holds a settings file that describes each editing form. The CMS repository holds the CMS software itself.
- **Using** a layout option is a settings change in the website repository. No code, and it takes effect straight away.
- **Adding** a layout option the CMS does not have yet is a code change in the CMS repository, followed by a redeploy in Railway.
- Always add the option to the CMS **first**, and use it in a website **second**.

---

## What stock Pages CMS can and cannot do

Out of the box, the settings file (`.pages.yml`, at the top level of the website repository) already controls a lot:

| You want to | Setting |
| --- | --- |
| Change the order of fields on a form | Reorder them in the file |
| Group the left-hand menu under headings | `type: group` |
| Choose the columns, sorting and search on a list | `view` |
| Hide a field, or make it read-only | `hidden`, `readonly` |
| Add help text under a field | `description` |
| Stop editors deleting or renaming items | `operations` |
| Let editors choose from section types such as Hero or FAQ | `type: block` |
| Add a button that runs a task, such as "Back up now" | `actions` |

What it cannot do is arrange a form. Every field sits one below the other in a single long column. There is no sidebar and no way to put two fields on one row. That is the gap this guide fills.

---

## What we added to our CMS

Our CMS repository is a copy of the public Pages CMS project with three small additions. All three only change how the form **looks**. They never change what is saved, so the website is unaffected.

| Setting on a field | What it does |
| --- | --- |
| `position: sidebar` | Shows the field in a panel on the right that stays in view while you scroll. On a phone the panel drops below the form. |
| `width: half` | The field takes half the row. Two half-width fields in a row sit side by side. On a phone they stack. Ignored inside the sidebar. |
| `collapsible: true` | For a group of fields (an `object`), adds a header you can click to fold the group away. `collapsible: { collapsed: true }` starts it folded. |

A form with none of these settings looks exactly as it does in stock Pages CMS.

There is also one setting for the **list** of entries, rather than the form:

| Setting under `view` | What it does |
| --- | --- |
| `editable: [price]` | Lets editors change the price straight from the list. Click the price, type the new one, press Enter to save. Escape or clicking away cancels. Each save is one change in the site's history and one site rebuild. Works for number and plain text columns. |

Unlike the layout options, this one does save content. It changes only the one field and keeps everything else in the entry as it is.

---

## Layout rules worth following

These come from published usability research and from how other CMSs arrange their editors.

1. **Keep one main column.** Forms split into two full columns cause skipped fields and mistakes, because the eye no longer has one path down the page.
2. **Pair fields only when they are one idea.** Town and postcode. Price and currency. Bedrooms and bathrooms. Two or three short fields on a row is fine; anything more is not.
3. **Content on the left, publishing details on the right.** Status, dates, the featured switch, who owns the item, the main picture. Editors expect these in a sidebar because most CMSs put them there.
4. **Long fields get the full width.** Descriptions, galleries and lists need room.
5. **Most-used first.** Put what editors change every time at the top, and rarely-touched fields at the bottom.
6. **Words matter as much as layout.** A clear label and one line of help text prevent more mistakes than any arrangement.

---

## Worked example: the Properties editor

**Before:** eighteen fields in one long column, in the order they happened to be written.

**After:**

```
┌─ Properties / Elmfield House ─────────────────────────── [ Save ] ─┐
│  MAIN COLUMN                              │  SIDEBAR               │
│                                           │ ┌────────────────────┐ │
│  Title                                    │ │ Status             │ │
│  [ Elmfield House                     ]   │ │ Featured           │ │
│                                           │ │ Published date     │ │
│  Price               Currency             │ │ Agent              │ │
│  [ 450000       ]    [ GBP           ]    │ │ Main image         │ │
│                                           │ └────────────────────┘ │
│  Address                                  │                        │
│  [ 12 Elmfield Road                   ]   │                        │
│  Town or city        Postcode             │                        │
│  [ Bristol      ]    [ BS6 5QA       ]    │                        │
│                                           │                        │
│  Property type       Bedrooms             │                        │
│  Bathrooms           Floor area           │                        │
│                                           │                        │
│  Key features                             │                        │
│  Gallery                                  │                        │
│  Description (full width)                 │                        │
└────────────────────────────────────────────────────────────────────┘
```

In the settings file, that is one extra line on each affected field:

```yaml
      - name: price
        label: Price
        type: number
        width: half

      - name: status
        label: Status
        type: select
        position: sidebar
```

Field names did not change, so existing properties open with all their content in place and the website builds exactly as before.

---

## Process A – Use a layout option (no code)

Use this whenever the option you need already exists in your CMS.

**Ask your AI agent to:**

- Create a new branch in the website repository.
- Edit the settings file: reorder the fields and add the layout settings. Do not rename any field.
- Build the website to confirm nothing has broken.
- Push the branch and open a pull request.

**Do this yourself:**

1. Open the CMS and open the site.
2. Use the branch switcher at the top of the left-hand menu and pick the new branch. The CMS reads the settings file from whichever branch you are on, so this is a safe preview.
3. Open an item and look at the form. Do not save content while on this branch.
4. If you are happy, open the pull request on GitHub and click Merge pull request, then Confirm merge.
5. Switch the CMS back to the main branch.

**How to check it worked:**

- The form shows the new arrangement on the main branch.
- An existing item opens with every field still filled in.
- Saving an item still works, and the website still builds.

---

## Process B – Add a new layout option (code)

Use this when you want something the CMS cannot do yet.

**Ask your AI agent to:**

- Plan the option first, and keep it display-only: it must never change how content is saved.
- Create a branch in the CMS repository and make three changes: accept the new setting in the configuration rules, draw it in the editing form, and describe it in the README under "Fork additions".
- Run the type check and a full production build.
- Push the branch and open a pull request.

**Do this yourself:**

1. Open the pull request on GitHub. Click Merge pull request, then Confirm merge.
2. Railway builds the new version on its own, because auto deploy is switched on for the CMS service. If it does not start within a minute, open the service, press Cmd + K, type "deploy latest commit", and press Enter.
3. Open the Deployments tab and wait for the new deployment to show Active. It takes about four minutes.
4. Open the CMS and check it loads and an item opens as before.

Nothing looks different yet. The new option does nothing until a website's settings file uses it. Now follow Process A.

**If something is wrong:** in Railway's Deployments tab, find the previous deployment, click the three dots next to it, and choose Redeploy. The CMS goes back to how it was.

---

## Good to know

- **CMS first, website second.** The CMS checks the settings file strictly. If a website uses a setting the live CMS has never heard of, the CMS may refuse to open that site. We hit exactly this: the layout options existed in a local copy of the CMS but had never been sent to the repository Railway builds from. Check which repository Railway names under Settings, then Source Repo, before assuming a feature is live.
- **Do not use a group of fields just to get a heading.** Wrapping fields in an `object` changes how they are saved, nesting them one level down, and the website will stop building. A purely visual section heading needs its own option, added through Process B.
- **One CMS, many websites.** If several websites share the CMS, a new option becomes available to all of them at once, but each website's layout is its own. A site looks no different until its own settings file uses the option. The flip side: a mistake in the CMS code reaches every site together, so preview on one site's branch first.
- **Branding is shared.** The logo, colours and general look of the CMS come from the CMS code, so they are the same for every website on it.
- **Keeping up with new Pages CMS releases.** Our additions live in our own repository. When the public project releases a new version, ask your agent to merge it in. The file most likely to need care is the editing form, because that is where our additions sit.
- **Your agent may not be allowed to merge or deploy.** Ours was blocked from merging into a live branch, as a safety measure. That is fine: the agent prepares a pull request, and the merge click is yours.

---

## Where things are

| Thing | Place |
| --- | --- |
| Website settings file | `.pages.yml` in the website repository |
| CMS software | The `pagescms-selfhosted` repository |
| Description of our three additions | README in the CMS repository, under "Fork additions" |
| CMS hosting | Railway, service `pagescms-selfhosted` |
