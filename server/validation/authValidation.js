import Joi from "joi";

export const registerValidation = (obj) => {
  const schema = Joi.object({
    abortEarly: false,
    username: Joi.string().trim().required(),
    email: Joi.string().trim().required().email(),
    password: Joi.string().trim().min(8).required(),
  });
  return schema.validate(obj);
};
export const loginValidation = (obj) => {
  const schema = Joi.object({
    abortEarly: false,
    email: Joi.string().trim().required().email(),
    password: Joi.string().trim().min(8).required(),
  });
  return schema.validate(obj);
};
