import { createInstallControl } from "../js/install.js";
document.getElementById("install-control").appendChild(createInstallControl());
if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("../sw.js").catch(() => {});
}
