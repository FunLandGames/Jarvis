const chatDiv = document.getElementById("chat");

function speak(text) {
  const speech = new SpeechSynthesisUtterance(text);
  speech.rate = 0.9;
  speech.pitch = 0.7;
  speech.lang = "en-US";
  window.speechSynthesis.speak(speech);
}

function addMessage(sender, text) {
  chatDiv.innerHTML += `<p><b>${sender}:</b> ${text}</p>`;
  chatDiv.scrollTop = chatDiv.scrollHeight;
}

async function askAI(question) {
  const response = await fetch("/ask", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ message: question })
  });

  const data = await response.json();
  return data.reply;
}

function startListening() {
  const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
  recognition.lang = "en-US";

  recognition.onresult = async function(event) {
    const userText = event.results[0][0].transcript;
    addMessage("You", userText);

    const aiReply = await askAI(userText);
    addMessage("Jarvis", aiReply);
    speak(aiReply);
  };

  recognition.start();
}
