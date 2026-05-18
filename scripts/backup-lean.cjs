/**
 * Backup ligero: código + public + config (~280 MB).
 * Excluye node_modules, .next, out, .git y backups anteriores.
 */
const { execSync } = require("child_process");
const fs = require("fs");
const path = require("path");

const root = path.join(__dirname, "..");
const backupsDir = path.join(root, "backups");
const stamp = new Date()
  .toISOString()
  .replace(/[-:]/g, "")
  .replace(/\..+/, "")
  .replace("T", "-");
const archive = path.join(backupsDir, `bks-music-web-lean-${stamp}.tar.gz`);

if (!fs.existsSync(backupsDir)) {
  fs.mkdirSync(backupsDir, { recursive: true });
}

const excludes = [
  "./node_modules",
  "./.next",
  "./out",
  "./.git",
  "./backups",
  ".DS_Store",
];

const excludeFlags = excludes.map((e) => `--exclude='${e}'`).join(" ");

console.log("\n  Creando backup ligero...\n");

execSync(
  `tar -czf "${archive}" ${excludeFlags} -C ".." "BKS Music Web"`,
  { cwd: root, stdio: "inherit", shell: "/bin/bash" }
);

const stat = fs.statSync(archive);
const mb = (stat.size / (1024 * 1024)).toFixed(1);
console.log(`\n  Listo: ${archive}`);
console.log(`  Tamaño: ${mb} MB\n`);
