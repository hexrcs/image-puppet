const puppeteer = require('puppeteer')
const mkdirp = require('mkdirp')

const SEARCH_FIELD_HOME = 'input[title="Search"][type="text"]'
const SEARCH_BUTTON_HOME = 'button[value="Search"]'

const SEARCH_KEYWORD = 'using iphone'

mkdirp('shots')
async function run() {
  const browser = await puppeteer.launch({ headless: true })
  const page = await browser.newPage()
  await page.setViewport({ width: 1000, height: 600 })

  await launchSearch(page)
  await page.waitForNavigation({ waitUntil: 'domcontentloaded' })

  const imgMetaList = await page.evaluate(ibGetMetaList, SEARCH_KEYWORD)

  console.log(imgMetaList)

  // await browser.close()
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
      oId: parsed.id,
      id: parsed.id.slice(0, -1) // trim last colon char
    }
  })
  return imgMetaList
}
