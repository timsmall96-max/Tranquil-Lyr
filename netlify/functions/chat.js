export async function handler(event) {
  try {
    if (event.httpMethod !== "POST") {
      return {
        statusCode: 405,
        body: JSON.stringify({ error: "Method Not Allowed" })
      };
    }

    const body = JSON.parse(event.body || "{}");

    const message = body.message;
    if (!message) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "No message provided" })
      };
    }

    const response = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-4.1-mini",
        input: message
      })
    });

    const data = await response.json();

    // SAFELY extract text from all known OpenAI formats
    let reply = "";

    if (data.output_text) {
      reply = data.output_text;
    } else if (data.output && data.output.length) {
      for (const item of data.output) {
        if (item.content) {
          for (const c of item.content) {
            if (c.text) reply += c.text;
          }
        }
      }
    }

    if (!reply) {
      reply = "OpenAI returned no text. Raw response: " + JSON.stringify(data);
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ reply })
    };

  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message })
    };
  }
}



