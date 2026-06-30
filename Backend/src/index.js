import dotenv from "dotenv";
import connectDB from "./db/dbConnection.js";
import { app } from "./app.js";
import dns from "dns";

dotenv.config({
  path: "./.env",
});

// Only apply the DNS fix locally on own machine
if (process.env.NODE_ENV === "development") {
  dns.setServers(["8.8.8.8", "8.8.4.4"]);
}

const port = process.env.PORT || 8000;

connectDB()
  .then(() => {
    app.listen(port, () => {
      console.log(`Server is running: http://localhost:${port}`);
    });
  })
  .catch((err) => {
    console.log("MongoDB connection failed!!", err);
  });
