// Dictionary
blackjackGame = {
    "you" : {'scoreSpan': '#your-black-jack-score', 'div': '#your-box', 'score': 0},
    "dealer" : {'scoreSpan': '#dealer-black-jack-score', 'div': '#dealer-box', 'score': 0},
    "cards" : ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'K', 'Q', 'A'],
    "cardsMap" : {'2': 2, '3': 3, '4': 4, '5': 5, '6': 6, '7': 7, '8': 8, '9': 9, '10': 10, 'J': 10, 'K': 10, 'Q': 10, 'A':[1, 11]},
    "wins": 0,
    "loses": 0,
    "ties": 0, 
    "isStand": false,
    "turnsOver": false,
    "hitOver": false,
}

// Global constants
const YOU = blackjackGame['you'];
const DEALER = blackjackGame['dealer'];
// Sounds
const hitSound = new Audio('sounds/swish.m4a');
const winSound = new Audio('sounds/cash.mp3');
const lostSound = new Audio('sounds/aww.mp3');

// score spans
let ySpan = document.querySelector('#your-black-jack-score');
let dSpan = document.querySelector('#dealer-black-jack-score');

// Btn eventListeners
document.getElementById('hit-button').addEventListener('click', blackjackHit );
document.getElementById('deal-button').addEventListener('click', blackjackDeal);
document.getElementById('stand-button').addEventListener('click', dealerTimePlay);

// Functions
function blackjackHit(e){
    if(blackjackGame['isStand'] === false){
        e.preventDefault();
        let card = randomCard();
        showCard(YOU, card);
        updateScore(YOU, card);
        showScore(YOU);
    } 

    blackjackGame['hitOver'] = true;
}

function randomCard(){
    let randomIndex = Math.floor(Math.random() * 13);
    return blackjackGame['cards'][randomIndex];
}

function showCard(activePlayer, card){
    if(activePlayer['score'] <= 21){
        let cardImg = document.createElement('img');
        cardImg.src = `images/${card}.png`;
        cardImg.style.height = '200px';
        cardImg.style.margin = '5px';
        document.querySelector(activePlayer['div']).appendChild(cardImg);
        hitSound.play();
    }
}

function blackjackDeal(){
    // let winner = computeWinner();
    // showResult(winner)
    if(blackjackGame['turnsOver'] === true){

        blackjackGame['isStand'] = false;
        blackjackGame['hitOver'] = false

        let yourImages = document.querySelector('#your-box').querySelectorAll('img');
        let dealerImages = document.querySelector('#dealer-box').querySelectorAll('img');
        
        for(let i = 0; i < yourImages.length; i ++){
            yourImages[i].remove();
        }

        for(let i = 0; i < dealerImages.length; i ++){
            dealerImages[i].remove();
        }

        // reset score
        YOU['score'] = 0;
        DEALER['score'] = 0;

        // Frontend reset
        ySpan.classList.remove('alert-danger', 'alert-success', 'text-danger', 'text-success');
        ySpan.textContent = YOU['score'];

        dSpan.classList.remove('alert-danger', 'alert-success', 'text-danger', 'text-success');
        dSpan.textContent = DEALER['score'];

        document.querySelector('#game-results').textContent = 'Let\'s play';

        blackjackGame['turnsOver'] = true;        
    }    
}

function updateScore(activePlayer, card){
    if(card === 'A'){
        // if player adds A and the score keeps below 21 A = 11 else A = 1
        if(activePlayer['score'] + blackjackGame['cardsMap'][card][1] <= 21){
            activePlayer['score'] += blackjackGame['cardsMap'][card][1];
        }
        else{
            activePlayer['score'] += blackjackGame['cardsMap'][card][0];
        }
    }
    else{
        activePlayer['score'] += blackjackGame['cardsMap'][card];
    }
}

function showScore (activePlayer){    
    let activePlayerScore = document.querySelector(activePlayer['scoreSpan']);
    
    if(activePlayer['score'] > 21){
        activePlayerScore.classList.remove('alert-success', 'text-success');
        activePlayerScore.classList.add('alert-danger', 'px-2', 'text-danger');
        activePlayerScore.textContent = 'BURST!';
    }
    else{
        activePlayerScore.classList.remove('alert-danger', 'text-danger')
        activePlayerScore.classList.add('alert-success', 'px-2', 'text-success');
        activePlayerScore.textContent = activePlayer['score'];
    }
    
}

// Add dealer as second player
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms))
}
async function dealerTimePlay(){
    blackjackGame['isStand'] = true;
    if( blackjackGame['hitOver'] === true){
        while(DEALER['score'] <= 15 && blackjackGame['isStand'] === true){
            let card = randomCard();
            showCard(DEALER, card);
            updateScore(DEALER, card);
            showScore(DEALER);
            await sleep(1000);
        }  
    }
    blackjackGame['turnsOver'] = true;
    let winner = computeWinner();
    showResult(winner);    
}
// compute winner
function computeWinner(){
    let winner;

    // conditions when you do not burst
    if(YOU['score'] <= 21){
        // two win scene;
        if(YOU['score'] > DEALER['score'] || DEALER['score'] > 21){
            blackjackGame['wins']++;
            winner = YOU;
        }
        // lost scene
        else if (YOU['score'] < DEALER['score']){
            blackjackGame['loses']++;
            winner = DEALER;
        }
        // draw scene
        else if(YOU['score'] === DEALER['score']){
            blackjackGame['ties']++;
        }

    }
    // when you burst
    else if(YOU['score'] > 21){
        // lose when dealer doesn't burst
        if(DEALER['score'] <= 21){
            blackjackGame['loses']++;
            winner= DEALER;
        }
        // draw when dealer burst too
        if (DEALER['score'] > 21) {
            blackjackGame['ties']++;
        }
    }   

    return winner;
}

function showResult(winner){

    if(blackjackGame['turnsOver'] = true){
        let message, messageColor;

        if(winner === YOU){
            message = 'You won!';
            messageColor = 'green';
            winSound.play();
            document.querySelector('#wins').textContent = blackjackGame['wins'];
        }
        else if (winner === DEALER){
            message = 'You lost';
            messageColor = 'red';
            lostSound.play();
            document.getElementById('loses').textContent = blackjackGame['loses'];
        }
        else {
            message = 'You tied';
            messageColor = 'blue';
            document.getElementById('draws').textContent = blackjackGame['ties'];
        }
        document.querySelector('#total').textContent = blackjackGame['wins'] + blackjackGame['loses'] + blackjackGame['ties'];
        document.querySelector('#game-results').textContent = `Game over: ${message}`;
        document.querySelector('#game-results').style.color = messageColor;
    }
}