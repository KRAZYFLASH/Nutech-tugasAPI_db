import express from "express";
import cors from "cors";
import { membershipRouter } from "./routes/membership.routes.js";
import {informationRouter} from "./routes/information.routes.js";
import { transactionRouter } from "./routes/transaction.routes.js";

const app = express();

// Middlewares
app.use(express.json());
app.use(cors());

// Routes
app.use("/", membershipRouter);
app.use("/", informationRouter);
app.use("/", transactionRouter);

app.get('/', (req,res)=>{
    res.send('API WORKING Great')
})

export default app;
