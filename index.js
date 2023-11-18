const { Configuration, OpenAIApi } = require("openai");
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const mongoose = require("mongoose");

const app = express();
app.use(bodyParser.json());
app.use(cors());
const port = 3040;

const configuration = new Configuration({
  organization: "org-HAYLuBOVDIsjTvhmRYiBIMpw",
  apiKey: process.env.MY_OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

mongoose.connect(
  process.env.MY_MONGO_URL,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
);

const chatSchema = new mongoose.Schema({
  message: String,
});

const Chat = mongoose.model("Chat", chatSchema);

app.post("/", async (req, res) => {
  const { message } = req.body;
  console.log("Received message", message);

  // Generate GPT response
  const response = await openai.createCompletion({
    model: "gpt-3.5-turbo-instruct",
    prompt: `${message}`,
    max_tokens: 500,
    temperature: 0.4,
  });
  const responseData = response.data.choices[0].text.trim();
  console.log("Generated response", responseData);

  // Append the GPT response to the chat history
  const newGptMessage = new Chat({ message: responseData });
  await newGptMessage.save();

  res.json({
    message: responseData,
  });
});

// Retrieve chat history from MongoDB
app.get("/history", async (req, res) => {
  try {
    const chatHistory = await Chat.find();
    res.json({ chatHistory });
  } catch (error) {
    console.error("Error fetching chat history:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`);
});
