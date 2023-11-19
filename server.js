const { Configuration, OpenAIApi } = require("openai");
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
require('dotenv').config();


const app = express();
app.use(bodyParser.json());
const port = process.env.PORT || 3040;

const configuration = new Configuration({
  organization: "org-HAYLuBOVDIsjTvhmRYiBIMpw",
  apiKey: process.env.MY_OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

const corsOptions = {
  origin: "https://chat-gpt-xi-peach.vercel.app/",
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  credentials: true,
  optionsSuccessStatus: 204,
};

app.use(cors(corsOptions));

app.get("/", (req, res) => {
  res.send("Welcome to the ChatGPT!");
});


app.post("/api", async (req, res) => {
  const { message } = req.body;
  console.log("Received message", message);

  const response = await openai.createCompletion({
    model: "gpt-3.5-turbo-instruct",
    prompt: `${message}`,
    max_tokens: 500,
    temperature: 0.4,
  });
  const responseData = response.data.choices[0].text.trim();
  console.log("Generated response", responseData);

  res.json({
    message: responseData,
  });
});

app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`);
});
