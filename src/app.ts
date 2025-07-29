import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import passport from "passport";
import expressSession from "express-session";
import router from "./app/routes";
import { globalErrorHandler, notFound } from "./app/middlewares";
import "./app/config/passport";
import { env } from "./app/config/env";

const app = express();

app.use(expressSession({ secret: "Your secret", resave: false, saveUninitialized: false }));
app.use(passport.initialize());
app.use(passport.session());
app.use(cookieParser());
app.use(express.json());
app.set("trust proxy", 1);
app.use(express.urlencoded({ extended: true }));
app.use(cors({ 
    origin: env.FRONTEND_URL,
    credentials: true
}));

app.use("/api/v1", router);

app.use(globalErrorHandler);
app.use(notFound);

export default app;