import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_KEY
});

export async function handler(event) {
  try {
    const body = JSON.parse(event.body);

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: "You are a songwriting assistant." },
        { role: "user", content: body.message }
      ]
    });

    return {
      statusCode: 200,
      body: JSON.stringify({
        reply: completion.choices[0].message.content
      })
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message })
    };
  }
}
