const express = require('express');
const app = express();
const path = require('path');
const fs = require('fs');

console.log(__dirname);
app.use('/static', express.static('public'));
app.use(express.static(path.join(__dirname, "docs")))

app.get('/', (req, res) => {
    fs.readFile('docs/index.html', 'utf8', (err, html) => {
        if (err) { console.error(err); }
        res.send(html);
    });
});

console.log('App is online on http://localhost:5000'); app.listen(5000);