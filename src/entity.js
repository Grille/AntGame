"use strict";
/*
class Entity { 
  constructor(unitClass,layer,posX,posY) {
    this.changePos=false;
    this.playerControled=true;
    this.layer=layer;
    this.moveProcess=0;
    this.way=[0,0];
    this.wayPos=1;
    this.wayLength=0;
    this.live=true;
    this.typ=unitClass;
    this.hp=movableObject[0].hitPoints;
    this.posX=posX;
    this.posY=posY;
    this.pos=posX+posY*layer.width;
    this.goalX=posX;
    this.goalY=posY;
    this.directionX=1;
    this.directionY=1;
    this.id=-1;
  }
}
class EntityList {
  constructor(){
    this.list = [];
  }
}
let entityList = new EntityList();

Entity.prototype.move = function(moveX, moveY, end){
    //move required
    if (moveX !== 0 || moveY !== 0) {
      let curEntity = this;
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
          if (worldEntity[curEntity.pos][i] !== curEntity.id) newEntity[offsetDst++] = worldEntity[curEntity.pos][i];
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
        worldEntity[pos][worldEntity[pos].length] = curEntity.id;
      }
    }
}
Entity.prototype.portTo = function(layer,posX,posY){
  let curEntity = this;
  let worldEntityList = curEntity.world.entity;

  //entf entity from old field
  let newEntity = [], offsetDst = 0;
  for (let i = 0; i < worldEntityList[curEntity.pos].length; i++) {
    if (worldEntityList[curEntity.pos][i] !== this.id) newEntity[offsetDst++] = worldEntityList[curEntity.pos][i];
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
  curEntity.layer = layer;
  worldEntityList = layer.entity;
  worldEntityList[pos][worldEntityList[pos].length] = this.id;
}
Entity.prototype.update = function(){
  let curEntity = this;
  // entity move
  if (curEntity.wayPos < curEntity.wayLength) {
    curEntity.move(curEntity.way[curEntity.wayPos * 2], curEntity.way[curEntity.wayPos * 2 + 1], false);
  }
  // entity move to end
  else if (curEntity.wayPos === curEntity.wayLength) {
    curEntity.move(curEntity.way[curEntity.wayPos * 2], curEntity.way[curEntity.wayPos * 2 + 1], true);
  }
  //refresh view
  if (curEntity.changePos === true && curEntity.playerControled === true) {
    curEntity.layer.discover(curEntity.posX, curEntity.posY, movableObject[curEntity.typ].viewRange);
    curEntity.changePos = false;
  }
}
Entity.prototype.sendTo = function(goalX,goalY){
  let curEntity = this;
  let way;

  //new way required?
  if (curEntity.goalX === goalX && curEntity.goalY === goalY) return;

  let layer = curEntity.layer;
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
Entity.prototype.kill = function(){
  entityList.kill(this.id);


  this.live = false
  let worldEntityList = curEntity.world.entity;

  //entf entity from old field
  let newEntity = [],offsetDst = 0;
  for (let i = 0;i<worldEntityList[curEntity.pos].length;i++){
    if (worldEntityList[curEntity.pos][i] !== entityID) newEntity[offsetDst++] = worldEntityList[curEntity.pos][i];
  }
  worldEntityList[curEntity.pos] = newEntity;
}

EntityList.prototype.clear = function(){
  this.list = [];
}
EntityList.prototype.add = function(entity){
  let i = 0;
  while (this.list[i] !== void 0) i++
  this.list[i] = entity;
  entity.id = i;
}
EntityList.prototype.get = function(id){
  return this.list[id];
}
EntityList.prototype.kill = function(id){

}
EntityList.prototype.update = function(){
  let i = 0;
  while (true){
    if (this.list[i] === void 0)break;
    this.list[i++].update();
  }
}
*/