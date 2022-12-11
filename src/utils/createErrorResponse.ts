import { Error } from "../types";

export const createErrorResponse = (path: string, message: string): Error => {
  return {
    path,
    message,
  };
};
