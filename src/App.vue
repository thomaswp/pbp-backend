<template>
  <!-- <img alt="Vue logo" src="./assets/logo.png"> -->
  <Editor />
  <CodeEditor 
    v-if="showModal"
    :data="editorData"
    @close="showModal = false" 
  />
</template>

<script>
import Editor from './components/Editor.vue'
import CodeEditor from './components/CodeEditor.vue'
import eventBus from './eventBus'

export default {
  name: 'App',
  components: {
    Editor,
    CodeEditor,
  },
  data() {
    return {
      showModal: false,
      editorData: {},
    };
  },
  mounted() {
    eventBus.$on('showCodeEditor', (data) => {
      console.log(data);
      this.editorData = data;
      this.showModal = true;
    });
  },
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  /* margin-top: 60px; */
}
</style>
