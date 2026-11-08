# Sürüm notları

## 1.0 “Forge” — 2026-11-08

İlk genel sürüm.

- Debian 13 “trixie” tabanı, amd64 ve arm64 hedefleri
- XFCE masaüstü, LightDM, PipeWire, Firefox ESR, KeePassXC
- Liquid glass masaüstü: picom dual-kawase blur, yuvarlatılmış pencereler,
  yarı saydam GTK3/GTK4 yüzeyleri ve cam görünümlü Calamares
- Calamares kurulum: LUKS tam disk şifreleme, ext4/btrfs/xfs, UEFI ve BIOS
- OxygenForge Gizlilik Merkezi: DNS-over-TLS, nftables, MAC rastgeleleştirme,
  yerel çökme dökümü denetimi
- Varsayılan olarak telemetri yok, otomatik güncelleme yok, mDNS/LLMNR kapalı
- Quad9 DNS-over-TLS varsayılanı
- Sunucu profili: konsol, OpenSSH (kapalı), nftables, fail2ban
- Plymouth açılış teması, GRUB teması, özgün duvar kâğıtları
- Türkçe gizlilik politikası ve site entegrasyonu

### Bilinen sorunlar

- Secure Boot imzası yok.
- NVIDIA kapalı kaynak sürücüsü varsayılan değil.
- ISO'lar bit düzeyinde tekrarlanabilir değil.
