const { chromium } = require('playwright');
const express = require('express');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config();

// Initialize Google Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const app = express();
const PORT = 3000;

app.get('/search', async (req, res) => {
    const query = req.query.q;

    const browser = await chromium.launch({ headless: true }); 

    const context = await browser.newContext({
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/92.0.4515.107 Safari/537.36',
        acceptDownloads: false,
        javaScriptEnabled: true 
    });

    const page = await context.newPage();
    page.setDefaultNavigationTimeout(15000);

    try {
        await page.route('**/*', route => {
            const type = route.request().resourceType();
            if (['image', 'font', 'media', 'stylesheet'].includes(type)) {
                route.abort();
            } else {
                route.continue();
            }
        });

        await page.goto(`https://www.bing.com/search?q=${encodeURIComponent(query)}`);

        await page.fill('input[name="q"]', query);
        await page.keyboard.press('Enter');

        // Wait for results to load
        await page.waitForSelector('li.b_algo h2 a');
        const results = await page.$$('li.b_algo h2 a');
        if (results.length === 0) {
            console.log("No results found");
            await browser.close();
            return res.json({ answer: "No results found", sources: [] });
        }

        const data = [];
        for (let i = 0; i < Math.min(results.length, 5); i++) {
            const title = await results[i].innerText();
            let link = await results[i].getAttribute('href');

            if (!link) continue;

            if (link.includes('uddg=')) {
                try {
                    const url = new URL(link);
                    link = decodeURIComponent(url.searchParams.get('uddg'));
                } catch {
                    continue;
                }
            }

            if (!link.startsWith('http')) continue;

            const newPage = await context.newPage({ javaScriptEnabled: false });
            newPage.setDefaultNavigationTimeout(8000);
            await newPage.route('**/*', route => {
                const type = route.request().resourceType();
                if (['image', 'font', 'media', 'stylesheet'].includes(type)) {
                    route.abort();
                } else {
                    route.continue();
                }
            });

            try {
                await newPage.goto(link, { waitUntil: 'domcontentloaded', timeout: 8000 });
                await newPage.waitForTimeout(1000);
                const content = await newPage.evaluate(() => {
                    const text = document.body.innerText || '';
                    return text.replace(/\s+/g, ' ').slice(0, 1500);
                });
                data.push({ title, link, content });
            } catch (error) {
                console.log("Skipped unsafe/slow site:", link);
            } finally {
                await newPage.close();
            }
        }

        const combinedText = data.map(item => item.content).join('\n\n');

        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash-lite" });
        const result = await model.generateContent(`
        Answer this query using the information below:

        Query: ${query}

        Content:
        ${combinedText}

        Give a clean, helpful answer.
        `);

        const aiResponse = result.response.text();

        await browser.close();

        res.json({
            answer: aiResponse,
            sources: data.map(d => ({ title: d.title, link: d.link }))
        });
    } catch (err) {
        console.error("Error during search:", err);
        await browser.close();
        res.json({ answer: "An error occurred", sources: [] });
    }
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
    console.log(`server is running on http://localhost:${PORT}`);
});