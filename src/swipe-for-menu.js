
define(function (require, exports, module) {

  var Engine     = require("famous/core/Engine");
  var Surface    = require("famous/core/Surface");
  var Scrollview = require("famous/views/Scrollview");
  var RenderNode = require('famous/core/RenderNode');
  var Transform = require('famous/core/Transform');
  var Draggable = require('famous/modifiers/Draggable');
  var ContainerSurface = require("famous/surfaces/ContainerSurface");
  var StateModifier = require('famous/modifiers/StateModifier');
  var Easing = require('famous/transitions/Easing');

  var mainContext = Engine.createContext();

  var scrollview = new Scrollview();
  var surfaces = [];
  var options = ['Chinese','Italian','Burgers/pub','Pizza','Japanese','Thai','Mexican','Salad','Burmese','New american',
    'Seafood','Steak','German','BBQ','Indian', 'Mediterranean','Vietnamese','Stay home and eat ice cream'];

  scrollview.sequenceFrom(surfaces);

  var screenWidth = 320;
  var halfScreenWidth = screenWidth/2;
  var threeQuartersScreen = (screenWidth*3)/4;
  var minimumSwipe = 60;

  var instruction = new Surface({
    content: 'Swipe the options below',
    size: [undefined, 50],
    properties: {
      backgroundColor: "darkgrey",
      color: 'white',
      lineHeight: "50px",
      textAlign: "center",
      zIndex: 10
    }
  });

  var buttonEasing = {
    curve: Easing.inOutSine,
    duration: 200
  };

  surfaces.push(instruction);

  for (var i = 0; i < options.length; i++) {

    var backgroundNoModifier = new StateModifier({
      //on the right
      align: [1, 0],
      origin: [1, 0],
      opacity: 1
    });
    var backgroundNo = new Surface({
      content: "<div class='brownButton'>Never</div><div class='redButton'>No</div>",
      classes: ['backgroundButton'],
      size: [threeQuartersScreen, 50],
      properties: {
        lineHeight: "50px",
        textAlign: "center"
      }
    });
    var backgroundYesModifier = new StateModifier({
      //on the right
      align: [1, 0],
      origin: [1, 0],
      opacity: 1
    });
    var backgroundYes = new Surface({
      content: "<div class='blueButton'>Always</div><div class='greenButton'>Yes</div>",
      classes: ['backgroundButton'],
      size: [threeQuartersScreen, 50],
      properties: {
        lineHeight: "50px",
        textAlign: "center"
      }
    });

    var containerMod = new StateModifier({
      size: [undefined, 50]
    });
    var container = new ContainerSurface({
      size: [undefined, 50],
      properties: {
        overflow: 'visible'
      }
    });
    var outerNode = new RenderNode();
    outerNode.add(containerMod).add(container);

    var draggable = new Draggable( {
      xRange: [-threeQuartersScreen, 0],
      yRange: [0, 0]
    });

    var item = new Surface({
      content: options[i],
      size: [undefined, 50],
      classes: ['normalSurface'],
      properties: {
        backgroundColor: "lightgrey",
        borderBottom: "1px solid grey",
        lineHeight: "50px",
        textAlign: "center"
      }
    });

    draggable.dragId = i;
    draggable.container = container;
    draggable.containerMod = containerMod;
    draggable.outerNode = outerNode;
    draggable.bgNoMod = backgroundNoModifier;
    draggable.bgNo = backgroundNo;
    draggable.bgYesMod = backgroundYesModifier;
    draggable.bgYes = backgroundYes;
    draggable.surface = item;

    //make the background surfaces FADE in
    draggable.on('update', function(e) {
      var xpos = e.position[0];
      if (xpos <=minimumSwipe && xpos >= -minimumSwipe) {
        this.container.removeClass('activeContainer');
        this.surface.removeClass('activeSurface');
        this.bgNo.removeClass('activeBackground');
        this.bgYes.removeClass('activeBackground');
        this.bgNoMod.setTransform(Transform.translate(0,0));
        this.bgYesMod.setTransform(Transform.translate(0,0));
      }
      if (xpos < -minimumSwipe) {
        this.container.addClass('activeContainer');
        this.surface.removeClass('normalSurface');
        this.surface.addClass('activeSurface');

        this.bgNo.addClass('activeBackground');
        this.bgNoMod.setTransform(Transform.translate(0,25), buttonEasing);
        this.bgYes.addClass('activeBackground');
        this.bgYesMod.setTransform(Transform.translate(0,-25), buttonEasing);
      }
    });
    draggable.on('end', function(e) {
      var removeThis = false;
      if (e.position[0] < -minimumSwipe) {
        this.setPosition([-threeQuartersScreen,0,0], {
          curve: Easing.inOutSine,
          duration: 300
        });
      }
      else {
        this.setPosition([0,0,0], {
          curve: Easing.inOutSine,
          duration: 300
        });
      }

      if (removeThis) {
        var thisOuterNode = this.outerNode;
        this.containerMod.setSize([undefined, 0], {duration: 300, curve: Easing.outCirc}, function() {
          var killLine = _.indexOf(surfaces, thisOuterNode);
          if (killLine > 0 && killLine < surfaces.length)
            surfaces.splice(killLine, 1);
        });
      }

    });

    var node = new RenderNode(draggable);
    node.add(item);
    container.add(node);

    //add the background
    container.add(backgroundNoModifier).add(backgroundNo);
    container.add(backgroundYesModifier).add(backgroundYes);

    item.pipe(draggable);
    item.pipe(scrollview);
    surfaces.push(outerNode);
  }

  mainContext.add(scrollview);

});