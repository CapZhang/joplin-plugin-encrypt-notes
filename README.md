# Joplin 加密插件

## 注意

1. 仅在 windows10 下测试过和使用过
2. 该插件使用 CryptoJS 加密文本，不加密附件，数据安全性取决于 CryptoJS 库
3. 没有找回密码功能，不在任何地方保存密码，密码丢失后没有任何手段找回
4. 该插件禁止修改加密的文件，但是在没有安装该插件时可以修改，包括移动端 app；修改加密后的文件无法正常解密
5. 使用`!!!<br>>>> Do not change this file <br>`字符串判断是否是加密文档，所以不要在你的正常文档的开头写相同的字符串，同理如果你修改加密文件的这个字符串，那么禁止修改加密文件的功能会失效 V_V

## 使用方法

复制 `publish/File_encryption.jpl` 文件到你的电脑，然后用 Joplin 导入该插件

---

# Joplin Encryption Plugin

## notice

1. It has been tested and used only under Windows 10
2. The plugin uses CryptoJS to encrypt text and does not encrypt attachments. Data security depends on the CryptoJS library
3. No password retrieval function, not anywhere to save the password, password lost without any means to recover
4. The plugin prohibits modification of encrypted files, but it can be modified without installation of the plugin, including mobile APP;The modified encrypted file cannot be decrypted properly
5. Use `!!!<br>>>> Do not change this file <br>` string to determine if it is an encrypted document, so Do not write the same string at the beginning of your normal document, for the same reason that if you change this string in an encrypted file, then the disabling function will be disabled. V_V

## use method

Copy the `publish/File_encryption.jpl` file to your computer and import the plugin with Joplin

---

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
