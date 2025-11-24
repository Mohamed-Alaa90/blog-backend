const express = require("express");
const app = express();

const PORT = 5000 || process.env;

app.get("", (res) => {
  res.send("Hello");
});

app.listen(PORT, () => {
  console.info("APP listen In Port", PORT);
});
