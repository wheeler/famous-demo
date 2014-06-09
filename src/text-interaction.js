
define(function (require, exports, module) {

  var selectionEndTimeout = null;

  // bind selection change event to my function
  document.onselectionchange = userSelectionChanged;

  function userSelectionChanged() {
    // wait 500 ms after the last selection change event
    if (selectionEndTimeout) {
      clearTimeout(selectionEndTimeout);
      $('.log ol').append('<li>User Selection Changed</li>');
      // scroll to bottom of the div
      $('.log').scrollTop($('.log ol').height());
    }
    selectionEndTimeout = setTimeout(function () {
      $(window).trigger('selectionEnd');
    }, 500);
  }


// helper function
  function getSelectionText() {
    var text = "";
    if (window.getSelection) {
      text = window.getSelection().toString();
    } else if (document.selection && document.selection.type != "Control") {
      text = document.selection.createRange().text;
    }
    return text;
  }

  $(window).bind('selectionEnd', function () {
    // reset selection timeout
    selectionEndTimeout = null;

    // TODO: Do your cool stuff here........

    $('.log ol').append('<li>User Selection Ended</li>');
    // scroll to bottom of the div
    $('.log').scrollTop($('.log ol').height());

    // get user selection
    var selectedText = getSelectionText();
    // if the selection is not empty show it :)
    if(selectedText != ''){
      console.log(selectedText);
      $('#textSelection').val(selectedText);
    }
  });
});