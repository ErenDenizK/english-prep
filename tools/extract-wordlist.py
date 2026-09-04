"""Turns one of the prep school's published word lists into JSON.

The lists are four-column tables with a bold heading over each group. A
plain text extraction reads straight across the page and interleaves four
unrelated lists into nonsense, so this works from word coordinates:

  * a column's left edge is an x position that many words share exactly,
    so columns are found as peaks in a histogram of x0 rather than as
    gaps — indentation inside a cell makes gaps unreliable;
  * a row is a cluster of words at the same y;
  * a heading is any cell set in bold, which is how the source marks them
    and the only signal that survives the layout;
  * a bold cell one or two rows under another, in the same column, is the
    REST of that heading rather than a group of its own
    ("Collocations/" over "Delexicalized Verbs").

Two things that look like they should settle a wrapped heading and do
not. Horizontal position: the source centres some headings inside their
own single column, so "starts on a column edge" separates nothing. And
"the heading above has no entries yet", which is true of a wrapped
heading and also of two headings that happen to be adjacent.

A heading centred over two columns ("Irregular Verbs") needs no rule at
all — both halves fall inside one column and one row, so they arrive as
a single cell.

Run it through tools/extract-wordlist.mjs, or directly:

    python3 tools/extract-wordlist.py <list.pdf> <out.json>

Needs pdfplumber, which is deliberately not a project dependency: this
runs once per published list, not at build or test time.
"""

import collections
import json
import sys

import pdfplumber

# A gap under this is a within-column indent, not a new column. Real
# columns are ~80pt apart, so this has a lot of room.
COLUMN_MERGE = 25
# A left edge fewer words than this share is an indent, not a column.
COLUMN_MIN_WORDS = 5
# Word tops within this many points are the same row.
ROW_TOLERANCE = 4
# How many rows below a heading its own second line may sit. Rows are
# quarter-point buckets, so this is a couple of text lines.
HEADING_WRAP_ROWS = 6


def column_edges(words):
    counts = collections.Counter(round(word["x0"]) for word in words)
    edges = []
    for x in sorted(x for x, n in counts.items() if n >= COLUMN_MIN_WORDS):
        if not edges or x - edges[-1] > COLUMN_MERGE:
            edges.append(x)
    return edges or [min(counts)]


def cells_of(page):
    words = page.extract_words(extra_attrs=["fontname"])
    if not words:
        return []
    edges = column_edges(words)

    def column_of(word):
        index = 0
        for i, edge in enumerate(edges):
            if word["x0"] >= edge - 2:
                index = i
        return index

    grouped = collections.defaultdict(list)
    for word in words:
        grouped[(column_of(word), round(word["top"] / ROW_TOLERANCE))].append(word)

    cells = []
    for (column, row), group in grouped.items():
        group.sort(key=lambda word: word["x0"])
        text = " ".join(word["text"] for word in group).strip()
        if not text:
            continue
        cells.append(
            {
                "column": column,
                "row": row,
                "text": text,
                # All-bold means a heading. A cell that is only partly bold
                # is an entry with emphasis in it, and stays an entry.
                "heading": all("Bold" in word["fontname"] for word in group),
            }
        )
    cells.sort(key=lambda cell: (cell["column"], cell["row"]))
    return cells


def main():
    try:
        path, out = sys.argv[1], sys.argv[2]
    except IndexError:
        print("usage: extract-wordlist.py <list.pdf> <out.json>", file=sys.stderr)
        return 1

    groups = {}
    order = []
    title_parts = []
    heading = None
    # Where the last piece of the current heading sat, so the next bold
    # cell can be tested for adjacency to it.
    at = None

    def rename(old_name, new_name):
        """Keep a group's position and entries under a corrected name."""
        order[order.index(old_name)] = new_name
        groups[new_name] = groups.pop(old_name)
        return new_name

    with pdfplumber.open(path) as pdf:
        for pageno, page in enumerate(pdf.pages, 1):
            cells = cells_of(page)
            at = None  # adjacency is a within-page fact
            # The document title is bold and spans the columns, so it looks
            # like four headings on one row. It is whatever bold sits above
            # everything else on the first page.
            title_row = None
            if pageno == 1:
                bold_rows = [cell["row"] for cell in cells if cell["heading"]]
                title_row = min(bold_rows) if bold_rows else None

            for cell in cells:
                text = cell["text"]
                if not cell["heading"]:
                    if heading is not None:
                        groups[heading].append(text)
                    continue

                if pageno == 1 and cell["row"] == title_row:
                    title_parts.append(text)
                    continue

                # The rest of the heading above this one, rather than a
                # heading of its own. Joined without a space when the
                # fragment is a split word rather than a new one.
                wraps_line = at and cell["column"] == at[0] and 0 < cell["row"] - at[1] <= HEADING_WRAP_ROWS
                if heading is not None and wraps_line:
                    joiner = "" if text[:1].islower() else " "
                    heading = rename(heading, f"{heading}{joiner}{text}")
                    at = (cell["column"], cell["row"])
                    continue

                heading = text
                at = (cell["column"], cell["row"])
                if heading not in groups:
                    groups[heading] = []
                    order.append(heading)

    entries = sum(len(groups[name]) for name in order)
    payload = {
        "source": path.split("/")[-1],
        "title": " ".join(title_parts) or None,
        "groupCount": len(order),
        "entryCount": entries,
        "groups": [{"name": name, "entries": groups[name]} for name in order],
    }
    with open(out, "w", encoding="utf8") as handle:
        json.dump(payload, handle, ensure_ascii=False, indent=2)
        handle.write("\n")

    print(f"{entries} entries in {len(order)} group(s) → {out}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
