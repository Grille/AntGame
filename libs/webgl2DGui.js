"use strict";

function initGL2DGui(window) {

  // console.log(window);

  // gl2D.gl.viewportWidth = canvas.width = window.innerWidth;
  // gl2D.gl.viewportHeight =canvas.height = window.innerHeight;

  //let window = window;
  let ctx = {

    mouseMove:(e)=>{},
    mouseDown:(e)=>{},
    mouseUp:(e)=>{},

    guiList: [],

    createGui: (texture,rectangle) => {
      let i = 0;
      while (true){
        if (guiList[i] === void 0 || guiList[i].live === false){
          guiList[i] = {
            live:true,
            enabled:false,
            visible:true,
            mouseIsHover:false,
            mouseIsDown:false,
            typ:0,
            rectangle:rectangle,
            rectangleSrc:[0,0,48,48],
            anchor:[true,true,false,false],
            texture: texture,
            color:[255,255,255,255],
            colorHover:[255,255,255,255],
            colorAktive:[230,230,230,255],
            borderSize:0,
            borderColor:[121, 152, 0,255],
            borderColorHover:[100, 206, 88,255],
            borderColorAktive:[100, 206, 88,255],
            mouseMove: (e) => {},
            mouseDown: (e) => {},
            mouseUp: (e) => {}

          }
          break;
        }
        else i++;
      }
      return guiList[i]
    },
    addButton: (texture,rectangle) => {
      let gui = ctx.createGui(texture,rectangle);
      gui.enabled = true;
      return gui;
    },
    render: (gl2D) => {

      let i = 0;
      while (guiList[i] !== void 0){//undefined 
        if (guiList[i].visible === true){
          let color;
          let bColor
          let bColor2
          let rct = guiList[i].rectangle;
          let rectangle = [rct[0],rct[1],rct[2],rct[3]];

          let addPos = 0;
          if (guiList[i].anchor[2]===true) rectangle[0] = window.innerWidth - rectangle[0] - rectangle[2];
          if (guiList[i].anchor[3]===true) rectangle[1] = window.innerHeight - rectangle[1] - rectangle[3];
          if (guiList[i].mouseIsDown === true && guiList[i].enabled === true){color = guiList[i].colorAktive;bColor = guiList[i].borderColor;bColor2 = guiList[i].borderColorAktive; addPos =1;}
          //else if (guiList[i].mouseIsHover === true && guiList[i].enabled === true){color = guiList[i].colorHover;bColor = guiList[i].borderColorHover;}
          else {color = guiList[i].color;bColor2 = guiList[i].borderColor;bColor = guiList[i].borderColorAktive;}

          let border = guiList[i].borderSize;
          if (border > 0){
            //drawTriangle : (texture,src,dst,inputColor) 
            let points = 
            [
              rectangle[0]-border,rectangle[1]+rectangle[3]+border,//ul
              rectangle[0]-border,rectangle[1]-border,//ol
              rectangle[0]+rectangle[2]+border,rectangle[1]-border,//or
              rectangle[0]+rectangle[2]+border,rectangle[1]+rectangle[3]+border,//ur
            ]
            let borderColor = [bColor[0],bColor[1],bColor[2],bColor[3], bColor[0],bColor[1],bColor[2],bColor[3], bColor[0],bColor[1],bColor[2],bColor[3]];
            let borderColor2 = [bColor2[0],bColor2[1],bColor2[2],bColor2[3], bColor2[0],bColor2[1],bColor2[2],bColor2[3], bColor2[0],bColor2[1],bColor2[2],bColor2[3]];
            gl2D.drawTriangle(gl2D.nullTexture,
              [0,0, 0,0, 0,0],
              [points[0],points[1], points[2],points[3], points[4],points[5]],
              borderColor);
            gl2D.drawTriangle(gl2D.nullTexture,
              [0,0, 0,0, 0,0],
              [points[4],points[5], points[6],points[7], points[0],points[1]],
              borderColor2);
          }
          
          gl2D.drawImage(guiList[i].texture,guiList[i].rectangleSrc,[rectangle[0]+addPos,rectangle[1]+addPos,rectangle[2]-addPos,rectangle[3]-addPos],color);
          
        }
        i++;
      }
    }
  };

  function g(e,gui){

    let r = gui.rectangle;
    let rectangle = [r[0],r[1],r[2],r[3]];
    if (gui.anchor[2]===true){
      rectangle[0] = window.innerWidth - rectangle[0] - rectangle[2];
    }
    if (gui.anchor[3]===true){
      rectangle[1] = window.innerHeight - rectangle[1] - rectangle[3];
    }
    return (
      e.clientX >= rectangle[0] && 
      e.clientY >= rectangle[1] && 
      e.clientX < rectangle[0] + rectangle[2] && 
      e.clientY < rectangle[1] + rectangle[3]
    )

  }
  let guiList = ctx.guiList;
  window.addEventListener("mousemove", (e) => {
    let hit = false;
    let i = 0;
    while (guiList[i] !== void 0){
      
      if (guiList[i].enabled === true && g(e,guiList[i]) ){
        guiList[i].mouseMove(e);
        guiList[i].mouseIsHover = true;
        hit = true;
      }
      else {
        guiList[i].mouseIsDown = false;
        guiList[i].mouseIsHover = false;
      }
      i++;
    }
    if (hit === false) ctx.mouseMove(e);
  })
  window.addEventListener("mousedown",(e) => {
    let hit = false;
    let i = 0;
    while (guiList[i] !== void 0){
      if (guiList[i].enabled === true && g(e,guiList[i])){
        guiList[i].mouseIsDown = true;
        guiList[i].mouseDown(e);
        hit = true;
      }
      i++;
    }
    if (hit === false) ctx.mouseDown(e);
  })
  window.addEventListener("mouseup",(e) => {
    let hit = false;
    let i = 0;
    while (guiList[i] !== void 0){
      if (guiList[i].enabled === true && g(e,guiList[i])){
        guiList[i].mouseIsDown = false;
        guiList[i].mouseUp(e);
        hit = true;
      }
      i++;
    }
    if (hit === false) ctx.mouseUp(e);
  })

  return ctx;

}

