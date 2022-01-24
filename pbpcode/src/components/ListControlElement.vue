<template>
<input
  type="text"
  size="1"
  class="list-element"
  ref="input"
  :readonly="readonly"
  :value="value"
  @input="change($event)"
/>
</template>

<script>
export default {
  props: ['readonly', 'initValue', 'index', 'horizontal'],
  data() {
    // console.log(this.initValue);
    return {
      value: this.initValue,
    }
  },
  methods: {
    change(e){
      this.value = e.target.value;
      this.update();
    },
    update() {
      this.$emit('updated', this.index, this.value);
      this.resize();
    },
    resize() {
      if (this.value == null) return;
      this.$refs.input.style.width = (this.value.toString().length * 0.6) + "em";
    },
  },
  mounted() {
    this.resize();
  }
}
</script>
<style scoped>
    .list-element:read-only {
      background-color: #ddd;
      cursor: default;
    }
    .list-element {
      padding: 1px;
      border: 1px solid black;
      margin: 0px;
      border-radius: 0;
      width: auto;
      max-width: 90%;
      min-width: 1em;
    }
</style>
