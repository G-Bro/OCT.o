Vue.component(
  'page-states',
  {
    template: `
    <div class="page-grid">
      <div class="grid-left-column">
        <div>
          <oct-row
            v-for="(state, i) in savedStates"
            :key="i"
            :index="i"
            grid
          >
            <template #image>
              <img class="state-preview" :src="state.thumbnail" />
            </template>
            <template #header>
              <p>Key: {{ i }}</p>
            </template>
            <template #footer>
              <div class="align-right">
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
            </template>
          </oct-row>
        </div>
      </div>
      <div class="grid-right-column">
        <div class="align-right">
          <oct-button img="./icons/save_x64.png" @click="saveState">Save state</oct-button>
        </div>
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

        chromeCompatibilityMode,
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
      },

      deleteState(state, index) {
        this.savedStates.splice(index, 1);
      },

      onReceiveState(response) {
        this.savedStates.push(response);
      },

      inspectState(state, index) {
        this.inspectedState = state;
      },
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