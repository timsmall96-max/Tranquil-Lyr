export async function handler(event) {
  try {
    // Reject non-POST requests
    if (event.httpMethod !== "POST") {
      return {
        statusCode: 405,
        body: JSON.stringify({ error: "Method Not Allowed" })
      };
    }

    // Parse incoming message
    const body = JSON.parse(event.body || "{}");
    const message = body.message;

    if (!message) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "No message sent" })
      };
    }

    // Call OpenAI
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
          { role: "user", content: message }
        ],
        temperature: 0.7
      })
    });

    const data = await response.json();

    // OpenAI error handling
    if (!data.choices || !data.choices[0]) {
      console.error("OpenAI error:", data);
      return {
        statusCode: 500,
        body: JSON.stringify({ error: "OpenAI API error" })
      };
    }

    return {
      statusCode: 200,
      body: JSON.stringify({
        reply: data.choices[0].message.content
      })
    };

  } catch (err) {
    console.error("Function crash:", err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message })
    };
  }
}

