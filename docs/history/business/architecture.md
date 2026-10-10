# What "a bit online" actually costs

2026-09-05. The arm of the owner's brief that the other three do not
touch: he wants App 2 to become *"biraz daha online bir platform (tam da
değil, küçük kapsamlı)"* — slightly more online, not fully, small in
scope — and he is open to either a subscription or a one-time payment.

Today the app is static HTML, CSS and ES modules with **zero runtime
dependencies**, served from GitHub Pages, with every byte of learner
state in one browser's `localStorage`. That is not an accident of
laziness; it is what makes the thing cost nothing to run, impossible to
breach, and still working in five years. The question this document
answers is: **which parts of "online" can be bought without giving that
up, and which one purchase ends it.**

Written against the source, not from memory. Where a claim depends on a
provider's current pricing or policy, it is marked `[unverified]` — the
standing rule for this directory, because network research is not
available in the session that wrote it.

---

## 1. "Online" is seven different purchases

The trap is treating "we need a backend" as one decision. It is seven,
they cost wildly different amounts, and only one of them is irreversible.

| | Capability | What it really needs | Cost of the cheapest honest version |
|---|---|---|---|
| **A** | Cross-device progress | a dumb blob the client merges | ~zero — see §2 |
| **B** | Identity (an account) | a login, a user table | small, but see §5 |
| **C** | Paid content | content that is not public | **the point of no return** — §3 |
| **D** | Content updates | already solved | zero |
| **E** | Knowing what is hard | aggregate counters | small, and see §4 |
| **F** | Classes, teachers, leaderboards | real multi-tenant server | large |
| **G** | AI-generated practice on demand | a server holding an API key | metered, per learner |

App 2 as the owner describes it — *"bir Duolingo ama daha öğretici, daha
saygın"*, localised, possibly monthly — needs **A, B, C** and would like
**E**. It does not need **F**, and **G** is the one that turns a fixed
cost into a variable one.

---

## 2. The app already contains the hard half of sync

This is the most useful finding in this document and it was sitting in
the repository.

`js/storage.js:798` exports the entire learner state as one object:

```js
export function exportState() {
  return { history, lessonProgress, seenVersions, profileName, settings };
}
```

and `js/backup.js` already merges two of them. Read the merge functions
as a mathematician rather than as a backup feature:

- `mergeHistory` keys attempts by their timestamp, first writer wins,
  and re-sorts. **Idempotent, commutative, associative.**
- `mergeLessonProgress` takes the maximum, and "done" is sticky —
  `recordLessonRead` refuses to go backwards. **A join.**
- `mergeSeenVersions` takes the maximum. **A join.**
- `profileName` and `settings` resolve device-wins.

Three of the five fields form a **join-semilattice**: merge order does
not matter, merging twice is the same as merging once, and nothing is
ever lost. That is the definition of a state-based CRDT, and it is the
part of a sync engine that is genuinely hard to get right. This project
got it right by accident, because it was solving a different problem —
the iOS seven-day storage eviction described at the top of
`js/backup.js` — under a rule that made it careful: *the one thing a
restore must never do is lose something that was already there.*

**The consequence.** Cross-device sync does not need a server that
understands learners, questions, scores or accounts. It needs a box that
stores one opaque JSON blob per key and hands it back. The client pulls
the remote blob, calls the merge it already has and ships tests for,
pushes the result, and two devices converge with no conflict resolution,
no last-write-wins data loss and no server-side model of anything.

The naive shape of this is roughly a hundred lines and no new
dependency:

```js
// pull → merge (the existing pure function) → push
const remote = await fetch(`${SYNC}/${key}`).then(r => r.ok ? r.json() : null);
if (remote) importState(remote);          // js/storage.js:817, already tested
await fetch(`${SYNC}/${key}`, { method: "PUT", body: JSON.stringify(exportState()) });
```

The real work is not the merge. It is: what is `key`, who is allowed to
write to it, and what happens when the box is down. Which is §5, §3 and
"nothing, the app keeps working" respectively — the third answer being
free only because the app is offline-first today and must stay that way.

**What this rules out.** Any sync design that puts learner rows in a
relational schema on a server is strictly worse here: it costs a
migration, a privacy story the app currently does not need, and a moving
part that can be breached — in exchange for nothing the lattice does not
already give.

---

## 3. The paywall is a hosting decision, not a code decision

The repository is **public** (verified against the GitHub API today) and
carries **no `LICENSE` file**. Two separate facts follow, and the second
one is the one that decides App 1 and App 2 both.

**Legally**, no licence means no permission granted. Publishing on
GitHub grants viewing and forking *within GitHub* under its terms; it
does not grant anyone the right to republish the corpus as their own
app. That is worth knowing but is not protection — it is recourse, and
recourse against a stranger in another country is theoretical.

**Practically**, every question, every lesson and every option note in
`data/` (852 KB) is readable, forkable and re-hostable by anyone who
finds the repository, today, at zero effort. A "full unlock" button in
front of content that ships in the page is not a paywall. It is a
politeness notice.

So the paid tier cannot be a flag in `localStorage` or a check in
`js/`. **Paid content has to not be in the client until it is paid
for**, which means:

1. paid content leaves the public repository (a private repo, or a
   separate content store);
2. something authenticates the request for it, which means an account
   (**B**) and a server that can say no;
3. that server holds the entitlement, because a client-held entitlement
   in an app whose source is readable is decoration.

**This is the point of no return.** Everything else on this list can be
undone by deleting a file. The moment content is served conditionally,
the project has: an uptime obligation, a customer who paid and expects
access at 2 a.m., an auth surface, a store of who bought what, and a
legal relationship with a buyer. The static-site properties are gone —
not degraded, gone. GitHub Pages cannot serve it, so the *free* app
moves too, or the project runs two hosts.

That cost is worth paying for a real product. It is not worth paying
early, and it is not worth paying for a feature that could have been
free. Which produces the sequencing rule in §7.

**The one cheap exception.** If the paid thing is not content but a
*licence key* — the free app is fully functional and the payment removes
a limit the honest majority respects — then no server is needed, and the
loss is only the revenue from people who would have pirated it. At the
owner's stated scale (three schools, ~50 people each, friends and
friends-of-friends, profit explicitly not the goal) this is worth
weighing seriously rather than dismissing. A key that a determined
student can defeat in ten minutes still collects money from the
ninety-plus per cent who never try, at a hosting cost of zero and an
operational burden of zero. **The honest framing is not "how do we stop
piracy" but "how much revenue does the server actually buy, and is it
more than the server costs in money, time and freedom to walk away."**

---

## 4. What the app deliberately does not know, and what it costs

There is no analytics, by design, and the README says so as a promise.
This has a real price: **nobody knows which questions are bad.** The
review pipeline in `docs/agents/` exists precisely because there is no
feedback signal from actual learners — every defect has to be found by
reading, because none can be found by measuring.

An aggregate counter — "question t25 is answered wrong 71% of the time"
— would find in a week what a blind review pass takes a session to find,
and would find the *different* class of defect that reading cannot: the
item everyone gets right (too easy to be worth its slot) and the item
everyone gets wrong (mis-taught, not just mis-keyed).

It can be bought without breaking the promise, and the design matters:

- Send **counts per question id**, never per learner, never a session,
  never anything joinable. No id assigned to the person, no cookie, no
  IP retention.
- Send on the results screen only, batched, fire-and-forget, and
  **never block anything on it**.
- Say what it does in Profil, in Turkish, and let the learner switch it
  off — the `getChoice` / `setChoice` pair in `js/storage.js:771` is
  already the mechanism, and `settings` already survives backup and
  restore.

This is the highest-value-per-lira item on the whole list, and it is
independent of every other one — it needs no account, no payment, no
sync. **[unverified]** whether any hosted counter service fits inside
the zero-dependency rule; a ~20-line serverless function writing to a
key-value store is the obvious shape, and the client half is a `fetch`.

The thing to protect: the promise in the README is currently
*"nothing is sent anywhere."* If that changes, the sentence changes
first, in the same commit, in both languages. A privacy claim that
quietly stops being true is worse than never having made it.

---

## 5. Identity is where a small project actually dies

Sync (§2) needs a `key`. Payment (§3) needs to know who paid. Both point
at accounts, and accounts are where a solo project acquires the work
that never ends: password resets, "I lost my email", account deletion
requests, GDPR/KVKK obligations, someone else's OAuth outage on exam
morning.

Three shapes, in increasing cost:

**A pairing code, no accounts at all.** The learner taps "sync to
another device", gets a short code, types it on the second device, and
the two share a random opaque key from then on. No email, no password,
no personal data at all — so, notably, nothing that a data-protection
regime has much to say about. Recovery is "the other device still has
it", which is exactly as good as the export file the app already ships
and no worse than today. This is the shape that fits the existing
architecture, and it delivers **A** without **B**.

**A magic link.** Email only, no password, no reset flow. Buys real
recovery. Costs an email provider, a deliverability problem, and the
first genuinely personal datum the project has ever stored.

**Third-party sign-in.** Apple/Google. Cheapest to build, most expensive
to depend on: for iOS, *"Sign in with Apple"* becomes mandatory once any
other third-party sign-in is offered **[unverified — check the current
App Review Guidelines; this has been a real rejection cause for years
and the `shipping.md` arm should confirm the present wording]**.

**Recommendation:** the pairing code, until a paid tier forces email.
It is the only one of the three that adds no personal data, no recovery
surface and no policy dependency, and it is the only one that can be
removed later without stranding anyone.

---

## 6. The rungs, in order, with the trapdoor marked

Each rung is useful alone, each is reversible, and they are ordered so
that the reversible ones come first.

1. **Anonymous aggregate question stats** (§4). Finds bad content.
   Needs no account, no payment. Removable by deleting a `fetch`.
2. **Pairing-code sync** (§2, §5). Uses the merge that already exists
   and is already unit-tested. Needs an opaque blob store. Removable —
   the export file remains the ground truth.
3. **Content beyond the exam** — the App 2 mission, still free, still
   static. This is the rung that proves whether the *product* is real,
   and it costs no infrastructure at all. Skipping it to build a
   paywall first is building a shop before knowing there is a thing to
   sell.
4. **Localisation.** Also static: the corpus is JSON and the UI strings
   are the only hard-coded Turkish. Worth noting that App 2's premise —
   *competence without the labels*, picked up from series and games — is
   not a Turkish phenomenon. It describes a very large number of people
   in Europe, and the content that serves them is mostly the content
   this app already has, with the explanations translated. **The
   explanations, not the questions:** the English is the subject and
   does not change.
5. ─────── **the trapdoor** ───────
6. **Accounts, entitlement, conditionally-served content** (§3). After
   this, the project has uptime obligations, a payment relationship and
   no way back to a static site. Cross it only when rung 3 has shown
   there is something worth charging for, and only with the smallest
   version that works.
7. **Native store presence.** Its own research arm (`shipping.md`),
   which reached the compatible conclusion from the other side: the
   cheapest path to a paying student has no store in it at all. Two
   things it found bear on the rungs above. A **custom domain** is a
   hard prerequisite for the Android route — Digital Asset Links must
   sit at an origin root and the site currently lives on a shared
   `github.io` subpath — so buying one is a rung-0 item, not a rung-7
   one, and it is also what makes any of §2's sync endpoints
   addressable without hard-coding somebody else's hostname into the
   client. And a store listing makes rung 6 much harder to reverse: a
   refund policy and a review process now sit on top of it.

**The claim this ordering makes:** rungs 1–4 make the app materially
better for the person using it. Rung 6 makes it better for the person
selling it. Doing them in that order is not caution — it is that rungs
1–4 produce the evidence rung 6 would otherwise be guessed from.

---

## 7. What this means for the two apps

**App 1** — the exam app, Turkish, ~270 TL, three schools. On this
analysis its paid tier should be **rung 6 only if it must be**, and the
§3 exception is a serious alternative: at fifty buyers per school who
mostly know each other, a licence key costs nothing to run and collects
most of the money. The owner has said profit is not the point and that
covering AI and store fees is already a win — that is precisely the
regime where the cheap answer is the right one, because the expensive
answer's costs are fixed and its extra revenue is not.

**App 2** — the mission app. Its distinguishing claim against Duolingo
is *"daha öğretici, daha saygın"*: more instructive, more respectable.
Nothing on this list delivers that. What delivers it is the content
pipeline already in `docs/agents/` — the blind pass, the sufficiency
pass, the independent re-audit, the rule that an option a competent
teacher would accept is a defect. **That pipeline is the product**, and
it is the one asset here that a well-funded competitor cannot buy
cheaply, because it is slow by construction.

The strategic reading, then: the infrastructure on this list is a cost
of doing business and should be bought as late and as small as possible.
The thing worth investing in early is more corpus, reviewed to the
existing standard, and the localisation that makes it legible to someone
who is not Turkish.

---

## 8. What could not be verified here

- Current pricing of any hosting, key-value store, email or payment
  provider. All `[unverified]`.
- The present wording of Apple's rule on *Sign in with Apple*, and
  whether a web-wrapped app of this kind is accepted at all — the
  `shipping.md` arm owns this.
- Turkish tax treatment of app revenue without a company, which the
  owner believes exists in a favourable form. This is the single most
  expensive thing in the whole plan to be confidently wrong about, and
  nothing in this document should be read as confirming it.
- Whether GitHub's terms permit serving a paid product's free half from
  Pages at any scale worth having.
