let userChoice;
let cpuChoice;
let userCounter = 0;
let cpuCounter = 0;
restartGame();

function clickedEvent(choice){
    if (enableGame == true) {
        if (choice === 'rock') {
            userChoice = 'rock';
            document.getElementById('paper').style.visibility = "hidden";
            document.getElementById('scissors').style.visibility = "hidden";
        } else if (choice === 'paper') {
            userChoice = 'paper';
            document.getElementById('rock').style.visibility = "hidden";
            document.getElementById('scissors').style.visibility = "hidden";
        } else {
            userChoice = 'scissors';
            document.getElementById('rock').style.visibility = "hidden";
            document.getElementById('paper').style.visibility = "hidden";
        }
        computersChoice();
        compareChoices();
    }
    enableGame = false;
}
function computersChoice(){
    let cpuPick = Math.random();
    if(cpuPick<0.34){
        cpuChoice = 'rock';
        document.getElementById('cpuRock').style.visibility = "visible";
    }
    else if(cpuPick<=0.67){
        cpuChoice = 'paper';
        document.getElementById('cpuPaper').style.visibility = "visible";
    }
    else{
        cpuChoice = 'scissors';
        document.getElementById('cpuScissors').style.visibility = "visible";
    }
}

function compareChoices(){
    if(userChoice === cpuChoice){
        document.getElementById('winMsg').innerHTML =  "Tie Game!";
    }
    else if(userChoice === 'rock'){
        if(cpuChoice === 'paper'){
            cpuCounter++;
            document.getElementById('winMsg').innerHTML =  "You Lose!";
            scoreBox();
        }
        else{
            userCounter++;
            document.getElementById('winMsg').innerHTML =  "You Win!";
            scoreBox();
        }
    }
    else if(userChoice === 'paper'){
        if(cpuChoice === 'scissors'){
            cpuCounter++;
            document.getElementById('winMsg').innerHTML =  "You Lose!";
            scoreBox();
        }
        else{
            userCounter++;
            document.getElementById('winMsg').innerHTML =  "You Win!";
            scoreBox();
        }
    }
    else if(userChoice === 'scissors'){
        if(cpuChoice === 'rock'){
            cpuCounter++;
            document.getElementById('winMsg').innerHTML =  "You Lose!";
            scoreBox();
        }
        else{
            userCounter++;
            document.getElementById('winMsg').innerHTML =  "You Win!";
            scoreBox();
        }
    }
}

function scoreBox(){
    document.getElementById('userScore').innerHTML = userCounter.toString();
    document.getElementById('cpuScore').innerHTML = cpuCounter.toString();
}

function restartGame(){
    enableGame = true;
    document.getElementById('rock').style.visibility = "visible";
    document.getElementById('paper').style.visibility = "visible";
    document.getElementById('scissors').style.visibility = "visible";
    document.getElementById('cpuRock').style.visibility = "hidden";
    document.getElementById('cpuPaper').style.visibility = "hidden";
    document.getElementById('cpuScissors').style.visibility = "hidden";
    document.getElementById('winMsg').innerHTML = null;
    scoreBox();
}