import * as Types from "../../types/graphql";
import * as gm from "graphql-modules";
export namespace RegisterModule {
  interface DefinedFields {
    Mutation: 'register';
    Error: 'path' | 'message';
  };
  
  export type Mutation = Pick<Types.Mutation, DefinedFields['Mutation']>;
  export type Error = Pick<Types.Error, DefinedFields['Error']>;
  
  export type MutationResolvers = Pick<Types.MutationResolvers, DefinedFields['Mutation']>;
  export type ErrorResolvers = Pick<Types.ErrorResolvers, DefinedFields['Error'] | '__isTypeOf'>;
  
  export interface Resolvers {
    Mutation?: MutationResolvers;
    Error?: ErrorResolvers;
  };
  
  export interface MiddlewareMap {
    '*'?: {
      '*'?: gm.Middleware[];
    };
    Mutation?: {
      '*'?: gm.Middleware[];
      register?: gm.Middleware[];
    };
    Error?: {
      '*'?: gm.Middleware[];
      path?: gm.Middleware[];
      message?: gm.Middleware[];
    };
  };
}