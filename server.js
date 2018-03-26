const express = require('express');
const app = express();
const path = require('path');
const port = process.env.PORT || 5000;
const quotes = require('./quotes.json');
const quotesInParagraph = 10;

/*
 * Helper functions
 */

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

/*
 * Routes
 */

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'client', 'index.html'));
});

app.get('/api/quotes', (req, res) => {
  res.send({
    quotes
  });
});

app.get('/api/quotes/random', (req, res) => {
  res.send({
    quote: getRandomQuote()
  });
});

app.get('/api/slack', (req, res) => {
  res.send({
    text: getRandomQuote(),
    response_type: 'in_channel'
  });
});

// TODO
// add p tags and header tags
// limit number of paragraphs
app.get('/text', (req, res) => {
  const paragraphs = createParagraphs(req.query.paragraphs);
  res.send(paragraphs);
});

app.listen(port, () => console.log(`Listening on ${port}`));
