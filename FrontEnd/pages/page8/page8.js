           var recordId;
           var fileHash;
           var selfSign;
           var txId;
           var timestamp;

           var section4;
  /*        const addCookieTextToCanvas = () => {
            const cookieValues = [
                `Record ID: ${recordId}`,
                `File Hash: ${fileHash}`,
                `Self Sign: ${selfSign}`,
                `Transaction ID: ${txId}`,
                `Timestamp: ${timestamp}`
            ];

            const cookieTextStyle = {
                fontSize: '12px',
                color: 'black',
                lineHeight: '1.4'
            };

            cookieValues.forEach((value, index) => {
                const textDiv = document.createElement('div');
                textDiv.textContent = value;
                textDiv.style = `left: 20px; top: ${210 + (index * 25)}px; font-size: ${cookieTextStyle.fontSize}; color: ${cookieTextStyle.color}; line-height: ${cookieTextStyle.lineHeight};`;
                section4.appendChild(textDiv);
            });
        };

        const downloadCanvasContent = () => {
            const canvas = document.createElement('canvas');
            canvas.width = 600;
            canvas.height = 860;
            
            const ctx = canvas.getContext('2d');
            canvas.fillStyle = 'white';
            ctx.fillRect(0,0,canvas.width,canvas.height);
            const img = new Image();
            img.src = '../../images/0.png';
            img.onload = () => {
                ctx.drawImage(img, 0, 0, 600, 860);
            };

            ctx.font = '30px bold';
            ctx.fillStyle = 'black';
            ctx.textAlign = 'center';
            ctx.fillText('TrustMark', 300, 150 + 15);

            const cookieValues = [
                `Record ID: ${recordId}`,
                `File Hash: ${fileHash}`,
                `Self Sign: ${selfSign}`,
                `Transaction ID: ${txId}`,
                `Timestamp: ${timestamp}`
            ];

            const cookieTextStyle = {
                fontSize: '12px',
                color: 'black',
                lineHeight: '1.4'
            };

            cookieValues.forEach((value, index) => {
                ctx.font = `${cookieTextStyle.fontSize}px`;
                ctx.fillStyle = `${cookieTextStyle.color}`;
                ctx.fillText(value, 20, 210 + (index * 25));
                ctx.textBaseline = 'top';
                if (index < cookieValues.length - 1) {
                       ctx.fillText('', 20, 210 + (index + 1) * 25);
                 }
            });

            const dataURL = canvas.toDataURL();

            const link = document.createElement('a');
            link.href = dataURL;
            link.download = 'canvas_content.png';
            link.click();
        };*/

document.addEventListener('DOMContentLoaded', function() {
           recordId = Cookies.get('recordId');
           fileHash = Cookies.get('fileHash');
           selfSign = Cookies.get('selfSign');
           txId = Cookies.get('txId');
           timestamp = Cookies.get('timestamp');
           
           /*recordId='830462b5f7884da797a9182483ab88da';
           fileHash='d76ebc0117119f37dbbd837c46722440ce80c7ce89ef8add234746e1f4c7ad2d';
           selfSign='veg diet';
           txId='0x3d92425a5a6a69963ba6cb0126a32b51292a1ef7526f544f8ecf934030b3bf17';
           timestamp='1730904336';*/

           section4 = document.querySelector('.section_4');
  
           const canvas = document.getElementById('canvas');
           const ctx = canvas.getContext('2d');

           const img = new Image();
           img.src = '../../images/0.png';
           img.onload = function () {
               ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
           
           ctx.font = "12px sans-serif";
           ctx.fillStyle = 'black';
           ctx.fillText(recordId, 180, 385);
           ctx.fillStyle = 'black';
           ctx.font = "9px sans-serif";
           ctx.fillText(fileHash, 200, 440);
           ctx.font = "12px sans-serif";
           ctx.fillStyle = 'black';
           ctx.fillText(selfSign, 170, 490);
           ctx.fillStyle = 'black';
           ctx.font = "10px sans-serif";
           ctx.fillText(txId, 160, 545);
           ctx.fillStyle = 'black';
           ctx.font = "12px sans-serif";
           ctx.fillText(timestamp, 180, 595);
            };

           /*const cookieTextStyle = {
               fontSize: '10px',
               color: 'black',
           };

           const cookieValues = [
               `Record ID: ${recordId}`,
               `File Hash: ${fileHash}`,
               `Self Sign: ${selfSign}`,
               `Transaction ID: ${txId}`,
               `Timestamp: ${timestamp}`,
           ];

           cookieValues.forEach((value, index) => {
               ctx.font = `${cookieTextStyle.fontSize}px`;
               ctx.fillStyle = `${cookieTextStyle.color}`;
               ctx.fillText(value, 300, 210 + (index * 100));
              // if (index < cookieValues.length - 1) {
               //    ctx.fillText('', 20, 210 + (index + 1) * 25);
               //}
           });*/

           const downloadBtn = document.querySelector('.text_7');
           downloadBtn.addEventListener('click', function () {
               const dataURL = canvas.toDataURL();
               const link = document.createElement('a');
               link.href = dataURL;
               link.download = '证书.png';
               link.click();
           });

           /*  document.body.appendChild(downloadBtn);
            addCookieTextToCanvas();

            const downloadBtn = document.querySelector('.text_7');
            if (downloadBtn) {
                downloadBtn.addEventListener('click', downloadCanvasContent);
            }*/
           
          const design = document.querySelector('.text_8');
          design.addEventListener('click',function(){
                  window.location.href = '../page9/page9.html';
           });
         
          const renzheng = document.querySelector('.text_2');
	  renzheng.addEventListener('click', function () {
	      window.location.href = '../page6/page6.html';
	  });

	 const yanzheng = document.querySelector('.text_3');
	  yanzheng.addEventListener('click', function () {
	      window.location.href = '../page7/page7.html';
	  });

	 const mainpage = document.querySelector('.image_2');
	  mainpage.addEventListener('click', function () {
	      window.location.href = '../page15/page15.html';
	  });

});