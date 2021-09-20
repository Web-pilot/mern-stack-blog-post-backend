const express = require("express");
const app = express();

app.use(express.json());
app.post("/user", (req, res) => {
  console.log(req.body);
});

app.listen(3000, () => {
  console.log("Server is listening at port 3000...");
});
