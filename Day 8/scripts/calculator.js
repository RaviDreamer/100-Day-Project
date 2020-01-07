let num = 0;
let operation;
let firstNum;
let secondNum;

function calculate(e){
    if(e==="c")
    {
        num = 0;
        document.getElementById("calculator").value = null;
    }
    else if (e==="+" || e==="-" || e==="/" || e==="*"){
        operation = e;
        document.getElementById("calculator").value = e;
    }
    else if (e==="="){
        if (operation==="+") {
            document.getElementById("calculator").value = firstNum+secondNum;
        }
        if (operation==="-"){
            document.getElementById("calculator").value = firstNum-secondNum;
        }
        if (operation==="*"){
            document.getElementById("calculator").value = firstNum*secondNum;
        }
        if (operation==="/"){
            document.getElementById("calculator").value = firstNum/secondNum;
        }
    }
    else if (num===0) {
        firstNum = parseInt(e, 10);
        document.getElementById("calculator").value = e;
        num++;
    }
    else if (num===1){
        secondNum = parseInt(e, 10);
        document.getElementById("calculator").value = e;
        num = 0;
    }



}