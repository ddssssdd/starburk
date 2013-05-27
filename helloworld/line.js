goog.provide('sb.Line');
goog.require('lime.Polygon');

sb.Line=function(x1,y1,x2,y2,w,r,g,b){
	goog.base(this);
	if (!w)
		w=1;
	if (!r)
		r=0;
	if (!g)
		g=0;
	if (!b)
		b=0;
	this.addPoints(x1,y1,x2,y2,x2+w,y2-w,x1+w,y1-w);
	//this.setPosition(x1,y1);
	this.setFill(r,g,b);
	this.start_x = x1;
	this.start_y = y1;
	this.w = w;
}
goog.inherits(sb.Line,lime.Polygon);

sb.Line.prototype.setLines=function(x1,y1,x2,y2){
	var w = this.w;
	this.setPoints(x1,y1,x2,y2,x2+w,y2-w,x1+w,y1-w);
	
}
sb.Line.prototype.toPoint=function(x2,y2){
	var x1= this.start_x;
	var y1= this.start_y;
	var w =this.w;
	this.setPoints(x1,y1,x2,y2,x2+w,y2-w,x1+w,y1-w);
	this.setDirty(true);
}