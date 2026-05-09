const { app } = require('./app');

const port = process.env.PORT || 8080;

app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`Planora backend listening on http://localhost:${port}`);
});

