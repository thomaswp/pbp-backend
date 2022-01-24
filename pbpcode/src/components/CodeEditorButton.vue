<template>
<button id="show-modal" @click="showCodeEditor">Edit</button>
</template>

<script>

import eventBus from '../eventBus'

export default {
  props: ['type', 'inputs'],
  data() {
    return {
      template: "",
    }
  },
  methods: {
    showCodeEditor() {
      eventBus.$emit('showCodeEditor', {
        type: this.type, 
        template: this.template,
        inputs: this.inputs,
      });
    }
  },
  async mounted() {
    const request = await fetch(`./templates/${this.type}.js`);
    const template = await request.text();
    this.template = template;
  }
}
</script>
