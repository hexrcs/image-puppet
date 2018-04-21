const puppeteer = require('puppeteer')

;(async () => {
  const browser = await puppeteer.launch()
  const page = await browser.newPage()
  await page.goto('https://images.google.com')
  await page.screenshot({path: 'shot01.png'})

  await browser.close()
})()
