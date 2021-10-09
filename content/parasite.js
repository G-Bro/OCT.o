console.log('Parasite attached');

let omniCanvas = null;
let chromeCompatibilityMode = false;

if (typeof browser === 'undefined') {
  browser = chrome;
  chromeCompatibilityMode = true;
}

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
      },

      chromeHandler() {
        return {
          thumbnail: runWindowFunction("studioCanvas.export('image/webp', 0.92)"),
          template: JSON.parse(runWindowFunction("JSON.stringify(studioCanvas.stageToTemplate())")),
        }
      }
    },

    fromTemplate: {
      handler(...arguments) {
        return window.wrappedJSObject.studioCanvas.fromTemplate(...arguments);
      },

      chromeHandler(template, clean) {
        return  runWindowFunction(`studioCanvas.fromTemplate(${JSON.stringify(template)}, ${clean})`);
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
  if (chromeCompatibilityMode) {
    return routes[request.subject][request.method].chromeHandler();
  }
  return routes[request.subject][request.method].handler();
}

/**
 * Currently identical to get requests...
 */
const handlePostRequest = (request) => {
  if (chromeCompatibilityMode) {
    return routes[request.subject][request.method].chromeHandler(...request.arguments);
  }
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

    if (!omniCanvas) {
      omniCanvas = retrieveWindowVariables('studioCanvas');

      console.log('attached to canvas', omniCanvas, omniCanvas.canvasElement);

      // omniCanvas = window.wrappedJSObject.studioCanvas;
      window.addEventListener('rendered', onCanvasRendered);
    }
  },
  3000,
);

/**
 * Chrome doesn't support nice transfer of variables from the window to
 * extension in Manifest V2, so I have to do ...this
 *
 * @param {string} script A string representation of a script to run, which
 * should return a single non-object value
 */
function runWindowFunction(script) {
  const key = 'functionInjectionValue';
  const scriptContent = `
    ${key} = ${script};
    document.body.dataset['tmp_${key}'] = ${key};
  `;

  const scriptElement = document.createElement('script');
  scriptElement.id = 'functionInjectionScript';
  scriptElement.appendChild(document.createTextNode(scriptContent));

  document.body.appendChild(scriptElement);

  const returnValue = document.body.dataset[`tmp_${key}`];

  document.body.dataset[`tmp_${key}`] = null;

  document.body.removeChild(scriptElement);

  return returnValue;
}

/**
 * Chrome doesn't support nice transfer of variables from the window to extension in Manifest V2, so I have to use ...this
 *
 * @param {string} script A string name of a variable to retrieve from the window
 */
function retrieveWindowVariables(variable) {
  if (window.wrappedJSObject) {
    return window.wrappedJSObject[variable];
  }

  const scriptContent= `if (typeof ${variable} !== 'undefined') document.querySelector('body').dataset['tmp_${variable}'] = ${variable};\n`;

  const script = document.createElement('script');
  script.id = 'tmpScript';
  script.appendChild(document.createTextNode(scriptContent));
  (document.body || document.head || document.documentElement).appendChild(script);

  const returnValue = document.querySelector("body").dataset["tmp_" + variable];
  document.querySelector("body").dataset["tmp_" + variable] = null;

  document.querySelector("#tmpScript").parentElement.removeChild(document.querySelector("#tmpScript"));

  console.log(returnValue);

  return returnValue;
}

omniCanvas = retrieveWindowVariables('studioCanvas');

if (omniCanvas) {
  console.log('attached to canvas', omniCanvas, omniCanvas.canvasElement);

  // omniCanvas = window.wrappedJSObject.studioCanvas;
  window.addEventListener('rendered', onCanvasRendered);
}