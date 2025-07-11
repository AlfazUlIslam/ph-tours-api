import express from "express";
import cors from "cors";
import router from "./app/routes";
import { globalErrorHandler, notFound } from "./app/middlewares"; 

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/v1", router);

app.use(globalErrorHandler);
app.use(notFound);

export default app;