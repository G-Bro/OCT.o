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

    stageToTemplate: {
      handler() {
        return {
          thumbnail: omniCanvas.export('image/webp', 0.92),
          template: omniCanvas.stageToTemplate(),
        };
      }
    },

    fromTemplate: {
      handler(...arguments) {
        return window.wrappedJSObject.studioCanvas.fromTemplate(...arguments);
      }
    },
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
  return routes[request.subject][request.method].handler();
}

/**
 * Currently identical to get requests...
 */
const handlePostRequest = (request) => {
  return routes[request.subject][request.method].handler(...request.arguments);
}

/**
 * This listens for messages from the background
 */
browser.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === 'background') {
    sendResponse(handleBackgroundRequest(request));
  } else if (request.type === 'get') {
    sendResponse(handleGetRequest(request));
  } else if (request.type === 'post') {
    sendResponse(handlePostRequest(request));
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