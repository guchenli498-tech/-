$dir = "c:\version1\frontend\public\charts"

$files = Get-ChildItem -Path $dir -Filter "*.html" -File |
  Where-Object { $_.Name -ne "module2.html" -and $_.Name -ne "module3.html" }

function Get-Title([string]$raw) {
  if ($raw -match "<title[^>]*>(.*?)</title>") {
    return $Matches[1]
  }
  return $null
}

foreach ($f in $files) {
  $raw = Get-Content -Path $f.FullName -Raw -ErrorAction SilentlyContinue
  if (-not $raw) { continue }

  $t = Get-Title $raw
  $target = $null

  if ($t) {
    # 模块二子页（按 module2.html 里写死的 src 名称）
    if ($t -match "马头墙" -and $t -match "桑葚图") { $target = "马头墙桑葚图.html" }
    elseif ($t -match "马头墙" -and ($t -match "旭日图" -or $t -match "花纹样式")) { $target = "马头墙花纹样式旭日图.html" }

    elseif ($t -match "天井" -and $t -match "桑葚图") { $target = "天井桑葚图.html" }
    elseif ($t -match "天井" -and $t -match "弦图") { $target = "天井弦图.html" }

    elseif ($t -match "粉墙" -and $t -match "桑葚图") { $target = "粉墙桑葚图.html" }
    elseif ($t -match "屋顶" -and $t -match "桑葚图") { $target = "屋顶桑葚图.html" }

    elseif ($t -match "水圳系统" -and $t -match "桑葚图") { $target = "水圳系统桑葚图.html" }

    # 模块三嵌入
    elseif ($t -match "科学家" -and $t -match "著作") { $target = "科学家著作家卡片.html" }
    elseif ($t -match "三雕" -and $t -match "旭日图") { $target = "三雕旭日图.html" }
  }

  if ($target -and $target -ne $f.Name) {
    $dest = Join-Path $dir $target
    if (Test-Path $dest) {
      # 避免覆盖：如果目标已存在就跳过
      continue
    }
    Rename-Item -Path $f.FullName -NewName $target
    Write-Output ("RENAMED: {0} -> {1}" -f $f.Name, $target)
  }
}

