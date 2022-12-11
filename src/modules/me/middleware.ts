import { ResolverFn } from "../../types";

export default async (
  resolver: ResolverFn<any, any, any, any>,
  parent: any,
  args: any,
  context: any,
  info: any
) => {
  // middleware
  const resut = await resolver(parent, args, context, info);
  // afterware
  return resut;
};
