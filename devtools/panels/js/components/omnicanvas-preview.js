Vue.component(
  'omnicanvas-preview',
  {
    template:
    `
      <img v-if="thumbnailSrc" :src="thumbnailSrc" />
    `,

    data() {
      return {
        thumbnailSrc: null,
      };
    },

    methods: {
      updatePreview() {
        browser.devtools.inspectedWindow.eval(
          "studioCanvas.export('image/webp', 0.92)",
          (result, isException) => {
            if (isException) {
              console.log("Could not toggle debugMode");
            }

            this.thumbnailSrc = result;
          }
        );
      },
    },

    mounted() {
      this.updatePreview();
    },
  }
)