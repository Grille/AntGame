function encode(array){
  let result = ""
  for (let i = 0;i<array.length;i++){
    result += String.fromCharCode(array[i])[0];
  }
  return btoa(result);
}
function decode(string){
  let result = new Uint8Array(string.length);
  let data = atob(string);
  for (let i = 0;i<data.length;i++){
    result[i] = data.charCodeAt(i);
  }
  return result;
}
function newGame(){
  //entityList.clear();
  world = new World(256,256);
  world.generateMap();
  world.upperLayer.discover(128,128,16)
  //world.setAsExplored();
  curLayer = world.upperLayer;

  //spanNewPlayer();
}
function packData(){
  let upperLayer = world.upperLayer;
  let underLayer = world.underLayer;
  return JSON.stringify({
    width: world.width,
    height: world.height,
    camX:camera.posX,
    camY:camera.posY,
    upperLayer: packLayer(upperLayer),
    underLayer: packLayer(underLayer)
  });
}
function packLayer(srcLayer) {
  let iDst = 0;
  let typData = [];
  for (let iSrc = 0; iSrc < srcLayer.size; iSrc++) {
    let x = iSrc%srcLayer.width,y=(iSrc/srcLayer.width)|0;
    if (srcLayer.typ[iSrc] != 0) {
      typData[iDst++] = x;
      typData[iDst++] = y;
      typData[iDst++] = srcLayer.typ[iSrc];
      typData[iDst++] = srcLayer.version[iSrc];
    }
  }
  return data = {
    typData: encode(typData),
    ground: encode(srcLayer.ground),
    discovered: encode(srcLayer.discovered),
  }
}
function unpackData(datastr){
  let data = JSON.parse(datastr);
  world = new World(data.width,data.height);

  camera.posX = data.camX;
  camera.posY = data.camY;

  unpackLayer(world.upperLayer,data.upperLayer);
  unpackLayer(world.underLayer,data.underLayer);
  curLayer = world.upperLayer;
}
function unpackLayer(dstLayer,srcData){
  dstLayer.ground = decode(srcData.ground);
  dstLayer.discovered = decode(srcData.discovered);

  let typData = decode(srcData.typData);
  for (let i = 0;i<typData.length;i+=4){
    let pos = typData[i+0]+typData[i+1]*dstLayer.width;

    dstLayer.buildStatic(typData[i+0], typData[i+1], typData[i+2]);
    dstLayer.version[pos] = typData[i+3];
  }
}

function save(file) {
  localStorage.setItem("agsave_"+file, packData());
}
function load(file) {
  unpackData(localStorage.getItem("agsave_"+file));
}

function download(){
  let data = packData();

  let element = document.createElement('a');
  element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(data));
  element.setAttribute('download', "game.ags");

  element.style.display = 'none';
  document.body.appendChild(element);

  element.click();

  document.body.removeChild(element);
}