Vue.component(
  'oct-button',
  {
    template: '<a class="oct-button" href="#" @click.prevent="$emit(\'click\')"><slot /></a>'
  }
)