document.addEventListener('DOMContentLoaded', function () {
    const loginSpan = document.querySelector('.text_11');
    const emailInput = document.getElementById('emailInput');
    const passwordInput = document.getElementById('passWord');

    loginSpan.addEventListener('click', function () {
        const username = emailInput.value;
        const password = passwordInput.value;
        const t = Math.floor(Date.now() / 1000);
        const dataToSend = {
            username: username,
            password: password,
            t: t
        };

        fetch('/api/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(dataToSend)
        })
        .then(response => response.json())
        .then(data => {
            if (data.code === 0) {
                alert('登录成功');
                window.location.href = '../page5/page5.html';
            } else {
                alert(data.msg);
            }
        })
        .catch(error => {
            console.log('登录请求出错：', error);
        });
    });

    const signin = document.querySelector('.text_3');
    signin.addEventListener('click', function () {
        window.location.href = './page2.html';
    });

    const register = document.querySelector('.text_4');
    register.addEventListener('click', function () {
        window.location.href = '../page1/page1.html';
    });

    const products = document.querySelector('.text');
    products.addEventListener('click', function () {
        window.location.href = '../page17/page17.html';
    });

   const  register1= document.querySelector('.text_12');
    register1.addEventListener('click', function () {
        window.location.href = '../page1/page1.html';
    });
   
   /* const  register1= document.querySelector('.font_3');
    register1.addEventListener('click', function () {
        window.location.href = '../page18/page18.html';
    });*/

    
    const image = document.getElementById('toggleImage');
    let isPasswordVisible = false;
    image.addEventListener('click', function () {
        if (isPasswordVisible) {
            image.src = '../../images/b47a54c74ceeca81476d7f5d874da37e.png'; 
        } else {
            image.src = '../../images/1.png';  
        }
        if (isPasswordVisible) {
            passwordInput.type = 'password';
        } else {
            passwordInput.type = 'text';
        }
        isPasswordVisible = !isPasswordVisible;
    });

    
            const section7Div = document.querySelector('.section_7');
       let isExpanded = false;
       const colorChangeStartDiv = document.querySelector('.color-change-start');

       section7Div.addEventListener('click', function () {
        if (!isExpanded) {
            const imgElement = document.createElement('img');
            imgElement.src = '../../images/2.png';
            imgElement.style.opacity = '0';
            section7Div.appendChild(imgElement);
            colorChangeStartDiv.style.opacity = '1';
            setTimeout(function () {
                section7Div.style.backgroundColor = '#C36961';
                imgElement.style.opacity = '1';
            }, 500);
            isExpanded = true;
        } else {
            section7Div.style.backgroundColor = '#f1d5d2';
            section7Div.style.width = '1.5rem';
            section7Div.style.height = '1.5rem';
            const img = section7Div.querySelector('img');
            if (img) {
                img.remove();
            }
            isExpanded = false;
        }
    });

});