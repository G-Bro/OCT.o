Vue.component(
  'test',
  {
    template: '<oct-button @click="onClick">Click me</oct-button>',
    methods: {
      onClick(e) {
        console.log('clicked');
        browser.runtime.sendMessage({
          type: 'get',
          subject: 'canvas',
          method: 'countObjects'
        });
      },
    },
  },
);