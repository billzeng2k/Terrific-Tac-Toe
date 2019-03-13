const size = 3;

class Player {
    constructor(name, symbol, computer) {
        this.name = name;
        this.symbol = symbol;
        this.computer = computer;
    }
}

class Cell {
    constructor() {

    }

    render(game, context, x, y) {
        var cell = document.createElement("div");
        cell.classList.add("col-4");
        cell.classList.add("tile");
        this.image = document.createElement("img");
        this.image.src = "../img/empty.png";
        cell.addEventListener("click", () => { 
            if(!game.players[game.currentPlayer].computer) 
                game.setSlot(x, y);
        });
        cell.appendChild(this.image);
        context.appendChild(cell);
    }

    changeImage(image) {
        this.image.src = image;
    }
}

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

    checkDiagonal(player) {
        for(var i = 0; i < size; i++) 
            if(this.state[i][i] != player) 
                return false;
        return true;
    }

    checkReverseDiagonal(player) {
        for(var i = 0; i < size; i++) 
            if(this.state[size - 1 - i][i] != player) 
                return false;
        return true;
    }

    checkRow(player, x) {
        for(var i = 0; i < size; i++) 
            if(this.state[x][i] != player)
                return false;
        return true;
    }

    checkColumn(player, y) {
        for(var i = 0; i < size; i++) 
            if(this.state[i][y] != player)
                return false;
        return true;
    }

    changePlayer() {
        this.playerTurnDisplay[this.currentPlayer].notMyTurn();
        this.currentPlayer = (this.currentPlayer + 1) % 2;
        this.playerTurnDisplay[this.currentPlayer].myTurn();
        console.log(this.players[this.currentPlayer].computer);
        if(this.players[this.currentPlayer].computer)
            setTimeout(() => this.setRandomSlot(), 1000);
    }

    setRandomSlot() {
        var ran = Math.floor(Math.random() * 9);
        while(this.state[Math.floor(ran / 3)][ran % 3] != -1)
            ran = (ran + 1) % 9;
        this.setSlot(Math.floor(ran / 3), ran % 3);
    }

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
        this.board = document.createElement("div");
        this.board.classList.add("col-xl-4");
        this.board.classList.add("col-md-5");
        this.board.classList.add("mx-auto");
        this.board.classList.add("board");

        //adding tic tac toe grid
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
    var multiplayer = document.getElementById("multiplayer");
    var singleplayer = document.getElementById("singleplayer");
    if(multiplayer == null)
        new GameBoard(new Player("Apple", "../img/apple.png", false), new Player("Donut", "../img/donut.png", false), singleplayer).render();
    else 
        new GameBoard(new Player("Player", "../img/apple.png", false), new Player("AI", "../img/donut.png", true), multiplayer).render();
});

