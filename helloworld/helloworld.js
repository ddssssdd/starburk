//set main namespace
goog.provide('helloworld');


//get requirements
goog.require('lime.Director');
goog.require('lime.Scene');
goog.require('lime.Layer');
goog.require('lime.Circle');
goog.require('lime.Label');
goog.require('lime.Sprite');
goog.require('lime.GlossyButton');
goog.require('lime.animation.Spawn');
goog.require('lime.animation.FadeTo');
goog.require('lime.animation.ScaleTo');
goog.require('lime.animation.MoveTo');
goog.require('sb.Ball');
goog.require('sb.PlayScene')

helloworld.WIDTH = 700;
helloworld.HEIGHT = 768;
helloworld.start = function(){
	var director = new lime.Director(document.body,helloworld.WIDTH,helloworld.HEIGHT);
	var scene = new sb.PlayScene();
	scene.init(4,10);
	director.replaceScene(scene);
}

// entrypoint
helloworld.start2 = function(){
	
	var director = new lime.Director(document.body,1024,768),
	scene = new lime.Scene(),

	    target = new lime.Layer().setPosition(512,384),
        circle = new lime.Circle().setSize(150,150).setFill(255,150,0),
        
        lbl = new lime.Label().setSize(160,50).setFontSize(30).setText('TOUCH ME!,haha'),
        title = new lime.Label().setSize(800,70).setFontSize(60).setText('Now move me around!')
            .setOpacity(0).setPosition(512,80).setFontColor('#999').setFill(200,100,0,.1);


    //add circle and label to target object
    target.appendChild(circle);
    target.appendChild(lbl);
    var c2 = new lime.GlossyButton('hello').setPosition(10,10).setSize(100,100);
    scene.appendChild(c2);
    //add target and title to the scene
    scene.appendChild(target);
    scene.appendChild(title);
   
    //var sprite = new lime.Sprite().setPosition(100,100).setSize(61,61);
    //sprite.setFill(255,0,0);
    var sprite = new lime.Sprite().setPosition(100,100).setFill('assets/ball_0.png');
    //sprite.setFill('assets/ball_0.png');
    scene.appendChild(sprite);
    
	director.makeMobileWebAppCapable();

	goog.events.listen(c2,'click',function(){
		alert("hello");
	});
    //add some interaction
    goog.events.listen(target,['mousedown','touchstart'],function(e){

        //animate
        target.runAction(new lime.animation.Spawn(
            new lime.animation.FadeTo(.5).setDuration(.2),
            new lime.animation.ScaleTo(1.5).setDuration(.8)
        ));
        
        title.runAction(new lime.animation.FadeTo(1));

        //let target follow the mouse/finger
        e.startDrag();

        //listen for end event
        e.swallow(['mouseup','touchend'],function(){
            target.runAction(new lime.animation.Spawn(
                new lime.animation.FadeTo(1),
                new lime.animation.ScaleTo(1),
                new lime.animation.MoveTo(512,384)
            ));

            title.runAction(new lime.animation.FadeTo(0));
        });


    });

	// set current scene active
	director.replaceScene(scene);

}


//this is required for outside access after code is compiled in ADVANCED_COMPILATIONS mode
goog.exportSymbol('helloworld.start', helloworld.start);
