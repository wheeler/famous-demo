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


  var duration = 200;
  var myEasing = Easing.inOutSine;
  var transition = {curve: myEasing, duration: duration};
  var initialRatios = [true, true, 1]; //fixed-fixed-free
  var flex = new FlexibleLayout({
    ratios: initialRatios
  });

  var fillerText = 'f f f f f<br>';
  for (i = 0 ; i < 7 ; i++)
    fillerText = fillerText + fillerText;


  var surfaces = [];
  for (var i = 1; i <= initialRatios.length; i++) {
    var surface = new Surface({
      size: [undefined, undefined],
      properties: {
        backgroundColor: i === 2 ? '#ffaaaa' : '#aaaaaa',
        overflowY: 'auto',
        overflowX: 'hidden',
        padding: '5px'
      },
      content: '<div style="width: 190px"; font-weight: bold; font-size: 20px">Column '+i+'</div><div style="width: 190px">'+
        ((i==3 ? '<br>Click anywhere to toggle columns<br><br>': ' '))
        + fillerText + '</div>'
    });

    if (i === 1 || i===2 ) {
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
  var inTransition = false;

  Engine.on('click', function () {
    if (!inTransition) {
      inTransition = true;
      var newsize = toggle ? [200, undefined] : [0, undefined];
      if (!toggle)
        surfaces[0].surface.state.setSize(newsize, transition, function(){
          surfaces[1].surface.state.setSize(newsize, transition);
          flex.setRatios(initialRatios, transition, function(){ inTransition = false; });
        });
      else
        surfaces[1].surface.state.setSize(newsize, transition, function(){
          surfaces[0].surface.state.setSize(newsize, transition);
          flex.setRatios(initialRatios, transition, function(){ inTransition = false; });
        });
      flex.setRatios(initialRatios, transition, function(){ inTransition = false; });
      toggle = !toggle;
    }
  });

  mainContext.add(flex);
});
