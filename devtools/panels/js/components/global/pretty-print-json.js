Vue.component(
  'pretty-print-json-row',
  {
    template: `
      <div class="pretty-print-row">
        <div>
          <div class="caret-column">
            <a
              href="#"
              @click.prevent="open = !open"
              v-if="isObject(value) && keys.length"
              class="caret"
              :class="{ open }"
            >
              ‣
            </a>
          </div>
          <p class="d-inline-block mb-0 data-key">{{ property }}:</p>

          <p
            v-if="!isObject(value)"
            class="d-inline-block mb-0 data"
            :class="getDataType(value)"
          >
            {{ formatValue(value) }}
          </p>
          <p
            v-else
            class="d-inline-block mb-0 data"
          >
            Object
          </p>
        </div>
        <pretty-print-json
          v-if="isObject(value) && open"
          :object="value"
        />
      </div>
    `,

    props: {
      property: {},
      value: {},
    },

    data() {
      return {
        open: false,
      };
    },

    computed: {
      keys() {
        return Object.keys(this.value);
      },
    },

    methods: {
      isObject(value) {
        return typeof value === 'object';
      },

      getDataType(value) {
        return typeof value;
      },

      formatValue(value) {
        if (typeof value === 'string') {
          if (value.length > 60) {
            return `"${value.substring(0, 57)}..."`;
          }

          return `"${value}"`;
        }

        return value;
      },

    },

    watch: {
      open() {
        if (this.open) {
          this.$emit('open');
        } else {
          this.$emit('closed');
        }
      }
    }
  }
);

Vue.component(
  'pretty-print-json',
  {
    template: `
      <div class="pretty-print">
        <div class="d-inline-block" :style="style">
          <div v-for="(key, i) in keys" :key="i">
            <pretty-print-json-row
              :property="key"
              :value="object[key]"
              @open="open(i)"
              @close="close(i)"
            />
          </div>
        </div>
      </div>
    `,

    props: {
      object: Object,

      indent: {
        type: Number,
        default: 1,
      },
    },

    data() {
      return {
        openedObjects: {},
      };
    },

    computed: {
      keys() {
        return Object.keys(this.object);
      },
      style() {
        return {
          'margin-left': `${this.indent * 20}px`
        };
      },
    },

    methods: {
      isObject(value) {
        return typeof value === 'object';
      },

      formatValue(value) {
        if (typeof value === 'string') {
          if (value.length > 60) {
            return `"${value.substring(0, 57)}..."`;
          }

          return `"${value}"`;
        }

        return value;
      },

      getDataType(value) {
        return typeof value;
      },

      open(i) {
        this.openedObjects[i] = true;

        this.openedObjects = Object.assign({}, this.openedObjects);
      },

      close(i) {
        this.openedObjects[i] = false;

        this.openedObjects = Object.assign({}, this.openedObjects);
      },
    },
  },
);