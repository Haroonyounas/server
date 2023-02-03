import dotenv from "dotenv";
dotenv.config();
import express from "express";
import mongoose from "mongoose";
import userRouter from "./routes/user-routes";
import adminRouter from "./routes/admin-routes";
import movieRouter from "./routes/movie-routes";
import bookingsRouter from "./routes/booking-routes";
const app = express();
// const cors = require('cors')
import cors from "cors"


app.use(cors({
origin: "http://localhost:3000",
methods:["GET","POST","PUT","DELETE"],
}));


// middleWARES
app.use(express.json());
app.use("/user", userRouter);
app.use("/admin", adminRouter);
app.use("/movie", movieRouter);
app.use("/booking", bookingsRouter);

app.listen(process.env.PORT, () =>
console.log("Connected to Database and server is running port 8000"))

//
mongoose.set('strictQuery', false);

//DataBase 

mongoose.connect(`mongodb+srv://admin:${process.env.MONGODB_PASSWORD}@cluster0.4g2sbq7.mongodb.net/movie-booking-system`, (error => {
    if (error){
        console.log(error)
    }
}));






