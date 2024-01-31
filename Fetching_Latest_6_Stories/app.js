const http = require('http');
const fs = require('fs');
const path = require('path');
const https = require('https');

const server = http.createServer((req, res) => {
    if (req.url === 'https://dummyjson.com/products' && req.method === 'GET') {
        handleGetTimeStories(res);
    } else if (req.url === '/' || req.url === '/styles.css') {
        serveFile(req.url, res);
    } else {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('Not Found');
    }
});

const handleGetTimeStories = (res) => {
    https.get('https://dummyjson.com/products', (timeResponse) => {
        let data = '';

        timeResponse.on('data', (chunk) => {
            data += chunk;
        });

        timeResponse.on('end', () => {
            const stories = parseTimeStories(data);

            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(stories));
        });
    }).on('error', (error) => {
        console.error('Error:', error.message);
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end('Internal Server Error');
    });
};

const parseTimeStories = (html) => {
    const stories = [];
    const matches = html.match(/<a\sclass="headline"\shref="(.*?)".*?>(.*?)<\/a>/g);

    if (matches) {
        for (let i = 0; i < Math.min(matches.length, 6); i++) {
            const match = matches[i];
            const titleMatch = match.match(/<a\sclass="headline"\shref="(.*?)".*?>(.*?)<\/a>/);

            if (titleMatch && titleMatch[1] && titleMatch[2]) {
                const story = {
                    rank: i + 1,
                    title: titleMatch[2].trim(),
                    url: `https://dummyjson.com/products`
                };
                stories.push(story);
            }
        }
    }

    return stories;
};

const serveFile = (url, res) => {
    const filePath = path.join(__dirname, url === '/' ? 'index.html' : url.slice(1));
    fs.readFile(filePath, 'utf8', (err, content) => {
        if (err) {
            res.writeHead(500, { 'Content-Type': 'text/plain' });
            res.end('Internal Server Error');
            return;
        }

        const contentType = url.endsWith('.css') ? 'text/css' : 'text/html';
        res.writeHead(200, { 'Content-Type': contentType });
        res.end(content);
    });
};

const port = 3000;

server.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
