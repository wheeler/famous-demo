
define(function (require) {

  var Engine = require('famous/core/Engine');
  Engine.setOptions({appMode: false});
  var Surface = require('famous/core/Surface');
  var mainContext = Engine.createContext();

  var fillerText = 'f f f f f<br>';
  for (i = 0 ; i < 7 ; i++)
    fillerText = fillerText + fillerText;

  var surface = new Surface({
    size: [undefined, undefined],
    classes: ['scrollable-surface'],
    properties: {
      backgroundColor: '#aaaaaa',
      padding: '5px'
    },
    content: '<pre>Engine.setOptions({appMode: false});</pre>' +
    'Surface\n<pre>size: [undefined, undefined],\nclasses: [\'scrollable-surface\']\n\n.scrollable-surface {\n'+
    '  overflow-y: scroll;\n  overflow-x: hidden;\n  -webkit-overflow-scrolling: touch;\n}</pre>' +
    'note: if you have background surfaces you may need explicit z-indexes for touch to work.<br/><br/>' +
    fillerText
  });

  mainContext.add(surface);
});
