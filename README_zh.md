[English](https://github.com/ZhangTe/joplin-plugin-encrypt-notes/blob/master/README.md)|[中文](https://github.com/ZhangTe/joplin-plugin-encrypt-notes/blob/master/README_zh.md)

这是[原项目](https://github.com/CapZhang/joplin-plugin-encrypt-notes)的一个分支


# Joplin 加密插件

这是[joplin](https://joplinapp.org/)笔记本的一个插件

支持Joplin2.8.8

## 使用

- 点击右上角工具栏锁形按钮，输入密码加密。

- 离开该笔记后再次进入时解密。解密对话框自动弹出。可以通过设置取消自动弹出。

- 该插件禁止修改加密的文件，但是在*没有安装*该插件时可以修改，包括移动端app；修改加密后的文件无法正常解密。可以通过高级设置启用编辑加密文件。

- 使用一个固定的特殊前缀字符串判断是否是加密文档，所以不要在你的正常文档的开头写相同的字符串，同理如果你修改加密文件的这个字符串，那么禁止修改加密文件的功能会失效

特殊字符串列表

|版本|前缀|版本信息|密文数据分隔符|偏移向量分隔符|
| - | - | - | - | |
| 1.0.0 | `[[crypted]]`|  | `<br/>` | |
| 1.0.1 | `;;ENCRYPTNOTE?` |`UTF8?AES?CBC128?PKCS7?V101;` |`;DATA;`| |
| 1.0.5 | `;;ENCRYPTNOTE?` |`UTF8?AES?CBC128?PKCS7?V105;` |`;DATA;`| `;IV;` |

## 注意

- 仅在 windows10 下测试过和使用过

- 该插件使用 CryptoJS 加密文本，不加密附件，数据安全性取决于 [CryptoJS](https://cryptojs.gitbook.io/docs/) 库

- 没有找回密码功能，不在任何地方保存密码，密码丢失后没有任何手段找回

- [历史笔记](https://joplinapp.org/note_history )功能可能导致你想加密的内容泄露，禁用该功能可以避免泄露；但是如果你的密码忘记，你将有可能通过历史笔记来恢复重要内容。

- 插件为一次性加密-解密，每次解密后，需要手动重新加密。

- 加密插件与[富文本编辑器](https://joplinapp.org/rich_text_editor/)不兼容，请不要再富文本编辑模式下加密或解密（尤其是加密）。（富文本编辑器：所见即所得编辑器，操作类似Word，Joplin中首次进入此模式下会有一行黄字提示，切换编辑器模式的按钮在右上角第二行。）

## 加密算法
- 算法 algorithm：AES
- 密文编码 encrypt encode：BASE64
- 加密模式 encrypt mode：CBC
- 密钥 key:
    长度 key length：128位
    字符 character：16个UTF8 8位字符（数字、拉丁字母以及其他ASCII符号）
    长度不够则补充`0`：如用户设定密钥为`12345abc+` 则补充为`12345abc+0000000`
- 偏移向量 iv：随机值（1.0.5更新）
- 填充模式 padding:Pkcs7

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

# 反馈
## 问题报告和功能要求
可以使用github上的issue反馈问题。
也可以发送邮件至ztbxxt@hotmail.com。

## 发电
如果您喜欢我的作品， 
您的捐赠将是对其最大的认可：<br/>
<a href='https://Ko-fi.com/ztbxxt'><img src="https://img.shields.io/badge/Donate-Ko_fi-442200.svg" /><img src="https://storage.ko-fi.com/cdn/kofi_stroke_cup.svg" alt="alt text" height="20" width="30" /></a>
<a href='https://paypal.me/ztbxxt'><img src="https://img.shields.io/badge/Donate-PayPal-2275FF.svg" /><img src="https://www.paypalobjects.com/webstatic/icon/pp32.png" alt="alt text" height="20" width="20" /></a>
<a href='https://afdian.net/@ztbxxt'><img src="https://img.shields.io/badge/Donate-爱发电-6900CF.svg"/><img src="https://afdian.net/static/img/logo/logo.png" height="20"  width="20" /></a>
