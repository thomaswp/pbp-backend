<template>
<input
  type="number"
  :readonly="readonly"
  :value="value"
  @input="change($event)"
  @dblclick.stop=""
  @pointerdown.stop=""
  @pointermove.stop=""
/>
</template>

<script>
export default {
  props: ['readonly', 'emitter', 'ikey', 'getData', 'putData', 'defaultValue'],
  data() {
    return {
      value: this.defaultValue,
    }
  },
  methods: {
    change(e){
      this.value = +e.target.value;
      this.update();
    },
    update() {
      if (this.ikey) {
        // console.log(this.ikey, this.value);
        this.putData(this.ikey, this.value);
      }
      this.emitter.trigger('process');
    }
  },
  mounted() {
    this.value = this.getData(this.ikey) | this.defaultValue;
    this.putData(this.ikey, this.value);
  }
}
</script>
