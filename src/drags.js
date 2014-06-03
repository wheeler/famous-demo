
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

  surfaces.push(instruction);

  for (var i = 0; i < options.length; i++) {

    var backgroundYesModifier = new StateModifier({
      //on the left
      origin: [0,0],
      opacity: 0
    });
    var backgroundYes = new Surface({
      content: "Yes",
      size: [halfScreenWidth, 50],
      properties: {
        backgroundColor: "#00FF00",
        lineHeight: "50px",
        paddingLeft: "20px",
        textAlign: "left"
      }
    });
    var backgroundNoModifier = new StateModifier({
      //on the right
      origin: [1,0],
      opacity: 0
    });
    var backgroundNo = new Surface({
      content: "No",
      size: [halfScreenWidth, 50],
      properties: {
        backgroundColor: "#FF0000",
        lineHeight: "50px",
        paddingRight: "20px",
        textAlign: "right"
      }
    });

    var containerMod = new StateModifier({
      size: [undefined, 50]
    });
    var container = new ContainerSurface({
      size: [undefined, 50],
      properties: {
        overflow: 'hidden'
      }
    });
    var outerNode = new RenderNode();
    outerNode.add(containerMod).add(container);

    var draggable = new Draggable( {
      xRange: [-halfScreenWidth, halfScreenWidth],
      yRange: [0, 0]
    });

    draggable.dragId = i;
    draggable.container = container;
    draggable.containerMod = containerMod;
    draggable.outerNode = outerNode;
    draggable.bgNoMod = backgroundNoModifier;
    draggable.bgYesMod = backgroundYesModifier;

    //make the background surfaces FADE in
    draggable.on('update', function(e) {
      var xpos = e.position[0];
      if (xpos < 0) {
        this.bgNoMod.setOpacity((-xpos/halfScreenWidth) * .75);
      }
      if (xpos >= 0) {
        this.bgYesMod.setOpacity((xpos/halfScreenWidth) * .75);
      }
    });
    draggable.on('end', function(e) {
      var removeThis = false;
      if (e.position[0] == halfScreenWidth) {
        //YES
        removeThis = true;
      }
      else if (e.position[0] == -halfScreenWidth) {
        //NO
        removeThis = true;
      }
      else {
        this.setPosition([0,0,0], {
          curve: Easing.inOutSine,
          duration: 300
        });
      }

      if (removeThis) {
        this.containerMod.setSize([undefined, 0], {duration: 300, curve: Easing.outCirc}, function() {
          var killLine = _.indexOf(surfaces, this.outerNode);
          console.log('kill', killLine);
          if (killLine > 0 && killLine < surfaces.length)
            surfaces.splice(killLine, 1);
        });
      }

    });

    var item = new Surface({
      content: options[i],
      size: [undefined, 50],
      properties: {
        backgroundColor: "lightgrey",
        borderBottom: "1px solid grey",
        lineHeight: "50px",
        textAlign: "center",
        zIndex: 10
      }
    });

    var node = new RenderNode(draggable);
    node.add(item);
    //try to put the draggable in front of the background

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