const Joi = require('joi');

const signupSchema = Joi.object({
  firstName: Joi.string().trim().required().min(2).max(50),
  lastName: Joi.string().trim().required().min(2).max(50),
  username: Joi.string().trim().required().min(3).max(30).lowercase(),
  email: Joi.string().trim().email().required(),
  password: Joi.string().required().min(8).max(72),
  confirmPassword: Joi.string().valid(Joi.ref('password')).required(),
  age: Joi.number().min(13).max(120).required(),
  gender: Joi.string().valid('male', 'female', 'preferred-not-to-say').required(),
  phone: Joi.string().trim().pattern(/^[0-9]{10}$/).required()
});

const signinSchema = Joi.object({
  email: Joi.string().trim().email().required(),
  password: Joi.string().required()
});

exports.validateSignup = (req, res, next) => {
  const { error } = signupSchema.validate(req.body);
  
  if (error) {
    return res.status(400).json({
      message: 'Validation Error',
      details: error.details.map(detail => detail.message)
    });
  }
  
  next();
};

exports.validateSignin = (req, res, next) => {
  const { error } = signinSchema.validate(req.body);
  
  if (error) {
    return res.status(400).json({
      message: 'Validation Error',
      details: error.details.map(detail => detail.message)
    });
  }
  
  next();
};

