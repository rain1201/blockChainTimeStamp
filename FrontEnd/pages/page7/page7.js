var uId = 0;
var sId = "";
var rId = "";
var fileHash = "";
var oFileHash = "";
var selfSign = "";
var status = 0;
var txId="";
var ts=0;
var dataToSend;
document.addEventListener('DOMContentLoaded', function() {
	uId = parseInt(Cookies.get("userId"));
	sId = Cookies.get("sessionId");
	if(isNaN(uId)){sId="anonymous";uId=0;}
	const fileSelector = document.getElementById("fs");
	const rinput = document.getElementById("rid");
	const update = document.getElementById("update");
	const getinf = document.getElementById("getinf");
	const bc = document.getElementById("viewinbc");
	fileSelector.addEventListener('change', function() {
		var fr = new FileReader();
		fr.onload = function() {
			fileHash = sha3_256(fr.result);
			console.log(fileHash);
		};
		fr.readAsText(this.files[0]);
	});
	getinf.addEventListener('click', function() {
		if(rinput.value.length<5){alert("请输入id");return;}
		dataToSend = {
			userId: uId,
			sessionId: sId,
			recordId: rinput.value
		};
		fetch('/api/querySingleRecordsDetail', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(dataToSend)
			})
			.then(response => response.json())
			.then(data => {
				if(data.cnt<1){alert("未找到记录，或记录未更新");return;}
				status=data.data[0][4];
				oFileHash=data.data[0][1].replaceAll("'","");
				selfSign=data.data[0][2].replaceAll("'","");
				txId=data.data[0][3].replaceAll("'","");
				ts=data.data[0][5];
				if(fileHash!="" && fileHash!=oFileHash){alert("文件不一致");}
				if(fileHash!="" && fileHash==oFileHash){alert("文件一致");}
				console.log(data.data);
			});
	});
	update.addEventListener('click', function() {
		if(rinput.value.length<5){alert("请输入id");return;}
		dataToSend = {
			recordId: rinput.value
		};
		fetch('/api/updateRecord', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(dataToSend)
			})
			.then(response => response.json())
			.then(data => {alert(data.msg);});
	});
	bc.addEventListener('click', function() {
		if(txId!=""){window.open("https://sepolia.etherscan.io/tx/"+txId.replaceAll("'",""), "_blank", "resizable,scrollbars,status");}
	});
	
});