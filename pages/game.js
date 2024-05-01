//A garder pour l'inspi. (utilisation coo)
//topof=document.getElementById("game_map").getBoundingClientRect().top;
//leftof=document.getElementById("game_map").getBoundingClientRect().left;
//console.log("top : " +topof, " and left : " +leftof);
//document.elementsFromPoint(leftof , topof)[0].style.fill = "rgb(20, 100, 100)";

//generate rooms and paths in bounds of mpos x mpos
//generate a random number of rooms

export default async function Game() {
    let canvasGame = document.getElementById("canvass");
    let canvasCharacter = document.getElementById("characters");
    let canvasUI = document.getElementById("ui");
    let normMapSize = 3000;
    let size = 54;
    let mPos = Math.floor(normMapSize / size);
    let canvasSIZE = 1000;
    let viewZoom = 10;


    let equiped = {
        weapon: null,
        armor: {
            name: "Clothes",
            armor: 0
        }
    }

    class Team {
        constructor(name, allies) {
            this.name = name;
            this.allies = allies;
        }
    }

    // player structure
    let player = {
        posX: 0,
        posY: 0,
        hp: 0,
        maxHp: 0,
        skills: [],
        defense: 0,
        attackPower: 0,
        gotHit: false,
        level: 0,
        xp: 0,
        xpToNextLevel: 0,
        xpMultiplier: 0,
        gold: 0,
        inventory: [],
        affected: [],
        equipped: equiped,
        spriteSheet: new Image(),
        spriteDirection: Int8Array.from([0, 0]),
        // color: "rgb(0, 0, 255)",
    }

    let team = new Team("The basics", []);


    if (document.getElementById("pseudo") !== null) {
        player.name = document.getElementById("pseudo").innerText;
    }

    class Enemy {
        constructor(name, posX, posY, dir, enemySpriteSheet, hp, maxHp, attack, defense, range, level, affected, xp, xpToNextLevel, xpMultiplier, gold, inventory, equipped, color) {
            this.name = name;
            this.posX = posX;
            this.posY = posY;
            this.dir = dir;
            this.enemySpriteSheet = enemySpriteSheet;
            this.hp = hp;
            this.maxHp = maxHp;
            this.attack = attack;
            this.defense = defense;
            this.range = range;
            this.level = level;
            this.affected = affected;
            this.gotHit = false;
            this.hasAttacked = false;
            this.xp = xp;
            this.xpToNextLevel = xpToNextLevel;
            this.xpMultiplier = xpMultiplier;
            this.gold = gold;
            this.inventory = inventory;
            this.equipped = equipped;
            this.color = color;
        }
    }

    class Projectile {
        constructor(name, owner, posX, posY, direction, damage, additionalDamage, duration, numberOfChildren, lifetime, color) {
            this.name = name;
            this.owner = owner;
            this.posX = posX;
            this.posY = posY;
            this.direction = direction;
            this.damage = damage;
            this.additionalDamage = additionalDamage;
            this.duration = duration;
            this.numberOfChildren = numberOfChildren; //up right down left
            this.lifetime = lifetime;
            this.color = color; //? to be sprite
        }
    }

    class Item {
        constructor(name, damage, speed, self, effects, sprite, SSposX, SSposY, SSsize) {
            this.name = name;
            this.damage = damage;
            this.speed = speed;
            this.self = self;
            this.effects = effects;
            this.spriteSheet = sprite;
            this.SSposX = SSposX;
            this.SSposY = SSposY;
            this.SSsize = SSsize;
        }
    }

    let exit = {
        posX: 0,
        posY: 0,
        color: "rgb(255, 0, 255)",
    }

    let projects = [
        {
            name: "Simu Multiplayer VR UNITY", posX: 0, posY: 0, color: "rgba(255, 255, 0, 1)", link: "https://github.com/Louis-de-Lavenne-de-Choulot/ALGOSUP_2022_Project_4_F"
        },
        {
            name: "Application de Management", posX: 0, posY: 0, color: "rgba(255, 0, 100, 1)", link: ""
        },
        {
            name: "Synthetiseur musique - F#", posX: 0, posY: 0, color: "rgba(25, 205, 100, 1)", link: "https://github.com/ClementCaton/ALGOSUP_2022_Project_3_A"
        },
        {
            name: "Sites web clients Wordpress", posX: 0, posY: 0, color: "rgba(255, 100, 150, 1)", link: "https://annepouraud.fr/"
        },
        {
            name: "Site web de EURO WEB PARTNERS", posX: 0, posY: 0, color: "rgba(0, 100, 255, 1)", link: "https://ewp.fr/"
        },
        {
            name: "Serveur ultra sécurisé - Go compilé", posX: 0, posY: 0, color: "rgba(255, 102, 255, 1)", link: "https://github.com/Louis-de-Lavenne-de-Choulot/Go-server"
        },
        {
            name: "Personal AI (reproduction d'Alexa++) - Go", posX: 0, posY: 0, color: "rgba(205, 100, 100, 1)", link: "https://github.com/Louis-de-Lavenne-de-Choulot/Personal-AI"
        },
        {
            name: "LIMITLESS jeu PC/VR UNITY", posX: 0, posY: 0, color: "rgba(105, 100, 150, 1)", link: "https://github.com/BrendonDesvaux/Limitless"
        },
        {
            name: "Article VPN dans Programmez", posX: 0, posY: 0, color: "rgba(225, 190, 80, 1)", link: "/pdf/Prog.pdf"
        },
        {
            name: "C# Light ORM", posX: 0, posY: 0, color: "rgba(165, 240, 15, 1)", link: "https://github.com/Louis-de-Lavenne-de-Choulot/LORM"
        }
    ]

    let roomStruct = {
        wallColor: "rgb(10, 10, 10)",
        floorColor: "rgb(120, 170, 80)",
        corridorColor: "rgb(200, 200, 200)",
        exitColor: exit.color,
        wallTiles: [],
        floorTiles: [],
    }

    let floornumber = 1;
    // array of enemy objects
    let enemies = [];
    // array of items
    let items = [];
    // array of projectiles
    let projectiles = [];

    let floorEnemies = [];
    let floorItems = [];

    let rooms = [];

    let nFloor = false;
    let stopInputs = false;
    // multi dimensional array to store all the positions of the rooms
    let usedPosBounds = [];
    // layerBG is a multi dimensional of mPos x mPos
    let layerBG = [];
    for (let i = 0; i <= mPos; i++) {
        layerBG[i] = new Uint8Array(mPos + 1);
    }

    // size is same as layerBG size with 0s everywhere
    let layerItems = [];
    // size is same as layerBG size with 0s everywhere
    let layerCharacters = [];

    let notifBoxDrawn = false;
    let closeNotifCtdwn = 0;

    let atlasCols = 5;
    let atlasRows = 5;
    let tileSizeMap = 32;

    let ctx;
    let ctxchar;
    let ctxui;
    let maxH;
    let startH;
    let drawHeight;
    let drop = 25;
    let UIMODE = 0;

    const tileAtlas = new Image();
    tileAtlas.src = 'image/maps/tileset.png'

    let cursorOptions = 0;
    const teamOptions = team.allies;
    // const otherOptions = [["Save", save()], ["Quit", quit()]];
    const menuOptions = [
        ["Moves", player.skills],
        ["Items", player.inventory],
        ["Team", teamOptions],
        ["Pick up", pickUp],
        ["Rest", rest]
    ]; //, ["Others", otherOptions]
    let currentOptions = menuOptions;

    //get the number of enemies
    let InFloor;

    var audio = new Audio('/gameSound/magicSchool.ogg');

    let allItems;
    let armors;
    let allEnemies;
    let effects;
    let floors;
    let skills;
    let characters;
    let action_in_progress = false;

    await fetch('/gameLogic/items.json')
        .then(response => response.json())
        .then(data => {
            allItems = data;
        }
        );

    // Fetch the armors.json file
    await fetch('/gameLogic/armors.json')
        .then(response => response.text())
        .then(data => {
            armors = JSON.parse(data);
        });

    // Fetch the enemies.json file
    await fetch('/gameLogic/enemies.json')
        .then(response => response.json())
        .then(data => {
            allEnemies = data;
        });

    // Fetch the effects.json file
    await fetch('/gameLogic/effects.json')
        .then(response => response.json())
        .then(data => {
            effects = data;
        });

    // Fetch the floors.json file
    await fetch('/gameLogic/floors.json')
        .then(response => response.json())
        .then(data => {
            floors = data;
        });

    // Fetch the skills.json file
    await fetch('/gameLogic/skills.json')
        .then(response => response.json())
        .then(data => {
            skills = data;
        });

    // Fetch the characters.json file
    await fetch('/gameLogic/characters.json')
        .then(response => response.json())
        .then(data => {
            characters = data;
        });


    ctx = canvasGame.getContext('2d');
    ctx.imageSmoothingEnabled = false;
    ctx.canvas.width = canvasSIZE;
    ctx.canvas.height = canvasSIZE;
    ctxchar = canvasCharacter.getContext('2d');
    ctxchar.imageSmoothingEnabled = false;
    ctxchar.canvas.width = canvasSIZE;
    ctxchar.canvas.height = canvasSIZE;
    ctxchar.willReadFrequently = true;
    ctxui = canvasUI.getContext('2d');
    ctxui.imageSmoothingEnabled = false;
    ctxui.canvas.width = canvasSIZE;
    ctxui.canvas.height = canvasSIZE;
    ctxui.willReadFrequently = true;
    maxH = canvasGame.height - 50;
    startH = canvasGame.height - 200;
    drawHeight = canvasGame.height - 200;
    generateRooms();

    function characterLoader(character) {
        //load player
        let chara = Object.values(characters).find(obj => obj.name === character);
        player.hp = chara.hp;
        player.maxHp = chara.maxHp;
        for (let i = 0; i < chara.skills.length; i++) {
            let skill = Object.values(skills).find(obj => obj.name === chara.skills[i]);
            player.skills.push([skill.name, attack, structuredClone(skill)]);
        }
        menuOptions[0][1] = player.skills;
        player.defense = chara.defense;
        player.attackPower = chara.attackPower;
        player.level = chara.level;
        player.xp = chara.xp;
        player.xpToNextLevel = chara.xpToNextLevel;
        player.xpMultiplier = chara.xpMultiplier;
        player.gold = chara.gold;
        player.inventory = chara.inventory;
        player.spriteSheet.src = chara.spriteSheet;
        player.gotHit = false;
    }

    // tutorial text into tiles
    // emulator like on phone
    // treasure chest download cv
    // add a menu to select the character

    function generateRooms() {
        let roomNumber = Math.floor(Math.random() * 20) + 10;
        for (let i = 0; i < roomNumber; i++) {
            let roomX = Math.floor(Math.random() * 11) + 5;
            let roomY = Math.floor(Math.random() * 11) + 5;
            rooms.push([roomX, roomY]);
        }
    }

    function drawRooms() {
        //start from the top left and move randomly in places without rooms
        for (let i = 0; i < rooms.length; i++) {
            //room sizes
            let sizeX = rooms[i][0];
            let sizeY = rooms[i][1];
            // posX and posY are the top and left points
            let posX = Math.floor(Math.random() * (mPos - sizeX));
            let posY = Math.floor(Math.random() * (mPos - sizeY));

            //check if the room is in bounds and if it is not in another room
            let inBounds = posX >= 0 && posX + sizeX <= mPos && posY >= 0 && posY - sizeY <= mPos;

            // check if room is overlapping
            let inRoom = false;
            for (let j = 0; j < usedPosBounds.length; j++) {
                if (checkOverlap(posX, posY, sizeX, sizeY, usedPosBounds[j][0], usedPosBounds[j][1], usedPosBounds[j][2], usedPosBounds[j][3])) {
                    inRoom = true;
                }
            }
            //if the room is in bounds and not in another room then draw it
            if (!inRoom && inBounds) {
                for (let j = 0; j <= sizeX; j++) {
                    for (let k = 0; k <= sizeY; k++) {
                        if (j === 0) {
                            layerBG[posX + j][posY + k] = 16;
                        } else if (j === sizeX) {
                            layerBG[posX + j][posY + k] = 17;
                        } else if (k === 0) {
                            layerBG[posX + j][posY + k] = 14;
                        } else if (k === sizeY) {
                            layerBG[posX + j][posY + k] = 15;
                        } else {
                            layerBG[posX + j][posY + k] = 2;
                        }
                    }
                }
                layerBG[posX][posY] = 10;
                layerBG[posX + sizeX][posY] = 11;
                layerBG[posX][posY + sizeY] = 12;
                layerBG[posX + sizeX][posY + sizeY] = 13;
                usedPosBounds.push(
                    [posX, posY, sizeX, sizeY]
                );
            }
        }
        if (usedPosBounds.length < 2) {
            rooms = [];
            usedPosBounds = [];
            layerBG = [];
            // initialize the layerBG
            for (let i = 0; i <= mPos; i++) {
                layerBG[i] = new Uint8Array(mPos + 1);
            }
            generateRooms();
            drawRooms();
        }
    }

    function checkOverlap(posX1, posY1, sizeX1, sizeY1, posX2, posY2, sizeX2, sizeY2) {
        // Calculate the boundaries of the first wall
        const left = posX1;
        const right = posX1 + sizeX1;
        const top = posY1;
        const bottom = posY1 + sizeY1;

        // Calculate the boundaries of the second wall
        const left2 = posX2;
        const right2 = posX2 + sizeX2;
        const top2 = posY2;
        const bottom2 = posY2 + sizeY2;

        // Check for overlap (check if exterior to logic)
        if (left >= right2 || left2 >= right || top >= bottom2 || top2 >= bottom) {
            // No overlap
            return false;
        } else {
            // Overlap
            return true;
        }
    }

    function drawCorridors() {
        for (let i = 0; i < usedPosBounds.length - 1; i++) {
            // find the center point of the first room
            let room1X = usedPosBounds[i][0] + Math.floor(usedPosBounds[i][2] / 2);
            let room1Y = usedPosBounds[i][1] + Math.floor(usedPosBounds[i][3] / 2);

            // find the center point of the second room
            let room2X = usedPosBounds[i + 1][0] + Math.floor(usedPosBounds[i + 1][2] / 2);
            let room2Y = usedPosBounds[i + 1][1] + Math.floor(usedPosBounds[i + 1][3] / 2);

            // calculate the direction and distance of the corridor
            const diffX = room2X - room1X;
            const diffY = room2Y - room1Y;
            const direction = Math.abs(diffX) > Math.abs(diffY) ? 'horizontal' : 'vertical';
            const length = direction === 'horizontal' ? diffX : diffY;

            // draw the corridor
            if (direction === 'horizontal') {
                //Step1
                for (let j = 0; j < Math.abs(length); j++) {
                    const x = diffX > 0 ? room1X + j : room1X - j;

                    if (j + 1 === Math.abs(length) && Math.abs(diffY) + 1 > 1) {
                        // y is the direction of the turn the corridor will take, if > 0 then the corridor will turn up, if < 0 then the corridor will turn down
                        const y = diffY > 0 ? room1Y - 1 : room1Y + 1;
                        // x2 is the direction of the turn the corridor will take, if > 0 then the corridor will turn right, if < 0 then the corridor will turn left
                        const x2 = diffX > 0 ? -1 : +1;
                        //add two more black squares to the end of the corridor on the sides opposite to the turn the corridor will take
                        if (layerBG[x - x2][y] === 0)
                            layerBG[x - x2][y] = diffY < 0 ? 15 : 14;
                        if (layerBG[x - x2 * 2][y] === 0)
                            layerBG[x - x2 * 2][y] = diffX < 0 ? (diffY < 0 ? 12 : 10) : (diffY < 0 ? 13 : 11);
                    }
                    // if the square is a room tile then skip it
                    if (layerBG[x][room1Y] === 2) {
                        continue;
                    }

                    // add the corridor tiles turn
                    if (layerBG[x][room1Y + 1] === 0)
                        layerBG[x][room1Y + 1] = 15;
                    if (layerBG[x][room1Y - 1] === 0)
                        layerBG[x][room1Y - 1] = 14;

                    // inside corridor tiles
                    layerBG[x][room1Y] = 3;
                }

                // move the x coordinate of the first room to the end of the corridor
                room1X += length;

                //Step2
                for (let j = 0; j < Math.abs(diffY) + 1; j++) {
                    const y = diffY > 0 ? room1Y + j : room1Y - j;
                    if (layerBG[room1X][y] === 2)
                        continue;
                    if (layerBG[room1X + 1][y] === 0)
                        layerBG[room1X + 1][y] = 17;
                    if (layerBG[room1X - 1][y] === 0)
                        layerBG[room1X - 1][y] = 16;
                    layerBG[room1X][y] = 3;
                }
            } else {
                //Step1
                for (let j = 0; j < Math.abs(length); j++) {
                    const y = diffY > 0 ? room1Y + j : room1Y - j;
                    if (j + 1 === Math.abs(length) && Math.abs(diffX) + 1 > 1) {
                        const x = diffX > 0 ? room1X - 1 : room1X + 1;
                        const y2 = diffY > 0 ? -1 : +1;

                        if (layerBG[x][y - y2] === 0)
                            layerBG[x][y - y2] = diffX < 0 ? 17 : 16;
                        if (layerBG[x][y - y2 * 2] === 0)
                            layerBG[x][y - y2 * 2] = diffY < 0 ? (diffX < 0 ? 11 : 10) : (diffX < 0 ? 13 : 12);
                    }
                    if (layerBG[room1X][y] === 2)
                        continue;
                    if (layerBG[room1X + 1][y] === 0)
                        layerBG[room1X + 1][y] = 17;
                    if (layerBG[room1X - 1][y] === 0)
                        layerBG[room1X - 1][y] = 16;
                    layerBG[room1X][y] = 3;
                }

                room1Y += length;
                //Step2
                for (let j = 0; j < Math.abs(diffX + 1); j++) {
                    const x = diffX > 0 ? room1X + j : room1X - j;
                    if (layerBG[x][room1Y] === 2)
                        continue;
                    if (layerBG[x][room1Y + 1] === 0)
                        layerBG[x][room1Y + 1] = 15;
                    if (layerBG[x][room1Y - 1] === 0)
                        layerBG[x][room1Y - 1] = 14;
                    layerBG[x][room1Y] = 3;
                }
            }
        }
    }

    async function dynamicDrawMenu(arrOptions) {
        ctxui.clearRect(0, 0, canvasGame.width, canvasGame.height);
        ctxui.fillStyle = "rgba(100, 100, 100, .5)";
        ctxui.strokeStyle = "rgba(50,50,50, .6)";
        ctxui.lineWidth = 4;
        ctxui.beginPath();
        //bottom panel
        ctxui.roundRect(canvasGame.width / 8, canvasGame.height - 200, (canvasGame.width / 8) * 6, 150, 5);
        //left panel
        ctxui.roundRect(canvasGame.width / 10, 60, (canvasGame.width / 4), canvasGame.height - 300, 5);
        //top panel
        ctxui.roundRect(canvasGame.width / 2.5, 80, canvasGame.width / 2, 50, 5);
        ctxui.fill();
        ctxui.stroke();
        ctxui.closePath();

        //draw bottom first
        // names  + hp + level
        let texts = [];

        let color = 'rgb(170, 170, 240)';
        ctxui.strokeStyle = "rgba(10,10,10, 1)";
        ctxui.lineWidth = .3;
        ctxui.globalAlpha = 1;
        ctxui.fillStyle = color;
        ctxui.font = "20px Arial";

        if (arrOptions === menuOptions) {
            texts.push(`${player.name}  ${player.hp}/${player.maxHp} Lvl${player.level}`);
            for (let i = 0; i < team.allies.length; i++) {
                texts.push(`${team.allies[i].name}  ${team.allies[i].hp}/${team.allies[i].maxHp} Lvl${team.allies[i].level}`);
            }
        } else if (arrOptions === player.skills && cursorOptions !== arrOptions.length) {
            let skill = player.skills[cursorOptions][2];
            let numbLines = Math.ceil(skill.effect.length / 48);
            if (numbLines > 5)
                ctxui.font = "15px Arial";

            texts.push(`${skill.pp}/${skill.maxPP}   range: ${skill.range}    acc: ${skill.accuracy}%`);
            let eff = skill.effect.split(" ")
            let buffer = "";
            for (let i = 0; i < eff.length; i++) {
                if (buffer.length + eff[i].length >= 45) {
                    texts.push(buffer);
                    buffer = "";
                }
                buffer += eff[i];
                if (i === eff.length - 1) {
                    texts.push(buffer);
                }
                buffer += " "
            }
        }
        let maxH = canvasGame.height - 200;
        let inc = 150 / (texts.length + 2);
        texts.forEach(txt => {
            maxH += inc;
            ctxui.fillText(txt, canvasGame.width / 8 + 20, maxH);
            ctxui.strokeText(txt, canvasGame.width / 8 + 20, maxH);
        })
        maxH += inc;
        //gold also in bottom part
        ctxui.fillText(`money: ${player.gold}`, canvasGame.width / 8 + 20, maxH);
        ctxui.strokeText(`money: ${player.gold}`, canvasGame.width / 8 + 20, maxH);

        //left part
        maxH = 60;
        inc = (canvasGame.height - 300) / (arrOptions.length + 2);
        for (let opt = 0; opt < arrOptions.length; opt++) {
            maxH += inc
            ctxui.fillText(arrOptions[opt][0], canvasGame.width / 10 + 20, maxH);
            ctxui.strokeText(arrOptions[opt][0], canvasGame.width / 10 + 20, maxH);
        }
        maxH += inc
        ctxui.fillText("back", canvasGame.width / 10 + 20, maxH);
        ctxui.strokeText("back", canvasGame.width / 10 + 20, maxH);

        //top part
        // ctxui.roundRect(canvasGame.width / 3,  80, canvasGame.width/2, 50, 5);
        ctxui.fillText(`Floor ${floornumber}`, canvasGame.width / 2.5 + canvasGame.width / 5, 110);
        ctxui.strokeText(`Floor ${floornumber}`, canvasGame.width / 2.5 + canvasGame.width / 5, 110);

        //add small orange triangle left side of left panel selected option
        ctxui.beginPath();
        // arrow points to the right > 
        ctxui.moveTo(canvasGame.width / 10 + 5, 60 + (cursorOptions + 1) * inc - 12);
        ctxui.lineTo(canvasGame.width / 10 + 5, 60 + (cursorOptions + 1) * inc + 2);
        ctxui.lineTo(canvasGame.width / 10 + 15, 60 + (cursorOptions + 1) * inc - 5);
        ctxui.closePath();
        ctxui.fillStyle = "rgb(255, 150, 0)";
        ctxui.fill();
        ctxui.lineWidth = .5;
        ctxui.stroke();
    }

    async function dynamicDrawNotifs() {
        drawHeight += drop;
        if (drawHeight >= maxH) {
            drawHeight = startH + drop;
            //get back to the canvas without the notifications
            ctxui.clearRect(canvasGame.width / 8, canvasGame.height - 200, (canvasGame.width / 8) * 6, 150);
            notifBoxDrawn = false;
        }
        if (!notifBoxDrawn) {
            ctxui.fillStyle = "rgba(100, 100, 100, .5)";
            ctxui.fillRect(canvasGame.width / 8, canvasGame.height - 200, (canvasGame.width / 8) * 6, 150);
            ctxui.strokeStyle = "rgba(50,50,50, .6)";
            ctxui.lineWidth = 4;
            ctxui.strokeRect(canvasGame.width / 8, canvasGame.height - 200, (canvasGame.width / 8) * 6, 150);
            notifBoxDrawn = true;
        }
        closeNotifCtdwn = 3;
    }

    async function drawNotif(txt, color) {
        ctxui.strokeStyle = "rgba(10,10,10, 1)";
        ctxui.lineWidth = .5;
        ctxui.globalAlpha = 1;
        ctxui.font = "bold 20px Arial";
        ctxui.fillStyle = color;
        ctxui.fillText(txt, canvasGame.width / 8 + 20, drawHeight);
        ctxui.fillText(txt, canvasGame.width / 8 + 20, drawHeight);
        ctxui.fillText(txt, canvasGame.width / 8 + 20, drawHeight);
        ctxui.strokeText(txt, canvasGame.width / 8 + 20, drawHeight);
    }

    async function drawUI() {
        let lifeBar = 150;
        ctxui.fillStyle = "rgba(230, 80, 0, 1)";
        ctxui.fillRect((canvasGame.width / 2 * 1.3), 5, lifeBar, 15);
        let healthBar = (lifeBar * player.hp) / player.maxHp;
        ctxui.fillStyle = "rgba(40, 200, 0, 1)";
        ctxui.fillRect((canvasGame.width / 2 * 1.3), 5, healthBar, 15);
        ctxui.strokeStyle = "rgb(50,50,50)";
        ctxui.lineWidth = 2;
        ctxui.strokeRect((canvasGame.width / 2 * 1.3), 5, lifeBar, 15);


        let text = `${floornumber}F Lvl${player.level}          HP ${player.hp}/${player.maxHp}`
        ctxui.fillStyle = "rgba(250, 250, 250, 1)";
        ctxui.font = "bold 20px Arial";
        ctxui.fillText(text, 30, 20);
        ctxui.strokeStyle = "rgb(50,50,50)";
        ctxui.lineWidth = 1;
        ctxui.strokeText(text, 30, 20);
    }

    async function animatedDrawMap() {
        let step = 0;
        let nFrame = 10;
        //next is the number of frames in an action
        for (let next = nFrame; next >= 0; next--) {

            let occurencecounter = [0, 0];

            // check player direction and update the animation direction accordingly. next will be the frame at which we are.
            let animoccur = player.spriteDirection[0] < 0 ? [0, -next / nFrame] : (player.spriteDirection[1] < 0 ? [-next / nFrame, 0] : (player.spriteDirection[1] > 0 ? [next / nFrame, 0] : [0, next / nFrame]));

            

            //temporary canvases
            let buffer = document.createElement("canvas");
            buffer.width = canvasGame.width;
            buffer.height = canvasGame.height;
            let bufferCtx = buffer.getContext("2d");
            bufferCtx.willReadFrequently = true;
            let enemiesCopy = enemies;

            let vz = viewZoom / 2; // center view on player (half the tiles on the right, half on the left)
            let posXminus = player.posX - vz < 0 ? 0 : player.posX - vz; // get the start position in X for the map, if negative then out of world (set to 0)
            let posYminus = player.posY - vz < 0 ? 0 : player.posY - vz; // get the start position in Y for the map, if negative then out of world (set to 0)
            let posXmax = player.posX + vz + 1 > mPos ? mPos : player.posX + vz + 1; // get the max position in X for the map, if greater than the map size then set to map size
            let posYmax = player.posY + vz + 1 > mPos ? mPos : player.posY + vz + 1; // get the max position in Y for the map, if greater than the map size then set to map size

            let sourceY = 0;
            let sourceX = 0;
            
            // if min X is  0 (start of map) then apply offset to max X equal to lost number of tiles on the left side. This is to even out the loss and gain on both sides
            if (posXminus === 0 && posXmax + vz - player.posX < mPos) { 
                posXmax += vz - player.posX;
            }
            // if min Y is 0 (start of map) then apply offset to max Y equal to lost number of tiles on the top side. This is to even out the loss and gain on both sides
            if (posYminus === 0 && posYmax + vz - player.posY < mPos) { // layerBG[posXmax].length 
                posYmax += vz - player.posY;
            }
            
            let canvaswidth = Math.floor(ctx.canvas.width / viewZoom) + 1; // +1 to avoid erasing last line if room is max sizeof map and avoid having no wall after the room
            let canvasheight = Math.floor(ctx.canvas.height / viewZoom) + 1; // same as above but for height

            let imgD = undefined;

            // TODO : a smaaaall bit of sprite is wrong, to fix.
            // ? INFO : this part is responsible to draw the left or top part of the map when moving right or down. it fixes a graphic bug
            // ?        For example a down movement: the top tile is gonna disappear bit by bit drawn on top by the one under that goes up.
            // ?        But then you take notice that it makes an unusual effect where it seems like it gets eaten because it does not go up itself.
            if (animoccur[0] > 0) {
                // imgD stands for image data, which is used to store the current canvas content that will just be re added with a padding to create the animation effect without recalculating.
                // we can do nFrame/next because we check > 0 above
                imgD = ctx.getImageData(canvaswidth * 1/ nFrame, 0, canvaswidth * nFrame/next,  ctx.canvas.height);
            } else if ( animoccur[1] > 0) {
                imgD = ctx.getImageData(0, canvasheight * 1/nFrame, ctx.canvas.width, canvasheight * nFrame/next);
            }



            // ? INFO : Clear Not needed because no drop of performance or ram usage difference were found between overdraw and clear then draw when tested.
            // // Clear the entire canvas
            // ctx.clearRect(0, 0, canvasGame.width, canvasGame.height);
            if (imgD !==  undefined) {
                ctx.putImageData(imgD, 0, 0);
            }

            // Clear the entire character canvas
            ctxchar.clearRect(0, 0, canvasGame.width, canvasGame.height);

            for (let i = posXminus; i < posXmax; i++) {
                for (let j = posYminus; j < posYmax; j++) {

                    //choose the sprite to draw based on the value in the layerBG array
                    switch (layerBG[i][j]) {
                        case 2:
                            sourceY = 32;
                            sourceX = 32;
                            break;
                        case 3:
                            sourceY = 32;
                            sourceX = 32;
                            break;
                        case 10:
                            sourceY = 0;
                            sourceX = 0;
                            break;
                        case 11:
                            sourceY = 0;
                            sourceX = 32 * 2;
                            break;
                        case 12:
                            sourceY = 32 * 2;
                            sourceX = 0;
                            break;
                        case 13:
                            sourceY = 32 * 2;
                            sourceX = 32 * 2;
                            break;
                        case 14:
                            sourceY = 0;
                            sourceX = 32;
                            break;
                        case 15:
                            sourceY = 32 * 2;
                            sourceX = 32;
                            break;
                        case 16:
                            sourceY = 32;
                            sourceX = 0;
                            break;
                        case 17:
                            sourceY = 32;
                            sourceX = 32 * 2;
                            break;
                        default:
                            sourceY = 32 * 2;
                            sourceX = 32 * 4;
                            break;
                    }

                    //draw the background
                    ctx.drawImage(tileAtlas, sourceX, sourceY, tileSizeMap, tileSizeMap, (animoccur[0] + occurencecounter[0]) * canvaswidth, (animoccur[1] + occurencecounter[1]) * canvasheight, canvaswidth, canvasheight);
                    
                    if (layerItems[i][j] !== undefined) {
                        let item = layerItems[i][j];
                        // the  + 0.04 is to add a slight offset to the item position to avoid overlapping on other tiles
                        ctxchar.drawImage(item.spriteSheet, item.SSposX, item.SSposY, item.SSsize, item.SSsize, (animoccur[0] + occurencecounter[0] + 0.04*i/posXmax) * canvaswidth, (animoccur[1] + occurencecounter[1] + 0.04*j/posYmax) * canvasheight, canvaswidth, canvasheight);
                    }
                    if (layerCharacters[i][j] !== undefined) {
                        if (layerCharacters[i][j] === 1) {
                            sourceY = player.spriteDirection[0] < 0 ? 32 * 3 : (player.spriteDirection[1] < 0 ? 32 : (player.spriteDirection[1] > 0 ? 32 * 2 : 0));
                            if (next % 3 === 0 && next !== 0)
                                step = next / 3;
                            if (step > 2)
                                step = 0;
                            sourceX = step * 32;

                            //draw small green circle of low opacity on the tile
                            //add the circle without interior but with border
                            ctxchar.fillStyle = "rgba(0, 0, 0, 0)";
                            ctxchar.beginPath();
                            //add stroke circle
                            ctxchar.arc((occurencecounter[0] + 0.02) * canvaswidth + canvaswidth / 2, (occurencecounter[1] + 0.5) * canvasheight + canvasheight / 4, canvaswidth / 4.5, 0, 2 * Math.PI);
                            ctxchar.lineWidth = 2;
                            ctxchar.strokeStyle = "rgba(0, 255, 0, 0.5)";
                            ctxchar.stroke();
                            ctxchar.fill();
                            ctxchar.closePath();
                            ctxchar.drawImage(player.spriteSheet, sourceX, sourceY, tileSizeMap, tileSizeMap, occurencecounter[0] * canvaswidth, (occurencecounter[1] - 0.1) * canvasheight, canvaswidth, canvasheight);

                            if (player.gotHit) {
                                const imageData = ctxchar.getImageData(occurencecounter[0] * canvaswidth, (occurencecounter[1] - 0.1) * canvasheight, canvaswidth, canvasheight);
                                const data = imageData.data;
                                for (let i = 0; i < data.length; i += 4) {
                                    data[i] = 255;
                                }
                                ctxchar.putImageData(imageData, occurencecounter[0] * canvaswidth, (occurencecounter[1] - 0.1) * canvasheight);
                                player.gotHit = false;
                            }


                        } else {
                            //get enemy from enemies by id
                            let enemy = layerCharacters[i][j];
                            sourceY = enemy.dir === 0 ? 0 : (enemy.dir === 1 ? 32 : (enemy.dir === 2 ? 32 * 2 : 32 * 3));
                            sourceX = 0; //!TEMP for animations change to continuous
                            enemy.dir = 0;


                            ctxchar.fillStyle = "rgba(0, 0, 0, 0)";
                            ctxchar.beginPath();
                            //add stroke circle
                            ctxchar.arc((occurencecounter[0] + 0.02) * canvaswidth + canvaswidth / 2, (occurencecounter[1] + 0.5) * canvasheight + canvasheight / 4, canvaswidth / 4.5, 0, 2 * Math.PI);
                            ctxchar.lineWidth = 2;
                            ctxchar.strokeStyle = "rgba(255, 0, 0, 0.5)";
                            ctxchar.stroke();
                            ctxchar.fill();
                            ctxchar.closePath();

                            ctxchar.drawImage(enemy.enemySpriteSheet, sourceX, sourceY, tileSizeMap, tileSizeMap, occurencecounter[0] * canvaswidth, (occurencecounter[1] - 0.1) * canvasheight, canvaswidth, canvasheight);
                            let gotHit = false;
                            //I REALLY NEED LAYER CHARA TO POINT TO ENEMY, THE FOLLOWING CODE IS BLERGH INEFFICIENT
                            for (let z = 0; z < enemiesCopy.length; z++) {
                                if (enemiesCopy[z].posX === i && enemiesCopy[z].posY === j) {
                                    gotHit = enemiesCopy[z].gotHit;
                                    enemiesCopy[z].gotHit = false;
                                    // enemiesCopy.splice(z, 1);
                                    break;
                                }
                            }
                            if (gotHit) {
                                const imageData = ctxchar.getImageData(occurencecounter[0] * canvaswidth, (occurencecounter[1] - 0.1) * canvasheight, canvaswidth, canvasheight);

                                const data = imageData.data;
                                for (let i = 0; i < data.length; i += 4) {
                                    data[i] = 255;
                                }
                                ctxchar.putImageData(imageData, occurencecounter[0] * canvaswidth, (occurencecounter[1] - 0.1) * canvasheight);
                                enemy.gotHit = false;
                            }
                        }
                    }

                    for (let xAdd = posXmax - posXminus; xAdd < parseInt(canvasGame.style.width) / 32; xAdd++) {
                        bufferCtx.drawImage(tileAtlas, 32 * 4, 32 * 2, tileSizeMap, tileSizeMap, xAdd * canvaswidth, (animoccur[1] + occurencecounter[1]) * canvasheight, canvaswidth, canvasheight);
                    }

                    occurencecounter[1]++;
                }

                for (let yAdd = posYmax - posYminus; yAdd < parseInt(canvasGame.style.height) / 32; yAdd++) {
                    ctx.drawImage(tileAtlas, 32 * 4, 32 * 2, tileSizeMap, tileSizeMap, (animoccur[0] + occurencecounter[0]) * canvaswidth, yAdd * canvasheight, canvaswidth, canvasheight);

                    for (let xAdd = posXmax - posXminus; xAdd < parseInt(canvasGame.style.width) / 32; xAdd++) {
                        ctx.drawImage(tileAtlas, 32 * 4, 32 * 2, tileSizeMap, tileSizeMap, xAdd * canvaswidth, yAdd * canvasheight, canvaswidth, canvasheight);
                    }
                }
                // because it's stylish
                if (document.getElementById("stylish").checked) {
                    await new Promise(r => setTimeout(r, document.getElementById("myRange").value));
                }
                occurencecounter[1] = 0;
                occurencecounter[0]++;
            }
            ctx.drawImage(buffer, 0, 0);

            drawUI();
            await new Promise(r => setTimeout(r, 25));
        }
        player.spriteDirection = [0, 0];
        
        action_in_progress = false;
    }

    async function drawMap() {
        // sourceY = player.spriteDirection[0] < 0 ? 32 * 3 : (player.spriteDirection[1] < 0 ? 32 : (player.spriteDirection[1] > 0 ? 32 * 2 : 0));
        let occurencecounter = [0, 0];

        let buffer = document.createElement("canvas");
        buffer.width = canvasGame.width;
        buffer.height = canvasGame.height;
        let bufferCtx = buffer.getContext("2d");
        bufferCtx.imageSmoothingEnabled = false;
        bufferCtx.willReadFrequently = true;
        let enemiesCopy = enemies;


        // Clear the entire canvas
        ctx.clearRect(0, 0, canvasGame.width, canvasGame.height);
        // Clear the entire canvas
        ctxchar.clearRect(0, 0, canvasGame.width, canvasGame.height);

        let vz = viewZoom / 2; //number of tiles on each side of the player
        let posXminus = player.posX - vz < 0 ? 0 : player.posX - vz;
        let posYminus = player.posY - vz < 0 ? 0 : player.posY - vz;
        let posXmax = player.posX + vz + 1 > mPos ? mPos : player.posX + vz + 1;
        let posYmax = player.posY + vz + 1 > mPos ? mPos : player.posY + vz + 1; //layerBG[posXmax].length = mPos

        let sourceY = 0;
        let sourceX = 0;

        if (posXminus === 0 && posXmax + vz - player.posX < mPos) {
            posXmax += vz - player.posX;
        }
        if (posYminus === 0 && posYmax + vz - player.posY < mPos) { // layerBG[posXmax].length 
            posYmax += vz - player.posY;
        }
        let canvaswidth = Math.floor(ctx.canvas.width / viewZoom) + 1; //+1 to avoid erasing last line if room is max sizeof map
        let canvasheight = Math.floor(ctx.canvas.height / viewZoom) + 1;

        for (let i = posXminus; i < posXmax; i++) {
            for (let j = posYminus; j < posYmax; j++) {
                switch (layerBG[i][j]) {
                    case 2:
                        sourceY = 32;
                        sourceX = 32;
                        break;
                    case 3:
                        sourceY = 32;
                        sourceX = 32;
                        break;
                    case 10:
                        sourceY = 0;
                        sourceX = 0;
                        break;
                    case 11:
                        sourceY = 0;
                        sourceX = 32 * 2;
                        break;
                    case 12:
                        sourceY = 32 * 2;
                        sourceX = 0;
                        break;
                    case 13:
                        sourceY = 32 * 2;
                        sourceX = 32 * 2;
                        break;
                    case 14:
                        sourceY = 0;
                        sourceX = 32;
                        break;
                    case 15:
                        sourceY = 32 * 2;
                        sourceX = 32;
                        break;
                    case 16:
                        sourceY = 32;
                        sourceX = 0;
                        break;
                    case 17:
                        sourceY = 32;
                        sourceX = 32 * 2;
                        break;
                    default:
                        sourceY = 32 * 2;
                        sourceX = 32 * 4;
                        break;
                }

                //draw the background
                ctx.drawImage(tileAtlas, sourceX, sourceY, tileSizeMap, tileSizeMap, occurencecounter[0] * canvaswidth, occurencecounter[1] * canvasheight, canvaswidth, canvasheight);
                if (layerItems[i][j] !== undefined) {
                    let item = layerItems[i][j];
                    ctxchar.drawImage(item.spriteSheet, item.SSposX, item.SSposY, item.SSsize, item.SSsize, (occurencecounter[0] + 0.04) * canvaswidth, (occurencecounter[1] + 0.04) * canvasheight, canvaswidth, canvasheight);
                }
                if (layerCharacters[i][j] !== undefined) {
                    if (layerCharacters[i][j] === 1) {
                        sourceY = player.spriteDirection[0] < 0 ? 32 * 3 : (player.spriteDirection[1] < 0 ? 32 : (player.spriteDirection[1] > 0 ? 32 * 2 : 0));
                        sourceX = 0

                        //draw small green circle of low opacity on the tile
                        //add the circle without interior but with border
                        ctxchar.fillStyle = "rgba(0, 0, 0, 0)";
                        ctxchar.beginPath();
                        //add stroke circle
                        ctxchar.arc((occurencecounter[0] + 0.02) * canvaswidth + canvaswidth / 2, (occurencecounter[1] + 0.5) * canvasheight + canvasheight / 4, canvaswidth / 4.5, 0, 2 * Math.PI);
                        ctxchar.lineWidth = 2;
                        ctxchar.strokeStyle = "rgba(0, 255, 0, 0.5)";
                        ctxchar.stroke();
                        ctxchar.fill();
                        ctxchar.closePath();
                        ctxchar.drawImage(player.spriteSheet, sourceX, sourceY, tileSizeMap, tileSizeMap, occurencecounter[0] * canvaswidth, (occurencecounter[1] - 0.1) * canvasheight, canvaswidth, canvasheight);

                        if (player.gotHit) {
                            const imageData = ctxchar.getImageData(occurencecounter[0] * canvaswidth, (occurencecounter[1] - 0.1) * canvasheight, canvaswidth, canvasheight);
                            const data = imageData.data;
                            for (let i = 0; i < data.length; i += 4) {
                                data[i] = 255;
                            }
                            ctxchar.putImageData(imageData, occurencecounter[0] * canvaswidth, (occurencecounter[1] - 0.1) * canvasheight);
                            player.gotHit = false;
                        }
                    }
                }
                // else if (layerItems[i][j] !== undefined) {
                //     let item = layerItems[i][j];
                //     bufferCtx.drawImage(item.spriteSheet, 0, 0, 16, 16, occurencecounter[0]* canvaswidth,occurencecounter[1]* canvasheight, canvaswidth, canvasheight);
                // }

                for (let xAdd = posXmax - posXminus; xAdd < parseInt(canvasGame.style.width) / 32; xAdd++) {
                    bufferCtx.drawImage(tileAtlas, 32 * 4, 32 * 2, tileSizeMap, tileSizeMap, xAdd * canvaswidth, occurencecounter[1] * canvasheight, canvaswidth, canvasheight);
                }

                occurencecounter[1]++;
            }

            for (let yAdd = posYmax - posYminus; yAdd < parseInt(canvasGame.style.height) / 32; yAdd++) {
                ctx.drawImage(tileAtlas, 32 * 4, 32 * 2, tileSizeMap, tileSizeMap, occurencecounter[0] * canvaswidth, yAdd * canvasheight, canvaswidth, canvasheight);

                for (let xAdd = posXmax - posXminus; xAdd < parseInt(canvasGame.style.width) / 32; xAdd++) {
                    ctx.drawImage(tileAtlas, 32 * 4, 32 * 2, tileSizeMap, tileSizeMap, xAdd * canvaswidth, yAdd * canvasheight, canvaswidth, canvasheight);
                }
            }
            // because it's stylish
            if (document.getElementById("stylish").checked) {
                await new Promise(r => setTimeout(r, document.getElementById("myRange").value));
            }
            occurencecounter[1] = 0;
            occurencecounter[0]++;
        }
        ctx.drawImage(buffer, 0, 0);

        drawUI();

        player.spriteDirection = [0, 0];


    }

    function spawn(avoid, player) {
        //get the number of rooms
        let roomNumber = usedPosBounds.length;
        //get a random room
        let room = Math.floor(Math.random() * roomNumber);
        if (avoid !== undefined && room === avoid) {
            if (room === 0) {
                room++;
            } else {
                room--;
            }
        };
        let pos = getPointInRoom(room);
        return [pos[0], pos[1], room];
    }

    //TODO: getPoinInRoom is called by spawn() and an edge case exist where the point is moved to avoid actual existing sprite but then brought back to this point by this function
    function getPointInRoom(room) {
        //get a point in the room
        let posX = Math.floor(Math.random() * usedPosBounds[room][2]) + usedPosBounds[room][0];
        let posY = Math.floor(Math.random() * usedPosBounds[room][3]) + usedPosBounds[room][1];
        if (layerBG[posX][posY] > 9) {
            if (posX !== usedPosBounds[room][0] + usedPosBounds[room][2] - 1 && layerBG[posX + 1][posY] === 2) {
                posX++;
            } else if (posX !== usedPosBounds[room][0] && layerBG[posX - 1][posY] === 2) {
                posX--;
            } else if (posY !== usedPosBounds[room][1] + usedPosBounds[room][3] - 1 && layerBG[posX][posY + 1] === 2) {
                posY++;
            } else if (posY !== usedPosBounds[room][1] && layerBG[posX][posY - 1] === 2) {
                posY--;
            } else if (posX !== usedPosBounds[room][0] + usedPosBounds[room][2] - 1 && posY !== usedPosBounds[room][1] + usedPosBounds[room][3] - 1 && layerBG[posX + 1][posY + 1] === 2) {
                posX++;
                posY++;
            } else if (posX !== usedPosBounds[room][0] && posY !== usedPosBounds[room][1] + usedPosBounds[room][3] - 1 && layerBG[posX - 1][posY + 1] === 2) {
                posX--;
                posY++;
            } else if (posX !== usedPosBounds[room][0] + usedPosBounds[room][2] - 1 && posY !== usedPosBounds[room][1] && layerBG[posX + 1][posY - 1] === 2) {
                posX++;
                posY--;
            } else if (posX !== usedPosBounds[room][0] && posY !== usedPosBounds[room][1] && layerBG[posX - 1][posY - 1] === 2) {
                posX--;
                posY--;
            }
        }
        return [posX, posY];
    }

    function initItems(ignore, ex, ey) {
        let itemTtle = Math.floor(Math.random() * usedPosBounds.length - 3);
        let iteminst;
        //randomly 1-10
        for (let i = 0; i < itemTtle; i++) {
            let itemT = Math.floor(Math.random() * 10) + 1;
            let remember = 0;
            for (let j = 0; j < InFloor.items.length; j++) {
                if (InFloor.items[j][1] * 10 >= itemT) {
                    iteminst = Object.values(allItems).find(obj => obj.id === InFloor.items[j][0]);
                    remember = j;
                } else {
                    itemT -= InFloor.items[j][1] * 10;
                }
            }
            items.push(floorItems[remember])
        }

        // random point in random room
        while (items.length > 0) {
            let item = items.pop();
            let iS = spawn(ignore);
            while (iS[0] === ex && iS[1] === ey) {
                iS = spawn(ignore);
            }
            layerItems[iS[0]][iS[1]] = item;
        }
    }

    function initEnemies(ignore, ex, ey) {
        let enemyTtle = 0;
        //randomly spawn enemies room * random(0-4)
        for (let i = 1; i < usedPosBounds.length - 1; i++) {

            if (i === ignore) {
                continue;
            }
            let numbEnemy = Math.floor(Math.random() * 4);
            for (let j = 0; j < numbEnemy; j++) {

                //get a point in the room
                let eS = getPointInRoom(i);
                while (eS[0] === ex && eS[1] === ey) {
                    eS = getPointInRoom(i);
                }

                //randomly 1-10
                let enemyT = Math.floor(Math.random() * 10) + 1;
                let enemyinst;
                let remember = 0;
                for (let k = 0; k < InFloor.monsters.length; k++) {
                    if (InFloor.monsters[k][1] * 10 >= enemyT) {
                        enemyinst = Object.values(allEnemies).find(obj => obj.id === InFloor.monsters[k][0]);
                        remember = k;
                        break;
                    } else {
                        enemyT -= InFloor.monsters[k][1] * 10;
                    }
                }

                // layerCharacters[eS[0]][eS[1]] = enemyTtle + 2;
                // enemyTtle++;

                let mobLevel = Math.floor(Math.random() * 3) - 1;
                let spriteSheet = new Image();
                spriteSheet.src = "image/maps/Characters/Enemy/" + enemyinst.sprite;
                mobLevel += enemyinst.level
                if (mobLevel <= 0)
                    mobLevel = 1;
                let mobXPMult = twoAfterComma(twoAfterComma(Math.random() - 0.5) + enemyinst.xpMultiplier);
                let mobMaxHP = twoAfterComma(enemyinst.hp * (mobLevel * mobXPMult));
                let mobXPToNextLevel = twoAfterComma((enemyinst.xpToNextLevel > 1 ? enemyinst.xpToNextLevel : 1) * (mobLevel * mobXPMult));
                let en = new Enemy(enemyinst.name, eS[0], eS[1], 0, floorEnemies[remember], mobMaxHP, mobMaxHP, enemyinst.attack, enemyinst.defense, enemyinst.range, mobLevel, [], 0, mobXPToNextLevel, mobXPMult, enemyinst.gold, enemyinst.hold, enemyinst.equipped, enemyinst.color);
                enemies.push(en);
                layerCharacters[eS[0]][eS[1]] = enemies[enemies.length - 1];
            }
        }
    }

    function initGame() {
        //reset all audio
        audio.pause();
        //load current InFloor
        InFloor = Object.values(floors).find(obj => obj.id === floornumber);
        //load images enemies
        for (let i = 0; i < InFloor.monsters.length; i++) {
            let enemy = Object.values(allEnemies).find(obj => obj.id === InFloor.monsters[i][0]);
            let en = new Image();
            en.src = "image/maps/Characters/Enemy/" + enemy.sprite;
            floorEnemies.push(en);
        }

        let arrowup;
        let arrowdown;
        let arrowleft;
        let arrowright;
        //load images items
        InFloor = Object.values(floors).find(obj => obj.id === floornumber);
        for (let i = 0; i < InFloor.items.length; i++) {
            let item = Object.values(allItems).find(obj => obj.id === InFloor.items[i][0]);
            let it = new Image();
            it.src = item.sprite[0];
            switch (item.name) {
                case "Up Arrow":
                    arrowup = new Item(item.name, item.damage, item.speed, item.self, item.effects, it, item.sprite[1], item.sprite[2], item.sprite[3]);
                    break;
                case "Down Arrow":
                    arrowdown = new Item(item.name, item.damage, item.speed, item.self, item.effects, it, item.sprite[1], item.sprite[2], item.sprite[3]);
                    break;
                case "Left Arrow":
                    arrowleft = new Item(item.name, item.damage, item.speed, item.self, item.effects, it, item.sprite[1], item.sprite[2], item.sprite[3]);
                    break;
                case "Right Arrow":
                    arrowright = new Item(item.name, item.damage, item.speed, item.self, item.effects, it, item.sprite[1], item.sprite[2], item.sprite[3]);
                    break;
                default:
                    floorItems.push(new Item(item.name, item.damage, item.speed, item.self, item.effects, it, item.sprite[1], item.sprite[2], item.sprite[3]));
                    break;
            }
        }

        drawRooms();
        drawCorridors();

        //assign uint8array to layerCharacters and layerItems
        for (let i = 0; i < mPos; i++) {
            layerCharacters[i] = []; //new Uint8Array(mPos); // layerBG[i].length
            layerItems[i] = []; //new Uint8Array(mPos); //layerBG[i].length
        }
        // let toavoid = [];
        //spawn player
        let pS = spawn([]); //spawn player
        player.posX = pS[0];
        player.posY = pS[1];
        layerCharacters[player.posX][player.posY] = 1;
        //set the 4 directions of the player as tiles 6 7 8 9
        layerItems[player.posX][player.posY - 1] = arrowup
        layerItems[player.posX][player.posY + 1] = arrowdown
        layerItems[player.posX - 1][player.posY] = arrowleft
        layerItems[player.posX + 1][player.posY] = arrowright

        //spawn exit
        for (let i = 0; i < projects.length; i++) {
            let exS = spawn(pS[2]);
            projects[i].posX = exS[0];
            projects[i].posY = exS[1];
            layerBG[projects[i].posX][projects[i].posY] = 4;
            // toavoid.push(exS[2]);
        }

        // initEnemies(pS[2], exS[0], exS[1]);
        // initItems(pS[2], exS[0], exS[1]);
        drawMap();
        audio = new Audio('gameSound/magicSchool.ogg');
        audio.play();
        audio.loop = true;
    }

    function update(moved) {
        // let newProjectiles = updateEnemies();
        // if (newProjectiles !== undefined)
        //     projectiles = projectiles.concat(newProjectiles);
        updatePlayer();
        // updateProjectiles();
        updateCollision();
        if (moved&&!fastInput) {
                animatedDrawMap();
        } else {
            drawMap();
        }
        closeNotifCtdwn--;
        if (closeNotifCtdwn < 0) {
            notifBoxDrawn = false;
            closeNotifCtdwn = 0;
            drawHeight = startH + drop;
            //get back to the canvas without the notifications
            ctxui.clearRect(canvasGame.width / 8 - 5, canvasGame.height - 205, (canvasGame.width / 8) * 6 + 10, 160);
        }
    }

    function updateEnemies() {
        let newProjectiles = [];
        for (let i = 0; i < enemies.length; i++) {
            let e = enemies[i];

            if (e.hp <= 0) {

                //without friendly fire for now
                player.xp += twoAfterComma(10 * twoAfterComma((e.level * 1.5) / player.level));
                document.getElementById("xp").innerHTML = `XP: ${player.xp}/${player.xpToNextLevel} \n Level enemy : ${e.level}`;

                while (player.xp >= player.xpToNextLevel) {
                    player.level++
                    player.hp += player.maxHp * (twoAfterComma(25 * player.xpMultiplier) / 100);
                    player.maxHp += player.maxHp * (twoAfterComma(25 * player.xpMultiplier) / 100);
                    player.defense = twoAfterComma(player.defense === 0 ? player.xpMultiplier : player.defense * player.xpMultiplier);
                    player.attackPower = twoAfterComma(player.attackPower === 0 ? player.attackPower : player.attackPower * player.xpMultiplier);
                    player.xp -= player.xpToNextLevel;
                    player.xpToNextLevel = twoAfterComma(player.xpToNextLevel * player.xpMultiplier);
                }

                //remove from layerCharacters
                layerCharacters[e.posX][e.posY] = undefined;
                //remove from enemies
                enemies.splice(i, 1);
                continue;
            }

            // clean the previous position
            layerCharacters[e.posX][e.posY] = undefined;
            let p = player;
            let diffX = e.posX - p.posX;
            let diffY = e.posY - p.posY;
            let direction = Math.abs(diffX) > Math.abs(diffY) ? 'horizontal' : 'vertical';
            let length = direction === 'horizontal' ? Math.abs(diffX) : Math.abs(diffY);

            //IMPLEMENT LIMITED VISION
            let rcst = false;
            if (length < 9) {
                //if in range then attack
                if (length <= e.range) {
                    //attack
                    e.hasAttacked = true;
                    if (Math.abs(diffX) === Math.abs(diffY)) {
                        newProjectiles.push(new Projectile("blunt attack", e, e.posX - diffX, e.posY - diffY, [diffX, diffY], e.attack, 0, 0, 0, 1, e.color));
                    } else if (direction === 'horizontal') {
                        newProjectiles.push(new Projectile("blunt attack", e, e.posX - diffX, e.posY, [diffX, 0], e.attack, 0, 0, 0, 1, e.color));
                    } else {
                        newProjectiles.push(new Projectile("blunt attack", e, e.posX, e.posY - diffY, [0, diffY], e.attack, 0, 0, 0, 1, e.color));
                    }
                    layerCharacters[e.posX][e.posY] = e;
                    continue;
                }
                //raycast to check if a wall is in the way
                for (let j = 1; j < length + 1; j++) {
                    //take diagonal into acoccurencecounter
                    if (direction === 'horizontal') {
                        if (diffX > 0 && layerBG[e.posX - j][e.posY] > 9) {
                            rcst = true;
                            break;
                        } else if (diffX < 0 && layerBG[e.posX + j][e.posY] > 9) {
                            rcst = true;
                            break;
                        }
                    } else if (direction === 'vertical') {
                        if (diffY > 0 && layerBG[e.posX][e.posY - j] > 9) {
                            rcst = true;
                            break;
                        } else if (diffY < 0 && layerBG[e.posX][e.posY + j] > 9) {
                            rcst = true;
                            break;
                        }
                    } else {
                        if (diffX > 0 && diffY > 0 && layerBG[e.posX - j][e.posY - j] > 9) {
                            rcst = true;
                            layerBG[e.posX - j][e.posY - j] = 1;
                            break;
                        } else if (diffX < 0 && diffY > 0 && layerBG[e.posX + j][e.posY - j] > 9) {
                            rcst = true;
                            layerBG[e.posX + j][e.posY - j] = 1;
                            break;
                        } else if (diffX > 0 && diffY < 0 && layerBG[e.posX - j][e.posY + j] > 9) {
                            rcst = true;
                            layerBG[e.posX - j][e.posY + j] = 1;
                            break;
                        } else if (diffX < 0 && diffY < 0 && layerBG[e.posX + j][e.posY + j] > 9) {
                            rcst = true;
                            layerBG[e.posX + j][e.posY + j] = 1;
                            break;
                        }
                    }
                }
                if (length > Math.abs(e.range) && !rcst) {
                    if (direction === 'horizontal') {
                        if (diffX > 0) {
                            e.posX--;
                        } else {
                            e.posX++;
                        }
                    } else {
                        if (diffY > 0) {
                            e.posY--;
                        } else {
                            e.posY++;
                        }
                    }
                }
            }
            if (length > Math.abs(e.range) || rcst) {
                let possibleMoves = [];
                for (let i = -1; i < 2; i++) {
                    for (let j = -1; j < 2; j++) {
                        if (i === 0 && j === 0) {
                            continue;
                        }
                        if (e.posX + i < 0 || e.posY + j < 0)
                            continue;
                        if (layerBG[e.posX + i][e.posY + j] < 10 && layerCharacters[e.posX + i][e.posY + j] === undefined) {
                            possibleMoves.push([i, j]);
                        }
                    }
                }
                let move = possibleMoves[Math.floor(Math.random() * possibleMoves.length)];
                e.posX += move[0];
                e.posY += move[1];
            }
            // change e.dir to the direction the enemy is facing 0 = down, 1 = left, 2 = right, 3 = up
            let diffX2 = e.posX - p.posX;
            let diffY2 = e.posY - p.posY;
            if (diffX2 === 0 && diffY2 === 0) {
                e.dir = 0;
            } else if (Math.abs(diffX2) > Math.abs(diffY2)) {
                if (diffX2 > 0) {
                    e.dir = 1;
                } else {
                    e.dir = 2;
                }
            } else {
                if (diffY2 > 0) {
                    e.dir = 3;
                } else {
                    e.dir = 0;
                }
            }
            layerCharacters[e.posX][e.posY] = e;
        }
        return newProjectiles;
    }

    function updateProjectiles() {
        for (let i = 0; i < projectiles.length; i++) {
            let p = projectiles[i];
            if (p.lifetime === 0 || p.posX - p.direction < 0 ||
                p.posY - p.direction[1] < 0 || p.posX - p.direction > mPos || p.posY - p.direction[1] > mPos) {
                if (p.numberOfChildren > 0) {
                    for (let j = 0; j < p.numberOfChildren; j++) {
                        projectiles.push(new Projectile(p.name, p.posX, p.posY, p.direction, p.damage, p.additionalDamage, p.duration, 0, p.lifetime, p.color));
                    }
                }
                projectiles.splice(i, 1);
                continue;
            }
            p.lifetime--;

            p.posX -= p.direction[0];
            p.posY -= p.direction[1];

            // document.getElementById(p.posX + "_" + p.posY).style.fill = p.color;
        }
    }

    function updateCollision() {
        let p = player;
        for (let i = 0; i < projects.length; i++) {
            let e = projects[i];
            let diffX = e.posX - p.posX;
            let diffY = e.posY - p.posY;
            if (diffX === 0 && diffY === 0) {
                dynamicDrawNotifs();
                drawNotif(`You reached the project :`, `${e.color}`);
                dynamicDrawNotifs();
                drawNotif(`${e.name}`, `${e.color}`);
                dynamicDrawNotifs();
                drawNotif(`Press (E) to open`, `rgba(100, 255, 100, 1)`);
                enableNextFloor();
                break;
            } else {
                nFloor = false;
            }
        }
        for (let i = 0; i < projectiles.length; i++) {
            let pr = projectiles[i];
            if (pr.posX === p.posX && pr.posY === p.posY) {
                stopInputs = true;
                setTimeout(() => {
                    stopInputs = false;
                }, 250);
                //? temp formula : ((25*(level-1)*power)/power + power - defense) => 25% multiplier per level
                let damages = Math.floor((25 * pr.owner.level * pr.damage) / 100 + pr.damage - p.defense);
                p.hp -= damages;
                p.gotHit = true;
                dynamicDrawNotifs();
                drawNotif(`You got hit by a ${pr.name} for ${damages} damage !`, "rgba(230, 120, 0, 1)");
                if (p.hp <= 0) {
                    death();
                }
            }
            if (layerCharacters[pr.posX][pr.posY] !== undefined && layerCharacters[pr.posX][pr.posY] > 1) {
                enemies.forEach(en => {
                    if (en.posX === pr.posX && en.posY === pr.posY) {
                        en.hp -= pr.damage;
                        en.gotHit = true;
                        // if (pr.duration > 0 && additionalDamage > 0)
                        // smth is wrong with the way enemies store effects
                    }
                });
            }
        }
    }

    function updatePlayer() { }

    function enableNextFloor() {
        nFloor = true;
    }

    function attack(s) {
        if (s.pp <= 0)
            return "nope";
        s.pp--;
        if (s.aoe) {
            let poses = [];
            for (let i = 0; i <= s.range; i++) {
                if (i !== 0) {
                    for (let n = -i; n <= i; n++) {
                        poses.push([
                            [player.posX + n],
                            [player.posY + i]
                        ]);
                        poses.push([
                            [player.posX + n],
                            [player.posY - i]
                        ]);
                    }
                    for (let n = -i + 1; n <= i - 1; n++) {
                        poses.push([
                            [player.posX + i],
                            [player.posY + n]
                        ]);
                        poses.push([
                            [player.posX - i],
                            [player.posY + n]
                        ]);
                    }
                }
            }

            for (let i = 0; i < enemies.length; i++) {
                for (let n = 0; n < poses.length; n++) {
                    if (enemies[i].posX === poses[n][0] && enemies[i].posY === poses[n][1]) {
                        let damages = Math.floor((25 * player.level * player.attackPower * s.power) / 100 + s.power - enemies[i].defense);
                        let miss = Math.floor(Math.random() * 101) > s.accuracy;
                        enemies[i].hp -= miss ? 0 : damages;

                        dynamicDrawNotifs();
                        drawNotif((miss ? `You missed` : `You dealt ${damages} damages to ${enemies[i].name} !`), "rgba(120, 230, 0, 1)");
                        enemies[i].gotHit = true;
                        if (s.effects !== 0) {
                            s.effects.forEach(effect => {
                                if (Math.floor(Math.random() * 100) < effect[1]) {
                                    enemies[i].affected.push(effect[0]);
                                    dynamicDrawNotifs();
                                    drawNotif(`${enemies[i].name} is now ${effect[0]}`, "rgba(120, 230, 0, 1)");
                                }
                            })
                        }
                        continue;
                    }
                }
            }
        }
        notifBoxDrawn = false;
    }

    async function backMenu() {
        UIMODE -= 1;
        interfaceUI(0);
    }

    async function rest() {
        stopInputs = true;
        let sleepTime = Math.floor(Math.random() * 5) + 2;
        while (sleepTime > 0) {
            dynamicDrawNotifs();
            drawNotif(`you are sleeping...`, "rgba(120, 0, 230, 1)");
            update();
            await new Promise(r => setTimeout(r, 1000));
            sleepTime--;
        }
        for (let s = 0; s < player.skills.length; s++) {
            player.skills[s][2].pp += Math.floor((25 * player.skills[s][2].maxPP) / 100)
            if (player.skills[s][2].pp > player.skills[s][2].maxPP)
                player.skills[s][2].pp = player.skills[s][2].maxPP;
        }
        player.hp += Math.floor((1 * player.maxHp) / 100);
        if (player.hp > player.maxHp)
            player.hp = player.maxHp;
        dynamicDrawNotifs();
        drawNotif(`you woke up !`, "rgba(120, 0, 230, 1)");
        stopInputs = false;
    }

    function pickUp() {
        let item = layerItems[player.posX][player.posY];
        if (item !== undefined) {
            if (item.name === "gold") {
                player.gold += item.damage;
                dynamicDrawNotifs();
                drawNotif(`You picked up ${item.damage} gold !`, "rgba(230, 230, 0, 1)");
            } else {
                player.inventory.push([item.name, useItem, item]);
                menuOptions[1][1] = player.inventory;
                dynamicDrawNotifs();
                drawNotif(`You picked up ${item.name} !`, "rgba(230, 230, 0, 1)");
            }
            layerItems[player.posX][player.posY] = undefined;
        }
    }

    function useItem(it) {
        if (it.self) {
            player.hp = player.hp - it.damage <= player.maxHp ? player.hp - it.damage : player.maxHp;
            player.inventory.splice(cursorOptions, 1);
            menuOptions[1][1] = player.inventory;
        } else {

        }
    }

    function movePlayer(x, y) {
        if (!fastInput) {
            action_in_progress = true;
        }
        let p = player;
        if (layerBG[p.posX + x][p.posY + y] < 10 && layerCharacters[p.posX + x][p.posY + y] === undefined) {
            layerCharacters[p.posX][p.posY] = undefined;
            p.posX += x;
            p.posY += y;
            layerCharacters[p.posX][p.posY] = 1;
            update(true);
        } else {
            //simulate vibration of the screen
            player.spriteDirection = [0, 0];
            document.getElementById("image_map").style.animation = "tilt-shaking 0.25s linear";
            //wait 0.25s
            setTimeout(function () {
                //stop the animation
                document.getElementById("image_map").style.animation = "";
                action_in_progress = false;
            }, 500);
        }
    }

    function death() {
        ctx.fillStyle = "rgba(255, 0, 0, 0.5)";
        ctx.fillRect(0, 0, canvasGame.width, canvasGame.height);
        ctx.fillStyle = "rgba(0, 0, 0, 1)";
        ctx.font = "30px Arial";
        ctx.fillText("You lose", canvasGame.width / 2 - 50, canvasGame.height / 2);
        ctx.font = "20px Arial";
        ctx.fillText("Press k to save score and restart", canvasGame.width / 2 - 50, canvasGame.height / 2 + 30);
        //stop the js with a throw
        throw new Error("You lose");
    }

    function restart() {
        floornumber = 0;
        player.skills = [];
        characterLoader("Kraig"); //! hardcoded temp
        closeNotifCtdwn = 0;
        //get back to the canvas without the notifications
        ctxui.clearRect(0, 0, canvasGame.height, canvasGame.width);
        currentOptions = menuOptions;
        cursorOptions = 0;
        UIMODE = 0;
        nextFloor();
    }

    function nextFloor() {
        //get the project in actual x and y
        let p = player;
        for (let i = 0; i < projects.length; i++) {
            if (projects[i].posX === p.posX && projects[i].posY === p.posY) {
                //get link of the project and open it
                window.open(projects[i].link);
                return;
            }
        }
        // nFloor = false;
        // layerBG = [];
        // layerCharacters = [];
        // floorEnemies = [];
        // projectiles = [];
        // enemies = [];
        // items = [];
        // floorItems = [];
        // layerItems = [];
        // for (let i = 0; i <= mPos; i++) {
        //     layerBG[i] = new Uint8Array(mPos + 1);
        // }
        // usedPosBounds = [];
        // rooms = [];
        // floornumber++;
        // generateRooms();
        // initGame();
    }


    function interfaceUI(cursor) {
        if (typeof cursor === "boolean") {
            if (cursorOptions === currentOptions.length) {
                backMenu();
                return
            }
            let newCurrent = currentOptions[cursorOptions][1];
            if (typeof newCurrent === "function") {
                ctxui.clearRect(0, 0, canvasGame.width, canvasGame.height);
                if (currentOptions[cursorOptions].length > 2) {
                    let err = newCurrent(currentOptions[cursorOptions][2]);
                    if (err !== undefined)
                        return interfaceUI(cursorOptions);

                } else {
                    newCurrent();
                }
                currentOptions = menuOptions;
                UIMODE = 0;
                update();
                return;
            } else {
                currentOptions = newCurrent;
                cursorOptions = 0;
                UIMODE++;
                interfaceUI(cursorOptions);
                return;
            }
        }
        switch (UIMODE) {
            case 0:
                ctxui.clearRect(0, 0, canvasGame.width, canvasGame.height);
                notifBoxDrawn = false;
                break;
            case 1:
                currentOptions = menuOptions;
                cursorOptions = cursor;
                dynamicDrawMenu(menuOptions);
                break;
            default:
                cursorOptions = cursor;
                dynamicDrawMenu(currentOptions);
                break;
        }
    }


    let fastInput = false;
    let pressedkeys = [];
    // event listener for key presses and while not key up move the player
    document.addEventListener('keydown', function (event) {
        if (!pressedkeys.includes(event.key))
            pressedkeys.push(event.key);

        //remove all other events of arrow keys
        event.preventDefault();
        event.stopPropagation();
        
        if (action_in_progress) {
            return;
        }
        
        pressedkeys.forEach(element => {
            var name = element.toLowerCase();
            if (player.hp <= 0 || stopInputs) {
                if (name === "k") {
                    restart();
                }
                return;
            }

            switch (name) {
                case "shift":
                    fastInput = true;
                    break;
                case "z":
                case "w":
                case "arrowup":
                    if (UIMODE === 0) {
                        player.spriteDirection[0] = -1;
                        movePlayer(0, -1);
                    } else {
                        interfaceUI((cursorOptions - 1 >= 0 ? cursorOptions - 1 : currentOptions.length));
                    }
                    break;
                case "q":
                case "a":
                case "arrowleft":
                    if (UIMODE === 0) {
                        player.spriteDirection[1] = -1;
                        movePlayer(-1, 0);
                    }
                    break;
                case "s":
                case "arrowdown":
                    if (UIMODE === 0) {
                        player.spriteDirection[0] = 1;
                        movePlayer(0, 1);
                    } else {
                        interfaceUI((cursorOptions + 1 <= currentOptions.length ? cursorOptions + 1 : 0));
                    }
                    break;
                case "d":
                case "arrowright":
                    if (UIMODE === 0) {
                        player.spriteDirection[1] = 1;
                        movePlayer(1, 0);
                    } else {
                        interfaceUI(true);
                    }
                    break;
                case "k":
                    restart();
                    break;
                case "enter":
                    if (UIMODE === 0) {
                        UIMODE = 1;
                        interfaceUI(0);
                    } else {
                        interfaceUI(true);
                    }
                    break;
                case "e":
                    if (nFloor) {
                        nextFloor();
                    } else {
                        pickUp();
                    }
                    break;
            }
        });
    });

    function twoAfterComma(int) {
        return Math.round(int * 100) / 100;
    }

    //onload
    characterLoader("Kraig");
    generateRooms();
    //show image image/maps/line.png in the canvas
    let loading_img = new Image();
    loading_img.src = "image/logo.png";
    loading_img.onload = function () {
        ctx.drawImage(loading_img, 0, 0, canvasGame.width, canvasGame.height);
    };

    document.addEventListener('keyup', function (event) {
        pressedkeys.splice(pressedkeys.indexOf(event.key), 1);
        if (event.key === "Shift") {
            fastInput = false;
        }
    });

    //wait 1s
    setTimeout(function () {
        initGame();
    }, 1000);
}
