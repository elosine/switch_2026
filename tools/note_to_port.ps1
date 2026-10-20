# note_to_port.ps1 — one note to a loopMIDI port, by name (the new-piece protocol's 4.6, the first sound; RUNNING_LOG §19).
# The AI's own reach to the rack (docs/REAPER_CONTROL.md § 1: PowerShell -> winmm -> the loopMIDI ports): no browser, no app.
#   powershell -NoProfile -File tools/note_to_port.ps1 -Port DECCello -Note 57 [-Channel 1] [-Vel 80] [-Ms 1200] [-Cc0 -1] [-Cc n -CcVal v] [-NoNote]
# -Cc n -CcVal v sends that controller first (RUNNING_LOG §71: -Cc 123 all notes off · -Cc 120 all sound off · -Cc0 126 = Xsample's Preset Mode on); -NoNote sends the controllers and no note.
# -Cc0 n sends CC0 = n first (Xsample's articulation select). Exit 2: the port is not live.
param([Parameter(Mandatory=$true)][string]$Port, [Parameter(Mandatory=$true)][int]$Note, [int]$Channel = 1, [int]$Vel = 80, [int]$Ms = 1200, [int]$Cc0 = -1, [int]$Cc = -1, [int]$CcVal = 0, [switch]$NoNote)
Add-Type -Namespace W -Name M -MemberDefinition '[DllImport("winmm.dll")] public static extern int midiOutGetNumDevs(); [StructLayout(LayoutKind.Sequential, CharSet=CharSet.Auto)] public struct OC { public ushort wMid; public ushort wPid; public uint vDriverVersion; [MarshalAs(UnmanagedType.ByValTStr, SizeConst=32)] public string szPname; public ushort wTechnology; public ushort wVoices; public ushort wNotes; public ushort wChannelMask; public uint dwSupport; } [DllImport("winmm.dll", CharSet=CharSet.Auto)] public static extern int midiOutGetDevCaps(IntPtr id, ref OC c, int sz); [DllImport("winmm.dll")] public static extern int midiOutOpen(out IntPtr h, int id, IntPtr cb, IntPtr inst, int flags); [DllImport("winmm.dll")] public static extern int midiOutShortMsg(IntPtr h, int msg); [DllImport("winmm.dll")] public static extern int midiOutClose(IntPtr h);'
$id = -1
for ($i = 0; $i -lt [W.M]::midiOutGetNumDevs(); $i++) { $c = New-Object W.M+OC; [void][W.M]::midiOutGetDevCaps([IntPtr]$i, [ref]$c, [Runtime.InteropServices.Marshal]::SizeOf($c)); if ($c.szPname -ceq $Port) { $id = $i } }
if ($id -lt 0) { Write-Output "port not live: $Port"; exit 2 }
$h = [IntPtr]::Zero; $r = [W.M]::midiOutOpen([ref]$h, $id, [IntPtr]::Zero, [IntPtr]::Zero, 0)
if ($r -ne 0) { Write-Output "midiOutOpen failed ($r) on $Port"; exit 3 }
$ch = $Channel - 1
if ($Cc0 -ge 0) { [void][W.M]::midiOutShortMsg($h, (0xB0 + $ch) -bor (0 -shl 8) -bor ($Cc0 -shl 16)); Start-Sleep -Milliseconds 60 }
if ($Cc -ge 0) { [void][W.M]::midiOutShortMsg($h, (0xB0 + $ch) -bor ($Cc -shl 8) -bor ($CcVal -shl 16)); Start-Sleep -Milliseconds 20 }
if ($NoNote) { [void][W.M]::midiOutClose($h); Write-Output "sent: $Port ch $Channel controllers only (cc0 $Cc0, cc $Cc = $CcVal)"; exit 0 }
[void][W.M]::midiOutShortMsg($h, (0x90 + $ch) -bor ($Note -shl 8) -bor ($Vel -shl 16))
Start-Sleep -Milliseconds $Ms
[void][W.M]::midiOutShortMsg($h, (0x80 + $ch) -bor ($Note -shl 8))
Start-Sleep -Milliseconds 80
[void][W.M]::midiOutClose($h)
Write-Output "sent: $Port ch $Channel note $Note vel $Vel for $Ms ms"
