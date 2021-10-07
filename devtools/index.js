function initialisePanel() {
  console.log('panel init');
}

function unInitialisePanel() {
  console.log('panel destroy');
}

browser.devtools.panels.create(
  "OCT.o",
  "./resources/logo-x64.png",
  "./panels/panel.html"
).then((newPanel) => {
  newPanel.onShown.addListener(initialisePanel);
  newPanel.onHidden.addListener(unInitialisePanel);
});