# Cria atalhos na Área de Trabalho para abrir o Maker3D como "app" no PC (janela própria, sem barra do navegador).
# Uso: powershell -File tools\make_shortcuts.ps1
$ErrorActionPreference = "Stop"
Add-Type -AssemblyName System.Drawing
$proj = Split-Path $PSScriptRoot -Parent
$edge = "C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe"
if (-not (Test-Path $edge)) { $edge = "C:\Program Files\Google\Chrome\Application\chrome.exe" }
$base = "file:///" + ($proj -replace '\\','/') + "/index.html"

function New-Icon($path, $hex) {
  $size = 256
  $bmp = New-Object System.Drawing.Bitmap $size, $size
  $g = [System.Drawing.Graphics]::FromImage($bmp)
  $g.SmoothingMode = "AntiAlias"; $g.TextRenderingHint = "AntiAliasGridFit"
  $g.Clear([System.Drawing.Color]::Transparent)
  $p = New-Object System.Drawing.Drawing2D.GraphicsPath; $r = 56
  $p.AddArc(0,0,$r,$r,180,90); $p.AddArc($size-$r,0,$r,$r,270,90); $p.AddArc($size-$r,$size-$r,$r,$r,0,90); $p.AddArc(0,$size-$r,$r,$r,90,90); $p.CloseFigure()
  $g.FillPath((New-Object System.Drawing.SolidBrush ([System.Drawing.Color]::FromArgb(11,11,15))), $p)
  $g.FillEllipse((New-Object System.Drawing.SolidBrush ([System.Drawing.Color]::FromArgb(110,[System.Drawing.ColorTranslator]::FromHtml($hex)))), 110, -80, 240, 240)
  $f = New-Object System.Drawing.Font("Segoe UI", 84, [System.Drawing.FontStyle]::Bold, [System.Drawing.GraphicsUnit]::Pixel)
  $sf = New-Object System.Drawing.StringFormat; $sf.Alignment = "Center"; $sf.LineAlignment = "Center"
  $g.DrawString("M", $f, [System.Drawing.Brushes]::White, 88, 138, $sf)
  $g.DrawString("3D", $f, (New-Object System.Drawing.SolidBrush ([System.Drawing.ColorTranslator]::FromHtml($hex))), 172, 138, $sf)
  $g.Dispose()
  $ms = New-Object System.IO.MemoryStream; $bmp.Save($ms, [System.Drawing.Imaging.ImageFormat]::Png); $bmp.Dispose()
  $png = $ms.ToArray(); $fs = [System.IO.File]::Create($path); $bw = New-Object System.IO.BinaryWriter $fs
  $bw.Write([UInt16]0); $bw.Write([UInt16]1); $bw.Write([UInt16]1)
  $bw.Write([Byte]0); $bw.Write([Byte]0); $bw.Write([Byte]0); $bw.Write([Byte]0)
  $bw.Write([UInt16]1); $bw.Write([UInt16]32); $bw.Write([UInt32]$png.Length); $bw.Write([UInt32]22)
  $bw.Write($png); $bw.Close()
}
$icoO = Join-Path $PSScriptRoot "maker3d-laranja.ico"; $icoP = Join-Path $PSScriptRoot "maker3d-roxo.ico"
New-Icon $icoO "#FF6A00"; New-Icon $icoP "#7C3AED"

$desktop = [Environment]::GetFolderPath("Desktop")
$shell = New-Object -ComObject WScript.Shell
$items = @(
  @{ name = "Maker3D - Site";          url = $base;                      size = "1366,860"; ico = $icoO; desc = "Site completo (versão desktop)" },
  @{ name = "Maker3D - App Cliente";   url = "$base`?app=1&perfil=c1";   size = "430,900";  ico = $icoO; desc = "App do cliente (Marina, pessoa física)" },
  @{ name = "Maker3D - App Maker";     url = "$base`?app=1&perfil=m2";   size = "430,900";  ico = $icoP; desc = "App do maker (Indústria 3D, segmento Empresas)" },
  @{ name = "Maker3D - Investidor";    url = "$base`?app=1&perfil=a1";   size = "430,900";  ico = $icoP; desc = "Painel do investidor, simulador e pitch" }
)
foreach ($i in $items) {
  $lnk = $shell.CreateShortcut((Join-Path $desktop ($i.name + ".lnk")))
  $lnk.TargetPath = $edge
  $lnk.Arguments = "--app=`"$($i.url)`" --window-size=$($i.size)"
  $lnk.IconLocation = $i.ico
  $lnk.Description = $i.desc
  $lnk.WorkingDirectory = $proj
  $lnk.Save()
  Write-Host "Criado: $($i.name)"
}
