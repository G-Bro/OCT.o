Vue.component(
  'shell',
  {
    template:
    `
      <div class="grid">
        <div class="grid-header">
          <h1>OmniTool</h1>
          <oct-button @click="getObjectCount">Re-fetch</oct-button>
          <oct-button @click="toggleDevTools">Toggle dev visualiser</oct-button>
          <oct-button @click="saveState">Save state</oct-button>
          <oct-button v-if="savedState" @click="restoreState">Restore state</oct-button>
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

          <p>Listened to {{ events.length }} events</p>

        </div>

        <div class="grid-right-column">

          <omnicanvas-object-details
            v-if="selectedObject"
            :object="selectedObject"
          />

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

        events: [],

        api: {
          canvas: {
            countObjects: {
              handler: (e) => {
                console.log(e, this);
                this.objectCount = e;
              }
            }
          }
        },
      };
    },

    methods: {
      getObjectCount() {
        console.log('checking...');
        this.iterator += 1;

        browser.runtime.sendMessage({
          type: 'get',
          subject: 'canvas',
          method: 'countObjects'
        });
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
      console.log('mounted');
      const port = browser.runtime.connect(null, { name: "octo-panel" });
      port.onMessage.addListener((message) => {
        console.log(message);

        if (message.request && message.response) {
          console.log(this.api);
          const subject = message.request.subject;
          const method = message.request.method;

          if (this.api[subject] && this.api[subject][method]) {
            this.api[subject][method].handler(message.response, message.request);
          }
        }
      });
    }
  }
);