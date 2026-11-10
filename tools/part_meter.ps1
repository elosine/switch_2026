# part_meter.ps1 — play a schedule of MIDI events into ONE loopMIDI port (winmm, the probes' way), timed by a stopwatch.
#   powershell -NoProfile -ExecutionPolicy Bypass -File tools\part_meter.ps1 -Port SWPiano -Schedule C:\path\events.json
# The schedule: {"events":[[tSeconds, status, data1, data2], …]} — status with its channel already in (0x90 | ch). Every note is
# silenced at the end (all notes off on the channels used). tools/part_meter.js writes the file and runs this (RUNNING_LOG §137).
param([Parameter(Mandatory=$true)][string]$Port, [Parameter(Mandatory=$true)][string]$Schedule)
Add-Type -TypeDefinition @"
using System; using System.Runtime.InteropServices; using System.Text;
public static class WinMM {
  [StructLayout(LayoutKind.Sequential, CharSet = CharSet.Auto)] public struct MIDIOUTCAPS { public ushort wMid; public ushort wPid; public uint vDriverVersion; [MarshalAs(UnmanagedType.ByValTStr, SizeConst = 32)] public string szPname; public ushort wTechnology; public ushort wVoices; public ushort wNotes; public ushort wChannelMask; public uint dwSupport; }
  [DllImport("winmm.dll")] public static extern uint midiOutGetNumDevs();
  [DllImport("winmm.dll", CharSet = CharSet.Auto)] public static extern uint midiOutGetDevCaps(UIntPtr id, out MIDIOUTCAPS caps, uint size);
  [DllImport("winmm.dll")] public static extern uint midiOutOpen(out IntPtr h, uint id, IntPtr cb, IntPtr inst, uint flags);
  [DllImport("winmm.dll")] public static extern uint midiOutShortMsg(IntPtr h, uint msg);
  [DllImport("winmm.dll")] public static extern uint midiOutClose(IntPtr h);
  public static int Find(string name) { uint n = midiOutGetNumDevs(); for (uint i = 0; i < n; i++) { MIDIOUTCAPS c; midiOutGetDevCaps((UIntPtr)i, out c, (uint)Marshal.SizeOf(typeof(MIDIOUTCAPS))); if (c.szPname == name) return (int)i; } return -1; }
}
"@
$id = [WinMM]::Find($Port)
if ($id -lt 0) { Write-Output "PORT NOT FOUND: $Port"; exit 2 }
$h = [IntPtr]::Zero
$r = [WinMM]::midiOutOpen([ref]$h, [uint32]$id, [IntPtr]::Zero, [IntPtr]::Zero, 0)
if ($r -ne 0) { Write-Output "midiOutOpen failed: $r"; exit 3 }
$ev = (Get-Content -Raw -Encoding UTF8 $Schedule | ConvertFrom-Json).events
$sw = [System.Diagnostics.Stopwatch]::StartNew()
$chans = @{}
foreach ($e in $ev) {
  $t = [double]$e[0]
  while ($sw.Elapsed.TotalSeconds -lt $t) { $rem = $t - $sw.Elapsed.TotalSeconds; if ($rem -gt 0.003) { Start-Sleep -Milliseconds ([int]([Math]::Floor($rem * 1000) - 2)) } }
  $status = [int]$e[1]; $d1 = [int]$e[2]; $d2 = [int]$e[3]
  $chans[$status -band 0x0F] = $true
  [void][WinMM]::midiOutShortMsg($h, [uint32]($status -bor ($d1 -shl 8) -bor ($d2 -shl 16)))
}
Start-Sleep -Milliseconds 100
foreach ($c in $chans.Keys) { [void][WinMM]::midiOutShortMsg($h, [uint32]((0xB0 -bor $c) -bor (123 -shl 8))) }
[void][WinMM]::midiOutClose($h)
Write-Output ("played {0} events on {1} in {2:N2} s" -f $ev.Count, $Port, $sw.Elapsed.TotalSeconds)
