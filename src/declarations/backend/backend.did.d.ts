import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';
import type { IDL } from '@dfinity/candid';

export interface Article {
  'url' : string,
  'title' : string,
  'topic' : string,
  'description' : string,
}
export interface _SERVICE {
  'getArticles' : ActorMethod<[], Array<Article>>,
  'getArticlesByTopic' : ActorMethod<[string], Array<Article>>,
  'storeArticles' : ActorMethod<[Array<Article>], undefined>,
}
export declare const idlFactory: IDL.InterfaceFactory;
export declare const init: (args: { IDL: typeof IDL }) => IDL.Type[];
