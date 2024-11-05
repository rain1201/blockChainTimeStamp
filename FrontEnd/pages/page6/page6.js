 var fileHash="";
 document.addEventListener('DOMContentLoaded', function () {
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
    const fileSelector=document.getElementById("fs");
    fileSelector.addEventListener('change', function () {
        var fr = new FileReader();
		fr.onload = function() {
		fileHash=sha3_256(fr.result);
		console.log(fileHash);
		};
		fr.readAsText(this.files[0]);
    });


});