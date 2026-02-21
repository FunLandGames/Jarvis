let recognition;
let isListening = false;

const chatDiv = document.getElementById("chat");

function addMessage(sender, text) {
  const msg = document.createElement("div");
  msg.className = sender === "You" ? "user-msg" : "ai-msg";
  msg.innerText = text;
  chatDiv.appendChild(msg);
  chatDiv.scrollTop = chatDiv.scrollHeight;
}

function speak(text) {
  window.speechSynthesis.cancel();
  const circle = document.getElementById("jarvisCircle");
  circle.style.boxShadow = "0 0 60px cyan";

  const speech = new SpeechSynthesisUtterance(text);
  speech.lang = "en-US";
  speech.rate = 0.85;
  speech.pitch = 0.6;

  const voices = speechSynthesis.getVoices();
  const googleVoice = voices.find(v => v.name.includes("Google"));
  if (googleVoice) speech.voice = googleVoice;

  speech.onend = () => {
    circle.style.boxShadow = "0 0 25px cyan";
  };

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
  addMessage("Jarvis", "System Online 🔥");
  speak("System online. Hello Lakshya");
};
