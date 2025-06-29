import bodyParser from 'body-parser';
import express from 'express';
import adminRoutes from './routes/admin';
import shopRoutes from './routes/shop';
import path from 'path';
import notFound from './controllers/404'

const app = express();
const port = 3000;

app.set('view cache', false);

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views')); // if running in src/

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


app.use(express.static('public'));


app.use('/admin', adminRoutes);
app.use(shopRoutes);

app.use((req, res, next) => {
  res.status(404).render('404', {
    pageTitle: 'Page Not Found',
    
  });
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
