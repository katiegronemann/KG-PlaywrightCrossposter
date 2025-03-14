const { chromium } = require('playwright');
const { exit } = require('process');
const readline = require('readline');
const express = require('express');
require('dotenv').config();

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

// Wrap the question in a promise
const app = express();
const port = 3000;

app.use(express.json());
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));

// Serve the HTML page
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
});


// Handle post request
app.post('/tweet', async (req, res) => {
    const userInput = req.body.tweet;
    console.log(userInput);

    try {
        const browser = await chromium.launch({ headless: true });
        const context = await browser.newContext();
        const page = await context.newPage();

        await page.goto('https://x.com/');
        const username = process.env.XUSERNAME;
        const password = process.env.XPASSWORD;
        
        await page.getByTestId("loginButton").click();
        await page.waitForSelector('input[name="text"]');
        await page.fill('input[name="text"]', username);
        await page.getByText("Next").click();
        await page.fill('input[name="password"]', password);
        await page.getByText("Log in").click();

        await page.getByTestId("tweetTextarea_0").fill(userInput);
        await page.getByTestId('tweetButtonInline').click();
        
        //await page.goto('https://x.com/'+username);
        //await page.waitForSelector('article[role="article"]');
        //const tweet = await page.locator('div[data-testid="tweetText"]').first();
        //const tweetText = await tweet.innerText();

        await page.close();
        await context.close();
        await browser.close();

        res.json({ success: true, message: `Tweet: "${tweetText}" was successfully posted!` });
        console.log('Tweet: \"', tweetText, '\" was successfully posted!');
    } catch (error) {
        res.json({ success: false, message: error.message });
        console.error('An error occurred:', error.message);
    }
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
    
});
(async () => {
const mbrowser = await chromium.launch({ headless: false });
const mcontext = await mbrowser.newContext();
const mpage = await mcontext.newPage();

await mpage.goto('http://localhost:3000/');
})();