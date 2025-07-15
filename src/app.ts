import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import passport from "passport";
import expressSession from "express-session";
import router from "./app/routes";
import { globalErrorHandler, notFound } from "./app/middlewares";
import "./app/config/passport";

const app = express();

app.use(expressSession({ secret: "Your secret", resave: false, saveUninitialized: false }));
app.use(passport.initialize());
app.use(passport.session());
app.use(cookieParser());
app.use(cors());
app.use(express.json());

app.use("/api/v1", router);

app.use(globalErrorHandler);
app.use(notFound);

export default app;