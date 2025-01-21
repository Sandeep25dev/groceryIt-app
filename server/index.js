import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import helmet from "helmet";
import dotenv from "dotenv";
import connectToDB from "./config/connectDB.js";
import userRouter from "./routes/user.route.js";
dotenv.config();

const app = express();

app.use(
  cors({
    credentials: true,
    origin: process.env.FRONTEND_URL,
  })
);

app.use(express.json());
app.use(cookieParser());
app.use(morgan());
app.use(
  helmet({
    crossOriginResourcePolicy: false,
  })
);

const PORT = 8080 || process.env.PORT;

app.get("/", function (req, res) {
  res.send("Hello from the home page");
});

app.use("/api/user", userRouter);

connectToDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server is live on PORT ${PORT}`);
  });
});
