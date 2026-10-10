# Product direction (parked)

Status: **open, deliberately postponed** (owner, 2026-10-10). Nothing here is a plan. It records
the question so it is not lost again, and so V1 work does not close either road by accident.

> **Özet.** Uygulama bir sınav uygulaması mı, genel bir İngilizce uygulaması mı, yoksa ikiye mi
> ayrılacak? Bu soru V1'den sonra konuşulacak. Eylül'deki "App 1 / App 2" planı aşağıda özet
> olarak duruyor; ayrıntılar `docs/history/` altında.

## The question

Is English Prep:

1. an **exam app**: Turkish university prep-school proficiency exams (YTÜ İYS style), Turkish
   learners, a few weeks of use before an exam;
2. a **general English app** for people with a good ear and no labels ("competence without the
   labels"), used for longer, possibly for a wider audience;
3. **two apps** grown from one core; or
4. **one app** that serves both?

Today the copy says both (exam: the About eyebrow, page metadata, "Sınav gibi" in Test, the
README; general: the manifest, "Bildiğin İngilizceyi netleştir.", the About thesis). For V1 the
story leads with the thesis and treats the exam as a context (`PRINCIPLES.md` §5).

## What was planned in September 2026

From the owner's brief of 2026-09-05 and the plans of 2026-09-06 (now in `docs/history/`:
`app1-final.md`, `business/`, `app2/`, `exam-spec.md` stays live as reference):

- **App 1** was this app: Turkish, for YTÜ İYS Session I. Its plan defined "v1.0" as all of
  Session I (60 of 60 points). Coverage today is 30 of 60: `so / such`, paragraph completion and
  the reading section were never built, and the 241 items were never cold-solved by a person. A
  price of about 270 TL for a full unlock, at around three schools, with no profit target, was
  sketched.
- **App 2** was a separate, global "improvement, not learning" app, taught in English (owner,
  2026-09-06), born from App 1's core (about 2k lines copied) and then diverging. Its unit is a
  boundary; its loop is probe → verdict → boundary → re-probe; its wedge a free 20-item
  diagnostic. Closest existing product: Kwiziq. Nothing was built.
- **Decided then:** App 1 first; no streaks or accounts in App 1; quality debt (the human solve
  pass) gates any paid release.

## What changed

- 2026-10-10: the owner decoupled **V1** from exam coverage: V1 is a presentable, working,
  family-aligned product they sign off (`PRINCIPLES.md` §1). `app1-final.md` is history.
- The September plan's content work (so/such, paragraph completion, reading, the solve pass)
  is not cancelled; it waits for this decision, because it only makes sense on road 1, 3 or 4.

## Open, for after V1

- Which of the four roads.
- If two apps: what is shared (core engine, content format, design) and what diverges.
- Audience language (Turkish UI, English UI, both).
- Money: free, one-time, subscription; store and tax questions.
- Whether the "distinction" unit survives at scale (error mass, more than X-vs-Y pairs).
