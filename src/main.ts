import dotenv from "dotenv";
import app from "./app";
import connectDatabase from "./app/config/db";

dotenv.config();

const port = process.env.PORT;
const databaseUri = process.env.DATABASE_URI as string;

connectDatabase(databaseUri);

app.listen(port, () => console.log(`App listening on port: ${port}`));