const puppeteer = require('puppeteer')
const mkdirp = require('mkdirp')
// const devices = require('puppeteer/DeviceDescriptors')

const SEARCH_KEYWORD = 'using iphone'

mkdirp('shots')
async function run() {
  const browser = await puppeteer.launch({ headless: false })
  const page = await browser.newPage()
  // await page.emulate(devices['iPad Mini landscape'])
  await page.setViewport({ width: 1000, height: 600 })

  await launchSearch(page)
  await page.waitForNavigation({ waitUntil: 'domcontentloaded' })

  const testing = await page.evaluate((SEARCH_KEYWORD) => {
    const allImgTags = document.getElementsByTagName('img')
    const resultImgTagsArray = Array.from(allImgTags).filter(
      e => e['alt'] == `Image result for ${SEARCH_KEYWORD}`
    )

    const allMetaDataArray = resultImgTagsArray.map(e => e.parentElement.nextElementSibling["innerText"])
    return {
      hello: allMetaDataArray
    }
  }, SEARCH_KEYWORD)

  console.log(testing)

  // await browser.close()
}

run()

async function launchSearch(page) {
  await page.goto('https://images.google.com/ncr')

  // At the homepage
  const SEARCH_FIELD_HOME = 'input[title="Search"][type="text"]'
  const SEARCH_BUTTON_HOME = 'button[value="Search"]'

  await page.click(SEARCH_FIELD_HOME)
  await page.keyboard.type(SEARCH_KEYWORD)
  await page.click(SEARCH_BUTTON_HOME)
}
