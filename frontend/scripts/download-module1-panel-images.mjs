/**
 * 通过维基共享资源 API 解析直链并下载模块一右侧面板配图。
 * 运行：node scripts/download-module1-panel-images.mjs
 */
import fs from 'fs'
import https from 'https'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const OUT_DIR = path.join(__dirname, '../public/module1/panel')

const UA =
  'version1-module1-panel/1.0 (educational; local download script; +https://github.com/)'

const ND = '\u2013'

/** @type {{ out: string; title: string }[]} — title 为 Commons 上的文件名（不含 File: 前缀） */
const MANIFEST = [
  { out: 'overview-hero.jpg', title: `Ancient Villages in Southern Anhui ${ND} Xidi and Hongcun-114147.jpg` },
  { out: 'overview-para1.jpg', title: 'Hongcun 1.jpg' },
  { out: 'overview-para2.jpg', title: 'Hongcun 2.jpg' },

  { out: 'county-sheXian.jpg', title: 'Shexian Xu Guo Shifang 2016.11.13 12-09-49.jpg' },
  { out: 'county-xiuNing.jpg', title: 'Xiuning Qiyun Shan 2015.06.28 13-53-05.jpg' },
  { out: 'county-jiXi.jpg', title: 'Longchuan Village, 2021-09-27 02.jpg' },
  { out: 'county-huiZhouQu.jpg', title: 'Chengkan 5456.jpg' },
  { out: 'county-wuYuan.jpg', title: 'Wuyuan, Shangrao, Jiangxi, China - panoramio (6).jpg' },
  { out: 'county-yiXian.jpg', title: `Ancient Villages in Southern Anhui ${ND} Xidi and Hongcun-127239.jpg` },
  { out: 'county-qiMen.jpg', title: '201806 Daohu Village, Qimen.jpg' },
  { out: 'county-huangShanQu.jpg', title: 'Anhui Huangshan.jpg' },
  { out: 'county-tunXiQu.jpg', title: 'Zhenhai Bridge in Tunxi 2013-04.JPG' },

  { out: 'building-hz-hongcun.jpg', title: 'South Lake of Hongcun 20141110.JPG' },
  { out: 'building-hz-xidi.jpg', title: 'Xidi, Anhui 17.jpg' },
  { out: 'building-hz-chengkan.jpg', title: 'Chengkan 5456.jpg' },
  { out: 'building-hz-xuguo.jpg', title: 'Shexian Xu Guo Shifang 2016.11.13 12-09-49.jpg' },
  { out: 'building-hz-tangyue.jpg', title: 'Tangyue 5328.jpg' },
  { out: 'building-hz-longchuan.jpg', title: 'Longchuan Village, 2021-09-27 13.jpg' },
  { out: 'building-hz-zhenhai.jpg', title: 'Zhenhai Bridge in Tunxi 2013-04.JPG' },
  { out: 'building-hz-caihong.jpg', title: 'Wuyuan Qinghua Caihong Qiao 20120401-11.jpg' },
  { out: 'building-hz-zhushan.jpg', title: 'Hongcun 3.jpg' },
  { out: 'building-hz-cheng.jpg', title: 'Former Residence of Cheng Dawei 02 2013-04.jpg' },
  { out: 'building-hz-chengzhi.jpg', title: 'Hongcun Chengzhi Hall 宏村承志堂 - panoramio.jpg' },
  { out: 'building-hz-qimen.jpg', title: '201806 Daohu Village, Qimen.jpg' },
  { out: 'building-hz-yuliang.jpg', title: 'Shexian Yuliang 2016.11.13 08-24-29.jpg' },
  { out: 'building-hz-hongkeng.jpg', title: 'Wuyuan, Shangrao, Jiangxi, China - panoramio (39).jpg' },
]

function httpsGetJson(url) {
  return new Promise((resolve, reject) => {
    https
      .get(url, { headers: { 'User-Agent': UA } }, (res) => {
        let d = ''
        res.on('data', (c) => (d += c))
        res.on('end', () => {
          try {
            resolve(JSON.parse(d))
          } catch (e) {
            reject(e)
          }
        })
      })
      .on('error', reject)
  })
}

/** @returns {Promise<Record<string, string>>} normalized title -> url */
async function fetchImageUrls(titles) {
  const parts = titles.map((t) => `File:${t}`)
  const url = `https://commons.wikimedia.org/w/api.php?action=query&titles=${encodeURIComponent(parts.join('|'))}&prop=imageinfo&iiprop=url&format=json`
  const j = await httpsGetJson(url)
  const out = {}
  for (const page of Object.values(j.query?.pages ?? {})) {
    if (!page.imageinfo?.[0]?.url) continue
    let name = page.title?.replace(/^File:/, '') ?? ''
    out[name] = page.imageinfo[0].url
  }
  return out
}

function downloadFile(imageUrl, dest) {
  return new Promise((resolve, reject) => {
    const tryOnce = (u) => {
      const f = fs.createWriteStream(dest)
      https
        .get(
          u,
          { headers: { 'User-Agent': UA, Accept: 'image/*,*/*' } },
          (res) => {
            if (res.statusCode === 301 || res.statusCode === 302) {
              const loc = res.headers.location
              f.close()
              fs.unlink(dest, () => {})
              if (!loc) return reject(new Error('Redirect without location'))
              return tryOnce(new URL(loc, u).href)
            }
            if (res.statusCode !== 200) {
              f.close()
              fs.unlink(dest, () => {})
              return reject(new Error(`HTTP ${res.statusCode}`))
            }
            res.pipe(f)
            f.on('finish', () => f.close(() => resolve()))
          },
        )
        .on('error', (err) => {
          f.close()
          fs.unlink(dest, () => {})
          reject(err)
        })
    }
    tryOnce(imageUrl)
  })
}

async function main() {
  fs.mkdirSync(OUT_DIR, { recursive: true })
  const titles = [...new Set(MANIFEST.map((m) => m.title))]
  const urlMap = await fetchImageUrls(titles)
  const fails = []

  for (const { out, title } of MANIFEST) {
    const imageUrl = urlMap[title]
    const dest = path.join(OUT_DIR, out)
    if (!imageUrl) {
      fails.push({ out, title, reason: 'API 未返回 URL（标题可能不匹配）' })
      continue
    }
    try {
      await downloadFile(imageUrl, dest)
      const st = fs.statSync(dest)
      if (st.size < 5000) {
        fails.push({ out, title, reason: `文件过小 (${st.size})` })
        fs.unlinkSync(dest)
      } else {
        process.stdout.write(`OK ${out} (${Math.round(st.size / 1024)} KB)\n`)
      }
    } catch (e) {
      fails.push({ out, title, reason: String(e.message || e) })
    }
  }

  if (fails.length) {
    process.stderr.write('\n--- FAILED ---\n')
    for (const f of fails) process.stderr.write(`${f.out} ← ${f.title}\n  ${f.reason}\n`)
    process.exitCode = 1
  }
}

main()
