"use strict";

let mouse = {
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

function resize(){
  gl2D.gl.viewportWidth = canvas.width = window.innerWidth;
  gl2D.gl.viewportHeight =canvas.height = window.innerHeight;
}

let butList = [];
/*
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
*/








function mouseMove(){

  let fx = ((mouse.x / (64*camera.scale)) - (mouse.y / (32*camera.scale)));let fy = ((mouse.x / (64*camera.scale)) + (mouse.y / (32*camera.scale)));//float

  let x = (fx-0.5);let y = (fy+0.5);
  // x-=0.5;
  // y+=0.5;
  x += camera.posX*camera.scale+2;y += camera.posY*camera.scale;
  // if (!mouse.isRightMB){ //Right
  mapMouseX = x|0;mapMouseY = y|0;
  mapMousePos = (x)|0+((y)|0)*world.width;


  let curHeight = 0;
  while(true){
    let nextHeight = world.heightMap[mapMousePos-1+world.width]-curHeight;
    if (nextHeight>0){
      x-=nextHeight/32;
      y+=nextHeight/32;
      mapMousePos = mapMousePos -1 + world.height;
      curHeight = world.heightMap[mapMousePos];

    }
    else break;
  }

  mapMouseX = x|0;mapMouseY = y|0;
  mapMousePos = (x)|0+((y)|0)*world.width;

  mapMoveX = mapMoveY = 0;
  if(mouse.middleDown){
    //mapMoveX += 1;
    //mapMoveY += mouse.divy*0.5;
  }
  if(window.innerWidth == screen.width && window.innerHeight == screen.height) {
    if (mouse.x < 5) mapMoveX = -1;
    if (mouse.y < 5) mapMoveY = -1;
    if (mouse.x > canvas.width-5) mapMoveX = 1;
    if (mouse.y > canvas.height-5) mapMoveY = 1;
  }


  
  let pos = mapMouseX+mapMouseY*curLayer.width;
  let text = "";
  text+="typ: "+staticObject[curLayer.typ[pos]].name+"<br>";
  text+="ground: "+groundObject[curLayer.ground[pos]].name+"<br>";
  text+="build: "+staticObject[curBuild].name+"<br>";
  html_mouseInfo.innerHTML = text;
  html_mouseInfo.style.left = (mouse.x+32)+"px";
  html_mouseInfo.style.top = (mouse.y+-16)+"px";
};
function mapScroal(factor){
  camera.move(mapMoveX,mapMoveY);
}
