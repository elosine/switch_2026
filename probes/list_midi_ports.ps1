# list_midi_ports.ps1 — every MIDI port Windows shows (winmm), in and out, by name — the verification of the protocol's 4.1
# (the how-to `composition-system/protocol/howto/rack.md` § 1: "verify by name, in and out"). Written 2026-10-20 (RUNNING_LOG §14).
#   powershell -NoProfile -File probes/list_midi_ports.ps1 [-Prefix SW]
param([string]$Prefix = '')
Add-Type -Namespace W -Name L -MemberDefinition @'
[DllImport("winmm.dll")] public static extern int midiOutGetNumDevs();
[DllImport("winmm.dll")] public static extern int midiInGetNumDevs();
[StructLayout(LayoutKind.Sequential, CharSet = CharSet.Auto)] public struct OC { public ushort mid, pid; public uint ver; [MarshalAs(UnmanagedType.ByValTStr, SizeConst = 32)] public string name; public ushort tech, voices, notes, mask; public uint support; }
[StructLayout(LayoutKind.Sequential, CharSet = CharSet.Auto)] public struct IC { public ushort mid, pid; public uint ver; [MarshalAs(UnmanagedType.ByValTStr, SizeConst = 32)] public string name; public uint support; }
[DllImport("winmm.dll", CharSet = CharSet.Auto)] public static extern int midiOutGetDevCaps(IntPtr id, ref OC caps, int size);
[DllImport("winmm.dll", CharSet = CharSet.Auto)] public static extern int midiInGetDevCaps(IntPtr id, ref IC caps, int size);
'@
$outs = @(); for ($i = 0; $i -lt [W.L]::midiOutGetNumDevs(); $i++) { $c = New-Object W.L+OC; [void][W.L]::midiOutGetDevCaps([IntPtr]$i, [ref]$c, [Runtime.InteropServices.Marshal]::SizeOf($c)); $outs += $c.name }
$ins = @(); for ($i = 0; $i -lt [W.L]::midiInGetNumDevs(); $i++) { $c = New-Object W.L+IC; [void][W.L]::midiInGetDevCaps([IntPtr]$i, [ref]$c, [Runtime.InteropServices.Marshal]::SizeOf($c)); $ins += $c.name }
if ($Prefix) { $outs = $outs | Where-Object { $_ -like "$Prefix*" }; $ins = $ins | Where-Object { $_ -like "$Prefix*" } }
"OUT ($($outs.Count)): " + (($outs | Sort-Object) -join ' · ')
"IN  ($($ins.Count)): " + (($ins | Sort-Object) -join ' · ')
