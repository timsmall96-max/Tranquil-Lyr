export async function handler(event) {
  try {
    if (event.httpMethod !== "POST") {
      return {
        statusCode: 405,
        body: JSON.stringify({ error: "Method not allowed" })
      };
    }

    const body = JSON.parse(event.body || "{}");

    if (!body.message) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "No message sent" })
      };
    }

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: "You are a helpful songwriting assistant." },
          { role: "user", content: body.message }
        ],
        temperature: 0.7
      })
    });

    const data = await response.json();

    // If OpenAI returns an error, forward it
    if (!data.choices || !data.choices.length) {
      return {
        statusCode: 500,
        body: JSON.stringify({
          error: "OpenAI failed",
          raw: data
        })
      };
    }

    return {
      statusCode: 200,
      body: JSON.stringify({
        reply: data.choices[0].message.content
      })
    };

  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message })
    };
  }
}


