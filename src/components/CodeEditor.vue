<template>
  <transition name="modal">
    <div class="modal-mask">
      <div class="modal-wrapper">
        <div class="modal-container">

          <div class="modal-header">
            <slot name="header">
              {{ data ? data.type : '' }}
            </slot>
          </div>

          <div class="modal-body">
            <v-ace-editor
              v-model:value="code"
              @init="editorInit"
              lang="javascript"
              theme="chrome"
              style="height: 300px"
            />
          </div>

          <div class="modal-footer">
            <slot name="footer">
              default footer
              <button class="modal-default-button" @click="$emit('close')">
                OK
              </button>
            </slot>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
import { VAceEditor } from 'vue3-ace-editor';
import ace from 'ace-builds';
import 'ace-builds/src-noconflict/mode-javascript';
import 'ace-builds/src-noconflict/theme-chrome';
import workerJsonUrl from 'file-loader?esModule=false!ace-builds/src-noconflict/worker-javascript.js';

ace.config.setModuleUrl('ace/mode/javascript_worker', workerJsonUrl);

function set_readonly(editor,readonly_ranges) {
      var session  = editor.getSession(),
          Range    = ace.Range,
          ranges    = [];

      function before(obj, method, wrapper) {
        var orig = obj[method];
        obj[method] = function() {
          var args = Array.prototype.slice.call(arguments);
          return wrapper.call(this, function(){
              return orig.apply(obj, args);
          }, args);
        }
        return obj[method];
      }
      function intersects(range) {
          return editor.getSelectionRange().intersects(range);
      }
      function intersectsRange(newRange) {
        for (let i=0;i<ranges.length;i++)
          if(newRange.intersects(ranges[i]))
            return true;
        return false;
      }
      function preventReadonly(next, args) {
          for(let i=0;i<ranges.length;i++){if (intersects(ranges[i])) return;}
          next();
      }
      function onEnd(position){
        var row = position["row"],column=position["column"];
        for (let i=0;i<ranges.length;i++)
          if(ranges[i].end["row"] == row && ranges[i].end["column"]==column)
            return true;
        return false;
      }
      function outSideRange(position){
        var row = position["row"],column=position["column"];
        for (let i=0;i<ranges.length;i++){
          if(ranges[i].start["row"]< row && ranges[i].end["row"]>row)
              return false;
          if(ranges[i].start["row"]==row && ranges[i].start["column"]<column){
              if(ranges[i].end["row"] != row || ranges[i].end["column"]>column)
                return false;
          }
          else if(ranges[i].end["row"] == row&&ranges[i].end["column"]>column){
                return false;
          }
        }
        return true; 
      }
      for(let i=0;i<readonly_ranges.length;i++){
        ranges.push(new Range(...readonly_ranges[i]));
      }
      ranges.forEach(function(range){session.addMarker(range, "readonly-highlight");});
      session.setMode("ace/mode/javascript");
      editor.keyBinding.addKeyboardHandler({
          handleKeyboard : function(data, hash, keyString, keyCode, event) {
            if (Math.abs(keyCode) == 13 && onEnd(editor.getCursorPosition())){
              return false;
            }
            if (hash === -1 || (keyCode <= 40 && keyCode >= 37)) return false;
            for(let i=0;i<ranges.length;i++){
              if (intersects(ranges[i])) {
                  return {command:"null", passEvent:false};
              }
            }
          }
      });
      before(editor, 'onPaste', preventReadonly);
      before(editor, 'onCut',   preventReadonly);
      for(let i=0;i<ranges.length;i++){
        ranges[i].start  = session.doc.createAnchor(ranges[i].start);
        ranges[i].end    = session.doc.createAnchor(ranges[i].end);
        ranges[i].end.$insertRight = true;
       }

      var old$tryReplace = editor.$tryReplace;
      editor.$tryReplace = function(range, replacement) {
          return intersectsRange(range)?null:old$tryReplace.apply(this, arguments);                        
      }
      session = editor.getSession();
      var oldInsert = session.insert;
      session.insert = function(position, text) {
          return oldInsert.apply(this, [position, outSideRange(position)?text:""]);
      }
      var oldRemove = session.remove;
      session.remove = function(range) {
          return intersectsRange(range)?false:oldRemove.apply(this, arguments);                        
      }
      var oldMoveText = session.moveText;
      session.moveText = function(fromRange, toPosition, copy) {
          if (intersectsRange(fromRange) || !outSideRange(toPosition)) return fromRange;
          return oldMoveText.apply(this, arguments);
      }

}
function refresheditor(id,content,readonly) {
      var temp_id=id+'_temp';
      document.getElementById(id).innerHTML="<div id='"+temp_id+"'></div>";
      document.getElementById(temp_id).innerHTML=content;
      var editor     = ace.edit(temp_id);
      set_readonly(editor,readonly);

}

function readonly_lines(editor,line_numbers){
  var readonly_ranges=[];
  line_numbers.sort();
 
  for(let i=0;i<line_numbers.length;i++){
    readonly_ranges.push([line_numbers[i]-1,0,line_numbers[i],0]);
  }
  set_readonly(editor, readonly_ranges);
  // refresheditor(id,content,readonly_ranges);
}

export default {
  props: ["data"],
  components: {
    VAceEditor,
  },
  data() {
    return {
      code: "",
    }
  },
  computed: {
    startingLines() {
      return this.data.template.split(/\r?\n/g);
    },
    readOnlyStartingLines() {
      let lines = this.startingLines;
      let readOnly = [];
      for (let i = 0; i < lines.length; i++) {
        let line = lines[i];
        line = line.trim();
        if (line.endsWith("// Solution")) {
          continue;
        }
        readOnly.push(i + 1);
      }
      console.log("readonly", readOnly);
      return readOnly;
    },
    startingCode() {
      let readOnly = this.readOnlyStartingLines;
      let lines = this.startingLines;
      // console.log(lines);
      for (let i = 0; i < lines.length; i++) {
        let line = lines[i];

        if (!(readOnly.includes(i+1))) {
          let start = line.search(/\S/);
          line = line.substring(0, start);
          console.log(line, start);
        }
        lines[i] = line;
      }
      let code = lines.join("\n");
      console.log('Code:', code);
      return code;
    },
  },
  methods: {
    editorInit(e) {
      console.log('init', e);
      e.setValue(this.startingCode, -1);
      readonly_lines(e, this.readOnlyStartingLines);
    }
  },
  mounted() {

    function toJavaScript(object) {
      // if (object instanceof Loop) object = object.toList();
      return JSON.stringify(object);
    }
    // import template from '!raw-loader!./assets/templates/sum.js';
    // console.log(template);

  }
}
</script>
<style>
.readonly-highlight{
    background-color: rgb(0, 26, 110);
    opacity: 0.1;
    position: absolute;
}
</style>
<style scoped>

.modal-mask {
  position: fixed;
  z-index: 9998;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: table;
  transition: opacity 0.3s ease;
}

.modal-wrapper {
  display: table-cell;
  vertical-align: middle;
}

.modal-container {
  width: 80%;
  margin: 0px auto;
  padding: 20px 30px;
  background-color: #fff;
  border-radius: 2px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.33);
  transition: all 0.3s ease;
  font-family: Helvetica, Arial, sans-serif;
}

.modal-header h3 {
  margin-top: 0;
  color: #42b983;
}

.modal-body {
  margin: 20px 0;
}

.modal-default-button {
  float: right;
}
</style>