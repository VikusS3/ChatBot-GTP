import express from 'express'
import * as dotenv from 'dotenv'
import cors from 'cors'
import { Configuration, OpenAIApi } from 'openai'

dotenv.config()

 

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

const app = express()
app.use(cors())
app.use(express.json())

app.get('/', async (req, res) => {
  res.status(200).send({
    message: 'Hola desde bot-programer'
  })
})

app.post('/', async (req, res) => {
  try {
    const prompt = req.body.prompt;

    const response = await openai.createCompletion({
      model: "gpt-3.5-turbo",
      //model: "text-davinci-003",
      prompt: `${prompt}`,
      temperature: 0, // Los valores más altos significan que el modelo asumirá más riesgos.
      max_tokens: 3000, // El número máximo de tokens a generar en la finalización. La mayoría de los modelos tienen una longitud de contexto de 2048 tokens (excepto los modelos más nuevos, que admiten 4096).
      top_p: 1, // alternativa al muestreo con temperatura, llamado muestreo de núcleo
      frequency_penalty: 0.5, // Número entre -2.0 y 2.0. Los valores positivos penalizan los tokens nuevos en función de su frecuencia existente en el texto hasta el momento, lo que reduce la probabilidad de que el modelo repita la misma línea palabra por palabra.
      presence_penalty: 0, //Número entre -2.0 y 2.0. Los valores positivos penalizan los nuevos tokens en función de si aparecen en el texto hasta el momento, lo que aumenta la probabilidad de que el modelo hable sobre nuevos temas. .
    });

    res.status(200).send({
      bot: response.data.choices[0].text
    });

  } catch (error) {
    console.error(error)
    res.status(500).send(error || 'Something went wrong');
  }
})

app.listen(5000, () => console.log('AI server started on http://localhost:5000'))
