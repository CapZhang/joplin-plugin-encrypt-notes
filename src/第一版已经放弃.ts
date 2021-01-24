import joplin from 'api';
import { ToolbarButtonLocation } from 'api/types';

/*********************************************************
 * 每次触发onchange都弹出加密框
 * 
 
joplin Api文档： https://joplinapp.org/api/references/plugin_api/classes/joplin.html
想做一个joplin的文件加密功能，实现思路
1. 注册一个工具栏的按钮
2. 点击按钮弹出对话框，询问密码
3. 检查这个文件本来有没有密码
	1) 读取joplin的自定义设置
	2) 检查这个note.id 是否有对应的值，有就校验密码，解密；没有就设置密码
4. 加密使用 crypto-js对纯文本的Markdown内容进行加密 https://www.jianshu.com/p/a47477e8126a
5. 同一个文件必须使用同一个密码否则解密失败
6. 给一个清楚所有密码重新输入的按钮（在密码框里输入特定的指令）
ALTER TABLE Production ADD COLUMN NEW Text
*********************************************************/
// AES 纯文本加密
const CryptoJS = require("crypto-js")
let nextDialogs = false;
let is_click = 0;
let is_change = 0;
let is_undo = 0;
let is_select_change = 0;
let is_encry = 0;
function getAesString(data, key, iv) {//加密
	let use_key = key + "0000000000000000"
	use_key = use_key.substr(0,16)
	var key = CryptoJS.enc.Utf8.parse(use_key);
	console.log("Encrypt use key->",key);
    var iv   = key;
    var encrypted =CryptoJS.AES.encrypt(data,key,
        {
            iv:iv,
            mode:CryptoJS.mode.CBC,
            padding:CryptoJS.pad.Pkcs7
		}).toString();
	// let encData = CryptoJS.enc.Base64.stringify(CryptoJS.enc.Utf8.parse(encrypted));
    return encrypted;    //返回的是base64格式的密文
}
function getDAesString(encrypted, key, iv) {//解密
	let use_key = key + "0000000000000000"
	use_key = use_key.substr(0,16)
	var key = CryptoJS.enc.Utf8.parse(use_key);
	console.log("Decryption use key->", use_key);
	console.log("Decryption data->",encrypted);
	var iv = key;
	// let decData = CryptoJS.enc.Base64.parse(encrypted).toString(CryptoJS.enc.Utf8);
    var decrypted =CryptoJS.AES.decrypt(encrypted,key,
        {
            iv:iv,
            mode:CryptoJS.mode.CBC,
            padding:CryptoJS.pad.Pkcs7
		});
	console.log("Decryption->",decrypted);
	return decrypted.toString(CryptoJS.enc.Utf8);  
	// return decrypted;
}

function getAES(data,key){ //加密
    var iv   = 'joplinCryptoJS';
    var encrypted =getAesString(data,key,iv); //密文
    // var encrypted1 =CryptoJS.enc.Utf8.parse(encrypted);
    return encrypted;
}

function getDAes(data,key){//解密
    var iv   = 'joplinCryptoJS';
	var decryptedStr = getDAesString(data, key, iv);
	console.log("Daes",data);
	console.log("Daes",decryptedStr);
    return decryptedStr;
}


joplin.plugins.register({
	onStart: async function () {
		console.log("File encryption runing");
		await joplin.commands.register({
			name: 'fileEncry',
			label: 'fileEncry',
			iconName: 'fas fa-lock',
			execute: async () => {
				is_click += 1;
				fileEncryption();
			},
				
		});
		await joplin.workspace.onNoteSelectionChange(async (event: any) => {
			console.log("event->", event);
			is_select_change += 1;
			fileEncryption();
			is_change = 0;
			is_click = 0;
			nextDialogs = false;
			
		});
		await joplin.workspace.onNoteChange(async (event: any) => {
			is_change += 1;
			if (is_undo == 0 && is_change != 0) {
				fileEncryption();
			};
			is_undo = 0;
		});
		// 加一个按钮
		await joplin.views.toolbarButtons.create('fileEncry', 'fileEncry', ToolbarButtonLocation.NoteToolbar);
		// 对话框
		const dialogs = joplin.views.dialogs;
		// 询问密码的弹窗
		const password = await dialogs.create('password');
		await dialogs.setHtml(password, `
		<p>Input Your PassWord: </p>
		<form name="password">
			password: <input type="text" name="password"/>
		</form>
		`);
		await dialogs.setButtons(password, [
			{
				id: 'Encrypt',
			},
			{
				id: 'CancelEncrypt',
			}
		]);

		const passwordOverSize = await dialogs.create('passwordOverSize');
		await dialogs.setHtml(passwordOverSize, `
		<p>Input Your PassWord: </p>
		<form name="password">
			password: <input type="text" name="password"/>
		</form>
		`);
		await dialogs.setButtons(passwordOverSize, [
			{
				id: 'Decryption',
			},
			{
				id: 'CancelDecryption',
			},
		]);


		async function fileEncryption() {
			// 当前选中的文件
			const note = await joplin.workspace.selectedNote();
			console.log("note->", note);
			if (note.body.startsWith("!!!<br>>>> Do not change this file <br>") && is_click==0) {
				// 点进来后检查是不是加密文件，如果是
				nextDialogs = true;
			} else if (is_click != 0) { 
				//如果不是，但是点击了加密按钮
				nextDialogs = true;

			} else {
				// 既不是加密文件，也不是点击了按钮
				nextDialogs = false
			}
			
			while (nextDialogs) {
				// 弹弹窗
				console.log("is_select_change",is_select_change);
				console.log("is_click",is_click);
				console.log("is_change",is_change);
				if (is_select_change == 0 && is_click == 0 && is_change == 0) {
					return
				}
				is_select_change -= 1;
				let password_result;
				if (note.body.startsWith("!!!<br>>>> Do not change this file <br>")) {
					password_result = await dialogs.open(passwordOverSize);
				} else {
					password_result = await dialogs.open(password);
				}
				
				if (password_result.id == "CancelDecryption") {
					is_click = 0;
					if (is_change != 0) {
						for (let i = 0; i < is_change + 1; i++){
													
							await joplin.commands.execute("editor.undo")
						}
						is_undo = is_change;
						is_change = 0;
						nextDialogs = false;
					}
					return
				}
				// alert('Got result: ' + JSON.stringify(password_result));
			
				else if (password_result.id=="Decryption") {
					// 有密码且不为空，则解密
					let aes_body = note.body.split("<br>")[2]
					console.log("aes_body->",aes_body);
					console.log("key->",password_result.formData.password.password);
					
					let Dbody = getDAes(aes_body, password_result.formData.password.password)
					if (Dbody) {
						await joplin.data.put(["notes", note.id], null, { body: Dbody })
						console.log("Dbody->", Dbody);
						is_encry -= 1
						is_click = 0;
						is_change = 0;
						nextDialogs = false;
						return
					} else {
						// 解密失败，继续弹窗
						nextDialogs = true;
					}

				} else if (password_result.id == "Encrypt") {
					// 没有密码，或者密码为空，则弹出弹窗设置密码，并用密码加密文本
					console.log(password_result.id, password_result.formData.password.password);
					let aes_body = getAES(note.body, password_result.formData.password.password);
					await joplin.data.put(["notes", note.id], null, { body: "!!!<br>>>> Do not change this file <br>" + aes_body });
					is_encry += 1;
					is_click = 0;
					is_change = -1;
					nextDialogs = false;
					return
				} else if (password_result.id == "CancelEncrypt") {
					return
					
				} else {
					alert("something error")
				}
			}
		}
	},
});

