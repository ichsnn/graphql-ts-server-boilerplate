import { ValidationError } from "yup";
import { Error, ResolverTypeWrapper } from "../types";

export const formatYupError = (err: ValidationError) => {
  const errors: ResolverTypeWrapper<Error>[] = [];
  err.inner.forEach((e) => {
    errors.push({ path: e.path!, message: e.message! });
  });
  return errors;
};
