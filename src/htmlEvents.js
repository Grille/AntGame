//html_divGui.style.pointerEvents = "none";

let cmdIndex = 0;
let cmdMemory = [];

function showMenu() {
  html_divMenu.style.display = "block";
  html_divGui.style.display = "none";
}
function hideMenu() {
  html_divMenu.style.display = "none";
  html_divGui.style.display = "block";
}

let keyCode = [];
function addEvents() {

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
      case "Escape": showMenu(); break;
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
    reader.onload = function (event) {
      unpackData(event.target.result);
      hideMenu();
    }
    reader.readAsText(e.dataTransfer.files[0], "UTF-8");
  }
  window.onmousemove = (e) => {
    mouse.updateMouse(e);
    mouseMove();
  }


  canvas.onmouseup = (e) => {
    mouse.updateMouse(e);
    if (mouse.rightDown === true) {
      sendEntity(0, mapMouseX, mapMouseY);
      //portEntity(0,null,mapMouseX,mapMouseY);
    }
    else if (mouse.middleDown) {
      camera.goTo(mapMouseX, mapMouseY);
    }
    else {
      curLayer.buildStatic(mapMouseX, mapMouseY, curBuild);
      curLayer.discover(mapMouseX,mapMouseY,0);
      //curLayer.discovered[mapMouseX + mapMouseY * curLayer.width] = 2;
      //portEntity(0,null,mapMouseX,mapMouseY);
    }
  }

  window.addEventListener("resize", resize);

  html_cmd.onkeyup = (e) => {
    if (e.code =="ArrowUp" && cmdIndex > 0)html_cmd.value = cmdMemory[--cmdIndex];
    if (e.code=="ArrowDown" && cmdMemory[cmdIndex+1]!==void 0)html_cmd.value = cmdMemory[++cmdIndex];
  }

  html_cmd.onchange = (e) => {
    let cmdvalue = html_cmd.value.split(" ");
    let canApply = false;
    if (cmdvalue.length == 2) {
      let command = cmdvalue[0];
      let value = cmdvalue[1];
      switch (command) {
        case "build":
          curBuild = parseInt(value);
          canApply = true;
          break;
        case "scale":
          camera.scale = parseFloat(value);
          canApply = true;
          break;
      }
    }
    else {
      let command = cmdvalue[0];
      switch (command) {
        case "discover":
          world.setAsExplored();
          canApply = true;
          break;
      }
    }

    if (canApply){
      cmdMemory[cmdIndex++] = html_cmd.value;
      html_cmd.value = "";
    }
  }

}

