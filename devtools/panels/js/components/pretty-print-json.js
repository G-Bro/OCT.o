Vue.component(
  'pretty-print-json',
  {
    template: `
      <div class="d-inline-block pretty-print">
        {
        <div v-for="(key, i) in keys" :key="i" :style="style">
          <p class="d-inline-block mb-0">"{{ key }}":</p>

          <pretty-print-json
            v-if="isObject(object[key])"
            :object="object[key]"
            :indent="indent + 1"
          />
          <p
            class="d-inline-block data mb-0"
            v-else
            :class="getDataType(object[key])"
          >
            {{ formatValue(object[key]) }}
          </p>
        </div>
        }
      </div>
    `,

    props: {
      object: Object,

      indent: {
        type: Number,
        default: 1,
      },
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
    },
  },
);