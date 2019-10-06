function loadJSON(path) {
  let request = new XMLHttpRequest();
  request.open("GET", path, false);
  request.send(null)
  return JSON.parse(request.responseText);
}

function select(arg0, arg1) {
  return (arg0 === void 0) ? arg1 : arg0;
}

export function loadGameData() {
  let json = {
    ground: loadJSON("./data/groundTexture.json"),
    staticObject: loadJSON("./data/staticObjects.json"),
    movableObject: loadJSON("./data/movableObjects.json"),
    icons: loadJSON("./data/icons.json"),
  };

  groundTextures = gl2D.textureFromFile("./data/png/ground/surface.png");
  underGroundTextures = gl2D.textureFromFile("./data/png/ground/subsoil.png");
  underGroundWallTextures = gl2D.textureFromFile("./data/png/ground/subsoil-wall.png");

  for (let i = 0; i < json.icons.length; i++) {
    iconGraphic[i] = gl2D.textureFromFile(json.icons[i] + ".png");
  }

  for (let i = 0; i < json.ground.length; i++) {
    groundObject[i] = {
      name: select(json.ground[i].name, "empty"),
      passable: select(json.ground[i].passable, true),
      offsetX: select(json.ground[i].offsetX, 0) * 64,
      offsetY: select(json.ground[i].offsetY, 0) * 64,
    };
  }

  for (let i = 0; i < json.staticObject.length; i++) {
    staticObject[i] = {
      name: select(json.staticObject[i].name, "empty"),
      path: select(json.staticObject[i].path, "./data/png/static/empty"),
      passable: select(json.staticObject[i].passable, false),
      size: select(json.staticObject[i].size, 1),
      versions: select(json.staticObject[i].versions, 1),
      addGraphicWidth: select(json.staticObject[i].addGraphicWidth, 0),
      texture: [],
      overDraw: [],
      animationPhases: [],
    };
    for (let iv = 0; iv < staticObject[i].versions; iv++) {
      let path = staticObject[i].path + "_" + iv + ".png";
      let texture = gl2D.textureFromFile(path);
      texture.onload = () => {
        staticObject[i].texture[iv] = texture;
        staticObject[i].overDraw[iv] = texture.height - 32 * staticObject[i].size;
        staticObject[i].animationPhases[iv] = texture.width / (staticObject[i].addGraphicWidth * 2 + (64 * staticObject[i].size));
      }
    }
  }

  for (let i = 0; i < json.movableObject.length; i++) {
    movableObject[i] = {
      name: select(json.movableObject[i].name, "empty"),
      path: select(json.movableObject[i].path, "./data/png/movable/empty"),
      hitPoints: select(json.movableObject[i].hitPoints, 1),
      speed: select(json.movableObject[i].speed, 0.1),
      viewRange: select(json.movableObject[i].viewRange, 2),
      versions: select(json.movableObject[i].versions, 1),
      texture: [],
      animationPhases: [],
    };
    for (let iv = 0; iv < movableObject[i].versions; iv++) {
      let path = movableObject[i].path + "_" + iv + ".png";
      let texture = gl2D.textureFromFile(path);
      texture.onload = () => {
        movableObject[i].texture[iv] = texture;
        movableObject[i].animationPhases[iv] = 0;//image.width / (64*movableObject[i+1].size)-1
        movableObject[i].graphicSize = texture.height / 3;
      }
    }
  }

  nullTexture = gl2D.textureFromPixelArray(new Uint8Array([255, 255, 255]), 1, 1);
  guiTexture[0] = gl2D.textureFromFile("./data/png/gui/selectField.png");
  effects[0] = gl2D.textureFromFile("./data/png/effects/fog.png");
}
