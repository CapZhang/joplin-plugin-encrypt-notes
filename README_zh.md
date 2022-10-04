[English](https://github.com/ZhangTe/joplin-plugin-encrypt-notes/blob/master/README.md)|[中文](https://github.com/ZhangTe/joplin-plugin-encrypt-notes/blob/master/README_zh.md)

这是[原项目](https://github.com/CapZhang/joplin-plugin-encrypt-notes)的一个分支


# Joplin 加密插件

支持Joplin2.8.8
## 使用

点击右上角工具栏锁形按钮，输入密码加密。
离开该笔记后再次进入时解密。

## 注意

1. 仅在 windows10 下测试过和使用过

2. 该插件使用 CryptoJS 加密文本，不加密附件，数据安全性取决于 CryptoJS 库

3. 没有找回密码功能，不在任何地方保存密码，密码丢失后没有任何手段找回

4. 该插件禁止修改加密的文件，但是在没有安装该插件时可以修改，包括移动端 app；修改加密后的文件无法正常解密

5. 使用`[[crypted]]<br>`字符串判断是否是加密文档，所以不要在你的正常文档的开头写相同的字符串，同理如果你修改加密文件的这个字符串，那么禁止修改加密文件的功能会失效

6. [历史笔记](https://joplinapp.org/note_history )功能可能导致你想加密的内容泄露，禁用该功能可以避免泄露；但是如果你的密码忘记，你将有可能通过历史笔记来恢复重要内容。

7. 插件为一次性加密-解密，每次解密后，需要手动重新加密。

## 安装

复制 `publish/File_encryption.jpl` 文件到你的电脑，然后用 Joplin 导入该插件


# 从源码构建

> [Generator Doc](https://github.com/ZhangTe/joplin-plugin-encrypt-notes/blob/master/GENERATOR_DOC.md)

## 需要环境

手动安装[NodeJS](https://nodejs.org/zh-cn/)， javascript 运行环境
 
指令安装以下
[yeoman](https://yeoman.io/) 模板化应用构建工具

[crypto-js](https://cryptojs.gitbook.io/docs/) 加密程序

## 安装
打开命令行运行*安装指令*

```bash
npm install -g yo
npm install -g crypto-js
npm install -g generator-joplin
```

创建并移动到*工作路径* 比如 ：`cd C:/user/username/documents/joplin-plugin-encrypt-notes/`


```
yo joplin
```
输入信息

执行完成后在*工作路径*会产生构建所需的框架文件

## 构建
将[src](https://github.com/ZhangTe/joplin-plugin-encrypt-notes/tree/master/src)文件夹下的代码复制到工作路径的`src`中。

在命令行工作路径下运行
`npm run dist`

可以运行的插件会在`publish`中生成，扩展名称为`.jpl`