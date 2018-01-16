"use strict";


function renderTimer(){
  render(curWorld);
  setTimeout(renderTimer, 16);
  }
  function timer(){
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
      simulateEntity(i++);
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

    if (curWorld === worldO){

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
    else color = [200,200,200,255];

    setAnimator();
  }

  date = Date.now();
  while (Timer500>500){
    Timer500-=500;
  }

  Timer = Date.now();

  setTimeout(timer, 10);
}

