// Mobile section menu. No data is stored or sent.
(() => {
  const nav = document.querySelector(".nav");
  const toggle = nav?.querySelector(".nav-toggle");
  const links = nav?.querySelector(".lk");
  if (!nav || !toggle || !links) return;

  const setOpen = open => {
    toggle.setAttribute("aria-expanded", String(open));
    toggle.setAttribute("aria-label", open ? "Bölüm menüsünü kapat" : "Bölüm menüsünü aç");
    links.classList.toggle("open", open);
  };

  toggle.addEventListener("click", () => {
    setOpen(toggle.getAttribute("aria-expanded") !== "true");
  });

  links.addEventListener("click", event => {
    if (event.target.closest("a")) setOpen(false);
  });

  document.addEventListener("pointerdown", event => {
    if (!nav.contains(event.target)) setOpen(false);
  });

  document.addEventListener("keydown", event => {
    if (event.key === "Escape" && toggle.getAttribute("aria-expanded") === "true") {
      setOpen(false);
      toggle.focus();
    }
  });

  const desktop = window.matchMedia("(min-width:701px)");
  const closeOnDesktop = event => { if (event.matches) setOpen(false); };
  if (desktop.addEventListener) desktop.addEventListener("change", closeOnDesktop);
  else desktop.addListener(closeOnDesktop);
})();
