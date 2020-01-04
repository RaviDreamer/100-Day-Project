/*BEGIN UI process*/
let ui = {};

ui.switchViewTo = function(turn) {
    switch (turn) {
        case "won":
            checkBoard();
            this.startBlink();
            ui.alertMessage("You won!");
            break;
        case "lost":
            checkBoard();
            this.startBlink();
            ui.alertMessage("You lost! Try again!");
            break;
        case "draw":
            $('#myModal .modal-title').text('It\'s draw!');
            $('#myModal').modal('show');
            break;
    }
}

ui.insertAt = function(pos, symbol) {
    let board = $('.square');
    let targetCell = $(board[pos]);

    if (!targetCell.hasClass('occupied')) {
        targetCell.html(symbol);
        targetCell.css({
            color: symbol === "X" ? "green" : "red"
        });

        targetCell.addClass('occupied');
    }
}

ui.showMessage = function(content) {
    $('#info').text(content);
}

ui.alertMessage = function(content) {
    $('#myModal .modal-title').text(content);
    setTimeout(function(){
        $('#myModal').modal('show');
    }, 1000);
}

function blinker() {
    $('.blink').fadeOut(500);
    $('.blink').fadeIn(500);
}

ui.startBlink = function() {

    let refreshInterval;
    for (let i = 0; i < 3; i++) {
        refreshInterval = setTimeout(blinker, 20);
    }


}


let checkBoard = function() {
    let B = $('.square');


    //check rows
    for(let i = 0; i <= 6; i = i + 3) {
        if($(B[i]).text() !== "E" && $(B[i]).text() === $(B[i+1]).text() && $(B[i+1]).text() == $(B[i+2]).text()) {
            //this.result = B[i] + "-won"; //update the state result
            $(B[i]).addClass('blink');
            $(B[i+1]).addClass('blink');
            $(B[i+2]).addClass('blink');


        }
    }

    //check columns
    for(let i = 0; i <= 2 ; i++) {
        if($(B[i]).text()  !== "E" && $(B[i]).text()  === $(B[i+3]).text()  && $(B[i+3]).text()  === $(B[i+6]).text() ) {
            //this.result = B[i] + "-won"; //update the state result
            $(B[i]).addClass('blink');
            $(B[i+3]).addClass('blink');
            $(B[i+6]).addClass('blink');
        }
    }

    //check diagonals
    for(let i = 0, j = 4; i <= 2 ; i = i + 2, j = j - 2) {
        if($(B[i]).text()  !== "E" && $(B[i]).text()  == $(B[i+j]).text()  && $(B[i+j]).text()  === $(B[i+2*j]).text() ) {
            // this.result = B[i] + "-won"; //update the state result
            $(B[i]).addClass('blink');
            $(B[i+j]).addClass('blink');
            $(B[i+2*j]).addClass('blink');
        }
    }

}
/*====END ui process*/

/*BEGIN Main process*/

/*
 * Represents a state in the game
 * @param old [State]: old state to initalize the new state
*/
let State = function(old) {

    //public: the player who has the turn to player
    this.turn = "";

    //public: the number of moves of the AI player
    this.oMovesCount = 0;

    //public: the board configuration in this state
    this.board = [];

    //--Begin Object Construction
    if (typeof old !== "undefined") {
        //Using a copy of another state (constructed)
        let len = old.board.length;
        this.board = new Array(len);
        for (let i = 0; i < len; i++) {
            this.board[i] = old.board[i];
        };

        this.oMovesCount = old.oMovesCount;
        this.result = old.result;
        this.turn = old.turn;
    }
    //--End Object Construction

    //Public: advances the turn in a state
    this.advanceTurn = function(){
        this.turn = this.turn === globals.FIRST_PLAYER ? globals.SECOND_PLAYER : globals.FIRST_PLAYER;
    }

    /* Public function: enumerates the empty cells in state
     * @return [Array]: indices of all empty cells 
     */
    this.emptyCells = function() {
        let empArray = [];
        for(let i = 0; i < 9; i++) {
            if (this.board[i] === "E") {
                empArray.push(i);
            }
        }

        return empArray;
    }

    /*
     * Public  function: checks if the state is a terminal state or not
     * the state result is updated to reflect the result of the game
     * @returns [Boolean]: true if it's terminal, false otherwise
     */
    this.isTerminal = function() {
        let B = this.board;

        for(let i = 0; i <= 6; i = i + 3) {
            if(B[i] !== "E" && B[i] === B[i + 1] && B[i + 1] == B[i + 2]) {
                this.result = B[i] + "-won"; //update the state result
                return true;
            }
        }

        //check columns
        for(let i = 0; i <= 2 ; i++) {
            if(B[i] !== "E" && B[i] === B[i + 3] && B[i + 3] === B[i + 6]) {
                this.result = B[i] + "-won"; //update the state result
                return true;
            }
        }

        //check diagonals
        for(let i = 0, j = 4; i <= 2 ; i = i + 2, j = j - 2) {
            if(B[i] !== "E" && B[i] == B[i + j] && B[i + j] === B[i + 2*j]) {
                this.result = B[i] + "-won"; //update the state result
                return true;
            }
        }

        let available = this.emptyCells();
        if(available.length == 0) {
            //the game is draw
            this.result = "draw"; //update the state result
            return true;
        }
        else {
            return false;
        }
    }
} //End State

/* 
 * Constructs a game object to be played
 */
let Game = function(autoPlayer) {

    //public: initialize the ai player for this game
    this.ai = autoPlayer;

    //public: initialize the game current state to empty board configuration
    this.currentState = new State();

    //"E" stands for empty board cell
    this.currentState.board = ["E", "E", "E",
        "E", "E", "E",
        "E", "E", "E"];

    this.currentState.turn = globals.FIRST_PLAYER; //player chose X or O

    //initialize game status to beginning
    this.status = "beginning";


    //public function: advances the game to a new state
    //@param _state [State]: the new state to advance the game to
    this.advanceTo = function(_state) {

        this.currentState = _state;
        if (_state.isTerminal()) {
            this.status = "ended";

            if (_state.result === globals.FIRST_PLAYER + "-won")
                ui.switchViewTo("won");
            else if (_state.result === globals.SECOND_PLAYER + "-won")
                ui.switchViewTo("lost");
            else
                ui.switchViewTo("draw");
        }
        else {
            //the game is still running
            if (this.currentState.turn === globals.FIRST_PLAYER) {
                ui.switchViewTo("human");
            }
            else {
                ui.switchViewTo("robot");

                //notifi the AI player its turn has come up
                this.ai.notify(globals.SECOND_PLAYER);
            }
        }
    }

    //Start the game
    this.start = function() {
        if (this.status === "beginning") {
            //invoke advanceTo with the initial state
            this.advanceTo(this.currentState);
            this.status = "running";
        }
    }
}

/*
 * public static function that calculates the score of the x player in a given terminal state
 * @param _state [State]: the state in which the score is calculated
 * @return [Number]: the score calculated for the human player
 */
Game.score = function(_state) {
    if(_state.result === globals.FIRST_PLAYER + "-won"){
        // the x player won
        return 10 - _state.oMovesCount;
    }
    else if(_state.result === globals.SECOND_PLAYER + "-won") {
        //the x player lost
        return - 10 + _state.oMovesCount;
    }
    else {
        //it's a draw
        return 0;
    }
}

/*====END main process*/

/*BEGIN ai process*/
/*
 * Constructs an action that the ai player could make
 * @param pos [Number]: the cell position the ai would make its action in
 * made that action
 */
let AIAction = function(pos) {

    // public : the position on the board that the action would put the letter on
    this.movePosition = pos;

    //public : the minimax value of the state that the action leads to when applied
    this.minimaxVal = 0;

    /*
     * public : applies the action to a state to get the next state
     * @param state [State]: the state to apply the action to
     * @return [State]: the next state
     */
    this.applyTo = function(state) {
        let next = new State(state);

        //put the letter on the board
        next.board[this.movePosition] = state.turn;

        if(state.turn === globals.SECOND_PLAYER)
            next.oMovesCount++;

        next.advanceTurn();

        return next;
    }
};

/*
 * public static function that defines a rule for sorting AIActions in ascending manner
 * @param firstAction [AIAction] : the first action in a pairwise sort
 * @param secondAction [AIAction]: the second action in a pairwise sort
 * @return [Number]: -1, 1, or 0
 */
AIAction.ASCENDING = function(firstAction, secondAction) {
    if(firstAction.minimaxVal < secondAction.minimaxVal)
        return -1; //indicates that firstAction goes before secondAction
    else if(firstAction.minimaxVal > secondAction.minimaxVal)
        return 1; //indicates that secondAction goes before firstAction
    else
        return 0; //indicates a tie
}

/*
 * public static function that defines a rule for sorting AIActions in descending manner
 * @param firstAction [AIAction] : the first action in a pairwise sort
 * @param secondAction [AIAction]: the second action in a pairwise sort
 * @return [Number]: -1, 1, or 0
 */
AIAction.DESCENDING = function(firstAction, secondAction) {
    if(firstAction.minimaxVal > secondAction.minimaxVal)
        return -1; //indicates that firstAction goes before secondAction
    else if(firstAction.minimaxVal < secondAction.minimaxVal)
        return 1; //indicates that secondAction goes before firstAction
    else
        return 0; //indicates a tie
}


/*
 * Constructs an AI player with a specific level of intelligence
 * @param level [String]: the desired level of intelligence
 */
let AI = function(level) {

    //private attribute: level of intelligence the player has
    let levelOfIntelligence = level;

    //private attribute: the game the player is playing
    let game = {};

    /*
     * private recursive function that computes the minimax value of a game state
     * @param state [State] : the state to calculate its minimax value
     * @returns [Number]: the minimax value of the state
     */
    function minimaxValue(state) {
        if(state.isTerminal()) {
            //a terminal game state is the base case
            return Game.score(state);
        }
        else {
            let stateScore; // this stores the minimax value we'll compute

            if(state.turn === globals.FIRST_PLAYER)
            // X wants to maximize --> initialize to a value smaller than any possible score
                stateScore = -1000;
            else
            // O wants to minimize --> initialize to a value larger than any possible score
                stateScore = 1000;

            let availablePositions = state.emptyCells();

            //enumerate next available states using the info form available positions
            let availableNextStates = availablePositions.map(function(pos) {
                let action = new AIAction(pos);

                let nextState = action.applyTo(state);

                return nextState;
            });

            /* calculate the minimax value for all available next states
             * and evaluate the current state's value */
            availableNextStates.forEach(function(nextState) {
                let nextScore = minimaxValue(nextState);
                if(state.turn === globals.FIRST_PLAYER) {
                    // X wants to maximize --> update stateScore iff nextScore is larger
                    if(nextScore > stateScore)
                        stateScore = nextScore;
                }
                else {
                    // O wants to minimize --> update stateScore iff nextScore is smaller
                    if(nextScore < stateScore)
                        stateScore = nextScore;
                }
            });

            return stateScore;
        }
    }


    /*
     * private function: make the ai player take a master move,
     * that is: choose the optimal minimax decision
     * @param turn [String]: the player to play, either X or O
     */
    function takeAMasterMove(turn) {

        let available = game.currentState.emptyCells();

        //enumerate and calculate the score for each avaialable actions to the ai player
        let availableActions = available.map(function(pos) {
            let action =  new AIAction(pos); //create the action object
            let next = action.applyTo(game.currentState); //get next state by applying the action

            action.minimaxVal = minimaxValue(next); //calculate and set the action's minmax value

            return action;
        });

        //sort the enumerated actions list by score
        if(turn === globals.FIRST_PLAYER)
        //X maximizes --> sort the actions in a descending manner to have the action with maximum minimax at first
            availableActions.sort(AIAction.DESCENDING);
        else
        //O minimizes --> sort the actions in an ascending manner to have the action with minimum minimax at first
            availableActions.sort(AIAction.ASCENDING);


        //take the first action as it's the optimal
        let chosenAction = availableActions[0];
        let next = chosenAction.applyTo(game.currentState);

        ui.insertAt(chosenAction.movePosition, turn);

        game.advanceTo(next);
    }


    /*
     * public method to specify the game the ai player will play
     * @param _game [Game] : the game the ai will play
     */
    this.plays = function(_game){
        game = _game;
    };

    /*
     * public function: notify the ai player that it's its turn
     * @param turn [String]: the player to play, either X or O
     */
    this.notify = function(turn) {
        switch(levelOfIntelligence) {
            //invoke the desired behavior based on the level chosen

            case "master": takeAMasterMove(turn); break;
        }
    };
};
/*====END ai process*/

/*BEGIN control process*/
/*
 * object to contain all items accessable to all control functions
 */
let globals = {};

//Save player's 
globals.FIRST_PLAYER = 'X';
globals.SECOND_PLAYER = 'O';
globals.selectedDifficulty = "master";

$("#reset").on('click',(function(){
    globals.resetGame();
}));

$("#start").on('click',(function(){
    $('#chooseModal').modal('show');
}));


$(".square").each(function(){
    $(this).on('click',(function(){
        if (typeof globals.game=== "undefined") {
            ui.showMessage('You must start game!');
        }
        else {
            ui.showMessage('It\'s your turn!');
            if (globals.game.status === "running" &&
                globals.game.currentState.turn === globals.FIRST_PLAYER &&
                !$(this).hasClass('occupied')){

                let pos = parseInt($(this).data("pos"));

                let next = new State(globals.game.currentState);
                next.board[pos] = globals.FIRST_PLAYER;

                ui.insertAt(pos, globals.FIRST_PLAYER);

                next.advanceTurn();

                globals.game.advanceTo(next);
            }
        }

    }))
});

globals.resetGame = function() {

    $(".square").each(function(){
        $(this).text('');
        $(this).removeClass('occupied');
        $(this).removeClass('blink');
        $(this).removeClass('bgGrey');

    });

    let aiPlayer = new AI(globals.selectedDifficulty);
    globals.game = new Game(aiPlayer);
    aiPlayer.plays(globals.game);
    globals.game.start();

    ui.showMessage('OK! Let\'s play again!');
}

$('#myModal').on('hidden.bs.modal', function (e) {
    globals.resetGame();
})

$('#chooseModal').on('hidden.bs.modal', function (e) {
    let rdoChecked = $(':input:checked').val();

    switch (rdoChecked) {
        case "X":
            globals.FIRST_PLAYER = "X";
            globals.SECOND_PLAYER = "O";
            break;
        case "O":
            globals.FIRST_PLAYER = "O";
            globals.SECOND_PLAYER = "X";
            break;
    }

    let aiPlayer = new AI(globals.selectedDifficulty);
    globals.game = new Game(aiPlayer);
    aiPlayer.plays(globals.game);
    globals.game.start();

    ui.showMessage('OK! Let\'s begin');
})
/*====END control process*/