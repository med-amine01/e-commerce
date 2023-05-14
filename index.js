const express = require("express");
require("./db/connect");

const users_router = require('./routers/users')
const itemRouter = require('./routers/itemRouter')
const auth = require('./middlewars/auth')
const app = express();
const port = 3000;
app.use(express.json());
app.use("/api/v1/users", users_router);
app.use('/api/v1/items', itemRouter);

//test authentication (if user logged in )
//app.use(auth)
app.use("/api/students", student_router);
app.use("/api/classes",auth, classes_router);

app.listen(port, () => console.log(`Student app listening on port ${port}!`));
