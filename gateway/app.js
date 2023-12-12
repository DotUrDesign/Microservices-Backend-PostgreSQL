const express = require('express');
const cors = require('cors');
const proxy  = require('express-http-proxy');

const app = express();

app.use(express.json());
app.use(cors());

app.use('/users', proxy('http://localhost:8001'));
app.use('/posts', proxy('http://localhost:8002'));

app.listen(8000, () => {
    console.log("Server is running at port 8000");
})