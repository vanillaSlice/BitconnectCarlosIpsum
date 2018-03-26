const express = require('express');
const app = express();
const path = require('path');

const port = process.env.PORT || 5000;
const quotes = require('./quotes.json');
const quotesInParagraph = 10;

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'client', 'index.html'))
});

app.get('/text', (req, res) => {
  const paragraphs = createParagraphs(req.query.paragraphs);
  res.send(paragraphs);
});

app.get('/random', (req, res) => {
  res.send({
    'text': getRandomQuote()
  });
});

function createParagraphs(numberOfParagraphs) {
  const paragraphs = [];
  for (let i = 0; i < numberOfParagraphs; i++) {
    paragraphs.push(createParagraph());
  }
  return paragraphs;
}

function createParagraph() {
  let paragraph = '';
  for (let i = 0; i < quotesInParagraph; i++) {
    paragraph += `${getRandomQuote()} `;
  }
  return paragraph.trim();
}

function getRandomQuote() {
  return quotes[Math.floor(Math.random() * quotes.length)];
}

app.listen(port, () => console.log(`Listening on ${port}`));
