
define(function (require, exports, module) {

  var Engine     = require("famous/core/Engine");
  var Surface    = require("famous/core/Surface");
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

  mainContext.add(container);



});