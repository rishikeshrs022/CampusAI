/**
 * CampusAI - Lightweight Dev Web Server
 * Runs a local server using Node.js built-in modules. No dependencies required.
 */

const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 3000;

const MIME_TYPES = {
    '.html': 'text/html',
    '.css': 'text/css',
    '.js': 'application/javascript',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.ico': 'image/x-icon',
    '.svg': 'image/svg+xml'
};

const server = http.createServer((req, res) => {
    console.log(`${req.method} ${req.url}`);
    
    // Normalize URL path and strip query parameters
    let reqUrl = req.url.split('?')[0];
    
    // SPA Routing Fallback
    const spaRoutes = ['/login-page', '/student-dashboard', '/admin-panel'];
    if (spaRoutes.includes(reqUrl)) {
        reqUrl = '/index.html';
    } else if (reqUrl === '/') {
        reqUrl = '/index.html';
    }

    const filePath = path.join(__dirname, reqUrl);
    const ext = path.extname(filePath).toLowerCase();
    
    fs.readFile(filePath, (err, content) => {
        if (err) {
            if (err.code === 'ENOENT') {
                res.writeHead(404, { 'Content-Type': 'text/plain' });
                res.end('404 Not Found');
            } else {
                res.writeHead(500, { 'Content-Type': 'text/plain' });
                res.end(`500 Server Error: ${err.code}`);
            }
        } else {
            const contentType = MIME_TYPES[ext] || 'application/octet-stream';
            res.writeHead(200, { 'Content-Type': contentType });
            res.end(content, 'utf-8');
        }
    });
});

server.listen(PORT, () => {
    console.log('\n==================================================');
    console.log(' CampusAI Development Server Running!');
    console.log(` Access link: http://localhost:${PORT}`);
    console.log(' Press Ctrl+C to stop the server.');
    console.log('==================================================\n');
});
