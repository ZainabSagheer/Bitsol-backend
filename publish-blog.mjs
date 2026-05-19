#!/usr/bin/env node
/**
 * BITSOL MARKETING — Blog Publish Script
 *
 * Reads an SEO content package (.md), extracts the article,
 * converts it to HTML, and writes DIRECTLY to MongoDB via Prisma.
 * No dev server needed.
 *
 * Usage:
 *   node scripts/publish-blog.mjs --file "../../SEO AGENT/content/my-package.md"
 */

import { readFileSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const projectRoot = resolve(__dirname, "..");

// ─── Load .env manually ──────────────────────────────────────────────────────
function loadEnv() {
  const envPath = resolve(projectRoot, ".env");
  const localPath = resolve(projectRoot, ".env.local");
  for (const p of [envPath, localPath]) {
    try {
      const lines = readFileSync(p, "utf8").split("\n");
      for (const line of lines) {
        const trimmed = line.trim();
        if (!trimmed || trimmed.startsWith("#")) continue;
        const eq = trimmed.indexOf("=");
        if (eq === -1) continue;
        const key = trimmed.slice(0, eq).trim();
        let val = trimmed.slice(eq + 1).trim();
        if ((val.startsWith('"') && val.endsWith('"')) ||
            (val.startsWith("'") && val.endsWith("'"))) {
          val = val.slice(1, -1);
        }
        if (!process.env[key]) process.env[key] = val;
      }
    } catch { /* file may not exist */ }
  }
}
loadEnv();

// ─── CLI Args ────────────────────────────────────────────────────────────────
function arg(name) {
  const idx = process.argv.indexOf(`--${name}`);
  return idx !== -1 ? process.argv[idx + 1] : null;
}

const filePath = arg("file");
if (!filePath) {
  console.error("Usage: node scripts/publish-blog.mjs --file <path-to-seo-package.md>");
  process.exit(1);
}

const fullPath = resolve(__dirname, filePath);
console.log(`\n📄  Reading: ${fullPath}`);

let raw;
try {
  raw = readFileSync(fullPath, "utf8");
} catch {
  console.error(`❌  File not found: ${fullPath}`);
  process.exit(1);
}

// ─── Extractors ──────────────────────────────────────────────────────────────
function extractSlug(raw) {
  const m = raw.match(/\*\*Target Page:\*\*\s*`\/([^`]+)`/);
  return m ? m[1].trim() : null;
}

function extractSection(raw, n) {
  const start = raw.indexOf(`# SECTION ${n}`);
  const next = raw.indexOf(`# SECTION ${n + 1}`);
  if (start === -1) return "";
  return next !== -1 ? raw.slice(start, next) : raw.slice(start);
}

function extractArticleContent(section4) {
  const parts = section4.split(/\n---\n/);
  if (parts.length >= 3) return parts.slice(1, -1).join("\n---\n").trim();
  if (parts.length === 2) return parts[1].trim();
  return section4.replace(/^# SECTION 4[^\n]*\n/, "").trim();
}

function extractTitle(articleMd) {
  const m = articleMd.match(/^## (.+)$/m);
  return m ? m[1].trim() : null;
}

function extractMetaDescription(section10) {
  const m = section10.match(/Meta Description:\s*\n([^\n]+)/);
  return m ? m[1].trim() : null;
}

function extractMetaTitle(section10) {
  const m = section10.match(/SEO Title:\s*\n([^\n]+)/);
  return m ? m[1].trim() : null;
}

function extractTags(raw) {
  const tags = [];
  const clusterMatch = raw.match(/Cluster [A-D]: ([^\n]+)/g);
  if (clusterMatch) {
    for (const c of clusterMatch) {
      const name = c
        .replace(/Cluster [A-D]: /, "")
        .replace(/\*\*/g, "")
        .trim();
      if (name) tags.push(name);
    }
  }
  return tags.length > 0 ? tags.slice(0, 5) : ["AI Marketing"];
}

function extractExcerpt(articleMd) {
  for (const line of articleMd.split("\n")) {
    const t = line.trim().replace(/\*\*/g, "");
    if (t && !t.startsWith("#") && !t.startsWith("---") && t.length > 60) {
      return t.slice(0, 200) + (t.length > 200 ? "…" : "");
    }
  }
  return null;
}

// ─── Markdown → HTML ─────────────────────────────────────────────────────────
function mdToHtml(md) {
  const lines = md.split("\n");
  const out = [];
  let inUl = false, inOl = false;
  let tableLines = [], inTable = false;

  const inline = (t) =>
    t.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
     .replace(/\*(.+?)\*/g, "<em>$1</em>")
     .replace(/`(.+?)`/g, "<code>$1</code>")
     .replace(/\[(.+?)\]\((.+?)\)/g, '<a href="$2">$1</a>');

  const flushList = () => {
    if (inUl) { out.push("</ul>"); inUl = false; }
    if (inOl) { out.push("</ol>"); inOl = false; }
  };

  const flushTable = () => {
    if (!inTable || tableLines.length === 0) return;
    inTable = false;
    const rows = tableLines.filter((l) => l.startsWith("|"));
    if (rows.length === 0) { tableLines = []; return; }
    const parseRow = (r) => r.split("|").slice(1, -1).map((c) => c.trim());
    const headers = parseRow(rows[0]);
    const dataRows = rows.slice(2);
    let t = "<table><thead><tr>";
    headers.forEach((h) => (t += `<th>${inline(h)}</th>`));
    t += "</tr></thead><tbody>";
    dataRows.forEach((row) => {
      const cells = parseRow(row);
      t += "<tr>";
      cells.forEach((c) => (t += `<td>${inline(c)}</td>`));
      t += "</tr>";
    });
    t += "</tbody></table>";
    out.push(t);
    tableLines = [];
  };

  for (const line of lines) {
    const tr = line.trim();

    if (tr.startsWith("|")) {
      flushList();
      inTable = true;
      tableLines.push(tr);
      continue;
    } else if (inTable) {
      flushTable();
    }

    if (/^#{1,4} /.test(tr)) {
      flushList();
      const lvl = tr.match(/^(#{1,4})/)[1].length;
      out.push(`<h${lvl}>${inline(tr.replace(/^#{1,4} /, ""))}</h${lvl}>`);
      continue;
    }
    if (tr === "---" || tr === "***") { flushList(); out.push("<hr/>"); continue; }
    if (/^[-*] /.test(tr)) {
      if (inOl) { out.push("</ol>"); inOl = false; }
      if (!inUl) { out.push("<ul>"); inUl = true; }
      out.push(`<li>${inline(tr.replace(/^[-*] /, ""))}</li>`);
      continue;
    }
    if (/^\d+\. /.test(tr)) {
      if (inUl) { out.push("</ul>"); inUl = false; }
      if (!inOl) { out.push("<ol>"); inOl = true; }
      out.push(`<li>${inline(tr.replace(/^\d+\. /, ""))}</li>`);
      continue;
    }
    if (tr === "") { flushList(); continue; }
    if (tr.startsWith("> ")) { flushList(); out.push(`<blockquote>${inline(tr.slice(2))}</blockquote>`); continue; }
    flushList();
    out.push(`<p>${inline(tr)}</p>`);
  }

  flushList();
  flushTable();
  return out.join("\n");
}

// ─── Parse ───────────────────────────────────────────────────────────────────
const slug = extractSlug(raw);
if (!slug) { console.error("❌  Could not extract slug."); process.exit(1); }

const section4  = extractSection(raw, 4);
const section10 = extractSection(raw, 10);
const articleMd = extractArticleContent(section4);
const title          = extractMetaTitle(section10) || extractTitle(articleMd) || slug;
const metaDescription = extractMetaDescription(section10);
const excerpt        = extractExcerpt(articleMd);
const tags           = extractTags(raw);
const contentHtml    = mdToHtml(articleMd);

console.log(`\n✅  Parsed:`);
console.log(`   Title    : ${title}`);
console.log(`   Slug     : ${slug}`);
console.log(`   Tags     : ${tags.join(", ")}`);
console.log(`   HTML len : ${contentHtml.length.toLocaleString()} chars`);

// ─── Write directly to PostgreSQL via Prisma ────────────────────────────────────
console.log(`\n💾  Writing to PostgreSQL …`);

import pg from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
const { PrismaClient } = await import("@prisma/client");

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

try {
  // Find or create an admin user
  let admin = await prisma.user.findFirst({ where: { role: "SUPER_ADMIN" } });
  if (!admin) admin = await prisma.user.findFirst();
  if (!admin) {
    admin = await prisma.user.create({
      data: {
        name: "BITSOL Marketing Team",
        email: "hello@bitsolmarketing.com",
        password: "auto-generated-pass-123!",
        role: "SUPER_ADMIN",
      }
    });
  }

  const existing = await prisma.blog.findUnique({ where: { slug } });
  if (existing) {
    console.log(`⚠️   Slug "${slug}" already exists. Updating …`);
    const updated = await prisma.blog.update({
      where: { slug },
      data: { title, content: contentHtml, excerpt, metaDescription, tags, published: true },
    });
    console.log(`\n✅  Updated!  ID: ${updated.id}`);
  } else {
    const post = await prisma.blog.create({
      data: {
        title,
        content: contentHtml,
        slug,
        authorId: admin.id,
        excerpt,
        metaDescription,
        tags,
        published: true,
      },
    });
    console.log(`\n✅  Published!  ID: ${post.id}`);
  }
  console.log(`   Live at  : https://bitsolmarketing.com/blog/${slug}`);
  console.log(`   Local    : http://localhost:3000/blog/${slug}\n`);
} catch (err) {
  console.error("❌  DB error:", err.message);
  process.exit(1);
} finally {
  await prisma.$disconnect();
}
