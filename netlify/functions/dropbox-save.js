import fetch from "node-fetch";

export async function handler(event) {
  try {
    const { token, filename, content } = JSON.parse(event.body);

    if (!token || !filename || !content) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Missing data" })
      };
    }

    const dropboxPath = `/Tranquil Lyrics/${filename}`;

    const res = await fetch(
      "https://content.dropboxapi.com/2/files/upload",
      {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/octet-stream",
          "Dropbox-API-Arg": JSON.stringify({
            path: dropboxPath,
            mode: "overwrite",
            autorename: false,
            mute: false
          })
        },
        body: content
      }
    );

    if (!res.ok) {
      const errText = await res.text();
      return {
        statusCode: res.status,
        body: JSON.stringify({ error: errText })
      };
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ success: true })
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message })
    };
  }
}
