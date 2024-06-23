const puppeteer = require('puppeteer');

const browser = puppeteer.launch({
    // headless: false,
    args: [`--window-size=1920,1080`],
    defaultViewport: {
        width:1920,
        height:1080
    }
}).then((browser) => {
    const page = browser.newPage();
    return page
})

async function searchItemDatabase(itemname) {
    //just search for the first item in the database that nearly matches
    try {
        
        // const page = await (await browser).newPage();
        const page = await browser
        await page.goto(`https://d2foundry.gg`);
        //wait for selector button
        await page.waitForSelector('button[type="button"]');

        // await page.setViewport({width: 1920, height: 1080});
        await page.keyboard.down('Control');
        await page.keyboard.press('KeyK');
        await page.keyboard.up('Control');
        //wait for 1 second
        await page.waitForSelector('input[type="search"]');
        //write into the search bar
        await page.click('input[type="search"]');
        // await page.$eval('input[type="search"]', el => el.value = itemname);
        await page.keyboard.type(itemname);
        
        //select li with class ResultList_autocompleteHeader__W8nJc > span:nth-child(1)
        // await page.waitForSelector('li[class="ResultList_autocompleteHeader__W8nJc"]');
        // //read value
        // const searchResult = await page.evaluate(() => {
        //     return document.querySelector('li[class="ResultList_autocompleteHeader__W8nJc"]').innerText
        // })
        //check the value, the value will be "Results (1)", check how many results are ther
        //if there is only 1 result, click on it
        // const resultCount = searchResult.split(" ")[1].replace("(", "").replace(")", "")

        let exists = await page.$('li[class="ResultList_message__XWN25"]') || null

        if (exists != null) {
            return {   
                success: false,
                reason: "No results found."
            }
        }
        else {
            //press enter
            await Promise.all([
                page.keyboard.press('Enter'),
            //wait for navigation
                page.waitForNavigation({ waitUntil: 'networkidle0'})
            ])

            await page.waitForSelector('div[class="PerkSection_content__VNT2B"]')
            const perksScreenshot = await page.$('div[class="PerkSection_content__VNT2B"]');
            const perks = await perksScreenshot.screenshot({});

            //wait for button titled screenshot mode
            await page.waitForSelector('button[title="Screenshot mode"]');
            //click on it
            // await page.click('button[title="Screenshot mode"]');
            await page.evaluate(() => {
                    return document.querySelector('button[title="Screenshot mode"]').click()
            })

            //wait for selector ScreenshotMode_container__McKrP
            await page.waitForSelector('div[class="ScreenshotMode_container__McKrP"]');
            await page.waitForNetworkIdle({waitUntil: 'networkidle0'});
            //select it
            const screenshotMode = await page.$('div[class="ScreenshotMode_container__McKrP"]');
            //take a screenshot
            const screenshot = await screenshotMode.screenshot();

            

            //wait for selector
            // await page.waitForSelector('li[class="ResultItem_result__sd1qZ"] > a');
            // const searchResult = await page.evaluate(() => {
            //     return document.querySelector('li[class="ResultItem_result__sd1qZ"] > a').href

            // })
            // await page.goto(searchResult)
            return {
                success: true,
                screenshot: screenshot,
                perks: perks
            }
            
        }

        //wait for list item with the class ResultItem_result
        // await page.keyboard.press('Enter');
        return searchResult
    }
    catch (err) {
        console.log(err)
        return {
            success: false,
            reason: "An error occurred while searching."
        }
    }
}

const searchItemDatabaseDeclaration = {
    name: "gSearchItemDatabase",
    parameters: {
      type: "OBJECT",
      description: "Use this to search the D2Foundry.gg destiny 2 database for weapon details, image, and performance.",
      properties: {
        itemname: {
          type: "STRING",
          description: "The name of the item to search for. It can be partial or full.",
        },

      },
      required: ["itemname"],
    },
};

module.exports = {
    searchItemDatabase,
    searchItemDatabaseDeclaration
}