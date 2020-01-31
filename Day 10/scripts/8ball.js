let response = [
    "Yes",
    "No",
    "Maybe",
    "Ask Again Later"
];
let fortune = Math.floor(Math.random() * (response.length));

function guess(){
    if(document.getElementById("question").value === ""){
        document.getElementById("response").innerHTML = "Ask a question";
    }
    else{
        document.getElementById("response").innerHTML = response[fortune];
        fortune = Math.floor(Math.random() * (response.length));
    }
}