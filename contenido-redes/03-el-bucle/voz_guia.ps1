# Genera la voz guía (sintética, solo para cuadrar tiempos) en voz-guia/NN.wav
# Uso: powershell -NoProfile -File voz_guia.ps1
Add-Type -AssemblyName System.Speech
$dir = Split-Path -Parent $MyInvocation.MyCommand.Path
$out = Join-Path $dir 'voz-guia'
New-Item -ItemType Directory -Force $out | Out-Null
$guion = Get-Content (Join-Path $dir 'guion.json') -Raw -Encoding UTF8 | ConvertFrom-Json
$fmt = New-Object System.Speech.AudioFormat.SpeechAudioFormatInfo(48000, [System.Speech.AudioFormat.AudioBitsPerSample]::Sixteen, [System.Speech.AudioFormat.AudioChannel]::Mono)
foreach ($f in $guion.fragmentos) {
  $s = New-Object System.Speech.Synthesis.SpeechSynthesizer
  $s.SelectVoice('Microsoft Helena Desktop')
  $s.Rate = 1
  $file = Join-Path $out ('{0:D2}.wav' -f [int]$f.n)
  $s.SetOutputToWaveFile($file, $fmt)
  $s.Speak(($f.texto -replace '…', '...'))
  $s.Dispose()
}
Write-Output "Voz guía en $out"
