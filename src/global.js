"use strict";

//contexts
let gl2D;
let ctx;
let gui;

let color = [255,255,255,255];
let mapMousePos = 0;
let mapMouseX = 0,mapMouseY = 0;
let mapMoveX = 0,mapMoveY = 0;
let mapPosX = 0,mapPosY = 0;
let decmapPosX = 0, decmapPosY = 0;
let animator = [];

let selectetTyp = 0;
let selectetIndex = 0;
let nullTexture;
let guiTexture = [];
let groundTextures;
let underGroundTextures;
let underGroundWallTextures;

let effects = [];
let iconGraphic = [];
let groundObject = [];
let staticObject = [];
let movableObject = [];

let curBuild = 0;

let orderList = [];
let entityList = [];

let world = new World(256,256);
let curLayer = world.upperLayer;

let camera = new Camera(canvas);
let timeS = 0;
let timeM = 0;
let timeH = 12;

var Timer = Date.now();
var TimerScroal025=0; 
var Timer025=0; 
var Timer100=0; 
var Timer250=0;
var Timer500=0;
