import express from "express";
import cors from "cors";
import router from "./app/routes";
import { globalErrorHandler } from "./app/middlewares/globalErrorHandler";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/v1", router);

app.use(globalErrorHandler);

export default app;