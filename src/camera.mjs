export default class Camera {
  constructor(canvas) {
    this.canvas = canvas;
    this.posX = 0;
    this.posY = 0;
    this.scale = 1;
  }
}

Camera.prototype.goTo = function(x,y){
  this.posX = x;
  this.posY = y;
  this.move((-(this.canvas.width/64)/2)|0,(-(this.canvas.height/32)/2)|0)
}
Camera.prototype.move = function(x,y){
  this.posX += (+ x);
  this.posY += (+ x);
  this.posX += (- y);
  this.posY -= (- y);
}