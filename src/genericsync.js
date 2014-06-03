

define(function (require, exports, module) {
  var Engine     = require("famous/core/Engine");
  var Surface    = require("famous/core/Surface");
  var Transform  = require("famous/core/Transform");
  var Modifier   = require("famous/core/Modifier");

  var Transitionable = require("famous/transitions/Transitionable");
  var SnapTransition = require("famous/transitions/SnapTransition");
  Transitionable.registerMethod("snap", SnapTransition);

  var GenericSync = require("famous/inputs/GenericSync");
  var MouseSync   = require("famous/inputs/MouseSync");
  var TouchSync   = require("famous/inputs/TouchSync");

// register sync classes globally for later use in GenericSync
  GenericSync.register({
    "mouse" : MouseSync,
    "touch" : TouchSync
  });

// lesson default parameters
  var DISPLACEMENT_LIMIT = 150;
  var DISPLACEMENT_THRESHOLD = 200;
  var VELOCITY_THRESHOLD = 0.2;
  var SURFACE_SIZE = [200, 200];

  var position = new Transitionable([0,0]);

// funnel both mouse and touch input into a GenericSync
// and only read from the x-displacement
  var sync = new GenericSync(
    ["mouse", "touch"],
    {direction : GenericSync.DIRECTION_X}
  );

  var background = new Surface({
    size : SURFACE_SIZE,
    properties : {background : 'black'}
  });

  var draggableSurface = new Surface({
    size : SURFACE_SIZE,
    properties : {background : 'red'}
  });

  var textSurface = new Surface({
    size : SURFACE_SIZE,
    content : 'hi',
    properties : {
      fontSize : '100px',
      lineHeight : SURFACE_SIZE[1] + 'px',
      textAlign : 'center',
      pointerEvents : 'none',
      textShadow : '0 0 2px white'
    }
  });

  draggableSurface.pipe(sync);

  var resetting = false;
  sync.on('update', function(data) {
    if (resetting)
      return;
    var currentPosition = position.get();
    var delta = data.delta;

    //console.log(currentPosition + delta);
    if (currentPosition + delta < DISPLACEMENT_LIMIT) {
      // move right until past the edge
      position.set(currentPosition + delta);
    }
    else {
      // otherwise, clamp at edge
      position.set(DISPLACEMENT_LIMIT,50);
    }

    if (currentPosition + delta < -DISPLACEMENT_LIMIT)
      position.set(-DISPLACEMENT_LIMIT);
  });

  sync.on('end', function(data){
    var currentPosition = position.get();
    var velocity = data.velocity;

    if (currentPosition > DISPLACEMENT_THRESHOLD || velocity > VELOCITY_THRESHOLD) {
      // transition right if the displacement, or velocity is above
      // the appropriate threshold
      position.set(DISPLACEMENT_LIMIT, {
        method   : 'snap',
        period   : 200,
        velocity : velocity
      });
    }
    else {
      // otherwise transition back to 0
      position.set(0, {
        method   : 'snap',
        period   : 200,
        velocity : velocity
      });
    }
  });

  var positionModifier = new Modifier({
    transform : function(){
      return Transform.translate(position.get(),0,0);
    }
  });

  var rotationModifier = new Modifier({
    transform : function() {
      var angle = Math.PI * (position.get() / DISPLACEMENT_LIMIT) / 4;
      return Transform.rotateZ(angle);
    }
  });

  var centerModifier = new Modifier({origin : [.5,.5]});

// define the scene graphq1
  var mainContext = Engine.createContext();
  var centerNode = mainContext.add(centerModifier);
  centerNode.add(background);

  var moveableNode = centerNode.add(positionModifier).add(rotationModifier);
  moveableNode.add(draggableSurface);
  moveableNode.add(textSurface);
});