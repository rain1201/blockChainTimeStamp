var fileHash = "";
var uId = 0;
var sId = "";
const address = "0x618399f465602b385ab77adb4b772bdcca8bf601";
var web3 = null;
var contract = null;
var account = null;
const abi = [{
	"inputs": [{
		"internalType": "uint256",
		"name": "fileHash",
		"type": "uint256"
	}, {
		"internalType": "uint128",
		"name": "recordID",
		"type": "uint128"
	}, {
		"internalType": "string",
		"name": "selfSign",
		"type": "string"
	}],
	"name": "addRecord",
	"outputs": [{
		"internalType": "uint256",
		"name": "",
		"type": "uint256"
	}],
	"stateMutability": "payable",
	"type": "function"
}, {
	"inputs": [{
		"internalType": "uint256",
		"name": "recordPrice",
		"type": "uint256"
	}],
	"name": "setPrice",
	"outputs": [{
		"internalType": "bool",
		"name": "",
		"type": "bool"
	}],
	"stateMutability": "nonpayable",
	"type": "function"
}, {
	"inputs": [],
	"stateMutability": "nonpayable",
	"type": "constructor"
}, {
	"inputs": [{
		"internalType": "uint256",
		"name": "value",
		"type": "uint256"
	}],
	"name": "withdraw",
	"outputs": [{
		"internalType": "bool",
		"name": "",
		"type": "bool"
	}],
	"stateMutability": "nonpayable",
	"type": "function"
}, {
	"inputs": [],
	"name": "creator",
	"outputs": [{
		"internalType": "address",
		"name": "",
		"type": "address"
	}],
	"stateMutability": "view",
	"type": "function"
}, {
	"inputs": [],
	"name": "price",
	"outputs": [{
		"internalType": "uint256",
		"name": "",
		"type": "uint256"
	}],
	"stateMutability": "view",
	"type": "function"
}, {
	"inputs": [{
		"internalType": "uint256",
		"name": "",
		"type": "uint256"
	}],
	"name": "records",
	"outputs": [{
		"internalType": "uint256",
		"name": "fileHash",
		"type": "uint256"
	}, {
		"internalType": "uint128",
		"name": "recordID",
		"type": "uint128"
	}, {
		"internalType": "string",
		"name": "sign",
		"type": "string"
	}],
	"stateMutability": "view",
	"type": "function"
}]

function handleAccountsChanged(accounts) {
	var acc = document.getElementById("acc");
	if (accounts.length === 0) {
		console.log('Please connect to MetaMask.');
	} else {
		account = accounts[0];
	}
}
document.addEventListener('DOMContentLoaded', function() {
	/*const renzheng = document.querySelector('.text_2');
	  renzheng.addEventListener('click', function () {
	      window.location.href = '../page6/page6.html';
	  });

	 const yanzheng = document.querySelector('.text_3');
	  yanzheng.addEventListener('click', function () {
	      window.location.href = '../page7/page7.html';
	  });

	 const mainpage = document.querySelector('.image_11');
	  mainpage.addEventListener('click', function () {
	      window.location.href = '../page15/page15.html';
	  });*/
	uId = parseInt(Cookies.get("userId"));
	sId = Cookies.get("sessionId");
	//if(userId<=0){window.location.href = '../page2/page2.html';}
	const fileSelector = document.getElementById("fs");
	const submit = document.getElementById("submit");
	const mark = document.getElementById("note");
	fileSelector.addEventListener('change', function() {
		var fr = new FileReader();
		fr.onload = function() {
			fileHash = sha3_256(fr.result);
			console.log(fileHash);
		};
		fr.readAsText(this.files[0]);
	});
	submit.addEventListener('click', function() {
		var dataToSend = {
			userId: uId,
			sessionId: sId
		};
		fetch('/api/generateRecordID', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(dataToSend)
			})
			.then(response => response.json())
			.then(data => {
				if (data.code === 0) {
					rId = data.recordId;
					contract.methods.bet(hash).send({
							from: account,
							gasPrice: "1000000000",
							value: String(parseFloat(val.value) * 1000000000000000000)
						})
						.on('error', function(error, receipt) {
							alert(error, receipt);
							return;
						})
						.on('receipt', (data) => {
							console.log(data);
							dataToSend = {
								recordId: rId,
								txId: 1,
							};

							fetch('/api/', {
									method: 'POST',
									headers: {
										'Content-Type': 'application/json'
									},
									body: JSON.stringify(dataToSend)
								})
								.then(response => response.json())
								.then(data => {
									if (data.code === 0) {
										alert('成功');
									} else {
										alert(data.msg);
										console.log(data.msg);
									}
								})
						});
				} else {
					alert(data.msg);
					console.log(data.msg);
				}
			})
			.catch(error => {
				console.log('请求出错：', error);
			});
	});
	ethereum
		.request({
			method: 'eth_requestAccounts'
		})
		.then(handleAccountsChanged)
		.catch((err) => {
			if (err.code === 4001) {
				console.log('Please connect to MetaMask.');
			} else {
				console.error(err);
			}
		});
	web3 = new Web3(window.web3.currentProvider);
	contract = new web3.eth.Contract(abi, address);

});