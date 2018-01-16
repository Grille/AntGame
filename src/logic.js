"use strict"

function discover(world,posX,posY,size){
  size++;
  let startX = posX - size,startY = posY - size,endX = posX + size,endY = posY + size;

  if (startX<1)startX=1;
  if (startY<1)startY=1;
  if (endX>worldWidth-2)endX=worldWidth-2;
  if (endY>worldHeight-2)endY=worldHeight-2;

  for (let ix = startX;ix<=endX;ix++){
    for (let iy = startY;iy<=endY;iy++){
      world.discovered[ix+iy*worldWidth] =2;
    }
  }

  // for (let ix = startX;ix<=endX;ix++)world.discovered[ix+startY*worldWidth] -= 2;
  // for (let ix = startX;ix<=endX;ix++)world.discovered[ix+endY*worldWidth] -= 2;
  // for (let iy = startY;iy<=endY;iy++)world.discovered[startX+iy*worldWidth] -= 2;
  // for (let iy = startY;iy<=endY;iy++)world.discovered[endX+iy*worldWidth] -= 2;
}
function buildStatic(world,posX,posY,typ){
  let offset = posX+posY*worldWidth;
  world.version[offset] = Math.random()*staticObject[typ].versions;
  for (let ix = 0;ix<staticObject[typ].size;ix++){
    for (let iy = 0;iy<staticObject[typ].size;iy++){
      world.version[offset+ix+iy*worldWidth] = world.version[offset];
      world.typ[offset+ix+iy*worldWidth] = 0;
      world.referenceX[offset+ix+iy*worldWidth] = ix;
      world.referenceY[offset+ix+iy*worldWidth] = iy;
    }
  }
  world.typ[offset] = typ;
  world.version[offset] = Math.random()*staticObject[typ].versions;
}

function addEntity(world,typ,posX,posY){
  let i = 0;
  while(entityList[i]!==void 0) i++
    entityList[i] = {
      changePos:false,
      playerControled:true,
      world:world,
      moveProcess:0,
      way:[0,0],
      wayPos:1,
      wayLength:0,
      live:true,
      typ:typ,
      hp:movableObject[0].hitPoints,
      posX:posX,
      posY:posY,
      pos:posX+posY*worldWidth,
      goalX:posX,
      goalY:posY,
      directionX:1,
      directionY:1
    
    };
    // for (let ix = -4;ix <=4;ix++)
    //   for (let iy = -4;iy <=4;iy++)
    //     world.discovered[posX+ix+(posY+iy)*worldWidth] = 1;
    discover(world,posX,posY,movableObject[entityList[i].typ].viewRange);
    world.entity[posX+posY*worldWidth] = [i];
    return i;
}
function sendEntity(entityID,goalX,goalY){
  let curEntity = entityList[entityID];
  let way;

  //new way required?
  if (curEntity.goalX === goalX && curEntity.goalY === goalY)return;

  let world = entityList[entityID].world;
  curEntity.goalX = goalX;
  curEntity.goalY = goalY;

  ///build coliMap
  for (let i = 0;i<worldWidth*worldHeight;i++){
    if (staticObject[world.typ[i]].passable===true && groundObject[world.ground[i]].passable===true && world.discovered[i] !== 0)
      world.way[i] = 0;
    else 
      world.way[i] = 5000;
  }

  //entity is moving?
  if(curEntity.wayPos !== curEntity.wayLength+1) {
    way = findWay(world.way,worldWidth,curEntity.posX+curEntity.way[curEntity.wayPos*2],curEntity.posY+curEntity.way[curEntity.wayPos*2+1],goalX,goalY);
    way[0] = curEntity.way[curEntity.wayPos*2];
    way[1] = curEntity.way[curEntity.wayPos*2+1];
    curEntity.wayPos = 0;
  }
  else{
    way = findWay(world.way,worldWidth,curEntity.posX,curEntity.posY,goalX,goalY);
    curEntity.wayPos = 1;
  }
  
  curEntity.wayLength = (way.length-2)/2;
  curEntity.way = way;
}
function simulateEntity(entityID){
  let curEntity = entityList[entityID];
  // entity move
  if (curEntity.wayPos < curEntity.wayLength){
    moveEntity(entityID,curEntity.way[curEntity.wayPos*2],curEntity.way[curEntity.wayPos*2+1],false);
  }
  // entity move to end
  else if (curEntity.wayPos === curEntity.wayLength){
    moveEntity(entityID,curEntity.way[curEntity.wayPos*2],curEntity.way[curEntity.wayPos*2+1],true);
  }
  //refresh view
  if (curEntity.changePos === true && curEntity.playerControled === true){
    discover(curEntity.world,curEntity.posX,curEntity.posY,movableObject[curEntity.typ].viewRange);
    curEntity.changePos = false;
  }
  
}
function moveEntity(entityID,moveX,moveY,end){
  //move required
  if (moveX !==0||moveY!==0){
    let curEntity = entityList[entityID];
    let entityData = movableObject[curEntity.typ]

    curEntity.moveProcess+=entityData.speed;

    curEntity.directionX = moveX;
    curEntity.directionY = moveY;

    //nexte tile reached
    if (curEntity.moveProcess >= 1){
      let worldEntity = curEntity.world.entity;

      //entf entity from old field
      let newEntity = [],offsetDst = 0;
      for (let i = 0;i<worldEntity[curEntity.pos].length;i++){
        if (worldEntity[curEntity.pos][i] !== entityID) newEntity[offsetDst++] = worldEntity[curEntity.pos][i];
      }
      worldEntity[curEntity.pos] = newEntity;

      //move
      curEntity.changePos = true;
      if (end === true)curEntity.moveProcess=0;
      else curEntity.moveProcess-=1;
      curEntity.posX+=moveX;
      curEntity.posY+=moveY;
      let pos = curEntity.posX+curEntity.posY*worldWidth;
      curEntity.pos = pos;
      curEntity.wayPos+=1;

      //add entity to new field
      worldEntity[pos][worldEntity[pos].length] = entityID;
    }
  }
}
function portEntity(entityID,newWorld,posX,posY){
  let curEntity = entityList[entityID];
  let worldEntityList = curEntity.world.entity;

  //entf entity from old field
  let newEntity = [],offsetDst = 0;
  for (let i = 0;i<worldEntityList[curEntity.pos].length;i++){
    if (worldEntityList[curEntity.pos][i] !== entityID) newEntity[offsetDst++] = worldEntityList[curEntity.pos][i];
  }
  worldEntityList[curEntity.pos] = newEntity;

  //move
  curEntity.changePos = true;
  curEntity.moveProcess=0;
  curEntity.posX=posX;
  curEntity.posY=posY;
  let pos = curEntity.pos = posX+posY*worldWidth;
  // curEntity.wayPos=1;
  // curEntity.way = [0,0];
  // curEntity.goalX = goalX;
  // curEntity.goalY = goalY;

  //add entity to new field
  curEntity.world = newWorld;
  worldEntityList = newWorld.entity;
  worldEntityList[pos][worldEntityList[pos].length] = entityID;
}
function killEntity(entityID){
  entityList[entityID].live = false
  let worldEntityList = curEntity.world.entity;

  //entf entity from old field
  let newEntity = [],offsetDst = 0;
  for (let i = 0;i<worldEntityList[curEntity.pos].length;i++){
    if (worldEntityList[curEntity.pos][i] !== entityID) newEntity[offsetDst++] = worldEntityList[curEntity.pos][i];
  }
  worldEntityList[curEntity.pos] = newEntity;
}

function findWay(wayMap,worldWidth,startX,startY,endX,endY){
  let endPos = endX+endY*worldWidth;
  let startPos = startX+startY*worldWidth;
  let wayNodesIndex = 1;
  let wayNode = [startPos];
  let way = [0,0];
  wayMap[startPos] = 1;
  let trial = 2;
  let search = true;
  let progress = true;
  //repeat as long as no one is found away and made progress
  while(search && progress){
    let newWayNodesIndex = 0;
    let newWayNode = [];
    progress = false;
    //go through all way nodes in list
    for (let i = 0;i<wayNodesIndex;i++){
      //goal reached
      if (wayNode[i]===endPos){
        wayMap[wayNode[i]] = trial+1;
        search = false;
        let curPos = endPos;
        //find way
        for (let iw = trial-2;iw>=0;iw--){
          let ww = worldWidth;
          let offset;
          let wayIndex = iw*2;
          offset = curPos+1;
          if (wayMap[offset] === iw){way[wayIndex] = -1;way[wayIndex+1] = +0;curPos = offset;continue;}
          offset = curPos+ww;
          if (wayMap[offset] === iw){way[wayIndex] = +0;way[wayIndex+1] = -1;curPos = offset;continue;}
          offset = curPos-1;
          if (wayMap[offset] === iw){way[wayIndex] = +1;way[wayIndex+1] = +0;curPos = offset;continue;}
          offset = curPos-ww;
          if (wayMap[offset] === iw){way[wayIndex] = +0;way[wayIndex+1] = +1;curPos = offset;continue;}

          offset = curPos+1+ww;
          if (wayMap[offset] === iw){way[wayIndex] = -1;way[wayIndex+1] = -1;curPos = offset;continue;}
          offset = curPos+1-ww;
          if (wayMap[offset] === iw){way[wayIndex] = -1;way[wayIndex+1] = +1;curPos = offset;continue;}
          offset = curPos-1+ww;
          if (wayMap[offset] === iw){way[wayIndex] = +1;way[wayIndex+1] = -1;curPos = offset;continue;}
          offset = curPos-1-ww;
          if (wayMap[offset] === iw){way[wayIndex] = +1;way[wayIndex+1] = +1;curPos = offset;continue;}
          
        }
        break;
      }

      //test neighbor node & add to list
      let ww = worldWidth;
      let worldPos = wayNode[i];
      let offset;
      offset = worldPos+1;
      if (wayMap[offset] === 0){wayMap[offset] = trial;progress = true;newWayNode[newWayNodesIndex] = offset ;newWayNodesIndex++;}
      offset = worldPos+ww;
      if (wayMap[offset] === 0){wayMap[offset] = trial;progress = true;newWayNode[newWayNodesIndex] = offset ;newWayNodesIndex++;}
      offset = worldPos-1;
      if (wayMap[offset] === 0){wayMap[offset] = trial;progress = true;newWayNode[newWayNodesIndex] = offset ;newWayNodesIndex++;}
      offset = worldPos-ww;
      if (wayMap[offset] === 0){wayMap[offset] = trial;progress = true;newWayNode[newWayNodesIndex] = offset ;newWayNodesIndex++;}

      offset = worldPos+1+ww;
      if (wayMap[offset] === 0){wayMap[offset] = trial;progress = true;newWayNode[newWayNodesIndex] = offset ;newWayNodesIndex++;}
      offset = worldPos+1-ww;
      if (wayMap[offset] === 0){wayMap[offset] = trial;progress = true;newWayNode[newWayNodesIndex] = offset ;newWayNodesIndex++;}
      offset = worldPos-1+ww;
      if (wayMap[offset] === 0){wayMap[offset] = trial;progress = true;newWayNode[newWayNodesIndex] = offset ;newWayNodesIndex++;}
      offset = worldPos-1-ww;
      if (wayMap[offset] === 0){wayMap[offset] = trial;progress = true;newWayNode[newWayNodesIndex] = offset ;newWayNodesIndex++;}

    }
    wayNodesIndex = newWayNodesIndex;
    wayNode = newWayNode;
    trial++;
  }
  return way;
}
function findWayMultiMap(wayMap1,wayMap2,worldWidth,startWorld,startX,startY,endWorld,endX,endY){
  let endPos = endX+endY*worldWidth;
  let startPos = startX+startY*worldWidth;
  let wayNodesIndex = 1;
  let wayNode = [startPos];
  let way = [0,0];
  wayMap[startPos] = 1;
  let trial = 2;
  let search = true;
  let progress = true;
  //repeat as long as no one is found away and made progress
  while(search && progress){
    let newWayNodesIndex = 0;
    let newWayNode = [];
    progress = false;
    //go through all way nodes in list
    for (let i = 0;i<wayNodesIndex;i++){
      //goal reached
      if (wayNode[i]===endPos){
        wayMap[wayNode[i]] = trial+1;
        search = false;
        let curPos = endPos;
        //find way
        for (let iw = trial-2;iw>=0;iw--){
          let ww = worldWidth;
          let offset;
          let wayIndex = iw*2;

          offset = curPos+1;
          if (wayMap[offset] === iw){way[wayIndex] = -1;way[wayIndex+1] = +0;curPos = offset;continue;}
          offset = curPos+ww;
          if (wayMap[offset] === iw){way[wayIndex] = +0;way[wayIndex+1] = -1;curPos = offset;continue;}
          offset = curPos-1;
          if (wayMap[offset] === iw){way[wayIndex] = +1;way[wayIndex+1] = +0;curPos = offset;continue;}
          offset = curPos-ww;
          if (wayMap[offset] === iw){way[wayIndex] = +0;way[wayIndex+1] = +1;curPos = offset;continue;}

          offset = curPos+1+ww;
          if (wayMap[offset] === iw){way[wayIndex] = -1;way[wayIndex+1] = -1;curPos = offset;continue;}
          offset = curPos+1-ww;
          if (wayMap[offset] === iw){way[wayIndex] = -1;way[wayIndex+1] = +1;curPos = offset;continue;}
          offset = curPos-1+ww;
          if (wayMap[offset] === iw){way[wayIndex] = +1;way[wayIndex+1] = -1;curPos = offset;continue;}
          offset = curPos-1-ww;
          if (wayMap[offset] === iw){way[wayIndex] = +1;way[wayIndex+1] = +1;curPos = offset;continue;}
          
        }
        break;
      }

      //test neighbor node & add to list
      let ww = worldWidth;
      let worldPos = wayNode[i];
      let offset;

      offset = worldPos+1;
      if (wayMap[offset] === 0){wayMap[offset] = trial;progress = true;newWayNode[newWayNodesIndex] = offset ;newWayNodesIndex++;}
      offset = worldPos+ww;
      if (wayMap[offset] === 0){wayMap[offset] = trial;progress = true;newWayNode[newWayNodesIndex] = offset ;newWayNodesIndex++;}
      offset = worldPos-1;
      if (wayMap[offset] === 0){wayMap[offset] = trial;progress = true;newWayNode[newWayNodesIndex] = offset ;newWayNodesIndex++;}
      offset = worldPos-ww;
      if (wayMap[offset] === 0){wayMap[offset] = trial;progress = true;newWayNode[newWayNodesIndex] = offset ;newWayNodesIndex++;}

      offset = worldPos+1+ww;
      if (wayMap[offset] === 0){wayMap[offset] = trial;progress = true;newWayNode[newWayNodesIndex] = offset ;newWayNodesIndex++;}
      offset = worldPos+1-ww;
      if (wayMap[offset] === 0){wayMap[offset] = trial;progress = true;newWayNode[newWayNodesIndex] = offset ;newWayNodesIndex++;}
      offset = worldPos-1+ww;
      if (wayMap[offset] === 0){wayMap[offset] = trial;progress = true;newWayNode[newWayNodesIndex] = offset ;newWayNodesIndex++;}
      offset = worldPos-1-ww;
      if (wayMap[offset] === 0){wayMap[offset] = trial;progress = true;newWayNode[newWayNodesIndex] = offset ;newWayNodesIndex++;}

    }
    wayNodesIndex = newWayNodesIndex;
    wayNode = newWayNode;
    trial++;
  }
  return way;
}