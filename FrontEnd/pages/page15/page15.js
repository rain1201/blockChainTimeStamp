document.addEventListener('DOMContentLoaded', function () {

    const userId = Cookies.get('userId');
    const sessionId = Cookies.get('sessionId');
    const counttext = document.querySelector('.font_4');
    const renzheng = document.querySelector('.text_13');
    
    const dataToSend = {
        userId: userId,
        sessionId: sessionId
      };

      fetch('/api/queryUserRecords', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(dataToSend)
      })
    .then(function (response) {
          return response.json();
        })
    .then(function (responseData) {
          if (responseData.code === 0) {
            const count1 = responseData.count;
            counttext.textContent = count1;
          } 
        })
    .catch(function (error) {
          console.error('查询记录出错:', error);
        });
    
    const name = Cookies.get('name');  
    var name0 = document.querySelector('.text_7');
    if (name0) {
      name0.textContent = '昵称： '+userId ;
    }
    var name1 = document.querySelector('.text_2');
    if (name1) {
      name1.textContent = 'Hello'+ userId +'!';
    }

    renzheng.addEventListener('click', function () {
                 fetch('/api/queryUserRecords', {
                    method: 'POST',
                    headers: {
                      'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(dataToSend)
                  })
                .then(function (response) {
                      return response.json();
                    })
                .catch(function (error) {
                      console.error('查询记录出错：', error);
                      Swal.fire({
                        title: '查询出错',
                        text: '网络或其他原因导致查询失败，请稍后再试。',
                        icon: 'error',
                        confirmButtonText: '确定',
                        showCancelButton: false,
                        showCloseButton: false,
                        width: '50%',
                        customClass: {
                          popup: 'custom-popup-class',
                          title: 'custom-title-class',
                          content: 'custom-content-class',
                          confirmButton: 'custom-confirm-button-class'
                        }
                      });
                    })
                .then(function (responseData) {
                      if (responseData.code === 0) {
                        const count = responseData.count;
                        const data = responseData.data;
                        const sweetAlertConfig = {
                          confirmButtonText: '确定',
                          showCancelButton: false,
                          showCloseButton: false,
                          width: '50%',
                          customClass: {
                            popup: 'custom-popup-class',
                            title: 'custom-title-class',
                            content: 'custom-content-class',
                            confirmButton: 'custom-confirm-button-class'
                          }
                        };
        
                        Swal.fire({
                         ...sweetAlertConfig,
                          title: '用户记录查询结果',
                          html: `<p>共查询到 ${count} 条记录，点击每行可查看具体信息。</p>`,
                          onBeforeOpen: function () {
                            const popup = Swal.getPopup();
                            const content = popup.querySelector('.swal2-content');
        
                            data.forEach((record, index) => {
                              const row = document.createElement('div');
                              row.className = 'record-row';
                              row.textContent = `记录 ${index + 1}`;
                              row.addEventListener('click', function () {
                                // 点击行时弹出包含具体数据信息的提示框
                                Swal.fire({
                                 ...sweetAlertConfig,
                                  title: `记录 ${index + 1} 详细信息`,
                                  html: `<p>记录ID: ${record[0]}</p><p>文件哈希: ${record[1]}</p>`,
                                });
                              });
        
                              content.appendChild(row);
                            });
                          }
                        });
                      } else {
                        Swal.fire({
                          title: '查询出错',
                          text: responseData.msg,
                          icon: 'error',
                          confirmButtonText: '确定',
                          showCancelButton: false,
                          showCloseButton: false,
                          width: '50%',
                          customClass: {
                            popup: 'custom-popup-class',
                            title: 'custom-title-class',
                            content: 'custom-content-class',
                            confirmButton: 'custom-confirm-button-class'
                          }
                        });
                      }
                    });
                });

    const  personal= document.querySelector('.text_12');
      personal.addEventListener('click', function () {
        window.location.href = '../page16/page16.html';
    });
    const  back= document.querySelector('.text');
    back.addEventListener('click', function () {
      window.location.href = '../page5/page5.html';
  });

});