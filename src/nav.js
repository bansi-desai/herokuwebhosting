const express = require('express');
const app = express();
const port = 8000 ;

app.get("/",(req , res) =>{
    res.send("Hello wel come to home page!");
});

app.get("/about",(req , res) =>{
    res.send("Hello from about page");
});

app.listen(port,() => {
    console.log(`server is listing the port at ${port}`);
});