Vue.component(
  'page-states',
  {
    template: `
    <div class="page-grid">
      <div class="grid-left-column">
        <div>
          <oct-button img="./icons/save_x64.png" @click="saveState">Save state</oct-button>

          <oct-row v-for="(state, i) in savedStates" :key="i" class="row-grid">
            <div class="row-grid-left">
              <img class="state-preview" :src="state.thumbnail" />
            </div>
            <div class="row-grid-header">
              <p>Key: {{ i }}</p>
            </div>
            <div class="row-grid-footer">
              <oct-button
                colour="purple"
                img="./icons/restore_x64.png"
                @click="restoreState(state)"
              />
              <oct-button
                colour="red"
                img="./icons/bin_x64.png"
                @click="deleteState(state, i)"
              />
              <oct-button
                colour="yellow"
                img="./icons/json_x64.png"
                @click="inspectState(state, i)"
              />
            </div>
          </oct-row>
        </div>
      </div>
      <div class="grid-right-column">
        <div v-if="inspectedState">
          {{ inspectedState.template }}
        </div>
      </div>
    </div>
    `,

    mixins: [apiMixin],

    data() {
      return {
        savedStates: [],

        inspectedState: null,
      }
    },

    methods: {
      saveState() {
        this.runQuery(
          'get',
          'canvas',
          'stageToTemplate',
        );
      },

      restoreState(state) {
        this.runQuery(
          'post',
          'canvas',
          'fromTemplate',
          [JSON.stringify(state.template), true],
        );

        // browser.devtools.inspectedWindow.eval(
        //   `studioCanvas.fromTemplate(${this.savedState}, true)`,
        //   (result, isException) => {
        //     if (isException) {
        //       console.log("Could not restore state");
        //     }

        //     console.log(result);
        //   }
        // );
      },

      deleteState(state, index) {
        this.savedStates.splice(index, 1);
      },

      onReceiveState(response) {
        console.log(response);

        this.savedStates.push(response);
      },

      inspectState(state, index) {
        this.inspectedState = state;
      }
    },

    mounted() {
      this.registerApiListeners(
        {
          stageToTemplate: this.onReceiveState,
        }
      );
    }
  }
);