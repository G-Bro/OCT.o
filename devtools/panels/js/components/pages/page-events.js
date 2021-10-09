Vue.component(
  'page-events',
  {
    template: `
      <div class="page-grid">
        <div class="grid-left-column">
          <div class="p-2">
            <h3 class="d-inline-block">
              <b>
                {{ events.length }}
              </b>
              event(s) recorded
            </h3>
            <div class="d-inline-block float-right">
              <oct-button
                colour="red"
                img="./icons/bin_x64.png"
                @click="clearHistory"
              />
            </div>
          </div>
          <div class="events-list" ref="eventsList" @scroll="onEventsScroll">
            <oct-row
              v-for="(event, i) in events"
              :key="i"
              :index="i"
            >
              <div>
                <div class="px-3 d-inline-block">
                  <h3 class="mb-0 d-inline-block cyan">{{ i }}: {{ event.name }}</h3>
                  <p class="d-inline-block">››</p>
                  <p class="d-inline-block">event details will go here</p>
                </div>
                <div class="px-3 float-right d-inline-block">
                  <p class="purple-bg white bold tag"><small>5.6ms</small></p>
                </div>
              </div>
            </oct-row>
          </div>

          <div
            class="align-right"
            v-if="!autoScroll"
          >
            <oct-button
              @click="scrollToBottom"
            >
              Scroll to bottom
            </oct-button>
          </div>
        </div>
      </div>
    `,

    mixins: [apiMixin],

    data() {
      return {
        objectCount: 0,

        events: [],

        autoScroll: true,
      };
    },

    computed: {
      eventsList() {
        return this.$refs.eventsList;
      }
    },

    methods: {
      handleEvent(event) {
        this.events.push(event);

        // if (event.name === 'rendered') {
        //   this.onOmniCanvasRendered();
        // }

        if (this.autoScroll) {
          this.scrollToBottom();
        }
      },

      scrollToBottom() {
        this.eventsList.scrollTop = this.eventsList.scrollHeight;
      },

      // onOmniCanvasRendered() {
      //   this.getObjectCount();
      // },

      // getObjectCount() {
      //   console.log('checking...');
      //   this.iterator += 1;

      //   this.runQuery(
      //     'get',
      //     'canvas',
      //     'countObjects',
      //   );
      // },

      // onCountObjects(response) {
      //   console.log('count objects response', response);
      //   this.objectCount = response;
      // },

      onEventsScroll(e) {
        const distanceToBottom = this.eventsList.scrollHeight - this.eventsList.scrollTop - this.eventsList.offsetHeight;

        if (distanceToBottom < 100) {
          this.autoScroll = true;
        } else {
          this.autoScroll = false;
        }
      },

      clearHistory() {
        this.events = [];
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