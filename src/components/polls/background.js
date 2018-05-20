// shim layer with setTimeout fallback
import React from 'react';

window.requestAnimFrame = (function(){
  return  window.requestAnimationFrame       ||
          window.webkitRequestAnimationFrame ||
          window.mozRequestAnimationFrame    ||
          function( callback ){
            window.setTimeout(callback, 1000 / 23);
          };
})();


const Point = function(width, height) {
  this._size = 0.5;
  this._x = 0;
  this._y = 0;
  this._direction = 0;
  this._velocity = 0;
  this._distances = [];
  this._neighboors = [];
  this._randomization = 0;

  this.__collection = null;
  
  
  this._step = function(aCollection) {

    const modifiedVelocity = this._velocity*1 * ((Math.random() * this._randomization+1)/10);
    const direction = (Math.random()*2%2 >1)?-1:1;

    this._direction =  this._direction*1 + ((Math.random() * this._randomization) * direction);
    const radianAngle = this._direction * Math.PI / 180;

    
    this._x = (this._x * 1) + (modifiedVelocity * Math.cos(radianAngle) * 1);
    this._y = (this._y * 1) + (modifiedVelocity * Math.sin(radianAngle) * 1);

    if(this._x > width) this._x = 0;
    if(this._x < 0) this._x = width;
    if(this._y > height) this._y = 0;
    if(this._y < 0) this._y = height;
 
    this.__collection = aCollection;
    

  }
  
  this._computeNeighboors = function() {
    if (this.__collection === null) { return; }

    let aCollection = this.__collection;
    //compute the closest neighboor
    this._distances = [];
    for(let i=0; i < aCollection.length; i++){
      
      if(aCollection[i]._x !== this._x &&
         aCollection[i]._y !== this._y) {

        this._distances.push({
          pointIndex: i,
          pointObj: aCollection[i],
          distance: Math.sqrt( 
            Math.pow((this._x - aCollection[i]._x), 2) + 
            Math.pow((this._y - aCollection[i]._y), 2)
          )
        });
      }
    }
    this._distances.sort ((a,b) => { 
      let defaultReturn = 0;
      if(a.distance < b.distance) defaultReturn = -1;
      if(a.distance > b.distance) defaultReturn = 1;
      return defaultReturn
    });
    
    this._neighboors = this._distances.slice(0,3);
  }

  
  this.draw = function(context) {
    this._computeNeighboors();
    
    //draw connection lines
    
    context.lineWidth = 0.5;
    context.strokeStyle = '#eee';
    
    context.beginPath();    
    for ( let i=0; i<this._neighboors.length; i++) {

        context.moveTo(this._x, this._y);
        context.lineTo(this._neighboors[i].pointObj._x,   this._neighboors[i].pointObj._y);
      
        context.lineWidth = 0.10 + 5 / this._neighboors[i].distance;
    }
    context.closePath();

    context.stroke();
    
    context.beginPath();
    context.arc(this._x, this._y, this._size*this._velocity, 0, 2 * Math.PI, false);
    context.fillStyle = '#fff';
    context.strokeStyle = '#eee';
    context.lineWidth = 1;
    context.fill();
    context.stroke();
    
    context.beginPath();
    context.arc(this._x, this._y, this._size, 0, 2 * Math.PI, false);
    context.fillStyle = '#eee';
    context.fill();
    
  }
}


const numPoints = 50;

export default class CanvasElement extends React.Component {
  
  constructor() {
    super();
    this.state = { stop_anim: false, aPoints: [] }

    this.init = this.init.bind(this);
    this.animate = this.animate.bind(this);
    this.draw = this.draw.bind(this);

  }
  
  
  init () {
    const can = this.refs.canvas;
    this.ctx = can.getContext("2d");
  
    const can_to_use = can.getBoundingClientRect();
    this.width = can_to_use.width;
    this.height = can_to_use.height;
    
    let aPoints = this.state.aPoints.slice();
    for( let x = 0; x < numPoints; x++ ) {
      let newPoint = new Point(this.width, this.height); 
      newPoint._size = (Math.random() * (3 - 0.5) + 0.5).toFixed(2);
      newPoint._x = (Math.random() * this.width).toFixed(0);
      newPoint._y = (Math.random() * this.height).toFixed(0);
      newPoint._direction = (Math.random() * 360).toFixed(2);
      newPoint._velocity = (Math.random() * (1 - 0.1) + 0.2).toFixed(2);
      newPoint._randomization = (Math.random() * (10 - 0) + 0).toFixed(2);
      aPoints.push(newPoint);
    }
    this.setState({ aPoints }, this.animate);
  }

  componentDidMount () {
    this.setState({ stop_anim : false },()=>this.init());
  }
  
  shouldComponentUpdate(){
    return false;
  }
  
  componentWillUnmount() {
    console.log('componentWillUnmount');
    this.setState({ stop_anim : true, aPoints : [] },()=>{this.ctx = null});
  }
  
  animate() { 
    console.log('animate')
    if (!this.state.stop_anim) { 
      for( let x = 0; x < numPoints; x++ ) {
        this.state.aPoints[x]._step(this.state.aPoints);
      }
      window.requestAnimFrame (this.animate);
      this.draw();
    }
  }
  
  draw () {
      const {width, height} = this;
      this.ctx.save();
      this.ctx.clearRect(0,0,width,height);
      this.ctx.fillStyle ='rgba(210,190,170,.7)';
      this.ctx.fillRect(0,0,width,height);
      
      for (let x=0; x<numPoints; x++) {
        this.state.aPoints[x].draw(this.ctx);
      }
      
      this.ctx.restore();
  }
  
  render(){
    const canvas = {
                width:'100%',
                height:'100%',
                position:'absolute',
                top:'0',
                left:'0',

    };
    return  <canvas width = {window.innerWidth} height = {window.innerHeight} ref='canvas' style = {canvas} ></canvas>
  }
}

