const path = require("path");
const express = require('express');
const app = express();
const staticpath = path.join(__dirname,"../public");

app.use(express.static(staticpath));

app.get("/",(req , res) =>{
    res.send("HELLO WORLD!");
});

app.listen(8000,() => {
    console.log("server is listing the port at  8000");
});