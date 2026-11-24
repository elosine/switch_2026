// elec_stems.scd — THE ELECTRONICS AS STEMS, offline (PLAN 2r step 4). Run by tools/elec_stems.js, which writes the job (LE_STEMS_JOB).
// No server, no device, no sound: a second scsynth in NRT, a living engine beside it is untouched.
// THE ENGINE'S OWN CODE decides every number: ~le.materialSpec (the stretch · fades · level line) · ~le.sineSpec (the exact peak of a mark ·
// the glide) · \leSine itself. ONE difference, on purpose: a material is played by PlayBuf from a buffer holding its stretch, where the live
// engine streams it with VDiskIn; same rate, same cubic interpolation, same envelopes. A long stream in NRT was not proven, a buffer is exact.
(
var dir = thisProcess.nowExecutingPath.dirname, sc = dir.dirname +/+ "electronics" +/+ "sc";
var jobPath = "LE_STEMS_JOB".getenv, job, sr = 48000, tmp, toEvent, matDef, sineBytes, fails = 0;
(sc +/+ "boot.scd").load;
(sc +/+ "synths.scd").load;
~le.takeSpecs;
job = jobPath.parseJSONFile;
~le.materialsOn(job["materials"]);
tmp = job["dir"];
toEvent = { |x| var e = (); x.keysValuesDo({ |k, v| e[k.asSymbol] = v }); e };
matDef = SynthDef(\leMaterialStem2, { |out = 0, buf = 0, amp = 1, dur = 10, fadeIn = 0.03, fadeOut = 0.03, rate = 1|
	var db = \envDb.ir(0 ! 16), dt = \envDt.ir(0.01 ! 15), cv = \envCurve.ir(0);
	var lvl = EnvGen.kr(Env(db, dt, cv)).dbamp;
	var fades = EnvGen.kr(Env([0, 1, 1, 0], [fadeIn.max(0.002), (dur - fadeIn - fadeOut).max(0.001), fadeOut.max(0.002)], \sin), doneAction: 2);
	Out.ar(out, PlayBuf.ar(2, buf, rate) * amp * lvl * fades);
});
sineBytes = SynthDescLib.global[\leSine].def.asBytes;
fork {
	job["stems"].do({ |st|
		var list = List[[0.0, ['/d_recv', matDef.asBytes]], [0.0, ['/d_recv', sineBytes]]], at = st["at"].asString.asFloat, len = st["len"].asString.asFloat, code;
		var opts = ServerOptions.new.numOutputBusChannels_(2).numBuffers_(1024).memSize_(65536), out = tmp +/+ st["file"], score;
		st["items"].do({ |it, i|
			var d = toEvent.(it), t = d[\t].asString.asFloat - at, sp, row, frame, nFrames;
			if(st["kind"] == "material") {
				row = ~le[\materials][d[\name].asString.asSymbol];
				if(row.isNil) { ("ELEC_STEMS no such material: " ++ d[\name]).postln; 1.exit };
				sp = ~le.materialSpec(d, row);
				frame = (sp[\offS] * row[\sr]).round.asInteger;
				nFrames = ((sp[\lenS] + 0.2) * row[\sr]).ceil.asInteger;
				list.add([0.0, ['/b_allocRead', i, row[\path], frame, nFrames]]);
				list.add([t, ['/s_new', \leMaterialStem2, 1000 + i, 0, 0, \out, 0, \buf, i, \rate, row[\sr] / sr] ++ sp[\args].asOSCArgArray]);
				list.add([t + sp[\lenS] + 0.1, ['/b_free', i]]);
			} {
				sp = ~le.sineSpec(d);
				list.add([t, ['/s_new', \leSine, 1000 + i, 0, 0, \out, 0] ++ ~le.sineArgs(sp).asOSCArgArray]);
			};
		});
		list.add([len, ['/c_set', 0, 0]]);
		score = Score(list.asArray.sort({ |a, b| a[0] < b[0] }));
		("ELEC_STEMS rendering " ++ st["file"] ++ " · " ++ st["items"].size ++ " item(s) · " ++ len.round(0.1) ++ " s").postln;
		score.recordNRT(out ++ ".osc", out, nil, sr, "WAV", "float", opts, "", nil, { |c| code = c });
		while { code.isNil } { 0.2.wait };
		File.delete(out ++ ".osc");
		if(code != 0) { fails = fails + 1; ("ELEC_STEMS FAILED " ++ st["file"] ++ " code " ++ code).postln };
	});
	if(fails == 0) { "ELEC_STEMS DONE".postln; 0.exit } { 1.exit };
};
)
