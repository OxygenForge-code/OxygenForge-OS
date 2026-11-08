#!/usr/bin/env bash
# Prepare a release directory: checksums, optional signature, website snippet.
set -Eeuo pipefail

ROOT="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT"

VERSION="$(tr -d '[:space:]' < VERSION)"

shopt -s nullglob
isos=(out/*.iso)
if [ "${#isos[@]}" -eq 0 ]; then
  echo "out/ içinde ISO yok. Önce ./build.sh desktop veya server çalıştır." >&2
  exit 1
fi

echo "==> SHA-256 özetleri"
(
  cd out
  sha256sum *.iso > SHA256SUMS
  cat SHA256SUMS
)

if command -v minisign >/dev/null 2>&1; then
  if [ -n "${MINISIGN_KEY:-}" ]; then
    echo "==> minisign ile imzalanıyor"
    minisign -Sm out/SHA256SUMS -s "$MINISIGN_KEY"
  else
    echo "İpucu: imzalamak için MINISIGN_KEY=/path/to/key ./scripts/release.sh"
  fi
elif command -v gpg >/dev/null 2>&1; then
  echo "İpucu: gpg --detach-sign --armor out/SHA256SUMS"
else
  echo "UYARI: minisign/gpg bulunamadı; imza üretilmedi." >&2
fi

echo
echo "==> Site config.js için değerler"
for json in out/*.json; do
  [ -f "$json" ] || continue
  edition="$(basename "$json" .json)"
  echo "--- $edition"
  sed -n '1,20p' "$json"
  iso_file="$(sed -n 's/.*"file": "\([^"]*\)".*/\1/p' "$json")"
  echo
  echo "url: \"https://<alan-adin>/downloads/$iso_file\""
  echo "size: \"$(sed -n 's/.*"size": "\([^"]*\)".*/\1/p' "$json")\""
  echo "sha256: \"$(sed -n 's/.*"sha256": "\([^"]*\)".*/\1/p' "$json")\""
done
