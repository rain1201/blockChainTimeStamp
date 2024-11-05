document.addEventListener("DOMContentLoaded", function() {
        const metamaskButton = document.querySelector('.section .group_3');
    metamaskButton.addEventListener('click', function() {
        if (typeof window.ethereum !== 'undefined') {
            window.ethereum.request({ method: 'eth_requestAccounts' })
            .then(accounts => {
                const address = accounts[0];
                const t = Math.floor(Date.now() / 1000);
                // 获取用户签名
                window.ethereum.request({
                    method: 'personal_sign',
                    params: [address, `Trying to login timestamp service, time is ${t}`]
                })
                .then(sign => {
                    // 发送Metamask登录请求
                    fetch('/api/loginWithMeta', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            address: address,
                            sign: sign,
                            t: t
                        })
                    })
                    .then(response => response.json())
                    .then(data => {
                        if (data.code === 0) {
                            alert("已连接到Metamask: " + address);
                            // 保存 sessionId 和 userId 到 localStorage
                            localStorage.setItem('sessionId', data.sessionId);
                            localStorage.setItem('userId', data.userId);
                            // 跳转到用户主页
                            window.location.href = '/user-home.html';
                        } else {
                            alert("Metamask连接失败: " + data.msg);
                        }
                    })
                    .catch(error => console.error('Error:', error));
                })
                .catch(error => console.error('Error:', error));
            })
            .catch(error => console.error('Error:', error));
        } else {
            alert("请安装Metamask扩展");
        }
    });
});

  const foxImage = document.getElementById('fox-image');

  foxImage.addEventListener('mouseover', function() {
            foxImage.src = '../../images/fox_open.jpg'; 
  });
  foxImage.addEventListener('mouseout', function() {
            foxImage.src = '../../images/fox_closed.jpg'; 
  });
