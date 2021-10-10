const delayedQueries = [];
let devPort = {
  postMessage(request) {
    // if the true dev port hasn't been initialised yet, cache any requests
    // here and send them when it has been
    delayedQueries.push(request);
  }
};

let chromeCompatibilityMode = false;

console.log('loaded');

if (typeof browser === 'undefined') {
  browser = chrome;
  chromeCompatibilityMode = true;
}

// this is triggered when the panels connect to the background
browser.runtime.onConnect.addListener((port) => {
  port.postMessage({ greeting: 'hello?' });

  handleMessageFromDevTools({ type: 'background', instruction: 'attach' });

  devPort = port;

  if (delayedQueries.length) {
    console.log('sending delayed queries');
    delayedQueries.forEach((query) => {
      devPort.postMessage(query);
    });

    delayedQueries.splice(0);
  }
});

const handleMessage = (request, sender, sendResponse) => {
  console.log('received message', sender);

  if (sender.envType === 'content_child' || sender.tab) {
    handleMessageFromContent(request, sender, sendResponse);
  } else {
    handleMessageFromDevTools(request, sender, sendResponse);
  }
}

const handleMessageFromContent = (request, sender, sendResponse) => {
  console.log(request);
  devPort.postMessage(request);
}

const handleMessageFromDevTools = (request, sender, sendResponse) => {
  if (chromeCompatibilityMode) {
    chrome.tabs.query(
      { active: true},
      (tabs) => sendMessageToContent(tabs, request, sendResponse)
    );
  } else {
    // find the active tab, then send the message on
    browser.tabs.query({ active: true })
      .then((tabs) => sendMessageToContent(tabs, request, sendResponse));
  }
}

const sendMessageToContent = (tabs, request, sendResponse) => {
  for (let tab of tabs) {
    if (chromeCompatibilityMode) {
      chrome.tabs.sendMessage(
        tab.id,
        request,
        null,
        response => {
        //   console.log("Message received from content script:");
        //   console.log(response);
          // sendResponse(response);
          devPort.postMessage({ request, response });
        }
      );
    } else {
      browser.tabs.sendMessage(
        tab.id,
        request,
      ).then(response => {
      //   console.log("Message received from content script:");
      //   console.log(response);
        // sendResponse(response);
        devPort.postMessage({ request, response });
      });
    }
  }
}

// This listens for messages from the devtools panel and forwards them on to the content
browser.runtime.onMessage.addListener(handleMessage);