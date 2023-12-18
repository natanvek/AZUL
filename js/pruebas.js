let piramide1 = [
    [2],
    [2, 2],
    [3, 3, 0],
    [4, 4, 0, 0],
    [0, 0, 0, 0, 0]
]
let piramide2 = [
    [0],
    [0, 0],
    [0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0, 0]
]

// let piramide0 = [[3],[2,2],[1,1,0],[0,0,0,0],[4,4,4,0,0]]
let tablero1 = [
    [0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0]
]

let nodeCopyTry = {
    playersNode: [],
    descarteNode: [],
}
let popo1 = []
popo1.push(new player())
popo1.push(new player())
nodeCopyTry.playersNode.push(new copyPlayer(popo1[0]))
nodeCopyTry.playersNode.push(new copyPlayer(popo1[1]))
nodeCopyTry.playersNode[0].piramide = piramide1
nodeCopyTry.playersNode[1].piramide = piramide2
nodeCopyTry.playersNode[0].tablero = tablero1
nodeCopyTry.playersNode[1].tablero = copyArray(tablero1)
nodeCopyTry.playersNode[0].prePotencial = [[1,1,1,1,1],[1,1,1,1,1],[1,1,1,1,1],[1,1,1,1,1],[1,1,1,1,1]]
console.log(fusionIA(nodeCopyTry))