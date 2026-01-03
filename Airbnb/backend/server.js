import { app } from "./index.js";
import { connectDb } from "./config/db.js";
import dotenv from "dotenv";

dotenv.config();

let port = process.env.PORT || 6000;

app.listen(port, () => {
    connectDb();
    console.log("server started on port " + port);
});
