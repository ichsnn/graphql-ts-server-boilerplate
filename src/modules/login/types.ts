import * as Types from "../../types/graphql";
import * as gm from "graphql-modules";
export namespace LoginModule {
  interface DefinedFields {
    Query: 'bye2';
    Mutation: 'login';
    Error: 'path' | 'message';
  };
  
  export type Query = Pick<Types.Query, DefinedFields['Query']>;
  export type Mutation = Pick<Types.Mutation, DefinedFields['Mutation']>;
  export type Error = Pick<Types.Error, DefinedFields['Error']>;
  
  export type QueryResolvers = Pick<Types.QueryResolvers, DefinedFields['Query']>;
  export type MutationResolvers = Pick<Types.MutationResolvers, DefinedFields['Mutation']>;
  export type ErrorResolvers = Pick<Types.ErrorResolvers, DefinedFields['Error'] | '__isTypeOf'>;
  
  export interface Resolvers {
    Query?: QueryResolvers;
    Mutation?: MutationResolvers;
    Error?: ErrorResolvers;
  };
  
  export interface MiddlewareMap {
    '*'?: {
      '*'?: gm.Middleware[];
    };
    Query?: {
      '*'?: gm.Middleware[];
      bye2?: gm.Middleware[];
    };
    Mutation?: {
      '*'?: gm.Middleware[];
      login?: gm.Middleware[];
    };
    Error?: {
      '*'?: gm.Middleware[];
      path?: gm.Middleware[];
      message?: gm.Middleware[];
    };
  };
}