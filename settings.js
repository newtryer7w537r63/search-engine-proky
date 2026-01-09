(() => {
  if (localStorage.getItem("aboutBlank") === null) localStorage.setItem("aboutBlank", "disabled");

  const isAboutBlankEnabled = localStorage.getItem("aboutBlank") === "enabled";

  if (isAboutBlankEnabled) {
    let inFrame;
    try { inFrame = window !== top; } catch { inFrame = true; }

    if (!inFrame && !navigator.userAgent.includes("Firefox")) {
      const popup = open("about:blank", "_blank");
      if (!popup || popup.closed) {
        alert("To hide from filters, allow popups and reload.");
      } else {
        const d = popup.document;
        const t = localStorage.getItem("TabCloak_Title") || "about:blank";
        const f = localStorage.getItem("TabCloak_Favicon");

        d.title = t;
        if (f) {
          const l = d.createElement("link");
          l.rel = "icon";
          l.href = f;
          d.head.appendChild(l);
        }

        const i = d.createElement("iframe");
        i.src = location.href;
        i.style = "position:fixed;top:0;left:0;width:100%;height:100%;border:none;outline:none";
        d.body.appendChild(i);

        location.replace("https://classroom.google.com");
      }
    }
  }

  const presets = {
    google: { title: "Google", favicon: "/assets/images/cloaks/gsearch.ico" },
    classroom: { title: "Home", favicon: "https://ssl.gstatic.com/classroom/favicon.png" },
    bing: { title: "Bing", favicon: "https://bing.com/favicon.ico" },
    nearpod: { title: "Nearpod", favicon: "https://nearpod.com/favicon.ico" },
    powerschool: { title: "PowerSchool Sign In", favicon: "https://powerschool.com/favicon.ico" },
    edge: { title: "New Tab", favicon: "/assets/images/newtabedge.png" },
    chrome: { title: "New Tab", favicon: "/assets/images/newtab.png" },
    lausd: { title: "Los Angeles Unified School District / Homepage", favicon: "https://www.lausd.org/cms/lib/CA01000043/Centricity/template/globalassets/images/favicon/favicon1.ico" }
  };

  const titleInput = document.getElementById("customTitle");
  const faviconInput = document.getElementById("customFavicon");
  const presetSelect = document.getElementById("presetSelect");

  function apply(title, favicon) {
    if (title) {
      document.title = title;
      localStorage.setItem("TabCloak_Title", title);
    }
    if (favicon) {
      document.querySelectorAll("link[rel~='icon'],link[rel='shortcut icon']")
        .forEach(e => e.href = favicon);
      localStorage.setItem("TabCloak_Favicon", favicon);
    }
  }

  document.getElementById("applyBtn").onclick = () => {
    apply(titleInput.value, faviconInput.value);
  };

  document.getElementById("resetBtn").onclick = () => {
    localStorage.removeItem("TabCloak_Title");
    localStorage.removeItem("TabCloak_Favicon");
    document.title = "Jordan's Math Work - V7";
    const icon = document.querySelector("link[rel~='icon']");
    if (icon) icon.href = "/assets/images/jmw.png";
    titleInput.value = "";
    faviconInput.value = "";
    presetSelect.value = "";
  };

  presetSelect.onchange = () => {
    const p = presets[presetSelect.value];
    if (p) {
      titleInput.value = p.title;
      faviconInput.value = p.favicon;
      apply(p.title, p.favicon);
    }
  };

  let hotkey = localStorage.getItem("hotkey") || "`";
  let redirectURL = localStorage.getItem("redirectURL") || "https://google.com";

  const hotkeyInput = document.getElementById("hotkey-input");
  const redirectURLInput = document.getElementById("redirect-url-input");

  hotkeyInput.value = hotkey;
  redirectURLInput.value = redirectURL;

  hotkeyInput.onkeydown = e => {
    e.preventDefault();
    if (e.key.length === 1 || e.key === "Escape" || e.key.startsWith("F")) {
      hotkeyInput.value = e.key;
    }
  };

  document.getElementById("change-hotkey-btn").onclick = () => {
    const k = hotkeyInput.value.trim();
    if (!k) return alert("Enter a hotkey.");
    hotkey = k;
    localStorage.setItem("hotkey", k);
    alert("Hotkey changed to: " + k);
  };

  document.getElementById("change-URL-btn").onclick = () => {
    let u = redirectURLInput.value.trim();
    if (u && !/^https?:\/\//i.test(u)) u = "https://" + u;
    if (u && !/\.[a-z]{2,}$/i.test(u)) u += ".com";
    redirectURL = u;
    localStorage.setItem("redirectURL", u);
    alert("Redirect URL changed to: " + u);
  };

  window.onkeydown = e => {
    if (e.key === hotkey) location.replace(redirectURL);
  };

  const savedTitle = localStorage.getItem("TabCloak_Title");
  const savedFavicon = localStorage.getItem("TabCloak_Favicon");

  if (savedTitle) document.title = savedTitle;
  if (savedFavicon) {
    document.querySelectorAll("link[rel~='icon'],link[rel='shortcut icon']")
      .forEach(e => e.href = savedFavicon);
  }
  if (savedTitle) titleInput.value = savedTitle;
  if (savedFavicon) faviconInput.value = savedFavicon;

  const aboutBlankToggle = document.getElementById("aboutBlankToggle");
  aboutBlankToggle.checked = isAboutBlankEnabled;

  aboutBlankToggle.onchange = () => {
    localStorage.setItem("aboutBlank", aboutBlankToggle.checked ? "enabled" : "disabled");
    location.reload();
  };

  if (localStorage.getItem("leaveConfirmation") === "enabled") {
    window.onbeforeunload = () => "";
  }

  window.launchBlob = () => {
    const frame = `<iframe src="https://${location.host}/index.html" style="position:fixed;top:0;left:0;width:100%;height:100%;border:none"></iframe>`;
    const blob = new Blob([frame], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const win = open(url);

    if (win) {
      win.onload = () => {
        const t = localStorage.getItem("TabCloak_Title") || "about:blank";
        const f = localStorage.getItem("TabCloak_Favicon");
        win.document.title = t;
        if (f) {
          const l = win.document.createElement("link");
          l.rel = "icon";
          l.href = f;
          win.document.head.appendChild(l);
        }
      };
    }
  };
})();
