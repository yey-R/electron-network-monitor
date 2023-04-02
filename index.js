const express = require("express");

const app = express();
const port = 7000;

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.get("/", (req, res) => {
    res.render("index");
});

appExpress.listen(port, () => {
    console.log("Backend connected!");
});