"use strict"


function clearEntitys() {
  entityList = [];
}
function addEntity(layer, typ, posX, posY) {
  let entity = {
    changePos: false,
    playerControled: true,
    layer: layer,
    moveProcess: 0,
    way: [0, 0],
    wayPos: 1,
    wayLength: 0,
    live: true,
    typ: typ,
    hp: movableObject[0].hitPoints,
    posX: posX,
    posY: posY,
    pos: posX + posY * layer.width,
    goalX: posX,
    goalY: posY,
    directionX: 1,
    directionY: 1

  };
  let i = 0;
  while (entityList[i] !== void 0) i++
  entityList[i] = entity;

  if (entity.playerControled)
    layer.discover(posX, posY, movableObject[entityList[i].typ].viewRange);
  layer.entity[posX + posY * world.width] = [i];
  return i;
}
function sendEntity(entityID, goalX, goalY) {
  let curEntity = entityList[entityID];
  let way;

  //new way required?
  if (curEntity.goalX === goalX && curEntity.goalY === goalY) return;

  let layer = entityList[entityID].layer;
  curEntity.goalX = goalX;
  curEntity.goalY = goalY;

  ///build coliMap
  for (let i = 0; i < world.width * world.height; i++) {
    if (staticObject[layer.typ[i]].passable === true && groundObject[layer.ground[i]].passable === true && layer.discovered[i] !== 0)
      layer.way[i] = 0;
    else
      layer.way[i] = 5000;
  }

  //entity is moving?
  if (curEntity.wayPos !== curEntity.wayLength + 1) {
    way = findWay(layer.way, curEntity.posX + curEntity.way[curEntity.wayPos * 2], curEntity.posY + curEntity.way[curEntity.wayPos * 2 + 1], goalX, goalY);
    way[0] = curEntity.way[curEntity.wayPos * 2];
    way[1] = curEntity.way[curEntity.wayPos * 2 + 1];
    curEntity.wayPos = 0;
  }
  else {
    way = findWay(layer.way, curEntity.posX, curEntity.posY, goalX, goalY);
    curEntity.wayPos = 1;
  }

  curEntity.wayLength = (way.length - 2) / 2;
  curEntity.way = way;
}
function updateEntity(entityID) {
  let curEntity = entityList[entityID];
  // entity move
  if (curEntity.wayPos < curEntity.wayLength) {
    moveEntity(entityID, curEntity.way[curEntity.wayPos * 2], curEntity.way[curEntity.wayPos * 2 + 1], false);
  }
  // entity move to end
  else if (curEntity.wayPos === curEntity.wayLength) {
    moveEntity(entityID, curEntity.way[curEntity.wayPos * 2], curEntity.way[curEntity.wayPos * 2 + 1], true);
  }
  //refresh view
  if (curEntity.changePos === true && curEntity.playerControled === true) {
    curEntity.layer.discover(curEntity.posX, curEntity.posY, movableObject[curEntity.typ].viewRange);
    curEntity.changePos = false;
  }

}
function moveEntity(entityID, moveX, moveY, end) {
  //move required
  if (moveX !== 0 || moveY !== 0) {
    let curEntity = entityList[entityID];
    let entityData = movableObject[curEntity.typ]

    curEntity.moveProcess += entityData.speed;

    curEntity.directionX = moveX;
    curEntity.directionY = moveY;

    //nexte tile reached
    if (curEntity.moveProcess >= 1) {
      let worldEntity = curEntity.layer.entity;

      //entf entity from old field
      let newEntity = [], offsetDst = 0;
      for (let i = 0; i < worldEntity[curEntity.pos].length; i++) {
        if (worldEntity[curEntity.pos][i] !== entityID) newEntity[offsetDst++] = worldEntity[curEntity.pos][i];
      }
      worldEntity[curEntity.pos] = newEntity;

      //move
      curEntity.changePos = true;
      if (end === true) curEntity.moveProcess = 0;
      else curEntity.moveProcess -= 1;
      curEntity.posX += moveX;
      curEntity.posY += moveY;
      let pos = curEntity.posX + curEntity.posY * world.width;
      curEntity.pos = pos;
      curEntity.wayPos += 1;

      //add entity to new field
      worldEntity[pos][worldEntity[pos].length] = entityID;
    }
  }
}
function portEntity(entityID, newWorld, posX, posY) {
  let curEntity = entityList[entityID];
  let worldEntityList = curEntity.world.entity;

  //entf entity from old field
  let newEntity = [], offsetDst = 0;
  for (let i = 0; i < worldEntityList[curEntity.pos].length; i++) {
    if (worldEntityList[curEntity.pos][i] !== entityID) newEntity[offsetDst++] = worldEntityList[curEntity.pos][i];
  }
  worldEntityList[curEntity.pos] = newEntity;

  //move
  curEntity.changePos = true;
  curEntity.moveProcess = 0;
  curEntity.posX = posX;
  curEntity.posY = posY;
  let pos = curEntity.pos = posX + posY * world.width;
  // curEntity.wayPos=1;
  // curEntity.way = [0,0];
  // curEntity.goalX = goalX;
  // curEntity.goalY = goalY;

  //add entity to new field
  curEntity.world = newWorld;
  worldEntityList = newWorld.entity;
  worldEntityList[pos][worldEntityList[pos].length] = entityID;
}
function killEntity(entityID) {
  entityList[entityID].live = false
  let worldEntityList = curEntity.world.entity;

  //entf entity from old field
  let newEntity = [], offsetDst = 0;
  for (let i = 0; i < worldEntityList[curEntity.pos].length; i++) {
    if (worldEntityList[curEntity.pos][i] !== entityID) newEntity[offsetDst++] = worldEntityList[curEntity.pos][i];
  }
  worldEntityList[curEntity.pos] = newEntity;
}

function findWay(wayMap, startX, startY, endX, endY) {
  let endPos = endX + endY * world.width;
  let startPos = startX + startY * world.width;
  let wayNodesIndex = 1;
  let wayNode = [startPos];
  let way = [0, 0];
  wayMap[startPos] = 1;
  let trial = 2;
  let search = true;
  let progress = true;
  //repeat as long as no one is found away and made progress
  while (search && progress) {
    let newWayNodesIndex = 0;
    let newWayNode = [];
    progress = false;
    //go through all way nodes in list
    for (let i = 0; i < wayNodesIndex; i++) {
      //goal reached
      if (wayNode[i] === endPos) {
        wayMap[wayNode[i]] = trial + 1;
        search = false;
        let curPos = endPos;
        //find way
        for (let iw = trial - 2; iw >= 0; iw--) {
          let ww = world.width;
          let offset;
          let wayIndex = iw * 2;
          offset = curPos + 1;
          if (wayMap[offset] === iw) { way[wayIndex] = -1; way[wayIndex + 1] = +0; curPos = offset; continue; }
          offset = curPos + ww;
          if (wayMap[offset] === iw) { way[wayIndex] = +0; way[wayIndex + 1] = -1; curPos = offset; continue; }
          offset = curPos - 1;
          if (wayMap[offset] === iw) { way[wayIndex] = +1; way[wayIndex + 1] = +0; curPos = offset; continue; }
          offset = curPos - ww;
          if (wayMap[offset] === iw) { way[wayIndex] = +0; way[wayIndex + 1] = +1; curPos = offset; continue; }

          offset = curPos + 1 + ww;
          if (wayMap[offset] === iw) { way[wayIndex] = -1; way[wayIndex + 1] = -1; curPos = offset; continue; }
          offset = curPos + 1 - ww;
          if (wayMap[offset] === iw) { way[wayIndex] = -1; way[wayIndex + 1] = +1; curPos = offset; continue; }
          offset = curPos - 1 + ww;
          if (wayMap[offset] === iw) { way[wayIndex] = +1; way[wayIndex + 1] = -1; curPos = offset; continue; }
          offset = curPos - 1 - ww;
          if (wayMap[offset] === iw) { way[wayIndex] = +1; way[wayIndex + 1] = +1; curPos = offset; continue; }

        }
        break;
      }

      //test neighbor node & add to list
      let ww = world.width;
      let worldPos = wayNode[i];
      let offset;
      offset = worldPos + 1;
      if (wayMap[offset] === 0) { wayMap[offset] = trial; progress = true; newWayNode[newWayNodesIndex] = offset; newWayNodesIndex++; }
      offset = worldPos + ww;
      if (wayMap[offset] === 0) { wayMap[offset] = trial; progress = true; newWayNode[newWayNodesIndex] = offset; newWayNodesIndex++; }
      offset = worldPos - 1;
      if (wayMap[offset] === 0) { wayMap[offset] = trial; progress = true; newWayNode[newWayNodesIndex] = offset; newWayNodesIndex++; }
      offset = worldPos - ww;
      if (wayMap[offset] === 0) { wayMap[offset] = trial; progress = true; newWayNode[newWayNodesIndex] = offset; newWayNodesIndex++; }

      offset = worldPos + 1 + ww;
      if (wayMap[offset] === 0) { wayMap[offset] = trial; progress = true; newWayNode[newWayNodesIndex] = offset; newWayNodesIndex++; }
      offset = worldPos + 1 - ww;
      if (wayMap[offset] === 0) { wayMap[offset] = trial; progress = true; newWayNode[newWayNodesIndex] = offset; newWayNodesIndex++; }
      offset = worldPos - 1 + ww;
      if (wayMap[offset] === 0) { wayMap[offset] = trial; progress = true; newWayNode[newWayNodesIndex] = offset; newWayNodesIndex++; }
      offset = worldPos - 1 - ww;
      if (wayMap[offset] === 0) { wayMap[offset] = trial; progress = true; newWayNode[newWayNodesIndex] = offset; newWayNodesIndex++; }

    }
    wayNodesIndex = newWayNodesIndex;
    wayNode = newWayNode;
    trial++;
  }
  return way;
}
