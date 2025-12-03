import express from 'express';
import appRouter from './routes/index.js';
import {config} from "dotenv"
import { connectToDatabse } from './db/Connection.js';
import cors from "cors";

const app = express();

config(); 

app.use(
  cors({
    origin: "http://localhost:5173", // your Vite frontend URL
  })
);

// # Region middlewares
app.use(express.json());

app.use("/api",appRouter)

const PORT = process.env.PORT || 5000;

connectToDatabse().then(() => {

    app.listen(PORT,()=> console.log(`Server running on port ${PORT}`));

}).catch((err) => {
    console.log("Failed to start server due to database connection error", err);
    process.exit(0);
});



