/**
 * 
 * Author: T.Zhang
 * 2022-10 in Tianjin.
 */

/**
 * codemirror(api) document reference
 */
 var cm = null; 

 /**
  * code mirror api: https://codemirror.net/doc/manual.html
  * code mirror on github: https://github.com/codemirror/codemirror
  * this codemirror plugin is used as a template: https://github.com/laurent22/joplin/tree/80b16dd17e227e3f538aa221d7b6cc2d81688e72/packages/app-cli/tests/support/plugins/codemirror_content_script
  * @param {CodeMirror} CodeMirror 
  * @param {*} _context send message to the controller.
  */
 function plugin(CodeMirror, _context) {

     /**
      * toggle format painter is the function which can switch up the painter.
      */
     CodeMirror.defineExtension('toggleReadonly', 
     /**
      * initializing the painter with joplin command.
      * @param {boolean} enable to tell the plugin toggle on/off
      */
     function( enable ) {
        cm = this;
        console.log('codemirror command get:' + enable);
        cm.setOption('readOnly', enable);
     });
 
 }

 
 

 module.exports = {
     default: function(_context) { 
         return {
             plugin: function(CodeMirror) {
                 return plugin(CodeMirror, _context);
             }
         }
     }
 }