module.exports = class linkManager {
	constructor() {
		this.linking = new Array();
	}
	
	new(discordID, uuid) {
		const code = Math.floor(Math.random() * (9999 + 1 - 1000)) + 1000;
		
		const json = {
			discord: discordID,
			minecraft: uuid,
			code: code,
			time: new Date(),
		};
		
		this.linking.push(json);
		
		return code;
	}
	
	check(code, discordID, uuid) {
		return new Promise((resolve, reject) => {
			const data = this.linking.filter(json => json.code == code);
			console.log(data);
			
			if (!data[0]) return reject("入力されたコードが間違っている可能性があります。確認をして再度お試しください");
			
			if (data[0].time <= new Date() + 60000) {
				this.linking = this.linking.filter(json => json.code !== code);
				return reject("制限時間を超えたため、このコードは無効になりました。再度実行してください。");
			}
			
			if (discordID) {
				if (data[0].discord === discordID) {
					return reject("マインクラフトでコマンドを実行してください");
				} else if (data[0].discord && data[0].discord !== discordID) {
					return reject("このコードはあなたに割り当てられていません");
				} else if (!data[0].discord && data[0].minecraft) {
					data[0].discord = discordID;
					client.database.userAdd(data[0].discord, data[0].minecraft);
					this.linking = this.linking.filter(json => json.discord !== data.discord);
					return resolve("リンクが成功しました");
				}
			}
			
			if (uuid) {
				if (data[0].minecraft === uuid) {
					return reject("Discord でコマンドを実行してください");
				} else if (data[0].minecraft && data[0].minecraft !== uuid) {
					return reject("このコードはあなたに割り当てられていません");
				} else if (!data[0].minecraft && data[0].discord) {
					data[0].minecraft = uuid;
					client.database.userAdd(data[0].discord, data[0].minecraft);
					this.linking = this.linking.filter(json => json.discord !== data.discord);
					return resolve("リンクが成功しました");
				}
			}
			
			return reject("不明なエラーが発生しました");
		});
	}
};
