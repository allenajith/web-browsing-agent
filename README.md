# AI-Powered Web Browsing Agent

**Browse smarter: AI-powered answers from live web content with Playwright automation.**

A Node.js web-browsing agent that uses Playwright for automated web scraping and Google Gemini AI for generating concise answers from live web content. Users can search queries via a web interface and receive AI-processed responses with source links.


**Features:**
- Automated web browsing with Playwright (headless or non-headless).  
- Scrapes search engines (DuckDuckGo & Bing) for relevant results.  
- AI-powered summarization using Google Gemini AI (gemini-2.5-flash-lite).  
- Extracts sources: fetches page content while blocking heavy resources, unnecessary scripts and insecure websites. 
- Secure: disables JS on scraped pages for performance and safety.


## Demo

**Query Example:** top cars 2025

**AI Answer:**

> Based on the information provided, here are some of the top cars in 2025:
>
> **Best Selling Cars of FY 2025:**  
> - Maruti Wagon R: Was the best-selling car of FY 2025.  
> - Tata Punch: Took the second spot.  
> - Hyundai Creta: Came in third.  
>
> **Top 11 Best Cars in India for 2025 (examples):**  
> Mahindra Scorpio N, Hyundai Creta, Tata Punch, Mahindra Thar ROXX, Maruti Suzuki Baleno, Maruti Suzuki Dzire, Tata Nexon, Maruti Swift, Maruti Suzuki Brezza, Maruti Ertiga, Maruti Suzuki Wagon R  

**Sources**: Extracted live from top web pages related to your query.


## Tech Stack

- **Node.js**  
- **Express.js** for backend API  
- **Playwright** for browser automation  
- **Google Generative AI API** for AI responses  
- **HTML, CSS, JS** for frontend interface  

---

## Setup & Installation

1. **Clone the repository**

git clone https://github.com/allenajith/web-browsing-agent.git
cd web-browsing-agent

2. **Install dependencies**

npm install express @google/generative-ai@latest dotenv

3. **Install playwright**
npm install playwright
npx playwright install

4. **Create a .env file with Gemini API key**
GEMINI_API_KEY=your_google_gemini_api_key_here

5. **Run the server**

node server.js

**Usage**
Enter any query in the search box.
Wait a few seconds for AI-processed answers.
View sources extracted directly from top web pages.

**Notes**
- The main web interface (server.js + frontend) scrapes Bing and uses Google Gemini AI to generate concise answers.  
- index.js is a standalone testing script using DuckDuckGo for quick testing of search scraping and results.  
- Heavy resources (images, media, fonts, stylesheets) are blocked for faster performance and safety.  
- JavaScript is disabled on scraped pages to prevent unnecessary scripts and insecure content.  
- Ensure you have a valid Google Gemini API key in your .env file as GEMINI_API_KEY.  
