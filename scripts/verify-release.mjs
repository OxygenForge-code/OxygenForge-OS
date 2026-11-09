#!/usr/bin/env node
/**
 * Release guard for OxygenForgeOS.
 *
 * Checks that every ISO manifest has a matching uploaded GitHub release asset,
 * that its size and SHA-256 digest match, and that the download URL works.
 * It also checks all local links and asset references in the static site.
 *
 * Usage:
 *   node scripts/verify-release.mjs
 *   RELEASE_TAG=V1 node scripts/verify-release.mjs
 */
import { existsSync, readdirSync, readFileSync } from "node:fs";
import { readFile, readdir } from "node:fs/promises";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import vm from "node:vm";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const siteDir = join(root, "OxygenForgeOS-site");
const downloadsDir = join(siteDir, "downloads");
const repo = process.env.GITHUB_REPOSITORY || "OxygenForge-code/OxygenForge-OS";
const tag = String(process.env.RELEASE_TAG || "V1").trim();
const token = String(process.env.GITHUB_TOKEN || "").trim();
const attempts = Math.max(1, Number(process.env.WAIT_ATTEMPTS || 1));
const waitSeconds = Math.max(1, Number(process.env.WAIT_SECONDS || 10));

const headers = {
  Accept: "application/vnd.github+json",
  "User-Agent": "oxygenforge-release-check",
  "X-GitHub-Api-Version": "2022-11-28"
};
if (token) headers.Authorization = `Bearer ${token}`;

const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

function fail(message) {
  throw new Error(message);
}

async function readSiteConfig() {
  const source = await readFile(join(siteDir, "config.js"), "utf8");
  const sandbox = {};
  vm.runInNewContext(`${source}\n;globalThis.__SITE__ = SITE;`, sandbox, {
    filename: "OxygenForgeOS-site/config.js"
  });
  if (!sandbox.__SITE__) fail("config.js içinde SITE bulunamadı");
  return sandbox.__SITE__;
}

async function readManifests(site) {
  const files = (await readdir(downloadsDir))
    .filter(file => file.endsWith(".json"))
    .sort();
  if (files.length === 0) fail("downloads/ içinde ISO manifesti yok");

  const manifests = [];
  for (const file of files) {
    const manifest = JSON.parse(await readFile(join(downloadsDir, file), "utf8"));
    const required = ["edition", "arch", "version", "file", "bytes", "sha256"];
    for (const key of required) {
      if (manifest[key] === undefined || manifest[key] === "") {
        fail(`${file}: '${key}' alanı eksik`);
      }
    }
    if (!Number.isSafeInteger(manifest.bytes) || manifest.bytes <= 0) {
      fail(`${file}: 'bytes' pozitif bir tam sayı olmalı`);
    }
    if (!/^[a-f0-9]{64}$/i.test(manifest.sha256)) {
      fail(`${file}: SHA-256 64 karakterlik hex olmalı`);
    }
    if (manifest.version !== site.version) {
      fail(`${file}: manifest sürümü ${manifest.version}, site sürümü ${site.version}`);
    }

    const config = site.releases?.[manifest.edition]?.[manifest.arch];
    if (!config?.url) {
      fail(`${file}: config.js içinde ${manifest.edition}/${manifest.arch} indirme URL'si yok`);
    }
    const expectedUrl = `https://github.com/${repo}/releases/download/${encodeURIComponent(tag)}/${encodeURIComponent(manifest.file)}`;
    if (config.url !== expectedUrl) {
      fail(`${file}: config.js URL'si beklenen adresten farklı\n  beklenen: ${expectedUrl}\n  bulunan:  ${config.url}`);
    }
    if (String(config.sha256).toLowerCase() !== manifest.sha256.toLowerCase()) {
      fail(`${file}: config.js SHA-256 değeri manifest ile eşleşmiyor`);
    }
    manifests.push(manifest);
  }
  return manifests;
}

function checkLocalSiteLinks() {
  const errors = [];
  let checked = 0;

  const htmlFiles = readdirSync(siteDir).filter(file => file.endsWith(".html"));
  for (const file of htmlFiles) {
    const html = readFileSync(join(siteDir, file), "utf8");
    for (const match of html.matchAll(/(?:href|src)="([^"]+)"/g)) {
      const href = match[1].trim();
      if (!href || href.startsWith("#")) continue;
      if (/^(?:https?:|mailto:|tel:|data:|javascript:)/i.test(href)) continue;

      const pathPart = href.split(/[?#]/, 1)[0];
      if (!pathPart) continue;
      const target = pathPart.startsWith("/")
        ? join(siteDir, pathPart)
        : join(dirname(join(siteDir, file)), pathPart);
      checked++;
      if (!existsSync(target)) errors.push(`${file}: ${href}`);
    }
  }

  if (errors.length) {
    fail(`Site içinde eksik yerel dosya/bağlantı var:\n  ${errors.join("\n  ")}`);
  }
  return { htmlFiles: htmlFiles.length, checked };
}

async function github(path) {
  const response = await fetch(`https://api.github.com${path}`, { headers });
  if (!response.ok) {
    const body = await response.text();
    fail(`GitHub API ${response.status}: ${body.slice(0, 300)}`);
  }
  return response.json();
}

async function checkDownload(url) {
  const response = await fetch(url, {
    headers: { Range: "bytes=0-0" },
    redirect: "follow",
    signal: AbortSignal.timeout(45_000)
  });
  if (response.status !== 200 && response.status !== 206) {
    fail(`İndirme adresi HTTP ${response.status} döndü: ${url}`);
  }
  await response.body?.cancel().catch(() => {});
}

async function main() {
  const siteOnly = process.argv.includes("--site-only");
  const site = await readSiteConfig();
  const manifests = await readManifests(site);
  const siteCheck = checkLocalSiteLinks();
  console.log(`✓ Site: ${siteCheck.htmlFiles} HTML dosyası, ${siteCheck.checked} yerel bağlantı kontrol edildi`);
  if (siteOnly) {
    console.log("✓ Site kontrolü tamamlandı (release API atlandı)");
    return;
  }

  let release;
  for (let attempt = 1; attempt <= attempts; attempt++) {
    release = await github(`/repos/${repo}/releases/tags/${encodeURIComponent(tag)}`);
    const pending = manifests.some(manifest => {
      const asset = release.assets?.find(item => item.name === manifest.file);
      return !asset || asset.state !== "uploaded" || !asset.digest;
    });
    if (!pending) break;
    if (attempt < attempts) {
      console.log(`… ${tag} asset'leri hazır değil; ${waitSeconds} sn sonra tekrar denenecek (${attempt}/${attempts})`);
      await sleep(waitSeconds * 1000);
    }
  }

  if (release.draft) fail(`${tag} taslak sürüm; yayınlanmadan doğrulanamaz`);

  for (const manifest of manifests) {
    const asset = release.assets?.find(item => item.name === manifest.file);
    if (!asset) fail(`${tag}: ${manifest.file} asset'i bulunamadı`);
    if (asset.state !== "uploaded") fail(`${tag}: ${manifest.file} durumu '${asset.state}'`);
    if (asset.size !== manifest.bytes) {
      fail(`${tag}: ${manifest.file} boyutu ${asset.size}, beklenen ${manifest.bytes}`);
    }
    const digest = String(asset.digest || "").toLowerCase();
    if (digest !== `sha256:${manifest.sha256.toLowerCase()}`) {
      fail(`${tag}: ${manifest.file} SHA-256 özeti GitHub ile eşleşmiyor`);
    }
    const expectedUrl = `https://github.com/${repo}/releases/download/${encodeURIComponent(tag)}/${encodeURIComponent(manifest.file)}`;
    if (asset.browser_download_url !== expectedUrl) {
      fail(`${tag}: ${manifest.file} indirme URL'si beklenenden farklı`);
    }
    await checkDownload(asset.browser_download_url);
    console.log(`✓ ${manifest.file}: uploaded, ${asset.size} bayt, SHA-256 eşleşti, indirme erişilebilir`);
  }

  console.log(`✓ ${tag}: ${manifests.length} ISO asset'i doğrulandı`);
}

main().catch(error => {
  console.error(`✗ ${error.message}`);
  process.exitCode = 1;
});
