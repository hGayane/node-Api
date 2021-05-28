const express = require('express');

const app = express();
const port = process.env.PORT || 3001;

app.server = app.listen(port, () => {
  console.log(`Running on port ${port}`);
});