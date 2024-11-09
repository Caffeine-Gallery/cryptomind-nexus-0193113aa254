import { backend } from "declarations/backend";

const NEWS_API_KEY = '4a83e1a1d4msh4ad4d6b908e1708p1b5e03jsn2cf8012d1e46';
const NEWS_API_HOST = 'crypto-news16.p.rapidapi.com';

class NewsApp {
    constructor() {
        this.currentTopic = 'all';
        this.articles = [];
        this.init();
    }

    async init() {
        this.setupEventListeners();
        await this.fetchNews();
    }

    setupEventListeners() {
        document.querySelectorAll('#topicsList button').forEach(button => {
            button.addEventListener('click', (e) => {
                this.handleTopicChange(e.target.dataset.topic);
            });
        });
    }

    async fetchNews() {
        this.showLoading(true);
        try {
            const options = {
                method: 'GET',
                headers: {
                    'X-RapidAPI-Key': NEWS_API_KEY,
                    'X-RapidAPI-Host': NEWS_API_HOST
                }
            };

            const response = await fetch('https://crypto-news16.p.rapidapi.com/news/top/50', options);
            const articles = await response.json();
            
            // Store articles in backend
            await backend.storeArticles(articles.map(article => ({
                title: article.title,
                description: article.description || "",
                url: article.url,
                topic: this.classifyArticle(article.title + " " + (article.description || ""))
            })));

            // Retrieve classified articles
            this.articles = await backend.getArticles();
            this.renderArticles();
        } catch (error) {
            console.error('Error fetching news:', error);
            document.getElementById('articles').innerHTML = `
                <div class="alert alert-danger">
                    Failed to load news. Please try again later.
                </div>
            `;
        }
        this.showLoading(false);
    }

    classifyArticle(content) {
        const topics = {
            infrastructure: ['cloud', 'infrastructure', 'computing', 'hardware', 'gpu'],
            models: ['model', 'neural network', 'machine learning', 'deep learning'],
            applications: ['app', 'application', 'solution', 'platform', 'product'],
            ethics: ['ethics', 'governance', 'regulation', 'privacy', 'security']
        };

        content = content.toLowerCase();
        for (const [topic, keywords] of Object.entries(topics)) {
            if (keywords.some(keyword => content.includes(keyword))) {
                return topic;
            }
        }
        return 'general';
    }

    handleTopicChange(topic) {
        this.currentTopic = topic;
        document.querySelectorAll('#topicsList button').forEach(button => {
            button.classList.toggle('active', button.dataset.topic === topic);
        });
        this.renderArticles();
    }

    renderArticles() {
        const filteredArticles = this.currentTopic === 'all' 
            ? this.articles 
            : this.articles.filter(article => article.topic === this.currentTopic);

        const articlesHTML = filteredArticles.map(article => `
            <div class="col-md-6 col-lg-4">
                <div class="card article-card h-100">
                    <span class="badge topic-${article.topic} topic-badge">${article.topic}</span>
                    <div class="card-body">
                        <h5 class="card-title">${article.title}</h5>
                        <p class="card-text">${article.description || ''}</p>
                        <a href="${article.url}" target="_blank" class="btn btn-primary">Read More</a>
                    </div>
                </div>
            </div>
        `).join('');

        document.getElementById('articles').innerHTML = articlesHTML || `
            <div class="col">
                <div class="alert alert-info">
                    No articles found for this topic.
                </div>
            </div>
        `;
    }

    showLoading(show) {
        document.getElementById('loading').classList.toggle('d-none', !show);
    }
}

new NewsApp();
