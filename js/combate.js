let partidos;
// partidos = [267, 233];          // empezar vs no empezar
//----------------------------------------------------------------------------------------
// partidos = [421.5, 478.5];      //bonusInicial: 2.5 vs 3
// partidos = [90, 90];            //bonusInicial: 3 vs 4
// partidos = [145.5, 154.5];      //bonusInicial: 3 vs 3.5
// partidos = [158, 142];          //bonusInicial: 3.5 vs 4
//----------------------------------------------------------------------------------------
// partidos =[187, 213];           //bonuscolumna: [0,0,0,0,0] vs [0, 0.5, 1, 0.5, 0];
// partidos =[204.5, 195.5];       //bonuscolumna: [0, 0.5, 1, 0.5, 0]; vs [0, 1, 1.5, 1, 0];
// partidos =[209.5, 190.5];       //bonuscolumna: [0, 0.5, 1, 0.5, 0]; vs [0, 0.75, 1.25, 0.75, 0];
//----------------------------------------------------------------------------------------
// partidos = [182.5, 217.5];      //best_highest: 1 vs 2 
// partidos = [113.5, 86.5];       //best_highest: 1 vs 1.5
// partidos = [139.5, 160.5];      //best_highest: 0.5 vs 1
// partidos = [202.5, 197.5];      //best_highest: 2 vs 3
// partidos = [432.5, 467.5];      //best_highest: 2 vs 2.3
// partidos = [188.5, 211.5];      //best_highest: 1 vs 2(rehecho por miedo a cambios)
//----------------------------------------------------------------------------------------
// partidos = [137.5, 162.5];      //withEnAdd false vs true
//----------------------------------------------------------------------------------------
// partidos = [88.5, 111.5];       //sinplus vs conplus(3-4-5)
// partidos = [242, 258];          //plusValues: [2,3,2]; vs [3,4,3];
// partidos = [183.5, 216.5];      //plusValues: [2,3,2]; vs [2.5,3.5,2.5];//
// partidos = [202, 198];          //plusValues: [2,3,2]; vs [2,4,2];//
// partidos = [202, 198];          //plusValues: [2.5,3.5,2.5]; vs [3,3,3];//
// partidos = [105, 85];          //plusValues: [2.5,3.5,2.5]; vs [3,3,3];//
// partidos = [100, 100];          //plusValues: [2.5,3.5,2.5]; vs [2.5,2.5,3.5];//
// partidos = [149.5, 150.5];           //plusValues: [2.5,3.5,2.5]; vs [2,3,4];//
// partidos = [100, 85];          //plusValues: [2.5,3.5,2.5]; vs [2.5,3.5,4];//
// partidos = [282, 318];           //plusValues: [2.5,3.5,2.5]; vs [2, 3.5, 3];//
// partidos = [149.5, 150.5];           //plusValues: [1, 3.5, 3] vs [2, 3.5, 3];//
// partidos = [145, 155];           //plusValues: [1, 3.5, 3] vs [1.5, 3.5, 3];//
//----------------------------------------------------------------------------------------
// partidos = [77.5, 122.5];       //sincastigo vs concastigo
// partidos = [88.5, 111.5];       //castigo: [0.5, 1, 2, 3]; vs [0.5, 1, 4, 3];
// partidos = [135.5, 164.5];      //castigo: [0.5, 1, 4, 3]; vs [1, 2, 4, 3];
// partidos = [142.5, 157.5];      //castigo: [1, 2, 4, 3] vs [1.5, 2.5, 4.5, 3.5];
//  partidos = [281.5, 318.5];     //castigo: [1, 2, 4, 3] vs [1, 2.5, 4.5, 3];
//  partidos = [147.5, 152.5];     //castigo: [1.5, 2.5, 4.5, 3.5] vs [1, 2.5, 4.5, 3];
//  partidos = [197.5, 202.5];     //castigo: [1, 2.5, 4.5, 4.5] vs [1, 2.5, 4.5, 3];
//  partidos = [204.5, 195.5];     //castigo: [1.5, 3, 5, 4] vs [1, 2.5, 4.5, 3];
//  partidos = [100, 70];          //castigo: [1.5, 3, 5, 4] vs [2, 4, 6, 4.5];
//  partidos = [201, 199];         //castigo: [1.5, 3, 5, 4] vs [1.5, 3, 5, 5];
//  partidos = [192.5, 207.5];     //castigo: [1.5, 3, 5, 4] vs [2, 3, 4, 5];
//----------------------------------------------------------------------------------------
// partidos = [77, 123];           //plus por determinada fila: 0 vs 1/2(with)
// partidos = [183.5, 216.5];      //plus por determinada fila: 1/2 vs 1(with)
// partidos = [202, 198];          //plus por determinada fila: 1/2 vs 0.75(with)
// partidos = [104, 96];           //plus por determinada fila: 1 vs 2(with)
// partidos = [99, 101];           //plus por determinada fila: 1 vs 1.5(with)
//----------------------------------------------------------------------------------------
// partidos = [531, 406];          //randomness2: 50 vs 100
// partidos = [150.5, 149.5];      //randomness2: 1 vs 50
// partidos = [112, 188];          //randomness2: 1 vs 25
// partidos = [54.5, 45.5];        //randomness2: 15 vs 25
// partidos = [175, 125];          //randomness2: 6.25 vs 14
// partidos = [111.5, 123.5];      //randomness2: 6.25 vs 12.5
// partidos = [196.5, 203.5];      //randomness2: 6.25 vs 9.375
//  partidos = [308.5, 291.5];     //randomness2: 7.8125 vs 10.9375
//partidos = [157, 143];           //randomness2: 7.8125 vs 12.5
//partidos = [320, 280];           //randomness2: 7.8125 vs 9
//partidos = [304, 296];           //randomness2: 7.8125 vs 8
//partidos = [147.5, 152.5];       //randomness2: 6.5 vs 7.8125
//partidos = [144.5, 155.5];       //randomness2: 7 vs 7.8125
//partidos = [322, 278];           //randomness2: 7.5 vs 7.8125
//-----------------------------------------------------------
//partidos = [146.5, 153.5];       //disponible: 5 vs 10
//partidos = [161, 139];           //disponible: 8 vs 10
//-----------------------------------------------------------
if (partidos == undefined) {
    partidos = [0, 0];
}
//-----------------------------------------------------------
let times = 300;
times += partidos[0] + partidos[1]
setTimeout(function () {
    let initialTime = new Date();
    console.log("procesando primer partido...")
    for (let i = partidos[0] + partidos[1]; i < times; i++) {
        while (!endGame) {
            if (turno == 0) {
                randomness2 = 7.5; 
                manageCharly2();
            } else {
                randomness2 = 12; 
                manageCharly2();
            }
        }

        if (players[0].points > players[1].points) {
            partidos[0]++;
        } else if (players[0].points == players[1].points) {
            if (players[0].filas > players[1].filas) {
                partidos[0]++;
            } else if (players[0].filas < players[1].filas) {
                partidos[1]++;
            } else {
                partidos[1] += 0.5;
                partidos[0] += 0.5;
            }
        } else {
            partidos[1]++;
        }
        console.clear()
        console.log('puntos jugador1:', players[0].points)
        console.log('puntos jugador2:', players[1].points)
        console.log("---------------------------------------------------")
        resetMatch((i + 1) % 2);
        console.log("Partidos Jugados:", (partidos[0] + partidos[1]))
        console.log("Partidos Restantes:", (times - partidos[0] - partidos[1]))
        console.log("---------------------------------------------------")
        console.log("jugador1 gano", partidos[0], "// es un:", ((partidos[0] / (partidos[0] + partidos[1])) * 100).toFixed(2) + "%")
        console.log("jugador2 gano", partidos[1], "// es un:", ((partidos[1] / (partidos[0] + partidos[1])) * 100).toFixed(2) + "%")
        console.log("---------------------------------------------------")
        console.log("procesando proximo partido...")
        let timeNow = new Date();
        console.log("Esta accion demoro", Math.floor((timeNow - initialTime) / 60000), "minutos y", Math.floor(((timeNow - initialTime) % 60000) / 1000), "segundos.")
    }
    variation(times)
    console.log("[" + partidos[0] + ', ' + partidos[1] + "];                        ")
}, 5000)

function resetMatch(newTurn) {
    endGame = false;
    fichas = [];
    descarte = [];
    pozo = [
        []
    ];
    // prePotencial = []
    // for (let i = 0; i < Nplayers; i++) {
    //     prePotencial.push([])
    //     for (let j = 0; j < 5; j++) {
    //         prePotencial[i].push([])
    //         for (let k = 0; k < 5; k++) {
    //             prePotencial[i][j].push(1)
    //         }
    //     }
    // }
    prePotencial2 = [25, 25, 25, 25] //si juega manager2
    prePotencial = [25, 25, 25, 25] //si juega manager2
    turno = newTurn;
    for (let i = 0; i < Nholders; i++) {
        pozo.push([])
        for (let j = 0; j < 4; j++) {
            pozo[i].push(0);
        }
    }
    players = boardCreator();
}

function variation(studies) {
    let highest = 0;
    for (let i = 0; i < 1E6; i++) {
        let picked = [0, 0]
        for (let j = 0; j < studies; j++) {
            picked[Math.floor(Math.random() * 2)]++;
        }
        if (picked[0] > picked[1]) {
            if (picked[0] / studies > highest) {
                highest = picked[0] / studies;
            }
        } else {
            if (picked[1] / studies > highest) {
                highest = picked[1] / studies;
            }
        }
    }
    console.log('el rango de seguridad es:', ((1 - highest) * 100).toFixed(2) + '% - ', (highest * 100).toFixed(2) + '%')
}