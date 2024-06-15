export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
};

export type Error = {
  __typename?: 'Error';
  message: Scalars['String']['output'];
  path: Scalars['String']['output'];
};

export type Mutation = {
  __typename?: 'Mutation';
  login?: Maybe<Array<Error>>;
  register?: Maybe<Array<Error>>;
};


export type MutationLoginArgs = {
  email: Scalars['String']['input'];
  password: Scalars['String']['input'];
};


export type MutationRegisterArgs = {
  email: Scalars['String']['input'];
  password: Scalars['String']['input'];
};

export type Query = {
  __typename?: 'Query';
  hello: Scalars['String']['output'];
  me: QueryResponse;
  test: Scalars['String']['output'];
};


export type QueryHelloArgs = {
  name?: InputMaybe<Scalars['String']['input']>;
};


export type QueryMeArgs = {
  name?: InputMaybe<Scalars['String']['input']>;
};


export type QueryTestArgs = {
  name?: InputMaybe<Scalars['String']['input']>;
};

export type QueryResponse = {
  __typename?: 'QueryResponse';
  error?: Maybe<Array<Error>>;
  name?: Maybe<Scalars['String']['output']>;
};
