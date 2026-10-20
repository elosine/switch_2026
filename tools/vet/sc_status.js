// sc_status.js — ask the running scsynth (UDP 57210) for /status, N times, a second apart. Look only: nothing is started or stopped.
// Prints: ugens · synths · groups · defs · avg CPU · peak CPU · nominal SR · ACTUAL SR (ReaRoute's real clock as the server sees it).
'use strict';
const dgram = require('dgram');
const N = +(process.argv[2] || 5), PORT = 57210;
const pad = (b) => Buffer.concat([b, Buffer.alloc(4 - (b.length % 4))]);
const msg = Buffer.concat([pad(Buffer.from('/status')), pad(Buffer.from(','))]);
const sock = dgram.createSocket('udp4');
let got = 0, sent = 0, last = Date.now();
sock.on('message', (buf) => {
  // /status.reply ,iiiiiffdd
  let i = 0; const str = () => { const e = buf.indexOf(0, i); const s = buf.toString('utf8', i, e); i = e + 1; i = (i + 3) & ~3; return s; };
  const addr = str(), tags = str().slice(1);
  const out = [];
  for (const t of tags) {
    if (t === 'i') { out.push(buf.readInt32BE(i)); i += 4; }
    else if (t === 'f') { out.push(Math.round(buf.readFloatBE(i) * 100) / 100); i += 4; }
    else if (t === 'd') { out.push(Math.round(buf.readDoubleBE(i) * 100) / 100); i += 8; }
  }
  const [, ugens, synths, groups, defs, cpuAvg, cpuPeak, srNom, srAct] = out;
  const now = Date.now();
  console.log(`${new Date().toISOString().slice(11, 23)}  ugens ${ugens}  synths ${synths}  groups ${groups}  defs ${defs}  cpu ${cpuAvg}% / peak ${cpuPeak}%  SR nominal ${srNom}  ACTUAL ${srAct}  (ratio ${(srAct / srNom).toFixed(4)})  +${now - last} ms`);
  last = now; got++;
  if (got >= N) { sock.close(); }
});
sock.on('error', (e) => { console.error('socket error: ' + e.message); process.exit(1); });
const tick = () => { if (sent >= N) return; sock.send(msg, PORT, '127.0.0.1'); sent++; setTimeout(tick, 1000); };
tick();
setTimeout(() => { if (got < N) { console.log(`no reply from scsynth on ${PORT} (${got} of ${N})`); sock.close(); } }, N * 1000 + 2000);
