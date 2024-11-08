document.addEventListener('DOMContentLoaded', function () {
    const username = Cookies.get('name');
    const email = Cookies.get('email');
    const bottom = document.querySelector('.text_11');

    bottom.addEventListener('click', function () {
        const userId = Cookies.get('userId');
        const sessionId = Cookies.get('sessionId');
        if (!userId ||!sessionId) {
          alert('参数错误，请检查登录状态');
          return;
        }

        const dataToSend = {
          userId: userId,
          sessionId: sessionId
        };

        fetch('/api/logout', {
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
              Swal.fire({
                position: 'top-end',
                icon: 'success',
                title: '注销成功',
                showConfirmButton: false,
                timer: 1500
            });
            window.location.href = '../page17/page17.html'
            } else {
                Swal.fire({
					position: 'top-end',
					icon: 'error',
					title: responseData.msg,
					showConfirmButton: false,
					timer: 1500
				});
            }
          })
       .catch(function (error) {
            console.error('注销请求出错:', error);
          });
      });
    var name = document.querySelector('.text_7');
    if (name) {
      name.textContent =  username;
    }
    var emailtext = document.querySelector('.text_9');
    if (emailtext) {
        emailtext.textContent =  email;
      }
    

    const  person= document.querySelector('.text_5');
    person.addEventListener('click', function () {
      window.location.href = '../page15/page15.html';
    });
    const  back= document.querySelector('.text');
    back.addEventListener('click', function () {
      window.location.href = '../page5/page5.html';
    });
});