import * as Types from "../../types/graphql";
import * as gm from "graphql-modules";
export namespace RegisterModule {
  interface DefinedFields {
    Mutation: 'register';
  };
  
  export type Mutation = Pick<Types.Mutation, DefinedFields['Mutation']>;
  
  export type MutationResolvers = Pick<Types.MutationResolvers, DefinedFields['Mutation']>;
  
  export interface Resolvers {
    Mutation?: MutationResolvers;
  };
  
  export interface MiddlewareMap {
    '*'?: {
      '*'?: gm.Middleware[];
    };
    Mutation?: {
      '*'?: gm.Middleware[];
      register?: gm.Middleware[];
    };
  };
}