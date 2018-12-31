var express = require('express');
const app = express();
const port = process.env.PORT || 3000;
const categoriesRoutes = require('./app/routes/categoriesRoutes');
const authorsRoutes = require('./app/routes/authorsRoutes');
const booksRoutes = require('./app/routes/booksRoutes');
const bodyParser = require('body-parser');
const logger = require('./app/logger');



app.use(bodyParser.json());

app.use('/categories', categoriesRoutes);
app.use('/authors', authorsRoutes);
app.use('/books', booksRoutes);

app.listen(port, () => {
    console.log(`Started up at port ${port}`);
});

module.exports = {app};
