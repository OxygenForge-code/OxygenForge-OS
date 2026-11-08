#!/usr/bin/env bash
# Fast, non-root checks that can run before an ISO build.
set -Eeuo pipefail

ROOT="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT"

fail=0
note() { printf '  %s\n' "$*"; }
bad() { printf 'HATA: %s\n' "$*" >&2; fail=1; }

echo "==> Zorunlu dosyalar"
required=(
  VERSION
  README.md
  LICENSE
  build.sh
  auto/config
  config/includes.chroot/usr/lib/os-release
  config/includes.chroot/etc/firefox/policies/policies.json
  config/includes.chroot/etc/nftables.conf
  config/includes.chroot/etc/calamares/settings-desktop.conf
  config/includes.chroot/etc/calamares/settings-server.conf
  config/includes.chroot/usr/local/bin/oxygenforge-privacy
  config/includes.chroot/usr/local/bin/oxygenforge-welcome
  config/includes.chroot/usr/local/bin/oxygenforge-liquid
  config/includes.chroot/etc/xdg/picom.conf
  config/includes.chroot/etc/gtk-3.0/gtk.css
  config/includes.chroot/etc/gtk-4.0/gtk.css
  config/includes.chroot/usr/libexec/oxygenforge-privacy-helper
  config/hooks/normal/0400-calamares.hook.chroot
)
for f in "${required[@]}"; do
  if [ -e "$f" ]; then note "ok  $f"; else bad "eksik $f"; fi
done

echo "==> Kabuk sözdizimi"
while IFS= read -r -d '' f; do
  if bash -n "$f" 2>/dev/null; then note "ok  $f"; else bad "sözdizimi $f"; fi
done < <(find build.sh scripts config/hooks auto -type f \( -name '*.sh' -o -name '*.chroot' -o -name '*.binary' -o -name 'config' \) -print0)

echo "==> JSON"
if command -v python3 >/dev/null 2>&1; then
  while IFS= read -r -d '' f; do
    if python3 -m json.tool "$f" >/dev/null 2>&1; then note "ok  $f"; else bad "JSON $f"; fi
  done < <(find config -type f -name '*.json' -print0)
elif command -v node >/dev/null 2>&1; then
  while IFS= read -r -d '' f; do
    if node -e 'JSON.parse(require("fs").readFileSync(process.argv[1], "utf8"))' "$f" >/dev/null 2>&1; then
      note "ok  $f"
    else
      bad "JSON $f"
    fi
  done < <(find config -type f -name '*.json' -print0)
else
  echo "  atlandı (python3/node yok)"
fi

echo "==> Python uygulamaları"
if command -v python3 >/dev/null 2>&1; then
  while IFS= read -r -d '' f; do
    if python3 -m py_compile "$f" >/dev/null 2>&1; then
      note "ok  $f"
    else
      bad "Python $f"
    fi
  done < <(find config/includes.chroot/usr -type f \( -name 'oxygenforge-privacy' -o -name 'oxygenforge-welcome' \) -print0)
  rm -rf config/includes.chroot/usr/local/bin/__pycache__
else
  echo "  atlandı (python3 yok)"
fi

echo "==> XML"
if command -v python3 >/dev/null 2>&1; then
  while IFS= read -r -d '' f; do
    if python3 - "$f" <<'PY' >/dev/null 2>&1
import sys
import xml.etree.ElementTree as ET
ET.parse(sys.argv[1])
PY
    then
      note "ok  $f"
    else
      bad "XML $f"
    fi
  done < <(find config -type f \( -name '*.xml' -o -name '*.policy' \) -print0)
else
  echo "  atlandı (python3 yok)"
fi

echo "==> Paket listeleri"
for f in profiles/*/package-lists/*.list.chroot; do
  if grep -Eq '^[a-z0-9]' "$f"; then note "ok  $f"; else bad "boş paket listesi $f"; fi
done

echo "==> Çalıştırılabilir betikler"
for f in build.sh scripts/*.sh config/includes.chroot/usr/local/bin/* \
         config/includes.chroot/usr/libexec/* config/hooks/normal/*.chroot \
         config/hooks/binary/*.binary; do
  [ -e "$f" ] || continue
  if [ -x "$f" ]; then note "ok  $f"; else bad "çalıştırma izni yok: chmod +x $f"; fi
done

echo
if [ "$fail" -ne 0 ]; then
  echo "Kontroller başarısız." >&2
  exit 1
fi
echo "Tüm kontroller geçti."
