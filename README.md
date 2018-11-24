# Bitconnect Carlos Ipsum

[![Latest Release](https://img.shields.io/github/release/vanillaSlice/BitconnectCarlosIpsum.svg)](https://github.com/vanillaSlice/BitconnectCarlosIpsum/releases/latest)
[![Build Status](https://img.shields.io/travis/vanillaSlice/BitconnectCarlosIpsum/master.svg)](https://travis-ci.org/vanillaSlice/BitconnectCarlosIpsum)
[![Coverage Status](https://img.shields.io/coveralls/github/vanillaSlice/BitconnectCarlosIpsum/master.svg)](https://coveralls.io/github/vanillaSlice/BitconnectCarlosIpsum?branch=master)
[![License](https://img.shields.io/github/license/vanillaSlice/BitconnectCarlosIpsum.svg)](LICENSE)

A [Bitconnect Carlos](https://www.youtube.com/watch?v=QKO6IChjojI) Lorem Ipsum generator. A deployed
version can be viewed [here](https://bitconnectcarlosipsum.herokuapp.com/).

The app is split into two parts: the client and the server. The client is built with React and the server is
built with Node.js.

## Installing dependencies
```
npm install
```

## Running locally
```
npm start
```

The server runs on [localhost:3001](http://localhost:3001). The client runs on [localhost:3000](http://localhost:3000).

## Building production files
```
npm run build
```

## Running the tests
```
npm test
```

## API

### Get All Headings
Returns all available headings.

* **URL**

  /api/headings

* **Method**

  GET

* **URL Params**

  **Optional**

  hTagLevel=[integer in range 1-6]

* **Response Codes**
 
  Success (200)
  
  Unprocessable Entity (422)

### Get Random Heading
Returns a random heading.

* **URL**

  /api/headings/random

* **Method**

  GET

* **URL Params**

  **Optional**

  hTagLevel=[integer in range 1-6]

* **Response Codes**
 
  Success (200)
  
  Unprocessable Entity (422)

### Get All Quotes
Returns all available quotes.

* **URL**

  /api/quotes

* **Method**

  GET

* **URL Params**

  **Optional**

  includePTags=[boolean]

* **Response Codes**
 
  Success (200)

### Get Random Quote
Returns a random quote.

* **URL**

  /api/quotes/random

* **Method**

  GET

* **URL Params**

  **Optional**

  includePTags=[boolean]

* **Response Codes**
 
  Success (200)

### Get Text
Returns a number of text entries (made up of headings and paragraphs).

* **URL**

  /api/text

* **Method**

  GET

* **URL Params**

  **Required**

  paragraphs=[integer in range 1-100]
  
  minQuotes=[integer in range 1-20]

  maxQuotes=[integer in range 1-20]

  **Optional**

  includePTags=[boolean]
  
  includeHeadings=[boolean]

  hTagLevel=[integer in range 1-6]

* **Response Codes**
 
  Success (200)

  Unprocessable Entity (422)
