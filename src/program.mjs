import { WebGL2DContext } from "../libs/webgl2D.mjs"
import { loadGameData } from "./load.mjs"
import { resize, mapScroal } from "./interface.mjs"
import { addEvents, showMenu } from "./htmlEvents.mjs"
import { updateAnimatonNr, render } from "./graphic.mjs"

let timeM = 0;
let timeH = 12;

let Timer = Date.now();
let TimerScroal025=0; 
let Timer025=0; 
let Timer100=0; 
let Timer250=0;
let Timer500=0;

export function main(){
  //init game Data
  gl2D = new WebGL2DContext(canvas);
  ctx = canvas2d.getContext('2d');
  //gui = initGL2DGui(window);

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
function startTimer(){
  renderTimer();
  logicTimer();
}
function renderTimer(){
  render(curLayer);
  setTimeout(renderTimer, 16);
}
function logicTimer(){
  let ms = Date.now() - Timer;
  let factor = 1;
  //DebugString[0]=ms;
  let date;let totalDate = Date.now();
  TimerScroal025+=ms;
  Timer025+=ms*factor;
  Timer100+=ms*factor;
  Timer250+=ms*factor; 
  Timer500+=ms*factor;



  date = Date.now();
  while (TimerScroal025>25){
    TimerScroal025-=25;
    mapScroal(1);

    if (keyCode["ArrowUp"])camera.move(0,-1);
    if (keyCode["ArrowRight"])camera.move(1,0);
    if (keyCode["ArrowDown"])camera.move(0,1);
    if (keyCode["ArrowLeft"])camera.move(-1,0);

  }
  date = Date.now();
  while (Timer025>25){
    Timer025-=25;

  }

  date = Date.now();
  while (Timer100>100){
    Timer100-=100;
    let i = 0;
    while (true){
      if (entityList[i] === void 0)break;
      updateEntity(i++);
    }
  }

  date = Date.now();
  while (Timer250>250){
    Timer250-=250;

    timeM++;
    if (timeM >= 60){
      timeM = 0;
      timeH++;
      if (timeH >= 24){
        timeH = 0;
      }
    }

    if (curLayer === world.upperLayer){

      if (timeH===7){
        let pro = 1-timeM/60;
        let add = 255*(1-pro);
        color = [200*pro+add,200*pro+add,255*pro+add,255];
      }
      else if (timeH===20){
        let pro = timeM/60;
        let add = 255*(1-pro);
        color = [200*pro+add,200*pro+add,255*pro+add,255];
      }
      else if (timeH > 7 && timeH < 20){
        color = [255,255,255,255];
      }
      else{
        color = [200,200,255,255];
      }
    }
    else color = [255,255,255,255];

    updateAnimatonNr();
  }

  date = Date.now();
  while (Timer500>500){
    Timer500-=500;
  }

  Timer = Date.now();

  setTimeout(logicTimer, 10);
}

