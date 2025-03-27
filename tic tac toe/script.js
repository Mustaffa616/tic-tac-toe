console.log("Welcome to Tic Tac Toe")
let music = new Audio("music.mp3")
let audioTurn = new Audio("ting.mp3")
audioTurn.preload = "auto"
audioTurn.load()
let gameover = new Audio("gameover.mp3")
let drawSound = new Audio("ting.mp3")  // Using the same sound for draws
drawSound.preload = "auto"
drawSound.load()
let turn = "X"
let isgameover = false;

// Add score tracking variables with localStorage
let xWins = parseInt(localStorage.getItem('xWins')) || 0;
let oWins = parseInt(localStorage.getItem('oWins')) || 0;
let draws = parseInt(localStorage.getItem('draws')) || 0;

// Update initial display of scores
document.getElementById('x-score').innerText = xWins;
document.getElementById('o-score').innerText = oWins;
document.getElementById('draws').innerText = draws;

// Create a buffer of audio objects for faster response
const audioBuffer = Array(3).fill(null).map(() => {
    const audio = new Audio("ting.mp3");
    audio.preload = "auto";
    audio.load();
    return audio;
});
let currentBufferIndex = 0;

// Function to change the turn
const changeTurn = ()=>{
    return turn === "X"? "O": "X"
}

// Function to check for a win
const checkWin = ()=>{
    let boxtext = document.getElementsByClassName('boxtext');
    let wins = [
        [0, 1, 2, 5, 4, 0],     // Top row - centered at y=4
        [3, 4, 5, 5, 14, 0],    // Middle row - centered at y=14
        [6, 7, 8, 5, 24, 0],    // Bottom row - centered at y=24
        [0, 3, 6, -2, 14, 90],  // Left column - adjusted x to -2
        [1, 4, 7, 5, 14, 90],   // Middle column - centered at y=14
        [2, 5, 8, 12, 14, 90],  // Right column - adjusted x to 12
        [0, 4, 8, 4, 14, 45],   // Diagonal - adjusted for better centering
        [2, 4, 6, 6, 14, 135],  // Diagonal - adjusted for better centering
    ]
    wins.forEach(e =>{
        if((boxtext[e[0]].innerText === boxtext[e[1]].innerText) && (boxtext[e[2]].innerText === boxtext[e[1]].innerText) && (boxtext[e[0]].innerText !== "") ){
            document.querySelector('.info').innerText = boxtext[e[0]].innerText + " Won"
            isgameover = true
            document.querySelector('.imgbox').getElementsByTagName('img')[0].style.width = "200px";
            
            // Adjust line positioning to be more visible
            const line = document.querySelector(".line");
            line.style.transform = `translate(${e[3]}vw, ${e[4]}vw) rotate(${e[5]}deg)`;
            line.style.width = "20vw";  // Increased from 14vw to 20vw
            line.style.height = "4px";  // Keep the thickness
            line.style.backgroundColor = "rgb(25, 25, 112)";  // Keep the color solid
            
            // Update win count
            if(boxtext[e[0]].innerText === "X") {
                xWins++;
                localStorage.setItem('xWins', xWins);
                document.getElementById('x-score').innerText = xWins;
            } else {
                oWins++;
                localStorage.setItem('oWins', oWins);
                document.getElementById('o-score').innerText = oWins;
            }

            // Auto reset after win
            setTimeout(() => {
                resetGame();
            }, 1500);
        }
    })
}

// Game Logic
// music.play()
let boxes = document.getElementsByClassName("box");
Array.from(boxes).forEach(element =>{
    let boxtext = element.querySelector('.boxtext');
    element.addEventListener('click', ()=>{
        if(boxtext.innerText === ''){
            boxtext.innerText = turn;
            turn = changeTurn();
            // Use buffered audio for faster response
            audioBuffer[currentBufferIndex].currentTime = 0;
            audioBuffer[currentBufferIndex].play();
            currentBufferIndex = (currentBufferIndex + 1) % audioBuffer.length;
            checkWin();
            
            // Check for draw if no win and all boxes are filled
            if (!isgameover) {
                let allFilled = true;
                Array.from(boxes).forEach(box => {
                    if (box.querySelector('.boxtext').innerText === '') {
                        allFilled = false;
                    }
                });
                if (allFilled) {
                    draws++;
                    localStorage.setItem('draws', draws);
                    document.getElementById('draws').innerText = draws;
                    document.querySelector('.info').innerText = "Game Draw!";
                    isgameover = true;
                    drawSound.currentTime = 0;
                    drawSound.play();

                    // Auto reset after draw
                    setTimeout(() => {
                        resetGame();
                    }, 1500);
                } else {
                    document.getElementsByClassName("info")[0].innerText = "Turn for " + turn;
                }
            }
        }
    })
})

// Function to reset the game
const resetGame = () => {
    let boxtexts = document.querySelectorAll('.boxtext');
    Array.from(boxtexts).forEach(element => {
        element.innerText = ""
    });
    turn = "X"; 
    isgameover = false
    document.querySelector(".line").style.width = "0vw";
    document.getElementsByClassName("info")[0].innerText = "Turn for " + turn;
    document.querySelector('.imgbox').getElementsByTagName('img')[0].style.width = "0px"
}

// Update reset button to use the new function
reset.addEventListener('click', resetGame);
