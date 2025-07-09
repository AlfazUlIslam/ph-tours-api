import express from "express";
import cors from "cors";
// import userRoutes from "./app/modules/user/user.route";
import router from "./app/routes";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/v1", router);

export default app;