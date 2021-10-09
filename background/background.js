let devPort = {};

// this is triggered when the panels connect to the background
browser.runtime.onConnect.addListener((port) => {
  port.postMessage({ greeting: 'hello?' });

  handleMessageFromDevTools({ type: 'background', instruction: 'attach' });

  devPort = port;
});

const handleMessage = (request, sender, sendResponse) => {
  if (sender.envType === 'content_child') {
    handleMessageFromContent(request, sender, sendResponse);
  } else if (sender.envType === 'devtools_child') {
    handleMessageFromDevTools(request, sender, sendResponse);
  }
}

const handleMessageFromContent = (request, sender, sendResponse) => {
  // TODO
  devPort.postMessage(request);
}

const handleMessageFromDevTools = (request, sender, sendResponse) => {
  // find the active tab, then send the message on
  browser.tabs.query({ active: true })
    .then((tabs) => sendMessageToContent(tabs, request, sendResponse));
}

const sendMessageToContent = (tabs, request, sendResponse) => {
  for (let tab of tabs) {
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

// This listens for messages from the devtools panel and forwards them on to the content
browser.runtime.onMessage.addListener(handleMessage);