
define(function (require, exports, module) {

  var Engine     = require("famous/core/Engine");
  var Surface    = require("famous/core/Surface");
  var Modifier   = require("famous/core/Modifier");
  var ContainerSurface = require("famous/surfaces/ContainerSurface");

  var ScrollController = require('famous-flex/ScrollController');
  var WheelLayout = require('famous-flex/layouts/WheelLayout');

  var mainContext = Engine.createContext();

// Create scroll-wheel
  var scrollWheel = new ScrollController({
    layout: WheelLayout,
    direction: 0,
    paginated: true,
    paginationEnergyThresshold: 0.5,
    enabled: false,
    layoutOptions: {
      itemSize: 400,
      diameter: 400,
      radialOpacity: 0  // make items at the edges more transparent
    }
  });

  scrollWheel.goToNextPageWithLoop = function() {
    var lastDataIndex = this._dataSource.length - 1;
    if (this.getFirstVisibleItem().index === lastDataIndex)
      this.goToFirstPage();
    else
      this.goToNextPage();
    var newIndex = (this.getFirstVisibleItem().index + 1) % pages.length;
    dotsSurface.setContent(dotsContent(newIndex));
  };

  var pages = _.map(['FIRST','SECOND','THIRD'], function(content) {
    var s = new Surface({
      content: content,
      properties: {
        textAlign: 'center',
        lineHeight: '200px',
        background: '#FF99FF'
      }});
    s.pipe(scrollWheel);
    s.on('click', scrollWheel.goToNextPageWithLoop.bind(scrollWheel));
    return s;
  });

  scrollWheel.setDataSource(pages);

  wheel = scrollWheel;

// Create a container-surface for clipping and give it a nice perspective
  var container = new ContainerSurface({
    properties: {
      overflow: 'hidden',
      padding: '100px 0'
    }
  });
  //container.context.setPerspective(1500);
  container.add(scrollWheel);

  var dotsContent = function(selectedIndex) {
    var result = '';
    for (var i=0 ; i<pages.length ; i++) {
      if (result !== '')
        result += ' ';
      if (i === selectedIndex)
        result += '<span style="color: white;">&#9679;</span>';
      else
        result += '&#9679;';
    }
    return result;
  };
  var dotsSurface = new Surface({
    content: dotsContent(0),
    properties: {
      textAlign: 'center',
      fontSize: '24px'
    }
  });
  var dotsModifier = new Modifier({
    size: [undefined, 28],
    align: [1,1],
    origin: [1,1]
  });

  container.add(dotsModifier).add(dotsSurface);



  mainContext.add(container);



});