import express from "express";
import cors from "cors";
import "dotenv/config";
import connectDB from "./config/db.js";
import color from "colors";

const app = express();

await connectDB();

app.use(express.json());
app.use(cors({ origin: "*" }));

//routes

app.get("/", (req, res) => {
  res.send("welcome in my blog server");
});

app.listen(process.env.PORT || 9900, () => {
  console.info("server is running".bgBlue);
});
