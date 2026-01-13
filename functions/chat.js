import OpenAI from "openai";

export async function handler(event) {
  try {
    const { message } = JSON.parse(event.body);

    const client = new OpenAI({
      apiKey: process.env.OPENAI_KEY
    });

    const response = await client.responses.create({
      model: "gpt-4.1-mini",
      input: message
    });

    return {
      statusCode: 200,
      body: JSON.stringify({
        reply: response.output[0].content[0].text
      })
    };

  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message })
    };
  }
}

