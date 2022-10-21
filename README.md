[English](README.md)|[中文](README_zh.md)

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

- It has been tested and used under Windows 7/10. It should work properly with joplin *desktop* version;

- The plugin uses CryptoJS to encrypt text and does not encrypt attachments. Data security depends on the [CryptoJS](https://cryptojs.gitbook.io/docs/) library;

- NO password retrieval function, not anywhere to save the password, password lost without any means to recover;

- The [note history](https://joplinapp.org/note_history/) may leak sensitive information. It can be avoid by disabling *note history*; however, there will be a chance to recover important notes using *note history* when you loose your password or do something by mistake;

   *Suggest: Use a different profile to take private note, and toggle the history note off in this profile. Profile settings on menu bar `file -> Switch profile ->`.*


- This is a disposable encryption-decryption, every time you decrypt a note, you have to manually re-encrypt it;
    
- The Plugin is **NOT COMPATIBLE** with [rich text editor](https://joplinapp.org/rich_text_editor/), don't use it to encrypt notes in this edit mode.(Editor mode switch button on top-right second line.)
## Installation

Copy the `publish/File_encryption.jpl` file to your computer and import the plugin with Joplin

---

## Encryption detail
- algorithm:AES
- encryption encode:BASE64
- encryption mode:CBC
- key:
    length:128-bit
    character:16 UTF8 8-bit character (digit, latin-letter, ascii symbol)
       suppose the key is `12345abc+`, it will be filled with `0` like `12345abc+0000000`
- initialization vector(iv): (128-bit) randomly generated, at the end of the note(update 1.0.5)
    iv encode: BASE64
- padding:Pkcs7


# How to Build

> [Generator Doc](GENERATOR_DOC.md)

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

