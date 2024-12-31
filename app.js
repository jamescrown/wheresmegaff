const http = require('http');
const fs = require('fs');
const path = require('path');
const multiparty = require('multiparty');
const express = require('express');

const app = express();
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const publicDir = path.join(__dirname, 'public');
const adsFilePath = path.join(__dirname, 'data', 'ads.json');
const uploadsDir = path.join(__dirname, 'uploads');

const server = http.createServer((req, res) => {
    if (req.method === 'GET') {
        if (req.url === '/' || req.url === '/index.html') {
            console.log(`Loading index.html`);
            const filePath = path.join(__dirname, 'index.html');
            fs.readFile(filePath, (err, content) => {
                if (err) {
                    res.writeHead(500, { 'Content-Type': 'text/plain' });
                    res.end('Internal Server Error');
                } else {
                    res.writeHead(200, { 'Content-Type': 'text/html' });
                    res.end(content);
                }
            });
        } else if (req.url.startsWith('/public/')) {
            const filePath = path.join(publicDir, req.url.replace('/public/', ''));
            const ext = path.extname(filePath);
            const contentType = ext === '.css' ? 'text/css' : ext === '.js' ? 'application/javascript' : 'text/plain';
            console.log(`Loading index.html through public route`);

            fs.readFile(filePath, (err, content) => {
                if (err) {
                    res.writeHead(404, { 'Content-Type': 'text/plain' });
                    res.end('File Not Found');
                } else {
                    res.writeHead(200, { 'Content-Type': contentType });
                    res.end(content);
                }
            });
        } else if (req.url.startsWith('/ads')) {
            console.log(`Loading ads`);

            const type = new URL(req.url, `http://${req.headers.host}`).searchParams.get('type');
            if (type) {
                fs.readFile(adsFilePath, (err, content) => {
                    if (err) {
                        res.writeHead(500, { 'Content-Type': 'application/json' });
                        res.end(JSON.stringify({ error: 'Internal Server Error' }));
                    } else {
                        const ads = JSON.parse(content || '[]').filter(ad => ad.type === type);
                        res.writeHead(200, { 'Content-Type': 'application/json' });
                        res.end(JSON.stringify(ads));
                    }
                });
            } else {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: 'Type query parameter is required' }));
            }
        } else if (req.url.startsWith('/uploads/')) {
            console.log(`Loading uploads`);

            const filePath = path.join(uploadsDir, req.url.replace('/uploads/', ''));
            fs.readFile(filePath, (err, content) => {
                if (err) {
                    res.writeHead(404, { 'Content-Type': 'text/plain' });
                    res.end('File Not Found');
                } else {
                    res.writeHead(200, { 'Content-Type': 'image/jpeg' });
                    res.end(content);
                }
            });
        } else {
            res.writeHead(404, { 'Content-Type': 'text/plain' });
            res.end('Not Found');
        }
    } else if (req.method === 'POST' && req.url === '/place-ad') {
        console.log(`Placing ad`);
        const form = new multiparty.Form({ uploadDir: uploadsDir });

        form.parse(req, (err, fields, files) => {
            if (err) {
                console.log("Error handling form upload")
                res.writeHead(500, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: 'Failed to process form data' }));
                return;
            }

            try {
                const ad = {
                    title: fields.title[0],
                    description: fields.description[0],
                    price: fields.price[0],
                    type: fields.type[0],
                    images: files.images.map(file => `/uploads/${path.basename(file.path)}`),
                    date: new Date().toISOString(),
                };

                let ads = [];
                if (fs.existsSync(adsFilePath)) {
                    ads = JSON.parse(fs.readFileSync(adsFilePath, 'utf-8'));
                }

                ads.push(ad);
                fs.writeFileSync(adsFilePath, JSON.stringify(ads, null, 2), 'utf-8');

                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ message: 'Ad placed successfully!' }));
            } catch (error) {
                res.writeHead(500, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ message: 'Internal Server Error' }));
            }
        });
    } else {
        res.writeHead(405, { 'Content-Type': 'text/plain' });
        res.end('Method Not Allowed');
    }
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}/`);
});