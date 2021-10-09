Vue.component(
  'shell',
  {
    template:
    `
      <div class="grid dark">
        <div class="grid-header">
          <div class="grid-left-column">
            <img class="d-inline-block" src="./../resources/logo-x64.png" />
            <h1 class="d-inline-block">OCTO</h1>
          </div>

          <div class="grid-right-column">
            <oct-button @click="setStage('stage')">Stage</oct-button>
            <oct-button @click="setStage('objects')">Objects</oct-button>
            <oct-button @click="setStage('events')">Events</oct-button>
            <oct-button @click="setStage('states')">States</oct-button>
            <oct-button @click="toggleDevTools">Toggle dev visualiser</oct-button>
          </div>
        </div>

        <div class="grid-body">
          <keep-alive>
            <component
              :is="activeStage"
            />
          </keep-alive>
        </div>
      </div>
    `,

    mixins: [apiMixin],

    data() {
      return {
        activeStage: 'page-states',
      };
    },

    methods: {
      setStage(stage) {
        this.activeStage = `page-${stage}`;
      },

      toggleDevTools() {
        browser.devtools.inspectedWindow.eval(
          "studioCanvas.params.debugMode = !studioCanvas.params.debugMode; studioCanvas.render()",
          (result, isException) => {
            if (isException) {
              console.log("Could not toggle debugMode");
            }
          }
        );
      },
    },
  }
);