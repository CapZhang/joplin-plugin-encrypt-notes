# Joplin 加密插件

## 注意

1. 仅在 windows10 下测试过和使用过
2. 该插件使用 CryptoJS 加密文本，不加密附件
3. 没有找回密码功能，不在任何地方保存密码，密码丢失后没有任何手段找回
4. 该插件禁止修改加密的文件，但是在没有安装该插件时可以修改，包括移动端 app；修改加密后的文件是否可正常解密没有测试过
5. 由于没有找到 Joplin 刷新视图的 API，也没找到文档只读的选项，所以每次加密解密后都需要切换到别的文档，再切回来才能看到效果
6. 使用`!!!<br>>>> Do not change this file <br>`字符串判断是否是加密文档，所以不要在你的正常文档的开头写相同的字符串，同理如果你修改加密文件的这个字符串，那么禁止修改加密文件的功能会失效 v_v

## 使用方法

复制 publish/File_encryption.jpl 文件到你的电脑，然后用 Joplin 导入该插件

# Joplin Plugin

This is a template to create a new Joplin plugin.

The main two files you will want to look at are:

- `/src/index.ts`, which contains the entry point for the plugin source code.
- `/src/manifest.json`, which is the plugin manifest. It contains information such as the plugin a name, version, etc.

## Building the plugin

The plugin is built using Webpack, which creates the compiled code in `/dist`. A JPL archive will also be created at the root, which can use to distribute the plugin.

To build the plugin, simply run `npm run dist`.

The project is setup to use TypeScript, although you can change the configuration to use plain JavaScript.

## Updating the plugin framework

To update the plugin framework, run `npm run update`.

In general this command tries to do the right thing - in particular it's going to merge the changes in package.json and .gitignore instead of overwriting. It will also leave "/src" as well as README.md untouched.

The file that may cause problem is "webpack.config.js" because it's going to be overwritten. For that reason, if you want to change it, consider creating a separate JavaScript file and include it in webpack.config.js. That way, when you update, you only have to restore the line that include your file.
