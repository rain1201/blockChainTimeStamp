       const connectButton = document.querySelector('.text_6');
        if (typeof window.ethereum === 'undefined') {
            console.log('请安装MetaMask钱包扩展');
            return;
        }
        let web3;
        let address;
        let sign;
        let t;
        const connectToMetaMask = async () => {
            try {
                const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
                address = accounts[0];
                web3 = new Web3(window.ethereum);
                t = Math.floor(Date.now() / 1000);
                const message = `Trying to login timestamp service, time is ${t}`;
                sign = await web3.eth.personal.sign(message, address);
            } catch (err) {
                if (err.code === 4001) {
                    console.log('请在MetaMask中授权账户访问');
                } else {
                    console.error(err);
                }
            }
        };
        const loginWithMeta = async () => {
            try {
                const response = await fetch('/api/loginWithMeta', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        address: address,
                        sign: sign,
                        t: t
                    })
                });
                const data = await response.json();
                if (data.code === 0) {
                    alert('登录成功');
                    const userId = data.userId;
                    const sessionId = data.sessionId;
                    Cookies.set('userId', userId);
                    Cookies.set('sessionId', sessionId);
                    console.log('登录成功，用户ID：', data.userId, '，会话ID：', data.sessionId);
                    window.location.href = '../page5/page5.html';
                } else {
                    alert(data.msg);
                    console.log(data.msg);
                }
            } catch (err) {
                console.log('登录请求出错：', err);
            }
        };

        connectButton.addEventListener('click', async () => {              
            await connectToMetaMask();
            await loginWithMeta();
           setTimeout(() => {
            connectButton.style.color ='red';
           }, 3000);
        });