/**
 * Arranca `next dev` en 0.0.0.0:3001 y define ALLOWED_DEV_ORIGIN (IPv4 LAN)
 * para que Next permita /_next/* desde http://<esa-ip>:3001 en el móvil.
 */
const { spawn } = require("child_process");
const path = require("path");
const os = require("os");

function isIPv4(net) {
  return net.family === "IPv4" || net.family === 4;
}

function getLanIPv4Candidates() {
  const nets = os.networkInterfaces();
  const candidates = [];
  for (const [iface, list] of Object.entries(nets)) {
    if (!list) continue;
    for (const net of list) {
      if (!isIPv4(net) || net.internal) continue;
      candidates.push({ iface, address: net.address });
    }
  }
  return candidates;
}

function getLanIPv4() {
  const candidates = getLanIPv4Candidates().map((c) => c.address);
  const preferred = candidates.find(
    (a) => a.startsWith("192.168.") || a.startsWith("10.") || /^172\.(1[6-9]|2\d|3[01])\./.test(a)
  );
  return preferred || candidates[0] || "";
}

const root = path.join(__dirname, "..");
const allCandidates = getLanIPv4Candidates();
const ip = process.env.ALLOWED_DEV_ORIGIN || getLanIPv4();
const env = { ...process.env };
if (allCandidates.length > 0) {
  env.ALLOWED_DEV_ORIGINS = allCandidates.map((c) => c.address).join(",");
}
if (ip) {
  env.ALLOWED_DEV_ORIGIN = ip;
  const all = allCandidates;
  console.log("\n  --- Acceso desde el móvil (misma WiFi, sin VPN) ---");
  console.log(`  Principal:  http://${ip}:3001`);
  for (const { iface, address } of all) {
    if (address !== ip) console.log(`  Alternativa (${iface}): http://${address}:3001`);
  }
  console.log("  Si no carga: Ajustes Mac > Red > WiFi > IP, o desactiva VPN en el móvil.\n");
} else {
  console.warn("\n  [dev] No se detectó IPv4 LAN. En el móvil prueba la IP de Ajustes > WiFi.\n");
}

const nextBin = require.resolve("next/dist/bin/next", { paths: [root] });

const child = spawn(process.execPath, [nextBin, "dev", "-H", "0.0.0.0", "-p", "3001"], {
  cwd: root,
  env,
  stdio: "inherit",
});

child.on("exit", (code, signal) => {
  if (signal) process.kill(process.pid, signal);
  process.exit(code ?? 0);
});
