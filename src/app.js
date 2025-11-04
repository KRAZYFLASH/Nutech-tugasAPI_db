import express from "express";
import cors from "cors";
import { membershipRouter } from "./routes/membership.routes.js";
import {informationRouter} from "./routes/information.routes.js";
import { transactionRouter } from "./routes/transaction.routes.js";

const app = express();

// Middlewares
app.use(express.json());
app.use(cors({
  origin: '*',
  credentials: true
}));

// Routes
app.use("/", membershipRouter);
app.use("/", informationRouter);
app.use("/", transactionRouter);

app.get('/', (req,res)=>{
    res.send('Muhammad Fakhri-Tugas API is running')
})

export default app;
