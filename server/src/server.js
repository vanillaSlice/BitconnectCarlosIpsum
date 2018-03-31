const express = require('express');
const path = require('path');
const { query, validationResult } = require('express-validator/check');
const headings = require('./headings.json');
const quotes = require('./quotes.json');

const app = express();
const port = process.env.PORT || 3001;

/*
 * Validators
 */

const hTagLevelValidator = query('hTagLevel')
  .isInt({ min: 1, max: 6 })
  .withMessage('must be between 1 and 6')
  .toInt()
  .optional();

const includePTagsValidator = booleanValidator('includePTags');

const includeHeadingsValidator = booleanValidator('includeHeadings');

function booleanValidator(field) {
  return query(field)
    .isBoolean()
    .withMessage('must be a boolean')
    .toBoolean(true)
    .optional();
}

const paragraphsValidator = query('paragraphs')
  .isInt({ min: 1, max: 100 })
  .withMessage('must be between 1 and 100')
  .toInt();

const minQuotesAndMaxQuotesValidator = query(['minQuotes', 'maxQuotes'])
  .isInt({ min: 1, max: 20 })
  .withMessage('must be between 1 and 20')
  .toInt();

const minQuotesLessThanMaxQuotesValidator = query('minQuotes')
  .custom((value, { req }) => {
    if (value > req.query.maxQuotes) {
      throw new Error('minQuotes must be less than maxQuotes');
    }
    return value;
  });

/*
 * Using static client files only in production because client runs
 * on its own server in development.
 */

if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join('..', 'client', 'build')));

  app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'client', 'build', 'index.html'));
  });
}

/*
 * Routes
 */

app.get('/api/headings', [hTagLevelValidator], (req, res) => {
  const errors = validationResult(req);
  if (errors.isEmpty()) {
    const { hTagLevel } = req.query;
    const resHeadings = hTagLevel ? addHTags(hTagLevel, headings) : headings;
    res.send({ headings: resHeadings });
  } else {
    res.status(422).send({ errors: errors.mapped() });
  }
});

app.get('/api/headings/random', [hTagLevelValidator], (req, res) => {
  const errors = validationResult(req);
  if (errors.isEmpty()) {
    const { hTagLevel } = req.query;
    const heading = getRandomArrayElement(headings);
    const resHeading = hTagLevel ? addHTag(hTagLevel, heading) : heading;
    res.send({ heading: resHeading });
  } else {
    res.status(422).send({ errors: errors.mapped() });
  }
});

app.get('/api/quotes', [includePTagsValidator], (req, res) => {
  const errors = validationResult(req);
  if (errors.isEmpty()) {
    const { includePTags } = req.query;
    const resQuotes = includePTags ? addPTags(quotes) : quotes;
    res.send({ quotes: resQuotes });
  } else {
    res.status(422).send({ errors: errors.mapped() });
  }
});

app.get('/api/quotes/random', [includePTagsValidator], (req, res) => {
  const errors = validationResult(req);
  if (errors.isEmpty()) {
    const { includePTags } = req.query;
    const quote = getRandomArrayElement(quotes);
    const resQuote = includePTags ? addPTag(quote) : quote;
    res.send({ quote: resQuote });
  } else {
    res.status(422).send({ errors: errors.mapped() });
  }
});

app.get(
  '/api/text',
  [
    hTagLevelValidator,
    includePTagsValidator,
    paragraphsValidator,
    includeHeadingsValidator,
    minQuotesAndMaxQuotesValidator,
    minQuotesLessThanMaxQuotesValidator,
  ], (req, res) => {
    const errors = validationResult(req);

    if (errors.isEmpty()) {
      const {
        hTagLevel,
        minQuotes,
        maxQuotes,
        paragraphs,
        includeHeadings,
        includePTags,
      } = req.query;
      const text = [];

      for (let i = 0; i < paragraphs; i += 1) {
        const entry = {};

        if (includeHeadings) {
          let heading = getRandomArrayElement(headings);
          heading = hTagLevel ? addHTag(hTagLevel, heading) : heading;
          entry.heading = heading;
        }

        let paragraph = '';

        const quotesLength = getRandomInt(minQuotes, maxQuotes);

        for (let j = 0; j < quotesLength; j += 1) {
          paragraph += `${getRandomArrayElement(quotes)} `;
        }

        paragraph = paragraph.trim();

        if (includePTags) {
          paragraph = addPTag(paragraph);
        }

        entry.paragraph = paragraph;

        text.push(entry);
      }

      res.send({ text });
    } else {
      res.status(422).send({ errors: errors.mapped() });
    }
  },
);

/*
 * Helper functions
 */

function addHTags(hTagLevel, headings) {
  return headings.map(heading => addHTag(hTagLevel, heading));
}

function addHTag(hTagLevel, heading) {
  return addTag(`h${hTagLevel}`, heading);
}

function addPTags(paragraphs) {
  return paragraphs.map(paragraph => addPTag(paragraph));
}

function addPTag(paragraph) {
  return addTag('p', paragraph);
}

function addTag(tag, content) {
  return `<${tag}>${content}</${tag}>`;
}

function getRandomArrayElement(array) {
  return array[getRandomInt(0, array.length - 1)];
}

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/*
 * Start the server
 */

module.exports = app.listen(port, () => console.log(`Listening on ${port}`));
