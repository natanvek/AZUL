var iterationsAnexo = 200;
var randomnessAnexo = 1.5; //
//-----------------------------------------------------------
function visionLargoPlazo(node, moves) {
    node.visits = 0
    node.value = [0, 0];
    for(let i =0; i < moves.length; i++){
        node.childNodes[moves[i]].visits = 0;
        node.childNodes[moves[i]].value = [0, 0];
    }

    for (let i = 0; i < iterationsAnexo; i++) {
        anexo(node, moves);
    }
    // //==========================================
    let highestNode = {visits: -1};
    let hi = 0;
    for (let i = 0; i < moves.length; i++) {
        if (node.childNodes[moves[i]].visits > highestNode.visits) {
            highestNode = node.childNodes[moves[i]]
            hi = i;
        }
    }
    return moves[hi];
    //--------------------------------------------------------
}


function anexo(parentNode, moves) {
    let highest = -Infinity;
    let highestNode = null;
    for (let i = 0; i < moves.length; i++) {
        let thisNode = parentNode.childNodes[moves[i]];
        let childFormula = thisFormula(thisNode, parentNode.visits, randomnessAnexo)
        if (isNaN(childFormula) || childFormula > highest) {
            highestNode = thisNode;
            highest = childFormula
            if (isNaN(childFormula)) {
                break;
            }
        }
    }
    if (highestNode.winner) {
        parentNode.visits += 1;
        highestNode.visits += 1;
        sumValues(highestNode.value, highestNode.winner);
        sumValues(parentNode.value, highestNode.winner);
        return highestNode.winner //check winner copiar monte carlo crear funcion sacar de fusion
    }

    let result = thisMatch(highestNode, simulationAnexo);
    highestNode.visits += 1;
    parentNode.visits += 1;
    sumValues(highestNode.value, result);
    sumValues(parentNode.value, result);
    return result;
}

//--------------------------------------------------
function refill(nodeCopy) {
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
function simulationAnexo(nodeCopy) {
    // console.clear();
    // console.log(nodeCopy);
    // debugger;
    let selection = reordenar(nodeCopy.pozoNode);
    let ranSelected = selection[Math.floor(Math.random() * selection.length)]
    let opciones = optionsIA(nodeCopy.playersNode[nodeCopy.turnoNode], nodeCopy.pozoNode[ranSelected[0]][ranSelected[1]])
    let ranOptions = opciones[Math.floor(Math.random() * opciones.length)]
    let result = colocacionIA(nodeCopy, copyArray(ranSelected), ranOptions, fusionAnexo);
    if(nodeCopy.fusion){
        nodeCopy.turnoNode = nodeCopy.playersNode[0].inicial ? 0 : 1;
        nodeCopy.playersNode[0].inicial = false;
        nodeCopy.playersNode[1].inicial = false;
        nodeCopy.fusion = false;
    }
    if (!result) {
        return simulationAnexo(nodeCopy);
    } else {
        return result;
    }

}


function fusionAnexo(nodeCopy) {
    let termino = false; 
    for (let i = 0; i < Nplayers; i++) {
        let player = nodeCopy.playersNode[i];
        for (let j = 0; j < 5; j++) {
            if (player.piramide[j][j] != 0) {
                let chipColor = player.piramide[j][0];
                player.tablero[j][(chipColor - 1 + j) % 5] = chipColor;
                player.piramide[j][0] = 0;
                player.points += addPointsIA(player, j, (chipColor - 1 + j) % 5)[0]
                for (let k = 1; k < j + 1; k++) {
                    if(k != j) descarte.push(player.piramide[j][k])
                    player.piramide[j][k] = 0;
                }
            }
        }
        if (player.filas) termino = true;
        player.points += restar[player.trash]
        player.trash = 0;
        if (player.points < 0) player.points = 0;
    }
    if (termino) {
        for (let i = 0; i < Nplayers; i++) {
            let player = nodeCopy.playersNode[i];
            player.points += 7 * player.columnas
            player.points += 2 * player.filas
            player.points += 12 * player.colorido
        }
        let p0 = nodeCopy.playersNode[0]
        let p1 = nodeCopy.playersNode[1]
        if(p0.points > p1.points || (p0.points == p1.points && p0.filas > p1.filas)) return [1, 0];
        if(p0.points < p1.points || (p0.points == p1.points && p0.filas < p1.filas)) return [0, 1];
        return [0.5, 0.5];
    } else {
        refill(nodeCopy);
        nodeCopy.fusion = true;
        return false;
    }
}


//--------------------------------------------------




function coutMatrix(array){
    let str = "";
    for(let i = 0; i < array.length; i++){
        str += "["
        for(let j = 0; j < array[i].length-1; j++){
            str += array[i][j] + ", ";
        }
        str += array[i][array[i].length-1]+ "]"
        if(i + 1 != array.length) str += "\n";
    }
    console.log(str);
}