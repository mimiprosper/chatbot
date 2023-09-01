const chatInput = document.querySelector(".chat-input textarea");
const sendChatBtn = document.querySelector(".chat-input span");
const chatbox = document.querySelector(".chatbox");
const chatbotToggler = document.querySelector(".chatbot-toggler");
const chatbotCloseBtn = document.querySelector(".close-btn");

let userMessage;
const API_KEY = "sk-1nE5t3K8s0TQ6qUH2wP7T3BlbkFp1j3";
const inputIniateHeight = chatInput.scrollHeight;

const createChatLi = (message, className) => {
  const chatLi = document.createElement("li");
  chatLi.classList.add("chat", className);
  let chatContent =
    className === "outgoing"
      ? ` <p></p>`
      : `<span><i class="fa-solid fa-robot"></i></span> <p></p>`;
  chatLi.innerHTML = chatContent;
  chatLi.querySelector("p").textContent = message;
  return chatLi;
};

const generateResponse = (incomingChatLi) => {
  const API_URL = "http://api.openai.com/v1/chat/completions";
  const messageElement = incomingChatLi.querySelector("p");

  const requestOptions = {
    method: "POST",
    heaaders: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${API_KEY}`,
    },
    body: JSON.stringify({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: userMessage }],
    }),
  };

  // send POST request to API, get response
  fetch(API_URL, requestOptions)
    .then((response) => response.json())
    .then((data) => {
      messageElement.textContent = data.choices[0].message.content;
    })
    .catch((error) => {
      messageElement.classList.add("error");
      messageElement.textContent = "opps sumtin went wrong. please try again";
    })
    .finally(() => {
      chatbox.scrollTo(0, chatboxScrollHeight);
    });
};

const handleChat = () => {
  userMessage = chatInput.value.trim();
  if (!userMessage) return;
  chatInput.value = "";
  chatInput.style.height = `${inputIniateHeight}px`;

  //append users message to chatbox
  chatbox.appendChild(createChatLi(userMessage, "outgoing"));
  chatbox.scrollTo(0, chatboxScrollHeight);

  //display 'thing...' message while waiting for response
  setTimeout(() => {
    const incomingChatLi = createChatLi("thinking...", "incoming");
    chatbox.appendChild(incomingChatLi);
    chatbox.scrollTo(0, chatboxScrollHeight);
    generateResponse(incomingChatLi);
  }, 600);
};

chatInput.addEventListener("input", () => {
  // adjust height of input area based on its content
  chatInput.style.height = `${inputIniateHeight}px`;
  chatInput.style.height = `${chatInput.scrollHeight}px`
});

chatInput.addEventListener("keyup", (e) => {
  // if enter key is pressed without shift key and the window width is greater than 800px, handle that chat
  if (e.key === 'Enter' && !e.shiftkey && window.innerWidth > 800) {
    e.preventDefault()
    handleChat()
  }
});

chatbotCloseBtn.addEventListener("click", () =>
  document.body.classList.remove("show-chatbot")
);
chatbotToggler.addEventListener("click", () =>
  document.body.classList.toggle("show-chatbot")
);
sendChatBtn.addEventListener("click", handleChat);
