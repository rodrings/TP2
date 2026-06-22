Set-StrictMode -Off
Set-Location -LiteralPath "$PSScriptRoot\img"
if (Get-Command magick -ErrorAction SilentlyContinue) {
    Write-Host 'USING_MAGICK'
    Get-ChildItem -File -Include *.jpg,*.jpeg,*.png | ForEach-Object {
        $src = $_.FullName
        $dst = Join-Path $_.DirectoryName ($_.BaseName + '.webp')
        magick $src -quality 80 $dst
        Write-Host "Converted: $($_.Name) -> $([IO.Path]::GetFileName($dst))"
    }
} elseif (Get-Command cwebp -ErrorAction SilentlyContinue) {
    Write-Host 'USING_CWEBP'
    Get-ChildItem -File -Include *.jpg,*.jpeg,*.png | ForEach-Object {
        $src = $_.FullName
        $dst = Join-Path $_.DirectoryName ($_.BaseName + '.webp')
        & cwebp -q 80 $src -o $dst | Out-Null
        Write-Host "Converted: $($_.Name) -> $([IO.Path]::GetFileName($dst))"
    }
} else {
    Write-Host 'NO_CONVERTER_FOUND'
}
