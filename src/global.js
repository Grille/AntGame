"use strict";

//contexts
let gl2D;
let gui;

let color = [255,255,255,255];
let mapMousePos = 0;
let mapMouseX = 0,mapMouseY = 0;
let mapMoveX = 0,mapMoveY = 0;
let mapPosX = 0,mapPosY = 0;
let decmapPosX = 0, decmapPosY = 0;
let worldWidth = 256;
let worldHeight = 256;
let worldHeightVertex = new Int16Array((worldWidth+1)*(worldHeight+1));
let worldHeightMap = new Uint16Array(worldWidth*worldHeight);
let animator = [];

let nullTexture;
let guiTexture = [];
let groundTextures;

let groundObject = [];
let staticObject = [];
let movableObject = [];

let entityList = [];


let worldO = {
  typ : new Uint8Array(worldWidth*worldHeight),
  walkable: new Uint8Array(worldWidth*worldHeight),
  way: new Uint16Array(worldWidth*worldHeight),
  ground : new Uint8Array(worldWidth*worldHeight),
  version : new Uint8Array(worldWidth*worldHeight),
  referenceX : new Uint8Array(worldWidth*worldHeight),
  referenceY : new Uint8Array(worldWidth*worldHeight),
  stability : new Uint8Array(worldWidth*worldHeight),
  entity:[],
}
let worldU = {
  typ : new Uint8Array(worldWidth*worldHeight),
  walkable: new Uint8Array(worldWidth*worldHeight),
  way: new Uint16Array(worldWidth*worldHeight),
  ground : new Uint8Array(worldWidth*worldHeight),
  version : new Uint8Array(worldWidth*worldHeight),
  referenceX : new Uint8Array(worldWidth*worldHeight),
  referenceY : new Uint8Array(worldWidth*worldHeight),
  stability : new Uint8Array(worldWidth*worldHeight),
  entity:[],
}
for (let i = 0;i<worldWidth*worldHeight;i++){
  worldO.entity[i] = [];
  worldU.entity[i] = [];
}

let curWorld = worldO;

let timeS = 0;
let timeM = 0;
let timeH = 12;

var Timer = Date.now();
var Timer025=0; 
var Timer100=0; 
var Timer250=0;
var Timer500=0;
