import chromium from '@sparticuz/chromium'
import puppeteer from 'puppeteer-core'


chromium.setHeadlessMode = true
chromium.setGraphicsMode = false

export async function handler(event, context) {
  if (event.httpMethod == "OPTIONS") {

    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "Content-Type",
        "Access-Control-Allow-Methods": "GET, POST, OPTION",
      },
    };
  } 
  if(event.httpMethod == "POST"){
    try {
      const browser = await puppeteer.launch({
        args: chromium.args,
        defaultViewport: chromium.defaultViewport,
        executablePath: false ? await chromium.executablePath('/var/task/node_modules/@sparticuz/chromium/bin') : "C:/Program Files/Google/Chrome/Application/chrome.exe",
      })
      try {
        
        const page = await browser.newPage()
        const url = JSON.parse(event.body)['url']
    
        await page.goto(url, {
          timeout:5000
        });
    
        // await page.setViewport({
        //   width: 1000,
        //   height: 600,
        // });
      
        const file = await page.screenshot({encoding:'base64'});
    
        await browser.close()
    
        return {
          statusCode: 200,
          headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Headers": "Content-Type",
            "Access-Control-Allow-Methods": "GET, POST, OPTION",
          },
          body: JSON.stringify(file),
        }
      } catch (error) {
        await browser.close()
        return {
          statusCode: 500,
          body: JSON.stringify({ error }),
        }
      }
    } catch (err) {
      console.log(err);
      return {
        statusCode: 500,
        body: JSON.stringify({ err }),
      }
    }
  }
}
