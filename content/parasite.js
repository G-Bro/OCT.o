console.log('Parasite attached');

let omniCanvas = null;

function onCanvasRendered() {
  console.log('on canvas rendered');
  browser.runtime.sendMessage({
    type: 'event',
    event: {
      name: 'rendered',
    },
  });
}

const routes = {
  canvas: {
    countObjects: {
      handler() {
        return window.wrappedJSObject.studioCanvas.getObjects().length;
      }
    },
    getObjects: {
      handler() {
        const objects = [];
        const objs = window.wrappedJSObject.studioCanvas.getObjects()

        for (let i = 0; i < objs.length; ++i) {
          objects.push(objs[i].toDelta());
        }

        return objects;
      }
    }
  }
};

/**
 * Handles requests directly from the background
 * @param {} request 
 */
const handleBackgroundRequest = (request) => {
  if (request.instruction === 'attach') {
  }
}

const handleGetRequest = (request) => {
  console.log(request);
  return routes[request.subject][request.method].handler();
}

/**
 * This listens for messages from the background
 */
browser.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === 'background') {
    sendResponse(handleBackgroundRequest(request));
  } else if (request.type === 'get') {
    sendResponse(handleGetRequest(request));
  } else {

  }

  return true;
});

setTimeout(
  () => {
    browser.runtime.sendMessage('Henlo my frond');
  },
  3000,
);
omniCanvas = window.wrappedJSObject.studioCanvas;

console.log('attached to canvas', omniCanvas, omniCanvas.canvasElement);
window.addEventListener('rendered', onCanvasRendered);