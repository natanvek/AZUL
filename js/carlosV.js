var eachVisit = 1; //2 // 5
var iterations = 10000;
const AITurnDurationMiliSeconds = 1500;
var randomness = 20; //
var prePotencial = [25, 25, 25, 25]
var castigo = [2, 3, 4.5, 5];
var bonusInicial = 3.5;
var bonusColumna = [0, 0.5, 1, 0.5, 0];
var plusValues = [1.5, 3.5, 3]
var division = 1; //sirve para testear si colocar el potencial completo o una parte
var best_highest = 2.3; //determina cuanto aplica initialbest - highest
var value = 0.5; //cuanto suma por ficha colocada
//-----------------------------------------------------------
function manageCharlyV() {
    console.clear();
    let nodeCopy = {
        pozoNode: copyArray(pozo),
        descarteNode: [...descarte],
        fichasNode: [...fichas],
        playersNode: [],
        turnoNode: (turno) % Nplayers,
    }
    for (let i = 0; i < Nplayers; i++) {
        nodeCopy.playersNode.push(new copyPlayer(players[i]))
    }
    let actualNode = new node(nodeCopy);
    //==========================================
    const endTime = Date.now() + AITurnDurationMiliSeconds;
    while (Date.now() < endTime) carlosV(actualNode)
    
    // for (let i = 0; i < iterations; i++) {
    // }
    // //==========================================
    let ranking = [[actualNode.childNodes[0].visits, 0]];
    for (let i = 1; i < actualNode.childNodes.length; i++) {
        if (actualNode.childNodes[i].visits > ranking[ranking.length-1][0]) {
            if(ranking.length < 3){
                ranking.push([actualNode.childNodes[i].visits, i])
                ranking.sort((a,b) => b[0] - a[0])
            }else{
                ranking[2][0] = actualNode.childNodes[i].visits;
                ranking[2][1] = i;
                ranking.sort((a,b) => b[0] - a[0])
            }
        }
    }
    let moves = [-1];
    let lastChildren = [];
    for(x of ranking){
        moves.push(moves[moves.length-1] + 1)
        lastChildren.push(actualNode.childNodes[x[1]]);
        actualNode.childNodes[x[1]].childNodes = [];
    }
    moves.shift();
    actualNode.childNodes = lastChildren;
    let highestNode = actualNode.childNodes[visionLargoPlazo(actualNode, moves)]

    //--------------------------------------------------------
    selected = highestNode.selected;
    let option = highestNode.thisOption
    colocacion(option)
}


function carlosV(parentNode) {
    if (!parentNode.childNodes.length) {
        let optionXcolor = [null];
        for (let i = 1; i < colores.length; i++) {
            optionXcolor.push(optionsIA(parentNode.playersNode[(parentNode.turnoNode + 1) % Nplayers], i))
        }
        let selection = reordenar(parentNode.pozoNode)
        for (let i = 0; i < selection.length; i++) {
            let opciones = optionXcolor[parentNode.pozoNode[selection[i][0]][selection[i][1]]];
            for (let j = 0; j < opciones.length; j++) {
                let newNode = new node(parentNode);
                newNode.selected = selection[i];
                newNode.thisOption = opciones[j];
                parentNode.childNodes.push(newNode)
                newNode.winner = colocacionIA(newNode, copyArray(selection[i]), opciones[j]);
            }
        }
    }
    let highest = -Infinity;
    let highestNode = null;
    for (let i = 0; i < parentNode.childNodes.length; i++) {
        let childFormula = thisFormula(parentNode.childNodes[i], parentNode.visits)
        if (isNaN(childFormula) || childFormula > highest) {
            highestNode = parentNode.childNodes[i]
            highest = childFormula
            if (isNaN(childFormula)) {
                break;
            }
        }
    }
    if (highestNode.winner != undefined) {
        parentNode.visits += 1;
        highestNode.visits += 1;
        sumValues(highestNode.value, highestNode.winner);
        sumValues(parentNode.value, highestNode.winner);
        return highestNode.winner //check winner copiar monte carlo crear funcion sacar de fusion
    }
    if (!(highestNode.visits)) {
        let result = 0;
        for (let i = 0; i < eachVisit; i++) {
            if (result == 0) {
                result = thisMatch(highestNode)
            } else {
                sumValues(result, thisMatch(highestNode))
            }
        }
        for (let i = 0; i < result.length; i++) {
            result[i] = Math.floor(result[i] / eachVisit)
        }
        highestNode.visits += 1;
        parentNode.visits += 1;
        sumValues(highestNode.value, result);
        sumValues(parentNode.value, result);
        return result;
    } else {
        let result = carlosV(highestNode);
        sumValues(parentNode.value, result);
        parentNode.visits += 1;
        return result;
    }
}

function node(parentNode) {
    this.value = [];
    this.visits = 0;
    this.childNodes = [] //[obj,obj,obj]
    //-------------------------------------------------
    this.pozoNode = copyArray(parentNode.pozoNode);
    this.descarteNode = [...parentNode.descarteNode];
    this.fichasNode = [...parentNode.fichasNode];
    this.turnoNode = (parentNode.turnoNode + 1) % Nplayers; //agregar%Nplayers para hacer mas eficiente
    this.playersNode = [];
    this.fusion = false;
    for (let i = 0; i < Nplayers; i++) {
        this.value.push(0)
        this.playersNode.push(new copyPlayer(parentNode.playersNode[i]))
        if(parentNode.fusion) this.playersNode[i].inicial = false;
    }
    //-------------------------------------------------
}

function thisFormula(nodeCopy, parentVisits, rss = randomness) {
    let difference = (nodeCopy.value[nodeCopy.turnoNode] - nodeCopy.value[(nodeCopy.turnoNode + 1) % Nplayers])
    return ((difference / nodeCopy.visits) + (rss) * Math.sqrt(Math.log(parentVisits) / nodeCopy.visits))
}

//--------------------------------------------------
function reordenar(pozoCopy) {
    let pozoSexy = [];
    for (let i = 0; i < Nholders + 1; i++) {
        let done = [];
        for (let j = 0; j < pozoCopy[i].length; j++) {
            if (done.indexOf(j) == -1 && pozoCopy[i][j] != 6 && pozoCopy[i][j] != 0) {
                let paquete = empaquetar(pozoCopy, pozoCopy[i], i, j)
                done.push(...paquete[0])
                pozoSexy.push(paquete[1])
            }
        }
    }
    return pozoSexy;
}

function empaquetar(pozoCopy, initial, holder, position) {
    let paquetito = [holder];
    let done = []
    for (let i = 0; i < initial.length; i++) {
        if (initial[position] == pozoCopy[holder][i]) {
            paquetito.push(i)
            done.push(i)
        }
    }
    return [done, paquetito];
}

function optionsIA(player, color) {
    let piramide = player.piramide;
    let tablero = player.tablero;
    let posibles = [5]
    for (let i = 0; i < piramide.length; i++) {
        if (piramide[i][i] == 0 && (piramide[i][0] == 0 || piramide[i][0] == color) &&
            tablero[i].indexOf(color) == -1) {
            posibles.push(i);
        }
    }
    return posibles;
}
//--------------------------------------------------
function thisMatch(childNode, simulationFunc = simulation) {
    let nodeCopy = {
        pozoNode: copyArray(childNode.pozoNode),
        descarteNode: [...childNode.descarteNode],
        fichasNode: [...childNode.fichasNode],
        playersNode: [],
        turnoNode: (childNode.turnoNode+1)%2,
    }
    for (let i = 0; i < Nplayers; i++) {
        nodeCopy.playersNode.push(new copyPlayer(childNode.playersNode[i]))
    }
    return simulationFunc(nodeCopy);
}

function simulation(nodeCopy) {
    let selection = reordenar(nodeCopy.pozoNode);
    let ranSelected = selection[Math.floor(Math.random() * selection.length)]
    let opciones = optionsIA(nodeCopy.playersNode[nodeCopy.turnoNode], nodeCopy.pozoNode[ranSelected[0]][ranSelected[1]])
    let ranOptions = opciones[Math.floor(Math.random() * opciones.length)]
    let result = colocacionIA(nodeCopy, copyArray(ranSelected), ranOptions);
    if (result == undefined) {
        return simulation(nodeCopy);
    } else {
        return result;
    }

}

function colocacionIA(nodeCopy, selectedCopy, row, fusionFunc = fusionIA) { //j= linea elegida//selectedCopy[(holder),nroficha1,nroficha2,...]
    if (selectedCopy[0] == Nholders && nodeCopy.pozoNode[Nholders][0] == 6) {
        if (nodeCopy.playersNode[nodeCopy.turnoNode].trash < 7) {
            nodeCopy.playersNode[nodeCopy.turnoNode].trash++; //el trash de la ficha "1"
        }
        nodeCopy.playersNode[nodeCopy.turnoNode].inicial = true; //aclarar que es el que empieza en la prox
        nodeCopy.pozoNode[Nholders].splice(0, 1); //cortar el 6 del pozo
        for (let k = 1; k < selectedCopy.length; k++) {
            selectedCopy[k]--; //mover todos los numeros un lugar menos dado que se corto la pieza
        }
    }
    //-----------------------------------------------------------------------------------------------------------------
    let columna;
    if (row == 5) {
        columna = nodeCopy.playersNode[nodeCopy.turnoNode].trash; //cantidad de fichas en la misma fila
    } else {
        columna = nodeCopy.playersNode[nodeCopy.turnoNode].piramide[row].indexOf(0) //cantidad de fichas en la misma fila
    }
    for (let k = 1; k < selectedCopy.length; k++) {
        if (columna < 7) { //dado que si columna < 7 ya no entran en el descarte siquiera
            if (columna > row || row == 5) { //esto implica que ya no entran en su propia fila o que mandaron directo a descarte
                row = 5;
                columna = nodeCopy.playersNode[nodeCopy.turnoNode].trash; //cantidad de fichas en la misma fila
                if (nodeCopy.playersNode[nodeCopy.turnoNode].trash < 7) {
                    nodeCopy.playersNode[nodeCopy.turnoNode].trash++;
                } //el trash de la ficha "1"
                nodeCopy.descarteNode.push(nodeCopy.pozoNode[selectedCopy[0]][selectedCopy[k]])
            } else {
                nodeCopy.playersNode[nodeCopy.turnoNode].piramide[row][columna] = nodeCopy.pozoNode[selectedCopy[0]][selectedCopy[k]]; //actualiza piramide
            }
            columna++;
        } else {
            nodeCopy.descarteNode.push(nodeCopy.pozoNode[selectedCopy[0]][selectedCopy[k]]) //agrega las fichas desaparecidas al descarte
        }
    }
    for (let k = 1; k < selectedCopy.length; k++) {
        if (selectedCopy[0] != Nholders)
            nodeCopy.pozoNode[selectedCopy[0]][selectedCopy[k]] = 0;
        else
            nodeCopy.pozoNode[selectedCopy[0]].splice(selectedCopy[k] - k + 1, 1)
    }
    //-----------------------------------------------------------------------------------------------------------------
    if (selectedCopy[0] != Nholders) { //transfiere las fichas descartadas al pozo
        for (let k = 0; k < 4; k++) {
            if (nodeCopy.pozoNode[selectedCopy[0]][k] != 0) {
                nodeCopy.pozoNode[Nholders].push(nodeCopy.pozoNode[selectedCopy[0]][k])
                nodeCopy.pozoNode[selectedCopy[0]][k] = 0;
            }
        }
    }
    if (nodeCopy.thisOption == undefined) {
        nodeCopy.turnoNode += 1;
        nodeCopy.turnoNode %= Nplayers;
    }
    if (endSet(nodeCopy.pozoNode)) {
        return fusionFunc(nodeCopy);
    }
}

function endSet(pozoNode) {
    for (let i = 0; i < Nholders; i++) {
        for (let j = 0; j < pozoNode[i].length; j++) {
            if (pozoNode[i][j] != 0) {
                return false;
            }
            if (i + 1 == Nholders && j + 1 == pozoNode[i].length) {
                if (!pozoNode[Nholders].length) {
                    return true;
                }
            }
        }
    }

}

function fusionIA(nodeCopy) {
    let playersPoints = [];
    let playersExtra = [0, 0]; //ojo no permite jugar de a 3
    let endPoints = [];
    let termino = false;
    for (let i = 0; i < Nplayers; i++) {
        let disponibles = 15;
        let player = nodeCopy.playersNode[i];
        playersExtra[i] -= prePotencial[i] / division
        if (player.piramide[2][0] != 0) {
            if ((player.piramide[3][1] && (player.piramide[3][0] + 1) % 5 == player.piramide[2][0]) ||
                player.tablero[3][(player.piramide[2][0] + 1) % 5]) {
                playersExtra[i] += plusValues[0];
            }
            if ((player.piramide[4][1] && (player.piramide[4][0] + 2) % 5 == player.piramide[2][0]) ||
                player.tablero[4][(player.piramide[2][0] + 1) % 5]) {
                playersExtra[i] += plusValues[1];
            }
        }
        if (player.piramide[3][0] != 0) {
            if ((player.piramide[4][1] && (player.piramide[4][0] + 1) % 5 == player.piramide[3][0]) ||
                player.tablero[4][(player.piramide[3][0] + 2) % 5]) {
                playersExtra[i] += plusValues[2];
            }
        }

        for (let j = 0; j < 5; j++) {
            if (player.piramide[j][j] == 0 && player.piramide[j][0] != 0) {
                let ocupacion = player.piramide[j].indexOf(0)
                playersExtra[i] += (ocupacion) * value
                playersExtra[i] -= castigo[j - ocupacion]
                disponibles -= ocupacion
            } else if (player.piramide[j][j] != 0) {
                let chipColor = player.piramide[j][0];
                player.tablero[j][(chipColor - 1 + j) % 5] = chipColor;
                playersExtra[i] += bonusColumna[(chipColor - 1 + j) % 5];
                let chipPoints = addPointsIA(player, j, (chipColor - 1 + j) % 5)
                player.points += chipPoints[0];
                playersExtra[i] += (chipPoints[0] + chipPoints[1] * 2) / division; //(chipPoints + playersExtra[i] - saveExtra) //2;
                player.piramide[j][0] = 0;
                for (let k = 1; k < j + 1; k++) {
                    nodeCopy.descarteNode.push(player.piramide[j][k])
                    player.piramide[j][k] = 0;
                }
            }
        }
        // console.log('---------------------------')
        if (disponibles < 8) {
            playersExtra[i] -= 8;
        }

        playersExtra[i] += bestOfRow(player, true)[0];
        // console.log('extra after 2do best of row:', playersExtra[i])
        player.points += restar[player.trash]
        if (player.points < 0) {
            playersExtra[i] += player.points;
            player.points = 0;
        }
        player.trash = 0;
        if (player.filas) {
            termino = true;
        }
        if (player.inicial == true) { //puede haber problemas aca
            playersExtra[i] += bonusInicial;
            player.inicial = false;
        }
        playersPoints.push(player.points)
        endPoints.push(0)
        endPoints[i] += 7 * player.columnas
        endPoints[i] += 2 * player.filas
        endPoints[i] += 12 * player.colorido
    }

    if (termino) {
        sumValues(playersPoints, endPoints)
    } else {
        sumValues(playersPoints, playersExtra);
    }
    return playersPoints;
}

function bestOfRow(player, post) { //player has to be copy
    let playerCopy = new copyPlayer(player);
    let total = 0;
    let diferencia = 0;

    for (let i = 0; i < 5; i++) {
        let highest = -Infinity;
        let initialBest = 0;
        let column = -1;
        if (player.piramide[i][0] != 0 && post) { //si estas aca no podes estar completo no hace falta aclarar
            column = (playerCopy.piramide[i][0] - 1 + i) % 5;
        }
        for (let j = 0; j < 5; j++) {
            if (!playerCopy.tablero[i][j]) {
                let sum = addPointsIA(playerCopy, i, j)
                if (sum[0] + sum[1] > highest) {
                    highest = sum[0] + sum[1];
                }
                if (j == column) {
                    initialBest = sum[0] + sum[1];
                }
                total += (sum[0] + sum[1]);
            }
        }
        if (column > 0) { //no hace falta && post ya iffeado
            diferencia += (initialBest - highest) / best_highest;
        }
    }
    return [((total / division) + diferencia), (total / division)];
}

function addPointsIA(player, row, column) {
    let points = 0;
    let extra = 0;
    let hor = 1;
    let ver = 1;
    for (let i = column - 1; 0 <= i; i--) {
        if (!player.tablero[row][i]) {
            break;
        }
        hor++;
    }
    for (let i = column + 1; i < 5; i++) {
        if (!player.tablero[row][i]) {
            break;
        }
        hor++;
    }
    for (let i = row - 1; 0 <= i; i--) {
        if (!player.tablero[i][column]) {
            break;
        }
        ver++;
    }
    for (let i = row + 1; i < 5; i++) {
        if (!player.tablero[i][column]) {
            break;
        }
        ver++;
    }
    for (let i = 0; i < 5; i++) {
        if (player.tablero[i][(5 - (row - column) + i) % 5]) {
            if (i + 1 == 5) {
                player.colorido++;
                extra += 12;
            }
        } else {
            break;
        }
    }

    if (hor == 5) {
        player.filas++;
        extra += 2;
    }
    if (ver == 5) {
        player.columnas++;
        extra += 7;
    }
    if (ver == 1 || hor == 1) {
        points = ver * hor;
    } else {
        points = ver + hor;
    }
    extra += (row)
    return [points, extra];
}
//--------------------------------------------------
function copyArray(array) { //simple as that you give this function an array of arrays and it returns a copy of it
    let copy = []
    for (let i = 0; i < array.length; i++) {
        if (!(array[i] instanceof Array)) {
            copy.push(array[i]) //if the array its just a value not another array adds the value to the array
        } else { //if the element of the initial array is an array first creats a copy of the array element recursing
            copy.push([...array[i]]) // and then it adds it to the initial array 
        }
    }
    return copy;
}

function sumValues(value1, value2) { //value1 is the updated one
    for (let i = 0; i < value1.length; i++) {
        value1[i] += value2[i];
    }
}

function copyPlayer(player) {
    this.piramide = copyArray(player.piramide);
    this.tablero = copyArray(player.tablero);
    this.points = player.points;
    this.trash = player.trash;
    this.filas = player.filas;
    this.columnas = player.columnas;
    this.colorido = player.colorido;
    this.inicial = player.inicial;
}