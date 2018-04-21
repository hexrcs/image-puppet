const puppeteer = require('puppeteer')
const mkdirp = require('mkdirp')

mkdirp('shots')
;(async () => {
  const browser = await puppeteer.launch()
  const page = await browser.newPage()
  await page.goto('https://images.google.com/ncr')
  await page.screenshot({ path: 'shots/shot01.png' })

  await browser.close()
})()
