import express from 'express';

const app = express();

app.use(express.json())

//importing the routes
import userRoute from "./routes/user.route.js"
import adminRoute from "./routes/admin.route.js"



app.use("/api/v1/user", userRoute);
app.use("/api/v1/admin", adminRoute);


export {app}
