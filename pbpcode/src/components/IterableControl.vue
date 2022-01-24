<template>
<div class="iterable-control">
  <div
    v-for="(item, index) in initValue"
    :key="index + '_' + item"
    :class="'list-element-wrapper ' + (horizontal ? 'h' : 'v')"
  >
    <iterable-control
      v-if="Array.isArray(item)"
      :index="index"
      :readonly="readonly"
      :initValue="item"
      :horizontal="!horizontal"
      @updated="update"
    />
    <list-control-element
      v-else
      :index="index"
      :readonly="readonly"
      :initValue="item"
      :horizontal="horizontal"
      @updated="update"
    />
  </div>
</div>
</template>

<script>
import ListControlElement from './ListControlElement.vue';

export default {
  props: ['readonly', 'horizontal', 'index', 'initValue'],
  components: {
    ListControlElement,
  },
  data() {
    return {
      // value: this.initValue,
      setID: 0,
    }
  },
  methods: {
    update(index, value) {
      const list = this.initValue.slice();
      // console.log('Update iterable', this.value, index, value);
      if (index >= 0 && index < list.length) {
        list[index] = value;
      }
      this.$emit('updated', this.index, list);
    },
    refresh() {
      // Refreshes the array (e.g. when it get set)
      // so it will re-render
      this.setID++;
    }
  },
  mounted() {
  },
}
</script>
<style scoped>
  .iterable-control {
    max-width: 170px;
    max-height: 100px;
    overflow-x: auto;
    overflow-y: auto;
    white-space: nowrap;
  }
  .list-element-wrapper {
    padding: 0;
  }
  .list-element-wrapper.h {
    display: inline-block;
  }
</style>
