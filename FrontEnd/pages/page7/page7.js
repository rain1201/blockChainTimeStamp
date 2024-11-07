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
       var section_6Element = document.querySelector('.section_6');
       var spanElement = section_6Element.querySelector('span');
       var fileInput = document.getElementById('fs');
       fileInput.addEventListener('change', function() {
           var fileName = this.files[0].name;
           spanElement.textContent = '已选择文件：' + fileName;
       });
          section_6Element.addEventListener('click', function() {
           fileInput.click();
       });

	uId = parseInt(Cookies.get("userId"));
	sId = Cookies.get("sessionId");
	if(isNaN(uId)){sId="anonymous";uId=0;}
	const fileSelector = document.getElementById("fs");
	const rinput = document.getElementById("rid");
	const update = document.getElementById("update");
	const getinf = document.getElementById("getinf");
	const bc = document.getElementById("viewinbc");
        const canvas = document.createElement('canvas');
        canvas.width = 800;
        canvas.height = 300;
	fileSelector.addEventListener('change', function() {
		var fr = new FileReader();
		fr.onload = function() {
			fileHash = sha3_256(fr.result);
			console.log(fileHash);
		};
		fr.readAsText(this.files[0]);
	});
	getinf.addEventListener('click', function() {
		if(rinput.value.length<5){swal("请输入id");return;}
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
				if(data.cnt<1){swal("未找到记录，或记录未更新");return;}
				status=data.data[0][4];
				oFileHash=data.data[0][1].replaceAll("'","");
				selfSign=data.data[0][2].replaceAll("'","");
				txId=data.data[0][3].replaceAll("'","");
				ts=data.data[0][5];
				swal({
			        title: '记录信息',
                    text: '记录ID：'+rinput.value+"\n时间戳："+ts+"\n状态："+status+"\n文件哈希："+oFileHash+"\ntxID："+txId+"\n备注："+selfSign
                    });
                                var ctx = canvas.getContext('2d');
                                ctx.fillStyle = 'white'; 
                                ctx.fillRect(0, 0, canvas.width, canvas.height);
                                ctx.font = "25px sans-serif";
				if(fileHash!="" && fileHash!=oFileHash){

                                       swal("文件不一致");
                                       ctx.fillStyle = 'black';
                                       ctx.fillText("您检验的文件是不一致的 ，请您注意哦" , 20, 20 );
                                }
				if(fileHash!="" && fileHash==oFileHash){

                                        swal("文件一致，请查收文件一致证书");
                                        ctx.fillStyle = 'black';
                                        ctx.fillText("您检验的文件是一致的 ，恭喜您" , 20, 20 );
                                }
				console.log(data.data);
                                ctx.font = "16px sans-serif";
                                ctx.fillStyle = 'black';
                                ctx.fillText("Record ID: " + rinput.value, 10, 70);
                                ctx.fillStyle = 'black';
                                ctx.fillText("File Hash: " + oFileHash, 10, 100);
                                ctx.fillStyle = 'black';
                                ctx.fillText("Self Sign: " + selfSign, 10, 130);
                                ctx.fillStyle = 'black';
                                ctx.fillText("Transaction ID: " + txId, 10, 160);
                                ctx.fillStyle = 'black';
                                ctx.fillText("Timestamp: " + new Date(ts * 1000).toLocaleString(), 10, 190);
                                var link = document.createElement('a');
                                swal({
  title: "是否保存信息?",
  icon: "info",
  buttons: true,
  dangerMode: true,
})
.then((willDelete) => {
  if (willDelete) {
    canvas.toBlob(function (blob) {
                                   link.href = URL.createObjectURL(blob);
                                   link.download = 'record.jpg';
                                   link.click();
                               }, 'image/jpeg');
  }
});
                                
			});
	});
	update.addEventListener('click', function() {
		if(rinput.value.length<5){swal("请输入id");return;}
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
			.then(data => {swal(data.msg);});
	});
	bc.addEventListener('click', function() {
		if(txId!=""){window.open("https://sepolia.etherscan.io/tx/"+txId.replaceAll("'",""), "_blank", "resizable,scrollbars,status");}
	});
	
       const renzheng = document.querySelector('.text_2');
	  renzheng.addEventListener('click', function () {
	      window.location.href = '../page6/page6.html';
	  });

	 const yanzheng = document.querySelector('.text_3');
	  yanzheng.addEventListener('click', function () {
	      window.location.href = '../page7/page7.html';
	  });

	 const mainpage = document.querySelector('.image');
	  mainpage.addEventListener('click', function () {
	      window.location.href = '../page15/page15.html';
	  });
});