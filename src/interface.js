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
        //console.log("-----------------------------------------------------------------------sm")
        //console.log(e);

        if ("which" in e)  // Gecko (Firefox), WebKit (Safari/Chrome) & Opera
        mouse.isRightMB = e.which === 3; 
        else if ("button" in e)  // IE, Opera 
        mouse.isRightMB = e.button === 2; 

        mouse.x = e.clientX
        mouse.y = e.clientY

        //this.mode = mode;
        // switch (mode)
        // {
        //   case 0:break;
        //   case 1:
        //   this.down = true;
        //   this.dx = this.x;
        //   this.dy = this.y;
        //   break;
        //   case 2:
        //   this.down = false;
        //   break;
        // }
        //console.log("mode:"+this.mode+ " down:"+this.down)
    }
};

function resize(){

  gl2D.gl.viewportWidth = canvas.width = window.innerWidth;
  gl2D.gl.viewportHeight =canvas.height = window.innerHeight;
  // context.font = "12px Arial";
  // context.fillStyle = "#000";

}

//let gui = []
let butList = [];
function buildHTML(){

  
  for (let ix = 0;ix<20;ix++){
    butList[ix] = [];

    for (let iy = 0;iy < 2;iy++){
    butList[ix][iy]=gui.addButton(iconGraphic[0],[260 + 52 * ix,34+52*iy,48,48]);
    butList[ix][iy].anchor[3] = true;
    butList[ix][iy].enabled = false;
    butList[ix][iy].visible = false;
    }
  }

  butList[1][0].enabled = true;
  butList[1][0].visible = true;
  butList[1][0].texture = iconGraphic[1];

  butList[1][0].mouseUp = () => {

    buildStatic(worldO,entityList[0].posX,entityList[0].posY,2)
    buildStatic(worldU,entityList[0].posX,entityList[0].posY,2)

    entityList[0].world = worldU;
    worldO.discovered[entityList[0].pos] = 1;
  }

  // for (let i = 0;i<20;i++){
  //   butList[i] = [];
  //   butList[i][0]=document.createElement('button');
  //   butList[i][0].textContent = i + ";" + 0;
  //   butList[i][0].setAttribute("style", "position: fixed; bottom: 80px; left: "+ (260 + 48 * i) + "px;width: 48px;height: 48px; background: #671; opacity: 1;")
  //   document.body.appendChild(butList[i][0]);
    
  //   butList[i][1]=document.createElement('button');
  //   butList[i][1].textContent = i + ";" + 1;
  //   butList[i][1].setAttribute("style", "position: fixed; bottom: 32px; left: "+ (260 + 48 * i) + "px;width: 48px;height: 48px; background: #671; opacity: 1;")
  //   document.body.appendChild(butList[i][1]);
  // }
    //top bar
  // guidiv[0] = document.createElement('div');
  // guidiv[0].setAttribute('style', 'position: fixed; top: 0px; left: 0px;width: 100%;height: 32px; background: #671; opacity: 1;')
  // document.body.appendChild(guidiv[0]);

  // guidiv[1] = document.createElement('div');
  // guidiv[1].setAttribute('style', 'position: fixed; bottom: 0px; left: 0px;width: 100%;height: 32px; background: #671; opacity: 1;')
  // document.body.appendChild(guidiv[1]);

  // guidiv[2] = document.createElement('div');
  // guidiv[2].setAttribute('style', 'position: fixed; bottom: 32px; left: 0px;width: 128px;height: 128px; background: #671; opacity: 1;')
  // document.body.appendChild(guidiv[2]);

  // gui[0] = document.createElement('button');
  // gui[0].textContent = 'Click to start game in fullscreenmode';
  // gui[0].title = 'Press F11 to enter or leave fullscreen mode';
  // gui[0].setAttribute('style', 'position: fixed; top: 0px; left: 0px;width: 256px;height: 32px; background: #561; color: #0f0; opacity: 1; cursor: pointer;border: 1px solid green;transition: 0s')
  // document.body.appendChild(gui[0]);

  // gui[1] = document.createElement('button');
  // gui[1].textContent = 'switch world';
  // gui[1].title = 'Press F11 to enter or leave fullscreen mode';
  // gui[1].setAttribute('style', 'position: fixed; top: 0px; left: 256px;width: 256px;height: 32px; background: #561; color: #0f0; opacity: 1; cursor: pointer;border: 1px solid green;transition: 0s')
  // document.body.appendChild(gui[1]);

  
}
function addEvents(){

  butFullscreen.addEventListener('click', function(event) {
    if (document.body.requestFullScreen) {
      document.body.requestFullScreen();
    } else if (document.body.mozRequestFullScreen) {
      document.body.mozRequestFullScreen();
    } else if (document.body.webkitRequestFullScreen) {
      document.body.webkitRequestFullScreen(Element.ALLOW_KEYBOARD_INPUT);
    }
  }, false);

 
  butSwitchWorld.addEventListener('click', function(event) {
    
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
    }
    else{
      buildStatic(curWorld,mapMouseX,mapMouseY,10)
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

//console.log("height => "+curWorld.height[mapMousePos]);

    mapMousePos = (x)|0+((y)|0)*worldWidth;
    //console.log("x => "+x);


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
