import Joi from "joi";

export const commentCreateValidation = (obj) => {
  const schema = Joi.object({
    postId: Joi.string().required(),
    text: Joi.string().trim().required(),
  });
};
export const commentUpdateValidation = (obj) => {
  const schema = Joi.object({
    postId: Joi.string(),
    text: Joi.string().trim(),
  });
};
