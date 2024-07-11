/* game */

const images = ["apple.png", "banana.png", "cat.png", "dog.png", "house.png"]; // Replace with your image paths
const hints = ["A juicy red fruit", "A yellow fruit that monkeys love", "A furry feline friend", "A loyal companion", "A place to live"]; // Replace with your hints (GIF links can go here)
const letterImages = ["images/A.png", "images/B.png", "images/C.png", "images/D.png", "images/E.png", "images/F.png", "images/G.png", "images/H.png", "images/I.png", "images/J.png", "images/K.png", "images/L.png", "images/M.png", "images/N.png", "images/O.png", "images/P.png", "images/Q.png", "images/R.png", "images/S.png", "images/T.png", "images/U.png", "images/V.png", "images/W.png", "images/X.png", "images/Y.png", "images/Z.png"]; // Replace with your letter image paths

let currentImageIndex = 0;
let guessedLetters = "";
let remainingLives = 3;

function updateImageCount() {
  const imageCountElement = document.querySelector(".image-count");
  imageCountElement.src = `images/${currentImageIndex + 1}_of_5.jpg`;
}

function generateLetterImages() {
  const letterContainer = document.querySelector(".letter-container");
  letterContainer.innerHTML = ""; // Clear previous images

  const currentWord = images[currentImageIndex].slice(0, -4).toLowerCase(); // Extract word from image filename (lowercase)

  for (let letter of currentWord) {
    const imageElement = document.createElement("img");
    imageElement.classList.add("letter-image");
    imageElement.src = `images/${letter.toUpperCase()}.png`; // Use uppercase letter image
    imageElement.alt = letter;

    imageElement.addEventListener("click", function() {
      const guessedLetter = this.alt; // Get letter from alt text
      if (guessedLetters.includes(guessedLetter)) {
        return; // Already guessed letter
      }
      guessedLetters += guessedLetter;
      checkGuess(guessedLetter);
      this.classList.add("disabled"); // Disable clicked image
    });

    letterContainer.appendChild(imageElement);
  }
}

function checkGuess(letter) {
  const currentWord = images[currentImageIndex].slice(0, -4);
  if (currentWord.includes(letter)) {
    showCorrectLetter(letter);
  } else {
    removeLife();
  }
  checkGameOver();
}

function showCorrectLetter(letter) {
  guessedLetters += letter;
  let displayedWord = "";
  for (let char of images[currentImageIndex].slice(0, -4)) {
    displayedWord += guessedLetters.includes(char) ? char : "_ ";
  }

  // Update displayed word without modifying DOM directly for performance
  const displayedWordElement = document.querySelector(".game-image").alt;
  document.querySelector(".game-image").alt = displayedWord;

  if (displayedWord.replace(/ /g, "") === images[currentImageIndex].slice(0, -4)) {
    alert("You guessed the word correctly!");
    nextImage();
    // Replace image with placeholder on successful guess
    document.querySelector(".game-image").src = "images/blank.png";
  } else if (displayedWord.slice(0, guessedLetters.length) === currentWord.slice(0, guessedLetters.length)) {
    alert("You're almost there! Try saying the whole word.");
  }
}

function removeLife() {
  remainingLives--;
  const lifeElements = document.querySelectorAll(".life");
  lifeElements[lifeElements.length - remainingLives].style.display = "none";
}

function checkGameOver() {
  if (remainingLives === 0) {
    alert("Game Over! The word was " + images[currentImageIndex].slice(0, -4));
    resetGame();
  }
}

function nextImage() {
  currentImageIndex++;
  if (currentImageIndex >= images.length) {
    alert("Congratulations! You guessed all the words!");
    resetGame();
  } else {
    loadGame();
  }
}


function resetGame() {
  currentImage = 0;
  guessedLetters = "";
  remainingLives = 3;
  currentWord = ""; // Reset tracked word for speech recognition
  loadGame();
}

function loadGame() {
  updateImageCount();
  document.querySelector(".game-image").src = `images/${images[currentImageIndex]}`;
  document.querySelector(".game-image").alt = images[currentImageIndex].slice(0, -4).split("").join("_ ");
  generateLetterImages();

  // Hide hint GIF container by default
  document.querySelector(".hint-gif-container").style.display = "none";
}

document.querySelector(".next-button").addEventListener("click", nextImage);

document.querySelector(".hint-button").addEventListener("click", function() {
  const hintGifContainer = document.querySelector(".hint-gif-container");
  hintGifContainer.style.display = hintGifContainer.style.display === "none" ? "block" : "none";

  // Replace with your logic to display the hint GIF based on `hints` array
  const currentWord = images[currentImageIndex].slice(0, -4); // Extract word from image filename

  // Update hint GIF container based on the current word (modify as needed)
  switch (currentWord) {
    case "apple":
      hintGifContainer.innerHTML = `<img src="GIF/a.gif" alt="Apple Hint GIF">`;
      break;
    case "banana":
      hintGifContainer.innerHTML = `<img src="images/banana_hint.gif" alt="Banana Hint GIF">`;
      break;
    case "cat":
      hintGifContainer.innerHTML = `<img src="images/cat_hint.gif" alt="Cat Hint GIF">`;
      break;
    // Add similar cases for other words in `images`
    default:
      hintGifContainer.innerHTML = "No hint available";
  }
});

document.querySelector(".home-button").addEventListener("click", function() {
  // Add your home button functionality here (e.g., redirect to another page)
  alert("Going home...");
});

// Call loadGame() to start the game
loadGame();

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

function checkSpeechResult(speech) {
  const word = images[currentImageIndex].slice(0, -4).toLowerCase().replace(/\s/g, ""); // Extract word from image filename, convert to lowercase and remove spaces
  if (speech === word) {
    alert("You guessed the word correctly!");
    nextImage();
    // Replace image with placeholder on successful guess
    document.querySelector(".game-image").src = "images/blank.png";
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