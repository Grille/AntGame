(function() {

class MyMouseEvent{
    constructor() {
      this.isRightMB = false;
      this.x = 0;
      this.y = 0;
      this.dx = 0;
      this.dy = 0;
      this.mode = 0;
      this.down = false;
    }


    setMouse(e,mode) { 
      //console.log("-----------------------------------------------------------------------sm")
      let isRightMB;

      if ("which" in e)  // Gecko (Firefox), WebKit (Safari/Chrome) & Opera
      this.isRightMB = e.which === 3; 
      else if ("button" in e)  // IE, Opera 
      this.isRightMB = e.button === 2; 
      // if ("clientX" in e) e.x = e.clientX
      // if ("clientY" in e) e.y = e.clientY
      this.x = e.x
      this.y = e.y
      this.mode = mode;
      switch (mode)
      {
        case 0:break;
        case 1:
        this.down = true;
        this.dx = this.x;
        this.dy = this.y;
        break;
        case 2:
        this.down = false;
        break;
      }
      //console.log("mode:"+this.mode+ " down:"+this.down)
    }
}
  
let lastEntity
let last = Date.now();
let width = window.innerWidth;
let height = window.innerHeight;
let worldHeight=0, worldWidth=0;
let mapPosX = 0;
let mapPosY = 0;
let decmapPosX = 0;
let decmapPosY = 0;
let lastAktPlayerPosX = 0;
let lastAktPlayerPosY = 0;
let aktPlayerPosX = 0;
let aktPlayerPosY = 0;
let mapMoveX = 0;
let mapMoveY = 0;
let scale = 1;
let context = canvas.getContext("2d");
//let canvasGround = document.createElement("canvas");
let contextGround = canvasGround.getContext("2d");
let groundRender = true;
let mouse = new MyMouseEvent(); //MouseEventArgs
let keyCode = -1;
let MaxEntity = 200;

let MoveableEntity = [];
let StaticEntity = [];
let GroundTexture = [];
let Ui = [];
let UiButton = [];
let UiAktField = [];//loadStaticEntity("./assets/png/Ui/aktfieldGoTo",1,1,0)

let EntityList = [];
let aktSelectetEntityTyp = -1;
let aktSelectetEntityNumber = 0;
let aktSelectetStaticTyp = -1;
let aktSelectetStaticposX=0,aktSelectetStaticposY=0;

let worldMode = 0;
let Oworld = [];
let Uworld = [];
let animator = [0];
let aktGameObject = -0;
let errorSprite = loadStaticEntity("./assets/png/Error/Error",1,1,0);
let nullSprite = loadStaticEntity("./assets/png/null",1,1,0);
let TypNumber = [];

let ressourcen = [200,500,0]//Baustoff//Essen//Volk
let alpha = 0.0;

let worldMap

var Timer = Date.now();
var Timer100=0; 
var Timer250=0;
var Timer500=0;
let lastbut=0;
let butzahl=0;
let DebugString = [];

  class GUI{
    constructor(path,align,posX,posY,width,height) {
      this.posX = posX;
      this.posY = posY;
      this.width = width;
      this.height = height;
      this.alignX=0;this.alignY=0;
      this.image = loadUi(path);

      switch (align){
        case 0:this.alignX=0;this.alignY=0;break; //ol
        case 1:this.alignX=1;this.alignY=0;break; //or
        case 2:this.alignX=0;this.alignY=1;break; //ul
        case 3:this.alignX=1;this.alignY=1;break; //ur
      }

    }

    render(){
      if (this.image.ready===true){
        context.drawImage(
        this.image.sprite[0].texture,
        0, 0,
        this.image.sprite[0].width, this.image.sprite[0].height,
        this.posX+(width*this.alignX), this.posY+(height*this.alignY),
        this.width, this.height
        );
      }
    }
    
  }
  class Button extends GUI{
    constructor(path,align,posX,posY,width,height) {
      super(path,align,posX,posY,width,height);
      this.butzahl = butzahl;butzahl++;
    }
    clicked() { //-<<-<>->>-<>-<<-<>->>-
    if (this.butzahl===0)  console.log("< "+(mouse.x > this.posX+(width*this.alignX))+" && "+(mouse.y > this.posY+(height*this.alignY))+" && "+(mouse.x < this.posX+(width*this.alignX)+this.width)+" && "+(mouse.y < this.posY+(height*this.alignY)+this.height) +" > : "+(  
        mouse.x > this.posX+(width*this.alignX)  &&  
        mouse.y > this.posY+(height*this.alignY)  &&  
        mouse.x < this.posX+(width*this.alignX)+this.width  &&  
        mouse.y < this.posY+(height*this.alignY)+this.height  
        ));
      if (  
        mouse.x > this.posX+(width*this.alignX)  &&  
        mouse.y > this.posY+(height*this.alignY)  &&  
        mouse.x < this.posX+(width*this.alignX)+this.width  &&  
        mouse.y < this.posY+(height*this.alignY)+this.height  
        )
        {lastbut=this.butzahl;return true;}
      return false;
    }
    render(){
      if (this.image.ready===true){
        let width = (this.image.sprite[0].width/3)|0;
        let hj=0
        if (this.clicked()===true){hj=1;if(mouse.down===true){hj=2}}
        context.drawImage(
        this.image.sprite[0].texture,
        width*hj, 0,
        width, this.image.sprite[0].height,
        this.posX+width*this.alignX, this.posY+height*this.alignY,
        this.width, this.height
        );
      }
    }

  }

//--BuildGame----------------------------------------------------------------------------------------------------------------------------------------------------
function imgToCanvas(img) {
  let canvas = document.createElement("canvas");
  let context  = canvas.getContext("2d");
  context.imageSmoothingEnabled = false;
  canvas.width = img.width;
  canvas.height = img.height;
  context .drawImage(img, 0, 0, img.width, img.height);
 // return(img);
  return (canvas);
};
function loadImageArray(object, path,size,version,envmode) {
  version --;
  if (envmode !== 0)envmode=15;
  let sprite = [];
  for (let iv = 0; iv <= version; ++iv) {
    sprite[iv] = [];
    for (let ic = 0; ic <= envmode; ++ic) {
      let img = new Image();
      img.onload = () => {
      sprite[iv][ic] = {
      texture: imgToCanvas(img),
      width: img.width,
      height: img.height,
      overDraw: img.height - (32 * size)|0,
      animationPhase: (img.width / (64 * size) - 1)|0};
      object.ready = true;
      };
      img.src = path+"_"+iv+"_"+ic+".png";
      };
    };
  return sprite;
 };
function loadStaticEntity(path,size,version,envmode,begehbar) {
  
  let StaticEntity = {
      size: size,
      envmode: envmode,
      version: version,
      begehbar: begehbar,
      ready: false,
      sprite: null,
  };
  StaticEntity.sprite = loadImageArray(StaticEntity, path,size,version,envmode);
  return (StaticEntity);
};
function loadImage(object, path) {
  let sprite = [];
      let img = new Image();
      img.onload = () => {
      sprite[0] = {
      texture: imgToCanvas(img),
      width: img.width,
      height: img.height};
      object.ready = true;
      };
      img.src = path+".png";
      // console.log("----------------------------");
      // console.log(sprite);
  return sprite; //     ?!
 };
function loadMoveableEntity(path,hp,view,speed,power) {
  let MoveableEntity = {
      hp: hp,
      speed: speed,
      view: view,
      power: power,
      ready: false,
      sprite: null,
  };
  MoveableEntity.sprite = loadImage(MoveableEntity, path);
  return (MoveableEntity);
 };
function loadUi(path) {
  let Ui = {
      ready: false,
      sprite: null,
  };
  Ui.sprite = loadImage(Ui, path);
  return (Ui);
};
function initGame(){
  Ui = 
  [
    loadUi("./assets/png/Ui/RB"),//0
    loadUi("./assets/png/Ui/RE"),
    loadUi("./assets/png/Ui/RV"),
    loadUi("./assets/png/Ui/TB"),
    loadUi("./assets/png/Ui/BG"),
  ]
  UiButton =
  [
    new Button("./assets/png/Ui/B_Eingang",2,256+48,-48-32,48,48),//0
    new Button("./assets/png/Ui/B_Strasse",2,256+48*2,-48-32,48,48),
    new Button("./assets/png/Ui/B_Graben",2,256+48*2,-48-32,48,48),
    new Button("./assets/png/Ui/B_baustofflager",2,256+48*4,-48-32,48,48),
    new Button("./assets/png/Ui/B_Essenslager",2,256+48*5,-48-32,48,48),
    new Button("./assets/png/Ui/B_Eilager",2,256+48*6,-48-32,48,48),//5
    new Button("./assets/png/Ui/B_pilzFarm",2,256+48*8,-48-32,48,48),
    new Button("./assets/png/Ui/B_Koenigen",2,256+48,-48-32-100,48,48),
  ]
  UiAktField = [
    loadStaticEntity("./assets/png/Ui/aktfieldGoTo",1,1,0,1),//0
    loadStaticEntity("./assets/png/Ui/aktfieldGoToDown",1,1,0,1),
    loadStaticEntity("./assets/png/Ui/aktfieldGoToUp",1,1,0,1),
    loadStaticEntity("./assets/png/Ui/aktfieldAtack",1,1,0,1),
    loadStaticEntity("./assets/png/Ui/aktfieldSelect",1,1,0,1),
  ]

  GroundTexture = [
    loadStaticEntity("./assets/png/Natur/Berg",1,1,0,1),//0
    loadStaticEntity("./assets/png/Natur/Moos",1,1,1,1),
  ]
  StaticEntity = 
  [
    loadStaticEntity("./assets/png/Natur/Berg",1,1,0,1),//0
    loadStaticEntity("./assets/png/Natur/Wasser/Wasser",1,1,3,0),
    loadStaticEntity("./assets/png/Natur/Wald/Wald",1,5,0,0),
    loadStaticEntity("./assets/png/Natur/Moos",1,1,1,1),
    loadStaticEntity("./assets/png/Natur/Stein",1,2,0,0),
    loadStaticEntity("./assets/png/Natur/Wald/WaldLaus",1,1,0,0),//5
    loadStaticEntity("./assets/png/Bauten/Eingang",1,1,0,1), //----------------6
    loadStaticEntity("./assets/png/Untergrund/UEingang",1,1,0,1), //------------------------7
    loadStaticEntity("./assets/png/Untergrund/UBerg",1,1,0,1),
    loadStaticEntity("./assets/png/Untergrund/Urand",1,1,1,0),
    loadStaticEntity("./assets/png/Bauten/Strasse",1,1,1,1),//10
    loadStaticEntity("./assets/png/Untergrund/UPilz",1,1,0,0),
    loadStaticEntity("./assets/png/Untergrund/ULagerBvoll",1,1,0,0),
    loadStaticEntity("./assets/png/Untergrund/ULagerNvoll",1,1,0,0),
    loadStaticEntity("./assets/png/Untergrund/ULagerLvoll",1,1,0,0),
    loadStaticEntity("./assets/png/Untergrund/ULagerBleer",1,1,0,1),//15
    loadStaticEntity("./assets/png/Untergrund/ULagerNleer",1,1,0,1),
    loadStaticEntity("./assets/png/Untergrund/ULagerLleer",1,1,0,1),
  ]
  MoveableEntity = 
  [
    loadMoveableEntity("./assets/png/Einheiten/Koenigen_1",200,4,15,50),//0
    loadMoveableEntity("./assets/png/Einheiten/Koenigen_2",200,4,5,50),
    loadMoveableEntity("./assets/png/Einheiten/Bautrup_0",15,2,10,1),
  ]

  EntityList[0] = {live: false}

  setMouse(mouse,0);setMouse(mouse,1);setMouse(mouse,2);
  buildMap(128,128);
  gameTimer();
  renderTimer();      // run render loop
 }
initGame();
//--GameLoop----------------------------------------------------------------------------------------------------------------------------------------------------
function renderTimer(){
  requestAnimationFrame(renderTimer);
  render()
}
function gameTimer(){
 // try{
    let ms = Date.now() - Timer;
    //DebugString[0]=ms;
    let date;let totalDate = Date.now();
    Timer100+=ms;
    Timer250+=ms; 
    Timer500+=ms;

    mapScroal((ms/10/3));

    date = Date.now();
    while (Timer100>100){
      Timer100-=100;
      for (let ii = 0;ii<=MaxEntity;ii++)
      {
        if (EntityList[ii] !== void 0 &&EntityList[ii].live===true){
          moveEntity(ii);
        }
      }
    }
    DebugString[1]=Date.now()-date;

    date = Date.now();
    if (Timer250>250){
      Timer250-=250;
      setAnimator();
      groundRender = true;
    }
    DebugString[2]=Date.now()-date;

    date = Date.now();
    if (Timer500>500){
      UiButton[0].clicked();
      Timer500-=500;
      if (worldMode === 0)worldMap = buildWorldMap(Oworld);
      if (worldMode === 1)worldMap = buildWorldMap(Uworld);
    }
    DebugString[3]=Date.now()-date;
 // }catch(e){  console.log("\n\n\n\nError -> \n"+e+"\n-------------------------------------\n");}
     DebugString[0]= Date.now() - totalDate;
  Timer = Date.now();
  setTimeout(gameTimer, 10);
  //setImmediate(gameTimer);
}
//--BuildWorld----------------------------------------------------------------------------------------------------------------------------------------------------
function buildWorldarray(width,height,typ){
  let world = [];
  for (let yy = 0; yy < width; ++yy) {
    world[yy] = [];
    for (let xx = 0; xx < height; ++xx) {
      world[yy][xx] = {
        typ: typ,
        version: 0,
        animation: 0,
        height: 0,
        reference: [0,0],
        aktEntity: -1,  
        resEntity: -1,  
        discovered: 0,  
        owner:0  ,
        way:0,
        debug:0,
        debug2:0,
        wayKost:0,
        begehbar:0
      };
    };
  };

  for (let ii = 0; ii < width; ii++) world[ii][0].typ = -1;
  for (let ii = 0; ii < width; ii++) world[ii][height - 1].typ = -1;
  for (let ii = 0; ii < height; ii++) world[0][ii].typ = -1;
  for (let ii = 0; ii < height; ii++) world[width - 1][ii].typ = -1;

  return world;
 }

function generateTile(world,mit, typ, rnd) {
  let width = worldWidth-2;let height = worldHeight-2;
    for (let ii = 0;ii < mit;ii++) {
      for (let ix = 1; ix <= width; ix++){
        for (let iy = 1; iy <= height; iy++){
          if (world[ix + 1][iy].typ === typ || world[ix - 1][iy].typ === typ || world[ix][iy + 1].typ === typ || world[ix][iy - 1].typ === typ) {if(Math.random()<rnd){build(world,ix, iy, typ);}}
        };
      };
      for (let ix = width; ix >= 1; ix--){
        for (let iy = height; iy >= 1; iy--){
          if (world[ix + 1][iy].typ === typ || world[ix - 1][iy].typ === typ || world[ix][iy + 1].typ === typ || world[ix][iy - 1].typ === typ) {if(Math.random()<rnd){build(world,ix, iy, typ);}}
        };
      };
    };
  }

function buildMap(width,height){
  worldWidth = width + 2;
  worldHeight = height + 2;
  Oworld = buildWorldarray(worldWidth,worldHeight,0)
  Uworld = buildWorldarray(worldWidth,worldHeight,9)

  for (let ix = 1; ix < width; ix++){
    for (let iy = 1; iy < height; iy++){
      Oworld[ix][iy].discovered = 1;
      build(Oworld,ix, iy, 0);
    }
  }


            //if (mode == 1)
            //{

  

  //Moos
  for (let ix = 1; ix < width; ix++){
    for (let iy = 1; iy < height - 1; iy++)
    {
    if (Math.random() <= 0.02 && Oworld[ix][iy].typ === 0) build(Oworld,ix, iy, 3);
    }
  }

  generateTile(Oworld,4, 3, 0.2);

  //Water---------------------------------

  for (let ii = 1; ii < worldWidth-1; ii++) Oworld[ii][1].typ = 2;
  for (let ii = 1; ii < worldWidth-1; ii++) Oworld[ii][worldHeight - 2].typ = 2;
  for (let ii = 1; ii < worldHeight-1; ii++) Oworld[1][ii].typ = 2;
  for (let ii = 1; ii < worldHeight-1; ii++) Oworld[worldWidth - 2][ii].typ = 2;


  //generateTile(3, 1, 0.5);

  let total = width * height;
  let proC = (total * 0.001)|0;
  for (let ii = 0; ii < proC;){
    let rndX = (width * Math.random())|0 + 1;
    let rndY = (height * Math.random())|0 + 1;
      if (Oworld[rndX][rndY].typ !== -1){
    build(Oworld,rndX, rndY, 1);
    ii++;
    }
  }

  generateTile(Oworld,2, 1, 0.5);

  for (let ix = 1; ix < width; ix++)
  {
    for (let iy = 1; iy < height; iy++)
    {
    if (Math.random() <= 0.9 && Oworld[ix + 1][iy].typ === 1 && Oworld[ix - 1][iy].typ === 1 && Oworld[ix][iy + 1].typ === 1 && Oworld[ix][iy - 1].typ === 1) build(Oworld,ix, iy, 1);
    }
  }

  //Stein
  for (let ix = 1; ix < width; ix++)
  {
    for (let iy = 1; iy < height; iy++)
    {
    if (Math.random() <= 0.01 && Oworld[ix][iy].typ === 0) build(Oworld,ix, iy, 4);
    }
  }

 //Grass
  for (let ix = 1; ix < width; ix++){
    for (let iy = 1; iy < height; iy++){
    if (Math.random() <= 0.02 && Oworld[ix][iy].typ === 0) build(Oworld,ix, iy, 2);
    }
  }

  generateTile(Oworld,4, 2, 0.2);


  for (let ix = 1; ix < width; ix++){
    for (let iy = 1; iy < height; iy++){
    if (Math.random() <= 0.02 && Oworld[ix][iy].typ === 0) build(Oworld,ix, iy, 2);
    }
  }

  //Laus
  for (let ix = 1; ix < width; ix++){
    for (let iy = 1; iy < height; iy++){
    if (Math.random() <= 0.01 && Oworld[ix][iy].typ === 2) build(Oworld,ix, iy, 5);
    }
  }

  mapPosX = ((worldWidth/2)|0);//(width/64)|0;
  mapPosY = ((worldHeight/2)|0);

  for (let ix = 0; ix <= 2; ix++){
    for (let iy = 0; iy <= 2; iy++){
      build(Oworld,mapPosX-1+ix, mapPosY-1+iy, 0);
    }
  }
  for (let ix = 0; ix <= 10; ix++){
    build(Oworld,mapPosX-5+ix, mapPosY, 0);
  }
  for (let iy = 0; iy <= 10; iy++){
    build(Oworld,mapPosX, mapPosY-5+iy, 0);
  }

  addEntity(Oworld,0,[mapPosX,mapPosY]);

  worldMap = buildWorldMap(Oworld);
 }

 
//--Graphic----------------------------------------------------------------------------------------------------------------------------------------------------
function buildWorldMap(world) {
  let canvas = document.createElement("canvas");
  let context  = canvas.getContext("2d");
  context.imageSmoothingEnabled = false;
  canvas.width = worldWidth*2;
  canvas.height = worldHeight*2;
  let mod = context.createImageData(canvas.width, canvas.height);
  let imgData = context.getImageData(0, 0, canvas.width, canvas.height);
  for (x = 0; x < worldWidth; x++) {
	  for (y = 0; y < worldHeight; y++) {
  try {
      let offset = (imgData.width * (y-x+(canvas.height/2)|0) + (x+y)) * 4;
      mod.data[offset + 3] = 255;//a
      if (world[x][y].discovered === 1)
      {
        if (world[x][y].owner!==0||world[x][y].aktEntity!==-1)
        {
          mod.data[offset]     = 0;//r
          mod.data[offset + 1] = 255;//g
          mod.data[offset + 2] = 0;//b
        }else{
          switch (world[x][y].typ){
            case 1:case -1:
            mod.data[offset]     = 50;//r
            mod.data[offset + 1] = 70;//g
            mod.data[offset + 2] = 140;//b
            break;case 2:
            mod.data[offset]     = 150;//r
            mod.data[offset + 1] = 140;//g
            mod.data[offset + 2] = 50;//b
            break; default:
            mod.data[offset]     = 150;//r
            mod.data[offset + 1] = 100;//g
            mod.data[offset + 2] = 50;//b
            break;
          }
        }
      }


  }catch(e){}
    }
  }
  let offset = (imgData.width * (2) + worldWidth-2) * 4;
  mod.data[offset]     = 255;//r
  mod.data[offset + 1] = 0;//g
  mod.data[offset + 2] = 0;//b
  mod.data[offset + 3] = 255;//a
  context.putImageData(mod, 0, 0);
  return (canvas);
};

function pixelShader(){
  let imgData = context.getImageData(0, 0, canvas.width, canvas.height);
  let w = canvas.width;
  let h = canvas.height;
  // for (x = 0; x < w; x++) {
	//   for (y = 0; y < h; y++) {
  //     let offset = (imgData.width * (y) + x) * 4;
  //     //mod.data[offset]     = mod.data[offset];//r
  //     imgData.data[offset + 1] = 0;//g
  //     //mod.data[offset + 2] = mod.data[offset + 2];//b
  //     imgData.data[offset + 3] = 255;//a
  //   }
  // }
    for (i = 0; i < w*h; i++) {
      //mod.data[offset]     = mod.data[offset];//r
      imgData.data[i*4 + 1] = 0;//g
      //mod.data[offset + 2] = mod.data[offset + 2];//b
      imgData.data[i*4 + 3] = 255;//a
  }

  context.putImageData(imgData, 0, 0);
}
function setAnimator() {
  for (let ii = 0; ii < 20; ii++){
  if (animator[ii] < ii) animator[ii]++;
  else animator[ii] = 0;
  }
  alpha += 0.05;
 };
function convertToBin(input){
  switch (input)
  {
  case 0: return 0;
  case 1: return 1;
  case 10: return 2;
  case 11: return 3;
  case 100: return 4;
  case 101: return 5;
  case 110: return 6;
  case 111: return 7;
  case 1000: return 8;
  case 1001: return 9;
  case 1010: return 10;
  case 1011: return 11;
  case 1100: return 12;
  case 1101: return 13;
  case 1110: return 14;
  case 1111: return 15;
  default: return 0;
  };
 }
function findEnvorimentCode(world,posX, posY, envmode) // envmode (0=keine,1=selbst,2=height,3=Wasser).
  {
  let worldEnvironment = [0,0,0,0];
  switch (envmode)
    {
    case 1:
    if (world[posX][posY - 1].typ === world[posX][posY].typ) worldEnvironment[0] = 1;
    if (world[posX + 1][posY].typ === world[posX][posY].typ) worldEnvironment[1] = 1;
    if (world[posX][posY + 1].typ === world[posX][posY].typ) worldEnvironment[2] = 1;
    if (world[posX - 1][posY].typ === world[posX][posY].typ) worldEnvironment[3] = 1;
    break;
    case 2:
    let aktHeight = world[posX][posY].height;
    if (aktHeight<world[posX - 1][posY].height || aktHeight<world[posX][posY - 1].height || aktHeight<world[posX - 1][posY - 1].height) worldEnvironment[0] = 1; //ol
    if (aktHeight<world[posX + 1][posY].height || aktHeight<world[posX][posY - 1].height || aktHeight<world[posX + 1][posY - 1].height) worldEnvironment[1] = 1; //or
    if (aktHeight<world[posX + 1][posY].height || aktHeight<world[posX][posY + 1].height || aktHeight<world[posX + 1][posY + 1].height) worldEnvironment[2] = 1; //ur
    if (aktHeight<world[posX - 1][posY].height || aktHeight<world[posX][posY + 1].height || aktHeight<world[posX - 1][posY + 1].height) worldEnvironment[3] = 1; //ul
    break;
    case 3:
    if (world[posX][posY - 1].typ === -1 || world[posX][posY - 1].typ === 1) worldEnvironment[0] = 1;
    if (world[posX + 1][posY].typ === -1 || world[posX + 1][posY].typ === 1) worldEnvironment[1] = 1;
    if (world[posX][posY + 1].typ === -1 || world[posX][posY + 1].typ === 1) worldEnvironment[2] = 1;
    if (world[posX - 1][posY].typ === -1 || world[posX - 1][posY].typ === 1) worldEnvironment[3] = 1;
    break;
    default: return 0;
    }
    //console.log("X="+posX+"Y="+posY+"\nCode()"+worldEnvironment[0] +";"+ worldEnvironment[1] +";" + worldEnvironment[2] +";"+ worldEnvironment[3] +")")
  return convertToBin(worldEnvironment[0] * 1000 + worldEnvironment[1] * 100 + worldEnvironment[2] * 10 + worldEnvironment[3] * 1);
}
function render() {
  //context.globalAlpha = 0.5;
  let aktWorld;
  if (worldMode===0) aktWorld = Oworld;
  else aktWorld = Uworld;
  let cscale = Math.round(scale*16)/16;
  let date = Date.now();
  let now = date - last;
  last = date;
  context.clearRect(0, 0, width, height);
  if (groundRender===true)  {contextGround.clearRect(0, 0, width, height);}
  let Indentation = 0;
  let posx = 0;
  let posy = 0;
  let addPosX = (width / 64 + 2)|0 ;
  let addPosY = 1;

  let aktPosX = ((mapPosX|0) + addPosX + addPosY);
  let aktPosY = ((mapPosY|0) + addPosX - addPosY);
  for (let iy = -1; iy <= ((height/16)/cscale)|0; iy++) {
    if (Indentation == 0) {Indentation=1;posy++;posx--;}
    else Indentation = 0;
    aktPosX = ((mapPosX|0)+addPosX+addPosY+posx+Indentation);
    aktPosY = ((mapPosY|0)+addPosX-addPosY+posy);
    for (let ix = ((width / 64)/cscale)|0; ix >= -1;ix--){
      aktPosX--;
      aktPosY--;
      if (aktPosX < worldWidth && aktPosX >= 0 && aktPosY < worldHeight && aktPosY >= 0 && aktWorld[aktPosX][aktPosY].typ !== -1){
        let worldPos = aktWorld[aktPosX][aktPosY];
        let drawPosX = 64*ix+32*Indentation;
        let drawPosY = 16*iy;
        let height = (worldPos.height) * 16;
        //try  {
        let isAktField = (aktPosX >= aktPlayerPosX && aktPosY >= aktPlayerPosY && aktPosX < aktPlayerPosX + StaticEntity[aktGameObject].size && aktPosY < aktPlayerPosY + StaticEntity[aktGameObject].size)
        let aktReferenceX = (worldPos.reference[0]);
        let aktReferenceY = (worldPos.reference[1]);
        let typ = aktWorld[aktPosX - aktReferenceX][aktPosY -aktReferenceY].typ;
        let ground = aktWorld[aktPosX][aktPosY].ground;

        if (aktWorld[aktPosX][aktPosY].discovered === 1){

        let staticEntity = StaticEntity[typ];
        if (staticEntity.ready === false) continue;
        let envcode = findEnvorimentCode(aktWorld,aktPosX, aktPosY, staticEntity.envmode);
        let version = worldPos.version;
        let overDraw = ((staticEntity.sprite[version][envcode].overDraw));
        let animPhase = staticEntity.sprite[version][envcode].animationPhase;
        let anim = animator[animPhase] + worldPos.animation
        let imgSrcX = (aktReferenceX*32)+ (aktReferenceY * 32) + (staticEntity.size*64) * anim;
        let imgSrcY = 16 * (staticEntity.size - 1) -(aktReferenceX*16) + (aktReferenceY * 16);

        if (overDraw!==0){
          context.drawImage(
          staticEntity.sprite[version][envcode].texture,
          imgSrcX, imgSrcY,
          64, 32+overDraw|0,
          drawPosX*cscale, ((drawPosY - overDraw))*cscale|0,
          64*cscale, ((32+overDraw)*cscale)|0
          );
        }
        else if (groundRender===true){
          contextGround.drawImage(
          staticEntity.sprite[0][envcode].texture,
          imgSrcX, imgSrcY,
          64, 32,
          drawPosX*cscale, ((drawPosY))*cscale|0,
          64*cscale, ((32)*cscale)|0
          );
        }

          let aktEntity = EntityList[aktWorld[aktPosX][aktPosY].aktEntity];
          if (aktWorld[aktPosX][aktPosY].aktEntity !== -1){
            if (aktEntity.aktWorld === aktWorld){

            let EntityAddPosX = -100* (aktEntity.direction[0]-1)+(100-aktEntity.Progress) * (aktEntity.direction[0]-1)
            let EntityAddPosY = 100* (aktEntity.direction[1]-1)+-((100-aktEntity.Progress) * (aktEntity.direction[1]-1));
            
            let EntityFieldPosX = (((-EntityAddPosY)/100)*32)+(((EntityAddPosX)/100)*32);
            let EntityFieldPosY = (((-EntityAddPosY)/100)*16)-(((EntityAddPosX)/100)*16);

            let EntityDrawPosX = (drawPosX+EntityFieldPosX)|0;let EntityDrawPosY = (drawPosY+EntityFieldPosY)|0;
            
            if (MoveableEntity[aktEntity.typ].ready===true){
                context.drawImage(
                  MoveableEntity[aktEntity.typ].sprite[0].texture,
                  64*aktEntity.direction[0], 32*aktEntity.direction[1],
                  64, 32,
                  EntityDrawPosX*cscale, EntityDrawPosY*cscale,
                  64*cscale, 32*cscale
                );
            }
            if (aktEntity.selection === true||isAktField===true) {
                context.fillStyle = "rgba(0,0,0,1)";    
                context.fillRect(EntityDrawPosX+16, EntityDrawPosY-16,32, 4);
                context.fillStyle = "rgba(255,0,0,1)";
                context.fillRect(EntityDrawPosX+17, EntityDrawPosY-15,30, 2);
                context.fillStyle = "rgba(0,255,0,1)";
                //context.fillRect(EntityDrawPosX+17, EntityDrawPosY-15,aktEntity.Progress/100*30, 2);
                //context.fillRect(EntityDrawPosX+17, EntityDrawPosY-15,aktEntity.wait/(10*aktEntity.waitTry)*30, 2);
                context.fillRect(EntityDrawPosX+17, EntityDrawPosY-15,aktEntity.hp/MoveableEntity[aktEntity.typ].hp*30, 2);
                //context.fillText("x="+aktEntity.direction[0]+" y="+aktEntity.direction[1], EntityDrawPosX+16+36, EntityDrawPosY-16,32);
            }
          }
        }

      // if (worldPos.debug !== 0||worldPos.way !==0){
      //           context.fillStyle = "rgba(0,0,0,1)";   
      // context.fillText("("+worldPos.way+")", drawPosX+16, drawPosY+16,64);}

      }
        worldPos = aktWorld[aktPosX][aktPosY];
        if (isAktField===true){
          if (aktSelectetEntityNumber>0){
            switch (typ)
            {
            case 6: context.drawImage(UiAktField[1].sprite[0][0].texture,0, 0,64, 32,drawPosX*cscale, (drawPosY)*cscale,64*cscale, 32*cscale);break;
            case 7: context.drawImage(UiAktField[2].sprite[0][0].texture,0, 0,64, 32,drawPosX*cscale, (drawPosY)*cscale,64*cscale, 32*cscale);break;
            default:if (worldPos.begehbar===1)context.drawImage(UiAktField[0].sprite[0][0].texture,0, 0,64, 32,drawPosX*cscale, (drawPosY)*cscale,64*cscale, 32*cscale);break;
            }
          }
        }

        if (aktPosX === aktSelectetStaticposX && aktPosY === aktSelectetStaticposY){
            switch (typ)
            {
            case 12: case 13: case 14: 
              context.drawImage(UiAktField[4].sprite[0][0].texture,0, 0,64, 32,drawPosX*cscale, (drawPosY)*cscale,64*cscale, 32*cscale);
            break;
            }
          }
        

        //} catch (error) {try{context.drawImage(errorSprite.sprite[0][0].texture,0, 0,64, 32,drawPos[0], drawPos[1],64, 32);console.log(error);}catch(error) {}} //............
      }
    }
  }

  //console.log(mouse.down);
  if (mouse.down === true){
    context.fillStyle = "rgba(0,255,0,0.2)";
    context.fillRect(mouse.dx, mouse.dy,  mouse.x-mouse.dx, mouse.y-mouse.dy);
  }
  //pixelShader();

  context.fillStyle = "rgba(0,0,0,1)";
  context.textAlign="right"; 
  renderUi();//UI
  context.textAlign="left"; 

  context.fillStyle = "rgba(0,0,100,0.5)";
  context.fillRect(0, 0,128, 15*9);

  context.fillStyle = "rgba(0,255,0,1)";

  context.fillText("Graphics:", 4, 12.5);
  context.fillText("TotalTime: "+-(date -= Date.now())+"ms", 4, 12.5+15);
  context.fillText(`FPS: ${(1000/(now+0.1))|0}`, 4, 12.5+15*2);

  context.fillText("Logic:", 4, 12.5+15*3);
  context.fillText("TotalTime: "+DebugString[0]+"ms", 4, 12.5+15*4);
  context.fillText("Timer100: "+Timer100+"ms", 4, 12.5+15*5);
  context.fillText("Timer250: "+Timer250+"ms", 4, 12.5+15*6);
  context.fillText("Timer500: "+Timer500+"ms", 4, 12.5+15*7);

  context.fillText("LastWay: "+DebugString[4]+"ms", 4, 12.5+15*8);

  groundRender = false;
} // end Render
function renderUi(){
    if (Ui[4].ready===true){
            context.drawImage(
              Ui[4].sprite[0].texture,
              0, 0,
              64, 32,
            0, height-32,
          width, 32
    );}

    if (Ui[4].ready===true){
      context.drawImage(
      Ui[4].sprite[0].texture,
      0, 0,
      64, 64,
      0, height-192,
      192, 192
    
    );}

    // let pos = (164);
    // let mid = ((256)/2)|0;
    // context.translate(mid, height-mid); 
    // context.rotate(-0.78); 

    // if (Ui[4].ready===true){
    // context.drawImage(
    //   Ui[4].sprite[0].texture,
    //   0, 0,
    //   64, 64,
    //     -pos/2-4-128, -pos/2-4,
    // pos+128, pos
    // );}

    // context.drawImage(
    //   worldMap,
    //     0, 0,
    //     worldWidth, worldHeight,
    //     -pos/2, -pos/2,
    // pos-8, pos-8
    //   );
        context.drawImage(
      worldMap,
        0, 0,
        worldWidth*2, worldHeight*2,
        0, height-128,
    256, 128
      );
              context.drawImage(
      worldMap,
        0, 0,
        worldWidth*2, worldHeight*2,
        1, height-128,
    256, 128
      );
              context.drawImage(
      worldMap,
        0, 0,
        worldWidth*2, worldHeight*2,
        2, height-128,
    256, 128
      );
    // context.rotate(+0.78); 
    // context.translate(-(+mid), -(height-mid)); 


    context.textAlign="right"; 
    if (Ui[4].ready===true){
            context.drawImage(
              Ui[4].sprite[0].texture,
              0, 0,
              32, 32,
            width-96-16, height-96,
          96+32, 96
    );}

    if (Ui[0].ready===true){
            context.drawImage(
              Ui[0].sprite[0].texture,
              0, 0,
              32, 32,
            width-32, height-96,
          32, 32
    );}
    if (Ui[3].ready===true){
            context.drawImage(
              Ui[3].sprite[0].texture,
              0, 0,
              64, 32,
            width-96-8, height-96+8,
            64, 32
    );}
    context.fillText(ressourcen[0],width-96-8+ 64-4,height-96+8+ 12.5);

    if (Ui[1].ready===true){
            context.drawImage(
              Ui[1].sprite[0].texture,
              0, 0,
              32, 32,
            width-32, height-64,
          32, 32
    );}
    if (Ui[3].ready===true){
            context.drawImage(
              Ui[3].sprite[0].texture,
              0, 0,
              64, 32,
            width-96-8, height-64+8,
            64, 32
    );}
    context.fillText(ressourcen[1],width-96-8+ 64-4,height-64+8+ 12.5);

    if (Ui[2].ready===true){
            context.drawImage(
              Ui[2].sprite[0].texture,
              0, 0,
              32, 32,
            width-32, height-32,
          32, 32
    );}
    if (Ui[3].ready===true){
            context.drawImage(
              Ui[3].sprite[0].texture,
              0, 0,
              64, 32,
            width-96-8, height-32+8,
            64, 32
    );}
    context.fillText(ressourcen[2],width-96-8+ 64-4,height-32+8+ 12.5);
  //
  // findWay(10,10,9,12);
  //console.log(aktSelectetEntityTyp);
  switch (aktSelectetStaticTyp)
   {
    case 14:UiButton[7].render();break;
     default:
    switch (aktSelectetEntityTyp){
      case 0:UiButton[0].render();break;
      case 1:
      break;
      case 2:
      if (worldMode === 0){UiButton[0].render();UiButton[1].render();}
      else {UiButton[2].render();UiButton[3].render();UiButton[4].render();UiButton[5].render();UiButton[6].render();}
      break;
    }
     break;
   }

  //console.log("renderUi() -> "+-(date -= Date.now())+"ms");
}

//--Game----------------------------------------------------------------------------------------------------------------------------------------------------

function build(world,posX, posY, newTyp){
            if (posX < worldWidth && posX >= 0 && posY < worldHeight && posY >= 0)
            {
                for (let ix = 0; ix < StaticEntity[newTyp].size; ix++)
                {
                    for (let iy = 0; iy < StaticEntity[newTyp].size; iy++)
                    {
                        world[posX + ix][posY + iy].begehbar = StaticEntity[newTyp].begehbar
                        world[posX + ix][posY + iy].typ = -2;
                        world[posX + ix][posY + iy].version = 0;
                        world[posX + ix][posY + iy].reference[0] = ix;
                        world[posX + ix][posY + iy].reference[1] = iy;
                    }
                }

                world[posX][posY].version = (StaticEntity[newTyp].version * Math.random())|0;
                //if (StaticEntity[newTyp].envcode===0) 
                //world[posX][posY].animation = (StaticEntity[newTyp].sprite[world[posX][posY].version][0].animationPhase * Math.random())|0;
                //else 
                world[posX][posY].animation =0;        
                world[posX][posY].typ = newTyp;
                groundRender = true;
            }
}
function worldDiscovered(world,posX,posY,r){
                posX-=r;
                posY-=r;
                let width = posX+r*2+1
                let height = posY+r*2+1
                if (posX<1)posX=1;
                if (posY<1)posY=1;
                if (width>worldWidth-1)width=worldWidth-1;
                if (height>worldHeight-1)height=worldHeight-1;
                r-=1;
                  for (let ix = posX; ix < width; ix++)
                {
                    for (let iy = posY; iy < height; iy++)
                    {
                        world[ix][iy].discovered = 1;
                    }
                }

}
function inGameBuild(posX,posY,typ){
  switch (typ)
  {
    case 0:return//Destroy
    case 100: //Base

    for (let ix = posX-1;ix <= posX+1;ix++){
      for (let iy = posY-1;iy <= posY+1;iy++){
        build(Uworld,ix, iy, 10);
      }
    }
    build(Oworld,posX, posY, 6);
    worldDiscovered(Oworld,posX, posY, 10);

    for (let ix = posX-2;ix <= posX+2;ix++){
      for (let iy = posY-2;iy <= posY+2;iy++){
        build(Uworld,ix, iy, 8);
      }
    }

        generateTile(Uworld,1, 8, 0.6);
        
    loop = true;
    while (loop){
              for (let ix = 1; ix < worldWidth-2; ix++){
        for (let iy = 1; iy < worldHeight-2; iy++){
        if (Math.random() <= 0.01 && Uworld[ix][iy].typ === 8) {build(Uworld,ix, iy, 11);loop=false;}
        }
      }
    }
    loop = true;
    while (loop){
              for (let ix = 1; ix < worldWidth-2; ix++){
        for (let iy = 1; iy < worldHeight-2; iy++){
        if (Math.random() <= 0.01 && Uworld[ix][iy].typ === 8) {build(Uworld,ix, iy, 12);loop=false;}
        }
      }
    }
    loop = true;
    while (loop){
              for (let ix = 1; ix < worldWidth-2; ix++){
        for (let iy = 1; iy < worldHeight-2; iy++){
        if (Math.random() <= 0.01 && Uworld[ix][iy].typ === 8) {build(Uworld,ix, iy, 13);loop=false;}
        }
      }
    }
    loop = true;
    while (loop){
              for (let ix = 1; ix < worldWidth-2; ix++){
        for (let iy = 1; iy < worldHeight-2; iy++){
        if (Math.random() <= 0.01 && Uworld[ix][iy].typ === 8) {build(Uworld,ix, iy, 14);loop=false;}
        }
      }
    }

    //         build(Uworld,posX+1, posY-3, 11);
    // build(Uworld,posX+2, posY-3, 11);
    // build(Uworld,posX+2, posY-2, 11);
    // build(Uworld,posX+3, posY-2, 11);

    // build(Uworld,posX-1, posY+3, 12);
    // build(Uworld,posX-2, posY+3, 12);
    // build(Uworld,posX-2, posY+2, 12);
    // build(Uworld,posX-3, posY+2, 12);

 generateTile(Uworld,1, 11, 0.3);
  generateTile(Uworld,1, 12, 0.2);
    generateTile(Uworld,1, 13, 0.2);
      generateTile(Uworld,1, 14, 0.2);


    build(Uworld,posX, posY, 7);
    worldDiscovered(Uworld,posX, posY, 30);

    //     for (let ix = posX-1;ix <= posX+1;ix++){
    //   for (let iy = posY-3;iy <= posY+3;iy++){
    //     build(Uworld,ix, iy, 8);
    //   }
    // }
    //     for (let ix = posX-3;ix <= posX+3;ix++){
    //   for (let iy = posY-1;iy <= posY+1;iy++){
    //     build(Uworld,ix, iy, 8);
    //   }
    // }

    // for (let iy = posY-2;iy <= posY+2;iy++){
    //   build(Uworld,ix, iy, 8);
    // }
    return
    case 2: //Strasse
    if (ressourcen[2]>0)
    {
    build(Oworld,posX, posY, 10);
    worldDiscovered(Oworld,posX, posY, 3);
    ressourcen[2]--;
    }
    return
  }

}
function addEntity(world,typ,worldPos){
  let loop = true
      let ii = 0;
  while (loop){
    if (EntityList[ii] === void 0||EntityList[ii].live===false){
      EntityList[ii] = 
      {
        live: true,
        selection: false,
        typ: typ,
        worldPos: worldPos,
        FieldPos: [0,100],
        Progress: 0,
        direction: [0,0],
        goalX: worldPos[0],
        goalY: worldPos[1],
        WorkGoalX: worldPos[0],
        WorkGoalY: worldPos[1],
        TotalGoalX: worldPos[0],
        TotalGoalY: worldPos[1],
        wait:0,
        waitTry:1,
        aktWayPos:-1,
        aktWorld:world,
        wayLenght:0,
        way: [-1],
        hp: MoveableEntity[typ].hp
      }

      world[worldPos[0]][worldPos[1]].aktEntity = ii;
      gotoNext(ii);
      worldDiscovered(world,EntityList[ii].worldPos[0],EntityList[ii].worldPos[1],MoveableEntity[EntityList[ii].typ].view)
      
      loop = false;
    }
    //console.log(ii);
    ii++;
  }
  //console.log(EntityList);
}
function killEntity(entity){

    if (!(EntityList[entity] === void 0)||EntityList[entity].live===true){
      EntityList[entity].aktWorld[EntityList[entity].worldPos[0]][EntityList[entity].worldPos[1]].aktEntity = -1;
      EntityList[entity].aktWorld[EntityList[entity].goalX][EntityList[entity].goalY].resEntity = -1;

      EntityList[entity].live = false;
      EntityList[entity].selection = false;
    }
  //console.log(EntityList);
}
function coliMap(coliEntity){
      if (coliEntity===true){
      for (let ix = 1; ix < worldWidth-2; ix++){
        for (let iy = 1; iy < worldHeight-2; iy++){
          if (Oworld[ix][iy].begehbar===1&&Oworld[ix][iy].aktEntity===-1)Oworld[ix][iy].way = 0;
          else Oworld[ix][iy].way = -1;
        }
      }
    }else{
      for (let ix = 1; ix < worldWidth-2; ix++){
        for (let iy = 1; iy < worldHeight-2; iy++){
          if (Oworld[ix][iy].begehbar===1)Oworld[ix][iy].way = 0;
          else Oworld[ix][iy].way = -1;
        }
      }
    }
}
function findWay(world,startX,startY,goalX,goalY,coliEntity){
  //console.log("findWay()----------------------------------------------------------------------------------")
  let way =[-1,-1];
  let date = Date.now();
  let loop = true;
  let ix=1,iy=1;
  let i = 2;
  let ir = 1
  let start,end;
  let loopStartX,loopEndX,loopStartY,loopEndY;
  if (world[goalX][goalY].begehbar===1||world[goalX][goalY].typ===6||world[goalX][goalY].typ===7){

      if (coliEntity===true){


      for (let ix = 1; ix < worldWidth-2; ix++){
        for (let iy = 1; iy < worldHeight-2; iy++){
          if (world[ix][iy].begehbar===1&&world[ix][iy].aktEntity===-1)world[ix][iy].way = 0;
          else world[ix][iy].way = -1;
        }
      }
    }else{
      for (let ix = 1; ix < worldWidth-2; ix++){
        for (let iy = 1; iy < worldHeight-2; iy++){
          if (world[ix][iy].begehbar===1)world[ix][iy].way = 0;
          else world[ix][iy].way = -1;
        }
      }
    }


    world[startX][startY].way = 1;
    while (loop){
      loop = false;


      // if (ir === 0){
      // ix = startX;iy = startY;
      // wayCode()
      // }else{  

        if ((loopStartX = startX-ir)<1)loopStartX=1;ix = loopStartX;
        if ((loopEndX = startX+ir)>worldWidth-2)loopEndX=worldWidth-2;
        if ((loopStartY = startY-ir)<1)loopStartY=1;iy = loopStartY;
        if ((loopEndY = startY+ir)>worldHeight-2)loopEndY=worldHeight-2;

        ix = loopStartX;
        while (ix < loopEndX){
          iy = loopStartY;
          while (iy < loopEndY){
            if (world[ix][iy].way === i-1 ){

              let kosten = i;
              if (world[ix+1][iy].way === 0){world[ix+1][iy].way = kosten;loop = true;}
              if (world[ix][iy+1].way === 0){world[ix][iy+1].way = kosten;loop = true;}
              if (world[ix-1][iy].way === 0){world[ix-1][iy].way = kosten;loop = true;}
              if (world[ix][iy-1].way === 0){world[ix][iy-1].way = kosten;loop = true;}

              if (world[ix+1][iy+1].way === 0 && (world[ix+1][iy].begehbar===1 && world[ix][iy+1].begehbar===1)){world[ix+1][iy+1].way = kosten;loop = true;}
              if (world[ix+1][iy-1].way === 0 && (world[ix+1][iy].begehbar===1 && world[ix][iy-1].begehbar===1)){world[ix+1][iy-1].way = kosten;loop = true;}
              if (world[ix-1][iy+1].way === 0 && (world[ix-1][iy].begehbar===1 && world[ix][iy+1].begehbar===1)){world[ix-1][iy+1].way = kosten;loop = true;}
              if (world[ix-1][iy-1].way === 0 && (world[ix-1][iy].begehbar===1 && world[ix][iy-1].begehbar===1)){world[ix-1][iy-1].way = kosten;loop = true;}
              //(ix+2 > goalX && ix-2 < goalX && iy+2 > goalY && iy-2 < goalY)
              if (ix+2 > goalX && ix-2 < goalX && iy+2 > goalY && iy-2 < goalY){
                  
                let aktPosX = goalX, aktPosY=goalY;
                way[i] = -1;
                for (let iw = i-1;iw>=1;iw--){
                  if (world[aktPosX+1][aktPosY].way === iw){way[iw] = [-1,0];aktPosX++;continue;}
                  if (world[aktPosX][aktPosY+1].way === iw){way[iw] = [0,-1];aktPosY++;continue;}
                  if (world[aktPosX-1][aktPosY].way === iw){way[iw] = [+1,0];aktPosX--;continue;}
                  if (world[aktPosX][aktPosY-1].way === iw){way[iw] = [0,+1];aktPosY--;continue;}

                  if (world[aktPosX+1][aktPosY+1].way === iw){way[iw] = [-1,-1];aktPosX++;aktPosY++;continue;}
                  if (world[aktPosX+1][aktPosY-1].way === iw){way[iw] = [-1,+1];aktPosX++;aktPosY--;continue;}
                  if (world[aktPosX-1][aktPosY+1].way === iw){way[iw] = [+1,-1];aktPosX--;aktPosY++;continue;}
                  if (world[aktPosX-1][aktPosY-1].way === iw){way[iw] = [+1,+1];aktPosX--;aktPosY--;continue;}

                }

                loop = false;
                ix = worldWidth;
                iy = worldHeight;
              }
            }
            iy++;
          }
          ix++;
        }

      //}

      // ix = 1;
      // while (ix < worldWidth-2){
      //   iy=1;
      //   while (iy < worldHeight-2){
      //    wayCode();
      //    iy++;
      //   }
      //   ix++;
      // }

        // //--------------------------------------------------\\ // O
        // if ((iy = startY-ir)<1)iy=1;

        // if ((start = startX-ir)<1)start=1;ix = start;
        // if ((end = startX+ir-1)>worldWidth-1)end=worldWidth-1;
        // while (ix <= end){
        //   wayCode();
        //   ix++;
        // }
        // //--------------------------------------------------\\ // U
        // if ((iy = startY+ir)>worldHeight-1)iy=worldHeight-1;

        // if ((start = startX-ir+1)<1)start=1;ix = start;
        // if ((end = startX+ir)>worldWidth-1)end=worldWidth-1;
        // while (ix <= end){
        //   wayCode();
        //   ix++;
        // }
        // //--------------------------------------------------\\ // L
        // if ((ix = startX-ir)<1)ix=1;

        // if ((start = startY-ir+1)<1)start=1;iy = start;
        // if ((end = startY+ir)>worldHeight-1)end=worldHeight-1;
        // while (iy <= end){
        //   wayCode();
        //   iy++;
        // }
        // //--------------------------------------------------\\ // R
        // if ((ix = startX+ir)>worldWidth-1)ix=worldWidth-1;

        // if ((start = startY-ir)<1)start=1;iy = start;
        // if ((end = startY+ir-1)>worldHeight-1)end=worldHeight-1;
        // while (iy <= end){
        //   wayCode();
        //   iy++;
        // }
        // //--------------------------------------------------\\


      
      i++;ir++;
    }

    //console.log("Time -> "+-(date -= Date.now())+"ms"+"  s="+s);
    //return way
  }
  DebugString[4]="i="+i +" time="+ (Date.now()-date);
  console.log(way);
  return way;
}
function gotoNext(Entity){
  let aktEntity = EntityList[Entity];
  let world = aktEntity.aktWorld;
  if ((aktEntity.worldPos[0]===aktEntity.TotalGoalX && aktEntity.worldPos[1]===aktEntity.TotalGoalY) && aktEntity.Progress===0){
    for (let iy = -1;iy <2;iy++){
      for (let ix = -1;ix <2;ix++){
        if (world[aktEntity.worldPos[0]+ix][aktEntity.worldPos[1]+iy].begehbar===1 && world[aktEntity.worldPos[0]+ix][aktEntity.worldPos[1]+iy].aktEntity===-1){
          aktEntity.goalX=aktEntity.TotalGoalX+=ix;
          aktEntity.goalY=aktEntity.TotalGoalY+=iy;
          aktEntity.Progress = 1;
          aktEntity.aktWayPos = 1;
          //console.log(aktEntity.way = [-1,[ix,iy],-1]);
          ix=3;iy=3;}
      }
    }
  }
}
function moveEntity(Entity){

    let move = [0,0];
    let aktEntity = EntityList[Entity];
    let world = aktEntity.aktWorld;
        //gotoNext(Entity);
    if(aktEntity.hp>0||world[aktEntity.worldPos[0]][aktEntity.worldPos[1]].aktEntity===Entity){//Entety lebt?
    if ((aktEntity.worldPos[0]!==aktEntity.TotalGoalX || aktEntity.worldPos[1]!==aktEntity.TotalGoalY)||aktEntity.Progress!==0){
        if (world[aktEntity.goalX][aktEntity.goalY].aktEntity===-1&&world[aktEntity.goalX][aktEntity.goalY].begehbar===1){

          aktEntity.Progress -= MoveableEntity[aktEntity.typ].speed;

          if(aktEntity.Progress<=0){
            aktEntity.Progress+=100;

            if (aktEntity.worldPos[0]>aktEntity.goalX) move[0] = -1;
            if (aktEntity.worldPos[0]<aktEntity.goalX) move[0] = +1;
            if (aktEntity.worldPos[1]>aktEntity.goalY) move[1] = -1;
            if (aktEntity.worldPos[1]<aktEntity.goalY) move[1] = +1;
            aktEntity.direction[0] = move[0]+1;
            aktEntity.direction[1] = move[1]+1;

            world[aktEntity.worldPos[0]][aktEntity.worldPos[1]].aktEntity = -1;

            aktEntity.aktWayPos++;
            if (aktEntity.way[aktEntity.aktWayPos]!==-1){     
              try{
              aktEntity.goalX+=aktEntity.way[aktEntity.aktWayPos][0];
              aktEntity.goalY+=aktEntity.way[aktEntity.aktWayPos][1];
              }catch(e){}
            }

            aktEntity.worldPos[0]+=move[0];
            aktEntity.worldPos[1]+=move[1];
            world[aktEntity.worldPos[0]][aktEntity.worldPos[1]].aktEntity = Entity;
            worldDiscovered(world,aktEntity.worldPos[0],aktEntity.worldPos[1],MoveableEntity[aktEntity.typ].view)
          }
          aktEntity.wait=0;
          aktEntity.waitTry=1;
        }
        else{
          if (world[aktEntity.goalX][aktEntity.goalY].aktEntity!==-1&&world[aktEntity.goalX][aktEntity.goalY].typ!==6&&world[aktEntity.goalX][aktEntity.goalY].typ!==7)gotoNext(world[aktEntity.goalX][aktEntity.goalY].aktEntity);
          if(aktEntity.Progress>0)aktEntity.Progress-=MoveableEntity[aktEntity.typ].speed;
          else if(aktEntity.Progress<0)aktEntity.Progress+=1;
          else if (aktEntity.Progress===0&&(aktEntity.goalX!==aktEntity.TotalGoalX)&&(aktEntity.goalY!==aktEntity.TotalGoalY)){
            aktEntity.wait++;
            if (aktEntity.wait>10*aktEntity.waitTry){
              aktEntity.wait=0;      
              aktEntity.waitTry++;
              aktEntity.way = findWay(aktEntity.aktWorld,aktEntity.worldPos[0],aktEntity.worldPos[1],aktEntity.TotalGoalX,aktEntity.TotalGoalY,(aktEntity.waitTry%2===0));
              aktEntity.aktWayPos = 1;
              if (aktEntity.way[1] !== -1){
                try{
                aktEntity.goalX = aktEntity.worldPos[0]+aktEntity.way[aktEntity.aktWayPos][0],
                aktEntity.goalY = aktEntity.worldPos[1]+aktEntity.way[aktEntity.aktWayPos][1]
                }catch(e){}
              }
            }
          }
        }
      }
      else{
        switch(world[aktEntity.worldPos[0]][aktEntity.worldPos[1]].typ)
        {
          case 6:
          if(Uworld[aktEntity.worldPos[0]][aktEntity.worldPos[1]].aktEntity===-1){
          aktEntity.aktWorld = Uworld; 
          Oworld[aktEntity.worldPos[0]][aktEntity.worldPos[1]].aktEntity = -1;
          Uworld[aktEntity.worldPos[0]][aktEntity.worldPos[1]].aktEntity = Entity;
          gotoNext(Entity);
          }
          break;
          case 7:
          if(Oworld[aktEntity.worldPos[0]][aktEntity.worldPos[1]].aktEntity===-1){
          aktEntity.aktWorld = Oworld; 
          Uworld[aktEntity.worldPos[0]][aktEntity.worldPos[1]].aktEntity = -1;
          Oworld[aktEntity.worldPos[0]][aktEntity.worldPos[1]].aktEntity = Entity;
          gotoNext(Entity);
          }
          break;
        }
      }
    }
    else{killEntity(Entity)}
}
  
//--Effents----------------------------------------------------------------------------------------------------------------------------------------------------
function mapScroal(timeFactor){
  // mouseEffents();

  // skip function if nothing to do
  //if (mapMoveX === 0 && mapMoveY === 0) return void 0;

  if (timeFactor<1)timeFactor=1;
  let oldPosX = mapPosX;
  let oldPosY = mapPosY;
  decmapPosX += (0 + mapMoveX*timeFactor)|0;
  decmapPosY += (0 + mapMoveX*timeFactor)|0;
  decmapPosX += (0 - mapMoveY*timeFactor)|0;
  decmapPosY -= (0 - mapMoveY*timeFactor)|0;

  //console.log ("... -> "+decmapPosX+" -> "+mapPosX);
  while (decmapPosX>=1===true){decmapPosX--;mapPosX++;}
  while (decmapPosX<0===true){decmapPosX++;mapPosX--;}
  while (decmapPosY>=1===true){decmapPosY--;mapPosY++;}
  while (decmapPosY<0===true){decmapPosY++;mapPosY--;}
         //mapMoveX = 0; mapMoveY = 0;
  if ((oldPosX !== mapPosX)||(oldPosY !== mapPosY))  groundRender = true;
}

function setMouse(e,mode) { 
  mouse = e || window.event;
  let isRightMB;

  if ("which" in e)  // Gecko (Firefox), WebKit (Safari/Chrome) & Opera
    isRightMB = e.which === 3; 
  else if ("button" in e)  // IE, Opera 
    isRightMB = e.button === 2; 
  mouse.isRightMB = isRightMB
  mouse.x = mouse.clientX
  mouse.y = mouse.clientY
  mouse.mode = mode;
  mouse.down;
  //console.log(mode);
  switch (mode)
  {
    case 0:break;
    case 1:break;
    //console.log(1);
    mouse.down = true;
    mouse.dx = mouse.x;
    mouse.dy = mouse.y;
    case 2:break;
        //console.log(2);
    mouse.down = false;
  }
  //console.log(mouse.down);
 }

function mouseEffents(){
  //mapPosX=0;mapPosY=0;
  let aktWorld;
  if (worldMode===0) aktWorld = Oworld;
  else aktWorld = Uworld;

  let e = mouse;let ex = (e.x)|0;let ey = (e.y)|0;
  ex -= ((StaticEntity[aktGameObject].size-1) * 32);
  let fy = ((ex / 64) + (ey / 32));let fx = ((ex / 64) - (ey / 32))+100;//float
  let x = (fx-0.5)|0;let y = (fy+0.5)|0;

  //if  (mapPosX % 2 ==1) x++;
   // if (x<=0)x--;

  x += 1 + mapPosX-99;y += mapPosY;
  if (!mouse.isRightMB){ //Right
    aktPlayerPosX = (x)|0;aktPlayerPosY = (y)|0;
  }
  mapMoveX = 0;
  mapMoveY = 0;
  if (e.x < 10) mapMoveX = -1;
  if (e.y < 10) mapMoveY = -1;
  if (e.x > width-10) mapMoveX = 1;
  if (e.y > height-10) mapMoveY = 1;
};
function buttonClick(posX,posY,width,height){
  if (mouse.x >= posX && mouse.x <= posX+width && mouse.y >= posY && mouse.y <= posY+height) return 1;
  return 0;
  }
let resize = () => {
	width = window.innerWidth;
	height = window.innerHeight;

	canvas.width = width;
  canvas.height = height;
  canvasGround.width = width;
  canvasGround.height = height;
  context.imageSmoothingEnabled = false;
  context.font = "12px Arial";
  context.fillStyle = "#000";
  groundRender = true;
 };

window.addEventListener("mousewheel", (e) => {
	e.preventDefault();
	let x = e.deltaY > 0 ? -1 : 1;
  if (scale <= 0.1) scale = 0.1;
  if (scale >= 80) scale = 80;
	scale += x/1e1;
  // scale *= x + .25;
  // console.log(scale);
 });
window.addEventListener("mousemove", (e) => {
  mouse.setMouse(e,0);
  mouseEffents();
  
 });

window.addEventListener("mousedown",(e) => {
  mouse.setMouse(e,1);
  lastAktPlayerPosX = aktPlayerPosX;
  lastAktPlayerPosY = aktPlayerPosY;
  //console.log(mouse);
  // if (mouse.isRightMB===true) {
  //   mapMoveX = ((mouse.x - (width/2)) / 64)|0;
  //   mapMoveY = ((mouse.y - (height / 2)) / 32)|0;
  //   mapScroal();
  //   mapMoveX = 0;
  //   mapMoveY = 0;
  // }
 });
window.addEventListener("mouseup", (e) => {
  mouse.setMouse(e,2);
  let aktWorld;
  if (worldMode===0) aktWorld = Oworld;
  else aktWorld = Uworld;

  if (buttonClick(0,height-100,100,100)===1){
    if (worldMode===0)worldMode = 1;
    else worldMode = 0;
    groundRender = true;
    return
  }

  if (mouse.isRightMB===true){ //RightMouse



    mapMoveX = 0; mapMoveY = 0;
    for (let ii = 0;ii<=MaxEntity;ii++){
      if (EntityList[ii] !== void 0 && EntityList[ii].live===true && EntityList[ii].selection===true){

          EntityList[ii].TotalGoalX = aktPlayerPosX;EntityList[ii].TotalGoalY = aktPlayerPosY;
          EntityList[ii].way =findWay(EntityList[ii].aktWorld,EntityList[ii].worldPos[0],EntityList[ii].worldPos[1],aktPlayerPosX,aktPlayerPosY,false);
          EntityList[ii].aktWayPos = 1;
          if (EntityList[ii].way[1] !== -1){
            EntityList[ii].goalX = EntityList[ii].worldPos[0]+EntityList[ii].way[EntityList[ii].aktWayPos][0],
            EntityList[ii].goalY =EntityList[ii].worldPos[1]+EntityList[ii].way[EntityList[ii].aktWayPos][1]
          }

      }
    }
  }



  else { //LeftMouse




    if (UiButton[0].clicked() === true||UiButton[0].clicked() === true){
        console.log(lastbut);
      for (let ii = 0;ii<=MaxEntity;ii++){
        if (EntityList[ii] !== void 0 && EntityList[ii].live===true && EntityList[ii].selection===true){
         switch (EntityList[ii].typ)
         {
           case 0:
           case 2:
          killEntity(ii);
          inGameBuild(EntityList[ii].worldPos[0],EntityList[ii].worldPos[1],100)

          addEntity(Uworld,1,EntityList[ii].worldPos)

          // for (let i = 10; ix < worldWidth-20; ix++){
          //   for (let iy = 10; iy < worldHeight-20; iy++){
          //     if (Math.random() <= 0.8 && Uworld[ix][iy].begehbar === 1 && Uworld[ix][iy].aktEntity===-1) {
          //       //addEntity(Uworld,2,ix,iy);
          //       addEntity(Uworld,2,ix,iy);
          //     }
          //   }
          // }

          addEntity(Oworld,2,[EntityList[ii].worldPos[0],EntityList[ii].worldPos[1]+1])
          addEntity(Oworld,2,[EntityList[ii].worldPos[0],EntityList[ii].worldPos[1]-1])
          addEntity(Oworld,2,[EntityList[ii].worldPos[0]+1,EntityList[ii].worldPos[1]])
          addEntity(Oworld,2,[EntityList[ii].worldPos[0]-1,EntityList[ii].worldPos[1]])
          break;
          //            case 2:
          // inGameBuild(EntityList[ii].worldPos[0],EntityList[ii].worldPos[1],2)

          // break;
         }
        }
      }
    }
    else if (UiButton[1].clicked() === true){
            for (let ii = 0;ii<=MaxEntity;ii++){
        if (EntityList[ii] !== void 0 && EntityList[ii].live===true && EntityList[ii].selection===true){
         switch (EntityList[ii].typ)
         {
           case 2:
      inGameBuild(EntityList[ii].worldPos[0],EntityList[ii].worldPos[1],2)
            }}}
    }
    else if (UiButton[7].clicked() === true){
        console.log(lastbut);
      //console.log(""+aktSelectetStaticposX+"-"+aktSelectetStaticposY);
     addEntity(Uworld,2,[aktSelectetStaticposX,aktSelectetStaticposY])
     gotoNext(world[aktSelectetStaticposX][aktSelectetStaticposY].aktEntity);
    }
    else{
      aktSelectetStaticTyp = aktWorld[aktPlayerPosX][aktPlayerPosY].typ;
      aktSelectetStaticposX = aktPlayerPosX;
      aktSelectetStaticposY = aktPlayerPosY;
      switch (keyCode)
      {
        case 16: //Shift
          if (aktWorld[aktPlayerPosX][aktPlayerPosY].aktEntity!==-1){
            EntityList[aktWorld[aktPlayerPosX][aktPlayerPosY].aktEntity].selection = !EntityList[aktWorld[aktPlayerPosX][aktPlayerPosY].aktEntity].selection;
            aktSelectetEntityTyp=-1;}
          else if (aktWorld[aktPlayerPosX][aktPlayerPosY].resEntity!==-1){
            EntityList[aktWorld[aktPlayerPosX][aktPlayerPosY].resEntity].selection = !EntityList[aktWorld[aktPlayerPosX][aktPlayerPosY].resEntity].selection;
            aktSelectetEntityTyp=-1;}
        break
        default: 
          for (let ii = 0;ii<=MaxEntity;ii++){
            if (EntityList[ii] !== void 0 && EntityList[ii].live===true){
              EntityList[ii].selection = false;
            }
          }
          aktSelectetEntityNumber=0;
          aktSelectetEntityTyp=-1;
          if (aktWorld[aktPlayerPosX][aktPlayerPosY].aktEntity!==-1) {
            EntityList[aktWorld[aktPlayerPosX][aktPlayerPosY].aktEntity].selection = true;
            aktSelectetEntityTyp=EntityList[aktWorld[aktPlayerPosX][aktPlayerPosY].aktEntity].typ;
            aktSelectetEntityNumber=1;}
          else if (aktWorld[aktPlayerPosX][aktPlayerPosY].resEntity!==-1) {
            EntityList[aktWorld[aktPlayerPosX][aktPlayerPosY].resEntity].selection = true;
            aktSelectetEntityTyp=EntityList[aktWorld[aktPlayerPosX][aktPlayerPosY].resEntity].typ;
            aktSelectetEntityNumber=1;}
        break;
      }
    }




  } //EndMouse
 });
window.addEventListener("resize", resize);
resize();

window.addEventListener("keydown", (e) => {
  keyCode = e.keyCode;

  //console.log(keyCode);
  switch (keyCode)
  {  
    case 116:location.reload();break;//F5
    case 46:
      for (let ii = 0;ii<=MaxEntity;ii++){
        if (EntityList[ii] !== void 0 && EntityList[ii].live===true&&EntityList[ii].selection===true){
          EntityList[ii].hp -=1;
        }
      }
    break;//Entf
  }
});
window.addEventListener("keyup", (e) => {
keyCode = -1;
});

})();