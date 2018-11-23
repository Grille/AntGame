"use strict";

//let groundColor = new Uint8Array([255,255,255,255, 255,255,255,255, 255,255,255,255, 255,255,255,255]);
let groundSrc = new Uint8Array([0, 0, 64, 0, 64, 64, 0, 64]);

function drawWall(worldPos, pos,color,mirror,ref) {

  let groundID = curLayer.ground[worldPos+ref];
  let offsetX = groundObject[groundID].offsetX;
  let offsetY = groundObject[groundID].offsetY;
  let groundSrc = [offsetX + 0, offsetY + 0, offsetX + 64, offsetY + 0, offsetX + 64, offsetY + 64, offsetX + 0, offsetY + 64];

  let posl = mirror * 64;
  let r = color[0], g = color[1], b = color[2], a = color[3];
  let groundColor = [r,g,b,a, r,g,b,a, r,g,b,a, r,g,b,a]
  let vertexPos = [posl, -16, 32, -32, 32, 0, posl, 16];

  vertexPos[0]+=pos[0];  vertexPos[1]+=pos[1];
  vertexPos[2]+=pos[0];  vertexPos[3]+=pos[1];
  vertexPos[4]+=pos[0];  vertexPos[5]+=pos[1];
  vertexPos[6]+=pos[0];  vertexPos[7]+=pos[1];

  return [1,underGroundWallTextures,groundSrc,vertexPos,groundColor];
}
function drawGround(texture, groundID, worldPos, vertexWorldPos, pos,smoth) {
  let offsetX = groundObject[groundID].offsetX;
  let offsetY = groundObject[groundID].offsetY;
  let groundSrc = [offsetX + 0, offsetY + 0, offsetX + 64, offsetY + 0, offsetX + 64, offsetY + 64, offsetX + 0, offsetY + 64];
  let heightVertex = world.heightVertex;
  let r = color[0], g = color[1], b = color[2], a = color[3];
  let groundColor;

  if (smoth) {

    groundColor = [0, 0, 0, a, 0, 0, 0, a, 0, 0, 0, a, 0, 0, 0, a]

    let fog = 0.75;
    let discovered = curLayer.discovered;
    //u
    if (discovered[worldPos + world.width - 1] >= 2 && discovered[worldPos + world.width] >= 2 && discovered[worldPos - 1] >= 2) { groundColor[0] = r; groundColor[1] = g; groundColor[2] = b; }
    else if (discovered[worldPos + world.width - 1] > 0 && discovered[worldPos + world.width] > 0 && discovered[worldPos - 1] > 0) { groundColor[0] = r * fog; groundColor[1] = g * fog; groundColor[2] = b * fog; }
    //r
    if (discovered[worldPos + world.width + 1] >= 2 && discovered[worldPos + world.width] >= 2 && discovered[worldPos + 1] >= 2) { groundColor[4] = r; groundColor[5] = g; groundColor[6] = b; }
    else if (discovered[worldPos + world.width + 1] > 0 && discovered[worldPos + world.width] > 0 && discovered[worldPos + 1] > 0) { groundColor[4] = r * fog; groundColor[5] = g * fog; groundColor[6] = b * fog; }
    //o
    if (discovered[worldPos - world.width + 1] >= 2 && discovered[worldPos - world.width] >= 2 && discovered[worldPos + 1] >= 2) { groundColor[8] = r; groundColor[9] = g; groundColor[10] = b; }
    else if (discovered[worldPos - world.width + 1] > 0 && discovered[worldPos - world.width] > 0 && discovered[worldPos + 1] > 0) { groundColor[8] = r * fog; groundColor[9] = g * fog; groundColor[10] = b * fog; }
    //l
    if (discovered[worldPos - world.width - 1] >= 2 && discovered[worldPos - world.width] >= 2 && discovered[worldPos - 1] >= 2) { groundColor[12] = r; groundColor[13] = g; groundColor[14] = b; }
    else if (discovered[worldPos - world.width - 1] > 0 && discovered[worldPos - world.width] > 0 && discovered[worldPos - 1] > 0) { groundColor[12] = r * fog; groundColor[13] = g * fog; groundColor[14] = b * fog; }

  }
  else
    groundColor = [r, g, b, a, r, g, b, a, r, g, b, a, r, g, b, a];

  let vertexPos =
    [
      32, 32 - world.heightVertex[vertexWorldPos + (world.width + 1)]/*u*/,
      64, 16 - world.heightVertex[vertexWorldPos + 1 + (world.width + 1)]/*r*/,
      32, 0 - world.heightVertex[vertexWorldPos + 1]/*o*/,
      0, 16 - world.heightVertex[vertexWorldPos]/*l*/
    ];
  //let matrix = gl2D.matrix.save()
  gl2D.matrix.reset();
  gl2D.matrix.translate(pos[0], pos[1]);
  gl2D.matrix.scale(camera.scale, camera.scale);
  gl2D.drawSquare(texture, groundSrc, vertexPos/*l*/, groundColor);
  //gl2D.matrix.load(matrix);
  gl2D.matrix.reset();
  gl2D.matrix.scale(camera.scale, camera.scale);
}

function updateAnimatonNr() {
  for (let ii = 0; ii < 20; ii++) {
    if (animator[ii] < ii) animator[ii]++;
    else animator[ii] = 0;
  }
};

let now = 0;
let startTime = 0;
let useTime = 0;
let bindTime = 0;
let renderTime = 0;

function render(curLayer) {
  if (curLayer.typ !== void 0) {
    // try{

    let width = canvas.width, height = canvas.height;
    //canvas2d.width = width; canvas2d.height = height;
    //ctx.clearRect(0, 0, width, height)
    gl2D.matrix.reset();
    gl2D.matrix.scale(camera.scale, camera.scale);
    let date = Date.now();
    let last = date;
    let tmplast

    tmplast = Date.now();
    gl2D.startScene();
    date = Date.now();
    startTime = (startTime * 3 + (date - tmplast)) / 4;

    tmplast = Date.now();

    // groundColor[0]=groundColor[4]=groundColor[8]=groundColor[12]=color[0];
    // groundColor[1]=groundColor[5]=groundColor[9]=groundColor[13]=color[1];
    // groundColor[2]=groundColor[6]=groundColor[10]=groundColor[14]=color[2];
    // groundColor[3]=groundColor[7]=groundColor[11]=groundColor[15]=color[3];

    let Indentation = 0;
    let posx = 0;
    let posy = 0;
    let addPosX = (width / 64 + 2) | 0;
    let addPosY = 1;
    let aktPosX = ((camera.posX | 0) + addPosX + addPosY);
    let aktPosY = ((camera.posY | 0) + addPosX - addPosY);
    let drawList = [];
    let drawListIndex = 0;
    let fogDrawList = [];
    let fogDrawListIndex = 0;
    for (let iy = -1; iy <= (((height + 256) / (16 * camera.scale))) | 0; iy++) {
      if (Indentation == 0) { Indentation = 1; posy++; posx--; }
      else Indentation = 0;
      aktPosX = ((camera.posX | 0) + addPosX + addPosY + posx + Indentation);
      aktPosY = ((camera.posY | 0) + addPosX - addPosY + posy);
      for (let ix = ((width / (64 * camera.scale))) | 0; ix >= -1; ix--) {
        aktPosX--;
        aktPosY--;
        if (aktPosX + 1 < world.width && aktPosX - 1 >= 0 && aktPosY + 1 < world.height && aktPosY - 1 >= 0) {
          let worldOffset = aktPosX + aktPosY * world.width;
          let drawPosX = 64 * ix + 32 * Indentation;
          let drawPosY = 16 * iy;
          if (curLayer.discovered[worldOffset] !== 0) {

            if (curLayer === world.underLayer)
              drawGround(underGroundTextures, curLayer.ground[worldOffset], worldOffset, aktPosX + aktPosY * (world.width + 1), [drawPosX, drawPosY],false);
            else
              drawGround(groundTextures, curLayer.ground[worldOffset], worldOffset, aktPosX + aktPosY * (world.width + 1), [drawPosX, drawPosY],true);
            //drawGround(groundTextures, curLayer.ground[worldOffset], worldOffset, aktPosX + aktPosY * (world.width + 1), [drawPosX, drawPosY]);

            let aktReferenceX = (curLayer.referenceX[worldOffset]);
            let aktReferenceY = (curLayer.referenceY[worldOffset]);
            let refOffset = aktPosX - aktReferenceX + (aktPosY - aktReferenceY) * world.width;
            let typ = curLayer.typ[refOffset];
            let height = world.heightMap[refOffset];
            let version = curLayer.version[refOffset];

            if (curLayer === world.underLayer){
              if (curLayer.discovered[worldOffset-world.width]==0)
                drawList[drawListIndex++] = drawWall(worldOffset, [drawPosX, drawPosY],color,false,-world.width);
              if (curLayer.discovered[worldOffset+1]==0)
                drawList[drawListIndex++] = drawWall(worldOffset, [drawPosX, drawPosY],color,true,+1);
            }

            let sObject = staticObject[typ];
            if (typ > 0 && sObject.texture[version] !== void 0) {
 
              let addGraphicWidth = sObject.addGraphicWidth;
              let envcode = 0;//findEnvorimentCode(aktWorld,aktPosX, aktPosY, sObject.envmode);//env code for auto tile (0000 - 1111)
              let overDraw = sObject.overDraw[version];
              let animPhase = sObject.animationPhases[version];
              let anim = animator[animPhase - 1];
              let imgSrcX = (aktReferenceX * 32) + (aktReferenceY * 32) + (sObject.size * 64 + 128) * (anim);
              let imgSrcY = 16 * (sObject.size - 1) - (aktReferenceX * 16) + (aktReferenceY * 16);

              if (curLayer.discovered[worldOffset] > 0) 
                drawList[drawListIndex++] = [0, sObject.texture[version], [imgSrcX, imgSrcY, 64 + addGraphicWidth * 2, 32 + overDraw], [drawPosX - addGraphicWidth, (drawPosY - overDraw) - height, 64 + addGraphicWidth * 2, 32 + overDraw], color];
            }

            if (curLayer === world.underLayer){
              if (curLayer.discovered[worldOffset+world.width]==0)
                drawList[drawListIndex++] = drawWall(worldOffset, [drawPosX+32, drawPosY+16],[0,0,0,255],false,+world.width);
                
              if (curLayer.discovered[worldOffset-1]==0)
                drawList[drawListIndex++] = drawWall(worldOffset, [drawPosX-32, drawPosY+16],[0,0,0,255],true,-1);
            }

            if (curLayer.discovered[worldOffset] >= 2) {
              for (let i = 0; i < curLayer.entity[worldOffset].length; i++) {
                let curEntity = entityList[curLayer.entity[worldOffset][i]];
                if (movableObject[curEntity.typ].texture[0] !== void 0) {
                  let entitySize = movableObject[curEntity.typ].graphicSize;
                  let entitySrcX = (curEntity.directionX + 1) * (entitySize) * 2;
                  let entitySrcY = (curEntity.directionY + 1) * (entitySize);

                  let directionPosX = (curEntity.moveProcess * 32) * curEntity.directionX + (curEntity.moveProcess * 32) * curEntity.directionY;
                  let directionPosY = -(curEntity.moveProcess * 16) * curEntity.directionX + (curEntity.moveProcess * 16) * curEntity.directionY;

                  let entityDrawPosX = drawPosX + directionPosX, entityDrawPosY = drawPosY - height + directionPosY;
                  drawList[drawListIndex++] = [0,movableObject[curEntity.typ].texture[0], [entitySrcX, entitySrcY, entitySize * 2, entitySize], [entityDrawPosX, entityDrawPosY, 64, 32], color];
                  drawList[drawListIndex++] = [0,nullTexture, [0, 0, 1, 1], [entityDrawPosX + 16, entityDrawPosY - 16, 32, 2], [100, 255, 100, 255]];
                }
              }
            }


          }
          else {
            //drawGround(guiTexture[0],0, worldOffset,aktPosX+aktPosY*(world.width+1),[drawPosX,drawPosY]);
            //fogDrawList[fogDrawListIndex++] = [effects[0], [0,0,64*3,32*3],[drawPosX-64,drawPosY-height-32,64*3,32*3],color];
          }
          if (worldOffset === mapMousePos) {
            drawGround(guiTexture[0], 0, worldOffset, aktPosX + aktPosY * (world.width + 1), [drawPosX, drawPosY]);
          }
        }
      }
    }
    for (let i = 0; i < drawListIndex; i++) {
      if (drawList[i][0] == 0)
        gl2D.drawImage(drawList[i][1], drawList[i][2], drawList[i][3], drawList[i][4]);
      else
        gl2D.drawSquare(drawList[i][1], drawList[i][2], drawList[i][3], drawList[i][4]);
    }

    /*
    //Debug
    gl2D.drawSquare(nullTexture,groundSrc,[0,0, width,0, width,height, 0,height],[200,200,255,50, 200,200,255,50, 200,200,255,0, 200,200,255,0]);
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
    */
    //gui.render(gl2D);


    tmplast = Date.now();
    gl2D.endScene();//--
    date = Date.now();
    bindTime = (bindTime * 3 + (date - tmplast)) / 4;

    tmplast = Date.now();
    gl2D.renderScene();//--
    date = Date.now();
    renderTime = (renderTime * 3 + (date - tmplast)) / 4;
    date = Date.now();
    now = (now * 3 + (date - last)) / 4;

    /*
    //ctx.fillRect(100,100,550,50);
    let text = "typ: empety\nground: sand"
    ctx.font = "12px Arial";
    ctx.fillStyle = "lime";
    ctx.fillText(text,mouse.x+32,mouse.y)
    */
  }
}

