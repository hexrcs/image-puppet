const puppeteer = require('puppeteer')
const mkdirp = require('mkdirp')
const devices = require('puppeteer/DeviceDescriptors')

mkdirp('shots')
async function run() {
  const browser = await puppeteer.launch()
  const page = await browser.newPage()
  await page.emulate(devices['iPad Mini landscape'])

  await page.goto('https://images.google.com/ncr')
  await console.log(page.url())
  await page.screenshot({ path: 'shots/shot01.png' })


  await browser.close()
}

run()
