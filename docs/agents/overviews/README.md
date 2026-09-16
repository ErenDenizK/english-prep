# Orphaned topic overviews

Three topic files — `tenses`, `modals`, `passive-voice` — carried a
top-level `overview` object: a Turkish title, two or three paragraphs of
body, and a `keyPoints` list. Roughly 4,700 characters in total.

**Nothing had read them since the lesson reader was rebuilt around typed
blocks.** They were fetched by every learner who opened one of those
three topics and rendered by nobody, and they were invisible because the
validator ignored keys it did not recognise. It now warns on any
top-level key the app does not read, which is how they surfaced.

They are moved here rather than deleted, because they are the only
existing draft of the thing `docs/research/orientation.md` calls the
**topic screen** (its option **(e2)**), which is staged after the
vocabulary topics ship. Three of eight topics are written; the other five
have a "what this topic is" section at the top of their
`docs/agents/<topic>-spec.md`, which the arm costs at 40–45 minutes of
adaptation each.

## Read them against the evidence before reusing them

They are essays, and the research is specific that an essay is the wrong
shape. What has the evidence behind it is Mayer's **pre-training**
principle — knowing *the names and characteristics of the main concepts*
before the lesson — which in the experiments is a **parts list**, not
prose. Pulling the other way is the **coherence principle**: across 50
studies, added interesting-but-inessential material *hurt* learning
(g = −0.16).

So the `keyPoints` arrays are closer to what should ship than the `body`
paragraphs are. `docs/research/orientation.md` §3.2 has the template and
§3.1 a worked draft for `relative-clauses`; both were written after this
material and supersede it on shape.

One thing in here is worth keeping whatever the shape: the Turkish-L1
contrast. *"Türkçe'de 'gidiyorum' hem 'I go' hem 'I am going' anlamına
gelebilir"* is the kind of sentence only someone teaching Turkish
speakers writes, and it is the reason the learner keeps making the
mistake. Check it against the lessons before reusing it, though — the
first `text` block of all 48 lessons already carries an L1 contrast, and
repeating one is exactly the extraneous material the coherence principle
warns about.
