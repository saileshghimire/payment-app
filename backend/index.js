const express = require("express");
const cors = require("cors");
const app = express();
app.use(cors());
app.use(express.json()); 

const mainRouter = require("./routes/index");
app.use("api/v1",mainRouter);

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
