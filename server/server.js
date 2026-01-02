import express from "express";
import cors from "cors";
import "dotenv/config";
import connectDB from "./config/db.js";
import color from "colors";
import apiRoute from "./routes.js";

const app = express();

await connectDB();

app.use(express.json());
app.use(cors({ origin: "*" }));

//routes
app.use("/api", apiRoute);


app.listen(process.env.PORT || 9900, () => {
  console.info("server is running".bgBlue);
});
