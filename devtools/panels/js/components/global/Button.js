Vue.component(
  'oct-button',
  {
    template: `
      <a
        class="oct-button clickable"
        href="#"
        @click.prevent="$emit(\'click\')"
        :class="colourClass"
      >
        <img class="icon" v-if="img" :src="img" />
        <slot />
      </a>
    `,

    props: {
      colour: {
        type: String,
        default: 'cyan',
      },

      img: {
        type: String,
      }
    },

    computed: {
      colourClass() {
        return `${this.colour}-bg`;
      }
    },
  },

)