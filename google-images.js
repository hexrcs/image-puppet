const puppeteer = require('puppeteer')
const fs = require('fs')
const mkdirp = require('mkdirp')
const download = require('download')

const SEARCH_FIELD_HOME = 'input[title="Search"][type="text"]'
const SEARCH_BUTTON_HOME = 'button[value="Search"]'

const SEARCH_KEYWORD = 'using iphone'
const DATASET_NAME = 'iphone'
const DATASET_DIR = `images/${DATASET_NAME}`

mkdirp('debugging/screenshots')
mkdirp(DATASET_DIR)

async function run() {
  const browser = await puppeteer.launch({ headless: false })
  const page = await browser.newPage()
  await page.setViewport({ width: 1000, height: 600 })

  await launchSearch(page)
  await page.waitForNavigation({ waitUntil: 'domcontentloaded' })

  const imgMetaList = await page.evaluate(ibGetMetaList, SEARCH_KEYWORD)

  console.log(imgMetaList)

  imgMetaList.forEach(e =>
    download(e.oUrl, DATASET_DIR, {
      filename: e.ext
        ? `${e.oWidth}x${e.oHeight}-${e.id}.${e.ext}`
        : `${e.oWidth}x${e.oHeight}-${e.id}`
    })
  )

  await browser.close()
}

run()

async function launchSearch(page) {
  await page.goto('https://images.google.com/ncr')

  await page.click(SEARCH_FIELD_HOME)
  await page.keyboard.type(SEARCH_KEYWORD)
  await page.click(SEARCH_BUTTON_HOME)
}

// Function to eval In Browser
function ibGetMetaList(searchKeyword) {
  const imgTags = document.getElementsByTagName('img')
  const resultImgTags = Array.from(imgTags).filter(
    e => e['alt'] == `Image result for ${searchKeyword}`
  )

  const imgMetaList = resultImgTags.map(e => {
    const parsed = JSON.parse(e.parentElement.nextElementSibling['innerText'])
    return {
      oUrl: parsed.ou, // original url
      pageTitle: parsed.pt,
      oHeight: parsed.oh,
      oWidth: parsed.ow,
      id: parsed.id.slice(0, -1), // trim last colon char
      ext: parsed.ity
    }
  })
  return imgMetaList
}
