import chromium from '@sparticuz/chromium'
import puppeteer from 'puppeteer-core'


chromium.setHeadlessMode = true
chromium.setGraphicsMode = false

export async function handler(event, context) {
  try {
    const browser = await puppeteer.launch({
      args: chromium.args,
      defaultViewport: chromium.defaultViewport,
      executablePath: process.env.CHROME_EXECUTABLE_PATH ? (await chromium.executablePath('/var/task/node_modules/@sparticuz/chromium/bin')) : "C:/Program Files/Google/Chrome/Application/chrome.exe",
    })

    const page = await browser.newPage()
    const url = JSON.parse(event.body)['url']
    

    await page.goto(url, {
      waitUntil: "networkidle0",
    });

    // await page.setViewport({
    //   width: 1000,
    //   height: 600,
    // });
  
    const file = await page.screenshot({encoding:'base64'});

    await browser.close()


    return {
      statusCode: 200,
      body: JSON.stringify(file),
    }
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error }),
    }
  }
}
