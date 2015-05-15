
define(function (require, exports, module) {

  var Engine     = require("famous/core/Engine");
  var Surface    = require("famous/core/Surface");
  var Modifier   = require("famous/core/Modifier");
  var Transform   = require("famous/core/Transform");
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
      itemSize: 780,
      diameter: 780,
      radialOpacity: 0  // make items at the edges more transparent
    }
  });

  scrollWheel.index = 0;

  scrollWheel.nextPageWithLoop = function() {
    scrollWheel.index++;
    var dataLength = this._dataSource.length;
    if (scrollWheel.index >= dataLength) {
      this.goToFirstPage();
      scrollWheel.index = 0;
    }
    else
      this.goToNextPage();
    dotsSurface.updateDots();
  };
  scrollWheel.toPage = function(pageId) {
    if (pageId >= 0 && pageId < pages.length && scrollWheel.index !== pageId) {
      scrollWheel.goToRenderNode(pages[pageId]);
      scrollWheel.index = pageId;
      dotsSurface.updateDots();
    }
  };

  var pages = _.map(['FIRST','SECOND','THIRD','FOURTH','FIFTH'], function(content) {
    var s = new Surface({
      content: content,
      properties: {
        textAlign: 'center',
        lineHeight: '400px',
        background: '#FF99FF',
        fontSize: '150px'
      }});
    s.pipe(scrollWheel);
    s.on('click', scrollWheel.nextPageWithLoop.bind(scrollWheel));
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

  //
  // Set up the DOTS at the bottom
  //

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
    properties: {
      textAlign: 'center',
      fontSize: '24px',
      zIndex: 10
    }
  });
  dotsSurface.updateDots = function() {
    var result = '';
    for (var i=0 ; i<pages.length ; i++) {
      if (result !== '')
        result += ' ';
      if (i === scrollWheel.index)
        result += '<span style="color: white;">&#9679;</span>';
      else
        result += '<span style="" data-dot-index="'+i+'">&#9679;</span>';
    }
    this.setContent(result)
  };
  dotsSurface.updateDots();
  dotsSurface.on('click', function(evt) {
    var index = $(evt.target).data('dotIndex');
    if (_.isNumber(index))
      scrollWheel.toPage(index);
  });
  var dotsModifier = new Modifier({
    size: [undefined, 28],
    align: [1,1],
    origin: [1,1],
    transform: Transform.translate(0, 0, 10)
  });
  container.add(dotsModifier).add(dotsSurface);

  //
  // Set up the backwards / forwards arrows
  //
  var backSurface = new Surface({
    size: [true, true],
    content: '&#171;', //«
    properties: {
      fontSize: '100px',
      fontWeight: 100,
      zIndex: 10
    }
  });
  var backModifier = new Modifier({
    align: [.5, .5],
    origin: [0, 0],
    transform: Transform.translate(-390, 0, 10)
  });
  var forwardSurface = new Surface({
    size: [true, true],
    content: '&#187;', //»
    properties: {
      fontSize: '100px',
      fontWeight: 100,
      zIndex: 10
    }
  });
  var forwardModifier = new Modifier({
    align: [.5, .5],
    origin: [1, 0],
    transform: Transform.translate(390, 0, 10)
  });

  backSurface.on('click', function() {
    if (scrollWheel.index > 0) {
      scrollWheel.index--;
      scrollWheel.goToPreviousPage();
      scrollWheel.updateDots();
    }
  });
  forwardSurface.on('click', scrollWheel.nextPageWithLoop.bind(scrollWheel));

  container.add(backModifier).add(backSurface);
  container.add(forwardModifier).add(forwardSurface);

  mainContext.add(container);

});