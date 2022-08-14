import "express-async-errors"; // Can't believe you have to rely on ancient packages for this...

import { Application } from "./application";
import { AuthRoutes } from "./web/routes/authRoutes";
import dotenv from "dotenv";

dotenv.config();

const app = new Application([new AuthRoutes()]);

//No top level await :(
app.initalizeQueue().then(() => {
    app.listen();
});
