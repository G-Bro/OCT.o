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
          <div class="chart-row">
            <div id="chartContainer"></div>
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
                  <p class="purple-bg white w-bold tag"><small>5.6ms</small></p>
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

        batchedEvents: [],

        autoScroll: true,

        chart: null,
        chartIndex: 30,

        intervalDuration: 1000,
        intervalData: 0,
        intervalTimeout: null,
      };
    },

    computed: {
      eventsList() {
        return this.$refs.eventsList;
      }
    },

    methods: {
      handleEvent(event) {
        this.batchedEvents.push(event);

        // if (event.name === 'rendered') {
        //   this.onOmniCanvasRendered();
        // }

        if (this.autoScroll) {
          this.scrollToBottom();
        }

        this.intervalData += 1;
      },

      scrollToBottom() {
        this.eventsList.scrollTop = this.eventsList.scrollHeight;
      },

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

      beginInterval() {
        this.intervalTimeout = setInterval(
          () => {
            console.log(this.intervalData);

            this.chart.addDataPoint(this.chartIndex.toString(), [this.intervalData]);
            this.intervalData = 0;
            this.chartIndex += 1;
            this.chart.removeDataPoint(0);

            this.events = this.events.concat(this.batchedEvents);
            this.batchedEvents = [];
          },
          this.intervalDuration
        );
      },

      initialiseChart() {
        const prefilledLabels = [];
        const prefilledData = [];
        for (i = 0; i < 30; ++i) {
          prefilledLabels[i] = "0";
          prefilledData[i] = 0;
        }

        const data = {
          labels: prefilledLabels,
          datasets: [
            {
              name: 'Events',
              type: 'line',
              values: prefilledData,
            }
          ],
        };

        this.chart = new frappe.Chart(
          '#chartContainer',
          {
            title: 'Events per second',
            data: data,
            type: 'line',
            height: 200,
            lineOptions: {
              regionFill: 1,
              hideDots: 1,
              spline: 1,
            },
            axisOptions: {
              xAxisMode: 'tick',
              yAxisMode: 'tick',
            },
            yMarkers: [
              {
                label: 'Warning',
                value: 60
              }
            ],
          }
        )
      },
    },

    mounted() {
      this.registerApiListeners(
        {
          onConnect: this.onPortConnect,
          onDisconnect: this.onPortDisconnect,
          eventHandler: this.handleEvent,
          countObjects: this.onCountObjects,
        }
      );

      this.beginInterval();

      this.initialiseChart();
    },

    beforeDestroy() {
      this.endInterval();
    }
  }
);