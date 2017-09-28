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
      world.discovered[ix+iy*worldWidth] = 1;
    }
  }

  for (let ix = startX;ix<=endX;ix++)world.discovered[ix+startY*worldWidth] = 2;
  for (let ix = startX;ix<=endX;ix++)world.discovered[ix+endY*worldWidth] = 2;
  for (let iy = startY;iy<=endY;iy++)world.discovered[startX+iy*worldWidth] = 2;
  for (let iy = startY;iy<=endY;iy++)world.discovered[endX+iy*worldWidth] = 2;
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
      wayPos:0,
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

function sendEntity(entity,goalX,goalY){

  let date = Date.now();

  let curEntity = entityList[entity];
  
  let world = entityList[entity].world;
  curEntity.goalX = goalX;
  curEntity.goalY = goalY;

  for (let i = 0;i<worldWidth*worldHeight;i++){
    
    if (staticObject[world.typ[i]].passable===true && groundObject[world.ground[i]].passable===true && world.discovered[i] !== 0)
      world.way[i] = 0;
    else 
      world.way[i] = 1000;
  }


  //is entity moving

  let posX = curEntity.posX;
  let posY = curEntity.posY;
  let way = findWay(world.way,worldWidth,posX,posY,goalX,goalY);

  if(curEntity.wayPos !== curEntity.wayLength+1) {
    curEntity.wayPos = 0;
    console.log("test");
  }
  else{
    curEntity.wayPos = 1;
  }
  curEntity.wayLength = (way.length-2)/2;
  curEntity.way = way;



}
function simulateEntity(entity){
  let curEntity = entityList[entity];

  // console.log("-----------------------------------");
  // console.log(curEntity.wayPos);
  // console.log(curEntity.wayLength);

  if (curEntity.wayPos < curEntity.wayLength)
    moveEntity(entity,curEntity.way[curEntity.wayPos*2],curEntity.way[curEntity.wayPos*2+1],false);
  else if (curEntity.wayPos === curEntity.wayLength){
    moveEntity(entity,curEntity.way[curEntity.wayPos*2],curEntity.way[curEntity.wayPos*2+1],true);
  }
  if (curEntity.changePos === true && curEntity.playerControled === true){
    discover(curEntity.world,curEntity.posX,curEntity.posY,movableObject[curEntity.typ].viewRange);
    curEntity.changePos = false;
  }
  
}
function moveEntity(entity,moveX,moveY,end){
  if (moveX !==0||moveY!==0){
    let curEntity = entityList[entity];
    let entityData = movableObject[curEntity.typ]
    curEntity.moveProcess+=entityData.speed;

    curEntity.directionX = moveX;
    curEntity.directionY = moveY;

    if (curEntity.moveProcess >= 1){
      curEntity.world.entity[curEntity.pos] = [];
      curEntity.changePos = true;
      if (end === false)curEntity.moveProcess-=1;
      else curEntity.moveProcess=0;
      curEntity.posX+=moveX;
      curEntity.posY+=moveY;

      let pos = curEntity.posX+curEntity.posY*worldWidth;
      curEntity.pos = pos;
      curEntity.wayPos+=1;
      curEntity.world.entity[pos] = [entity];
    }
  }
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
  let progress = false;
  while(search){
    let newWayNodesIndex = 0;
    let newWayNode = [];
    progress = false;
    for (let i = 0;i<wayNodesIndex;i++){

      if (wayNode[i]===endPos){
        wayMap[wayNode[i]] = trial+1;
        search = false;
        let curPos = endPos;
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
    if (progress===false)search=false;
    wayNodesIndex = newWayNodesIndex;
    wayNode = newWayNode;
    trial++;
  }
  return way;
}
function killEntity(){
  
}