import { Router } from "express";
import authRoute from "./routes/authRoute.js";
const routes = Router();

routes.use("/auth", authRoute);

routes.get("/", (req, res) => {
  res.json("welcome in my blog server");
});

export default routes;
