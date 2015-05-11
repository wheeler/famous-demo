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
  });


  //Prepare a MediaQueryList
  var mobileWatch = window.matchMedia("(max-width:768px)");
  var nonMobileWatch = window.matchMedia("(min-width:769px)");

  if (mobileWatch.matches) {
    console.log('initially mobile');
    menuSize = 100;
  }
  else {
    console.log('initially desktop');
    menuSize = 200;
  }

  var menuSize;

  var fillerText = 'f f f f f<br>f f f f f<br>f f f f f<br>f f f f f<br>f f f f f<br>f f f f f<br>';
  fillerText = fillerText + fillerText + fillerText + fillerText + fillerText;

  var sizes = [
    [undefined, undefined],
    [undefined, undefined],
    [undefined, undefined]
  ];

  var surfaces = [];
  for (var i = 1; i <= initialRatios.length; i++) {
    var size = sizes[i-1];

    var surface = new Surface({
      size: size,
      properties: {
        backgroundColor: i === 2 ? '#ffaaaa' : '#aaaaaa',
        overflowY: 'auto',
        overflowX: 'hidden',
        padding: '5px'
      },
      content: '<div style="width: 190px"; font-weight: bold; font-size: 20px">Column '+i+'</div><div style="width: 190px">'+
        ((i==3 ? '<br>Click anywhere to menuClosed columns<br><br>': ' '))
        + fillerText + '</div>'
    });

    if (i === 1 || i===2) {
      surface.state = new StateModifier({size: [menuSize,undefined]});
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

  var menuClosed = false;
  var myEasing = Easing.inOutSine;
  var inTransition = false;

  var updateSizes = function() {
    if (mobileWatch.matches)
      menuSize = 100;
    else
      menuSize = 200;

    if (!inTransition) {
      inTransition = true;
      console.log('menuClosed', menuClosed);
      var newsize = menuClosed ? [0, undefined] : [menuSize, undefined];
      surfaces[0].surface.state.setSize(newsize, {curve: myEasing, duration: 500});
      surfaces[1].surface.state.setSize(newsize, {curve: myEasing, duration: 500});
      flex.setRatios(initialRatios, {curve: myEasing, duration: 500}, function(){ inTransition = false; });
    }
  };

  Engine.on('click', function () {
    menuClosed = !menuClosed;
    updateSizes();
  });


  //Add a listener to the MediaQueryList
  mobileWatch.addListener(function(e){
    if(e.matches) {
      console.log('enter mobile');
      updateSizes();
    }
  });
  //Add a listener to the MediaQueryList
  nonMobileWatch.addListener(function(e){
    if(e.matches) {
      console.log('exit mobile');
      updateSizes();
    }
  });

  mainContext.add(flex);
});

function _createSurfaces() {

}