goog.provide('sb.PlayScene');
goog.require('lime.Scene');
goog.require('lime.Polygon');
goog.require('sb.Ball');
goog.require('sb.Line');

sb.PlayScene = function(){
	goog.base(this);
	this.row_index =-1;
	this.rows =0;
	this.cols =0;
	this.balls = [];
	this.removes = [];
	// const settings;
	sb.BallWidth = 61;
	sb.BallTypeMax = 5;
}
goog.inherits(sb.PlayScene,lime.Scene);

sb.PlayScene.prototype.init = function(rowCount,colCount){
	this.row_index =-1;
	this.balls = [];
	this.removes = [];
	
	this.rows = rowCount;
	this.cols = colCount;
	this.step =0;
	for(var row=0;row<rowCount;row++){
		
		for(var col=0;col<colCount;col++){
			var ball_type = goog.math.randomInt(sb.BallTypeMax);
			var ball = new sb.Ball(ball_type,row,col);		
			this.appendChild(ball);
			this.balls.push(ball);
		}
		
	}
	this.row_index = rowCount ;
	lime.scheduleManager.scheduleWithDelay(this.goDown,this,100);
	//lime.scheduleManager.callAfter(this.addNewRow,this,6000);
	this.add_fire_ball();
	this.info = new lime.Label().setPosition(100,700).setSize(600,60).setText("x=0,y=0");
	this.appendChild(this.info);
}


sb.PlayScene.prototype.getTopY=function(l){
	var minHeight = 2000;
	if (!l){
		l = this.balls;
	}
	goog.array.forEach(l,function(b){
		if (b.getPosition().y<minHeight){
			minHeight = b.getPosition().y;
		}
	},this);
	this.log("minHeight is "+minHeight);
	if (minHeight==2000){
		minHeight = sb.BallWidth;
	}
	return minHeight;
}
sb.PlayScene.prototype.addNewRow=function(){
	var minHeight = this.getTopY();
	this.row_index++;
	for(var i=0;i<this.cols;i++){
		var ball_type = goog.math.randomInt(5);
		var ball = new sb.Ball(ball_type,this.row_index,i);		
		this.appendChild(ball);
		ball.setTop(minHeight);
		this.balls.push(ball);
	}
	/*
	lime.scheduleManager.callAfter(function(){
		this.addNewRow();
	},this,6000);
	*/
}


sb.PlayScene.prototype.log = function(s){
	this.info.setText(s);
}

sb.PlayScene.prototype.add_fire_ball=function(){
	if (this.leftLine){
		this.removeChild(this.leftLine);
		this.leftLine =null;
	}
	if (this.rightLine){
		this.removeChild(this.rightLine);
		this.rightLine = null;
	}
	var index = goog.math.randomInt(sb.BallTypeMax);
	this.ball = new sb.Ball(index,0,0);
	this.ball.setPosition(350,600);
	this.appendChild(this.ball);
	var target = this.ball;
	

	goog.events.listen(target,['mousedown','touchstart'],function(e){
		e.startDrag();
		
		e.swallow(['mousemove','touchmove'],function(e){			
			this.getParent().update_fire();
			
		});
		e.swallow(['mouseup','touchend'],function(e){
			this.getParent().fire_ball();
		});
		
		
	});
	
	this.leftLine = new sb.Line(0,600,350,600,1);
	this.appendChild(this.leftLine);
	this.rightLine = new sb.Line(700,600,350,600,1);
	this.appendChild(this.rightLine);
}
sb.PlayScene.prototype.update_fire=function(){
	this.leftLine.toPoint(this.ball.getPosition().x,this.ball.getPosition().y);
	this.rightLine.toPoint(this.ball.getPosition().x,this.ball.getPosition().y);
}
sb.PlayScene.prototype.fire_ball=function(){
	var ballPosition = this.ball.getPosition();
	
	var x=0;
	var y=0;
	var tagA = 0;
	var dir = 0;
	if (ballPosition.x==350){
		x=350,y=0;
		dir =0;
	}else{
		tagA = (ballPosition.y-600) /(ballPosition.x-350);
		if (ballPosition.x<350){
			x = 700;
			y = ballPosition.y-Math.abs(tagA*(700-ballPosition.x));
			dir = -1;
		}else{
			x=0;
			y=ballPosition.y-Math.abs(tagA*ballPosition.x);
			dir = 1;
		}
	}
	this.ball.isFired= true;
	this.ball.fire_angel = tagA;
	this.ball.direction = dir;
	
	this.log("fire a ball!");
}

sb.PlayScene.prototype.destroyBall=function(balls_list){
	function get_all_neighbors(ball,slist,clist){
		if (clist.length==0){
			return;
		}
		var nlist = ball.neighbors(clist);
		if (nlist.length==0){
			return;
		}
		goog.array.forEach(nlist,function(item){
			goog.array.remove(clist,item);
			if (slist.indexOf(item)<0){
				slist.push(item);
			}
			
		});
		goog.array.forEach(nlist,function(item){
			get_all_neighbors(item,slist,clist);
		});
	}
	this.log("Destroy "+balls_list.length+" balls.");
	//explore all same balls
	var list = this.balls;
	var scene = this;
	
	goog.array.forEach(balls_list,function(item){
		goog.array.remove(list,item);
		scene.explode_ball(item);
		
	});
	var cloneList = goog.array.clone(list);
	var alllist = [];
	var scene = this;
	var minHeight = this.getTopY();
	goog.array.forEach(balls_list,function(item){
		var slist = [];
		get_all_neighbors(item,slist,cloneList);
		if (slist.length>0){
			var tempHeight = scene.getTopY(slist);
			if (tempHeight>minHeight){
				//alert("need get off these "+slist.length);
				goog.array.forEach(slist,function(r){
					alllist.push(r);
				})
			}
		}
		
	});
	list = this.balls;
	
	if (alllist.length>0){
		//no conections ball processing.
		goog.array.forEach(alllist,function(item){
			goog.array.remove(list,item);
			scene.explode_ball(item);
			
		});
	}
	
	
}
sb.PlayScene.prototype.findSame=function(ball){
	
	
	function getSameNeighbor(b,slist,clist){
		if (clist.length==0)
			return;
		var nlist = b.neighbors(clist);
		goog.array.forEach(nlist,function(item){
			goog.array.remove(clist,item);
		});
		
		var sameList = goog.array.filter(nlist,function(item){
			if (item.ball_type==b.ball_type){
				return true;
			}
		});
		goog.array.forEach(sameList,function(item){
			slist.push(item);
			getSameNeighbor(item,slist,clist);
		});
	
	}
	
	var samelist = [];
	var cloneList = goog.array.clone(this.balls);
	
	getSameNeighbor(ball,samelist,cloneList);
	//alert(samelist.length);
	this.log("Found "+(samelist.length+1)+" balls match.");
	if (samelist.length>=2){
		samelist.push(ball);
		this.destroyBall(samelist);
	}else{
		//no 3 same balls,continue
		this.balls.push(ball);
	}
	
	
}
sb.PlayScene.prototype.explode_ball = function(ball){
	var action = new lime.animation.FadeTo(0);
	ball.runAction(action);
	
	goog.events.listen(action,lime.animation.Event.STOP,function(e){
		this.removeChild(ball);
	},false,this);
}
sb.PlayScene.prototype.fire_end=function(ball,isTop){
	ball.isFired = false;
	if (isTop){
		this.explode_ball(ball);
	}else{
		this.findSame(ball);
	}
		
	this.add_fire_ball();
}
sb.PlayScene.prototype.goDown = function(){
	//ball firing
	if (this.ball && this.ball.isFired){
		var minHeight = this.getTopY();
		for(var j=0;j<10;j++){
			var distance = 2;
			var pos = this.ball.getPosition();
			var x=0;
			var y=distance;
			if (this.ball.direction!=0){
				
				if (pos.x<this.ball.getSize().width/2 || pos.x+this.ball.getSize().width/2>700){
					this.ball.direction = -1* this.ball.direction;
				}
				
				var x = this.ball.direction*distance;
				var y = Math.abs(this.ball.fire_angel*distance)
				if (y>=distance*10){
					y = distance*10;
				}
			}
			
			this.ball.setPosition(pos.x-x,pos.y-y);
			if (pos.y-y<minHeight){
				//can not attach to another ball, disapear.
				this.fire_end(this.ball,true);
				break;
			}
			//ball hit
			var target = null;
			for(var i=0;i<this.balls.length;i++){
				var item = this.balls[i];
				if (item.collide(this.ball)){
					target = item;
					break;
				}
			}
			if (target){
				target.attchBall(this.ball);
				this.fire_end(this.ball);
				break;
			}
		}
		
	}
	
	
	
	//other balls do down;
	this.step = this.step +1;
	if (this.step>=10){
		this.step =0;
	}else{
		return;
	}
	for(var i=0;i<this.balls.length;i++){
		var p = this.balls[i].getPosition();
		if (p.y>600-sb.BallWidth){
			//game end;
			this.end_game();
			this.removes.push(this.balls[i]);
		}else{
			this.balls[i].setPosition(p.x,p.y+1);
		}
		
	}
	var minHeight = this.getTopY();
	if (minHeight>30){
		this.addNewRow();
	}
	/*
	for(var i=0;i<this.removes.length;i++){
		var ball = this.removes[i];
		var action = new lime.animation.FadeTo(0);
		ball.runAction(action);
		goog.array.remove(this.balls,ball);
		goog.events.listen(action,lime.animation.Event.STOP, function(){
			this.removeChild(ball);
		},false,this);
		
	}
	this.removes = [];
	*/
}
sb.PlayScene.prototype.end_game=function(){
	lime.scheduleManager.unschedule(this.goDown,this);
	this.removeAllChildren();
	this.init(this.rows,this.cols);
}

