"use strict"
//global






function buildMap(){
  // for (let ix = 2;ix<8;ix++)
  //   for (let iy = 2;iy<8;iy++)
  //     worldHeightMap[ix+iy*(worldWidth+1)] = 25;
  // for (let ix = 4;ix<6;ix++)
  //   for (let iy = 4;iy<6;iy++)
  //     worldHeightMap[ix+iy*(worldWidth+1)] = 50;


  for (let i1 = 0;i1<0;i1++){
    for (let ix = 1;ix<=worldWidth-2;ix++){
      for (let iy = 1;iy<=worldHeight-2;iy++){
        if (Math.random()<= 0.02)worldHeightVertex[ix+iy*(worldWidth+1)]=2000;
      }
    }

    for (let i2 = 0;i2<11;i2++){
      for (let ix = 1;ix<=worldWidth-2;ix++){
        for (let iy = 1;iy<=worldHeight-2;iy++){
          let ww = worldWidth+1
          let offset = ix+iy*ww
          worldHeightVertex[offset]=(
            worldHeightVertex[offset]+
            worldHeightVertex[offset+1]+
            worldHeightVertex[offset-1]+
            worldHeightVertex[offset+ww]+
            worldHeightVertex[offset-ww]+
            worldHeightVertex[offset+1+ww]+
            worldHeightVertex[offset+1-ww]+
            worldHeightVertex[offset-1+ww]+
            worldHeightVertex[offset-1-ww]
          )/9;
        }
      }
    }
  }

  let i = 0;
  for (let ix = 0;ix<=worldWidth;ix++)
    for (let iy = 0;iy<=worldHeight;iy++)
      worldHeightVertex[i++] += (Math.random()*4)|0
  i=0;
  for (let ix = 0;ix<worldWidth;ix++)
    for (let iy = 0;iy<worldHeight;iy++)
      if (Math.random()<= 0.4)buildStatic(worldO,ix,iy,3);


  i=0;
  for (let ix = 0;ix<worldWidth;ix++)
    for (let iy = 0;iy<worldHeight;iy++)
      if (Math.random()<= 0.01)buildStatic(worldO,ix,iy,1);
  i=0;
  for (let ix = 0;ix<worldWidth;ix++)
    for (let iy = 0;iy<worldHeight;iy++)
      if (Math.random()<= 0.01)buildStatic(worldO,ix,iy,2);
  for (let ix = 0;ix<worldWidth;ix++) buildStatic(worldO,ix,0,1);
  for (let ix = 0;ix<worldWidth;ix++) buildStatic(worldO,ix,worldHeight-1,1);
  for (let iy = 0;iy<worldHeight;iy++) buildStatic(worldO,0,iy,1);
  for (let iy = 0;iy<worldHeight;iy++) buildStatic(worldO,worldWidth-1,iy-1,1);
    i=0;
  for (let ix = 0;ix<worldWidth;ix++)
    for (let iy = 0;iy<worldHeight;iy++)
      worldO.ground[i++] = (Math.random()*3+1)|0

  let oSrc = 0;
  let oDst = 0;
  for (let ix = 0;ix<worldWidth;ix++){
    for (let iy = 0;iy<worldHeight;iy++){
      if (false&&worldHeightVertex[oSrc+worldWidth+1]>worldHeightVertex[oSrc+worldWidth+1]){
        worldHeightMap[oDst] = worldHeightVertex[oSrc]
        if (worldHeightVertex[oSrc+1]>worldHeightMap[oDst])worldHeightMap[oDst] = worldHeightVertex[oSrc+1];
        if (worldHeightVertex[oSrc+worldWidth+1]>worldHeightMap[oDst])worldHeightMap[oDst] = worldHeightVertex[oSrc+worldWidth+1];
        if (worldHeightVertex[oSrc+1+worldWidth+1]>worldHeightMap[oDst])worldHeightMap[oDst] = worldHeightVertex[oSrc+1+worldWidth+1];
      }
      else{
        worldHeightMap[oDst] = worldHeightVertex[oSrc]
        if (worldHeightVertex[oSrc+1]<worldHeightMap[oDst])worldHeightMap[oDst] = worldHeightVertex[oSrc+1];
        if (worldHeightVertex[oSrc+worldWidth+1]<worldHeightMap[oDst])worldHeightMap[oDst] = worldHeightVertex[oSrc+worldWidth+1];
        if (worldHeightVertex[oSrc+1+worldWidth+1]<worldHeightMap[oDst])worldHeightMap[oDst] = worldHeightVertex[oSrc+1+worldWidth+1];
      }
      oSrc++;
      oDst++;
    }
    oSrc++;
  }




  let posX=1;
  let posY=1;
  let endX=200;
  let endY=250;


  let entity = addEntity(worldO,0,1,1);
  sendEntity(entity,200,250);


  //addEntity(worldO,0,3,3);
  // worldO.ground[posX+posY*worldWidth]=0;
  // worldO.ground[endX+endY*worldWidth]=0;
  // let oSrc = 0;
  // let oDst = 0;
  // for (let ix = 0;ix<worldWidth;ix++){
  //   for (let iy = 0;iy<worldHeight;iy++){
  //     worldHeightMap[oDst] = worldHeightMap[oSrc]
  //     if (worldHeightMap[oSrc+1]<worldHeightMap[oDst])worldHeightMap[oDst] = worldHeightMap[oSrc+1];
  //     if (worldHeightMap[oSrc+worldWidth+1]<worldHeightMap[oDst])worldHeightMap[oDst] = worldHeightMap[oSrc+worldWidth+1];
  //     if (worldHeightMap[oSrc+1+worldWidth+1]<worldHeightMap[oDst])worldHeightMap[oDst] = worldHeightMap[oSrc+1+worldWidth+1];
  //     oSrc++;
  //     oDst++;
  //   }
  //   oSrc++;
  // }


}
function main(){
  //init game Data
  gl2D = webGL2DStart(canvas);
  resize()
  buildHTML();
  addEvents();
  loadGameData();
  buildMap();
  //run Game
  renderTimer();
  timer();
}




