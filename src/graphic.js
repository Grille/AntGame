"use strict";

//let groundColor = new Uint8Array([255,255,255,255, 255,255,255,255, 255,255,255,255, 255,255,255,255]);
let groundSrc = new Uint8Array([0,0, 64,0, 64,64, 0,64]);

function drawGround(texture, typ, worldPos,vertexWorldPos, pos){
  let offsetX = groundObject[typ].offsetX;
  let offsetY = groundObject[typ].offsetY;
  let groundSrc = [offsetX+0,offsetY+0, offsetX+64,offsetY+0, offsetX+64,offsetY+64, offsetX+0,offsetY+64];
  let heightVertex = worldHeightVertex;
  let r=color[0],g=color[1],b=color[2],a=color[3];
  let groundColor = [0,0,0,a, 0,0,0,a, 0,0,0,a, 0,0,0,a]

  let discovered = curWorld.discovered;
  //u
  if (discovered[worldPos+worldWidth-1] ===1 && discovered[worldPos+worldWidth] ===1 && discovered[worldPos-1] ===1){groundColor[0]=r;groundColor[1]=g;groundColor[2]=b;}
  else if (discovered[worldPos+worldWidth-1] >0 && discovered[worldPos+worldWidth] >0 && discovered[worldPos-1] >0){groundColor[0]=r/2;groundColor[1]=g/2;groundColor[2]=b/2;}
  //r
  if (discovered[worldPos+worldWidth+1] === 1 && discovered[worldPos+worldWidth] ===1 && discovered[worldPos+1] ===1){groundColor[4]=r;groundColor[5]=g;groundColor[6]=b;}
  else if (discovered[worldPos+worldWidth+1] >0 && discovered[worldPos+worldWidth] >0 && discovered[worldPos+1] >0){groundColor[4]=r/2;groundColor[5]=g/2;groundColor[6]=b/2;}
  //o
  if (discovered[worldPos-worldWidth+1] === 1 && discovered[worldPos-worldWidth] ===1 && discovered[worldPos+1] ===1){groundColor[8]=r; groundColor[9]=g;groundColor[10]=b;}
  else if (discovered[worldPos-worldWidth+1] >0 && discovered[worldPos-worldWidth] >0 && discovered[worldPos+1] >0){ groundColor[8]=r/2;groundColor[9]=g/2; groundColor[10]=b/2;}
  //l
  if (discovered[worldPos-worldWidth-1] === 1 && discovered[worldPos-worldWidth] ===1 && discovered[worldPos-1] ===1){groundColor[12]=r;groundColor[13]=g;groundColor[14]=b;}
  else if (discovered[worldPos-worldWidth-1] >0 && discovered[worldPos-worldWidth] >0 && discovered[worldPos-1] >0){groundColor[12]=r/2;groundColor[13]=g/2;groundColor[14]=b/2;}
  
  let vertexPos = 
  [
    32,32-heightVertex[vertexWorldPos+(worldWidth+1)]/*u*/, 
    64,16-heightVertex[vertexWorldPos+1+(worldWidth+1)]/*r*/, 
    32,0-heightVertex[vertexWorldPos+1]/*o*/, 
    0,16-heightVertex[vertexWorldPos]/*l*/
  ];
  gl2D.matrix.setTranslate([pos[0],pos[1]])
  gl2D.drawSquare(texture,groundSrc,vertexPos/*l*/,groundColor);
  gl2D.matrix.reset();
}

function setAnimator() {
  for (let ii = 0; ii < 20; ii++){
  if (animator[ii] < ii) animator[ii]++;
  else animator[ii] = 0;
  }
};

let now = 0;
let startTime = 0;
let useTime = 0;
let bindTime = 0;
let renderTime = 0;

function render(curWorld) { 
  if (curWorld.typ !== void 0){
    // try{
      let date = Date.now();
      let last = date;
      let tmplast

      tmplast = Date.now();
      gl2D.startScene();
      date = Date.now();
      startTime = (startTime*3 + (date - tmplast))/4;

      tmplast = Date.now();

      // groundColor[0]=groundColor[4]=groundColor[8]=groundColor[12]=color[0];
      // groundColor[1]=groundColor[5]=groundColor[9]=groundColor[13]=color[1];
      // groundColor[2]=groundColor[6]=groundColor[10]=groundColor[14]=color[2];
      // groundColor[3]=groundColor[7]=groundColor[11]=groundColor[15]=color[3];

      let width = canvas.width, height=canvas.height;
      let Indentation = 0;
      let posx = 0;
      let posy = 0;
      let addPosX = (width / 64 + 2)|0 ;
      let addPosY = 1;
      let aktPosX = ((mapPosX|0) + addPosX + addPosY);
      let aktPosY = ((mapPosY|0) + addPosX - addPosY);
      let drawList = [];
      let drawListIndex = 0;
      let fogDrawList = [];
      let fogDrawListIndex = 0;
      for (let iy = -1; iy <= (((height+256)/16))|0; iy++) {
        if (Indentation == 0) {Indentation=1;posy++;posx--;}
        else Indentation = 0;
        aktPosX = ((mapPosX|0)+addPosX+addPosY+posx+Indentation);
        aktPosY = ((mapPosY|0)+addPosX-addPosY+posy);
        for (let ix = ((width / 64))|0; ix >= -1;ix--){
          aktPosX--;
          aktPosY--;
          if (aktPosX < worldWidth && aktPosX >= 0 && aktPosY < worldHeight && aktPosY >= 0 ){
            let worldOffset = aktPosX+aktPosY*worldWidth;
            if (curWorld.discovered[worldOffset] !== 0){
              let drawPosX = 64*ix+32*Indentation;
              let drawPosY = 16*iy;
              //gl2D.drawImage(texture,[0,0,64,32],[drawPosX,drawPosY,64,32],color);
              //if (groundTexture !== void 0)
              drawGround(groundTextures,curWorld.ground[worldOffset], worldOffset, aktPosX+aktPosY*(worldWidth+1),[drawPosX,drawPosY]);
              // let isAktField = (aktPosX >= aktPlayerPosX && aktPosY >= aktPlayerPosY && aktPosX < aktPlayerPosX + StaticEntity[aktGameObject].size && aktPosY < aktPlayerPosY + StaticEntity[aktGameObject].size)
              let aktReferenceX = (curWorld.referenceX[worldOffset]);
              let aktReferenceY = (curWorld.referenceY[worldOffset]);
              let refOffset = aktPosX - aktReferenceX+(aktPosY -aktReferenceY)*worldWidth;
              let typ = curWorld.typ[refOffset];
              let height = worldHeightMap[refOffset];
              let version = curWorld.version[refOffset]; 
          

              let sObject = staticObject[typ];
              if (typ > 0 && sObject.texture[version] !== void 0){

                let addGraphicWidth = sObject.addGraphicWidth;
                let envcode = 0;//findEnvorimentCode(aktWorld,aktPosX, aktPosY, sObject.envmode);//env code for auto tile (0000 - 1111)
                let overDraw = sObject.overDraw[version];
                let animPhase = sObject.animationPhases[version];
                let anim = animator[animPhase-1];
                let imgSrcX = (aktReferenceX * 32)+ (aktReferenceY * 32) + (sObject.size * 64 + 128) * (anim);
                let imgSrcY = 16 * (sObject.size - 1) -(aktReferenceX * 16) + (aktReferenceY * 16);

                if (curWorld.discovered[worldOffset] === 1){
                  drawList[drawListIndex++] = [sObject.texture[version], [imgSrcX,imgSrcY,64+addGraphicWidth*2,32+overDraw],[drawPosX-addGraphicWidth,drawPosY-overDraw-height,64+addGraphicWidth*2,32+overDraw],color];
                }
                else{
                  drawList[drawListIndex++] = [sObject.texture[version], [imgSrcX,imgSrcY,64+addGraphicWidth*2,32+overDraw],[drawPosX-addGraphicWidth,drawPosY-overDraw-height,64+addGraphicWidth*2,32+overDraw],[color[0]/2,color[1]/2,color[2]/2,color[3]]];
                }
              }

              if (curWorld.discovered[worldOffset] === 1){
                for (let i = 0; i<curWorld.entity[worldOffset].length;i++){
                  let curEntity = entityList[curWorld.entity[worldOffset][i]];
                  if (movableObject[curEntity.typ].texture[0] !== void 0){
                    let entitySize = movableObject[curEntity.typ].graphicSize;
                    let entitySrcX = (curEntity.directionX+1)*(entitySize)*2;
                    let entitySrcY = (curEntity.directionY+1)*(entitySize);

                    let directionPosX = (curEntity.moveProcess*32)*curEntity.directionX+(curEntity.moveProcess*32)*curEntity.directionY;
                    let directionPosY = -(curEntity.moveProcess*16)*curEntity.directionX+(curEntity.moveProcess*16)*curEntity.directionY;

                    drawList[drawListIndex++] = [movableObject[curEntity.typ].texture[0], [entitySrcX,entitySrcY,entitySize*2,entitySize],[drawPosX+directionPosX,drawPosY-height+directionPosY,64,32],color];
                  }
                }
              }

              if (worldOffset === mapMousePos) {
                drawGround(guiTexture[0],0, worldOffset,aktPosX+aktPosY*(worldWidth+1),[drawPosX,drawPosY]);
              }

            }
            else {
              //drawGround(guiTexture[0],0, worldOffset,aktPosX+aktPosY*(worldWidth+1),[drawPosX,drawPosY]);
              //fogDrawList[fogDrawListIndex++] = [effects[0], [0,0,64*3,32*3],[drawPosX-64,drawPosY-height-32,64*3,32*3],color];
            }
          }
        }
      }
      for (let i = 0;i<drawListIndex;i++){
        gl2D.drawImage(drawList[i][0], drawList[i][1],drawList[i][2],drawList[i][3]);
      }
      // for (let i = 0;i<fogDrawListIndex;i++){
      //   gl2D.drawImage(fogDrawList[i][0], fogDrawList[i][1],fogDrawList[i][2],fogDrawList[i][3]);
      // }
      //gl2D.drawPrimitives(nullTexture,groundSrc,[0,0, width,0, width,height, 0,height],[200,200,255,50, 200,200,255,50, 200,200,255,0, 200,200,255,0]);
      date = Date.now();
      useTime = (useTime*3 + (date - tmplast))/4;

      gl2D.drawImage(nullTexture,[0,0,1,1],[0,32,256,16],[100,100,100,255]);
      if ((now/16.66) < 1) gl2D.drawImage(nullTexture,[0,0,1,1],[0,35,(now/16.66)*256,10],[(now/16.66)*255,200,0,255]);
      else {
        gl2D.drawImage(nullTexture,[0,0,1,1],[0,35,256,10],[255,150,0,255]);
        gl2D.drawImage(nullTexture,[0,0,1,1],[0,35,(now/16.66)*256-256,10],[255,0,0,255]);
      }
      let fullTime = useTime + bindTime + renderTime;
      gl2D.drawImage(nullTexture,[0,0,1,1],[0,48,256,16],[100,100,100,255]);
      gl2D.drawImage(nullTexture,[0,0,1,1],[0,51,(useTime/fullTime)*256,10],[200,0,0,255]);
      gl2D.drawImage(nullTexture,[0,0,1,1],[0+(useTime/fullTime)*256,51,(bindTime/fullTime)*256,10],[0,200,0,255]);
      gl2D.drawImage(nullTexture,[0,0,1,1],[0+(useTime/fullTime)*256+(bindTime/fullTime)*256,51,(renderTime/fullTime)*256,10],[0,0,200,255]);

      gui.render(gl2D);
      tmplast = Date.now();
      gl2D.endScene();//--
      date = Date.now();
      bindTime = (bindTime*3 + (date - tmplast))/4;
      
      tmplast = Date.now();
      gl2D.renderScene();//--
      date = Date.now();
      renderTime = (renderTime*3 + (date - tmplast))/4;
      date = Date.now();
      now = (now*3 + (date - last))/4;
      
     //console.log("FPS => "+(Date.now()-date));
    // }
    // catch(e) {console.log(e);}
  }
} 

