const { ipcRenderer } = require("electron");

let events = []

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
  window.addEventListener('scroll', () => {
    const scrollData = {
      type: 'scroll',
      position: window.scrollY,
    };

    const last_event = events[events.length - 1];
    if (last_event.type === 'scroll') {
      events[events.length - 1] = scrollData;
    }
    else {
      events.push(scrollData);
    }
    ipcRenderer.send('event-list', events);
  });  

  document.addEventListener('click', (event) => {
    const xpath = getElementXPath(event.target);
    const clickData = {
      type: 'click',
      target: event.target.tagName,
      xpath: xpath,
    };

    events.push(clickData);
    ipcRenderer.send('event-list', events);
  });

  // Log input events
  document.addEventListener('input', (event) => {
    const xpath = getElementXPath(event.target);
    const inputData = {
      type: 'input',
      target: event.target.tagName,
      xpath: xpath,
      value: event.target.value,
    };

    const last_event = events[events.length - 1];
    if (last_event.type === 'input' && last_event.target === inputData.target) {
      events[events.length - 1] = inputData;
    }
    else {
      events.push(inputData);
    }

    ipcRenderer.send('event-list', events);
  });

  document.addEventListener('keydown', (event) => {    
    const key_codes = ['Tab', 'ArrowDown', 'ArrowUp', 'ArrowRight', 'ArrowLeft', 'Escape', 'F11', 'Space'];
    
    if (key_codes.includes(event.code)) {
      const keyData = {
        type: 'keypress',
        key: event.code,
      };

      events.push(keyData);
      ipcRenderer.send('event-list', events);
    }
  });
});
