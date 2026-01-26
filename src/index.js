import dotenv from "dotenv";
import connectDB from "./db/index.db.js";
import { app } from "./app.js";

dotenv.config({
    path: "./env"
})

const port = process.env.PORT || 8000;

connectDB()
    .then(() => {
        const server = app.listen(port, () => {

            console.log(`server is running on port ${process.env.PORT}`)
        })

        server.on("error", (error) => {
            console.error("server Error :", error)
            process.exit(1);
        })
    })
    .catch((error) => {
        console.log("MonogoDB Connection failed !!", error);
    })