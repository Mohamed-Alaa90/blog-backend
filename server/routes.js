import {Router} from "express";
import authRoute from "./routes/authRoute.js";
import usersRoute from "./routes/usersRoute.js";

const routes = Router();

routes.use("/auth", authRoute);
routes.use("/users", usersRoute);

routes.get("/", (req, res) => {
    res.json("welcome in my blog server");
});

export default routes;
