// drone_vet_render.scd — THE VETTING OF THE ICY STAGE, 15.1 (a) (PLAN.md § 1.7; RUNNING_LOG §249): the stage rendered OFFLINE on one
// held sound at the section's own dials, one 20 s render per grain window × grain size, and HIS ORIGINAL `\icy` (github.com/elosine/
// freeze, freeze.scd — the SynthDef as he wrote it, UGen for UGen) rendered beside it on the same input and the same dials. The files
// land in a scratch folder; tools/drone_vet.js pulse measures them (the pulse per window: a modulation depth in dB).
// No server, no device, no port, no sound — process_test.scd's road: boot.scd's functions in a bare sclang, the renders by NRT.
//   LE_VET_SRC   the source WAV (mono) — bank/samples/bcl-mp-1.wav
//   LE_VET_OUT   the scratch folder (made)
//   LE_VET_ROWS  "name:icWin:icOverlaps:icEnv:icSpeed|…" — the port's rows; icEnv as the stage numbers them (0 Hann · 1 3-stage · 4 expodec)
//   LE_VET_ORIG  "name:winsz:overlaps:envFile:rate|…" — his original: envFile a grainEnv file name or "-" for Warp1's own Hann
//   LE_VET_LEN   seconds a render (20)
// It ends DRONE_VET_RENDER DONE (exit 0) with one line per file, or FAIL (exit 1).
(
var dir = thisProcess.nowExecutingPath.dirname;
var sc = dir.dirname.dirname +/+ "electronics" +/+ "sc";
var src = "LE_VET_SRC".getenv, out = "LE_VET_OUT".getenv, lenS = ("LE_VET_LEN".getenv ? "20").asFloat;
var rowsSpec = "LE_VET_ROWS".getenv ? "", origSpec = "LE_VET_ORIG".getenv ? "";
var rowOf, waitFor, fails = List.new, made = List.new, sr, sf, srcName = "vet-src";
if(src.isNil or: { out.isNil }) { "DRONE_VET_RENDER FAIL — LE_VET_SRC and LE_VET_OUT are needed".postln; 1.exit };
(sc +/+ "boot.scd").load;
File.mkdir(out);
~le.bankOn(out);   // the scratch bank: the index empty, nothing loaded (no server)
// the source into the scratch bank under a short name (processFile looks the bank up by name)
sf = SoundFile.new;
if(sf.openRead(src).not) { ("DRONE_VET_RENDER FAIL — cannot read " ++ src).postln; 1.exit };
sr = sf.sampleRate.asInteger;
sf.close;
File.copy(src, out +/+ srcName ++ ".wav");
rowOf = { |name| ~le[\indexRows].detect({ |r| r[\name].asString == name }) };
fork {
	var lenMs = (lenS * 1000).round.asInteger;
	waitFor = { |name, secs = 120|
		var t = 0;
		while { rowOf.(name).isNil and: { t < secs } } { 0.25.wait; t = t + 0.25 };
		rowOf.(name)
	};
	("DRONE_VET_RENDER the scratch bank: " ++ out).postln;
	// ---- the port: one at a time, each exactly lenS long (the shape ending, as built) ----
	rowsSpec.split($|).do({ |line|
		var f = line.split($:), name, win, ov, env, spd, r;
		if(f.size >= 5) {
			name = f[0]; win = f[1].asFloat; ov = f[2].asInteger; env = f[3].asInteger; spd = f[4].asFloat;
			~le.processRender((source: srcName, out: name, effect: 'icy',
				args: "icMix:1,icSpeed:" ++ spd ++ ",icFromMs:0,icWin:" ++ win ++ ",icOverlaps:" ++ ov ++ ",icRand:0.2,icPitch:0,icEnv:" ++ env ++ ",icLoop:1",
				end: 'shape', atkMs: 10, durMs: lenMs, relMs: 10, curve: 0, match: 1, srcDrive: "played", id: name));
			r = waitFor.(name);
			if(r.isNil) { fails.add(name); ("  FAIL " ++ name ++ " — no render in 120 s").postln }
			{ made.add(name ++ " " ++ (out +/+ r[\file].asString) ++ " " ++ r[\lengthMs] ++ " ms peak " ++ r[\peakDb] ++ " dB"); ("  made " ++ name ++ " · " ++ r[\lengthMs] ++ " ms · peak " ++ r[\peakDb] ++ " dB").postln };
		};
	});
	// ---- his original \icy (freeze.scd, 2015), as written: Warp1 over the SOURCE's own buffer, a Phasor read point, no level
	//      compensation, Warp1's default interpolation. rate 1 → krate = ratemax; ratemax set to the pace. Out.ar(0, sig). ----
	origSpec.split($|).do({ |line|
		var f = line.split($:), name, winsz, ov, envFile, rate, def, score, nrt, envMsgs, envBuf = -1, done = false, data, peak, t = 0;
		if(f.size >= 5) {
			name = f[0]; winsz = f[1].asFloat; ov = f[2].asInteger; envFile = f[3]; rate = f[4].asFloat;
			def = SynthDef(\icyOrig, {
				arg buf=0, envbuf = -1, pitchshift=1, winsz=0.8, overlaps=40, resettrig=0, startpos=0.0, endpos=1.0, rand=0.1, ratemin=2.0, ratemax=0.00001;
				var sig, ix, krate;
				krate = \rate.kr(1, 0.05).linlin(0.0, 1.0, ratemin, ratemax);
				ix = Phasor.kr(resettrig, ((1.0/ControlRate.ir)/(BufFrames.kr(buf)/SampleRate.ir))*krate, startpos, endpos);
				sig = Warp1.ar(1, buf, ix, pitchshift, winsz, envbuf, overlaps,rand);
				Out.ar(0, sig);
			});
			envMsgs = if(envFile != "-") { envBuf = 1; [[0.0, ['/b_allocRead', 1, sc +/+ "grainEnv" +/+ envFile, 0, 0]]] } { [] };
			nrt = out +/+ name ++ ".wav";
			if(File.exists(nrt)) { File.delete(nrt) };
			score = Score([
				[0.0, ['/d_recv', def.asBytes]],
				[0.0, ['/b_allocRead', 0, out +/+ srcName ++ ".wav", 0, 0]]
			] ++ envMsgs ++ [
				[0.02, ['/s_new', \icyOrig, 1000, 0, 0, \buf, 0, \envbuf, envBuf, \winsz, winsz, \overlaps, ov, \rand, 0.2, \startpos, 0, \endpos, 1, \pitchshift, 1, \ratemin, 1, \ratemax, rate, \rate, 1]],
				[0.02 + lenS, ['/c_set', 0, 0]]
			]);
			score.recordNRT(out +/+ name ++ ".osc", nrt, nil, sr, "WAV", "float", ServerOptions.new.numOutputBusChannels_(1).memSize_(131072), "", nil, { |code| done = true });
			while { done.not and: { t < 120 } } { 0.25.wait; t = t + 0.25 };
			if(File.exists(out +/+ name ++ ".osc")) { File.delete(out +/+ name ++ ".osc") };
			if(File.exists(nrt).not) { fails.add(name); ("  FAIL " ++ name ++ " — his original did not render").postln } {
				sf = SoundFile.new; sf.openRead(nrt); data = FloatArray.newClear(sf.numFrames); sf.readData(data); sf.close;
				peak = if(data.size > 0) { data.abs.maxItem } { 0 };
				made.add(name ++ " " ++ nrt ++ " " ++ (data.size / sr * 1000).round(0.1) ++ " ms peak " ++ ~le.db(peak) ++ " dB");
				("  made " ++ name ++ " (his original) · " ++ (data.size / sr * 1000).round(1).asInteger ++ " ms · peak " ++ ~le.db(peak) ++ " dB").postln;
			};
		};
	});
	made.do({ |m| ("FILE " ++ m).postln });
	if(fails.size == 0) { "DRONE_VET_RENDER DONE".postln; 0.exit } { ("DRONE_VET_RENDER FAIL — " ++ fails.join(" · ")).postln; 1.exit };
};
)
