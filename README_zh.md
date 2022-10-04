[English](https://github.com/ZhangTe/joplin-plugin-encrypt-notes/blob/master/README.md)|[中文](https://github.com/ZhangTe/joplin-plugin-encrypt-notes/blob/master/README_zh.md)


# Joplin 加密插件

## 注意

1. 仅在 windows10 下测试过和使用过
2. 该插件使用 CryptoJS 加密文本，不加密附件，数据安全性取决于 CryptoJS 库
3. 没有找回密码功能，不在任何地方保存密码，密码丢失后没有任何手段找回
4. 该插件禁止修改加密的文件，但是在没有安装该插件时可以修改，包括移动端 app；修改加密后的文件无法正常解密
5. 使用`[[crypted]]<br>`字符串判断是否是加密文档，所以不要在你的正常文档的开头写相同的字符串，同理如果你修改加密文件的这个字符串，那么禁止修改加密文件的功能会失效 V_V

## 使用方法

复制 `publish/File_encryption.jpl` 文件到你的电脑，然后用 Joplin 导入该插件