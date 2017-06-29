"use strict";
//--class--------------------------------------------------------------------------------------------------------------------------------------------------------
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
      this.x = e.clientX
      this.y = e.clientY
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
    
  class GUI{
    constructor(path,align,posX,posY,width,height) {
      this.posX = posX;
      this.posY = posY;
      this.width = width;
      this.height = height;
      this.alignX=0;this.alignY=0;
      this.image = loadUi(path);
      this.enabled = true;

      switch (align){
        case 0:this.alignX=0;this.alignY=0;break; //ol
        case 1:this.alignX=1;this.alignY=0;break; //or
        case 2:this.alignX=0;this.alignY=1;break; //ul
        case 3:this.alignX=1;this.alignY=1;break; //ur
      }
    }
    render(){
      if (this.image.ready===true&&this.enabled===true){
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
    }
    clicked() { //-<<-<>->>-<>-<<-<>->>-
      if (  
        mouse.x > this.posX+(width*this.alignX)  &&  
        mouse.y > this.posY+(height*this.alignY)  &&  
        mouse.x < this.posX+(width*this.alignX)+this.width  &&  
        mouse.y < this.posY+(height*this.alignY)+this.height  &&
        this.enabled===true
        )
        {return true;}
      return false;
    }
    render(){
      if (this.image.ready===true&&this.enabled===true){
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





//--Public-------------------------------------------------------------------------------------------------------------------------------------------------------

  //--System/Render--
  let last = Date.now();
  let context = canvas.getContext("2d");
  let contextGround = canvasGround.getContext("2d");
  let animator = [0];
  let groundRender = true;
  let mouse = new MyMouseEvent(); //MouseEventArgs
  let keyCode = -1;
  let alpha = 0.0;
  let worldMap
  var Timer = Date.now();
  var Timer020=0;
  var Timer100=0; 
  var Timer250=0;
  var Timer500=0;

  //--Camera/Player--
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

  //--World--
  let width = window.innerWidth;
  let height = window.innerHeight;
  let worldHeight=0, worldWidth=0;
  let Oworld = [];
  let Uworld = [];
  let EntityList = [];

  //--GameData--
  let MaxEntity = 2000;
  let MoveableEntity = []; //[loadMoveableEntity]
  let StaticEntity = [];   //[loadStaticEntity()]
  let GroundTexture = [];  //[loadStaticEntity()]
  let Ui = [];             //[loadUi()]
  let UiButton = [];       //[new Button]
  let UiAktField = [];     //[loadStaticEntity()]

  //--Flags/Gameplay--
  let aktSelectetEntityTyp = -1;
  let aktSelectetEntityNumber = 0;
  let aktSelectetStaticTyp = -1;
  let aktSelectetStaticposX=0,aktSelectetStaticposY=0;
  let lastEntity
  let worldMode = 0;
  let aktGameObject = -0;
  let TypNumber = [];
  let ressourcen = [200,500,0]//Baustoff//Essen//Volk

  //--Debug--
  let lastbut=0;
  let butzahl=0;
  let DebugString = [];



//--BuildGame----------------------------------------------------------------------------------------------------------------------------------------------------

  function imgToCanvas(img) {
    let canvas = document.createElement("canvas");
    let context  = canvas.getContext("2d");
    context.imageSmoothingEnabled = false;//Chrome
    context.mozImageSmoothingEnabled = false;//Firefox
    canvas.width = img.width;
    canvas.height = img.height;
    context .drawImage(img, 0, 0, img.width, img.height);

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




//--initGame-----------------------------------------------------------------------------------------------------------------------------------------------------

  function initGame(){
    loadAssets();
    buildHTML();
    addEvents();

    setMouse(mouse,0);setMouse(mouse,1);setMouse(mouse,2);
    buildMap(128*2,128*2);

    //Start Game
    logikTimer();       // run logik loop
    renderTimer();      // run render loop
  };
  function loadAssets(){
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
      new Button("./assets/png/Ui/B_Koenigen",2,0,-44-32-100,48,48),
      new Button("./assets/png/Ui/B_Koenigen",2,48,-44-32-100,48*2,48),
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
      loadStaticEntity("./assets/png/Natur/Berg",1,1,0,1),//1
      loadStaticEntity("./assets/png/Natur/Wasser/Wasser",1,1,3,0),
      loadStaticEntity("./assets/png/Natur/Wald/Wald",1,5,0,0),
      loadStaticEntity("./assets/png/Natur/Moos",1,1,1,1),
      loadStaticEntity("./assets/png/Natur/Stein",1,2,0,0),
      loadStaticEntity("./assets/png/Natur/Wald/WaldLaus",1,1,0,0),//6
      loadStaticEntity("./assets/png/Bauten/Eingang",1,1,0,1), //----------------7
      loadStaticEntity("./assets/png/Untergrund/UEingang",1,1,0,1), //------------------------8
      loadStaticEntity("./assets/png/Untergrund/UBerg",1,1,0,1),
      loadStaticEntity("./assets/png/Untergrund/Urand",1,1,1,0),
      loadStaticEntity("./assets/png/Bauten/Strasse",1,1,1,1),//11
      loadStaticEntity("./assets/png/Untergrund/UPilz",1,1,0,0),
      loadStaticEntity("./assets/png/Untergrund/ULagerBvoll",1,1,0,0),
      loadStaticEntity("./assets/png/Untergrund/ULagerNvoll",1,1,0,0),
      loadStaticEntity("./assets/png/Untergrund/ULagerLvoll",1,1,0,0),
      loadStaticEntity("./assets/png/Untergrund/ULagerBleer",1,1,0,1),//16
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
    for (let i = 0;i<UiButton.length;i++){UiButton[i].enabled=false;}
  }
  function buildHTML(){
    var button = document.createElement('p');
    button.textContent = 'Click to start game in fullscreenmode\n (recommended for Firefox, else use F11)';
    button.title = 'Press F11 to enter or leave fullscreen mode';
    button.setAttribute('style', 'position: fixed; top: -16px; left: 128px;width: 280px;height: 48px; background: #004; color: #0f0; opacity: 0.5; cursor: pointer;')
    
    button.addEventListener('click', function(event) {
      if (document.body.requestFullScreen) {
        document.body.requestFullScreen();
      } else if (document.body.mozRequestFullScreen) {
        document.body.mozRequestFullScreen();
      } else if (document.body.webkitRequestFullScreen) {
        document.body.webkitRequestFullScreen(Element.ALLOW_KEYBOARD_INPUT);
      }
    }, false);
    
    document.body.appendChild(button);
  }
  function addEvents(){
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
    });

    window.addEventListener("mouseup", (e) => {
      mouse.setMouse(e,2);
      let aktWorld;
      if (worldMode===0) aktWorld = Oworld;
      else aktWorld = Uworld;


      if (mouse.isRightMB===true){ //RightMouse
        clickOnMapComand(aktWorld);
      }
      else/*(mouse.isRightMB===false)*/{ //LeftMouse
        if (clickOnButton()===false){
          clickOnMapSelect(aktWorld)
        }
        for (let i = 0;i<UiButton.length;i++){UiButton[i].enabled=false;}
        switch (aktSelectetStaticTyp){
          case 14:UiButton[7].enabled=true;break;
          default:
            switch (aktSelectetEntityTyp){
              case 0:UiButton[0].enabled=true;break;
              case 1:break;
              case 2:
                if (worldMode === 0){UiButton[0].enabled=true;UiButton[1].enabled=true;}
                else {UiButton[2].enabled=true;UiButton[3].enabled=true;UiButton[4].enabled=true;UiButton[5].enabled=true;UiButton[6].enabled=true;}
              break;
            }
          break;
        }
      }
    });

    window.addEventListener("dblclick", (e) => {   
      let aktWorld;
      if (worldMode===0) aktWorld = Oworld;
      else aktWorld = Uworld;

      if (clickOnButton()===false){
        dbClickOnMapSelect(aktWorld)
      }
    });

    window.addEventListener("resize", resize); {
        resize();
    }

    // window.addEventListener("contextmenu", (e) => {
    //   e.preventDefault();
    // });
    //window.addEventListener("")

    window.addEventListener("keydown", (e) => {
      keyCode = e.keyCode;
      console.log(keyCode);
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
  }



//--GameLoop-----------------------------------------------------------------------------------------------------------------------------------------------------

  function renderTimer(){
    requestAnimationFrame(renderTimer);
    if (worldMode === 0) render(context, contextGround,Oworld)
    else render(context, contextGround,Uworld)
    renderUi(context);//UI
  }
  function logikTimer(){

      let ms = Date.now() - Timer;
      //DebugString[0]=ms;
      let date;let totalDate = Date.now();
      Timer020+=ms;
      Timer100+=ms;
      Timer250+=ms; 
      Timer500+=ms;

     // mapScroal(1);

      date = Date.now();
      while (Timer020>20){
        Timer020-=20;
        mapScroal(1);
      }

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
      while (Timer250>250){
        Timer250-=250;
        setAnimator();
        groundRender = true;
      }
      DebugString[2]=Date.now()-date;

      date = Date.now();
      while (Timer500>500){
        UiButton[0].clicked();
        Timer500-=500;
        if (worldMode === 0)worldMap = buildWorldMap(Oworld);
        if (worldMode === 1)worldMap = buildWorldMap(Uworld);
      }
      DebugString[3]=Date.now()-date;

      DebugString[0]= Date.now() - totalDate;
    Timer = Date.now();
    setTimeout(logikTimer, 10);
  }




//--BuildWorld---------------------------------------------------------------------------------------------------------------------------------------------------

  function buildWorldarray(width,height,typ){

    let size = (width * height);
    let world = 
    {
      typ: new Uint8Array(size),
      version: new Uint8Array(size),
      animation: new Uint8Array(size),
      height: new Uint8Array(size),
      referenceX: new Uint8Array(size),
      referenceY: new Uint8Array(size),
      aktEntity: new Uint8Array(size),
      resEntity: new Uint8Array(size),
      discovered: new Uint8Array(size),
      owner: new Uint8Array(size),
      way: new Uint8Array(size),
      debug: new Uint8Array(size),
      debug2: new Uint8Array(size),
      wayKost: new Uint8Array(size),
      begehbar: new Uint8Array(size),
      view: new Uint8Array(size),
    };

    for (let ii = 0; ii < width; ii++) world.typ[conv2Dto1D(ii,0)] = 0;
    for (let ii = 0; ii < width; ii++) world.typ[conv2Dto1D(ii,height - 1)] = 0;
    for (let ii = 0; ii < height; ii++) world.typ[conv2Dto1D(0,ii)] = 0;
    for (let ii = 0; ii < height; ii++) world.typ[conv2Dto1D(width - 1,ii)] = 0;

    return world;
  }
  function generateTile(world,mit, typ, rnd) {
    let width = worldWidth-2;let height = worldHeight-2;
      for (let ii = 0;ii < mit;ii++) {
        for (let ix = 1; ix <= width; ix++){
          for (let iy = 1; iy <= height; iy++){
            if (world.typ[conv2Dto1D(ix + 1,iy)] === typ || world.typ[conv2Dto1D(ix - 1,iy)] === typ || world.typ[conv2Dto1D(ix,iy + 1)] === typ || world.typ[conv2Dto1D(ix,iy - 1)] === typ) {if(Math.random()<rnd){build(world,ix, iy, typ);}}
          };
        };
        for (let ix = width; ix >= 1; ix--){
          for (let iy = height; iy >= 1; iy--){
            if (world.typ[conv2Dto1D(ix + 1,iy)] === typ || world.typ[conv2Dto1D(ix - 1,iy)] === typ || world.typ[conv2Dto1D(ix,iy + 1)] === typ || world.typ[conv2Dto1D(ix,iy - 1)] === typ) {if(Math.random()<rnd){build(world,ix, iy, typ);}}
          };
        };
      };
  }
  function buildMap(width,height){
    worldWidth = width + 2;
    worldHeight = height + 2;
    set_WorldWidth(worldWidth);
    Oworld = buildWorldarray(worldWidth,worldHeight,1)
    Uworld = buildWorldarray(worldWidth,worldHeight,10)

    for (let ix = 1; ix <= width; ix++){
      for (let iy = 1; iy <= height; iy++){
        build(Oworld,ix, iy, 1);
      }
    }


              //if (mode == 1)
              //{

    

    //Moos
    for (let ix = 1; ix < width; ix++)
    {
      for (let iy = 1; iy < height; iy++)
      {
      if (Math.random() <= 0.02 && Oworld.typ[conv2Dto1D(ix,iy)] === 1) build(Oworld,ix, iy, 4);
      }
    }

    generateTile(Oworld,4, 4, 0.2);

    // //Water---------------------------------

    // for (let ii = 1; ii < worldWidth-1; ii++) Oworld.typ[conv2Dto1D(ii,1)] = 3;
    // for (let ii = 1; ii < worldWidth-1; ii++) Oworld.typ[conv2Dto1D(ii,worldHeight - 2)] = 3;
    // for (let ii = 1; ii < worldHeight-1; ii++) Oworld.typ[conv2Dto1D(1,ii)] = 3;
    // for (let ii = 1; ii < worldHeight-1; ii++) Oworld.typ[conv2Dto1D(worldWidth - 2,ii)] = 3;

    let total = width * height;
    let proC = (total * 0.001)|0;
    for (let ii = 0; ii < proC;){
      let rndX = (width * Math.random())|0 + 1;
      let rndY = (height * Math.random())|0 + 1;
        if (Oworld.typ[conv2Dto1D(rndX,rndY)] !== -1){
      build(Oworld,rndX, rndY, 2);
      ii++;
      }
    }

    generateTile(Oworld,2, 2, 0.5);

    // for (let ix = 1; ix < width; ix++)
    // {
    //   for (let iy = 1; iy < height; iy++)
    //   {
    //   if (Math.random() <= 0.9 && Oworld.typ[conv2Dto1D(ix + 1,iy)] === 2 && Oworld.typ[conv2Dto1D(ix - 1,iy)] === 2 && Oworld.typ[conv2Dto1D(ix,iy + 1)] === 2 && Oworld.typ[conv2Dto1D(ix,iy - 1)] === 2) build(Oworld,ix, iy, 2);
    //   }
    // }

    //Stein
    for (let ix = 1; ix <= width; ix++)
    {
      for (let iy = 1; iy <= height; iy++)
      {
      if (Math.random() <= 0.01 && Oworld.typ[conv2Dto1D(ix,iy)] === 1) build(Oworld,ix, iy, 5);
      }
    }

    //--Grass--
    for (let ix = 1; ix <= width; ix++){
      for (let iy = 1; iy <= height; iy++){
      if (Math.random() <= 0.02 && Oworld.typ[conv2Dto1D(ix,iy)] === 1) build(Oworld,ix, iy, 3);
      }
    }

    generateTile(Oworld,4, 3, 0.2);


    // for (let ix = 1; ix < width; ix++){
    //   for (let iy = 1; iy < height; iy++){
    //   if (Math.random() <= 0.02 && Oworld.typ[conv2Dto1D(ix,iy)] === 1) build(Oworld,ix, iy, 3);
    //   }
    // }

    // //Laus
    // for (let ix = 1; ix < width; ix++){
    //   for (let iy = 1; iy < height; iy++){
    //   if (Math.random() <= 0.01 && Oworld.typ[conv2Dto1D(ix,iy)] === 3) build(Oworld,ix, iy, 6);
    //   }
    // }

    mapPosX = ((worldWidth/2)|0);//(width/64)|0;
    mapPosY = ((worldHeight/2)|0);

    for (let ix = 0; ix <= 2; ix++){
      for (let iy = 0; iy <= 2; iy++){
        build(Oworld,mapPosX-1+ix, mapPosY-1+iy, 1);
      }
    }
    for (let ix = 0; ix <= 10; ix++){
      build(Oworld,mapPosX-5+ix, mapPosY, 1);
    }
    for (let iy = 0; iy <= 10; iy++){
      build(Oworld,mapPosX, mapPosY-5+iy, 1);
    }

    addEntity(Oworld,0,[mapPosX,mapPosY]);

    worldMap = buildWorldMap(Oworld);

    
  }




//--Graphic------------------------------------------------------------------------------------------------------------------------------------------------------

  function buildWorldMap(world) {
    let canvas = document.createElement("canvas");
    let context  = canvas.getContext("2d");
    context.imageSmoothingEnabled = false;//Chrome
    context.mozImageSmoothingEnabled = false;//Firefox
    canvas.width = worldWidth*2;
    canvas.height = worldHeight*2;
    let mod = context.createImageData(canvas.width, canvas.height);
    let imgData = context.getImageData(0, 0, canvas.width, canvas.height);
    let i = 0;
    for (let x = 0; x < worldWidth; x++) {
      for (let y = 0; y < worldHeight; y++) {

        let offset = (imgData.width * (y-x+(canvas.height/2)|0) + (x+y)) * 4;
        mod.data[offset + 3] = 255;//a
        let typ =world.typ[conv2Dto1D(x,y)];
        if (world.discovered[conv2Dto1D(x,y)] === 1 &&typ!==9)
        {
          if(world.owner[i]!==0||world.aktEntity[i]!==0){
            mod.data[offset]     = 0;//r
            mod.data[offset + 1] = 255;//g
            mod.data[offset + 2] = 0;//b
          }else{
            switch (typ){
              case 1:case 2:case 10:
              mod.data[offset]     = 50;//r
              mod.data[offset + 1] = 70;//g
              mod.data[offset + 2] = 140;//b
              break;case 3:
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


      }
      i++;
    }
    let offset = (imgData.width * (2) + worldWidth-2) * 4;
    mod.data[offset]     = 255;//r
    mod.data[offset + 1] = 0;//g
    mod.data[offset + 2] = 0;//b
    mod.data[offset + 3] = 255;//a
    context.putImageData(mod, 0, 0);
    return (canvas);
  };
  function setAnimator() {
    for (let ii = 0; ii < 20; ii++){
    if (animator[ii] < ii) animator[ii]++;
    else animator[ii] = 0;
    }
    alpha += 0.05;
  };
  function findEnvorimentCode(world,posX, posY, envmode) {// envmode (0=keine,1=selbst,2=height,3=Wasser).
    //console.log(envmode,world[posX][posY].typ, world[posX][posY-1].typ,world[posX+1][posY].typ,world[posX][posY+1].typ,world[posX-1][posY].typ);
    let worldPos = conv2Dto1D(posX,posY)
    return wasmFindEnvorimentCode(envmode,world.typ[worldPos], world.typ[worldPos-worldWidth],world.typ[worldPos+1],world.typ[worldPos+worldWidth],world.typ[worldPos-1]);
    // let worldEnvironment = [0,0,0,0];
    // switch (envmode)
    //   {
    //   case 1:
    //   if (world[posX][posY - 1].typ === world[posX][posY].typ) worldEnvironment[0] = 1;
    //   if (world[posX + 1][posY].typ === world[posX][posY].typ) worldEnvironment[1] = 1;
    //   if (world[posX][posY + 1].typ === world[posX][posY].typ) worldEnvironment[2] = 1;
    //   if (world[posX - 1][posY].typ === world[posX][posY].typ) worldEnvironment[3] = 1;
    //   break;
    //   case 2:
    //   let aktHeight = world[posX][posY].height;
    //   if (aktHeight<world[posX - 1][posY].height || aktHeight<world[posX][posY - 1].height || aktHeight<world[posX - 1][posY - 1].height) worldEnvironment[0] = 1; //ol
    //   if (aktHeight<world[posX + 1][posY].height || aktHeight<world[posX][posY - 1].height || aktHeight<world[posX + 1][posY - 1].height) worldEnvironment[1] = 1; //or
    //   if (aktHeight<world[posX + 1][posY].height || aktHeight<world[posX][posY + 1].height || aktHeight<world[posX + 1][posY + 1].height) worldEnvironment[2] = 1; //ur
    //   if (aktHeight<world[posX - 1][posY].height || aktHeight<world[posX][posY + 1].height || aktHeight<world[posX - 1][posY + 1].height) worldEnvironment[3] = 1; //ul
    //   break;
    //   case 3:
    //   if (world[posX][posY - 1].typ === -1 || world[posX][posY - 1].typ === 2) worldEnvironment[0] = 1;
    //   if (world[posX + 1][posY].typ === -1 || world[posX + 1][posY].typ === 2) worldEnvironment[1] = 1;
    //   if (world[posX][posY + 1].typ === -1 || world[posX][posY + 1].typ === 2) worldEnvironment[2] = 1;
    //   if (world[posX - 1][posY].typ === -1 || world[posX - 1][posY].typ === 2) worldEnvironment[3] = 1;
    //   break;
    //   default: return 0;
    //   }
    //   //console.log("X="+posX+"Y="+posY+"\nCode()"+worldEnvironment[0] +";"+ worldEnvironment[1] +";" + worldEnvironment[2] +";"+ worldEnvironment[3] +")")
    // return convertToBin(worldEnvironment[0] * 1000 + worldEnvironment[1] * 100 + worldEnvironment[2] * 10 + worldEnvironment[3] * 1);
  }
  function render(context, contextGround,aktWorld) { 
    if (context === void 0)return;//canvas not ready stop render
    let cscale = Math.round(scale*16)/16;
    let date = Date.now();
    let now = date - last;
    last = date;
    context.clearRect(0, 0, width, height);
    groundRender = true;
    if (groundRender===true)  {contextGround.clearRect(0, 0, width, height);}
    let Indentation = 0;
    let posx = 0;
    let posy = 0;
    let addPosX = (width / 64 + 2)|0 ;
    let addPosY = 1;
    aktWorld.view = new Uint8Array(worldWidth*worldHeight);
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
        if (aktPosX < worldWidth && aktPosX >= 0 && aktPosY < worldHeight && aktPosY >= 0 && aktWorld.typ[conv2Dto1D(aktPosX,aktPosY)] !== -1&& aktWorld.typ[conv2Dto1D(aktPosX,aktPosY)] !== 0){
          let worldPos = conv2Dto1D(aktPosX,aktPosY);
          let drawPosX = 64*ix+32*Indentation;
          let drawPosY = 16*iy;
          let height = (aktWorld.height[worldPos]) * 16;
          let isAktField = (aktPosX >= aktPlayerPosX && aktPosY >= aktPlayerPosY && aktPosX < aktPlayerPosX + StaticEntity[aktGameObject].size && aktPosY < aktPlayerPosY + StaticEntity[aktGameObject].size)
          let aktReferenceX = (aktWorld.referenceX[worldPos]);
          let aktReferenceY = (aktWorld.referenceY[worldPos]);
          let typ = aktWorld.typ[conv2Dto1D(aktPosX - aktReferenceX,aktPosY -aktReferenceY)];
          //let ground = aktWorld[aktPosX][aktPosY].ground;
          let staticEntity = StaticEntity[typ];

          if ((false||aktWorld.discovered[worldPos] === 1) && staticEntity.ready === true){

            let envcode = findEnvorimentCode(aktWorld,aktPosX, aktPosY, staticEntity.envmode);//env code for auto tile (0000 - 1111)
            let version = aktWorld.version[worldPos]; //graphic version
            let overDraw = ((staticEntity.sprite[version][envcode].overDraw));
            let animPhase = staticEntity.sprite[version][envcode].animationPhase;
            let anim = animator[animPhase] + aktWorld.animation[worldPos];
            let imgSrcX = (aktReferenceX*32)+ (aktReferenceY * 32) + (staticEntity.size*64) * anim;
            let imgSrcY = 16 * (staticEntity.size - 1) -(aktReferenceX*16) + (aktReferenceY * 16);

            if (overDraw!==0){
              context.drawImage(
              staticEntity.sprite[version][envcode].texture,
              imgSrcX, imgSrcY,
              64, 32+overDraw|0,
              drawPosX*cscale, ((drawPosY-overDraw))*cscale|0,
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

                  //  context.fillStyle = "rgba(0,0,255,1)";    
                  //  context.fillText(version, drawPosX+16, drawPosY);

            let aktEntity = EntityList[aktWorld.aktEntity[worldPos]];
            if (aktWorld.aktEntity[worldPos] !== 0){
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
                  context.fillRect(EntityDrawPosX+17, EntityDrawPosY-15,aktEntity.hp/MoveableEntity[aktEntity.typ].hp*30, 2);
              }
            }
          }

        }
          //worldPos = aktWorld[aktPosX][aktPosY];??!
          if (isAktField===true){
            if (aktSelectetEntityNumber>0){
              switch (typ)
              {
                case 7: context.drawImage(UiAktField[1].sprite[0][0].texture,0, 0,64, 32,drawPosX*cscale, (drawPosY)*cscale,64*cscale, 32*cscale);break;
                case 8: context.drawImage(UiAktField[2].sprite[0][0].texture,0, 0,64, 32,drawPosX*cscale, (drawPosY)*cscale,64*cscale, 32*cscale);break;
                default:if (aktWorld.begehbar[worldPos]===1)context.drawImage(UiAktField[0].sprite[0][0].texture,0, 0,64, 32,drawPosX*cscale, (drawPosY)*cscale,64*cscale, 32*cscale);break;
              }
            }
          }

          if (aktPosX === aktSelectetStaticposX && aktPosY === aktSelectetStaticposY){
            switch (typ)
            {
              case 13: case 14: case 15: context.drawImage(UiAktField[4].sprite[0][0].texture,0, 0,64, 32,drawPosX*cscale, (drawPosY)*cscale,64*cscale, 32*cscale);break;
            }
          }
        }
      }
    }

    //console.log(mouse.down);
    if (mouse.down === true){
      context.fillStyle = "rgba(0,255,0,0.2)";
      context.fillRect(mouse.dx, mouse.dy,  mouse.x-mouse.dx, mouse.y-mouse.dy);
    }



    context.fillStyle = "rgba(0,0,100,0.5)";
    context.fillRect(0, 0,128, 15*12);

    context.fillStyle = "rgba(0,255,0,1)";
    context.fillText("Version: v0.00", 4, 12.5+15*0);

    context.fillText("Graphics:", 4, 12.5+15*2);
    context.fillText("TotalTime: "+-(date -= Date.now())+"ms", 4, 12.5+15*3);
    context.fillText(`FPS: ${(1000/(now+0.1))|0}`, 4, 12.5+15*4);

    context.fillText("Logic:", 4, 12.5+15*6);
    context.fillText("TotalTime: "+DebugString[0]+"ms", 4, 12.5+15*7);
    context.fillText("Timer100: "+Timer100+"ms", 4, 12.5+15*8);
    context.fillText("Timer250: "+Timer250+"ms", 4, 12.5+15*9);
    context.fillText("Timer500: "+Timer500+"ms", 4, 12.5+15*10);

    context.fillText("LastWay: "+DebugString[4]+"ms", 4, 12.5+15*11);

    groundRender = false;
  } 
  function renderUi(context) {
      context.fillStyle = "rgba(0,0,0,1)";
      context.textAlign = "right";
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
        0, height-(192/1.5)|0,
        192+64, (192/1.5)|0
      
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
    for (let i = 0;i<UiButton.length;i++){UiButton[i].render();}

      //console.log("renderUi() -> "+-(date -= Date.now())+"ms");
    context.textAlign = "left";
  }

//--Game---------------------------------------------------------------------------------------------------------------------------------------------------------

  function build(world,posX, posY, newTyp){
    if (posX < worldWidth && posX >= 0 && posY < worldHeight && posY >= 0)
    {
      for (let ix = 0; ix < StaticEntity[newTyp].size; ix++)
      {
        for (let iy = 0; iy < StaticEntity[newTyp].size; iy++)
        {
          let worldPos = conv2Dto1D(posX + ix,posY + iy);
          world.begehbar[worldPos] = StaticEntity[newTyp].begehbar
          world.typ[worldPos] = 0;
          world.version[worldPos] = 0;
          world.referenceX[worldPos] = ix;
          world.referenceY[worldPos] = iy;
        }
      }
      let worldPos = conv2Dto1D(posX,posY);
      world.version[worldPos] = (StaticEntity[newTyp].version * Math.random())|0;
      //if (StaticEntity[newTyp].envcode===0) 
      //world[posX][posY].animation = (StaticEntity[newTyp].sprite[world[posX][posY].version][0].animationPhase * Math.random())|0;
      //else 
      world.animation[worldPos] =0;        
      world.typ[worldPos] = newTyp;
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
            world.discovered[conv2Dto1D(ix,iy)] = 1;
        }
    }
  }
  function inGameBuild(posX,posY,typ){
    switch (typ)
    {
      case 0:return//Destroy
      case 100: //Base
        build(Oworld,posX, posY, 7);
        build(Uworld,posX, posY, 8);
        return
      case 2: //Strasse
        if (ressourcen[2]>0){
          build(Oworld,posX, posY, 11);
          worldDiscovered(Oworld,posX, posY, 3);
          ressourcen[2]--;
        }
        return
    }

  }
  function addEntity(world,typ,worldPos){
    let loop = true
        let ii = 1;
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
          hp: MoveableEntity[typ].hp,
          commandGroup: -1
        }

        world.aktEntity[conv2Dto1D(worldPos[0],worldPos[1])] = ii;
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
        EntityList[entity].aktWorld.aktEntity[conv2Dto1D(EntityList[entity].worldPos[0],EntityList[entity].worldPos[1])] = 0;
        EntityList[entity].aktWorld.resEntity[conv2Dto1D(EntityList[entity].goalX,EntityList[entity].goalY)] = 0;

        EntityList[entity].live = false;
        EntityList[entity].selection = false;
      }
    //console.log(EntityList);
  }
  function coliMap(coliEntity){
        if (coliEntity===true){
        for (let ii = 0; ii < worldWidth*worldHeight; ii++){
            if (Oworld.begehbar[ii]===1&&Oworld.aktEntity[ii]===0)Oworld.way[ii] = 0;
            else Oworld.way[ii] = -1;
        }
      }else{
        for (let ii = 0; ii < worldWidth*worldHeight; ii++){
            if (Oworld.begehbar[ii]===1)Oworld.way[ii] = 0;
            else Oworld.way[ii] = -1;
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
    let worldPos = conv2Dto1D(goalX,goalY);
    if (world.begehbar[worldPos]===1||world.typ[worldPos]===7||world.typ[worldPos]===8){

      coliMap(coliEntity)

      world.way[conv2Dto1D(startX,startY)] = 1;
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
              worldPos = conv2Dto1D(ix,iy)
              if (world.way[worldPos] === i-1 ){

                let kosten = i;
                let ww = worldWidth,wh=worldHeight;
                if (world.way[worldPos+1] === 0){world.way[worldPos+1] = kosten;loop = true;}
                if (world.way[worldPos+ww] === 0){world.way[worldPos+ww] = kosten;loop = true;}
                if (world.way[worldPos-1] === 0){world.way[worldPos-1] = kosten;loop = true;}
                if (world.way[worldPos-ww] === 0){world.way[worldPos-ww] = kosten;loop = true;}

                if (world.way[worldPos+1+ww] === 0 && (world.begehbar[worldPos+1]===1 && world.begehbar[worldPos+ww]===1)){world.way[worldPos+1+ww] = kosten;loop = true;}
                if (world.way[worldPos+1-ww] === 0 && (world.begehbar[worldPos+1]===1 && world.begehbar[worldPos-ww]===1)){world.way[worldPos+1-ww] = kosten;loop = true;}
                if (world.way[worldPos-1+ww] === 0 && (world.begehbar[worldPos-1]===1 && world.begehbar[worldPos+ww]===1)){world.way[worldPos-1+ww] = kosten;loop = true;}
                if (world.way[worldPos-1-ww] === 0 && (world.begehbar[worldPos-1]===1 && world.begehbar[worldPos-ww]===1)){world.way[worldPos-1-ww] = kosten;loop = true;}
                //(ix+2 > goalX && ix-2 < goalX && iy+2 > goalY && iy-2 < goalY)
                if (ix+2 > goalX && ix-2 < goalX && iy+2 > goalY && iy-2 < goalY){
                    
                  let aktPosX = goalX, aktPosY=goalY;
                  way[i] = -1;
                  for (let iw = i-1;iw>=1;iw--){
                    worldPos = conv2Dto1D(aktPosX,aktPosY)
                    if (world.way[worldPos+1] === iw){way[iw] = [-1,0];aktPosX++;continue;}
                    if (world.way[worldPos+ww] === iw){way[iw] = [0,-1];aktPosY++;continue;}
                    if (world.way[worldPos-1] === iw){way[iw] = [+1,0];aktPosX--;continue;}
                    if (world.way[worldPos-ww] === iw){way[iw] = [0,+1];aktPosY--;continue;}

                    if (world.way[worldPos+1+ww] === iw){way[iw] = [-1,-1];aktPosX++;aktPosY++;continue;}
                    if (world.way[worldPos+1-ww] === iw){way[iw] = [-1,+1];aktPosX++;aktPosY--;continue;}
                    if (world.way[worldPos-1+ww] === iw){way[iw] = [+1,-1];aktPosX--;aktPosY++;continue;}
                    if (world.way[worldPos-1-ww] === iw){way[iw] = [+1,+1];aktPosX--;aktPosY--;continue;}

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
          let worldPos = conv2Dto1D(aktEntity.worldPos[0]+ix,aktEntity.worldPos[1]+iy)
          if (world.begehbar[worldPos]===1 && world.aktEntity[worldPos]===0){
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
      let worldPos = conv2Dto1D(aktEntity.worldPos[0],aktEntity.worldPos[1])
          //gotoNext(Entity);
      if(aktEntity.hp>0||world.aktEntity[worldPos]===Entity){//Entety lebt?
      if ((aktEntity.worldPos[0]!==aktEntity.TotalGoalX || aktEntity.worldPos[1]!==aktEntity.TotalGoalY)||aktEntity.Progress!==0){
          worldPos = conv2Dto1D(aktEntity.goalX,aktEntity.goalY)
          if (world.aktEntity[worldPos]===0&&world.begehbar[worldPos]===1){

            aktEntity.Progress -= MoveableEntity[aktEntity.typ].speed;

            if(aktEntity.Progress<=0){
              aktEntity.Progress+=100;

              if (aktEntity.worldPos[0]>aktEntity.goalX) move[0] = -1;
              if (aktEntity.worldPos[0]<aktEntity.goalX) move[0] = +1;
              if (aktEntity.worldPos[1]>aktEntity.goalY) move[1] = -1;
              if (aktEntity.worldPos[1]<aktEntity.goalY) move[1] = +1;
              aktEntity.direction[0] = move[0]+1;
              aktEntity.direction[1] = move[1]+1;

              world.aktEntity[conv2Dto1D(aktEntity.worldPos[0],aktEntity.worldPos[1])] = 0;

              aktEntity.aktWayPos++;
              if (aktEntity.way[aktEntity.aktWayPos]!==-1){     
                try{
                aktEntity.goalX+=aktEntity.way[aktEntity.aktWayPos][0];
                aktEntity.goalY+=aktEntity.way[aktEntity.aktWayPos][1];
                }catch(e){}
              }

              aktEntity.worldPos[0]+=move[0];
              aktEntity.worldPos[1]+=move[1];
              world.aktEntity[conv2Dto1D(aktEntity.worldPos[0],aktEntity.worldPos[1])] = Entity;
              worldDiscovered(world,aktEntity.worldPos[0],aktEntity.worldPos[1],MoveableEntity[aktEntity.typ].view)
            }
            aktEntity.wait=0;
            aktEntity.waitTry=1;
          }
          else{
            worldPos = conv2Dto1D(aktEntity.goalX,aktEntity.goalY)
            if (world.aktEntity[worldPos]!==0&&world.typ[worldPos]!==7&&world.typ[worldPos]!==8)gotoNext(world.aktEntity[worldPos]);
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
          worldPos = conv2Dto1D(aktEntity.worldPos[0],aktEntity.worldPos[1])
          switch(world.typ[worldPos])
          {
            case 7:
            if(Uworld.aktEntity[worldPos]===0){
            aktEntity.aktWorld = Uworld; 
            Oworld.aktEntity[worldPos] = 0;
            Uworld.aktEntity[worldPos] = Entity;
            gotoNext(Entity);
            }
            break;
            case 8:
            if(Oworld.aktEntity[worldPos]===0){
            aktEntity.aktWorld = Oworld; 
            Uworld.aktEntity[worldPos] = 0;
            Oworld.aktEntity[worldPos] = Entity;
            gotoNext(Entity);
            }
            break;
          }
        }
      }
      else{killEntity(Entity)}
  }




//--Effents------------------------------------------------------------------------------------------------------------------------------------------------------
  //addEvents() //350
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

    if ("which" in e) isRightMB = e.which === 3; // Gecko (Firefox), WebKit (Safari/Chrome) & Opera
    else if ("button" in e) isRightMB = e.button === 2; // IE, Opera 
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

  function dbClickOnMapSelect(aktWorld){

    let worldPos = conv2Dto1D(aktPlayerPosX,aktPlayerPosY);
    aktSelectetStaticTyp = aktWorld.typ[worldPos];
    aktSelectetStaticposX = aktPlayerPosX;
    aktSelectetStaticposY = aktPlayerPosY;

    for (let ii = 0;ii<worldWidth*worldHeight;ii++){
      if ((EntityList[aktWorld.aktEntity[worldPos]].typ === EntityList[aktWorld.aktEntity[ii]].typ || aktWorld.view[ii] === true) === true){
        EntityList[aktWorld.aktEntity[ii]].selection = true;
      }
    }

  }

  function clickOnMapSelect(aktWorld){

    let worldPos = conv2Dto1D(aktPlayerPosX,aktPlayerPosY);
    aktSelectetStaticTyp = aktWorld.typ[worldPos];
    aktSelectetStaticposX = aktPlayerPosX;
    aktSelectetStaticposY = aktPlayerPosY;
    switch (keyCode)
    {
      case 16: //Shift
        if (aktWorld.aktEntity[worldPos]!==-1){
          EntityList[aktWorld.aktEntity[worldPos]].selection = !EntityList[aktWorld.aktEntity[worldPos]].selection;
          aktSelectetEntityTyp=-1;}
        else if (aktWorld.resEntity[worldPos]!==-1){
          EntityList[aktWorld.resEntity[worldPos]].selection = !EntityList[aktWorld.resEntity[worldPos]].selection;
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
        if (aktWorld.aktEntity[worldPos]!==-1) {
          EntityList[aktWorld.aktEntity[worldPos]].selection = true;
          aktSelectetEntityTyp=EntityList[aktWorld.aktEntity[worldPos]].typ;
          aktSelectetEntityNumber=1;}
        else if (aktWorld.resEntity[worldPos]!==-1) {
          EntityList[aktWorld.resEntity[worldPos]].selection = true;
          aktSelectetEntityTyp=EntityList[aktWorld.resEntity[worldPos]].typ;
          aktSelectetEntityNumber=1;}
      break;
    }

  }

  function clickOnMapComand(aktWorld){
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

  function clickOnButton(){
    if (UiButton[0].clicked() === true||UiButton[0].clicked() === true){
      for (let ii = 0;ii<=MaxEntity;ii++){
        if (EntityList[ii] !== void 0 && EntityList[ii].live===true && EntityList[ii].selection===true){
          switch (EntityList[ii].typ)
          {
            case 0:
            case 2:
            killEntity(ii);
            inGameBuild(EntityList[ii].worldPos[0],EntityList[ii].worldPos[1],100)

            addEntity(Uworld,1,EntityList[ii].worldPos)

            addEntity(Oworld,2,[EntityList[ii].worldPos[0],EntityList[ii].worldPos[1]+1])
            addEntity(Oworld,2,[EntityList[ii].worldPos[0],EntityList[ii].worldPos[1]-1])
            addEntity(Oworld,2,[EntityList[ii].worldPos[0]+1,EntityList[ii].worldPos[1]])
            addEntity(Oworld,2,[EntityList[ii].worldPos[0]-1,EntityList[ii].worldPos[1]])
            break;
          }
        }
      }
      return true
    }
    else if (UiButton[1].clicked() === true){
      for (let ii = 0;ii<=MaxEntity;ii++){
        if (EntityList[ii] !== void 0 && EntityList[ii].live===true && EntityList[ii].selection===true){
          switch (EntityList[ii].typ)
          {
            case 2:
            inGameBuild(EntityList[ii].worldPos[0],EntityList[ii].worldPos[1],2)
          }
        }
      }
      return true
    }
    else if (UiButton[7].clicked() === true){
      addEntity(Uworld,2,[aktSelectetStaticposX,aktSelectetStaticposY])
      gotoNext(world.aktEntity[conv2Dto1D(aktSelectetStaticposX,aktSelectetStaticposY)]);
      return true
    }
    return false
  }

  let resize = () => {
    width = window.innerWidth;
    height = window.innerHeight;

    canvas.width = width;
    canvas.height = height;
    canvasGround.width = width;
    canvasGround.height = height;
    context.imageSmoothingEnabled = contextGround.imageSmoothingEnabled = false;//Chrome
    context.mozImageSmoothingEnabled = contextGround.mozImageSmoothingEnabled = false;//Firefox
    context.font = "12px Arial";
    context.fillStyle = "#000";
    groundRender = true;
    render();
  };



