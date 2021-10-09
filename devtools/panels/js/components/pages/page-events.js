Vue.component(
  'page-events',
  {
    template: `
      <div>

        <p>There are {{ objectCount }} objects in the OmniCanvas stage</p>

        <p>Listened to {{ events.length }} events</p>

      </div>
    `,

    mixins: [apiMixin],

    data() {
      return {
        objectCount: 0,

        events: [],
      };
    },

    methods: {
      handleEvent(event) {
        this.events.push(event);

        if (event.name === 'rendered') {
          this.onOmniCanvasRendered();
        }
      },

      onOmniCanvasRendered() {
        this.getObjectCount();
      },

      getObjectCount() {
        console.log('checking...');
        this.iterator += 1;

        this.runQuery(
          'get',
          'canvas',
          'countObjects',
        );
      },

      onCountObjects(response) {
        console.log('count objects response', response);
        this.objectCount = response;
      },
    },

    mounted() {
      this.registerApiListeners(
        {
          eventHandler: this.handleEvent,
          countObjects: this.onCountObjects,
        }
      );
    }
  }
);