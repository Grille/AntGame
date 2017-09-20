function buildStatic(world,posX,posY,typ){
  let offset = posX+posY*worldWidth;
  world.typ[offset] = typ;
  world.version[offset] = Math.random()*staticObject[typ].versions;
}
function addEntity(world,typ,posX,posY){
  let i = 0;
  while(entityList[i]!==void 0) i++
    entityList[i] = {
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
    world.entity[posX+posY*worldWidth] = [i];
    return i;
}

function sendEntity(entity,goalX,goalY){

  let date = Date.now();

  let curEntity = entityList[entity];
  
  curEntity.goalX = goalX;
  curEntity.goalY = goalY;

  for (let i = 0;i<worldWidth*worldHeight;i++){
    if (worldO.typ[i]===0)
      worldO.way[i] = 0;
    else 
      worldO.way[i] = 1000;
  }

  let posX = curEntity.posX;
  let posY = curEntity.posY;
  let way = findWay(worldO.way,worldWidth,posX,posY,goalX,goalY);
  curEntity.wayPos = 1;
  curEntity.wayLength = (way.length-2)/2;
  for (let i = 0;i<=way.length;i+=2){
    worldO.ground[posX+posY*worldWidth]=0;
    posX+=way[i];
    posY+=way[i+1];
  }
  // console.log("way Time = "+(Date.now()-date)+"ms");
  // console.log(way);

  curEntity.way = way;


}
function simulateEntity(entity){
  let curEntity = entityList[entity];
  if (curEntity.wayPos < curEntity.wayLength)
    moveEntity(entity,curEntity.way[curEntity.wayPos*2],curEntity.way[curEntity.wayPos*2+1],false);
  else if (curEntity.wayPos === curEntity.wayLength)
    moveEntity(entity,curEntity.way[curEntity.wayPos*2],curEntity.way[curEntity.wayPos*2+1],true);
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