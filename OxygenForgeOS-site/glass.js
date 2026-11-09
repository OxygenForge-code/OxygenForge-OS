// Liquid glass: the light follows the pointer without reading any device data.
(() => {
  const surfaces = document.querySelectorAll(
    ".hero, .nav, .glass, .benefits, .features, .card, .rc, .legal-card, .pitem, .tldr div, .bento-card, .desk, .stop, .btn"
  );

  for (const surface of surfaces) {
    surface.classList.add("liquid");
    let frame = 0;

    surface.addEventListener("pointermove", event => {
      if (frame) return;
      frame = requestAnimationFrame(() => {
        const rect = surface.getBoundingClientRect();
        surface.style.setProperty("--mx", `${((event.clientX - rect.left) / rect.width) * 100}%`);
        surface.style.setProperty("--my", `${((event.clientY - rect.top) / rect.height) * 100}%`);
        frame = 0;
      });
    });

    surface.addEventListener("pointerleave", () => {
      surface.style.removeProperty("--mx");
      surface.style.removeProperty("--my");
    });
  }
})();
