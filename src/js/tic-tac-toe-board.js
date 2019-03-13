const size = 3;

// Player
// A class to store all the information about the current player
// The computer field is to determine whether or not the player is an AI
class Player {
    constructor(name, symbol, computer) {
        this.name = name;
        this.symbol = symbol;
        this.computer = computer;
    }
}

// Cell
// Creates a tile and appends it to the board
class Cell {
    render(game, context, x, y) {
        var cell = document.createElement("div");
        cell.classList.add("col-4");
        cell.classList.add("tile");
        this.image = document.createElement("img");
        this.image.src = "../img/empty.png";
        // If the cell is pressed, and it is not an AI's turn, then change the slot
        cell.addEventListener("click", () => { 
            if(!game.players[game.currentPlayer].computer) 
                game.setSlot(x, y);
        });
        cell.appendChild(this.image);
        context.appendChild(cell);
    }

    // Changes the image of the tile
    changeImage(image) {
        this.image.src = image;
    }
}

// Turn Indicator
// Indicates whose turn it is via image on the corners of the screen
class TurnIndicator {
    constructor(symbol, name) {
        this.symbol = symbol;
        this.name = name;
    }

    myTurn() {
        this.indicator.classList.remove("hide");
        this.indicator.classList.add("bob");
    }

    notMyTurn() {
        this.indicator.classList.remove("bob");
        this.indicator.classList.add("hide");
    }

    alignLeft() {
        this.indicator.style.left = "3vh";
    }

    alignRight() {
        this.indicator.style.right = "3vh";
    }

    render(container) {
        this.indicator = document.createElement("div");
        this.indicator.classList.add("turn-indicator");
        var image = document.createElement("img");
        image.src = this.symbol;
        this.indicator.appendChild(image);
        var text = document.createElement("p");
        text.innerHTML = this.name;
        this.indicator.appendChild(text);
        container.appendChild(this.indicator);
    }
}

// GameBoard
// The main board where all elements are appended onto
class GameBoard {
    constructor(player1, player2, container) {
        this.currentPlayer = Math.floor(Math.random() * 2);
        this.players = [player1, player2];
        this.container = container;
        this.state = new Array(size);
        this.tiles = new Array(size);
        this.setTiles = 0;
        for(var i = 0; i < size; i++) {
            this.state[i] = new Array(this.state);
            this.tiles[i] = new Array(this.state);
            for(var j = 0; j < size; j++) 
                this.state[i][j] = -1;
        }
    }

    // Checks if the player has won diagonally (top left to bottom right)
    checkDiagonal(player) {
        for(var i = 0; i < size; i++) 
            if(this.state[i][i] != player) 
                return false;
        return true;
    }

    // Checks if the player has won diagonally (top right to bottom left)
    checkReverseDiagonal(player) {
        for(var i = 0; i < size; i++) 
            if(this.state[size - 1 - i][i] != player) 
                return false;
        return true;
    }
    
    // Checks if the player has 3 in a row in a specfic row
    checkRow(player, x) {
        for(var i = 0; i < size; i++) 
            if(this.state[x][i] != player)
                return false;
        return true;
    }

    // Checks if the player has 3 in a column in a specific column
    checkColumn(player, y) {
        for(var i = 0; i < size; i++) 
            if(this.state[i][y] != player)
                return false;
        return true;
    }

    // Changes the current player number, if the next player is an AI, automatically perform its move
    changePlayer() {
        this.playerTurnDisplay[this.currentPlayer].notMyTurn();
        this.currentPlayer = (this.currentPlayer + 1) % 2;
        this.playerTurnDisplay[this.currentPlayer].myTurn();
        if(this.players[this.currentPlayer].computer)
            setTimeout(() => this.setRandomSlot(), 1000);
    }

    // Generates a number between [0, 8], each number corresponding to a different tile
    // Then increase the number by one until an open slot is found
    setRandomSlot() {
        var ran = Math.floor(Math.random() * 9);
        while(this.state[Math.floor(ran / 3)][ran % 3] != -1)
            ran = (ran + 1) % 9;
        this.setSlot(Math.floor(ran / 3), ran % 3);
    }

    // Sets the image of a slot and then checks if the player has won off that move
    setSlot(x, y) {
        if(this.state[x][y] != -1 || !this.playing) 
            return;
        this.tiles[x][y].changeImage(this.players[this.currentPlayer].symbol);
        this.state[x][y] = this.currentPlayer;
        this.setTiles++;
        if(this.checkWin(this.currentPlayer, x, y)) {
            document.getElementById("outcome").innerHTML = this.players[this.currentPlayer].name + " Wins!";
            this.playing = false;
        } else if(this.setTiles == 9) {
            document.getElementById("outcome").innerHTML = "It's a tie!";
            this.playing = false;
        } else 
            this.changePlayer();
    }

    // Checks for the two diagonal wins, and one row and column win
    checkWin(player, x, y) {
        if(this.checkDiagonal(player)) {
            var dbar = document.createElement("div");
            dbar.classList.add("d-bar");
            this.board.prepend(dbar);
            return true;
        } else if(this.checkReverseDiagonal(player)) {
            var dvbar = document.createElement("div");
            dvbar.classList.add("dv-bar");
            this.board.prepend(dvbar);
            return true;
        } else if(this.checkRow(player, x)) {
            var vbar = document.createElement("div");
            vbar.classList.add("v-bar");
            vbar.style.top = 100/6 + 100*x/3 + "%";
            this.board.prepend(vbar);
            return true;
        } else if(this.checkColumn(player, y)) {
            var hbar = document.createElement("div");
            hbar.classList.add("h-bar");
            hbar.style.left = 100/6 + 100*y/3 + "%";
            this.board.prepend(hbar);
            return true;
        }
        return false;
    }
    render() {
        // Adding board container
        this.board = document.createElement("div");
        this.board.classList.add("col-xl-4");
        this.board.classList.add("col-md-5");
        this.board.classList.add("mx-auto");
        this.board.classList.add("board");

        // Adding tic tac toe grid
        var hbar1 = document.createElement("div");
        hbar1.classList.add("h-bar");
        hbar1.style.left = "33%";
        var hbar2 = document.createElement("div");
        hbar2.classList.add("h-bar");
        hbar2.style.left = "67%";
        var vbar1 = document.createElement("div");
        vbar1.classList.add("v-bar");
        vbar1.style.top = "33%";
        var vbar2 = document.createElement("div");
        vbar2.classList.add("v-bar");
        vbar2.style.top = "66%";
        this.board.appendChild(hbar1);
        this.board.appendChild(hbar2);
        this.board.appendChild(vbar1);
        this.board.appendChild(vbar2);

        // Adding Cells
        for(var i = 0; i < size; i++) {
            var row = document.createElement("div");
            row.classList.add("row");
            for(var j = 0; j < size; j++) {
                this.tiles[i][j] = new Cell();
                this.tiles[i][j].render(this, row, i, j);
            }
            this.board.appendChild(row);
        }

        this.container.appendChild(this.board);

        // Adding player turn displays
        this.playerTurnDisplay = [new TurnIndicator(this.players[0].symbol, this.players[0].name), new TurnIndicator(this.players[1].symbol, this.players[1].name)];
        this.playerTurnDisplay[0].render(document.body);
        this.playerTurnDisplay[1].render(document.body);
        this.playerTurnDisplay[0].alignLeft();
        this.playerTurnDisplay[1].alignRight();

        this.playing = true;
        this.changePlayer();  
    }
}

$(document).ready(function() {
    //Checks whether or not the game is a multiplayer or singleplayer game, and then builds the board accordingly
    var multiplayer = document.getElementById("multiplayer");
    var singleplayer = document.getElementById("singleplayer");
    if(multiplayer == null)
        new GameBoard(new Player("Apple", "../img/apple.png", false), new Player("Donut", "../img/donut.png", false), singleplayer).render();
    else 
        new GameBoard(new Player("Player", "../img/apple.png", false), new Player("AI", "../img/donut.png", true), multiplayer).render();
});

