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

const maxQuotesGreaterThanMinQuotesValidator = query('maxQuotes')
  .custom((value, { req }) => {
    if (value < req.query.minQuotes) {
      throw new Error('maxQuotes must be greater than minQuotes');
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
    res.send({ headings: getHeadings(req.query.hTagLevel) });
  } else {
    res.status(422).send({ errors: errors.mapped() });
  }
});

app.get('/api/headings/random', [hTagLevelValidator], (req, res) => {
  const errors = validationResult(req);
  if (errors.isEmpty()) {
    res.send({ heading: getRandomHeading(req.query.hTagLevel) });
  } else {
    res.status(422).send({ errors: errors.mapped() });
  }
});

app.get('/api/quotes', [includePTagsValidator], (req, res) => {
  const errors = validationResult(req);
  if (errors.isEmpty()) {
    res.send({ quotes: getQuotes(req.query.includePTags) });
  } else {
    res.status(422).send({ errors: errors.mapped() });
  }
});

app.get('/api/quotes/random', [includePTagsValidator], (req, res) => {
  const errors = validationResult(req);
  if (errors.isEmpty()) {
    res.send({ quote: getRandomQuote(req.query.includePTags) });
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
    maxQuotesGreaterThanMinQuotesValidator,
  ], (req, res) => {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
      res.send({ text: getText(req.query) });
    } else {
      res.status(422).send({ errors: errors.mapped() });
    }
  },
);

/*
 * Helper functions
 */

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getRandomArrayElement(array) {
  return array[getRandomInt(0, array.length - 1)];
}

function addTag(tag, content) {
  return `<${tag}>${content}</${tag}>`;
}

function getHeadings(hTagLevel) {
  return hTagLevel ? addHTags(hTagLevel, headings) : headings;
}

function getRandomHeading(hTagLevel) {
  const heading = getRandomArrayElement(headings);
  return hTagLevel ? addHTag(hTagLevel, heading) : heading;
}

function addHTags(hTagLevel, headings) {
  return headings.map(heading => addHTag(hTagLevel, heading));
}

function addHTag(hTagLevel, heading) {
  return addTag(`h${hTagLevel}`, heading);
}

function getQuotes(includePTags) {
  return includePTags ? addPTags(quotes) : quotes;
}

function getRandomQuote(includePTags) {
  const quote = getRandomArrayElement(quotes);
  return includePTags ? addPTag(quote) : quote;
}

function addPTags(paragraphs) {
  return paragraphs.map(paragraph => addPTag(paragraph));
}

function addPTag(paragraph) {
  return addTag('p', paragraph);
}

function getText(options) {
  const text = [];
  for (let i = 0; i < options.paragraphs; i += 1) {
    text.push(getTextEntry(options));
  }
  return text;
}

function getTextEntry(options) {
  const entry = {};

  if (options.includeHeadings) {
    entry.heading = getRandomHeading(options.hTagLevel);
  }

  entry.paragraph = getParagraph(options);

  return entry;
}

function getParagraph(options) {
  let paragraph = '';

  const quotesInParagraph = getRandomInt(options.minQuotes, options.maxQuotes);

  for (let i = 0; i < quotesInParagraph; i += 1) {
    paragraph += `${getRandomArrayElement(quotes)} `;
  }

  paragraph = paragraph.trim();

  if (options.includePTags) {
    paragraph = addPTag(paragraph);
  }

  return paragraph;
}

/*
 * Start the server
 */

module.exports = app.listen(port, () => console.log(`Listening on ${port}`));
