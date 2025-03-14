const { chromium } = require('playwright');
require('dotenv').config();
const { exit } = require('process');
const readline = require('readline');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

// Wrap the question in a promise
function askQuestion(query) {
    return new Promise(resolve => rl.question(query, resolve));
}

(async () => {
    if (!process.env.USERNAME || !process.env.PASSWORD) {
        console.error('Missing required environment variables');
        process.exit(1);
    }
    try {
        const userInput = await askQuestion('What would you like to post? ');


            
        const browser = await chromium.launch({ headless: true });
        const context = await browser.newContext();
        const page = await context.newPage();

        await page.goto('https://x.com/');

        const username = process.env.USERNAME;
        const password = process.env.PASSWORD;
        await page.getByTestId("loginButton").click();
        await page.waitForSelector('input[name="text"]');
        await page.fill('input[name="text"]', username);
        await page.getByText("Next").click();
        await page.fill('input[name="password"]', password);
        await page.getByText("Log in").click();

        await page.getByTestId("tweetTextarea_0").fill(userInput);
        
        await page.getByTestId('tweetButtonInline').click(); 
        await page.goto('https://x.com/'+username);
        await page.waitForSelector('article[role="article"]')
        const tweet = await page.locator('div[data-testid="tweetText"]').first();

        const tweetText = await tweet.innerText();
        console.log('Tweet: \"', tweetText, '\" was successfully posted!');



        
        rl.close();
        await page.close();
        await context.close();
        await browser.close();
        exit(0);


    } catch (error) {
        console.error('An error occurred:', error);
        rl.close();
    }
})();