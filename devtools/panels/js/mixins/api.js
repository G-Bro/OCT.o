let chromeCompatibilityMode = false;

if (typeof browser === 'undefined') {
  browser = chrome;

  chromeCompatibilityMode = true;
}

const devPort = browser.runtime.connect(null, { name: "octo-panel" });

const apiMixin = {
  data() {
    return {
      lastUpdateTime: 0,
      maxUpdateFrequency: 1000,
    }
  },

  methods: {
    runQuery(type, subject, method, arguments) {
      const frameTime = Date.now();

      if (frameTime - this.lastUpdateTime > this.maxUpdateFrequency) {
        browser.runtime.sendMessage({
          type,
          subject,
          method,
          arguments
        });

        this.lastUpdateTime = frameTime;
      } else {
        // console.log('cancelled query due to time');
      }
    },

    registerApiListeners(options) {
      devPort.onMessage.addListener((message) => {
        console.log('receipt', message);
        if (options.eventHandler && message.type === 'event') {
          options.eventHandler(message.event);
        }

        if (message.request && message.response) {
          const method = message.request.method;
          if (options[method]) {
            options[method](message.response, message.request);
          }
        }
      });
    },
  },
}