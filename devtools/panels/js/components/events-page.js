Vue.component(
  'events-page',
  {
    template: `
      <div>
        <p>Event count {{ events.length }}</p>
        <event
          v-for="(event, i) in events"
          :key="i"
          :event="event"
        />
      </div>
    `,

    data() {
      return {
        events: [],
      };
    },

    mounted() {
      console.log('mounted');
      const port = browser.runtime.connect(null, { name: "octo-panel" });
      port.onMessage.addListener((message) => {
        if (message.type === 'event') {
          message.event.timestamp = Date.now().toLocaleString('en-GB');
          this.events.push(message.event);
        }
        console.log(message);
      });
    }
  },
);

Vue.component(
  'event',
  {
    template: `
      <div>
        <p>event: {{ event.name }}</p>
      </div>
    `,

    props: {
      event: Object,
    },
  },
);

