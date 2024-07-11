const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const hints = ["A","B","C","D","E"]; // Replace with your hints (GIF links can go here)
let currentImageIndex = 0;

function generateLetterButtons() {
  const letterGrid = document.querySelector(".letter-grid");
  letterGrid.innerHTML = ""; // Clear previous images

  for (let letter of letters) {
    const buttonElement = document.createElement("button");
    buttonElement.classList.add("letter-button");

    // Create image element inside the button
    const imageElement = document.createElement("img");
    imageElement.src = `images/${letter.toLowerCase()}.png`; // Adjust image path if needed
    imageElement.alt = letter;
    buttonElement.appendChild(imageElement);

    // Add click event listener to handle letter selection (implementation goes here)
    buttonElement.addEventListener("click", function() {
      const clickedLetter = this.firstChild.alt; // Access the alt text of the image inside the button
      handleLetterClick(clickedLetter);
    });

    letterGrid.appendChild(buttonElement);
  }
}

// Function to handle the clicked letter (replace with your desired functionality)
function handleLetterClick(clickedLetter) {
  alert("You clicked the letter: " + clickedLetter);
  if (!recording) {
    speechToText();
    recording = true;
  } else {
    stopRecording();
  }

  document.querySelector(".hint-button").addEventListener("click", function() {
    const hintGifContainer = document.querySelector(".hint-gif-container");
    hintGifContainer.style.display = hintGifContainer.style.display === "none" ? "block" : "none";
  
    // Replace with your logic to display the hint GIF based on `hints` array
    const word = clickedLetter; // Extract word from image filename
  
    // Update hint GIF container based on the current word (modify as needed)
    switch (word) {
        case 'A':
  hintGifContainer.innerHTML = `<img src="GIF/A.gif" alt="Apple Hint GIF">`;
  break;
case 'B':
  hintGifContainer.innerHTML = `<img src="GIF/B.gif" alt="Banana Hint GIF">`;
  break;
case 'C':
  hintGifContainer.innerHTML = `<img src="GIF/C.gif" alt="Cat Hint GIF">`;
  break;
case 'D':
  hintGifContainer.innerHTML = `<img src="GIF/D.gif" alt="Dog Hint GIF">`;
  break;
case 'E':
  hintGifContainer.innerHTML = `<img src="GIF/E.gif" alt="Elephant Hint GIF">`;
  break;
case 'F':
  hintGifContainer.innerHTML = `<img src="GIF/F.gif" alt="Fish Hint GIF">`;
  break
case 'G':
  hintGifContainer.innerHTML = `<img src="GIF/G.gif" alt="Gorilla Hint GIF">`;
  break;
case 'H':
  hintGifContainer.innerHTML = `<img src="GIF/H.gif" alt="Horse Hint GIF">`;
  break;
case 'I':
  hintGifContainer.innerHTML = `<img src="GIF/I.gif" alt="Igloo Hint GIF">`;  
  break;
case 'J':
  hintGifContainer.innerHTML = `<img src="GIF/J.gif" alt="Jellyfish Hint GIF">`;
  break;
case 'K':
  hintGifContainer.innerHTML = `<img src="GIF/K.gif" alt="Kangaroo Hint GIF">`;
  break;
case 'L':
  hintGifContainer.innerHTML = `<img src="GIF/L.gif" alt="Lion Hint GIF">`;
  break;
case 'M':
  hintGifContainer.innerHTML = `<img src="GIF/M.gif" alt="Monkey Hint GIF">`;
  break;
case 'N':
  hintGifContainer.innerHTML = `<img src="GIF/N.gif" alt="Nest Hint GIF">`; 
   break;
case 'O':
  hintGifContainer.innerHTML = `<img src="GIF/O.gif" alt="Octopus Hint GIF">`;
  break;
case 'P':
  hintGifContainer.innerHTML = `<img src="GIF/P.gif" alt="Panda Hint GIF">`;
  break;
case 'Q':
  hintGifContainer.innerHTML = `<img src="GIF/Q.gif" alt="Queen Hint GIF">`;  
  break;
case 'R':
  hintGifContainer.innerHTML = `<img src="GIF/R.gif" alt="Rabbit Hint GIF">`;
  break;
case 'S':
  hintGifContainer.innerHTML = `<img src="GIF/S.gif" alt="Snake Hint GIF">`;
  break;
case 'T':
  hintGifContainer.innerHTML = `<img src="GIF/T.gif" alt="Tiger Hint GIF">`;
  break;
case 'U':
  hintGifContainer.innerHTML = `<img src="GIF/U.gif" alt="Umbrella Hint GIF">`;
  break;
case 'V':
  hintGifContainer.innerHTML = `<img src="GIF/V.gif" alt="Violin Hint GIF">`;
  break;
case 'W':
  hintGifContainer.innerHTML = `<img src="GIF/W.gif" alt="Whale Hint GIF">`;
  break;
case 'X':
  hintGifContainer.innerHTML = `<img src="GIF/X.gif" alt="X-ray Hint GIF">`;  
  break;
case 'Y':
  hintGifContainer.innerHTML = `<img src="GIF/Y.gif" alt="Yoyo Hint GIF">`;
  break;
case 'Z':
  hintGifContainer.innerHTML = `<img src="GIF/Z.gif" alt="Zebra Hint GIF">`;
  break;
      
      default:
        hintGifContainer.innerHTML = "No hint available";
    }
  });
  if(clickedLetter == 'A'){
    const letter = 'a';
    checkSpeechResult(speech,letter);
  }
  // Implement your logic here (e.g., call an API, display definition)
}

// Call the function to generate letter buttons on page load
window.addEventListener("load", generateLetterButtons);


/* speech */

const recordBtn = document.querySelector(".record"),
  result = document.querySelector(".result"),
  downloadBtn = document.querySelector(".download"),
  inputLanguage = document.querySelector("#language");

let SpeechRecognition =
  window.SpeechRecognition || window.webkitSpeechRecognition,
recognition,
  recording = false;

  function speechToText() {
    try {
      recognition = new SpeechRecognition();
      recognition.lang = "en";
      recognition.interimResults = true;
      recordBtn.classList.add("recording");
      recordBtn.querySelector("p").innerHTML = "Listening...";
      recognition.start();
      recognition.onresult = (event) => {
        const speechResult = event.results[0][0].transcript.toLowerCase().replace(/\s/g, ""); // Convert to lowercase and remove spaces
        if (event.results[0].isFinal) {
          result.innerHTML += " " + speechResult;
          result.querySelector("p").remove();
          checkSpeechResult(speechResult);
        } else {
          // ... interim result handling (optional) ...
        }
        downloadBtn.disabled = false;
      };
      recognition.onspeechend = () => {
        speechToText(); // Keep listening after one recognition
      };
      recognition.onerror = (event) => {
        stopRecording();
        // ... error handling ...
      };
    } catch (error) {
      recording = false;
      console.log(error);
    }
  }

  function checkSpeechResult(speech,word) { 
    if (speech == word) {
      alert("You guessed the word correctly!");
    } else {
      // Handle incorrect guess (e.g., display message, reduce lives)
      alert("Incorrect guess. Try again!");
      // ... (optional) deduct lives or display a message ...
    }
  }

recordBtn.addEventListener("click", () => {
  if (!recording) {
    speechToText();
    recording = true;
  } else {
    stopRecording();
  }
});

function stopRecording() {
  recognition.stop();
  recordBtn.querySelector("p").innerHTML = "Start Listening";
  recordBtn.classList.remove("recording");
  recording = false;
}

function download() {
  const text = result.innerText;
  const filename = "speech.txt";

  const element = document.createElement("a");
  element.setAttribute(
    "href",
    "data:text/plain;charset=utf-8," + encodeURIComponent(text)
  );
  element.setAttribute("download", filename);
  element.style.display = "none";
  document.body.appendChild(element);
  element.click();
  document.body.removeChild(element);
}

downloadBtn.addEventListener("click", download);

const clearBtn = document.querySelector(".clear");

clearBtn.addEventListener("click", () => {
  result.innerHTML = ""; // Clear the speech result text
  downloadBtn.disabled = true; // Disable download button as there's no text
});