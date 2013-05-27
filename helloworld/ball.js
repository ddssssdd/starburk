goog.provide('sb.Ball');
goog.require('lime.Sprite');


sb.Ball=function(index,row,col){	
	goog.base(this);
	sb.Ball.ball_type =0;
	sb.Ball.Row = 0;
	sb.Ball.Col = 0;
	if (index){
		sb.Ball.ball_type = index
	}
	this.ball_type =sb.Ball.ball_type; 
	if (row)
		sb.Ball.Row = row;
	if (col)
		sb.Ball.Col = col;
	sb.Ball.init(this);
}
goog.inherits(sb.Ball,lime.Sprite);
sb.Ball.init=function(ball){
	var pictureUrl = "assets/ball_"+sb.Ball.ball_type+".png"
	ball.setFill(pictureUrl);
	var width = ball.getSize().width;
	var height = Math.sqrt(3)*width/2;
	var offset = (sb.Ball.Row %2)?width/2:width;
	ball.setPosition(sb.Ball.Col*61+offset,sb.Ball.Row*height+height/2);
}

sb.Ball.prototype.setTop=function(top){
	var y = this.getPosition().y;
	y = top - Math.sqrt(3)*this.getSize().width/2;
	return this.setPosition(this.getPosition().x,y);
}
sb.Ball.prototype.includePos=function(x,y){
	var pos = new goog.math.Coordinate(x,y);
	var dis = goog.math.Coordinate.distance(this.getPosition(),pos);
	return dis<this.getSize().width/2;
}
sb.Ball.prototype.collide=function(ball){
	
	var dis = goog.math.Coordinate.distance(this.getPosition(),ball.getPosition());
	return dis<this.getSize().width;
}
sb.Ball.prototype.neighbors=function(nlist){
	var list =this.nearByList();
	var targetList = [];
	goog.array.forEach(nlist,function(item){
		for(var i=0;i<list.length;i++){
			if (item.includePos(list[i].x,list[i].y)){
				if (targetList.indexOf(item)<0)
					targetList.push(item);
				break;
			}
		}
		
	});
	return targetList;
}
sb.Ball.prototype.nearByList=function(){
	var pos = this.getPosition();
	var width = this.getSize().width;
	var h = Math.sqrt(3)*width/2;
	var list  = [];
	list.push(new goog.math.Coordinate(pos.x+width,pos.y));
	list.push(new goog.math.Coordinate(pos.x-width,pos.y));
	list.push(new goog.math.Coordinate(pos.x+width/2,pos.y-h));
	list.push(new goog.math.Coordinate(pos.x+width/2,pos.y+h));	
	list.push(new goog.math.Coordinate(pos.x-width/2,pos.y-h));
	list.push(new goog.math.Coordinate(pos.x-width/2,pos.y+h));
	return list;
}
sb.Ball.prototype.attchBall=function(ball){
	
	
	var list  = this.nearByList();
	
	goog.array.forEach(list,function(item){
		item.distance = goog.math.Coordinate.distance(ball.getPosition(),item);
	});
	
	goog.array.stableSort(list,function(a,b){
		return goog.math.Coordinate.distance(ball.getPosition(),a)-goog.math.Coordinate.distance(ball.getPosition(),b);
		
	});
	var targetPos = list[0];
	ball.setPosition(targetPos);
	
	
	
}
