"use strict";


function loadImage(path){
  let image = new Image();
  image.onload = function () {}
  image.src = path;
  return image;
}
function loadGameData(){
  let data = {};
  let request = new XMLHttpRequest();
  request.open("GET", "./data/templates.json", false);
  request.send(null)
  data.template = JSON.parse(request.responseText);
  request.open("GET", "./data/groundObjects.json", false);
  request.send(null)
  data.ground = JSON.parse(request.responseText);
  request.open("GET", "./data/staticObjects.json", false);
  request.send(null)
  data.staticObject = JSON.parse(request.responseText);
  request.open("GET", "./data/movableObjects.json", false);
  request.send(null)
  data.movableObject = JSON.parse(request.responseText);

  // request.open("GET", "./data/gameObjects.json", false);
  // request.send(null)
  // let data = JSON.parse(request.responseText);



  // let groundTexture = document.createElement("canvas");
  // let context  = groundTexture.getContext("2d");

  groundTextures = gl2D.textureFromFile(data.template.ground.path);

  for (let i = 0;i<data.ground.length;i++){
    groundObject[i] = {};

    if (data.ground[i].name === void 0) groundObject[i].name = data.template.ground.name;
    else groundObject[i].name = data.ground[i].name;

    if (data.ground[i].passable === void 0) groundObject[i].passable = data.template.ground.passable;
    else groundObject[i].passable = data.ground[i].passable;

    if (data.ground[i].offsetX === void 0) groundObject[i].offsetX = data.template.ground.offsetX*64;
    else groundObject[i].offsetX = data.ground[i].offsetX*64;

    if (data.ground[i].offsetY === void 0) groundObject[i].offsetY = data.template.ground.offsetY*64;
    else groundObject[i].offsetY = data.ground[i].offsetY*64;
      // context.imageSmoothingEnabled = false;//Chrome
      // context.mozImageSmoothingEnabled = false;//Firefox
      // canvas.width = img.width;
      // canvas.height = img.height;
      // context .drawImage(img, 0, 0, img.width, img.height);

  }

  for (let i = 0;i<data.staticObject.length;i++){
    staticObject[i+1] = {};

    if (data.staticObject[i].name === void 0) staticObject[i+1].name = data.template.staticObject.name;
    else staticObject[i+1].name = data.staticObject[i].name;

    if (data.staticObject[i].path === void 0) staticObject[i+1].path = data.template.staticObject.path;
    else staticObject[i+1].path = data.staticObject[i].path;

    if (data.staticObject[i].passable === void 0) staticObject[i+1].passable = data.template.staticObject.passable;
    else staticObject[i+1].passable = data.staticObject[i].passable;

    if (data.staticObject[i].size === void 0) staticObject[i+1].size = data.template.staticObject.size;
    else staticObject[i+1].size = data.staticObject[i].size;

    if (data.staticObject[i].versions === void 0) staticObject[i+1].versions = data.template.staticObject.versions;
    else staticObject[i+1].versions = data.staticObject[i].versions;

    if (data.staticObject[i].addGraphicWidth === void 0) staticObject[i+1].addGraphicWidth = data.template.staticObject.addGraphicWidth;
    else staticObject[i+1].addGraphicWidth = data.staticObject[i].addGraphicWidth;

    staticObject[i+1].texture = [];
    staticObject[i+1].overDraw = [];
    staticObject[i+1].animationPhases = [];
    for (let iv = 0;iv<staticObject[i+1].versions;iv++){
      let image = new Image();
      image.onload = function () {
        staticObject[i+1].texture[iv] = gl2D.textureFromImage(image);
        staticObject[i+1].overDraw[iv] = staticObject[i+1].texture[iv].height - 32;
        staticObject[i+1].animationPhases[iv] = (image.width-staticObject[i+1].addGraphicWidth*2) / (64*staticObject[i+1].size)-1
      }
      image.src = staticObject[i+1].path + "_" + iv + ".png";
    }
  }

  for (let i = 0;i<data.movableObject.length;i++){
    movableObject[i] = {};

    if (data.movableObject[i].name === void 0) movableObject[i].name = data.template.movableObject.name;
    else movableObject[i].name = data.movableObject[i].name;

    if (data.movableObject[i].path === void 0) movableObject[i].path = data.template.movableObject.path;
    else movableObject[i].path = data.movableObject[i].path;

    if (data.movableObject[i].hitPoints === void 0) movableObject[i].hitPoints = data.template.movableObject.hitPoints;
    else movableObject[i].hitPoints = data.movableObject[i].hitPoints;

    if (data.movableObject[i].speed === void 0) movableObject[i].speed = data.template.movableObject.speed;
    else movableObject[i].speed = data.movableObject[i].speed;

    // if (data.movableObject[i].size === void 0) movableObject[i].size = data.template.movableObject.size;
    // else movableObject[i].size = data.movableObject[i].size;

    if (data.movableObject[i].versions === void 0) movableObject[i].versions = data.template.movableObject.versions;
    else movableObject[i].versions = data.movableObject[i].versions;

    movableObject[i].texture = [];
    movableObject[i].animationPhases = [];
    for (let iv = 0;iv<movableObject[i].versions;iv++){
      let image = new Image();
      image.onload = function () {
        movableObject[i].texture[iv] = gl2D.textureFromImage(image);
        movableObject[i].animationPhases[iv] = 0;//image.width / (64*movableObject[i+1].size)-1
        movableObject[i].graphicSize = image.height/3;
      }
      image.src = movableObject[i].path + "_" + iv + ".png";
    }
  }

  nullTexture = gl2D.textureFromPixelArray(new Uint8Array([255,255,255]),1,1);
  guiTexture[0] = gl2D.textureFromFile("./data/png/gui/selectField.png");
}
