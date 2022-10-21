/**
 * 
 * Author: T.Zhang
 * 2022-10 in Tianjin.
 */

/**
 * codemirror(api) document reference
 */
 var cm = null; 
 var is_readonly = false;
 document.addEventListener('focus', set_readonly);
 /**
  * code mirror api: https://codemirror.net/doc/manual.html
  * code mirror on github: https://github.com/codemirror/codemirror
  * this codemirror plugin is used as a template: https://github.com/laurent22/joplin/tree/80b16dd17e227e3f538aa221d7b6cc2d81688e72/packages/app-cli/tests/support/plugins/codemirror_content_script
  * @param {CodeMirror} CodeMirror 
  * @param {*} _context send message to the controller.
  */
 function plugin(CodeMirror, _context) {

     /**
      * 
      */
     CodeMirror.defineExtension('toggleReadonly', 
     /**
      * initializing the painter with joplin command.
      * @param {boolean} enable to tell the plugin toggle on/off
      */
     function( enable ) {
        cm = this;
        is_readonly = enable;
        set_readonly();
     });
 }


 /**
  * Set codemirror editor to 'readonly' cannot prevent modifying from the command on joplin toolbars,
  * (I suppose that those command written in some native way.  see joplin reposity )
  * only the keyboard events listener were disabled.
  */
 function set_readonly(){
    console.log('codemirror command get:' + is_readonly);
    if(is_readonly) {
        cm.setOption('readOnly', 'nocursor');
    }
    else cm.setOption('readOnly', false);
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