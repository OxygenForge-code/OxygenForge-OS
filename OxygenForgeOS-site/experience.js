// Interactive, client-only experiences. No data leaves the browser and nothing is persisted.
(() => {
  const S = SITE;

  /* ---------- Install wizard ---------- */
  const wiz = $("#wizard-root");
  if (wiz) {
    const labels = ["Kullanım", "Mimari", "Şifreleme"];
    let step = 0;
    const answers = {};

    const result = () => {
      const use = answers.use, arch = answers.arch, rel = (S.releases[use] || {})[arch] || {};
      const name = `${use === "desktop" ? "Desktop" : "Server"} · ${arch === "x86_64" ? "x86_64" : "ARM64"}`;
      const ready = Boolean(rel.url);
      const enc = answers.enc === "yes"
        ? "Kurulumda LUKS tam disk şifrelemeyi aç; kurtarma anahtarını cihazdan ayrı sakla."
        : "LUKS’i kurulum ekranında istediğin an açabilirsin; sonradan karar vermek de mümkün.";
      return `<div class="wiz">
        <div class="wiz-steps">${labels.map((l, i) => `<span class="done"><b>✓</b>${l}</span>`).join("")}</div>
        <div class="wiz-card glass">
          <span class="eyebrow">Önerilen imaj</span>
          <h3 tabindex="-1">${name}</h3>
          <p>${S.editions[use]} ${enc}</p>
          <div class="wiz-meta">
            <span>${rel.size || "Henüz yayınlanmadı"}</span>
            <span>${use === "desktop" ? "XFCE · Calamares" : "Konsol · nftables"}</span>
            <span>${arch === "x86_64" ? "UEFI + BIOS" : "ARM64 cihaz"}</span>
          </div>
          <div class="wiz-actions">
            ${ready
              ? `<button type="button" class="btn primary" data-download>${name} indir →</button>`
              : `<a class="btn" href="${S.repo}/releases" target="_blank" rel="noopener">Henüz yayınlanmadı · Releases</a>`}
            <button type="button" class="btn" data-reset>Baştan başla</button>
          </div>
          <p class="wiz-note">${ready ? "İndirdikten sonra SHA-256 değerini Doğrulama bölümünde kontrol et." : "Bu mimari için imaj henüz hazır değil; mevcut sürümleri Releases sayfasında bulabilirsin."}</p>
        </div>
      </div>`;
    };

    const focusHeading = () => requestAnimationFrame(() => wiz.querySelector(".wiz-card h3")?.focus());

    const render = () => {
      if (step > 2) { wiz.innerHTML = result(); return; }
      const q = S.wizard.questions[step];
      wiz.innerHTML = `<div class="wiz">
        <div class="wiz-steps">${labels.map((l, i) => `<span class="${i < step ? "done" : i === step ? "active" : ""}"><b>${i < step ? "✓" : i + 1}</b>${l}</span>`).join("")}</div>
        <div class="wiz-card glass">
          <span class="eyebrow">Adım ${step + 1} / 3</span>
          <h3 tabindex="-1">${q.title}</h3><p>${q.hint}</p>
          <div class="wiz-opts">${q.options.map(o => `<button type="button" class="wiz-opt ${answers[q.key] === o.v ? "selected" : ""}" data-key="${q.key}" data-value="${o.v}"><b>${o.t}</b><span>${o.d}</span></button>`).join("")}</div>
          <div class="wiz-foot"><button type="button" class="wiz-back" data-back ${step === 0 ? "disabled" : ""}>← Geri</button><span>${Object.keys(answers).length} / 3 seçildi</span></div>
        </div>
      </div>`;
    };

    wiz.addEventListener("click", event => {
      const button = event.target.closest("button");
      if (!button) return;
      if (button.dataset.back !== undefined) { if (step > 0) { step--; render(); focusHeading(); } return; }
      if (button.dataset.reset !== undefined) { step = 0; for (const k of Object.keys(answers)) delete answers[k]; render(); focusHeading(); return; }
      if (button.dataset.download !== undefined) {
        ed.value = answers.use; ar.value = answers.arch;
        ed.dispatchEvent(new Event("change")); ar.dispatchEvent(new Event("change"));
        $("#dl").requestSubmit(); return;
      }
      if (button.dataset.key) {
        answers[button.dataset.key] = button.dataset.value;
        step++; render(); focusHeading();
      }
    });
    render();
  }

  /* ---------- Privacy Center demo ---------- */
  const demo = $("#privacy-demo");
  if (demo) {
    const icons = { dns: "lock", fw: "shield", mac: "sliders", crash: "doc" };
    let state = Object.fromEntries(S.privacyDemo.map(x => [x.k, x.on]));

    const render = () => {
      const count = Object.values(state).filter(Boolean).length;
      const status = count === 4 ? "Tam koruma" : count === 3 ? "Korunuyor" : count === 2 ? "Kısmi koruma" : "Dikkat";
      demo.innerHTML = `<div class="pdemo">
        <div class="pdemo-head">
          <div class="pdemo-ring" style="--p:${count * 25}" aria-live="polite"><div><strong>${count}/4</strong><span>${status}</span></div></div>
          <div class="pdemo-copy"><span class="eyebrow">Etkileşimli demo</span><h3>Gizlilik Merkezi</h3><p>Anahtarları dene; gerçek OxygenForgeOS’ta bu ayarlar tek panelden yönetilir. Bu demo hiçbir sistemi değiştirmez.</p></div>
          <button type="button" class="btn" data-pd-reset>Varsayılana dön</button>
        </div>
        <div class="pd-list">${S.privacyDemo.map(x => {
          const on = state[x.k];
          return `<button type="button" class="pd-row ${on ? "on" : ""}" data-k="${x.k}" role="switch" aria-checked="${on}">
            <span class="pd-ico"><svg width="18" height="18"><use href="#i-${icons[x.k] || "shield"}"/></svg></span>
            <span class="pd-text"><b>${x.t}</b><em>${x.s}</em><small>${x.d}</small></span>
            <span class="pd-switch" aria-hidden="true"><i></i></span>
          </button>`;
        }).join("")}</div>
        <p class="wiz-note">Varsayılan: şifreli DNS, güvenlik duvarı ve MAC rastgeleleştirme açık; çökme dökümleri kapalı.</p>
      </div>`;
    };

    demo.addEventListener("click", event => {
      if (event.target.closest("[data-pd-reset]")) {
        state = Object.fromEntries(S.privacyDemo.map(x => [x.k, x.on]));
        render(); return;
      }
      const row = event.target.closest("[data-k]");
      if (!row) return;
      state[row.dataset.k] = !state[row.dataset.k];
      render();
    });
    render();
  }
})();
