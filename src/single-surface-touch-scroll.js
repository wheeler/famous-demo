
define(function (require) {

  var Engine = require('famous/core/Engine');
  var Surface = require('famous/core/Surface');
  var mainContext = Engine.createContext();

  var fillerText = 'f f f f f<br>';
  for (i = 0 ; i < 7 ; i++)
    fillerText = fillerText + fillerText;

  var surface = new Surface({
    size: [undefined, undefined],
    classes: ['webkit-overflow-scrolling-touch'],
    properties: {
      backgroundColor: '#aaaaaa',
      overflowY: 'scroll',
      //overflowY: 'auto',
      overflowX: 'hidden',
      padding: '5px'
    },
    content: '<div>DIV with long content in the <code>size: [undefined, undefined]</code> surface.<br>'+ fillerText + '</div>'
  });

  mainContext.add(surface);

});
