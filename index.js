import express from "express";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import connectDB from "./config/connection.js";
import cors from "cors";
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();
const app = express();
app.use('/api', express.static(path.join(__dirname, 'public')));

connectDB();
app.use(bodyParser.json({ limit: "100mb" }));
app.use(
  bodyParser.urlencoded({
    extended: true,
    limit: "100mb",
    parameterLimit: 100000,
  })
);

app.use(
  cors({
    origin: "*",
  })
);

import apiRoutes from "./routes/index.route.js";
// Use routes
app.use("/api", apiRoutes);

app.get("/", (req, res) => {
  res.send("Hello World!!!!!!!");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, (error) => {
  if (error) {
    console.log(error);
  }
  console.log(`Server is running on port ${PORT}`);
});
