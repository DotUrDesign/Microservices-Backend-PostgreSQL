const express = require('express');
const app = express();
const postRouter = require('./Routers/postRouter.js');

app.use(express.json());

app.use('/post', postRouter);

app.listen(8002, () => {
    console.log("Server is running at port 8002");
});