"use strict"
//global



function main(){
  //init game Data
  gl2D = webGL2DStart(canvas);
  gui = initGL2DGui(window);

  loadGameData();
  resize();
  buildGui();
  addEvents();
  world.generateMap();
  world.setAsExplored();
  updateAnimatonNr();
  startTimer();

  showMenu();
}




