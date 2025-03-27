import express, { Request, Response } from "express";
import dotenv from "dotenv";
import path from "path";
import mainRoutes from "./routes/main";

dotenv.config({ path: path.resolve(__dirname, "../src/config/.env") });

const app = express();

app.use("/", mainRoutes)

app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
});