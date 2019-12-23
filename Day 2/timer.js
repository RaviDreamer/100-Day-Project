//calculate the seconds
let secs = 30;

let timer;

let enableGame = true;

//countdown function is evoked when page is loaded
function countdown() {
    timer = setTimeout('Decrement()', 1000);
}

//Decrement function decrement the value.
function Decrement() {
    if (document.getElementById) {
        let seconds = document.getElementById("seconds");

        seconds.value = getseconds();

        //less than 10 seconds change to yellow
        if (secs < 10) {
            seconds.style.color = "yellow";
        }

        //alert when seconds is below 0
        if (secs < 0) {
            seconds.value = "Game Over";
            enableGame = false;
        }
        //if seconds > 0 then seconds is decremented
        else {
            secs--;
            timer = setTimeout('Decrement()', 1000);
        }
    }
}

function getseconds() {
    //from total seconds remaining
    return secs;
}

function stopTimer(){
    clearTimeout(timer);
}

let calls = 0;

function popBalloon (balloon) {
    if (enableGame == true) {
        calls++;
        balloon.setAttribute("class", "pop");

        if (calls == 50) {
            stopTimer();
            let winMsg = document.getElementById("seconds");
            winMsg.value = "You Win!";

        }
    }
}