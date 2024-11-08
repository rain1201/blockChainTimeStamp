document.addEventListener('DOMContentLoaded', function () {

    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');
    let stickerImage;
    let stickerX = 0;
    let stickerY = 0;
    let stickerScale = 1;
    let isDragging = false;
    let startX, startY;
    const stickerImageInput = document.getElementById('stickerImageInput');
    const mergeButton = document.getElementById('mergeButton');
    const backimage = new Image();
    var recordId = Cookies.get('recordId');
    var fileHash = Cookies.get('fileHash');
    var selfSign = Cookies.get('selfSign');
    var txId = Cookies.get('txId');
    var timestamp = Cookies.get('timestamp');
    

       backimage.src = '../../images/0.png';
       backimage.onload = function () {
        ctx.drawImage(backimage, 0, 0, canvas.width, canvas.height);
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
    

    const imachang=document.getElementById('.image_11');
    imgchang.addEventListener('click', function (){
        stickerImage="../../images/c45b10d9dde04257ed7d2948e1e8e2f7.png";
    });

    stickerImageInput.addEventListener('change', function (e) {
        const file = e.target.files[0];
        const reader = new FileReader();

        reader.onload = function (event) {
            const img = new Image();
            img.onload = function () {
                stickerImage = img;
            };
            img.src = event.target.result;
        };

        reader.readAsDataURL(file);
    });
    canvas.addEventListener('mousedown', function (e) {
        if (stickerImage) {
            isDragging = true;
            startX = e.clientX - stickerX;
            startY = e.clientY - stickerY;
        }
    });
    canvas.addEventListener('mousemove', function (e) {
        if (isDragging && stickerImage) {
            stickerX = e.clientX - startX;
            stickerY = e.clientY - startY;
            draw();
        }
    });
    canvas.addEventListener('mouseup', function () {
        isDragging = false;
    });
    canvas.addEventListener('wheel', function (e) {
        e.preventDefault();
        const scaleFactor = e.deltaY < 0? 1.1 : 0.9;
        stickerScale *= scaleFactor;
        draw();
    });
    
    
    function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        backimage.src = '../../images/0.png';
        backimage.onload = function () {
        ctx.drawImage(backimage, 0, 0, canvas.width, canvas.height);
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
        if (stickerImage) {
            const scaledWidth = stickerImage.width * stickerScale;
            const scaledHeight = stickerImage.height * stickerScale;
            ctx.drawImage(stickerImage, stickerX, stickerY, scaledWidth, scaledHeight);
        }
       };     
    } 
    mergeButton.addEventListener('click', function () {
        if (backimage && stickerImage) {
            const mergedCanvas = document.createElement('canvas');
            const mergedCtx = mergedCanvas.getContext('2d');
            mergedCanvas.width = canvas.width;
            mergedCanvas.height = canvas.height;
               
            mergedCtx.drawImage(backimage, 0, 0, canvas.width, canvas.height);
            mergedCtx.font = "12px sans-serif";
            mergedCtx.fillStyle = 'black';
            mergedCtx.fillText(recordId, 180, 385);
            mergedCtx.fillStyle = 'black';
            mergedCtx.font = "9px sans-serif";
            mergedCtx.fillText(fileHash, 200, 440);
            mergedCtx.font = "12px sans-serif";
            mergedCtx.fillStyle = 'black';
            mergedCtx.fillText(selfSign, 170, 490);
            mergedCtx.fillStyle = 'black';
            mergedCtx.font = "10px sans-serif";
            mergedCtx.fillText(txId, 160, 545);
            mergedCtx.fillStyle = 'black';
            mergedCtx.font = "12px sans-serif";
            mergedCtx.fillText(timestamp, 180, 595);
            const scaledWidth = stickerImage.width * stickerScale;
            const scaledHeight = stickerImage.height * stickerScale;
            mergedCtx.drawImage(stickerImage, stickerX, stickerY, scaledWidth, scaledHeight);

            const link = document.createElement('a');
            link.href = mergedCanvas.toDataURL();
            link.download = '证书.png';
            link.click();
        }
    });   

    var main = document.querySelector('.text_4');
    main.addEventListener('click', function () {
        window.location.href = '../page5/page5.html';
      });

    
});