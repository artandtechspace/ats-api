import mongoose from "mongoose";
import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import morgan from "morgan";
import httpError from "http-errors";
import routes from "./routes";
import config from "./config/server.config";
import errorHandler from "./middleware/errorhandler.middleware";

const app = express();

const morganFormat = config.isDev ? "dev" : "combined";
app.use(morgan(morganFormat));

mongoose
    .connect(config.mongoUri, {useUnifiedTopology: true, useNewUrlParser: true,})
    .then(() => console.log('DB Connected!'))
    .catch(err => {console.log({err});});

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(cors());

app.use("/api", ...routes);

app.use((req, res, next) => {
    next(httpError(404));
});

app.use(errorHandler);

app.listen(config.port, () => {
    console.log(`Server started ${config.host}:${config.port}`);
});
