Vue.component(
  'oct-row',
  {
    template: `
      <div
        class="oct-row"
        :class="{
          even: index % 2,
          odd: index % 2 === 0,
          'row-grid': grid
        }"
      >
        <slot />
        <template v-if="grid">
          <div class="row-grid-left" v-if="$slots.image">
            <slot name="image" />
          </div>
          <div class="row-grid-header">
            <slot name="header" />
          </div>
          <div class="row-grid-footer" v-if="$slots.image">
            <slot name="footer"/>
          </div>
        </template>
      </div>
    `,

    props: {
      index: Number,
      grid: Boolean
    },
  }
)