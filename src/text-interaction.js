
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



  function getSelectionPosition() {

    //get the selected range
    var range = window.getSelection().getRangeAt(0);
    //get the location of the range
    var rect = range.getBoundingClientRect();
    console.log(rect);
    //determine where to put the button based on the selected text
    var middle = rect.left + (rect.width / 2);
    $('#selectionPointer').css({top: (rect.bottom+2), left: middle, position:'absolute'});


    $('#otherDetails').val(JSON.stringify(rect))

  }




  $(window).bind('selectionEnd', function () {
    // reset selection timeout
    selectionEndTimeout = null;

    // get user selection
    var selectedText = getSelectionText();
    // if the selection is not empty show it :)
    if(selectedText != ''){
      $('#textSelection').val(selectedText);
      getSelectionPosition();
    }
  });
});