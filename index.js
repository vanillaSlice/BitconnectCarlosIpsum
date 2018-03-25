const express = require('express');
const app = express();
const path = require('path');
const quotes = require('./quotes.json');
const PORT = process.env.PORT || 5000

app.get('/', (req, res) => res.sendFile(path.join(__dirname + '/index.html')));

app.listen(PORT, () => console.log(`Listening on ${ PORT }`));

app.get('/test', (req, res) => {
  const paragraphs = [];

  for (let i = 0; i < 10; i++) {
    let paragraph = '';
    for (let j = 0; j < 6; j++) {
      paragraph += quotes[Math.floor(Math.random() * quotes.length)] + " ";
    }
    paragraphs.push(paragraph.trim());
  }

  res.send(paragraphs);
});

app.get('/text', (req, res) => {
  const numberOfParagraphs = req.query.paragraphs;
  const paragraphs = [];

  for (let i = 0; i < numberOfParagraphs; i++) {
    let paragraph = '';
    for (let j = 0; j < 6; j++) {
      paragraph += quotes[Math.floor(Math.random() * quotes.length)] + " ";
    }
    paragraphs.push(paragraph.trim());
  }

  res.send(paragraphs);
});

