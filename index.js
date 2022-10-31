import express from "express";
import searchMovies from "./searchMovies.js";
const app = express();
const port = process.env.PORT || 5000;
app.get("/", (req, res) => {
  res.json({
    message: "Welcome",
  });
});
app.get("/search/:title", async (req, res) => {
  await searchMovies(req.params.title).then((movies) => {
    res.json(movies);
  });
});

app.listen(port, () => {});
