const express = require("express");
const app = express();

app.use(express.static("public"));

//Layouts
const expressLayout = require("express-ejs-layouts");
app.use(expressLayout);
app.set("layout", "layouts/main");
app.set("view engine", "ejs");

app.get("", (res, req) => {
  res.send("Hello");
});


const PORT = 5000 || process.env;
app.listen(PORT, () => {
  console.info("APP listen In Port", PORT);
});
