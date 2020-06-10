// Dictionary
blackjackGame = {
  you: { scoreSpan: "#your-black-jack-score", div: "#your-box", score: 0 },
  dealer: {
    scoreSpan: "#dealer-black-jack-score",
    div: "#dealer-box",
    score: 0,
  },
  cards: ["2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "K", "Q", "A"],
  cardsMap: {
    "2": 2,
    "3": 3,
    "4": 4,
    "5": 5,
    "6": 6,
    "7": 7,
    "8": 8,
    "9": 9,
    "10": 10,
    J: 10,
    K: 10,
    Q: 10,
    A: [1, 11],
  },
  wins: 0,
  loses: 0,
  ties: 0,
  all: 0,
  total: 0,
  isStand: false,
  turnsOver: false,
  gameOver: false,
};

// Global constants
const YOU = blackjackGame["you"];
const DEALER = blackjackGame["dealer"];

// user instructions
const instructionBtn = document.querySelectorAll(".to-user");
const modalTitle = document.querySelector(".modal-title");
const contentHead = document.querySelector(".modal-body h6");
let modalContent = document.querySelector(".modal-body .instructions");

// Sounds
const hitSound = new Audio("sounds/swish.m4a");
const winSound = new Audio("sounds/cash.mp3");
const lostSound = new Audio("sounds/aww.mp3");
const roundDraw = new Audio("sounds/rounddraw.ogg");
const gameOver = new Audio("sounds/gameOver.wav");
const youWin = new Audio("sounds/youWin.mp3");

// score spans
let ySpan = document.querySelector("#your-black-jack-score");
let dSpan = document.querySelector("#dealer-black-jack-score");

// Btn eventListeners
document.getElementById("hit-button").addEventListener("click", blackjackHit);
document.getElementById("deal-button").addEventListener("click", blackjackDeal);
document
  .getElementById("stand-button")
  .addEventListener("click", dealerTimePlay);

// Functions
function blackjackHit(e) {
  if (blackjackGame["isStand"] === false) {
    e.preventDefault();
    let card = randomCard();
    showCard(YOU, card);
    updateScore(YOU, card);
    showScore(YOU);
  }
}

function randomCard() {
  let randomIndex = Math.floor(Math.random() * 13);
  return blackjackGame["cards"][randomIndex];
}

function showCard(activePlayer, card) {
  if (activePlayer["score"] <= 21) {
    let cardImg = document.createElement("img");
    cardImg.src = `images/${card}.png`;
    cardImg.style.margin = "5px";
    document.querySelector(activePlayer["div"]).appendChild(cardImg);
    hitSound.play();
  }
}

function blackjackDeal() {
  // let winner = computeWinner();
  // showResult(winner)
  if (blackjackGame["gameOver"] === false) {
    if (blackjackGame["turnsOver"] === true) {
      blackjackGame["isStand"] = false;

      let yourImages = document
        .querySelector("#your-box")
        .querySelectorAll("img");
      let dealerImages = document
        .querySelector("#dealer-box")
        .querySelectorAll("img");

      for (let i = 0; i < yourImages.length; i++) {
        yourImages[i].remove();
      }

      for (let i = 0; i < dealerImages.length; i++) {
        dealerImages[i].remove();
      }

      // reset score
      YOU["score"] = 0;
      DEALER["score"] = 0;

      // Frontend reset
      ySpan.classList.remove(
        "alert-danger",
        "alert-success",
        "text-danger",
        "text-success"
      );
      ySpan.textContent = YOU["score"];

      dSpan.classList.remove(
        "alert-danger",
        "alert-success",
        "text-danger",
        "text-success"
      );
      dSpan.textContent = DEALER["score"];

      document.querySelector("#game-results").textContent =
        "Let's play this round";
      document.querySelector("#game-results").style.color = "black";

      blackjackGame["turnsOver"] = true;
    }
  }
}

function updateScore(activePlayer, card) {
  if (card === "A") {
    // if player adds A and the score keeps below 21 A = 11 else A = 1
    if (activePlayer["score"] + blackjackGame["cardsMap"][card][1] <= 21) {
      activePlayer["score"] += blackjackGame["cardsMap"][card][1];
    } else {
      activePlayer["score"] += blackjackGame["cardsMap"][card][0];
    }
  } else {
    activePlayer["score"] += blackjackGame["cardsMap"][card];
  }
}

function showScore(activePlayer) {
  let activePlayerScore = document.querySelector(activePlayer["scoreSpan"]);

  if (activePlayer["score"] > 21) {
    activePlayerScore.classList.remove("alert-success", "text-success");
    activePlayerScore.classList.add("alert-danger", "px-2", "text-danger");
    activePlayerScore.textContent = "BURST!";
  } else {
    activePlayerScore.classList.remove("alert-danger", "text-danger");
    activePlayerScore.classList.add("alert-success", "px-2", "text-success");
    activePlayerScore.textContent = activePlayer["score"];
  }
}

// Add dealer as second player
function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
async function dealerTimePlay() {
  if (YOU["score"] !== 0) {
    blackjackGame["isStand"] = true;
    while (DEALER["score"] < 16 && blackjackGame["isStand"] === true) {
      let card = randomCard();
      showCard(DEALER, card);
      updateScore(DEALER, card);
      showScore(DEALER);
      await sleep(1000);
    }

    blackjackGame["turnsOver"] = true;
    let winner = computeWinner();
    showResult(winner);
  }
}
// compute winner
function computeWinner() {
  let winner;

  // conditions when you do not burst
  if (YOU["score"] <= 21) {
    // two win scene;
    if (YOU["score"] > DEALER["score"] || DEALER["score"] > 21) {
      blackjackGame["wins"]++;
      winner = YOU;
    }
    // lost scene
    else if (YOU["score"] < DEALER["score"]) {
      blackjackGame["loses"]++;
      winner = DEALER;
    }
    // draw scene
    else if (YOU["score"] === DEALER["score"]) {
      blackjackGame["ties"]++;
    }
  }
  // when you burst
  else if (YOU["score"] > 21) {
    // lose when dealer doesn't burst
    if (DEALER["score"] <= 21) {
      blackjackGame["loses"]++;
      winner = DEALER;
    }
    // draw when dealer burst too
    if (DEALER["score"] > 21) {
      blackjackGame["ties"]++;
    }
  }

  return winner;
}

function showResult(winner) {
  if ((blackjackGame["turnsOver"] = true)) {
    let message, messageColor;

    if (winner === YOU) {
      message = "You won!";
      messageColor = "green";
      winSound.play();
      document.querySelector("#wins").textContent = blackjackGame["wins"];
    } else if (winner === DEALER) {
      message = "You lost";
      messageColor = "red";
      lostSound.play();
      document.getElementById("loses").textContent = blackjackGame["loses"];
    } else {
      message = "You tied";
      messageColor = "blue";
      roundDraw.play();
      document.getElementById("draws").textContent = blackjackGame["ties"];
    }
    blackjackGame["all"] =
      blackjackGame["wins"] + blackjackGame["loses"] + blackjackGame["ties"];
    document.querySelector("#total").textContent =
      blackjackGame["wins"] + blackjackGame["loses"] + blackjackGame["ties"];
    document.querySelector(
      "#game-results"
    ).textContent = `Round over: ${message}`;
    document.querySelector("#game-results").style.color = messageColor;

    // overal game;
    generalWinner();
  }
}

function generalWinner() {
  const totalGames = 2;
  blackjackGame["total"] = totalGames;

  if (
    blackjackGame["wins"] - blackjackGame["loses"] >
    totalGames - blackjackGame["all"]
  ) {
    blackjackGame["gameOver"] = true;
    document.getElementById("stand-button").disabled = true;
    let generalWinner = computeGeneralWinner();
    showGeneralWinner(generalWinner);
  } else if (
    blackjackGame["loses"] - blackjackGame["wins"] >
    totalGames - blackjackGame["all"]
  ) {
    blackjackGame["gameOver"] = true;
    document.getElementById("stand-button").disabled = true;
    let generalWinner = computeGeneralWinner();
    showGeneralWinner(generalWinner);
  } else if (blackjackGame["all"] === totalGames) {
    blackjackGame["gameOver"] = true;
    document.getElementById("stand-button").disabled = true;
    let generalWinner = computeGeneralWinner();
    showGeneralWinner(generalWinner);
  }
}

function computeGeneralWinner() {
  let gameOverWinner;

  if (blackjackGame["wins"] > blackjackGame["loses"]) {
    gameOverWinner = YOU;
  } else if (blackjackGame["wins"] < blackjackGame["loses"]) {
    gameOverWinner = DEALER;
  }

  return gameOverWinner;
}

function showGeneralWinner(generalWinner) {
  let messageColor, message, btnText;

  if (generalWinner === YOU) {
    message = "CONGRATS! YOU ARE THE WINNER";
    messageColor = "success";
    btnText = "Well done winner! Let's play again";
    youWin.play();
    lostSound.pause();
    winSound.pause();
    roundDraw.pause();
    gameOver.play();
  } else if (generalWinner === DEALER) {
    message = "SORRY! YOU ARE THE LOSER";
    messageColor = "danger";
    btnText = "Hey friend! I knew i would win, try your luck again";
    lostSound.pause();
    winSound.pause();
    roundDraw.pause();
    gameOver.play();
  } else {
    message = "VERY TIGHT! YOU DREW";
    messageColor = "primary";
    btnText = "Hey friend! Let's break the tie";
    lostSound.pause();
    winSound.pause();
    roundDraw.pause();
    gameOver.play();
  }

  document.body.style.marginTop = "60px";

  const resultsWrapper = document.getElementById("general");

  resultsWrapper.innerHTML = `
        <div class="text-center pt-5">
            <h1 class="text-center text-warning mb-4">GAME OVER</h1>
            <h4 class="mt-3 text-center text-${messageColor}">${message}</h4>
            <table class="table-bordered table-two mt-3">
                <tr>
                    <th class="px-3 py-1 text-center border-secondary text-info">You</th>
                    <th class="px-3 py-1 text-center border-secondary text-info">Dealer</th>
                    <th class="px-3 py-1 text-center border-secondary text-info">Draws</th>
                    <th class="px-3 py-1 text-center border-secondary text-info">Played rounds</th>
                    <th class="px-3 py-1 text-center border-secondary text-info">Max rounds</th>
                </tr>
                <tr>                    
                    <td class="px-3 py-1 text-center border-secondary bg-${messageColor}">${blackjackGame["wins"]}</td>
                    <td class="px-3 py-1 text-center border-secondary">${blackjackGame["loses"]}</td>
                    <td class="px-3 py-1 text-center border-secondary">${blackjackGame["ties"]}</td>
                    <td class="px-3 py-1 text-center border-secondary">${blackjackGame["all"]}</td>
                    <td class="px-3 py-1 text-center border-secondary">${blackjackGame["total"]}</td>
                </tr>
            </table>
            <button id="play-again" class="btn btn-info mt-2" onClick="playAgain()">${btnText}</button>
        </div>
    `;
  document.querySelector("#game-results").parentElement.remove();
  document.querySelector(".table-one").remove();
  document.getElementById("user-assist").remove();
  document.getElementById("hit-button").remove();
  document.getElementById("deal-button").remove();
  document.getElementById("stand-button").remove();
}

function playAgain() {
  if (blackjackGame["gameOver"] === true) {
    blackjackGame["isStand"] = false;
    blackjackGame["gameOver"] = false;
    blackjackGame["turnsOver"] = true;

    YOU["score"] = 0;
    DEALER["score"] = 0;
    blackjackGame["wins"] = 0;
    blackjackGame["loses"] = 0;
    blackjackGame["ties"] = 0;

    document.querySelector("#general", "div").remove();

    let yourImages = document
      .querySelector("#your-box")
      .querySelectorAll("img");
    let dealerImages = document
      .querySelector("#dealer-box")
      .querySelectorAll("img");

    for (let i = 0; i < yourImages.length; i++) {
      yourImages[i].remove();
    }

    for (let i = 0; i < dealerImages.length; i++) {
      dealerImages[i].remove();
    }

    ySpan.classList.remove(
      "alert-danger",
      "alert-success",
      "text-danger",
      "text-success"
    );
    ySpan.textContent = YOU["score"];

    dSpan.classList.remove(
      "alert-danger",
      "alert-success",
      "text-danger",
      "text-success"
    );
    dSpan.textContent = DEALER["score"];
  }

  if (blackjackGame["gameOver"] === false) {
    window.location.reload();
  }
}

instructionBtn.forEach((btn) => {
  btn.addEventListener("click", (e) => {
    const btn_clicked = e.target;
    let role = btn_clicked.getAttribute("job");

    if (role === "help") {
      getHelp(role);
    } else {
      getTips(role);
    }
  });
});

function getHelp(role) {
  /*fetch*/

  async function giveHelp() {
    const response = await fetch("user/help.json");
    const help = await response.json();

    return {
      help,
    };
  }
  giveHelp()
    .then((help) => {
      modalTitle.innerText = `Welcome to ${role} Our Blackjack Player!`;
      contentHead.innerText = `Get ${role}?`;
      let point;

      point = `<ul>`;
      help.help.forEach((helpIndex) => {
        point += `
                    <li>
                        <p>${helpIndex.help}</p>
                    </li>
                `;
      });
      point += `</ul>`;

      modalContent.innerHTML = point;
    })
    .catch((error) => {
      console.log(error);
    });

  /*
    modalTitle.innerText = `Welcome to ${role} Our Blackjack Player!`;
    contentHead.innerText = `Get ${role}?`;  
    modalContent.innerHTML = `
        <ul style="list-style: disc;">
            <li>
                <p class="">The game consist of two players: Human player and the Dealer</p>
            </li>
            <li>
                <p class="">
                    The human player plays by HIT button: (blue in color). He or she should target 
                    highest score that is below twenty one.  
                </p>
            </li>
            <li>
                <p class="">
                    Once he/she is through, then he/she hits the stand button and the Bot plays.
                </p>
            </li>
            <li>
                <p class="">
                    The final results of the round are calculated once Bot is through. Whoever has HIGHEST score is 
                    declared as the winner of the round. 
                </p>
            </li>
            <li>
                <p class="">
                    However there are a maximum of Ten rounds. The game may either end in ten rounds if the game 
                    is tight, or end before all the ten rounds are over incase the score difference between the players 
                    is high. 
                </p>
            </li>
            <li>
                <p class="">
                    Good luck friend as you play! 
                </p>
            </li>
        </ul>       
    `;
    */
}

function getTips(role) {
  // ajax
  const xhr = new XMLHttpRequest();

  xhr.open("GET", "user/tips.json", true);

  xhr.onload = function () {
    if (this.status === 200) {
      const tips = JSON.parse(this.responseText);

      modalTitle.innerText = `Welcome to ${role} Our Blackjack Player!`;
      contentHead.innerText = `Get ${role}?`;
      let tipsA;
      tipsA = `<ul>`;
      tips.forEach((tip) => {
        tipsA += `
                    
                    <li>
                            <p>${tip.tip}</p>
                        </li> 
                
                    `;
      });
      tipsA += `</ul>`;

      modalContent.innerHTML = tipsA;
    }
  };

  xhr.send();

  /*
    modalTitle.innerText = `Welcome to ${role} Our Blackjack Player!`;
    contentHead.innerText = `Get ${role}?`;
    modalContent.innerHTML = `
        <ul style="list-style: ;">
            <li>
                <p class="">
                    The game consist of two players: Human player and the Dealer. These tips may help you beat Dealer.
                </p>
           
            <li>
                <p class="">
                    Be Courageous, Daring and ready to risk any score below seventeen.  
                </p>
            </li>
            <li>
                <p class="">
                    Be Careful when risking scores above seventeen.  
                </p>
            </li>
            <li>
                <p class="">
                    These are just tips from some of the best players. If they don't work for you friend, play your way.  
                </p>
            </li>
            <li>
                <p class="">
                    Good luck friend as you play! 
                </p>
            </li>
        </ul>       
    `;
    */
}
