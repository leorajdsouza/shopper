const express = require('express');
const app = express();
const port = 2000;
const cheerio = require("cheerio");
const axios = require("axios");
const puppeteer = require('puppeteer');

let siteName = "";
var path = __dirname + '/index'


const getResults = async (keyword) => {
    let siteUrl = "https://www.amazon.in/s?k=onion&i=nowstore&ref=nb_sb_noss_2";
    if (keyword) {
        siteUrl = "https://www.amazon.in/s?k=" + keyword + "&ref=nb_sb_noss_2";
    }
    resultSet = [];
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(siteUrl, { waitUntil: 'networkidle0' });

    const content = await page.content();
    const $ = cheerio.load(content);
    sResults = $('.a-section.a-spacing-medium').map((idx, ele) => {
        resultSet.push({
            title: $(ele).find('.a-section .a-size-base-plus.a-color-base.a-text-normal').text(),
            price: $(ele).find('.a-price .a-price-whole').text()
        })
    });
    browser.close();
    return resultSet;

}



app.get('/', async (req, res) => {
    const result = await getResults();
    res.send(result);
});

app.get('/search/:keyword', async (req, res) => {
    const result = await getResults(req.params.keyword);
    res.send(result);
});


app.get('/search', async (req, res) => {
    if (req.query.keyword) {
        const result = await getResults(req.query.keyword);
        res.send(result);
    } else {
        res.send("keyword required");
    }
});

app.listen(port, () => console.log(`im listening to port ${port}`))