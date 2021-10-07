Vue.component(
  'omnicanvas-object',
  {
    props: {
      object: Object,

      active: Boolean,
    },

    template:
    `
      <div class="object-row" @click="$emit('click')">
        <img
          v-if="object.preview"
          class="d-inline-block"
          :src="object.preview"
        />
        <p class="d-inline-block">
          {{ object.index }} : {{ object.className }}
        </p>

        <span class="badge cyan-bg" v-if="active">
          Active element
        </span>
      </div>
    `,
  }
);

Vue.component(
  'omnicanvas-object-details',
  {
    props: {
      object: Object,

      active: Boolean,
    },

    template:
    `
      <pretty-print-json
        :object="object.delta"
      />
    `,
  }
);