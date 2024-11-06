document.addEventListener('DOMContentLoaded', function () {
            const setEthAddressButton = document.querySelector('.text_6');
            let web3;
            let address;
            let sign;
            let t;
			function handleAccountsChanged(accounts) {
	web3 = new Web3(window.ethereum);
	contract = new web3.eth.Contract(abi, address);
	if (accounts.length === 0) {
		console.log('Please connect to MetaMask.');
	} else {
		address = accounts[0];
	}
}
            const userId = Cookies.get('userId');
            const sessionId = Cookies.get('sessionId');
			console.log('即将请求MetaMask账户访问');
            window.ethereum.request({ method: 'eth_requestAccounts' })
                .then(handleAccountsChanged)
                .catch((err) => {
		             if (err.code === 4001) {
				     console.log('Please connect to MetaMask.');
					} else {
				console.error(err);
			}
		});

            address = accounts[0];
            console.log('成功获取MetaMask账户地址：', address);
            web3 = new Web3(window.ethereum);
            const connectToMetaMask = async () => {
                if (typeof window.ethereum === 'undefined') {
                    console.log('请安装MetaMask钱包扩展');
                    return;
                }
                try {
                    t = Math.floor(Date.now() / 1000);
                    const message = `Trying to sign in timestamp service, time is ${t}`;
                    console.log('即将生成签名，消息内容：', message, '，账户地址：', address);
                    sign = await web3.eth.personal.sign(message, address);
                    console.log('成功生成签名：', sign);
                } catch (err) {
                    if (err.code === 4001) {
                        console.log('请在MetaMask中授权账户访问');
                    } else {
                        console.error(err);
                    }
                }
            };

            const setEthAddress = async () => {
                try {
                    await connectToMetaMask();

                    const response = await fetch('/api/setEthAddress', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            userId: userId,
                            sessionId: sessionId,
                            address: address,
                            sign: sign,
                            t: t
                        })
                    });
                    const data = await response.json();
                    if (data.code === 0) {
                        alert('绑定metamask成功');
                        window.location.href = '../page5/page5.html';
                        console.log('设置以太坊地址成功');
                    } else {
                        alert(data.msg);
                        console.log(data.msg);
                    }
                } catch (err) {
                    console.log('设置以太坊地址请求出错：', err);
                }
            };

            setEthAddressButton.addEventListener('click', async () => {
                await setEthAddress();
               setTimeout(() => {
                 setEthAddressButton.style.color ='red';
              }, 3000);
            });

      const foxImage = document.getElementById('fox-image');

      foxImage.addEventListener('mouseover', function() {
            foxImage.src = '../../images/fox_open.jpg'; 
      });
      foxImage.addEventListener('mouseout', function() {
            foxImage.src = '../../images/fox_closed.jpg'; 
      });

  }); 
    
