let messages = [];

async function send() {
  const input = document.getElementById("input");
  const chat = document.getElementById("chat");

  const text = input.value.trim();
  if (!text) return;

  input.value = "";

  // User message
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
  let fullText = "";

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    const chunk = decoder.decode(value);
    fullText += chunk;
    botDiv.innerHTML = `<strong>Kwik Owner:</strong> ${fullText}`;
    chat.scrollTop = chat.scrollHeight;
  }

  messages.push({ role: "assistant", content: fullText });
}
