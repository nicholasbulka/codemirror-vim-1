import { basicSetup, EditorState } from '@codemirror/basic-setup';
import { EditorView, highlightActiveLine } from '@codemirror/view';
import { javascript } from '@codemirror/lang-javascript';
import { xml } from '@codemirror/lang-xml';
import { vim } from "../src/"

import * as commands from "@codemirror/commands";
(window as any)._commands = commands;

const doc = `
import { basicSetup, EditorState } from '@codemirror/basic-setup';
import { EditorView } from '@codemirror/view';
import { javascript } from '@codemirror/lang-javascript';
import { vim } from "../src/"

const doc = \`
console.log('hi')
\`

new EditorView({
  state: EditorState.create({
    doc,
    extensions: [vim(), basicSetup, javascript()],
  }),
  parent: document.querySelector('#editor'),
});

`;


let wrapCheckbox = document.getElementById("wrap") as HTMLInputElement
wrapCheckbox.checked = localStorage.wrap == "true"
wrapCheckbox.onclick = function() {
  updateView();
  localStorage.wrap = wrapCheckbox.checked;
}
let htmlCheckbox = document.getElementById("html") as HTMLInputElement
htmlCheckbox.checked = localStorage.html == "true"
htmlCheckbox.onclick = function() {
  updateView();
  localStorage.html = htmlCheckbox.checked;
}
let statusBox = document.getElementById("status") as HTMLInputElement
statusBox.checked = localStorage.status == "true"
statusBox.onclick = function() {
  updateView();
  localStorage.status = statusBox.checked;
}


let view
function updateView() {
  if (view) view.destroy()
  view = (window as any)._view = new EditorView({
    state: EditorState.create({
      doc: htmlCheckbox.checked ? document.documentElement.outerHTML : doc,
      extensions: [
        // make sure vim is included before all other keymaps
        vim({status: statusBox.checked}), 
        // include the default keymap and all other keymaps you want to use in insert mode
        basicSetup,
        htmlCheckbox.checked ? xml(): javascript(), 
        highlightActiveLine(),
        wrapCheckbox.checked && EditorView.lineWrapping,
      ].filter(Boolean),
    }),
    parent: document.querySelector('#editor'),
  });
}


updateView()