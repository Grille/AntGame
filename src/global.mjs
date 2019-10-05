import World from "./world.mjs"
import Camera from "./camera.mjs"
//contexts
export let gl2D;
export let ctx;

export let color = [255,255,255,255];
export let mapMousePos = 0;
export let mapMouseX = 0,mapMouseY = 0;
export let mapMoveX = 0,mapMoveY = 0;
export let animator = [];

export let nullTexture;
export let guiTexture = [];
export let groundTextures;
export let underGroundTextures;
export let underGroundWallTextures;

export let effects = [];
export let iconGraphic = [];
export let groundObject = [];
export let staticObject = [];
export let movableObject = [];

export let curBuild = 0;

export let entityList = [];

export let world = new World(256,256);
export let curLayer = world.upperLayer;

export let camera = new Camera(canvas);

export let keyCode = [];

export let mouse = {
  rightDown : false,
  leftDown : false,
  middleDown : false,
  x : 0,
  y : 0,
  divx : 0,
  divy : 0,
  updateMouse : (e) => { 
    if ("which" in e){  // Gecko (Firefox), WebKit (Safari/Chrome) & Opera
      mouse.leftDown = e.which === 1; 
      mouse.middleDown = e.which === 2; 
      mouse.rightDown = e.which === 3; 
    }
    else if ("button" in e){  // IE, Opera 
      mouse.rightDown = e.button === 2; 
    }
    mouse.divx = e.clientX-mouse.x;
    mouse.divy = e.clientY-mouse.y;

    mouse.x = e.clientX;
    mouse.y = e.clientY;
  }
};