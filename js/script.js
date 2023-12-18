const red = "rgb(255, 0, 0)";
const green = "rgb(0, 201, 60)";
const blue = "rgb(0, 38, 191)";
const yellow = "rgb(230, 224, 69)";
const black = "rgb(0, 0, 0)";
const colores = [null, yellow, blue, green, red, black] //comienza en 1 ya que el primer color es la nada
//--------------------------------------------------------
const Nplayers = 2;
//const Nplayers = prompt("inserte cantidad de jugadores 2-4")
const Nholders = Nplayers * 2 + 1;
//--------------------------------------------------------
// const turnoCharly = 1;
// const turnoCharly = parseInt(prompt("1: vas primero// 2: vas segundo")) % 2;
const turnoCharly = Math.floor(Math.random()*2);
//--------------------------------------------------------
const restar = [0, -1, -2, -4, -6, -8, -11, -14];
let fichas = [];
let descarte = [];
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
const players = boardCreator(); //es constante pero se declara raro

if (turnoCharly == turno) manageCharlyV()


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
        document.getElementById("flexMiniBoards").insertAdjacentHTML("beforeend",
            "<div id = piramide" + i + " class = 'image miniBoard'></div>");
        document.getElementById("piramide" + i).insertAdjacentHTML("beforeend",
            "<div class='points'>0</div>");
        for (let j = 0; j < 6; j++) {
            document.getElementById("piramide" + i).insertAdjacentHTML("beforeend",
                "<div id=arrow" + (i * 10 + j) + " class = 'image arrow a" + j + "'></div>");
            document.getElementById("arrow" + (i * 10 + j)).onclick = function () {
                colocacion(j);
            }
        }
        savePlayers.push(new player);
    }
    for (let i = 0; i < Nholders; i++) { //crea los circulitos del medio y las fichas que contienen
        document.getElementById("flexHolders").insertAdjacentHTML("beforeend",
            "<div id = circulito" + i + " class = 'holder'></div>");
    }
    
    fillCircles();
    
    return savePlayers;
}

function fillCircles() {
    for (let i = 0; i < Nholders; i++) { //crea las fichas de los circulitos
        for (let j = 0; j < 4; j++) {
            if (fichas.length) {
                document.getElementById("circulito" + i).insertAdjacentHTML("beforeend",
                    "<div class='ficha'></div>");
                let fichita = document.getElementById("circulito" + i).getElementsByClassName("ficha")[j]
                fichita.style.backgroundColor = colores[pickFicha(fichas, pozo, descarte, i, j)];

                fichita.onclick = function () {
                    selectFicha(i, fichita.style.backgroundColor)
                }
            }
        }
    }
    pozo[Nholders].push(6);
    document.getElementById("flexPozo").insertAdjacentHTML("beforeend",
        "<div id= 'inicial' class='ficha image' style='background-image: url(img/1.png);'></div>")
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


function selectFicha(holder, color) {
    turnOff();
    let divName = "circulito" + holder;
    selected = [holder]
    if (!pozo[holder][0]) {
        divName = "flexPozo";
        selected = [Nholders]
    }
    for (let i = 0; i < document.getElementById(divName).getElementsByClassName("ficha").length; i++) {
        if (document.getElementById(divName).getElementsByClassName("ficha")[i].style.backgroundColor ==
            color) {
            selected.push(i)
            document.getElementById(divName).getElementsByClassName("ficha")[i].style.height = "1.4vw";
            document.getElementById(divName).getElementsByClassName("ficha")[i].style.width = "1.4vw";
            document.getElementById(divName).getElementsByClassName("ficha")[i].style.border = "solid white 0.15vw";
        }
    }
    options(colores.indexOf(color));
}

function turnOff() {
    let flechas = document.getElementsByClassName("miniBoard")[turno % Nplayers].getElementsByClassName("arrow")
    let fichasTotales = document.getElementsByClassName("ficha");
    for (let i = 0; i < flechas.length; i++) {
        flechas[i].style.display = "none"; //apagar las flechas dado que ya se selecciono una
    }
    for (let i = 0; i < fichasTotales.length; i++) {
        fichasTotales[i].style.height = "1.7vw"; //resetear seleccion de fichas
        fichasTotales[i].style.width = "1.7vw";
        fichasTotales[i].style.border = "";
    }
}

function options(color) {
    let piramide = players[turno % Nplayers].piramide;
    let tablero = players[turno % Nplayers].tablero;
    let posibles = [5]
    for (let i = 0; i < piramide.length; i++) {
        if (piramide[i][i] == 0 && (piramide[i][0] == 0 || piramide[i][0] == color) &&
            tablero[i].indexOf(color) == -1) {
            posibles.push(i);
        }
    }
    let flechas = document.getElementsByClassName("miniBoard")[turno % Nplayers].getElementsByClassName("arrow")
    for (let i = 0; i < posibles.length; i++) {
        flechas[posibles[i]].style.display = "block";
    }
}

function colocacion(row) { //row= linea elegida en piramide//selected[(holder),nroficha1,nroficha2,...]
    let tableroDoc = document.getElementById("piramide" + (turno % Nplayers));
    if (selected[0] == Nholders && pozo[Nholders][0] == 6) { //si es el primero en agarrar del pozo
        let fila5 = tableroDoc.getElementsByClassName("fila5");
        for (let i = 0; i < fila5.length; i++) { //en caso de que ya haya fichas en descarte trasladarlas
            if (i >= 6) {
                fila5[i].remove();
                i--;
            } else {
                fila5[i].classList.remove("columna" + (4 - i));
                fila5[i].classList.add("columna" + (4 - (i + 1)));
            }
        }

        if (players[turno % Nplayers].trash < 7) {
            players[turno % Nplayers].trash++;
        }
        players[turno % Nplayers].inicial = true; //aclarar que es el que empieza en la prox
        tableroDoc.insertAdjacentHTML( //insertar la ficha en la primer casilla;
            "beforeend", "<div id ='fichaInicial' class = 'image ficha columna4 fila5'></div>")
        document.getElementById("fichaInicial").style.backgroundImage = 'url("img/1.png")';
        document.getElementById("fichaInicial").style.position = "absolute";
        document.getElementById("fichaInicial").style.margin = "0";
        pozo[Nholders].splice(0, 1); //cortar el 6 del pozo
        document.getElementById("flexPozo").children[0].remove(); //eliminar la imagen de "1"
        for (let i = 1; i < selected.length; i++) {
            selected[i]--; //mover todos los numeros un lugar menos dado que se corto la pieza
        }
    }
    //-----------------------------------------------------------------------------------------------------------------
    turnOff()
    //-----------------------------------------------------------------------------------------------------------------
    let columna;
    if (row == 5) {
        columna = players[turno % Nplayers].trash; //cantidad de fichas en la misma fila
    } else {
        columna = players[turno % Nplayers].piramide[row].indexOf(0) //cantidad de fichas en la misma fila
    }
    for (let i = 1; i < selected.length; i++) {
        if (columna < 7) { //dado que si columna < 7 ya no entran en el descarte siquiera
            if (columna > row || row == 5) { //esto implica que ya no entran en su propia fila o que mandaron directo a descarte
                row = 5;
                columna = players[turno % Nplayers].trash; //cantidad de fichas en la misma fila
                if (players[turno % Nplayers].trash < 7) {
                    players[turno % Nplayers].trash++;
                    tableroDoc.insertAdjacentHTML(
                        "beforeend", "<div class = 'ficha columna" + (4 - columna) + " fila" + row + "'></div>")
                }
                descarte.push(pozo[selected[0]][selected[i]]) //agrega las fichas desaparecidas al descarte

            } else {
                players[turno % Nplayers].piramide[row][columna] = pozo[selected[0]][selected[i]]; //actualiza piramide
                tableroDoc.insertAdjacentHTML(
                    "beforeend", "<div class = 'ficha columna" + columna + " fila" + row + "'></div>")
            }
            if (columna < 7) {
                tableroDoc.getElementsByClassName("fila" + row)[columna].style.backgroundColor = colores[pozo[selected[0]][selected[1]]];
                tableroDoc.getElementsByClassName("fila" + row)[columna].style.position = "absolute";
                tableroDoc.getElementsByClassName("fila" + row)[columna].style.margin = "0";
            }
            columna++;
        } else {
            descarte.push(pozo[selected[0]][selected[i]]) //agrega las fichas desaparecidas al descarte
        }
    }
    //-----------------------------------------------------------------------------------------------------------------
    let chipsCircle;
    if (selected[0] != Nholders) //si agarraron del pozo o no
        chipsCircle = document.getElementsByClassName("holder")[selected[0]].getElementsByClassName("ficha");
    else
        chipsCircle = document.getElementById("flexPozo").getElementsByClassName("ficha");

    for (let i = 1; i < selected.length; i++) { //elimina las piezas agarradas ya transferidas a la piramide
        chipsCircle[selected[i] - i + 1].remove();
        if (selected[0] != Nholders)
            pozo[selected[0]][selected[i]] = 0;
        else
            pozo[selected[0]].splice(selected[i] - i + 1, 1)
    }
    if (selected[0] != Nholders) { //transfiere las fichas descartadas al pozo
        for (let i = 0; i < 5 - selected.length; i++) {
            document.getElementById("flexPozo").insertAdjacentElement("beforeend", chipsCircle[0])
        }
        for (let i = 0; i < 4; i++) {
            if (pozo[selected[0]][i] != 0) {
                pozo[Nholders].push(pozo[selected[0]][i])
                pozo[selected[0]][i] = 0;
            }
        }
    }
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
    turno++;
    setTimeout(function () {
        if (turno % Nplayers == turnoCharly) {
            manageCharlyV()
        }
    }, 50)
}
function fusion() {
    console.log("FUUUUUUUUUUUUSION.")
    let termino = false;
    for (let i = 0; i < players.length; i++) {
        for (let j = 0; j < 5; j++) {
            if (players[i].piramide[j][j] != 0) {
                let rowChips = document.getElementById("piramide" + i).getElementsByClassName("fila" + j)
                rowChips[0].classList.remove("columna0");
                let chipColor = players[i].piramide[j][0];
                rowChips[0].classList.add("columnaT" + ((chipColor - 1 + j) % 5));
                players[i].tablero[j][(chipColor - 1 + j) % 5] = chipColor;
                players[i].piramide[j][0] = 0;
                players[i].points += addPoints(players, i, j, (chipColor - 1 + j) % 5)
                rowChips[0].classList.add("filaT" + j);
                rowChips[0].classList.remove("fila" + j);
                for (let k = 1; k < j + 1; k++) {
                    if(k != j) descarte.push(players[i].piramide[j][k])
                    players[i].piramide[j][k] = 0;
                    rowChips[0].remove();
                }

            }
        }
        prePotencial[i] = bestOfRow(players[i],false)[1]
        
        if (players[i].filas) {
            termino = true;
        }
        players[i].points += restar[players[i].trash]
        if (players[i].points < 0) {
            players[i].points = 0;
        }
        document.getElementById("piramide" + i).getElementsByClassName("points")[0].innerHTML = players[i].points;
        players[i].trash = 0;
        let trashChips = document.getElementById("piramide" + i).getElementsByClassName("fila5")

        if (players[i].inicial == true) {
            turno = i;
            players[i].inicial = false;
        }
        for (let k = 0; k < trashChips.length;) {
            trashChips[k].remove();
        }
    }
    if (termino) {
        for (let i = 0; i < players.length; i++) {
            players[i].points += 7 * players[i].columnas
            players[i].points += 2 * players[i].filas
            players[i].points += 12 * players[i].colorido
            document.getElementById("piramide" + i).getElementsByClassName("points")[0].innerHTML = players[i].points;

        }
    } else {
        fillCircles();
        setTimeout(
            function () {
                if (turno % Nplayers == turnoCharly) {
                    manageCharlyV()
                }
            }, 50
        )
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