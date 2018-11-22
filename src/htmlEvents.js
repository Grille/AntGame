function showMenu(){
  html_divMenu.style.display = "block";
  html_divGui.style.display = "none";
}
function hideMenu(){
  html_divMenu.style.display = "none";
  html_divGui.style.display = "block";
}

let keyCode = [];
function addEvents(){
  
  /*
  butFullscreen.addEventListener('click', (e) => {
    if (document.body.requestFullScreen) {
      document.body.requestFullScreen();
    } else if (document.body.mozRequestFullScreen) {
      document.body.mozRequestFullScreen();
    } else if (document.body.webkitRequestFullScreen) {
      document.body.webkitRequestFullScreen(Element.ALLOW_KEYBOARD_INPUT);
    }
  }, false);
*/

  html_btnMenu.addEventListener('click', (e) => {
    showMenu();
  }, false);
  html_btnNG.addEventListener('click', (e) => {
    newGame();
    hideMenu();
  }, false);
  html_btnLG.addEventListener('click', (e) => {
    load(html_tbFile.value);
    hideMenu();
  }, false);
  html_btnSG.addEventListener('click', (e) => {
    save(html_tbFile.value);
    hideMenu();
  }, false);
  html_btnDL.addEventListener('click', (e) => {
    download();
    hideMenu();
  }, false);
  html_btnB.addEventListener('click', (e) => {
    hideMenu();
  }, false);

  butSwitchWorld.addEventListener('click', (e) => {
    if (curLayer === world.upperLayer) curLayer = world.underLayer;
    else curLayer = world.upperLayer;
  }, false);

  window.onkeydown = (e) => {
    keyCode[e.code] = true;
    console.log(e.code);
    switch (e.code) {
      case "Escape":showMenu();break;
    }
  }
  window.onkeyup = (e) => {
    keyCode[e.code] = false;
  }

  window.ondragover = (e) => {
    e.preventDefault();
    console.log("dfs");
  }
  window.ondrop = (e) => {
    e.preventDefault();
    let reader = new FileReader();  
    reader.onload = function(event) {            
         unpackData(event.target.result);
         hideMenu();
    }        
    reader.readAsText(e.dataTransfer.files[0],"UTF-8");
  }
  gui.mouseMove = (e) => {
    mouse.updateMouse(e);
    mouseMove();
  }

  
  gui.mouseUp = (e) => {
    mouse.updateMouse(e);
    if (mouse.rightDown === true) {
      sendEntity(0, mapMouseX, mapMouseY);
      //portEntity(0,null,mapMouseX,mapMouseY);
    }
    else if (mouse.middleDown){
      camera.goTo(mapMouseX,mapMouseY);
    }
    else {
      curBuild = 10;
      curLayer.buildStatic(mapMouseX, mapMouseY, curBuild);
      curLayer.discovered[mapMouseX+mapMouseY*curLayer.width] = 2;
      //portEntity(0,null,mapMouseX,mapMouseY);
    }
  }
  
  window.addEventListener("resize", resize);

}