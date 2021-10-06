function sendToContent(content) {
  browser.runtime.sendMessage({
    tabId: browser.devtools.inspectedWindow.tabId,
    content: content,
  });
}