import { makeRequired, makeValidate } from "mui-rff";
import * as yup from "yup";

const schema = yup.object().shape({
  name: yup.string().required().min(5),
  description: yup.string().required(),
  price: yup.number().required(),
});

export const validate = makeValidate(schema);

export const required = makeRequired(schema);

export type FormData = yup.InferType<typeof schema>;
