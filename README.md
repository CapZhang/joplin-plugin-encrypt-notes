[English](https://github.com/ZhangTe/joplin-plugin-encrypt-notes/blob/master/README.md)|[中文](https://github.com/ZhangTe/joplin-plugin-encrypt-notes/blob/master/README_zh.md)

This is a fork branch from https://github.com/CapZhang/joplin-plugin-encrypt-notes



# Joplin Encryption Plugin
This is a [joplin](https://joplinapp.org/) notebook plugin.
## Usage

- click the top-right lock icon to encrypt.

- Every time when you re-enter the encrypted note, the unlock dialog pop-up.(can be toggle off in setting)

- The plugin prohibits modification of encrypted files, but it can be modified without installation of the plugin, including mobile APP;The modified encrypted file cannot be decrypted properly. If you want to edit the encrypted note, *enable* modification in advance setting.

- Use a specified prefix string to determine if it is an encrypted document, so Do not write the same string at the beginning of your normal document, for the same reason that if you change this string in an encrypted file, then the disabling function will be disabled.

Key strings change with updating.

|version|prefix string|encode version string| data spliter | initialization vector |
| - | - | - | - | - |
| 1.0.0 | `[[crypted]]`|  | `<br/>` | |
| 1.0.1 | `;;ENCRYPTNOTE?` |`UTF8?AES?CBC128?PKCS7?V102;` |`;DATA;`| |
| 1.0.5 | `;;ENCRYPTNOTE?` |`UTF8?AES?CBC128?PKCS7?V105;` |`;DATA;`| `;IV;` |

## Notice

- It has been tested and used under Windows 7/10. It should work properly with joplin desktop version.

- The plugin uses CryptoJS to encrypt text and does not encrypt attachments. Data security depends on the [CryptoJS](https://cryptojs.gitbook.io/docs/) library

- No password retrieval function, not anywhere to save the password, password lost without any means to recover

- The [note history](https://joplinapp.org/note_history/) may expose your sensitive information. It can be avoid by disabling this function, but there is still a chance for you to recover important notes with the function when you loose your password.

- This is a disposable encryption-decryption, every time you decrypt a note, you have to manually re-encrypt it.

- The Plugin is NOT compatible with [rich text editor](https://joplinapp.org/rich_text_editor/), don't use it to encrypt notes in this edit mode.(Editor mode switch button on top-right second line.)
## Installation

Copy the `publish/File_encryption.jpl` file to your computer and import the plugin with Joplin

---

## Encryption detail
- algorithm:AES
- encode:BASE64
- encrypt mode:CBC
- key:
    length:128-bit
    character:16 UTF8 8-bit character (digit, latin-letter, ascii symbol)
       suppose the key is `12345abc+`, it will be filled with `0` like `12345abc+0000000`
- initialization vector(iv): (128-bit) randomly generated, at the end of the note(update 1.0.5)
- padding:Pkcs7


# How to Build

> [Generator Doc](https://github.com/ZhangTe/joplin-plugin-encrypt-notes/blob/master/GENERATOR_DOC.md)

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

# Feedback

## Bug report and advice

Leave a issue here or send email to ztbxxt@hotmail.com, if you encounter problems or want to give advice.

## Buy me a coffee
Wish you enjoy this work. 
It will be a greet help when you can make a donation:<br/>
<a href='https://Ko-fi.com/ztbxxt'><img src="https://img.shields.io/badge/Donate-Ko_fi-442200.svg" /><img src="https://storage.ko-fi.com/cdn/kofi_stroke_cup.svg" alt="alt text" height="20" width="30" /></a>
<a href='https://paypal.me/ztbxxt'><img src="https://img.shields.io/badge/Donate-PayPal-2275FF.svg" /><img src="https://www.paypalobjects.com/webstatic/icon/pp32.png" alt="alt text" height="20" width="20" /></a>
<a href='https://afdian.net/@ztbxxt'><img src="https://img.shields.io/badge/Donate-爱发电-6900CF.svg"/><img src="https://afdian.net/static/img/logo/logo.png" height="20"  width="20" /></a>