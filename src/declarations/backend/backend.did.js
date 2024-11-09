export const idlFactory = ({ IDL }) => {
  const Article = IDL.Record({
    'url' : IDL.Text,
    'title' : IDL.Text,
    'topic' : IDL.Text,
    'description' : IDL.Text,
  });
  return IDL.Service({
    'getArticles' : IDL.Func([], [IDL.Vec(Article)], ['query']),
    'getArticlesByTopic' : IDL.Func([IDL.Text], [IDL.Vec(Article)], ['query']),
    'storeArticles' : IDL.Func([IDL.Vec(Article)], [], []),
  });
};
export const init = ({ IDL }) => { return []; };
