"use strict"
//global



function main(){
  //init game Data
  gl2D = new WebGL2DContext(canvas);
  ctx = canvas2d.getContext('2d');
  console.log(ctx);
  gui = initGL2DGui(window);

  loadGameData();
  resize();
  //buildGui();
  addEvents();
  world.generateMap();
  world.setAsExplored();
  updateAnimatonNr();
  startTimer();

  showMenu();
}




