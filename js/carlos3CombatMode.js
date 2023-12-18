var eachVisit2 = 1; //2 // 5
var iterations2 = 100000;
var randomness2 = 12; //
var prePotencial2 = [25, 25, 25, 25]
var castigo2 = [2, 3, 4.5, 5];
var bonusInicial2 = 3.5;
var bonusColumna2 = [0, 0.5, 1, 0.5, 0];
var plusValues = [1.5, 3.5, 3]
var division2 = 1; //sirve para testear si colocar el potencial completo o una parte
var best_highest2 = 2.3; //determina cuanto aplica initialbest - highest
var value2 = 0.5; //cuanto suma por ficha colocada
var testvar = true;
//-----------------------------------------------------------
function manageCharly2() {
    // console.clear();
    let nodeCopy = {
        pozoNode: copyArray2(pozo),
        descarteNode: [...descarte],
        fichasNode: [...fichas],
        playersNode: [],
        turnoNode: (turno) % Nplayers,
    }
    for (let i = 0; i < Nplayers; i++) {
        nodeCopy.playersNode.push(new copyPlayer2(players[i]))
    }
    let actualNode = new node2(nodeCopy);
    //==========================================
    for (let i = 0; i < iterations2; i++) {
        carlitos2(actualNode)
    }
    // //==========================================
    let highest = -Infinity;
    let iH = 0;
    let highestNode = null;
    let values = [];
    for (let i = 0; i < actualNode.childNodes.length; i++) {
        values.push(actualNode.childNodes[i].visits) /// totalPoints)
        if (actualNode.childNodes[i].visits > highest) {
            highestNode = actualNode.childNodes[i]
            highest = actualNode.childNodes[i].visits
            iH = i;
        }
    }
    //--------------------------------------------------------
    // console.clear();
    // console.log('actualNode:', actualNode)
    // console.log('children:', actualNode.childNodes)
    // console.log('ubicacion Highest:', iH)
    // console.log('highestNode:', highestNode)
    // console.log('================================')
    //--------------------------------------------------------
    // console.log(actualNode)
    selected = highestNode.selected;
    let option = highestNode.thisOption
    //killChildren2(actualNode);
    colocacion(option)
}

function killChildren2(fuckingNode) {
    if (fuckingNode.childNodes.length) {
        for (let i = 0; i < fuckingNode.childNodes.length; i++) {
            killChildren2(fuckingNode.childNodes[i])
        }
    }
    fuckingNode.childNodes = null;
    fuckingNode.pozoNode = null
    fuckingNode.fichasNode = null
    fuckingNode.descarteNode = null
    fuckingNode.value = null
    fuckingNode.playersNode = null
    return;
}

function carlitos2(parentNode) {
    if (!parentNode.childNodes.length) {
        let optionXcolor = [null];
        for (let i = 1; i < colores.length; i++) {
            optionXcolor.push(optionsIA2(parentNode.playersNode[(parentNode.turnoNode + 1) % Nplayers], i))
        }
        let selection = reordenar2(parentNode.pozoNode)
        for (let i = 0; i < selection.length; i++) {
            let opciones = optionXcolor[parentNode.pozoNode[selection[i][0]][selection[i][1]]];
            for (let j = 0; j < opciones.length; j++) {
                let newNode = new node2(parentNode);
                newNode.selected = selection[i];
                newNode.thisOption = opciones[j];
                parentNode.childNodes.push(newNode)
                newNode.winner = colocacionIA2(newNode, copyArray2(selection[i]), opciones[j]);
            }
        }
    }
    let highest = -Infinity;
    let highestNode = null;
    for (let i = 0; i < parentNode.childNodes.length; i++) {
        let childFormula = thisFormula2(parentNode.childNodes[i], parentNode.visits)
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
        sumValues2(highestNode.value, highestNode.winner);
        sumValues2(parentNode.value, highestNode.winner);
        return highestNode.winner //check winner copiar monte carlo crear funcion sacar de fusion
    }
    if (!(highestNode.visits)) {
        let result = 0;
        for (let i = 0; i < eachVisit2; i++) {
            if (result == 0) {
                result = thisMatch2(highestNode)
            } else {
                sumValues2(result, thisMatch2(highestNode))
            }
        }
        for (let i = 0; i < result.length; i++) {
            result[i] = Math.floor(result[i] / eachVisit2)
        }
        highestNode.visits += 1;
        parentNode.visits += 1;
        sumValues2(highestNode.value, result);
        sumValues2(parentNode.value, result);
        return result;
    } else {
        let result = carlitos2(highestNode);
        sumValues2(parentNode.value, result);
        parentNode.visits += 1;
        return result;
    }
}

function node2(parentNode) {
    this.value = [];
    this.visits = 0;
    this.childNodes = [] //[obj,obj,obj]
    //-------------------------------------------------
    this.pozoNode = copyArray2(parentNode.pozoNode);
    this.descarteNode = [...parentNode.descarteNode];
    this.fichasNode = [...parentNode.fichasNode];
    this.turnoNode = (parentNode.turnoNode + 1) % Nplayers; //agregar%Nplayers para hacer mas eficiente
    this.playersNode = [];
    for (let i = 0; i < Nplayers; i++) {
        this.value.push(0)
        this.playersNode.push(new copyPlayer2(parentNode.playersNode[i]))
    }
    //-------------------------------------------------
}

function thisFormula2(nodeCopy, parentVisits) {
    let difference = (nodeCopy.value[nodeCopy.turnoNode] - nodeCopy.value[(nodeCopy.turnoNode + 1) % Nplayers])
    return ((difference / nodeCopy.visits) + (randomness2) * Math.sqrt(Math.log(parentVisits) / nodeCopy.visits))
}


//--------------------------------------------------
function refill2(nodeCopy) {
    for (let i = 0; i < Nholders; i++) { //crea las fichas de los circulitos
        for (let j = 0; j < 4; j++) {
            if (nodeCopy.fichasNode.length) {
                pickFicha(nodeCopy.fichasNode, nodeCopy.pozoNode, nodeCopy.descarteNode, i, j)
            }
        }
    }
    nodeCopy.pozoNode[Nholders].push(6);
}
//--------------------------------------------------
function reordenar2(pozoCopy) {
    let pozoSexy = [];
    for (let i = 0; i < Nholders + 1; i++) {
        let done = [];
        for (let j = 0; j < pozoCopy[i].length; j++) {
            if (done.indexOf(j) == -1 && pozoCopy[i][j] != 6 && pozoCopy[i][j] != 0) {
                let paquete = empaquetar2(pozoCopy, pozoCopy[i], i, j)
                done.push(...paquete[0])
                pozoSexy.push(paquete[1])
            }
        }
    }
    return pozoSexy;
}

function empaquetar2(pozoCopy, initial, holder, position) {
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

function optionsIA2(player, color) {
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
function thisMatch2(childNode) {
    let nodeCopy = {
        pozoNode: copyArray2(childNode.pozoNode),
        descarteNode: [...childNode.descarteNode],
        fichasNode: [...childNode.fichasNode],
        playersNode: [],
        turnoNode: (childNode.turnoNode+1)%2,
    }
    for (let i = 0; i < Nplayers; i++) {
        nodeCopy.playersNode.push(new copyPlayer2(childNode.playersNode[i]))
    }
    return simulation2(nodeCopy);
}

function simulation2(nodeCopy) {
    // console.clear();
    // console.log(nodeCopy);
    // debugger;
    let selection = reordenar2(nodeCopy.pozoNode);
    let ranSelected = selection[Math.floor(Math.random() * selection.length)]
    let opciones = optionsIA2(nodeCopy.playersNode[nodeCopy.turnoNode], nodeCopy.pozoNode[ranSelected[0]][ranSelected[1]])
    let ranOptions = opciones[Math.floor(Math.random() * opciones.length)]
    let result = colocacionIA2(nodeCopy, copyArray2(ranSelected), ranOptions);
    if (result == undefined) {
        return simulation2(nodeCopy);
    } else {
        return result;
    }

}

function colocacionIA2(nodeCopy, selectedCopy, row) { //j= linea elegida//selectedCopy[(holder),nroficha1,nroficha2,...]
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
    if (endSet2(nodeCopy.pozoNode)) {
        return fusionIA2(nodeCopy);
    }
}

function endSet2(pozoNode) {
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

function fusionIA2(nodeCopy) {
    let playersPoints = [];
    let playersExtra = [0, 0]; //ojo no permite jugar de a 3
    let endPoints = [];
    let termino = false;
    for (let i = 0; i < Nplayers; i++) {
        let disponibles = 15;
        let player = nodeCopy.playersNode[i];
        playersExtra[i] -= prePotencial2[i] / division2
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
        // console.log('conexion 3-4-5:', playersExtra[i])
        // console.log('---------------------------')

        for (let j = 0; j < 5; j++) {
            if (player.piramide[j][j] == 0 && player.piramide[j][0] != 0) {
                let ocupacion = player.piramide[j].indexOf(0)
                playersExtra[i] += (ocupacion) * value2
                playersExtra[i] -= castigo2[j - ocupacion]
                disponibles -= ocupacion
            } else if (player.piramide[j][j] != 0) {
                let chipColor = player.piramide[j][0];
                player.tablero[j][(chipColor - 1 + j) % 5] = chipColor;
                playersExtra[i] += bonusColumna2[(chipColor - 1 + j) % 5];
                let chipPoints = addPointsIA2(player, j, (chipColor - 1 + j) % 5)
                player.points += chipPoints[0];
                playersExtra[i] += (chipPoints[0] + chipPoints[1] * 2) / division2; //(chipPoints + playersExtra[i] - saveExtra) //2;
                player.piramide[j][0] = 0;
                for (let k = 1; k < j + 1; k++) {
                    nodeCopy.descarteNode.push(player.piramide[j][k])
                    player.piramide[j][k] = 0;
                }
            }
            // console.log('extra fusion:', j, playersExtra[i]) //kkk
        }
        // console.log('---------------------------')
        if (disponibles < 8) {
            playersExtra[i] -= 8;
        }

        playersExtra[i] += bestOfRow2(player, true)[0];
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
            playersExtra[i] += bonusInicial2;
            player.inicial = false;
        }
        playersPoints.push(player.points)
        endPoints.push(0)
        endPoints[i] += 7 * player.columnas
        endPoints[i] += 2 * player.filas
        endPoints[i] += 12 * player.colorido
        // console.log('---------------------------')
        // console.log('final:', playersExtra[i])
        // console.log('-------------------:')
        // debugger;
        //console.clear();
    }

    if (termino) {
        sumValues2(playersPoints, endPoints)
    } else {
        sumValues2(playersPoints, playersExtra);
    }
    return playersPoints;
}

function bestOfRow2(player, post) { //player has to be copy
    let playerCopy = new copyPlayer2(player);
    let total = 0;
    let diferencia = 0;
    //console.log('playerCopy.tablero:', playerCopy.tablero)
    for (let i = 0; i < 5; i++) {
        let highest = -Infinity;
        let initialBest = 0;
        let column = -1;
        if (player.piramide[i][0] != 0 && post) { //si estas aca no podes estar completo no hace falta aclarar
            column = (playerCopy.piramide[i][0] - 1 + i) % 5;
            //console.log('column:', column)
        }
        for (let j = 0; j < 5; j++) {
            if (!playerCopy.tablero[i][j]) {
                let sum = addPointsIA2(playerCopy, i, j)
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
            diferencia += (initialBest - highest) / best_highest2;
        }
    }
    return [((total / division2) + diferencia), (total / division2)];
}

function addPointsIA2(player, row, column) {
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
function copyArray2(array) { //simple as that you give this function an array of arrays and it returns a copy of it
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

function sumValues2(value1, value2) { //value1 is the updated one
    for (let i = 0; i < value1.length; i++) {
        value1[i] += value2[i];
    }
}

function copyPlayer2(player) {
    this.piramide = copyArray2(player.piramide);
    this.tablero = copyArray2(player.tablero);
    this.points = player.points;
    this.trash = player.trash;
    this.filas = player.filas;
    this.columnas = player.columnas;
    this.colorido = player.colorido;
    this.inicial = player.inicial;
}