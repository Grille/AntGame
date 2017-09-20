"use strict";


function renderTimer(){
  render(curWorld);
  setTimeout(renderTimer, 16);
}
function timer(){
  let ms = Date.now() - Timer;
  //DebugString[0]=ms;
  let date;let totalDate = Date.now();
  Timer025+=ms;
  Timer100+=ms;
  Timer250+=ms; 
  Timer500+=ms;

      

      date = Date.now();
      while (Timer025>25){
        Timer025-=25;
        mapScroal(1);

      }

      date = Date.now();
      while (Timer100>100){
        Timer100-=100;

        timeM++;
        if (timeM >= 60){
          timeM = 0;
          timeH++;
          if (timeH >= 24){
            timeH = 0;
          }
        }
        if (timeH===7){
          let pro = 1-timeM/60;
          let add = 255*(1-pro);
          color = [100*pro+add,100*pro+add,150*pro+add,255];
        }
        if (timeH===20){
          let pro = timeM/60;
          let add = 255*(1-pro);
          color = [100*pro+add,100*pro+add,150*pro+add,255];
        }

        simulateEntity(0);
        //console.log("time = "+timeH);
      }

      date = Date.now();
      if (Timer250>250){
        Timer250-=250;
        setAnimator();
      }

      date = Date.now();
      if (Timer500>500){
        Timer500-=500;
        console.log(mapMouseX + ";"+mapMouseY);
      }

    Timer = Date.now();

    setTimeout(timer, 10);
}

