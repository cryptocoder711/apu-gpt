let messages = [];

async function send() {
  const input = document.getElementById("input");
  const chat = document.getElementById("chat");

  const userMessage = input.value;
  input.value = "";

  messages.push({ role: "user", content: userMessage });

  chat.innerHTML += `<div class="message user">You: ${userMessage}</div>`;
  const botDiv = document.createElement("div");
  botDiv.className = "message bot";
  botDiv.innerText = "Kwik Owner: ";
  chat.appendChild(botDiv);

  const response = await fetch("http://localhost:3000/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ messages })
  });

  const reader = response.body.getReader();
  const decoder = new TextDecoder();

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    const chunk = decoder.decode(value);
    botDiv.innerText += chunk;
  }

  messages.push({ role: "assistant", content: botDiv.innerText });
  chat.scrollTop = chat.scrollHeight;
}
