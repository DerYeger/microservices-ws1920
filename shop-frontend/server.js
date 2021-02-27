const express = require('express');

const app = express();

app.use(express.static(`${__dirname}/dist/ShopFrontend`));

app.get('/*', (req, res) => {
  res.sendFile(`${__dirname}/dist/ShopFrontend/index.html`);
});

app.listen(process.env.PORT || 8080);
