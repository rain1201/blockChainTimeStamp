var recordId = Cookies.get('recordId');
           var fileHash = Cookies.get('fileHash');
           var selfSign = Cookies.get('selfSign');
           var txId = Cookies.get('txId');
           var timestamp = Cookies.get('timestamp');

           var section4 = document.querySelector('.section_4');
        const addCookieTextToCanvas = () => {
            const cookieValues = [
                `Record ID: ${recordId}`,
                `File Hash: ${fileHash}`,
                `Self Sign: ${selfSign}`,
                `Transaction ID: ${txId}`,
                `Timestamp: ${timestamp}`
            ];

            const cookieTextStyle = {
                fontSize: '16px',
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
                fontSize: '16px',
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
        };

document.addEventListener('DOMContentLoaded', function() {
           recordId = Cookies.get('recordId');
           fileHash = Cookies.get('fileHash');
           selfSign = Cookies.get('selfSign');
           txId = Cookies.get('txId');
           timestamp = Cookies.get('timestamp');

           const section4 = document.querySelector('.section_4');
  
           
            addCookieTextToCanvas();

            const downloadBtn = document.querySelector('.text_7');
            if (downloadBtn) {
                downloadBtn.addEventListener('click', downloadCanvasContent);
            }
           
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