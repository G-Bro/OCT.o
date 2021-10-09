Vue.component(
  'shell',
  {
    template:
    `
      <div class="grid dark">
        <div class="grid-header header mb-3">
          <div class="grid-left-column">
            <img class="d-inline-block" src="./../resources/logo-x64.png" />
          </div>

          <div class="grid-right-column align-right">
            <div class="nav-block clickable" :class="{active: activeStage === 'page-stage'}" @click="setStage('stage')">Stage</div>
            <div class="nav-block clickable" :class="{active: activeStage === 'page-objects'}" @click="setStage('objects')">Objects</div>
            <div class="nav-block clickable" :class="{active: activeStage === 'page-events'}" @click="setStage('events')">Events</div>
            <div class="nav-block clickable" :class="{active: activeStage === 'page-states'}" @click="setStage('states')">States</div>
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