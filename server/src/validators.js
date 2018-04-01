const { query, validationResult } = require('express-validator/check');

const hTagLevelValidator = query('hTagLevel')
  .isInt({ min: 1, max: 6 })
  .withMessage('must be between 1 and 6')
  .toInt()
  .optional();

const includePTagsValidator = booleanValidator('includePTags');

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

const includeHeadingsValidator = booleanValidator('includeHeadings');

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

function errorHandler(req, res, next) {
  const errors = validationResult(req);
  if (errors.isEmpty()) {
    next();
  } else {
    res.status(422).send({ errors: errors.mapped() });
    next('route');
  }
}

module.exports = {
  hTagLevelValidator,
  includePTagsValidator,
  paragraphsValidator,
  includeHeadingsValidator,
  minQuotesAndMaxQuotesValidator,
  minQuotesLessThanMaxQuotesValidator,
  maxQuotesGreaterThanMinQuotesValidator,
  errorHandler,
};
