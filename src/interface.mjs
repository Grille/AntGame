export function resize(){
  gl2D.gl.viewportWidth = canvas.width = window.innerWidth;
  gl2D.gl.viewportHeight =canvas.height = window.innerHeight;
}

export function mouseMove(){
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

export function mapScroal(factor){
  camera.move(mapMoveX,mapMoveY);
}
