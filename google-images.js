const puppeteer = require('puppeteer')
const fs = require('fs')
const mkdirp = require('mkdirp')
const download = require('download')
const readChunk = require('read-chunk')
const fileType = require('file-type')

const SEARCH_FIELD_HOME = 'input[title="Search"][type="text"]'
const SEARCH_BUTTON_HOME = 'button[value="Search"]'

async function run(options) {
  const fullDownloadDir = `${options.downloadDir}/${options.datasetName}`
  mkdirp(fullDownloadDir)

  console.log(`Preparing to download image search results of ${options.searchKeyword}!`)

  const browser = await puppeteer.launch({ headless: true })
  const page = await browser.newPage()
  await page.setViewport({ width: 1000, height: 600 })

  console.log(`Parsing results...`)
  await launchSearch(page, options.searchKeyword)
  await page.waitForNavigation({ waitUntil: 'domcontentloaded' })

  await autoScroll(page)

  const imgMetaListFull = await page.evaluate(ibGetMetaList, options.searchKeyword)
  if (imgMetaListFull.length < options.maxCount) {
    console.log(`We only got ${imgMetaListFull.length} results back.`)
  }
  const imgMetaList = imgMetaListFull.slice(0, options.maxCount)

  console.log(`Start downloading ${imgMetaList.length} images into ${fullDownloadDir}!`)
  imgMetaList.forEach(downloadImageTo(fullDownloadDir))

  await browser.close()
  console.log('Done!')
}

async function launchSearch(page, searchKeyword) {
  await page.goto('https://images.google.com/ncr')

  await page.click(SEARCH_FIELD_HOME)
  await page.keyboard.type(searchKeyword)
  await page.click(SEARCH_BUTTON_HOME)
}

// Function to eval In Browser
function ibGetMetaList(searchKeyword) {
  const imgTags = document.getElementsByTagName('img')
  const resultImgTags = Array.from(imgTags).filter(
    e => e['alt'] == `Image result for ${searchKeyword}`
  )

  const imgMetaList = resultImgTags
    .filter(e => e['name']) // get rid of invalid img tags
    .map(e => {
      const parsed = JSON.parse(e.parentElement.nextElementSibling['innerText'])
      return {
        url: parsed.ou, // original url
        pageTitle: parsed.pt,
        height: parsed.oh,
        width: parsed.ow,
        id: parsed.id.slice(0, -1), // trim last colon char
        ext: parsed.ity
      }
    })
  return imgMetaList
}

function downloadImageTo(datasetDir) {
  return async function(e) {
    const fileName = `${e.width}x${e.height}-${e.id}`
    await download(e.url, datasetDir, {
      filename: fileName
    })
    const buffer = readChunk.sync(`${datasetDir}/${fileName}`, 0, 4100)
    const fileExt = fileType(buffer).ext
    fs.rename(
      `${datasetDir}/${fileName}`,
      `${datasetDir}/${fileName}.${fileExt}`,
      err => (err ? console.log(err) : null)
    )
  }
}

// stolen from https://github.com/GoogleChrome/puppeteer/issues/844
async function autoScroll(page) {
  return await page.evaluate(() => {
    return new Promise((resolve, reject) => {
      var totalHeight = 0
      var distance = 100
      var timer = setInterval(() => {
        var scrollHeight = document.body.scrollHeight
        window.scrollBy(0, distance)
        totalHeight += distance

        if (totalHeight >= scrollHeight) {
          clearInterval(timer)
          resolve()
        }
      }, 100)
    })
  })
}

module.exports = { run }
