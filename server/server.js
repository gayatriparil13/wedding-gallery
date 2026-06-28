require("dotenv").config();

const express = require("express");
const cors = require("cors");
const path = require("path");

const connectDB = require("./config/db");
const imageRoutes = require("./routes/imageRoutes");

const app = express();


// Database connection
connectDB();


app.use(cors());
app.use(express.json());

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use("/api", imageRoutes);


app.get("/", (req, res) => {
    res.send("Wedding Gallery API");
});


const PORT = 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});