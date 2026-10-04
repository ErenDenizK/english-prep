# ADR 013 — Restore page entrances; distinguish browser and application space

Accepted, 4 October 2026. The owner prefers the page openings from v0.72 after
trying v0.73. Restore the exact Home, Education, Profile, Quiz and Results
entrance callers from that version and remove the unused 620ms arrival helper.
Keep button press/release, the 20% slower atmosphere and elastic scroll rail.
Onboarding and About artwork are unchanged. This supersedes only ADR 012’s
page-opening decision; there is no new animation restriction.

The marked lower strip in the supplied iPhone capture is browser-owned URL
and navigation UI. A page cannot hide it with CSS or JavaScript. The manifest
already requests `display: standalone`; a home-screen installation launched
from its icon is the supported address-bar-free experience. Installation copy
now explains the benefit and the iPhone/iPad path, including the optional
“Open as Web App” setting where present. Never claim installation or native
browser-chrome removal from a website button. No forced fullscreen prompt or
scroll-to-hide workaround is introduced.

The app shell follows `100dvh` with its existing `svh`/`vh` fallback, preserving
safe-area insets and the two-tab navigation. When a browser changes available
height, the app can use that space. This does not force Safari’s tools to
collapse and does not simulate an installed app.

Apple, MDN and WebKit documentation requests in this follow-up were blocked by
the environment proxy (403), so they are not claimed as freshly retrieved
research. Verify real page flows and install-state branches in the browser;
emulation does not establish physical Safari toolbar behavior. Content,
scoring, storage and preserved versions remain unchanged.
