/**
 * FlexibleLayout
 * ------------
 *
 * FlexibleLayout is a component for making ratio based layouts
 * similar to HTML5 Flexbox.
 *
 * In this example, use a FlexibleLayout to arrange an array of
 * renderables based on both the parent size and the defined
 * size of the renderables
 */

define(function (require, exports, module) {
  var Engine = require('famous/core/Engine');
  var Surface = require('famous/core/Surface');
  var Modifier = require('famous/core/Modifier');
  var RenderNode = require('famous/core/RenderNode');
  var StateModifier = require('famous/modifiers/StateModifier');
  var FlexibleLayout = require('famous/views/FlexibleLayout');
  var Easing = require('famous/transitions/Easing');

  var mainContext = Engine.createContext();

  var initialRatios = [true, true, 1]; //fixed-fixed-free

  var flex = new FlexibleLayout({
    ratios: initialRatios


//    ,transition: {
//      curve: 'easeInOut',
//      duration: 2000
//    }


  });

  var fillerText = 'f f f f f<br>f f f f f<br>f f f f f<br>f f f f f<br>f f f f f<br>f f f f f<br>';
  fillerText = fillerText + fillerText + fillerText + fillerText + fillerText;

  var sizes = [
    [undefined, undefined],
    [undefined, undefined],
    [undefined, undefined]
  ];

  var surfaces = [];
  for (var i = 1; i <= initialRatios.length; i++) {
    size = sizes[i-1];


    var surface = new Surface({
      size: size,
      properties: {
        backgroundColor: i === 2 ? '#ffaaaa' : '#aaaaaa',
        overflowY: 'auto',
        overflowX: 'hidden',
        padding: '5px'
      },
      content: '<div style="width: 190px"; font-weight: bold; font-size: 20px">'+i+'</div><div style="width: 190px">'+fillerText+'</div>'
    });

    if (i === 1 || i===2) {
      surface.state = new StateModifier({size: [200,undefined]});
      surface.node = new RenderNode();
      surface.node.add(surface.state).add(surface);
      surface.node.surface = surface;
      surfaces.push(surface.node);
    }
    else {
      surfaces.push(surface);
    }
  }

  flex.sequenceFrom(surfaces);

  var toggle = false;
  var myEasing = Easing.inOutSine;
  var inTransition = false;
  Engine.on('click', function () {
    if (!inTransition) {
      inTransition = true;
      var newsize = toggle ? [200, undefined] : [0, undefined];
      surfaces[0].surface.state.setSize(newsize, {curve: myEasing, duration: 500});
      surfaces[1].surface.state.setSize(newsize, {curve: myEasing, duration: 500});
      flex.setRatios(initialRatios, {curve: myEasing, duration: 500}, function(){ inTransition = false; });
      toggle = !toggle;
    }
  });

  mainContext.add(flex);
});
