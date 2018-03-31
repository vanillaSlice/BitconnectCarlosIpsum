const request = require('supertest');
const server = require('./server');
const headings = require('./headings.json');
const quotes = require('./quotes.json');

/*
 * Test helpers
 */

function expectInvalidHTagLevelsToThrowErrors(baseUrl) {
  expectInvalidHTagLevelToThrowError(baseUrl, 0);
  expectInvalidHTagLevelToThrowError(baseUrl, 7);
  expectInvalidHTagLevelToThrowError(baseUrl, '');
  expectInvalidHTagLevelToThrowError(baseUrl, 'bitconneeeeect');
}

function expectInvalidHTagLevelToThrowError(baseUrl, hTagLevel) {
  it(`?hTagLevel=${hTagLevel} returns an error`, (done) => {
    request(server)
      .get(`${baseUrl}?hTagLevel=${hTagLevel}`)
      .expect(422, done);
  });
}

/*
 * Tests
 */

describe('GET /api/headings', () => {
  const baseUrl = '/api/headings';

  it('returns array of all headings', (done) => {
    request(server)
      .get(baseUrl)
      .expect(200, { headings }, done);
  });

  for (let i = 1; i <= 6; i += 1) {
    it(`?hTagLevel=${i} returns array of all headings with surrounding <h${i}> tags`, (done) => {
      const headingsWithTags = headings.map(heading => `<h${i}>${heading}</h${i}>`);
      request(server)
        .get(`${baseUrl}?hTagLevel=${i}`)
        .expect(200, { headings: headingsWithTags }, done);
    });
  }

  expectInvalidHTagLevelsToThrowErrors(baseUrl);
});

describe('GET /api/headings/random', () => {
  const baseUrl = '/api/headings/random';

  it('returns a random heading', () => (request(server)
    .get(baseUrl)
    .expect(200)
    .then((res) => {
      expect(headings.includes(res.body.heading)).toBe(true);
    })
  ));

  for (let i = 1; i <= 6; i += 1) {
    it(`?hTagLevel=${i} returns a heading with surrounding <h${i}> tags`, () => (request(server)
      .get(`${baseUrl}?hTagLevel=${i}`)
      .expect(200)
      .then((res) => {
        const { heading } = res.body;
        expect(heading.startsWith(`<h${i}>`)).toBe(true);
        expect(heading.endsWith(`</h${i}>`)).toBe(true);
      })
    ));
  }

  expectInvalidHTagLevelsToThrowErrors(baseUrl);
});

describe('GET /api/quotes', () => {
  const baseUrl = '/api/quotes';

  function expectReturnsArrayOfAllQuotes(message, url) {
    it(message, (done) => {
      request(server)
        .get(url)
        .expect(200, { quotes }, done);
    });
  }

  expectReturnsArrayOfAllQuotes('returns array of all quotes', baseUrl);

  expectReturnsArrayOfAllQuotes(
    '?includePTags=false returns array of all quotes without surrounding <p> tags',
    `${baseUrl}?includePTags=false`,
  );

  expectReturnsArrayOfAllQuotes(
    '?includePTags= returns array of all quotes without surrounding <p> tags',
    `${baseUrl}?includePTags=`,
  );

  expectReturnsArrayOfAllQuotes(
    '?includePTags=bitconneccccct returns array of all quotes without surrounding <p> tags',
    `${baseUrl}?includePTags=bitconneccccct`,
  );

  it('?includePTags=true returns array of all quotes with surrounding <p> tags', (done) => {
    const quotesWithTags = quotes.map(quote => `<p>${quote}</p>`);
    request(server)
      .get(`${baseUrl}?includePTags=true`)
      .expect(200, { quotes: quotesWithTags }, done);
  });
});

describe('GET /api/quotes/random', () => {
  const baseUrl = '/api/quotes/random';

  function expectReturnsAQuote(message, url) {
    it(message, () => (request(server)
      .get(url)
      .expect(200)
      .then((res) => {
        expect(quotes.includes(res.body.quote)).toBe(true);
      })
    ));
  }

  expectReturnsAQuote('returns a random quote', baseUrl);

  expectReturnsAQuote(
    '?includePTags=false returns a quote without surrounding <p> tags',
    `${baseUrl}?includePTags=false`,
  );

  expectReturnsAQuote(
    '?includePTags= returns a quote without surrounding <p> tags',
    `${baseUrl}?includePTags=`,
  );

  expectReturnsAQuote(
    '?includePTags=bitconneccccct returns a quote without surrounding <p> tags',
    `${baseUrl}?includePTags=bitconneccccct`,
  );

  it('?includePTags=true returns a quote with surrounding <p> tags', () => (request(server)
    .get(`${baseUrl}?includePTags=true`)
    .expect(200)
    .then((res) => {
      const { quote } = res.body;
      expect(quote.startsWith('<p>')).toBe(true);
      expect(quote.endsWith('</p>')).toBe(true);
    })
  ));
});

describe('GET /api/text', () => {
  const baseUrl = '/api/text';

  // include headings/excludes headings
  // surrounds headings with h tags
  // validate minQuote and maxQuote
  // validate paragraphs

  expectInvalidHTagLevelsToThrowErrors(baseUrl);

  // function expectInvalidParagraphsToThrowError(message, url) {
  //   it(message, (done) => {
  //     request(server)
  //       .get(url)
  //       .expect(422, done);
  //   });
  // }
});

afterAll(() => {
  server.close();
});
