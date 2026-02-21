let recognition;
let voices = [];
let isListening = false;

const chatDiv = document.getElementById("chat");

function addMessage(sender, text) {
  chatDiv.innerHTML += `<p><b>${sender}:</b> ${text}</p>`;
  chatDiv.scrollTop = chatDiv.scrollHeight;
}

function loadVoices() {
  voices = speechSynthesis.getVoices();
}
speechSynthesis.onvoiceschanged = loadVoices;

function speak(text, lang="en-US") {
  window.speechSynthesis.cancel();
  const circle = document.getElementById("jarvisCircle");
  circle.classList.add("speaking");

  const speech = new SpeechSynthesisUtterance(text);
  speech.lang = lang;
  speech.rate = 0.85;
  speech.pitch = 0.6;

  speech.onend = () => circle.classList.remove("speaking");

  window.speechSynthesis.speak(speech);
}

function stopSpeaking() {
  window.speechSynthesis.cancel();
}

function detectLanguage(text) {
  const hindiPattern = /[\u0900-\u097F]/;
  return hindiPattern.test(text) ? "hi-IN" : "en-US";
}

async function askAI(message) {
  const response = await fetch("/ask", {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({message})
  });

  const data = await response.json();
  return data.reply;
}

async function processInput(text) {
  addMessage("You", text);

  // Android-style commands
  if (text.toLowerCase().includes("open youtube")) {
    window.open("https://youtube.com", "_blank");
    speak("Opening YouTube");
    return;
  }

  if (text.toLowerCase().includes("open google")) {
    window.open("https://google.com", "_blank");
    speak("Opening Google");
    return;
  }

  const reply = await askAI(text);
  addMessage("Jarvis", reply);

  const lang = detectLanguage(reply);
  speak(reply, lang);
}

function sendText() {
  const input = document.getElementById("textInput");
  if (input.value.trim()) {
    processInput(input.value);
    input.value = "";
  }
}

function startListening() {
  recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
  recognition.continuous = true;
  recognition.lang = "en-US";

  recognition.onresult = function(event) {
    const transcript = event.results[event.results.length - 1][0].transcript;

    if (transcript.toLowerCase().includes("hey jarvis")) {
      processInput(transcript.replace("hey jarvis", ""));
    }
  };

  recognition.start();
  isListening = true;
}

function stopListening() {
  if (recognition && isListening) {
    recognition.stop();
    isListening = false;
  }
}

window.onload = function() {
  addMessage("Jarvis", "Booting system...");
  setTimeout(() => {
    speak("System online. Good evening Lakshya");
    addMessage("Jarvis", "System Online 🔥");
  }, 1500);
};  height: 250px;
  overflow-y: auto;
  border: 1px solid cyan;
  padding: 10px;
  margin: 10px;
}
