import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { users } from './data/db.js';

const app = express();
const PORT = process.env.PORT || 4000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  res.render('index');
});

app.get('/users', (req, res) => {
  res.render('users', { users });
});

app.get('/users/:userId', (req, res) => {
  const userId = Number(req.params.userId);
  const user = users.find(u => u.id === userId);
  if (!user) return res.status(404).render('error');

  res.render('user', { user, articles: user.articles || [] });
});

app.get('/articles', (req, res) => {
  const allArticles = users.flatMap(user =>
    (user.articles || []).map(article => ({
      ...article,
      userId: user.id,
      author: user.name
    }))
  );
  res.render('articles', { articles: allArticles });
});

app.get('/users/:userId/articles/:articleId', (req, res) => {
  const user = users.find(u => u.id == req.params.userId);
  if (!user) return res.status(404).send('User not found');

  const article = user.articles.find(a => a.id == req.params.articleId);
  if (!article) return res.status(404).send('Article not found');

  const from = req.query.from || 'user'; 
  res.render('article', { article, user, from });
});

app.listen(PORT , () => {
  console.log(`Server running at http://localhost:${PORT}`);
});