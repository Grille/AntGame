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

function buildHTML(){
  var button = document.createElement('p');
  button.textContent = 'Click to start game in fullscreenmode';
  button.title = 'Press F11 to enter or leave fullscreen mode';
  button.setAttribute('style', 'position: fixed; top: -16px; left: 0px;width: 256px;height: 32px; background: #004; color: #0f0; opacity: 0.5; cursor: pointer;')
  
  button.addEventListener('click', function(event) {
    if (document.body.requestFullScreen) {
      document.body.requestFullScreen();
    } else if (document.body.mozRequestFullScreen) {
      document.body.mozRequestFullScreen();
    } else if (document.body.webkitRequestFullScreen) {
      document.body.webkitRequestFullScreen(Element.ALLOW_KEYBOARD_INPUT);
    }
  }, false);
  document.body.appendChild(button);

  button = document.createElement('p');
  button.textContent = 'switch world';
  button.title = 'Press F11 to enter or leave fullscreen mode';
  button.setAttribute('style', 'position: fixed; top: -16px; left: 256px;width: 256px;height: 32px; background: #004; color: #0f0; opacity: 0.5; cursor: pointer;')
  
  button.addEventListener('click', function(event) {

    if (curWorld === worldO)curWorld = worldU;
    else curWorld = worldO;
  }, false);
  document.body.appendChild(button);
  
}
function addEvents(){


  window.addEventListener("mousemove", (e) => {
    mouse.setMouse(e,0);
    mouseEffents();
    
  })
  window.addEventListener("mouseup",(e) => {
    mouse.setMouse(e,0);
    if (mouse.isRightMB===true){
      sendEntity(0,mapMouseX,mapMouseY);
    }
    else{
      buildStatic(curWorld,mapMouseX,mapMouseY,1)
    }
  })
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
  if (e.x < 10) mapMoveX = -1;
  if (e.y < 10) mapMoveY = -1;
  if (e.x > canvas.width-10) mapMoveX = 1;
  if (e.y > canvas.height-10) mapMoveY = 1;
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
