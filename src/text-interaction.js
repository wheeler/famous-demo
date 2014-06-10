
String.prototype.regexForwardIndexOf = function(regex, startpos) {
  var indexOf = this.substring(startpos || 0).search(regex);
  return (indexOf >= 0) ? (indexOf + (startpos || 0)) : indexOf;
};
String.prototype.regexBackwardsIndexOf = function(regex, endPos) {
  console.log('looking backwards string');
  console.log(this.substring(0, endPos || 0));
  var stringToWorkWith = this.substring(0, endPos || 0);

//  var lastIndexOf = -1;
//  var nextStop = 0;
//  while((result = regex.exec(stringToWorkWith)) != null) {
//    lastIndexOf = result.index;
//    regex.lastIndex = ++nextStop;
//  }
//  return lastIndexOf;
  return 0;
};

define(function (require, exports, module) {

  var selectionEndTimeout = null;
  var scriptIsManipulatingSelection = false;

  // bind selection change event to my function
  document.onselectionchange = userSelectionChanged;

  function userSelectionChanged() {
    if (scriptIsManipulatingSelection)
      return;

    // wait 500 ms after the last selection change event
    if (selectionEndTimeout) {
      clearTimeout(selectionEndTimeout);
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

  function extendToSentence () {
    scriptIsManipulatingSelection = true;
    if (window.getSelection) {  // all browsers, except IE before version 9
      var selection = window.getSelection();

      if (!selection.isCollapsed) {
        // if the selection end point is within a sentence
        if (selection.focusNode.nodeType == Node.TEXT_NODE) {
          var selRange = selection.getRangeAt(0);

          console.log(getSelectionText());
          console.log(selection);


          // if the focus node precedes the anchor node
          if (selRange.startContainer == selection.focusNode && selRange.startOffset == selection.focusOffset) {
            console.log('REVERSE selection action');
            selRange.setStart(selection.focusNode, 0);
          }
          // if the anchor node precedes the focus node
          else {
            console.log('FORWARD selection action');
            //todo if the last character of the selection is already the end of the sentence don't extend to another one
            //look for end of sentence indicator
            var sentenceEnd = selection.focusNode.data.regexForwardIndexOf(/([\.\?!\n])/,selection.focusOffset) + 1;
            console.log('sentence end', sentenceEnd);
            var sentenceStart = selection.focusNode.data.regexBackwardsIndexOf(/([\.\?!\n])/,selection.focusOffset);
            console.log('sentence start', sentenceStart);
            selRange.setEnd(selection.focusNode, sentenceStart);
            if(sentenceEnd > 0)
              selRange.setEnd(selection.focusNode, sentenceEnd);

          }

          selection.removeAllRanges();
          selection.addRange (selRange);
        }
      }
    }
    else {  // Internet Explorer before version 9
      alert ("Your browser does not support this example");
    }
    setTimeout(function(){scriptIsManipulatingSelection = false;}, 500);
  }


  function setupSelectedTextButton() {
    //get the selected range
    var range = window.getSelection().getRangeAt(0);
    //get the location of the range
    var boundingRect = range.getBoundingClientRect();
    var clientRect = range.getClientRects()[0];

    //determine where to put the button based on the selected text
    var middle = boundingRect.left + (boundingRect.width / 2);
    $('#selectionPointer').css({top: (boundingRect.bottom+2), left: middle});

    $('#otherDetails').val('bounding\n' + JSON.stringify(boundingRect) + '\n\nclient0\n'+ JSON.stringify(clientRect));
  }

  function resetSelectedTextButton() {
    $('#selectionPointer').css({top: 0, left: 0});
    $('#otherDetails').val(null);
    $('#textSelection').val(null)
  }

  $(window).bind('selectionEnd', function () {
    // reset selection timeout
    selectionEndTimeout = null;

    // get user selection
    var selectedText = getSelectionText();
    // if the selection is not empty show it :)
    if(selectedText != '') {
      extendToSentence();

      selectedText = getSelectionText();
      $('#textSelection').val(selectedText);
      setupSelectedTextButton();
    }
    else
      resetSelectedTextButton();
  });

});
