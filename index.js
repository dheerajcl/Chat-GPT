const { Configuration, OpenAIApi } = require("openai");
const express = require('express');
const bodyParser=require('body-parser')
const cors=require('cors')
const configuration = new Configuration({
    organization: "org-HAYLuBOVDIsjTvhmRYiBIMpw",
    apiKey:"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",
});
const openai = new OpenAIApi(configuration);
  

const app = express();
app.use(bodyParser.json())
app.use(cors())
const port = 3040;

app.post('/', async (req, res) => {
    const {message} = req.body;
    console.log(message, "message")
     const response = await openai.createCompletion({
         model: "text-davinci-003",
         prompt: `${message}`,
         max_tokens: 200,
         temperature: 0.4,
       });
      res.json({
        message:response.data.choices[0].text,
      })
});

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
});