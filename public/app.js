let messages = [];

async function send() {
  const input = document.getElementById("input");
  const chat = document.getElementById("chat");

  const text = input.value.trim();
  if (!text) return;
  input.value = "";

  // Show user message
  messages.push({ role: "user", content: text });
  chat.innerHTML += `<div class="message user"><strong>You:</strong> ${text}</div>`;

  // Bot message container
  const botDiv = document.createElement("div");
  botDiv.className = "message bot";
  botDiv.innerHTML = `<strong>Kwik Owner:</strong> `;
  chat.appendChild(botDiv);
  chat.scrollTop = chat.scrollHeight;

  const response = await fetch("/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ messages }),
  });

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";
  let fullText = "";

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    buffer += decoder.decode(value, { stream: true });

    // Split SSE chunks
    const lines = buffer.split("\n");
    buffer = lines.pop(); // keep incomplete line

    for (const line of lines) {
      if (!line.startsWith("data:")) continue;

      const data = line.replace("data:", "").trim();

      if (data === "[DONE]") continue;

      try {
        const json = JSON.parse(data);
        const delta = json.choices?.[0]?.delta?.content;
        if (delta) {
          fullText += delta;
          botDiv.innerHTML = `<strong>Kwik Owner:</strong> ${fullText}`;
          chat.scrollTop = chat.scrollHeight;
        }
      } catch (err) {
        // Ignore malformed chunks
      }
    }
  }

  messages.push({ role: "assistant", content: fullText });
}

// ✅ Press ENTER to send message
document.getElementById("input").addEventListener("keydown", function (e) {
  if (e.key === "Enter" && !e.shiftKey) {
    e.preventDefault();
    send();
  }
});
