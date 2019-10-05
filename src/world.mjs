class WorldLayer {
  constructor(width, height) {
    this.width = width;
    this.height = height;
    this.size = width * height;
    this.typ = new Uint8Array(this.size),
      this.walkable = new Uint8Array(this.size),
      this.way = new Uint16Array(this.size),
      this.ground = new Uint8Array(this.size),
      this.version = new Uint8Array(this.size),
      this.referenceX = new Uint8Array(this.size),
      this.referenceY = new Uint8Array(this.size),
      this.stability = new Uint8Array(this.size),
      this.discovered = new Uint8Array(this.size),
      this.fill = new Uint8Array(this.size),
      this.entity = []
  }
}
export default class World {
  constructor(width, height) {
    this.width = width;
    this.height = height;
    this.size = width * height;
    this.heightVertex = new Int16Array((this.width + 1) * (this.height + 1));
    this.heightMap = new Uint16Array(this.size);

    this.upperLayer = new WorldLayer(width, height)
    this.underLayer = new WorldLayer(width, height)
    for (let i = 0; i < this.size; i++) {
      this.upperLayer.entity[i] = [];
      this.underLayer.entity[i] = [];
    }
  }
}

WorldLayer.prototype.generateGround = function (groundID, density, size) {
  let i;
  i = 0;
  for (let ix = 0; ix < world.width; ix++) {
    for (let iy = 0; iy < world.height; iy++) {
      if (Math.random() <= density) {
        this.ground[i] = groundID;
      }
      i++;
    }
  }
  if (size > 0) {
    i = 0;
    for (let ix = 0; ix < world.width; ix++) {
      for (let iy = 0; iy < world.height; iy++) {
        if (Math.random() <= size && (this.ground[i + 1] === groundID || this.ground[i - 1] === groundID || this.ground[i + world.width] === groundID || this.ground[i - world.width] === groundID)) {
          this.ground[i] = groundID;
        }
        i++;
      }
    }
    i = 0;
    for (let ix = world.width; ix > 0; ix--) {
      for (let iy = 0; iy < world.height; iy++) {
        if (Math.random() <= size && (this.ground[i + 1] === groundID || this.ground[i - 1] === groundID || this.ground[i + world.width] === groundID || this.ground[i - world.width] === groundID)) {
          this.ground[i] = groundID;
        }
        i++;
      }
    }
    i = 0;
    for (let ix = 0; ix < world.width; ix++) {
      for (let iy = world.height; iy > 0; iy--) {
        if (Math.random() <= size && (this.ground[i + 1] === groundID || this.ground[i - 1] === groundID || this.ground[i + world.width] === groundID || this.ground[i - world.width] === groundID)) {
          this.ground[i] = groundID;
        }
        i++;
      }
    }
    i = 0;
    for (let ix = world.width; ix > 0; ix--) {
      for (let iy = world.height; iy > 0; iy--) {
        if (Math.random() <= size && (this.ground[i + 1] === groundID || this.ground[i - 1] === groundID || this.ground[i + world.width] === groundID || this.ground[i - world.width] === groundID)) {
          this.ground[i] = groundID;
        }
        i++;
      }
    }
  }
}
WorldLayer.prototype.discover = function (posX, posY, size) {
  size++;
  let startX = posX - size, startY = posY - size, endX = posX + size, endY = posY + size;

  if (startX < 1) startX = 1;
  if (startY < 1) startY = 1;
  if (endX > this.width - 2) endX = this.width - 2;
  if (endY > this.height - 2) endY = this.height - 2;

  for (let ix = startX; ix <= endX; ix++) {
    for (let iy = startY; iy <= endY; iy++) {
      this.discovered[ix + iy * this.width] = 2;
    }
  }
}
WorldLayer.prototype.buildStatic = function (posX, posY, staticID) {
  let offset = posX + posY * this.width;
  for (let ix = 0; ix < staticObject[staticID].size; ix++)
    for (let iy = 0; iy < staticObject[staticID].size; iy++)
      this.clear(posX+ix,posY+iy);

  for (let ix = 0; ix < staticObject[staticID].size; ix++) {
    for (let iy = 0; iy < staticObject[staticID].size; iy++) {
      this.referenceX[offset + ix + iy * this.width] = ix;
      this.referenceY[offset + ix + iy * this.width] = iy;
    }
  }
  this.typ[offset] = staticID;
  this.version[offset] = Math.random() * staticObject[staticID].versions;
}
WorldLayer.prototype.clear = function (posX, posY) {
  let pos = posX+posY*this.width;
  let x = posX - this.referenceX[pos],y = posY - this.referenceY[pos];
  let typ = this.typ[x+y*this.width];
  if (typ == 0)return;

  for (let ix = 0; ix < staticObject[typ].size; ix++) {
    for (let iy = 0; iy < staticObject[typ].size; iy++) {
      let pos = x+ix+(y+iy)*this.width;
      this.typ[pos] = 0;
      this.version[pos] = 0;
      this.referenceX[pos] = 0;
      this.referenceY[pos] = 0;
    }
  }
}


World.prototype.generateMap = function () {

  let upperLayer = this.upperLayer;
  let underLayer = this.underLayer;
  let i = 0;
  camera.goTo(this.width / 2,this.height / 2);

  //generate Height
  for (let i1 = 0; i1 < 0; i1++) {
    for (let ix = 1; ix <= this.width - 2; ix++) {
      for (let iy = 1; iy <= this.height - 2; iy++) {
        if (Math.random() <= 0.02) this.heightVertex[ix + iy * (this.width + 1)] = 1000;
      }
    }
    for (let i2 = 0; i2 < 11; i2++) {
      for (let ix = 1; ix <= this.width - 2; ix++) {
        for (let iy = 1; iy <= this.height - 2; iy++) {
          let ww = this.width + 1
          let offset = ix + iy * ww
          this.heightVertex[offset] = (
            this.heightVertex[offset] +
            this.heightVertex[offset + 1] +
            this.heightVertex[offset - 1] +
            this.heightVertex[offset + ww] +
            this.heightVertex[offset - ww] +
            this.heightVertex[offset + 1 + ww] +
            this.heightVertex[offset + 1 - ww] +
            this.heightVertex[offset - 1 + ww] +
            this.heightVertex[offset - 1 - ww]
          ) / 9;
        }
      }
    }
  }
  //Generate Ground/Biomes
  upperLayer.generateGround(1, 1, 0);
  upperLayer.generateGround(3, 0.0003, 0.65);
  upperLayer.generateGround(2, 0.003, 0.4);
  upperLayer.generateGround(4, 0.0001, 0.65);
  upperLayer.generateGround(5, 0.001, 0.5);

  for (let i = 0;i<this.width*this.height;i++){
    switch (this.upperLayer.ground[i]){
      case 2: this.underLayer.ground[i] = 2; break;
      case 3: this.underLayer.ground[i] = 3; break;
      default: this.underLayer.ground[i] = 1; break;
    }
  } 
  i = 0;
  for (let ix = 0; ix <= this.width; ix++)
    for (let iy = 0; iy <= this.height; iy++)
      this.heightVertex[i++] += (Math.random() * 4) | 0

  //mus
  for (let ix = 0; ix < this.width; ix++) {
    for (let iy = 0; iy < this.height; iy++) {
      if (upperLayer.ground[ix + iy * this.width] === 1) { if (Math.random() <= 0.005) upperLayer.buildStatic(ix, iy, 8); }
      else { if (Math.random() <= 0.001) upperLayer.buildStatic(ix, iy, 8); }
    }
  }
  //grass
  for (let ix = 0; ix < this.width; ix++) {
    for (let iy = 0; iy < this.height; iy++) {
      if (upperLayer.ground[ix + iy * this.width] === 4) { if (Math.random() <= 0.3) upperLayer.buildStatic(ix, iy, 3); }
      else if (upperLayer.ground[ix + iy * this.width] === 5) { if (Math.random() <= 0.8) upperLayer.buildStatic(ix, iy, 3); }
      else if (upperLayer.ground[ix + iy * this.width] === 2 || upperLayer.ground[ix + iy * this.width] === 3) { if (Math.random() <= 0.01) upperLayer.buildStatic(ix, iy, 3); }
      else { if (Math.random() <= 0.05) upperLayer.buildStatic(ix, iy, 3); }
    }
  }

  //stone
  for (let ix = 0; ix < this.width; ix++) {
    for (let iy = 0; iy < this.height; iy++) {
      if (upperLayer.ground[ix + iy * this.width] === 2) { if (Math.random() <= 0.2) upperLayer.buildStatic(ix, iy, 1); }
      else { if (Math.random() <= 0.01) upperLayer.buildStatic(ix, iy, 1); }
    }
  }

  //plant
  for (let ix = 0; ix < this.width; ix++) {
    for (let iy = 0; iy < this.height; iy++) {
      if (upperLayer.ground[ix + iy * this.width] === 5) { if (Math.random() <= 0.2) upperLayer.buildStatic(ix, iy, 2); }
      else if (upperLayer.ground[ix + iy * this.width] === 2 || upperLayer.ground[ix + iy * this.width] === 3) { if (Math.random() <= 0.001) upperLayer.buildStatic(ix, iy, 2); }
      else { if (Math.random() <= 0.01) upperLayer.buildStatic(ix, iy, 2); }
    }
  }

  //stoneBorder
  for (let ix = 0; ix < this.width; ix++) upperLayer.buildStatic(ix, 0, 1);
  for (let ix = 0; ix < this.width; ix++) upperLayer.buildStatic(ix, this.height - 1, 1);
  for (let iy = 0; iy < this.height; iy++) upperLayer.buildStatic(0, iy, 1);
  for (let iy = 0; iy < this.height; iy++) upperLayer.buildStatic(this.width - 1, iy, 1);

  let oSrc = 0;
  let oDst = 0;
  for (let ix = 0; ix < this.width; ix++) {
    for (let iy = 0; iy < this.height; iy++) {
      if (false && this.heightVertex[oSrc + this.width + 1] > this.heightVertex[oSrc + this.width + 1]) {
        this.heightMap[oDst] = this.heightVertex[oSrc]
        if (this.heightVertex[oSrc + 1] > this.heightMap[oDst]) this.heightMap[oDst] = this.heightVertex[oSrc + 1];
        if (this.heightVertex[oSrc + this.width + 1] > this.heightMap[oDst]) this.heightMap[oDst] = this.heightVertex[oSrc + this.width + 1];
        if (this.heightVertex[oSrc + 1 + this.width + 1] > this.heightMap[oDst]) this.heightMap[oDst] = this.heightVertex[oSrc + 1 + this.width + 1];
      }
      else {
        this.heightMap[oDst] = this.heightVertex[oSrc]
        if (this.heightVertex[oSrc + 1] < this.heightMap[oDst]) this.heightMap[oDst] = this.heightVertex[oSrc + 1];
        if (this.heightVertex[oSrc + this.width + 1] < this.heightMap[oDst]) this.heightMap[oDst] = this.heightVertex[oSrc + this.width + 1];
        if (this.heightVertex[oSrc + 1 + this.width + 1] < this.heightMap[oDst]) this.heightMap[oDst] = this.heightVertex[oSrc + 1 + this.width + 1];
      }
      oSrc++;
      oDst++;
    }
    oSrc++;
  }
}
World.prototype.setAsExplored = function () {
  let size = this.width * this.height;
  for (let i = 0; i < size; i++){
    this.upperLayer.discovered[i] = 2;
    this.underLayer.discovered[i] = 2;
  }
}

function spanNewPlayer() {
  addEntity(world.upperLayer, 0, world.width / 2, world.height / 2);
}

