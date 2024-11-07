document.addEventListener('DOMContentLoaded', function () {
            const setEthAddressButton = document.querySelector('.text_6');
            let web3;
            let address;
            let sign;
            let t;
			function handleAccountsChanged(accounts) {
	web3 = new Web3(window.ethereum);
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
		const siweSign = async (siweMessage) => {
  try {
    const msg = web3.utils.utf8ToHex(siweMessage);
    sign = await window.ethereum
      .request({
        method: "personal_sign",
        params: [msg, address],
      })
  } catch (err) {
    console.error(err);
  }
}

            
            const setEthAddress = async () => {
                try {
					t = Math.floor(Date.now() / 1000);
                    const message = `Trying to sign in timestamp service, time is ${t}`;
                    console.log('即将生成签名，消息内容：', message, '，账户地址：', address);
                    await siweSign(message);

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
                    Swal.fire({
					position: 'top-end',
					icon: 'success',
					title: '绑定metamask成功',
					showConfirmButton: false,
					timer: 1500
				});
                        //alert('绑定metamask成功');
                        window.location.href = '../page5/page5.html';
                        console.log('设置以太坊地址成功');
                    } else {
                    Swal.fire({
					position: 'top-end',
					icon: 'error',
					title: data.msg,
					showConfirmButton: false,
					timer: 1500
				});
                        //alert(data.msg);
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
    
