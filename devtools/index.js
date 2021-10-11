function initialisePanel() {
  console.log('panel init');
}

function unInitialisePanel() {
  console.log('panel destroy');
}

if (typeof browser !== 'undefined') {
  console.log('is firefox or edge');
  browser.devtools.panels.create(
    "OCT.o",
    "./resources/logo-x64.png",
    "./panels/panel.html"
  ).then((newPanel) => {
    newPanel.onShown.addListener(initialisePanel);
    newPanel.onHidden.addListener(unInitialisePanel);
  });
} else if (typeof chrome !== 'undefined') {
  console.log('is chrome or opera');
  chrome.devtools.panels.create(
    "OCT.o",
    "./devtools/resources/logo-x64.png",
    "./devtools/panels/panel.html",
    (newPanel) => {
      console.log('panel created');
      newPanel.onShown.addListener(initialisePanel);
      newPanel.onHidden.addListener(unInitialisePanel);
    }
  );
}