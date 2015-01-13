
define(function (require) {

  var Engine = require('famous/core/Engine');
  Engine.setOptions({appMode: false});
  var Surface = require('famous/core/Surface');
  var Transform = require('famous/core/Transform');
  var StateModifier = require('famous/modifiers/StateModifier');
  var mainContext = Engine.createContext();

  var surface = new Surface({
    size: [200, 200],
    properties: {
      backgroundColor: '#aaaaaa',
      padding: '5px'
    },
    content: 'Surface #1 <code>StateModifier({ transform: Transform.behind});</code> <b>This surface not appear in Mobile Safari (iOS & iOS Simulator)</b>'
  });
  var surface2 = new Surface({
    size: [200, 200],
    properties: {
      backgroundColor: '#bbaabb',
      padding: '5px'
    },
    content: 'Surface #2 <code>StateModifier({ transform: Transform.translate (120,170) });</code>'
  });

  var behindModifier = new StateModifier({
    transform: Transform.behind //this makes the whole surface not appear in mobile safari
  });

  var downModifier = new StateModifier({
    transform: Transform.translate(120,170)
  });

  mainContext.add(behindModifier).add(surface);
  mainContext.add(downModifier).add(surface2);

});
