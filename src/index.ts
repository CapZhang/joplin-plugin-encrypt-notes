import joplin from 'api';
import { ToolbarButtonLocation } from 'api/types';

/*********************************************************
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

function getAesString(data, key, iv) {//加密
	let use_key = key + "0000000000000000"
	use_key = use_key.substr(0, 16)
	var key = CryptoJS.enc.Utf8.parse(use_key);
	console.debug("Encrypt use key->", key);
	var iv = key;
	var encrypted = CryptoJS.AES.encrypt(data, key,
		{
			iv: iv,
			mode: CryptoJS.mode.CBC,
			padding: CryptoJS.pad.Pkcs7
		}).toString();
	// let encData = CryptoJS.enc.Base64.stringify(CryptoJS.enc.Utf8.parse(encrypted));
	return encrypted;    //返回的是base64格式的密文
}
function getDAesString(encrypted, key, iv) {//解密
	let use_key = key + "0000000000000000"
	use_key = use_key.substr(0, 16)
	var key = CryptoJS.enc.Utf8.parse(use_key);
	console.debug("Decryption use key->", use_key);
	console.debug("Decryption data->", encrypted);
	var iv = key;
	// let decData = CryptoJS.enc.Base64.parse(encrypted).toString(CryptoJS.enc.Utf8);
	var decrypted = CryptoJS.AES.decrypt(encrypted, key,
		{
			iv: iv,
			mode: CryptoJS.mode.CBC,
			padding: CryptoJS.pad.Pkcs7
		});
	console.debug("Decryption->", decrypted);
	return decrypted.toString(CryptoJS.enc.Utf8);
	// return decrypted;
}

function getAES(data, key) { //加密
	var iv = 'joplinCryptoJS';
	var encrypted = getAesString(data, key, iv); //密文
	// var encrypted1 =CryptoJS.enc.Utf8.parse(encrypted);
	return encrypted;
}

function getDAes(data, key) {//解密
	var iv = 'joplinCryptoJS';
	var decryptedStr = getDAesString(data, key, iv);
	console.debug("Daes", data);
	console.debug("Daes", decryptedStr);
	return decryptedStr;
}

joplin.plugins.register({
	onStart: async function () {
		console.log("File encryption runing");
		// 对话框
		const dialogs = joplin.views.dialogs;
		// 询问密码的弹窗
		const encryptDialog = await dialogs.create('encrypt_dialog');
		await dialogs.setHtml(encryptDialog, `
		<p class="fileEncry">Input Your PassWord:(Twice)</p>
		<form name="enc_form" class="fileEncry">
			<input type="password" name="password_input_1" autofocus /><br/>
			<input type="password" name="password_input_2"/>
		</form>
		`);
		await dialogs.setButtons(encryptDialog, [
			{
				id: 'Encrypt',
			},
			{
				id: 'Cancel',
			}
		]);

		const decryptionDialog = await dialogs.create('decryption_dialog');
		await dialogs.setHtml(decryptionDialog, `
		<p class="fileEncry"> Input Your PassWord:</p>
		<form name="dec_form" class="fileEncry">
			<input type="password" name="dec_password" autofocus />
		</form>
		`);
		await dialogs.setButtons(decryptionDialog, [
			{
				id: 'Decryption',
			},
			{
				id: 'Cancel',
			},
		]);


		
		const note = await joplin.workspace.selectedNote();
		note.try_number = 0;
		// 上一次加密的时间戳
		let encrypt_time = (new Date()).valueOf();
		await joplin.commands.register({
			name: 'fileEncry',
			label: 'fileEncry',
			iconName: 'fas fa-lock',
			execute: async () => {
				const note = await joplin.workspace.selectedNote();
				note.try_number = 0;
				note.is_change = 0;
				fileEncryption(note, "commands");
			},

		});
		// 加一个按钮
		await joplin.views.toolbarButtons.create('fileEncry', 'fileEncry', ToolbarButtonLocation.NoteToolbar);
		// await joplin.views.toolbarButtons.create('fileEncry', 'fileEncry', ToolbarButtonLocation.EditorToolbar);
		await joplin.workspace.onNoteSelectionChange(async (event: any) => {
			// 当前选中的文件
			try {
				const note = await joplin.workspace.selectedNote();
				console.debug("note->", note);
				note.is_change = 0;
				note.try_number = 0;
				fileEncryption(note, "onNoteSelectionChange");
			} catch {
				console.error("error:On Note Selection Change");
			}

		});
		await joplin.workspace.onNoteChange(async (event: any) => {
			const note = await joplin.workspace.selectedNote();
			note.try_number = 0;
			if (!note.is_change) note.is_change = 0;
			if ((new Date()).valueOf() > encrypt_time) {
				note.is_change += 1;
			}
			if ((new Date()).valueOf() - encrypt_time < 500) return;
			fileEncryption(note, "onNoteChange");
		});

		


		async function fileEncryption(note, itFrom) {
			// 尝试次数
			let try_number = note.try_number;
			while (true) {
				if (note.body.startsWith("[[crypted]]<br>")) {
					//文件是加密的
					//如果有改动加密文件，则先执行undo，利用这个阻止修改加密文件，但是在没有安装该插件的软件中是可以修改的
					//不确定修改后能不能解密成功
					for ( ; note.is_change > 0; note.is_change-- ) {
						await joplin.commands.execute("editor.undo")
					}
					// 解密过程,弹出解密弹窗
					let password_result = await dialogs.open(decryptionDialog);
					if (password_result.id == "Cancel") {
						break;
					} else if (password_result.id == "Decryption") {
						// 有密码且不为空，则解密
						let aes_body = note.body.split("<br>")[1]
						let Dbody = getDAes(aes_body, password_result.formData.dec_form.dec_password)
						console.debug("aes_body->", aes_body);
						console.debug("key->", password_result.formData.dec_form.dec_password);
						if (Dbody) {
							// await joplin.data.put(["notes", note.id], null, { body: Dbody })
							// 发现一个新的api可以直接改变note的内容
							// await joplin.commands.execute("editor.setText", Dbody)
							await joplin.commands.execute("textSelectAll");
							await joplin.commands.execute("textCut");
							await joplin.commands.execute("insertText", Dbody);
							console.debug("Dbody note->", note);
							note.is_change = 0;
							break;
						} else {
							// 解密失败，继续弹窗
							try_number += 1;
							continue;
						}
					}

				} else {
					// 文件不是加密的，判断调用函数的来源
					if (itFrom != "commands") break;
					//来源于按钮，则弹出弹窗

					let password_result = await dialogs.open(encryptDialog);
					if (password_result.id == "Cancel") {
						//如果点击取消
						break;
					} else if ( password_result.id == "Encrypt") {
						if ( password_result.formData.enc_form.password_input_1 == password_result.formData.enc_form.password_input_2 ) {
							//点击加密按钮
							// 没有密码，或者密码为空，则弹出弹窗设置密码，并用密码加密文本
							console.debug(password_result.id, password_result.formData.enc_form.password_input_1);
							let aes_body = getAES(note.body, password_result.formData.enc_form.password_input_1);
							// await joplin.data.put(["notes", note.id], null, { body: "[[crypted]]<br>" + aes_body });
							// note.body = "[[crypted]]<br>" + aes_body;
							// 发现一个新的api可以直接改变note的内容
							await joplin.commands.execute("textSelectAll");
							await joplin.commands.execute("textCut");
							await joplin.commands.execute("insertText", "[[crypted]]<br>" + aes_body);
							// await joplin.commands.execute("editor.setText","[[crypted]]<br>" + aes_body)
							console.debug("ency->", note);

							encrypt_time = (new Date()).valueOf();
							break;
						}
					}
				}
			}
		}
	},
});
