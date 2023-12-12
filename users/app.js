const express = require('express');
const userRouter = require('./Routes/userRouter.js');
const bodyParser = require('body-parser');

const app = express();

app.use(express.json());
// app.use(bodyParser.urlencoded({ extended: true }));
// app.use(bodyParser.json())

app.use('/user', userRouter);

app.listen(8001, () => {
    console.log("Server is running at port 8001");
})