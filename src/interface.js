"use strict";

let mouse = {
  isRightMB : false,
  x : 0,
  y : 0,
  dx : 0,
  dy : 0,
  mode : 0,
  down : false,
    setMouse : (e,mode) => { 
      if ("which" in e)  // Gecko (Firefox), WebKit (Safari/Chrome) & Opera
      mouse.isRightMB = e.which === 3; 
      else if ("button" in e)  // IE, Opera 
      mouse.isRightMB = e.button === 2; 

      mouse.x = e.clientX
      mouse.y = e.clientY
  }
};

function resize(){
  gl2D.gl.viewportWidth = canvas.width = window.innerWidth;
  gl2D.gl.viewportHeight =canvas.height = window.innerHeight;
}

let butList = [];
function buildGui(){
  for (let ix = 0;ix<20;ix++){
    butList[ix] = [];
    for (let iy = 0;iy < 2;iy++){
    butList[ix][iy]=gui.addButton(iconGraphic[0],[260 + 54 * ix+3,35+54*iy,48,48]);
    butList[ix][iy].anchor[3] = true;
    butList[ix][iy].borderSize = 3;
    butList[ix][iy].enabled = false;
    butList[ix][iy].visible = false;
    }
  }
  butList[1][0].enabled = true;
  butList[1][0].visible = true;
  butList[1][0].texture = iconGraphic[1];
  butList[1][0].mouseUp = () => {
    buildStatic(worldO,entityList[0].posX,entityList[0].posY,20)
    buildStatic(worldU,entityList[0].posX,entityList[0].posY,21)
    portEntity(0,worldU,entityList[0].posX,entityList[0].posY);
    discover(worldU,entityList[0].posX,entityList[0].posY,2);
  }
}
function addEvents(){
  
  butFullscreen.addEventListener('click', (e) => {
    if (document.body.requestFullScreen) {
      document.body.requestFullScreen();
    } else if (document.body.mozRequestFullScreen) {
      document.body.mozRequestFullScreen();
    } else if (document.body.webkitRequestFullScreen) {
      document.body.webkitRequestFullScreen(Element.ALLOW_KEYBOARD_INPUT);
    }
  }, false);

  butSwitchWorld.addEventListener('click', (e) => {
    if (curWorld === worldO)curWorld = worldU;
    else curWorld = worldO;
  }, false);

  gui.mouseMove = (e) => {
    mouse.setMouse(e,0);
    mouseEffents();
  }

  gui.mouseUp = (e) => {
    mouse.setMouse(e,0);
    if (mouse.isRightMB===true){
      sendEntity(0,mapMouseX,mapMouseY);
      //portEntity(0,null,mapMouseX,mapMouseY);
    }
    else{
      buildStatic(curWorld,mapMouseX,mapMouseY,curBuild);
      //portEntity(0,null,mapMouseX,mapMouseY);
    }
  }
  window.addEventListener("resize", resize); 

}

function mouseEffents(){

  let e = mouse;//let ex = (e.x)|0;let ey = (e.y)|0;
  //ex -= ((StaticEntity[aktGameObject].size-1) * 32);
  let fy = ((e.x / 64) + (e.y / 32));let fx = ((e.x / 64) - (e.y / 32))+100;//float

  let x = (fx-0.5);let y = (fy+0.5);
  // x-=0.5;
  // y+=0.5;
  x += mapPosX-98;y += mapPosY;
  // if (!mouse.isRightMB){ //Right
  mapMouseX = x|0;mapMouseY = y|0;
  mapMousePos = (x)|0+((y)|0)*worldWidth;


  let curHeight = 0;
  while(true){
    let nextHeight = worldHeightMap[mapMousePos-1+worldWidth]-curHeight;
    if (nextHeight>0){
      x-=nextHeight/32;
      y+=nextHeight/32;
      mapMousePos = mapMousePos -1 + worldHeight;
      curHeight = worldHeightMap[mapMousePos];

    }
    else break;
  }

  mapMouseX = x|0;mapMouseY = y|0;
  mapMousePos = (x)|0+((y)|0)*worldWidth;

  mapMoveX = 0;
  mapMoveY = 0;
  //console.log(e.x);
  if (e.x < 5) mapMoveX = -1;
  if (e.y < 5) mapMoveY = -1;
  if (e.x > canvas.width-5) mapMoveX = 1;
  if (e.y > canvas.height-5) mapMoveY = 1;
};
function mapScroal(factor){
  // mouseEffents();

  // skip function if nothing to do
  //if (mapMoveX === 0 && mapMoveY === 0) return void 0;

  //if (timeFactor<1)timeFactor=1;
  let oldPosX = mapPosX;
  let oldPosY = mapPosY;
  decmapPosX += (0 + mapMoveX*factor)|0;
  decmapPosY += (0 + mapMoveX*factor)|0;
  decmapPosX += (0 - mapMoveY*factor)|0;
  decmapPosY -= (0 - mapMoveY*factor)|0;

  //console.log ("... -> "+decmapPosX+" -> "+mapPosX);
  while (decmapPosX>=1===true){decmapPosX--;mapPosX++;}
  while (decmapPosX<0===true){decmapPosX++;mapPosX--;}
  while (decmapPosY>=1===true){decmapPosY--;mapPosY++;}
  while (decmapPosY<0===true){decmapPosY++;mapPosY--;}
        //mapMoveX = 0; mapMoveY = 0;
}
