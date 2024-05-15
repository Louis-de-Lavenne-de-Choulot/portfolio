import { useEffect } from 'react';
import Link from 'next/link';
import 'bootstrap/dist/css/bootstrap.min.css';

function PhonePage() {
    useEffect(async () => {
       await Game();
    }, []);
  
  return (
    
    <div>
      <h1>Welcome to my CV!</h1>
      <p>
        I am a software engineer with a passion for challenges. I
        have experience in a variety of technologies, including languages like Go, C#, Python, Javascript etc...
      </p>
      <p>
        You can view my projects on my{' '}
        <Link legacyBehavior href="https://github.com/Louis-de-Lavenne-de-Choulot">
          <a target="_blank">GitHub</a>
        </Link>{' '}
        page or learn more about my professional experience on my{' '}
        <Link legacyBehavior href="https://www.linkedin.com/in/louis-de-lavenne-de-choulot-b911191b8/">
          <a target="_blank">LinkedIn</a>
        </Link>
        .
      </p>
    <div className={"phone"}>
      <div className={"gameboy-div"}>
      <div className={"gameboy"}>
        <div id="image_map">
        <canvas className={"canvas"} id="canvass" height="700" width="700"></canvas>
        <canvas className={"canvas"} id="items" height="700" width="700"></canvas>
        <canvas className={"canvas"} id="characters" height="700" width="700"></canvas>
        <canvas className={"canvas"} id="ui" height="700" width="700"></canvas>
        </div>
        <div className={"buttons"}>
          <button className={"button"}id='ebtn'>E</button>
        </div>
        <div className="directional-cross">
  <div className="cross-arm cross-arm-top" id='topcross'></div>
  <div className="cross-arm cross-arm-right" id='rightcross'></div>
  <div className="cross-arm cross-arm-bottom" id='bottomcross'></div>
  <div className="cross-arm cross-arm-left" id='leftcross'></div>
</div>
</div>
      </div>
    </div>
    </div>
  );
}
const Game = async () => {
    
  let canvasGame = document.getElementById("canvass");
  let canvasItem = document.getElementById("items");
  let canvasCharacter = document.getElementById("characters");
  let canvasUI = document.getElementById("ui");
  //determine the size of the map, min ~20x20
  let normMapSize = 3000;
  let size = 54;
  let mPos = Math.floor(normMapSize / size);
  let viewZoom = 10;
  let letgo = 0;

  let selectedChar = "Bulbasaur";
  let animationQueue = {};
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
      name: "",
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
      spriteSheets: {},
      spriteDirection: Int8Array.from([0, 0]),
      // color: "rgb(0, 0, 255)",
  }


  let team = new Team("The basics", []);


  if (document.getElementById("pseudo") !== null) {
      player.name = document.getElementById("pseudo").innerText;
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

  let projects = [
      {
          name: "Simu Multiplayer VR UNITY", posX: 0, posY: 0, color: "rgba(165, 240, 15, 1)", link: "https://github.com/Louis-de-Lavenne-de-Choulot/ALGOSUP_2022_Project_4_F"
      },
      {
          name: "Application de Management", posX: 0, posY: 0, color: "rgba(165, 240, 15, 1)", link: ""
      },
      {
          name: "Synthetiseur musique - F#", posX: 0, posY: 0, color: "rgba(165, 240, 15, 1)", link: "https://github.com/ClementCaton/ALGOSUP_2022_Project_3_A"
      },
      {
          name: "Sites web clients Wordpress", posX: 0, posY: 0, color: "rgba(165, 240, 15, 1)", link: "https://annepouraud.fr/"
      },
      {
          name: "Site web de EURO WEB PARTNERS", posX: 0, posY: 0, color: "rgba(165, 240, 15, 1)", link: "https://ewp.fr/"
      },
      {
          name: "Serveur ultra sécurisé - Go compilé", posX: 0, posY: 0, color: "rgba(165, 240, 15, 1)", link: "https://github.com/Louis-de-Lavenne-de-Choulot/Go-server"
      },
      {
          name: "Personal AI (Alexa++) - Go", posX: 0, posY: 0, color: "rgba(165, 240, 15, 1)", link: "https://github.com/Louis-de-Lavenne-de-Choulot/Personal-AI"
      },
      {
          name: "LIMITLESS jeu PC/VR UNITY", posX: 0, posY: 0, color: "rgba(165, 240, 15, 1)", link: "https://github.com/BrendonDesvaux/Limitless"
      },
      {
          name: "Article VPN dans Programmez", posX: 0, posY: 0, color: "rgba(165, 240, 15, 1)", link: "/pdf/Prog.pdf"
      },
      {
          name: "C# Light ORM", posX: 0, posY: 0, color: "rgba(165, 240, 15, 1)", link: "https://github.com/Louis-de-Lavenne-de-Choulot/LORM"
      }
  ]

  let floornumber = 1;
  // array of enemy objects
  let enemies = [];

  let floorItems = [];

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

  let tileSizeMap = 32;

  let ctx;
  let ctxitem;
  let ctxchar;
  let ctxui;
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
      ["Items", player.inventory],
      ["Team", teamOptions],
      ["Pick up", pickUp],
  ]; //, ["Others", otherOptions]
  let currentOptions = menuOptions;

  //get the number of enemies
  let InFloor;

  var audio = new Audio('/gameSound/magicSchool.ogg');

  let allItems;
  let floors;
  let maxH;
  let characters;
  let action_in_progress = false;

  await fetch('/gameLogic/items.json')
      .then(response => response.json())
      .then(data => {
          allItems = data;
      }
      );

  // Fetch the floors.json file
  await fetch('/gameLogic/floors.json')
      .then(response => response.json())
      .then(data => {
          floors = data;
      });


  // Fetch the characters.json file
  await fetch('/gameLogic/characters.json')
      .then(response => response.json())
      .then(data => {
          characters = data;
      });


  ctx = canvasGame.getContext('2d');
  ctx.mozImageSmoothingEnabled = false;
  ctx.webkitImageSmoothingEnabled = false;
  ctx.msImageSmoothingEnabled = false;
  ctx.imageSmoothingEnabled = false;
  ctx.willReadFrequently = true;
  ctxitem = canvasItem.getContext('2d');
  ctxitem.mozImageSmoothingEnabled = false;
  ctxitem.webkitImageSmoothingEnabled = false;
  ctxitem.msImageSmoothingEnabled = false;
  ctxitem.imageSmoothingEnabled = false;
  ctxitem.willReadFrequently = true;
  ctxchar = canvasCharacter.getContext('2d');
  ctxchar.mozImageSmoothingEnabled = false;
  ctxchar.webkitImageSmoothingEnabled = false;
  ctxchar.msImageSmoothingEnabled = false;
  ctxchar.imageSmoothingEnabled = false;
  ctxchar.willReadFrequently = true;
  ctxui = canvasUI.getContext('2d');
  ctxui.mozImageSmoothingEnabled = false;
  ctxui.webkitImageSmoothingEnabled = false;
  ctxui.msImageSmoothingEnabled = false;
  ctxui.imageSmoothingEnabled = false;
  ctxui.willReadFrequently = true;

  let canvaswidth = Math.floor(ctx.canvas.width / viewZoom);
  let canvasheight = Math.floor(ctx.canvas.height / viewZoom);
  let biggestSize = canvaswidth > canvasheight ? canvaswidth : canvasheight;
  maxH = canvasGame.height - 50;
  startH = canvasGame.height - 200;
  drawHeight = canvasGame.height - 200;



  function characterLoader(character) {
      //load player
      let chara = Object.values(characters).find(obj => obj.name == character);
      player.name = chara.name;
      player.hp = chara.hp;
      player.maxHp = chara.maxHp;
      player.defense = chara.defense;
      player.attackPower = chara.attackPower;
      player.level = chara.level;
      player.xp = chara.xp;
      player.xpToNextLevel = chara.xpToNextLevel;
      player.xpMultiplier = chara.xpMultiplier;
      player.gold = chara.gold;
      player.inventory = chara.inventory;
      player.gotHit = false;
      AddObjectAnimator(player.name);
      SetBeforeDrawCallback(player.name, DrawCirclePlayer);
      animationQueue[player.name].biggestPX = chara.sizeMultiplier;
      chara.animations.forEach((anim) => {
          if (!player.spriteSheets[anim.spriteSheetName]) {
              let animImage = new Image();
              animImage.src = anim.spriteSheetPath;
              player.spriteSheets[anim.spriteSheetName] = animImage;
              animImage.onload = function () {
                  addCharacterAnimations(anim)
              };
              return;
          }
          addCharacterAnimations(anim)
      });
  }

  function addCharacterAnimations(anim) {
      let animData = []
      let animData1 = []
      let animData2 = []
      let animData3 = []
      let animData4 = []
      let animData5 = []
      let animData6 = []
      let animData7 = []
      let spriteInSpriteWidth = anim.spriteInSpriteWidth;
      let spriteInSpriteHeight = anim.spriteInSpriteHeight;
      let spWidth = player.spriteSheets[anim.spriteSheetName].naturalWidth;
      let spHeight = player.spriteSheets[anim.spriteSheetName].naturalHeight;
      let spriteInfos = getSpriteSizeInformations(player.spriteSheets[anim.spriteSheetName], spWidth, spHeight, spriteInSpriteWidth, spriteInSpriteHeight);

      let spSW = spWidth / spriteInfos[0];
      let spSY = spHeight / spriteInfos[1];

      //we take the height from the anim.spriteHeightInSheet and then we do width/spS
      for (let i = 0; i < spWidth; i += spSW) {
          //here with 1025 pokemons, we decided to hardcode the rows to lighten the json
          animData.push([i, anim.spriteRowInSheet]);
          animData1.push([i, 1 * spSY]);
          animData2.push([i, 2 * spSY]);
          animData3.push([i, 3 * spSY]);
          animData4.push([i, 4 * spSY]);
          animData5.push([i, 5 * spSY]);
          animData6.push([i, 6 * spSY]);
          animData7.push([i, 7 * spSY]);
      }

      AddObjectAnimation(player.name, player.spriteSheets[anim.spriteSheetName], spSW, spSY, anim.name + "_down", animData);
      AddObjectAnimation(player.name, player.spriteSheets[anim.spriteSheetName], spSW, spSY, anim.name + "_downleft", animData1);
      AddObjectAnimation(player.name, player.spriteSheets[anim.spriteSheetName], spSW, spSY, anim.name + "_right", animData2);
      AddObjectAnimation(player.name, player.spriteSheets[anim.spriteSheetName], spSW, spSY, anim.name + "_upright", animData3);
      AddObjectAnimation(player.name, player.spriteSheets[anim.spriteSheetName], spSW, spSY, anim.name + "_up", animData4);
      AddObjectAnimation(player.name, player.spriteSheets[anim.spriteSheetName], spSW, spSY, anim.name + "_upleft", animData5);
      AddObjectAnimation(player.name, player.spriteSheets[anim.spriteSheetName], spSW, spSY, anim.name + "_left", animData6);
      AddObjectAnimation(player.name, player.spriteSheets[anim.spriteSheetName], spSW, spSY, anim.name + "_downleft", animData7);
  }

  function getSpriteSizeInformations(img, imgWidth, imgHeight, spriteInSpriteWidth, spriteInSpriteHeight) {
      if (spriteInSpriteWidth == undefined || spriteInSpriteWidth == 0)
          spriteInSpriteWidth = 1;
      if (spriteInSpriteHeight == undefined || spriteInSpriteHeight == 0)
          spriteInSpriteHeight = 1;


      //check sprite size per number of appearance in spritesheet
      let canvasCheck = document.createElement('canvas');
      canvasCheck.width = imgWidth;
      canvasCheck.height = imgHeight;
      var canvasCheck2D = canvasCheck.getContext('2d');
      canvasCheck2D.drawImage(img, 0, 0, imgWidth, imgHeight);

      let pxToCheck = 0;
      let appearanceX = 0;
      //we assume there is at least 10 transparent pixel between each sprite
      let colorPixelTolerance = 5;

      for (let x = 0; x < imgWidth; x++) {
          var pixelData = canvasCheck2D.getImageData(x, x, 1, 1).data;
          if (pixelData[3] != 0) {
              if (colorPixelTolerance > 0) {
                  colorPixelTolerance--;
                  continue;
              }
              pxToCheck = x;
              break;
          }
      }

      let SpaceBetweenSpritesTolerance = 5;
      let ColoredPixelBuffer = 0;
      for (let x = 0; x < imgWidth; x++) {
          var pixelData = canvasCheck2D.getImageData(x, pxToCheck, 1, 1).data;
          if (pixelData[3] != 0 && ColoredPixelBuffer == 0) {
              ColoredPixelBuffer = SpaceBetweenSpritesTolerance;
              appearanceX++;
          } else if (pixelData[3] == 0 && ColoredPixelBuffer > 0) {
              ColoredPixelBuffer--;
          }
      }
      if (spriteInSpriteWidth != undefined) {
          appearanceX /= spriteInSpriteWidth;
      }
      let appearanceY = 0;
      //we assume there is at least 10 transparent pixel between each sprite
      ColoredPixelBuffer = 0;
      for (let y = 0; y < imgHeight; y++) {
          var pixelData = canvasCheck2D.getImageData(pxToCheck, y, 1, 1).data;
          if (pixelData[3] != 0 && ColoredPixelBuffer == 0) {
              ColoredPixelBuffer = SpaceBetweenSpritesTolerance;
              appearanceY++;
          } else if (pixelData[3] == 0 && ColoredPixelBuffer > 0) {
              ColoredPixelBuffer--;
          }
      }
      if (spriteInSpriteHeight != undefined) {
          appearanceY /= spriteInSpriteHeight;
      }
      return [appearanceX, appearanceY];
  }

  // tutorial text into tiles
  // emulator like on phone
  // treasure chest download cv
  // add a menu to select the character


  function drawRooms() {
      //define room size
      let roomSize = Math.floor(Math.random() * (15 - 10 + 1)) + 5;
      let nRooms = 5

      //place rooms in the grid
      for (let i = 0; i < nRooms; i++) {
          let posX = Math.floor(Math.random() * (50 - 2 * roomSize - 5)) + 5 + roomSize;
          let posY = Math.floor(Math.random() * (50 - 2 * roomSize - 5)) + 5 + roomSize;
          let sizeX = roomSize;
          let sizeY = roomSize;

          //check if the room is in bounds and if it is not in another room
          let inBounds = posX >= 0 && posX + sizeX <= 50 && posY >= 0 && posY - sizeY <= 50;

          //check if room is overlapping
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


  async function postProcessingTiles() {
      let previousWasSolo = [];
      for (let x = 1; x < layerBG.length - 1; x++) {
          for (let y = 1; y < layerBG[x].length - 1; y++) {
              if (layerBG[x][y] < 10)
                  continue;
              let left = layerBG[x - 1][y];
              let right = layerBG[x + 1][y];
              let top = layerBG[x][y - 1];
              let bottom = layerBG[x][y + 1];
              left = (left < 10 && left > 0 || left == 24);
              right = (right < 10 && right > 0 || right == 24);
              top = (top < 10 && top > 0 || top == 24);
              bottom = (bottom < 10 && bottom > 0 || bottom == 24);
  
  
              //bottom linked
              //top linked
              //right linked
              //left linked
              if (left && right || top && bottom) {
                  layerBG[x][y] = 24;
                  continue;
              }
              if (left && top)
                  previousWasSolo.push([x, y]);
          }
      }
  
      previousWasSolo.forEach(async (xy) => {
          let x = xy[0];
          let y = xy[1];
          let left = layerBG[x - 1][y];
          let right = layerBG[x + 1][y];
          let top = layerBG[x][y - 1];
          let bottom = layerBG[x][y + 1];
          left = (left < 10 && left > 0 || left == 24);
          right = (right < 10 && right > 0 || right == 24);
          top = (top < 10 && top > 0 || top == 24);
          bottom = (bottom < 10 && bottom > 0 || bottom == 24)
  
          //bottom linked
          //top linked
          //right linked
          //left linked
          if (left && right || top && bottom) {
              layerBG[x][y] = 24;
          }
      })
  
      for (let x = 1; x < layerBG.length - 1; x++) {
          for (let y = 1; y < layerBG[x].length - 1; y++) {
              if (layerBG[x][y] < 10)
                  continue;
              let left = layerBG[x - 1][y];
              let right = layerBG[x + 1][y];
              let top = layerBG[x][y - 1];
              let bottom = layerBG[x][y + 1];
              let topLeft = (layerBG[x - 1][y - 1] == 0 || layerBG[x - 1][y - 1] >= 10);
              let topRight = (layerBG[x + 1][y - 1] == 0 || layerBG[x + 1][y - 1] >= 10);
              let bottomLeft = (layerBG[x - 1][y + 1] == 0 || layerBG[x - 1][y + 1] >= 10);
              let bottomRight = (layerBG[x + 1][y + 1] == 0 || layerBG[x + 1][y + 1] >= 10);
  
              let linkleft = (left >= 10 && left != 24 || left == 0);
              let linkright = (right >= 10 && right != 24 || right == 0);
              let linktop = (top >= 10 && top != 24 || top == 0);
              let linkbottom = (bottom >= 10 && bottom != 24 || bottom == 0);
  
  
              //?  2 3 2
              //?  3 3 3
              //?  2 3 2
              if (!topLeft && !bottomRight && !topRight && !bottomLeft &&
                  left >= 10 && top >= 10 && right >= 10 && bottom >= 10) {
                  layerBG[x][y] = 27;
                  continue;
              }
  
  
              //?  2 3
              //?  3 3 3
              //?    3 2
              if (!topLeft && !bottomRight &&
                  left >= 10 && top >= 10 && right >= 10 && bottom >= 10) {
                  layerBG[x][y] = 25;
                  continue;
              }
  
              if (!topRight && !bottomLeft &&
                  left >= 10 && top >= 10 && right >= 10 && bottom >= 10) {
                  layerBG[x][y] = 26;
                  continue;
              }
  
  
  
              //? 1 1 1
              //? 3 3 3
              //?   2 
              //#region all implems of above case
              //bottom not linked
              if (linkleft && linkright && top == 0 && !linkbottom) {
                  layerBG[x][y] = 14;
                  continue;
              }
  
              //top not linked
              if (linkleft && linkright && bottom == 0 && !linktop) {
                  layerBG[x][y] = 15;
                  continue;
              }
  
              //right not linked
              if (left == 0 && linktop && linkbottom && !linkright) {
                  layerBG[x][y] = 16;
                  continue;
              }
  
              //left not linked
              if (right == 0 && linktop && linkbottom && !linkleft) {
                  layerBG[x][y] = 17;
                  continue;
              }
              //#endregion
  
  
              //?   1 3
              //?   3 3
              //?       2
              //#region all implems of above case
              // if top and left are set and not top-left but bottom-right is
              if (linktop && linkleft && !linkbottom && !linkright && topLeft && !bottomRight) {
                  layerBG[x][y] = 23;
                  continue;
              }
  
              // if top and right are set and not top-right but bottom-left is then change case
              if (linktop && linkright && !linkbottom && !linkleft && topRight && !bottomLeft) {
                  layerBG[x][y] = 22;
                  continue;
              }
  
              // if left and bottom are set and not bottom-left but top-right is then change case
              if (linkleft && linkbottom && !linkright && !linktop && bottomLeft && !topRight) {
                  layerBG[x][y] = 21;
                  continue;
              }
  
              // if right and bottom are set and not bottom-right but top-left is then change case
              if (linkright && linkbottom && !linkleft && !linktop && bottomRight && !topLeft) {
                  layerBG[x][y] = 20;
                  continue;
              }
              //#endregion
  
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
      ctxui.font = "40px Arial";

      if (arrOptions == menuOptions) {
          texts.push(`${player.name}  ${player.hp}/${player.maxHp} Lvl${player.level}`);
          for (let i = 0; i < team.allies.length; i++) {
              texts.push(`${allies[i].name}  ${allies[i].hp}/${allies[i].maxHp} Lvl${allies[i].level}`);
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
      //gold
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
      ctxui.font = "bold 30px Arial";
      ctxui.fillStyle = color;
      ctxui.fillText(txt, canvasGame.width / 8 + 20, drawHeight);
      ctxui.fillText(txt, canvasGame.width / 8 + 20, drawHeight);
      ctxui.fillText(txt, canvasGame.width / 8 + 20, drawHeight);
      ctxui.strokeText(txt, canvasGame.width / 8 + 20, drawHeight);
  }

  async function drawUI() {
      ctxui.clearRect(0, 0, canvasGame.width, 40); // Clear the previous floor and level text and health bar
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
      ctxui.font = "bold 30px Arial";
      ctxui.fillText(text, 30, 20);
      ctxui.strokeStyle = "rgb(50,50,50)";
      ctxui.lineWidth = 1.2;
      ctxui.strokeText(text, 30, 19.5);
  }

  async function animatedDrawMap(nFrame = 40, timeBetweenFrames = 10) {
      for (let next = nFrame; next >= 0; next--) {
          // sourceY = player.spriteDirection[0] < 0 ? 32 * 3 : (player.spriteDirection[1] < 0 ? 32 : (player.spriteDirection[1] > 0 ? 32 * 2 : 0));
          let occurencecounter = [0, 0];
          let animoccur = player.spriteDirection[0] < 0 ? [0, -next / nFrame] : (player.spriteDirection[1] < 0 ? [-next / nFrame, 0] : (player.spriteDirection[1] > 0 ? [next / nFrame, 0] : [0, next / nFrame]));
  
          let buffer = document.createElement("canvas");
          buffer.width = canvasGame.width;
          buffer.height = canvasGame.height;
          let bufferCtx = buffer.getContext("2d");
          bufferCtx.imageSmoothingEnabled = false;
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
          if (posXminus == 0 && posXmax + vz - player.posX < mPos) {
              posXmax += vz - player.posX;
          }
          // if min Y is 0 (start of map) then apply offset to max Y equal to lost number of tiles on the top side. This is to even out the loss and gain on both sides
          if (posYminus == 0 && posYmax + vz - player.posY < mPos) { // layerBG[posXmax].length 
              posYmax += vz - player.posY;
          }
          let imgD = undefined;
  
          // TODO : a smaaaall bit of sprite is wrong, to fix.
          // ? INFO : this part is responsible to draw the left or top part of the map when moving right or down. it fixes a graphic bug
          // ?        For example a down movement: the top tile is gonna disappear bit by bit drawn on top by the one under that goes up.
          // ?        But then you take notice that it makes an unusual effect where it seems like it gets eaten because it does not go up itself.
          if (animoccur[0] > 0) {
              // imgD stands for image data, which is used to store the current canvas content that will just be re added with a padding to create the animation effect without recalculating.
              // we can do nFrame/next because we check > 0 above
              imgD = ctx.getImageData(canvaswidth * 1 / nFrame, 0, canvaswidth * nFrame / next, ctx.canvas.height);
          } else if (animoccur[1] > 0) {
              imgD = ctx.getImageData(0, canvasheight * 1 / nFrame, ctx.canvas.width, canvasheight * nFrame / next);
          }
  
  
  
          // ? INFO : Clear Not needed because no drop of performance or ram usage difference were found between overdraw and clear then draw when tested.
          // // Clear the entire canvas
          // ctx.clearRect(0, 0, canvasGame.width, canvasGame.height);

          ctxitem.clearRect(0, 0, canvasGame.width, canvasGame.height);

          if (imgD !== undefined) {
              ctx.putImageData(imgD, 0, 0);
          }
  
          // Clear the entire canvas
          // ctxchar.clearRect(0, 0, canvasGame.width, canvasGame.height);
          for (let i = posXminus; i < posXmax; i++) {
              for (let j = posYminus; j < posYmax; j++) {
  
                  let bgTileSize = 24;
                  switch (layerBG[i][j]) {
                      case 2:
                          // floor Tile
                          sourceY = bgTileSize;
                          sourceX = bgTileSize;
                          break;
                      case 3:
                          // floor Tile
                          sourceY = bgTileSize;
                          sourceX = bgTileSize;
                          break;
                      case 10:
                          // bottom right not linked
                          sourceY = 0;
                          sourceX = 0;
                          break;
                      case 11:
                          // bottom left not linked
                          sourceY = 0;
                          sourceX = bgTileSize * 2;
                          break;
                      case 12:
                          // top right not linked
                          sourceY = bgTileSize * 2;
                          sourceX = 0;
                          break;
                      case 13:
                          // top left not linked
                          sourceY = bgTileSize * 2;
                          sourceX = bgTileSize * 2;
                          break;
                      case 14:
                          // bottom not linked
                          sourceY = 0;
                          sourceX = bgTileSize;
                          break;
                      case 15:
                          // left not linked
                          sourceY = bgTileSize * 2;
                          sourceX = bgTileSize;
                          break;
                      case 16:
                          // right not linked
                          sourceY = bgTileSize;
                          sourceX = 0;
                          break;
                      case 17:
                          // top not linked
                          sourceY = bgTileSize;
                          sourceX = bgTileSize * 2;
                          break;
                      case 20:
                          sourceY = bgTileSize * 3;
                          sourceX = bgTileSize * 3;
                          break;
                      case 21:
                          sourceY = bgTileSize * 3;
                          sourceX = bgTileSize * 4;
                          break;
                      case 22:
                          sourceY = bgTileSize * 4;
                          sourceX = bgTileSize * 3;
                          break;
                      case 23:
                          sourceY = bgTileSize * 4;
                          sourceX = bgTileSize * 4;
                          break;
                      case 24:
                          //all
                          sourceY = bgTileSize;
                          sourceX = bgTileSize * 3;
                          break;
                      case 25:
                          //topleft bottomright walkable
                          sourceY = 0;
                          sourceX = bgTileSize * 3;
                          break;
                      case 26:
                          //topright bottomleft walkable
                          sourceY = 0;
                          sourceX = bgTileSize * 4;
                          break;
                      case 27:
                          //all corners
                          sourceY = bgTileSize;
                          sourceX = bgTileSize * 4;
                          break;
                      default:
                          sourceY = bgTileSize * 2;
                          sourceX = bgTileSize * 3;
                          break;
                  }
                  //draw the background
                  ctx.drawImage(tileAtlas, sourceX, sourceY, bgTileSize, bgTileSize, Math.ceil((animoccur[0] + occurencecounter[0]) * canvaswidth), Math.ceil((animoccur[1] + occurencecounter[1]) * canvasheight), canvaswidth, canvasheight);
  
                  if (layerItems[i][j] !== undefined) {
                      let item = layerItems[i][j];
                      ctxitem.drawImage(item.spriteSheet, item.SSposX, item.SSposY, item.SSsize, item.SSsize, (animoccur[0] + occurencecounter[0] + 0.20 * i / posXmax) * canvaswidth, (animoccur[1] + occurencecounter[1] + 0.20 * j / posYmax) * canvasheight, canvaswidth, canvasheight);
                  }
                  if (layerCharacters[i][j] != undefined) {
                      if (layerCharacters[i][j] == 1) {
                          UpdateObjectPosition(player.name, occurencecounter[0] * canvaswidth, (occurencecounter[1] - 0.1) * canvasheight);
                          SetObjectAnimation(player.name, player.spriteDirection[0] < 0 ? 'walk_up' : (player.spriteDirection[1] < 0 ? 'walk_left' : (player.spriteDirection[1] > 0 ? 'walk_right' : 'walk_down')));
                          SetBeforeDrawArgs(player.name, (occurencecounter[0] + 0.02) * canvaswidth + canvaswidth / 2, (occurencecounter[1] + 0.5) * canvasheight + canvasheight / 4, canvaswidth / 4.5)
  
                      } else {
                          let enemySpriteSize = 32;
                          //get enemy from enemies by id
                          let enemy = layerCharacters[i][j];
                          sourceY = enemy.dir == 0 ? 0 : (enemy.dir == 1 ? enemySpriteSize : (enemy.dir == 2 ? enemySpriteSize * 2 : enemySpriteSize * 3));
                          sourceX = 0; //!TEMP for animations change to continuous
                          enemy.dir = 0;
  
  
                          ctxchar.fillStyle = "rgba(0, 0, 0, 0)";
                          ctxchar.beginPath();
                          //add stroke circle
                          ctxchar.arc(((animoccur[0] + occurencecounter[0]) + 0.02) * canvaswidth + canvaswidth / 2, (animoccur[1] + occurencecounter[1] + 0.5) * canvasheight + canvasheight / 4, canvaswidth / 4.5, 0, 2 * Math.PI);
                          ctxchar.lineWidth = 2;
                          ctxchar.strokeStyle = "rgba(255, 0, 0, 0.5)";
                          ctxchar.stroke();
                          ctxchar.fill();
                          ctxchar.closePath();
  
                          ctxchar.drawImage(enemy.enemySpriteSheet, sourceX, sourceY, enemySpriteSize, enemySpriteSize, (animoccur[0] + occurencecounter[0]) * canvaswidth, (animoccur[1] + occurencecounter[1] - 0.1) * canvasheight, canvaswidth, canvasheight);
                          let gotHit = false;
                          // TODO: I REALLY NEED LAYER CHARA TO POINT TO ENEMY, THE FOLLOWING CODE IS BLERGH INEFFICIENT
                          for (let z = 0; z < enemiesCopy.length; z++) {
                              if (enemiesCopy[z].posX == i && enemiesCopy[z].posY == j) {
                                  gotHit = enemiesCopy[z].gotHit;
                                  enemiesCopy[z].gotHit = false;
                                  // enemiesCopy.splice(z, 1);
                                  break;
                              }
                          }
                          if (gotHit) {
                              const imageData = ctxchar.getImageData((animoccur[0] + occurencecounter[0]) * canvaswidth, (animoccur[1] + occurencecounter[1] - 0.1) * canvasheight, canvaswidth, canvasheight);
  
                              const data = imageData.data;
                              for (let i = 0; i < data.length; i += 4) {
                                  data[i] = 255;
                              }
                              ctxchar.putImageData(imageData, (animoccur[0] + occurencecounter[0]) * canvaswidth, (animoccur[1] + occurencecounter[1] - 0.1) * canvasheight);
                              enemy.gotHit = false;
                          }
                      }
                  }
                  // else if (layerItems[i][j] != undefined) {
                  //     let item = layerItems[i][j];
                  //     bufferCtx.drawImage(item.spriteSheet, 0, 0, 16, 16,(animoccur[0] + occurencecounter[0])* canvaswidth,(animoccur[1] + occurencecounter[1])* canvasheight, canvaswidth, canvasheight);
                  // }
  
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
              if (document.getElementById("stylish") && document.getElementById("stylish").checked) {
                  await new Promise(r => setTimeout(r, document.getElementById("myRange").value));
              }
              occurencecounter[1] = 0;
              occurencecounter[0]++;
          }
          ctx.drawImage(buffer, 0, 0);
  
          drawUI();
          await new Promise(r => setTimeout(r, timeBetweenFrames));
      }
      if (letgo)
          SetObjectAnimation(player.name, player.spriteDirection[0] < 0 ? 'idle_up' : (player.spriteDirection[1] < 0 ? 'idle_left' : (player.spriteDirection[1] > 0 ? 'idle_right' : 'idle_down')));
      player.spriteDirection = [0, 0];
      action_in_progress = false;
  }
  
  function spawn(avoid) {
      //get the number of rooms
      let roomNumber = usedPosBounds.length;
      //get a random room
      let room = Math.floor(Math.random() * roomNumber);
      if (avoid != undefined && room == avoid) {
          if (room == 0) {
              room++;
          } else {
              room--;
          }
      }
      //get a point in the room
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

  function initGame() {
      //reset all audio
      audio.pause();

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
      postProcessingTiles();

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

      animatedDrawMap(2, 0);
      audio.loop = true;
  }

  ctx.drawImage(new Image("image/logo.png"), 0, 0, ctx.width, ctx.height);
  characterLoader(selectedChar);
  setTimeout(function () {
      initGame();
  }, 500);

  function update(moved) {
      // let newProjectiles = updateEnemies();
      // if (newProjectiles !== undefined)
      //     projectiles = projectiles.concat(newProjectiles);
      // updateProjectiles();
      updateCollision();
      if (moved && !fastInput) {
          animatedDrawMap();
      } else {
          animatedDrawMap(1, 0);
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

  function updateCollision() {
      let p = player;
      for (let i = 0; i < projects.length; i++) {
          let e = projects[i];
          let diffX = e.posX - p.posX;
          let diffY = e.posY - p.posY;
          if (diffX === 0 && diffY === 0) {
              drawHeight = startH + drop;
              //get back to the canvas without the notifications
              ctxui.clearRect(canvasGame.width / 8, canvasGame.height - 200, (canvasGame.width / 8) * 6, 150);
              notifBoxDrawn = false;
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
  }

  function enableNextFloor() {
      nFloor = true;
  }

  async function backMenu() {
      UIMODE -= 1;
      interfaceUI(0);
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

  function restart() {
      floornumber = 0;
      player.skills = [];
      characterLoader(selectedChar);
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
                      letgo = false;
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
                      letgo = false;
                      player.spriteDirection[1] = -1;
                      movePlayer(-1, 0);
                  }
                  break;
              case "s":
              case "arrowdown":
                  if (UIMODE === 0) {
                      letgo = false;
                      player.spriteDirection[0] = 1;
                      movePlayer(0, 1);
                  } else {
                      interfaceUI((cursorOptions + 1 <= currentOptions.length ? cursorOptions + 1 : 0));
                  }
                  break;
              case "d":
              case "arrowright":
                  if (UIMODE === 0) {
                      letgo = false;
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
          }
      });
  });

  document.addEventListener('keyup', function (event) {
      let keys = ["z", "q", "s", "d", "w", "a", "arrowup", "arrowright", "arrowleft", "arrowdown"];
      pressedkeys.splice(pressedkeys.indexOf(event.key), 1);
      if (event.key === "Shift") {
          fastInput = false;
      }
      if (keys.includes(event.key))
          letgo = true;
      if (event.key ==="e"){
          if (nFloor) {
              nextFloor();
          } else {
              pickUp();
          }
      }
  });
  
  if (
      document.getElementById("topcross") &&
      document.getElementById("leftcross") &&
      document.getElementById("rightcross") &&
      document.getElementById("bottomcross")
  ) {
      let touchStartHandler = (event) => {
          event.preventDefault();
          event.stopPropagation();
  
          if (action_in_progress) {
              return;
          }
          if (UIMODE === 0) {
              letgo = false;
              if (event.target.id === "topcross") {
                  player.spriteDirection[0] = -1;
                  movePlayer(0, -1);
              } else if (event.target.id === "leftcross") {
                  player.spriteDirection[1] = 1;
                  movePlayer(1, 0);
              } else if (event.target.id === "rightcross") {
                  player.spriteDirection[1] = -1;
                  movePlayer(-1, 0);
              } else if (event.target.id === "bottomcross") {
                  player.spriteDirection[0] = 1;
                  movePlayer(0, 1);
              }
          } else {
              interfaceUI((cursorOptions - 1 >= 0 ? cursorOptions - 1 : currentOptions.length));
          }
      }
      //create empty interval
      let upTouchEnd = setInterval(() => {}, 10000);
      let leftTouchEnd =  setInterval(() => {}, 10000);
      let rightTouchEnd =  setInterval(() => {}, 10000);
      let bottomTouchEnd = setInterval(() => {}, 10000);
  
      document.getElementById("topcross").addEventListener("touchstart", (event) => {
          upTouchEnd = setInterval(() => {
              touchStartHandler(event);
          }, 100)});
      document.getElementById("topcross").addEventListener("touchend", (event) => {
          clearInterval(upTouchEnd);
      });
  
      document.getElementById("leftcross").addEventListener("touchstart", (event) =>  {
          leftTouchEnd = setInterval(() => {
              touchStartHandler(event);
          }, 100)});
      document.getElementById("leftcross").addEventListener("touchend", (event) => {
          clearInterval(leftTouchEnd);
      });
  
      document.getElementById("rightcross").addEventListener("touchstart", (event) => {
          rightTouchEnd = setInterval(() => {
              touchStartHandler(event);
          }, 100)});
          document.getElementById("rightcross").addEventListener("touchend", (event) => {
          clearInterval(rightTouchEnd);
      });
      document.getElementById("bottomcross").addEventListener("touchstart", (event) => {
          bottomTouchEnd = setInterval(() => {
              touchStartHandler(event);
          }, 100);
      });
      document.getElementById("bottomcross").addEventListener("touchend", (event) => {
          clearInterval(bottomTouchEnd);
      });

      document.getElementById("ebtn").addEventListener("touchstart", (event) => {
          event.preventDefault();
          event.stopPropagation();
  
          
          if (action_in_progress) {
              return;
          }
          nextFloor();
      });
  }







  //animation

  function DrawCirclePlayer(arg1, arg2, arg3) {

      ctxchar.clearRect(arg1 - arg3 - 2, arg2 - arg3 - 2, arg3 * 2 + 4, arg3 * 2 + 4);
      ctxchar.fillStyle = "rgba(0, 0, 0, 0)";
      ctxchar.beginPath();
      //add stroke circle
      ctxchar.arc(arg1, arg2, arg3, 0, 2 * Math.PI);
      ctxchar.lineWidth = 2;
      ctxchar.strokeStyle = "rgba(0, 255, 0, 0.5)";
      ctxchar.stroke();
      ctxchar.fill();
      ctxchar.closePath();
  }

  function RemoveObjectAnimator(obj) {
      if (animationQueue[obj])
          animationQueue.remove(obj);
  }

  function AddObjectAnimator(obj) {
      if (!animationQueue[obj]) {
          animationQueue[obj] = {
              currentFrame: 0,
              currentAnimation: null,
              beforeDrawCallback: null,
              previousFrameSize: [],
              beforeDrawArgs: [],
              biggestPX: biggestSize,
              x: 0,
              y: 0,
              animations: {},
              spriteSheet: {}
          };
      }
  }

  function AddObjectAnimation(obj, spritesheet, spriteWidth, spriteHeight, animationName, animation_data) {
      if (animationQueue[obj]) {
          animationQueue[obj].animations[animationName] = animation_data;
          animationQueue[obj].spriteSheet[animationName] = [spritesheet, spriteWidth, spriteHeight];
      } else {
          console.error(`Object "${obj}" not found in animation queue.`);
      }
  }

  function SetObjectAnimation(obj, animationName) {
      if (animationQueue[obj] && animationQueue[obj].animations[animationName]) {
          if (animationQueue[obj].currentAnimation == animationName)
              return;
          animationQueue[obj].currentAnimation = animationName;
          animationQueue[obj].currentFrame = 0;
      } else {
          console.error(`Animation "${animationName}" not found for object "${obj}".`);
      }
  }

  function SetBeforeDrawCallback(obj, callback) {
      if (animationQueue[obj]) {
          animationQueue[obj].beforeDrawCallback = [callback];
      } else {
          console.error(`Object "${obj}" not found in animation queue.`);
      }
  }

  function SetBeforeDrawArgs(obj, ...args) {
      if (animationQueue[obj]) {
          animationQueue[obj].beforeDrawArgs = args;
      } else {
          console.error(`Object "${obj}" not found in animation queue.`);
      }
  }

  function UpdateObjectPosition(obj, x, y) {
      if (animationQueue[obj]) {
          animationQueue[obj].x = x;
          animationQueue[obj].y = y;
      } else {
          console.error(`Object "${obj}" not found in animation queue.`);
      }
  }

  function UpdateObjectbiggestPX(obj, size) {
      if (animationQueue[obj]) {
          animationQueue[obj].biggestPX = size;
      } else {
          console.error(`Object "${obj}" not found in animation queue.`);
      }
  }

  function UpdateObjectbiggestSize(obj, size) {
      if (animationQueue[obj]) {
          animationQueue[obj].biggestSize = size;
      } else {
          console.error(`Object "${obj}" not found in animation queue.`);
      }
  }

  function updateAnimations() {
      for (let obj in animationQueue) {
          let objData = animationQueue[obj];
          if (objData.currentAnimation != undefined) {
              let currentFrame = objData.currentFrame++;
              let animation = objData.animations[objData.currentAnimation];
              if (animation.length <= currentFrame) {
                  objData.currentFrame = 0;
                  currentFrame = 0;
              }
              let frameData = animation[currentFrame];
              if (objData.beforeDrawCallback != null)
                  objData.beforeDrawCallback[0](...objData.beforeDrawArgs);
              let spriteSheetInfos = objData.spriteSheet[objData.currentAnimation];
              let biggestPX = objData.biggestPX;

              let zoomPX = biggestSize / (biggestSize - biggestSize * biggestPX);

              let paddingx = objData.x + canvaswidth / 2 - (spriteSheetInfos[1] / 2) * zoomPX;

              let paddingy = objData.y + canvasheight - (spriteSheetInfos[2] * zoomPX * 0.75);
              let pixelW = spriteSheetInfos[1] * zoomPX;
              let pixelH = spriteSheetInfos[2] * zoomPX;

              let prevF = objData.previousFrameSize;
              if (prevF.length != 0)
                  ctxchar.clearRect(prevF[0] - 1, prevF[1] - 1, prevF[2] + 1, prevF[3] + 1);
              objData.previousFrameSize = [paddingx,
                  paddingy,
                  pixelW,
                  pixelH]
              ctxchar.drawImage(spriteSheetInfos[0],
                  frameData[0],
                  frameData[1],
                  spriteSheetInfos[1],
                  spriteSheetInfos[2],
                  paddingx,
                  paddingy,
                  pixelW,
                  pixelH
              );
          }
      }
  }

  //call UpdateAnimations once every 1s
  setInterval(updateAnimations, 250);
}
export default PhonePage;