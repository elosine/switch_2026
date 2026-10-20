// bank_cost.scd (scratch, 2026-10-08, 15.1) — WHERE THE LANGUAGE'S TIME GOES when a long render is banked: the file read, the
// gain loop, the WAV write and the loudness measure (bank.scd · level.scd · process.scd processDone), each timed on ONE file.
//   LE_COST_FILE  a mono WAV (a 20 s drone render)
// No server, no sound. Prints one line per step and ends BANK_COST DONE.
(
var dir = thisProcess.nowExecutingPath.dirname;
var sc = dir.dirname.dirname +/+ "electronics" +/+ "sc";
var f = "LE_COST_FILE".getenv, sf = SoundFile.new, data, sr, t, loud, tmp = Platform.defaultTempDir +/+ "le_bank_cost.wav", g = 0.7;
(sc +/+ "boot.scd").load;
t = Main.elapsedTime;
sf.openRead(f); sr = sf.sampleRate.asInteger; data = FloatArray.newClear(sf.numFrames); sf.readData(data); sf.close;
("read      " ++ (Main.elapsedTime - t).round(0.01) ++ " s · " ++ data.size ++ " frames · " ++ (data.size / sr).round(0.1) ++ " s of audio").postln;
t = Main.elapsedTime;
data.size.do({ |i| data[i] = data[i] * g });
("gain loop " ++ (Main.elapsedTime - t).round(0.01) ++ " s (take.size.do, in place)").postln;
t = Main.elapsedTime;
~le.wavWrite(tmp, data, sr);
("wavWrite  " ++ (Main.elapsedTime - t).round(0.01) ++ " s (the language's own 24-bit writer)").postln;
t = Main.elapsedTime;
sf = SoundFile.new.headerFormat_("WAV").sampleFormat_("int24").numChannels_(1).sampleRate_(sr);
sf.openWrite(tmp ++ ".sf.wav"); sf.writeData(data); sf.close;
("SoundFile " ++ (Main.elapsedTime - t).round(0.01) ++ " s (SoundFile:writeData, the C writer)").postln;
fork {
	t = Main.elapsedTime;
	loud = ~le.loudOf(data, sr);
	("loudOf    " ++ (Main.elapsedTime - t).round(0.01) ++ " s → " ++ loud[\loudDb] ++ " LUFS (BS.1770 in the language, breathing)").postln;
	File.delete(tmp); File.delete(tmp ++ ".sf.wav");
	"BANK_COST DONE".postln;
	0.exit;
};
)
