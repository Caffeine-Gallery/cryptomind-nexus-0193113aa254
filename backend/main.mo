import Array "mo:base/Array";
import Buffer "mo:base/Buffer";
import Text "mo:base/Text";

actor {
    // Article type definition
    public type Article = {
        title: Text;
        description: Text;
        url: Text;
        topic: Text;
    };

    // Store articles in a stable variable
    private stable var articles : [Article] = [];

    // Store articles
    public shared func storeArticles(newArticles: [Article]) : async () {
        articles := newArticles;
    };

    // Get all articles
    public query func getArticles() : async [Article] {
        articles
    };

    // Get articles by topic
    public query func getArticlesByTopic(topic: Text) : async [Article] {
        Array.filter<Article>(articles, func(article) {
            article.topic == topic
        })
    };
}
