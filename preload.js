const { ipcRenderer } = require('electron');

// Function to get the XPath of an element
function getElementXPath(elm) {
    var allNodes = document.getElementsByTagName("*");
    for (var segs = []; elm && elm.nodeType == 1; elm = elm.parentNode) {
      if (elm.hasAttribute("id")) {
        var uniqueIdCount = 0;
        for (var n = 0; n < allNodes.length; n++) {
          if (allNodes[n].hasAttribute("id") && allNodes[n].id == elm.id)
            uniqueIdCount++;
          if (uniqueIdCount > 1) break;
        }
        if (uniqueIdCount == 1) {
          segs.unshift('id("' + elm.getAttribute("id") + '")');
          return segs.join("/");
        } else {
          segs.unshift(
            elm.localName.toLowerCase() + '[@id="' + elm.getAttribute("id") + '"]'
          );
        }
      } else if (elm.hasAttribute("class")) {
        segs.unshift(
          elm.localName.toLowerCase() +
            '[@class="' +
            elm.getAttribute("class") +
            '"]'
        );
      } else {
        for (i = 1, sib = elm.previousSibling; sib; sib = sib.previousSibling) {
          if (sib.localName == elm.localName) i++;
        }
        segs.unshift(elm.localName.toLowerCase() + "[" + i + "]");
      }
    }
    return segs.length ? "/" + segs.join("/") : null;
}

window.addEventListener('DOMContentLoaded', () => {
  // Log clicks
  document.addEventListener('click', (event) => {
    const xpath = getElementXPath(event.target);
    const clickData = {
      type: 'click',
      target: event.target.tagName,
      xpath: xpath,
      time: new Date()
    };
    ipcRenderer.send('log-event', clickData);
  });

  // Log input events
  document.addEventListener('input', (event) => {
    const xpath = getElementXPath(event.target);
    const inputData = {
      type: 'input',
      target: event.target.tagName,
      xpath: xpath,
      value: event.target.value,
      time: new Date()
    };
    ipcRenderer.send('log-event', inputData);
  });
});
