document.addEventListener('DOMContentLoaded', function () {
            const setEthAddressButton = document.querySelector('.text_4');
            let web3;
            let address;
            let sign;
            let t;

            const userId = Cookies.get('userId');
            const sessionId = Cookies.get('sessionId');

            const connectToMetaMask = async () => {
                if (typeof window.ethereum === 'undefined') {
                    console.log('请安装MetaMask钱包扩展');
                    return;
                }
                try {
                    const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
                    address = accounts[0];
                    web3 = new Web3(window.ethereum);
                    t = Math.floor(Date.now() / 1000);
                    const message = `Trying to sign in timestamp service, time is ${t}`;
                    sign = await web3.eth.personal.sign(message, address);
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
    
