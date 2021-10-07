Vue.component(
  'omnicanvas-debug',
  {
    template:
    `
      <div class="grid">
        <div class="grid-header">
          <h1>OmniTool</h1>
          <button @click="getObjectCount">Re-fetch</button>
          <button @click="toggleDevTools">Toggle dev visualiser</button>
          <button @click="saveState">Save state</button>
          <button v-if="savedState" @click="restoreState">Restore state</button>
        </div>

        <div class="grid-left-column">

          <p>There are {{ objectCount }} objects in the OmniCanvas stage</p>

          <omnicanvas-object
            v-for="(object, key) in objects"
            :key="key"
            :object="object"
            :active="activeElementId === object.id"
            @click="onClickObject(object)"
          />

        </div>

        <div class="grid-right-column">

          <omnicanvas-object-details
            v-if="selectedObject"
            :object="selectedObject"
          />

        </div>

        <div class="grid-footer">
          Footer?
        </div>
      </div>
    `,

    data() {
      return {
        objectCount: 0,
        objects: [],

        activeElementId: 0,

        selectedObject: null,

        savedState: null,
      };
    },

    methods: {
      getObjectCount() {
        console.log('checking...');
        this.iterator += 1;

        browser.devtools.inspectedWindow.eval(
          "studioCanvas.getObjects().length",
          (result, isException) => {
            if (isException) {
              console.log("Undefined studioCanvas");
            } else {
              this.objectCount = result;

              this.fetchObjectData();

              this.getActiveElementId();
            }
          }
        );
      },

      fetchObjectData() {
        const objects = [];
        for (let i = 0; i < this.objectCount; ++i) {
          const object = new OmniCanvasObject(i);
          objects.push(object);
        }

        this.objects = objects;
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

      getActiveElementId() {
        browser.devtools.inspectedWindow.eval(
          "studioCanvas.activeEl.id",
          (result, isException) => {
            if (isException) {
              console.log("Could not find active element");
            }

            this.activeElementId = result;
          }
        );
      },

      onClickObject(object) {
        console.log('selecting object', object);

        this.selectedObject = object;
      },

      saveState() {
        browser.devtools.inspectedWindow.eval(
          "JSON.stringify(studioCanvas.stageToTemplate())",
          (result, isException) => {
            if (isException) {
              console.log("Could not save state");
            }

            console.log(result);

            this.savedState = result;
          }
        );
      },

      restoreState() {
        browser.devtools.inspectedWindow.eval(
          `studioCanvas.fromTemplate(${this.savedState}, true)`,
          (result, isException) => {
            if (isException) {
              console.log("Could not restore state");
            }

            console.log(result);

            this.getObjectCount();
          }
        );
      },
    },

    mounted() {
      browser.runtime.sendMessage(
        {
          type: 'get',
          fields: ['objectCount'],
        },
        (response) => {
          this.objectCount = response.objectCount;
        }
      );
    }
  }
);