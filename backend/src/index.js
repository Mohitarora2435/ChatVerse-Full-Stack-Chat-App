import express from "express";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/auth.js";
import messageRoutes from "./routes/message.js";
import dotenv from "dotenv";
import cors from "cors";
import { app, server } from "./lib/socket.js";

dotenv.config();
import { ConnectDB } from "./lib/db.js";

import path from 'path'


const port = process.env.PORT;
const __dirname = path.resolve()

app.use(express.json({ limit: "50mb" }));
app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);


app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../frontend/dist")));

  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend", "dist", "index.html"));
  });
}



ConnectDB().then(() => {
  server.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
  });
});
