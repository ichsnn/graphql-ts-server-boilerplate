import { ResolverFn } from "../types";

export const createMiddleware =
  (middlewareFunc: any, resolverFunc: ResolverFn<any, any, any, any>) =>
  (parent: any, args: any, context: any, info: any) =>
    middlewareFunc(resolverFunc, parent, args, context, info);
