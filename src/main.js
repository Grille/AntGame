"use strict"
//global


function generateGround(world, typ, density, size){
  let i;
  i=0;
  for (let ix = 0;ix<worldWidth;ix++){
    for (let iy = 0;iy<worldHeight;iy++){
      if (Math.random()<= density){
        world.ground[i] = typ;
      }
      i++;
    }
  }
  if (size > 0){
    i=0;
    for (let ix = 0;ix<worldWidth;ix++){
      for (let iy = 0;iy<worldHeight;iy++){
        if (Math.random()<= size && (world.ground[i+1]===typ||world.ground[i-1]===typ||world.ground[i+worldWidth]===typ||world.ground[i-worldWidth]===typ)){
          world.ground[i] = typ;
        }
        i++;
      }
    }
    i=0;
    for (let ix = worldWidth;ix>0;ix--){
      for (let iy = 0;iy<worldHeight;iy++){
        if (Math.random()<= size && (world.ground[i+1]===typ||world.ground[i-1]===typ||world.ground[i+worldWidth]===typ||world.ground[i-worldWidth]===typ)){
          world.ground[i] = typ;
        }
        i++;
      }
    }
    i=0;
    for (let ix = 0;ix<worldWidth;ix++){
      for (let iy = worldHeight;iy>0;iy--){
        if (Math.random()<= size && (world.ground[i+1]===typ||world.ground[i-1]===typ||world.ground[i+worldWidth]===typ||world.ground[i-worldWidth]===typ)){
          world.ground[i] = typ;
        }
        i++;
      }
    }
    i=0;
    for (let ix = worldWidth;ix>0;ix--){
      for (let iy = worldHeight;iy>0;iy--){
        if (Math.random()<= size && (world.ground[i+1]===typ||world.ground[i-1]===typ||world.ground[i+worldWidth]===typ||world.ground[i-worldWidth]===typ)){
          world.ground[i] = typ;
        }
        i++;
      }
    }
  }
}

function expand(inputMap,value,density){
  // let i;
  // i=0;
  // for (let ix = 0;ix<worldWidth;ix++){
  //   for (let iy = 0;iy<worldHeight;iy++){
  //     if (Math.random()<= 0.001){
  //       worldO.ground[i] = it;
  //     }
  //     i++;
  //   }
  // }
  // i=0;
  // for (let ix = 0;ix<worldWidth;ix++){
  //   for (let iy = 0;iy<worldHeight;iy++){
  //     if (Math.random()<= 0.3 && (worldO.ground[i+1]===it||worldO.ground[i-1]===it||worldO.ground[i+worldWidth]===it||worldO.ground[i-worldWidth]===it)){
  //       worldO.ground[i] = it;
  //     }
  //     i++;
  //   }
  // }
  // i=0;
  // for (let ix = worldWidth;ix>0;ix--){
  //   for (let iy = 0;iy<worldHeight;iy++){
  //     if (Math.random()<= 0.3 && (worldO.ground[i+1]===it||worldO.ground[i-1]===it||worldO.ground[i+worldWidth]===it||worldO.ground[i-worldWidth]===it)){
  //       worldO.ground[i] = it;
  //     }
  //     i++;
  //   }
  // }
  // i=0;
  // for (let ix = 0;ix<worldWidth;ix++){
  //   for (let iy = worldHeight;iy>0;iy--){
  //     if (Math.random()<= 0.3 && (worldO.ground[i+1]===it||worldO.ground[i-1]===it||worldO.ground[i+worldWidth]===it||worldO.ground[i-worldWidth]===it)){
  //       worldO.ground[i] = it;
  //     }
  //     i++;
  //   }
  // }
  // i=0;
  // for (let ix = worldWidth;ix>0;ix--){
  //   for (let iy = worldHeight;iy>0;iy--){
  //     if (Math.random()<= 0.3 && (worldO.ground[i+1]===it||worldO.ground[i-1]===it||worldO.ground[i+worldWidth]===it||worldO.ground[i-worldWidth]===it)){
  //       worldO.ground[i] = it;
  //     }
  //     i++;
  //   }
  // }
}

function buildMap(){
  // for (let ix = 2;ix<8;ix++)
  //   for (let iy = 2;iy<8;iy++)
  //     worldHeightMap[ix+iy*(worldWidth+1)] = 25;
  // for (let ix = 4;ix<6;ix++)
  //   for (let iy = 4;iy<6;iy++)
  //     worldHeightMap[ix+iy*(worldWidth+1)] = 50;
  mapPosX = worldWidth/2,mapPosY = worldHeight/2-30;

  for (let i1 = 0;i1<1;i1++){
    for (let ix = 1;ix<=worldWidth-2;ix++){
      for (let iy = 1;iy<=worldHeight-2;iy++){
        if (Math.random()<= 0.02)worldHeightVertex[ix+iy*(worldWidth+1)]=1000;
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

  generateGround(worldO, 1, 1, 0);
  generateGround(worldO, 3, 0.0003, 0.65);
  generateGround(worldO, 2, 0.003, 0.4);
  generateGround(worldO, 4, 0.0001, 0.65);
  generateGround(worldO, 5, 0.001, 0.5);

  generateGround(worldU, 1, 1, 0);
  generateGround(worldU, 3, 0.001, 0.6);
  generateGround(worldU, 2, 0.005, 0.5);

  // i=0;
  // for (let ix = 0;ix<worldWidth;ix++)
  //   for (let iy = 0;iy<worldHeight;iy++)
  //     worldU.ground[i++] = (Math.random()*3+1)|0
  i=0;
  for (let ix = 0;ix<=worldWidth;ix++)
    for (let iy = 0;iy<=worldHeight;iy++)
      worldHeightVertex[i++] += (Math.random()*4)|0

  //mus
  for (let ix = 0;ix<worldWidth;ix++){
    for (let iy = 0;iy<worldHeight;iy++){
      if (worldO.ground[ix+iy*worldWidth] === 1) {if (Math.random()<= 0.005)buildStatic(worldO,ix,iy,8);}
      else {if (Math.random()<= 0.001)buildStatic(worldO,ix,iy,8);}
    }
  }

  //grass
  for (let ix = 0;ix<worldWidth;ix++){
    for (let iy = 0;iy<worldHeight;iy++){
      if (worldO.ground[ix+iy*worldWidth] === 4) {if (Math.random()<= 0.3)buildStatic(worldO,ix,iy,3);}
      else if (worldO.ground[ix+iy*worldWidth] === 5) {if (Math.random()<= 0.8)buildStatic(worldO,ix,iy,3);}
      else if (worldO.ground[ix+iy*worldWidth] === 2 || worldO.ground[ix+iy*worldWidth] === 3) {if (Math.random()<= 0.01)buildStatic(worldO,ix,iy,3);}
      else {if (Math.random()<= 0.05)buildStatic(worldO,ix,iy,3);}
    }
  }
  //expand(worldO,3,0.1);

  //stone
  for (let ix = 0;ix<worldWidth;ix++){
    for (let iy = 0;iy<worldHeight;iy++){
      if (worldO.ground[ix+iy*worldWidth] === 2) {if (Math.random()<= 0.2)buildStatic(worldO,ix,iy,1);}
      else {if (Math.random()<= 0.01)buildStatic(worldO,ix,iy,1);}
    }
  }

  //plant
  for (let ix = 0;ix<worldWidth;ix++){
    for (let iy = 0;iy<worldHeight;iy++){
      if (worldO.ground[ix+iy*worldWidth] === 5) {if (Math.random()<= 0.2)buildStatic(worldO,ix,iy,2);}
      else if (worldO.ground[ix+iy*worldWidth] === 2 || worldO.ground[ix+iy*worldWidth] === 3){if (Math.random()<= 0.001)buildStatic(worldO,ix,iy,2);}
      else {if (Math.random()<= 0.01)buildStatic(worldO,ix,iy,2);}
    }
  }

  //stoneBorder
  for (let ix = 0;ix<worldWidth;ix++) buildStatic(worldO,ix,0,1);
  for (let ix = 0;ix<worldWidth;ix++) buildStatic(worldO,ix,worldHeight-1,1);
  for (let iy = 0;iy<worldHeight;iy++) buildStatic(worldO,0,iy,1);
  for (let iy = 0;iy<worldHeight;iy++) buildStatic(worldO,worldWidth-1,iy-1,1);

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


  let entity = addEntity(worldO,0,worldWidth/2,worldHeight/2);
  //sendEntity(entity,200,250);


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
  gui = initGL2DGui(window);
  //initGL2DGui();
  loadGameData();
  resize();
  buildHTML();
  addEvents();
  buildMap();
  //run Game

  // let ref = gui.addButton(nullTexture,[200,400,50,50]);
  // ref.mouseUp = (e) => {
  //   ref.rectangle[0]+=10;
  // }
  setAnimator();
  renderTimer();
  timer();
}




