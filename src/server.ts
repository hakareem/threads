import express, { Application } from "express";
import mongoose from "mongoose";
import passport from "passport";
import session from "express-session";
import MongoStore from "connect-mongo";
import methodOverride from "method-override";
import flash from "express-flash";
import logger from "morgan";
import connectDB from "./config/db";
import mainRoutes from "./routes/main";
import postRoutes from "./routes/posts";
import path from "path";

import dotenv from "dotenv";
dotenv.config({ path: path.resolve(__dirname, "../src/config/.env") });

// passport config
import passportConfig from "./config/passport";
passportConfig(passport);

const app: Application = express();

connectDB();

// template engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "../src/views"));

app.use(express.static(path.join(__dirname, "../src/public")));

// request parsing middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// logging
app.use(logger("dev"));

// put / delete forms 
app.use(methodOverride("_method"));

// error flash messages
app.use(flash());

// sessions setup
app.use(
  session({
    secret: process.env.SECRET as string,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: process.env.DB_STRING as string,
    }),
  })
);

// passport middleware
app.use(passport.initialize());
app.use(passport.session());

// routes setup
app.use("/", mainRoutes);
app.use("/post", postRoutes);

app.listen(process.env.PORT, () => {
  console.log(`Server is running on PORT ${process.env.PORT}`);
});