const red = "rgb(255, 0, 0)";
const green = "rgb(0, 201, 60)";
const blue = "rgb(0, 38, 191)";
const yellow = "rgb(230, 224, 69)";
const black = "rgb(0, 0, 0)";
const colores = [null, yellow, blue, green, red, black] //comienza en 1 ya que el primer color es la nada
const Nplayers = 2;
const Nholders = Nplayers * 2 + 1;
const restar = [0, -1, -2, -4, -6, -8, -11, -14];
var endGame = false;
//-------------------------------------------
let fichas = [], descarte = [];
let pozo = [
    []
];
for (let i = 0; i < Nholders; i++) {
    pozo.push([])
    for (let j = 0; j < 4; j++) {
        pozo[i].push(0);
    }
}
let selected;
let turno = 0;
var players = boardCreator(); //es constante pero se declara raro
//------------------------------------------------------------------
function player() {
    this.piramide = [];
    this.tablero = [];
    this.points = 0;
    this.trash = 0;
    this.filas = 0;
    this.columnas = 0;
    this.colorido = 0;
    this.inicial = false;
    for (let i = 0; i < 5; i++) {
        this.piramide.push([]);
        for (let j = 0; j < i + 1; j++) {
            this.piramide[i].push(0)
        }
    }

    for (let i = 0; i < 5; i++) {
        this.tablero.push([]);
        for (let j = 0; j < 5; j++) {
            this.tablero[i].push(0)
        }
    }
}


function boardCreator() {
    let savePlayers = []
    for (let i = 1; i < 6; i++) { //se encarga de crear la cantidad inicial de fichas
        for (let j = 0; j < 20; j++) {
            fichas.push(i);
        }
    }
    for (let i = 0; i < Nplayers; i++) { //se encarga de crear los tableros de c/jugador
        savePlayers.push(new player);
    }
    fillCircles();
    return savePlayers;
}

function fillCircles() {
    for (let i = 0; i < Nholders; i++) { //crea las fichas de los circulitos
        for (let j = 0; j < 4; j++) {
            if (fichas.length) {
                pickFicha(fichas, pozo, descarte, i, j);
            }
        }
    }
    pozo[Nholders].push(6);
}

function pickFicha(fichasCopy, pozoCopy, descarteCopy, holder, position) { //elije aleatoriamente una ficha de las disponibles y la corta del trash
    let elegido;
    let randomFicha = Math.floor(Math.random() * fichasCopy.length);
    elegido = fichasCopy.splice(randomFicha, 1)[0];
    if (!fichasCopy.length) {
        for (let i = 0; i < descarteCopy.length; i++) {
            fichasCopy.push(descarteCopy[i]);
        }
        descarteCopy = [];
    }
    pozoCopy[holder][position] = elegido;
    return elegido;
}

function colocacion(row) { //j= linea elegida//selected[(holder),nroficha1,nroficha2,...]
    if (selected[0] == Nholders && pozo[Nholders][0] == 6) {
        if (players[turno].trash < 7) {
            players[turno].trash++; //el trash de la ficha "1"
        }
        players[turno].inicial = true; //aclarar que es el que empieza en la prox
        pozo[Nholders].splice(0, 1); //cortar el 6 del pozo
        for (let k = 1; k < selected.length; k++) {
            selected[k]--; //mover todos los numeros un lugar menos dado que se corto la pieza
        }
    }
    //-----------------------------------------------------------------------------------------------------------------
    let columna;
    if (row == 5) {
        columna = players[turno].trash; //cantidad de fichas en la misma fila
    } else {
        columna = players[turno].piramide[row].indexOf(0) //cantidad de fichas en la misma fila
    }
    for (let k = 1; k < selected.length; k++) {
        if (columna < 7) { //dado que si columna < 7 ya no entran en el descarte siquiera
            if (columna > row || row == 5) { //esto implica que ya no entran en su propia fila o que mandaron directo a descarte
                row = 5;
                columna = players[turno].trash; //cantidad de fichas en la misma fila
                if (players[turno].trash < 7) {
                    players[turno].trash++;
                } //el trash de la ficha "1"
                descarte.push(pozo[selected[0]][selected[k]])
            } else {
                players[turno].piramide[row][columna] = pozo[selected[0]][selected[k]]; //actualiza piramide
            }
            columna++;
        } else {
            descarte.push(pozo[selected[0]][selected[k]]) //agrega las fichas desaparecidas al descarte
        }
    }
    for (let k = 1; k < selected.length; k++) {
        if (selected[0] != Nholders)
            pozo[selected[0]][selected[k]] = 0;
        else
            pozo[selected[0]].splice(selected[k] - k + 1, 1)
    }
    //-----------------------------------------------------------------------------------------------------------------
    if (selected[0] != Nholders) { //transfiere las fichas descartadas al pozo
        for (let k = 0; k < 4; k++) {
            if (pozo[selected[0]][k] != 0) {
                pozo[Nholders].push(pozo[selected[0]][k])
                pozo[selected[0]][k] = 0;
            }
        }
    }
    turno++;
    turno %= Nplayers;

    let flag = false;
    for (let i = 0; i < Nholders; i++) {
        if (flag) break;
        for (let j = 0; j < pozo[i].length; j++) {
            if (pozo[i][j] != 0) {
                flag = true;
                break;
            }
            if (i + 1 == Nholders && j + 1 == pozo[i].length) {
                if (!pozo[Nholders].length) {
                    fusion();
                    return;
                }
            }
        }
    }
}

function fusion() {
    // console.log("FUUUUUUUUUUUUSION.")
    let termino = false;
    for (let i = 0; i < players.length; i++) {
        for (let j = 0; j < 5; j++) {
            if (players[i].piramide[j][j] != 0) {
                let chipColor = players[i].piramide[j][0];
                players[i].tablero[j][(chipColor - 1 + j) % 5] = chipColor;
                players[i].piramide[j][0] = 0;
                players[i].points += addPoints(players, i, j, (chipColor - 1 + j) % 5)
                for (let k = 1; k < j + 1; k++) {
                    descarte.push(players[i].piramide[j][k])
                    players[i].piramide[j][k] = 0;
                }
            }
        }
        prePotencial2[i] = bestOfRow2(players[i], false)[1] * division2 //agregar si juega manager2
        //prePotencial[i] = bestOfRow(players[i], false)[1] * division //agregar si juega manager2

        // for (let j = 0; j < 5; j++) {
        //     for (let k = 0; k < 5; k++) {
        //         if (players[i].tablero[j][k] == 0) {
        //             let popo = addPointsIA(new copyPlayer(players[i]), j, k,true)
        //             prePotencial[i][j][k] = popo[0]+popo[1];
        //         }
        //     }
        // }
        if (players[i].filas) {
            termino = true;
        }
        players[i].points += restar[players[i].trash]
        if (players[i].points < 0) {
            players[i].points = 0;
        }
        players[i].trash = 0;
        if (players[i].inicial == true) {
            turno = i;
            players[i].inicial = false;
        }
    }
    if (termino) {
        for (let i = 0; i < players.length; i++) {
            players[i].points += 7 * players[i].columnas
            players[i].points += 2 * players[i].filas
            players[i].points += 12 * players[i].colorido
        }
        endGame = true;
    } else {
        fillCircles();
    }
}

function addPoints(playersList, playersTurn, row, column) {
    let points = 0;
    let hor = 1;
    let ver = 1;
    for (let i = column - 1; 0 <= i; i--) {
        if (!playersList[playersTurn].tablero[row][i]) {
            break;
        }
        hor++;
    }
    for (let i = column + 1; i < 5; i++) {
        if (!playersList[playersTurn].tablero[row][i]) {
            break;
        }
        hor++;
    }
    for (let i = row - 1; 0 <= i; i--) {
        if (!playersList[playersTurn].tablero[i][column]) {
            break;
        }
        ver++;
    }
    for (let i = row + 1; i < 5; i++) {
        if (!playersList[playersTurn].tablero[i][column]) {
            break;
        }
        ver++;
    }
    for (let i = 0; i < 5; i++) {
        if (playersList[playersTurn].tablero[i][(5 - (row - column) + i) % 5]) {
            if (i + 1 == 5) {
                playersList[playersTurn].colorido++;
            }
        } else {
            break;
        }
    }

    if (hor == 5) {
        playersList[playersTurn].filas++;
    }
    if (ver == 5) {
        playersList[playersTurn].columnas++;
    }
    if (ver == 1 || hor == 1) {
        points = ver * hor;
    } else {
        points = ver + hor
    }
    return points;
}