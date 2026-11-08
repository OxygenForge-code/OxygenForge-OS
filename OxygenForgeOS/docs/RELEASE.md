# Sürüm yayınlama

## 1. Sürümü hazırla

- `VERSION` dosyasını güncelle (ör. `1.1`).
- `usr/lib/os-release`, `etc/lsb-release`, `etc/issue`, Calamares branding ve
  site `config.js` sürümlerini aynı değere getir.
- Sürüm notlarını `docs/CHANGELOG.md` ve site `config.js` içine yaz.

## 2. Derle

Her iki sürüm ve desteklenen mimariler için:

```bash
sudo ./build.sh desktop
sudo ./build.sh server
```

ARM64 ayrı bir arm64 makinede üretilir. Her ISO için `out/*.json` ve
`out/*.sha256` dosyalarını sakla.

## 3. Test matrisi

- [ ] UEFI + Secure Boot kapalı, boş disk, LUKS açık kurulum
- [ ] BIOS/CSM kurulum
- [ ] Windows yanına kurulum; bölümleme ekranı veri kaybı uyarısı
- [ ] Canlı oturum: oturum açma, ses, Wi-Fi, ekran parlaklığı, Türkçe klavye
- [ ] Liquid glass: `pgrep -x picom`, pencere arkası bulanıklığı ve yuvarlatılmış köşeler
- [ ] Firefox: telemetri kapalı, sponsorlu içerik yok, arama önerisi kapalı
- [ ] Gizlilik Merkezi: dört anahtarın aç/kapat ve varsayılana dönüş
- [ ] Yeniden başlatma sonrası ayarların kalıcılığı
- [ ] Sunucu: `oxygenforge-installer`, SSH kapalı, nftables açık
- [ ] Sunucuda SSH'ı açıp fail2ban'ın çalıştığını doğrulama
- [ ] `oxygenforge-firstboot` sonrası SSH anahtarları
- [ ] `resolvectl status` DoT, `nft list ruleset` varsayılan politikalar
- [ ] Kurulum sonrası `calamares`, `live-boot`, `live-config` kaldırılmış

## 4. Özet ve imza

```bash
./scripts/release.sh
```

`out/SHA256SUMS` üretilir. `MINISIGN_KEY` verirsen `minisign` ile imzalanır;
aksi halde GPG komutu önerilir. Özel anahtarı depoya koyma.

## 5. Yayınla

ISO'ları ve `SHA256SUMS` dosyasını statik sunucuya yükle. Dosya adları sitenin
beklediği biçimde olmalı:

- `OxygenForgeOS-desktop-x86_64.iso`
- `OxygenForgeOS-server-x86_64.iso`
- `OxygenForgeOS-desktop-arm64.iso`
- `OxygenForgeOS-server-arm64.iso`

## 6. Siteyi güncelle

`OxygenForgeOS-site/config.js` içindeki ilgili sürüm için:

```js
releases: {
  desktop: {
    x86_64: {
      url: "https://<alan-adin>/downloads/OxygenForgeOS-desktop-x86_64.iso",
      size: "2.4 GB",
      sha256: "<64 karakter>"
    }
  }
}
```

`out/*.json` dosyası bu üç değeri içerir. Site sayfasındaki SHA-256 doğrulama
bölümü aynı değeri gösterir. Yayından sonra:

- `https://<alan-adin>/OxygenForgeOS-desktop-x86_64.iso` indirilebiliyor mu?
- `.sha256` içeriği `sha256sum -c` ile eşleşiyor mu?
- Site gizlilik politikası hâlâ doğru mu? (Yeni ağ uç noktası eklediysen
  `gizlilik.html` ve `docs/PRIVACY.md` güncelle.)

## 7. Geri çekme

Bir ISO güvenlik sorunu içeriyorsa:

1. İndirme bağlantısını kaldır, sayfada uyarı yayınla.
2. `SHA256SUMS` ve imzayı yeni sürümle değiştir.
3. `SECURITY.md` sürecini başlat, etkilenen sürümü duyur.
