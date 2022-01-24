<template>
  <div class="editor">
    <div class="container">
      <div class="wrapper">
        <div class="node-editor" ref="nodeEditor"></div>
      </div>
      <canvas id="canvasOutput"></canvas>
    </div>
    <div class="dock" ref="dock" />
  </div>
</template>

<script>
import { NodeEditor, Engine } from "rete";
import ConnectionPlugin from "rete-connection-plugin";
import VueRenderPlugin from "rete-vue-render-plugin";
// import ContextMenuPlugin from "rete-context-menu-plugin";
import DockPlugin from "rete-dock-plugin";
import AreaPlugin from "rete-area-plugin";
import { GeneralComponents } from "../rete-components/general-comp";
import rainfallComps from "../rete-components/rainfall-comp";
import buncoComps from "../rete-components/bunco-comp";
import delimComps from "../rete-components/delim-comp";
import { Loop, ValueGenerator } from '../controls/objects';

export default {
  data() {
    return {
      editor: null,
    };
  },
  async mounted() {
    var container = this.$refs.nodeEditor;
    var dock = this.$refs.dock;
    var components = [
      ...GeneralComponents,
      ...delimComps,
      ...buncoComps,
      ...rainfallComps,
    ];

    var editor = new NodeEditor("demo@0.1.0", container);
    editor.use(ConnectionPlugin);
    editor.use(VueRenderPlugin);
    // editor.use(ContextMenuPlugin);
    editor.use(DockPlugin, {
      container: dock, // html element to which pseudo nodes will be added
      plugins: [VueRenderPlugin], // list with plugins for rendering
      itemClass: "dock-item", // by default: dock-item
    });
    editor.use(AreaPlugin);

    var engine = new Engine("demo@0.1.0");

    components.map((c) => {
      editor.register(c);
      engine.register(c);
    });

    var n1 = await components[0].createNode();
    // var n2 = await components[0].createNode({num: 0});
    // var add = await components[1].createNode();

    n1.position = [80, 200];
    // n2.position = [80, 400];
    // add.position = [500, 240];

    editor.addNode(n1);
    // editor.addNode(n2);
    // editor.addNode(add);

    // editor.connect(n1.outputs.get('num'), add.inputs.get('num'));
    // editor.connect(n2.outputs.get('num'), add.inputs.get('num2'));

    if (localStorage.editorSave) {
      await editor.fromJSON(JSON.parse(localStorage.editorSave));
    }

    editor.on(
      "process nodecreated noderemoved connectioncreated connectionremoved",
      async () => {
        await engine.abort();
        const json = editor.toJSON();
        localStorage.editorSave = JSON.stringify(json);
        await engine.process(json);
        editor.nodes.forEach(node => {
          const workerResults = node.data.workerResults;
          if (!workerResults) return;
          for (let [key, output] of node.outputs) {
            if (output.connections.length == 0) {
              const out = workerResults[key];
              if (!out) continue;
              if (out instanceof Loop) {
                out.ensureRun();
                // console.log(`Running loop ${key} for ${node.name}`);
              } else if (out instanceof ValueGenerator && !out.lazy) {
                // console.log(`Running gen ${key} for ${node.name}`);
                out.get();
              }
            }
          }
        });
        editor.nodes.forEach((node) => {
          if (!node.controls) return;
          for (let [key, value] of node.controls) {
            if (value.postProcess) value.postProcess();
          }
        });
      }
    );

    editor.view.resize();
    AreaPlugin.zoomAt(editor);
    editor.trigger("process");
  },
};
</script>

<style>
body {
  margin: 0;
}

.node-editor {
  text-align: left;
  height: 100vh;
  width: 100vw;
}

.node .control > input,
.node .input-control > input {
  width: 140px;
}

select,
input {
  width: 100%;
  border-radius: 30px;
  background-color: white;
  padding: 2px 6px;
  border: 1px solid #999;
  font-size: 110%;
  width: 170px;
}

.editor {
  display: flex;
  flex-wrap: nowrap;
  flex-direction: column;
  height: 100vh;
}

.dock {
  height: 100px;
  overflow-x: auto;
  overflow-y: hidden;
  white-space: nowrap;
  border-top: 1px solid black;
  padding-top: 2px;
  /* background: linear-gradient(0deg,#ddd 90%,transparent); */
  /* opacity: 0.7; */
}

.dock-item {
  display: inline-block;
  vertical-align: top;
  transform: scale(0.8);
  transform-origin: 50% 0;
}

.container {
  flex: 1;
  overflow: hidden;
}

.socket.number-value {
  background: #3647df;
}

.socket.list-value {
  background: #c4021c;
}

.socket.loop-value {
  background: #c9c616;
}

.socket.predicate-value {
  background: #30810d;
}

.socket.string-value {
  background: #490d81;
}

.socket.boolean-value {
  background: #42b112;
}
</style>
