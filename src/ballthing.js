
define(function (require, exports, module) {
  var Engine          = require('famous/core/Engine');
  var Surface         = require('famous/core/Surface');
  var Transform       = require('famous/core/Transform');
  var Modifier        = require('famous/core/Modifier');

  var Draggable       = require('famous/modifiers/Draggable');

  var PhysicsEngine   = require('famous/physics/PhysicsEngine');
  var Circle          = require('famous/physics/bodies/Circle');
  var Spring          = require('famous/physics/forces/Spring');

  var context = Engine.createContext();
  var physicsEngine = new PhysicsEngine();

  var ball = new Surface ({
    size: [100,100],
    properties: {
      backgroundColor: 'red',
      borderRadius: '50px'
    }
  });

  var ball2 = new Surface ({
    size: [100,100],
    properties: {
      backgroundColor: 'blue',
      borderRadius: '50px',
    }
  });

  ball.mod = new Modifier({origin:[0.5,0.5]});
  ball.draggable = new Draggable();
  ball.pipe(ball.draggable);
  ball.particle = new Circle({radius:100});
  ball.mod.transformFrom(function(){ return Transform.translate(0,0,0) });

  ball.spring = new Spring({
    anchor:         ball.particle,
    period:         400,
    dampingRatio:   0.07,
    length:         50
  });

  ball2.mod = new Modifier({origin:[0.5,0.5]});
  ball2.draggable = new Draggable();
  ball2.pipe(ball2.draggable);
  ball2.particle = new Circle({radius:100});
  ball2.mod.transformFrom(function(){ return ball2.particle.getTransform()});

  ball2.spring = new Spring({
    anchor:         ball2.particle,
    period:         400,
    dampingRatio:   0.07,
    length:         50
  });

  ball.draggable.on('start',function(){

    ball2.setProperties({pointerEvents:'none'});

    if (ball2.springID) physicsEngine.detach(ball2.springID);
    if (ball.springID) physicsEngine.detach(ball.springID);

    ball.springID = physicsEngine.attach(ball.spring, ball2.particle);
    ball2.springID = null;

    ball.mod.transformFrom(function(){ return Transform.translate(0,0,0) });
    ball2.mod.transformFrom(function(){ return ball2.particle.getTransform()});

  })

  ball.draggable.on('update', function() {
    pos = ball.draggable.getPosition();
    ball.particle.setPosition(pos);
  });

  ball.draggable.on('end', function() {
    ball2.setProperties({pointerEvents:'all'});
  });

  ball2.draggable.on('start',function(){

    ball.setProperties({pointerEvents:'none'});

    if (ball2.springID) physicsEngine.detach(ball2.springID);
    if (ball.springID) physicsEngine.detach(ball.springID);

    ball2.springID = physicsEngine.attach(ball2.spring, ball.particle);
    ball.springID = null;

    ball2.mod.transformFrom(function(){ return Transform.translate(0,0,0) });
    ball.mod.transformFrom(function(){ return ball.particle.getTransform()});

  })

  ball2.draggable.on('update', function() {
    pos = ball2.draggable.getPosition();
    ball2.particle.setPosition(pos);
  });

  ball2.draggable.on('end', function() {
    ball.setProperties({pointerEvents:'all'});
  });

  ball.springID = physicsEngine.attach(ball.spring, ball2.particle);

  physicsEngine.addBody(ball.particle);
  physicsEngine.addBody(ball2.particle);

  context.add(ball.mod).add(ball.draggable).add(ball);
  context.add(ball2.mod).add(ball2.draggable).add(ball2);
});