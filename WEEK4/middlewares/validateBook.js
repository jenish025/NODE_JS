const Joi = require('joi');

const validateBook = (req, res, next) => {
  const schema = Joi.object({
    title: Joi.string().required(),
    authorId: Joi.number().integer().required(),
    categoryId: Joi.number().integer().required(),
    publicationYear: Joi.number()
      .integer()
      .min(1000)
      .max(new Date().getFullYear())
      .required(),
  });

  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }
  next();
};

module.exports = validateBook;
