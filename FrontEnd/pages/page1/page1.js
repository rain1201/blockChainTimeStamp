       let isagree = false;
        document.addEventListener('DOMContentLoaded', function () {
            const textWrapper5 = document.querySelector('.text-wrapper_5');
            const text_13 = document.querySelector('.text_13');

            text_13.addEventListener('click', function () {
                textWrapper5.classList.add('changed');
                var email = document.getElementById('mailadress').value;
                fetch('/api/getEmailCaptcha', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ email: email })
                })
             .then(function (response) {
                    return response.json();
                })
             .then(function (response) {
                    if (response.code === 0) {
                        alert('验证码已发送，请查收邮件');
                        text_13.textContent = '已发送';
                        text_13.classList.add('changed');
                        setTimeout(function () {
                            text_13.textContent = '获取验证码';
                            text_13.classList.remove('changed');
                            textWrapper5.classList.remove('changed');
                        }, 60000);
                    } else {
                        alert(response.msg);
                    }
                    textWrapper5.classList.remove('changed');
                })
             .catch(function (error) {
                    console.log('获取验证码请求出错：', error);
                    textWrapper5.classList.remove('changed');
                });
            });

           document.querySelector('.text_14').addEventListener('click', async function () {
                if (isagree === true) {
                    var name = document.getElementById('name').value;
                    var email = document.getElementById('mailadress').value;
                    var password = document.getElementById('passWord').value;
                    var captcha = document.getElementById('verifcation').value;
                    const salt = CryptoJS.lib.WordArray.random(128 / 8).toString(CryptoJS.enc.Hex);
                    const hashedPasswordWithSalt = CryptoJS.SHA256(password + salt).toString(CryptoJS.enc.Hex);
                    const timestamp = Date.now();
                    const finalHashedPassword = CryptoJS.SHA256(hashedPasswordWithSalt + timestamp).toString(CryptoJS.enc.Hex);
                    try {
                        const response = await fetch('/api/signup', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify({
                                email: email,
                                username: name,
                                password: finalHashedPassword,
                                captcha: captcha
                            })
                        });
                        const data = await response.json();

                        if (response.code === 0) {
                            alert('注册成功');
                            window.location.href = '../page3/page3.html';
                        } else {
                            alert(data.msg);
                        }
                    } catch (error) {
                        console.log('注册请求出错：', error);
                    }
                } else {
                    alert('请阅读并同意使用协议/隐私协议');
                }
            });

            const image = document.getElementById('toggleImage');
            const passwordInput = document.getElementById('passWord');
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
                isPasswordVisible =!isPasswordVisible;
            });

            const signin = document.querySelector('.text_3');
            signin.addEventListener('click', function () {
                window.location.href = '../page2/page2.html';
            });

            const signin1 = document.querySelector('.text_7');
            signin1.addEventListener('click', function () {
                window.location.href = '../page2/page2.html';
            });

            const register = document.querySelector('.text_4');
            register.addEventListener('click', function () {
                window.location.href = './page1.html';
            });

            const products = document.querySelector('.text');
            products.addEventListener('click', function () {
                window.location.href = '../page17/page17.html';
            });

            document.querySelector('.text_9').addEventListener('click', function () {
                var userAgreementContent = `
                    <h2>一、引言</h2>
                    <p>本协议旨在规范用户在使用区块链时间戳服务过程中的权利和义务，重点关注隐私保护相关内容。区块链时间戳技术通过在区块链上记录特定数据的时间信息，为数据的真实性和完整性提供了可靠的证明。然而，在使用过程中，涉及到用户数据的处理和隐私问题，需要明确规定以保障各方权益。</p>
                    <h2>二、定义</h2>
                    <p>区块链时间戳服务：指利用区块链技术为用户提供的，对特定数据生成具有时间标记的记录服务，该记录在区块链网络中具有不可篡改和可追溯的特性。</p>
                    <p>用户数据：指用户在使用区块链时间戳服务过程中提交的、与时间戳相关的数据，包括但不限于文件哈希值、业务数据摘要、相关元数据等。</p>
                    <h2>三、服务提供商的责任</h2>
                    <h3>数据收集与存储</h3>
                    <p>服务提供商仅收集为生成和存储时间戳记录所必需的用户数据。这些数据将被安全地存储在区块链网络或与之相关联的安全存储系统中，确保数据的完整性和可用性。</p>
                    <p>采用先进的加密技术对用户数据进行加密存储，防止未经授权的访问和数据泄露。加密密钥将被妥善保管，且仅在特定的授权操作（如数据验证、审计等）下使用。</p>
                    <h3>数据使用限制</h3>
                    <p>服务提供商承诺仅将用户数据用于区块链时间戳服务的目的，包括时间戳的生成、验证、查询以及为遵守法律法规而进行的必要审计。未经用户明确书面同意，不得将用户数据用于任何其他商业目的或与第三方共享，除非法律法规另有要求。</p>
                    <p>在使用用户数据进行技术维护和改进服务时，确保不会泄露用户的隐私信息，并且对数据进行匿名化或聚合处理，使其无法追溯到具体用户。</p>
                    <h3>安全保障措施</h3>
                    <p>服务提供商应实施全面的安全策略，包括但不限于网络安全防护、系统漏洞管理、访问控制等，以保护用户数据免受恶意攻击、黑客入侵、数据篡改等安全威胁。</p>
                    <p>定期对安全系统进行审计和评估，及时发现并修复可能存在的安全隐患。同时，建立应急响应机制，在发生安全事件时能够在最短时间内采取措施，最大限度地减少数据损失和对用户的影响。</p>
                    <h2>四、用户的权利和义务</h2>
                    <h3>数据提供的合法性</h3>
                    <p>用户保证所提交的用于区块链时间戳服务的所有数据均为合法获得，并且用户拥有对这些数据的合法处理权。用户不得提交任何侵犯他人知识产权、商业秘密、隐私权或其他合法权益的数据。</p>
                    <p>对于因用户提交非法数据而导致的任何法律纠纷，用户将承担全部法律责任，服务提供商不承担任何因用户违法行为而产生的连带责任。</p>
                    <h3>隐私保护意识</h3>
                    <p>用户应当了解区块链时间戳服务的工作原理和可能涉及的的隐私风险。在使用服务过程中，谨慎选择要进行时间戳标记的数据，避免包含敏感的个人隐私信息，除非用户明确知晓并接受相关风险。</p>
                    <p>用户有权要求服务提供商对其数据的处理和隐私保护措施进行解释和说明。如果用户认为服务提供商的操作可能危及其隐私安全，可以向服务提供商提出质疑和投诉，服务提供商应及时给予回应和处理。</p>
                    <h3>数据访问与删除权</h代码>
                    <p>用户有权在合理的时间内访问自己提交的用于时间戳服务的数据，并要求服务提供商提供数据的使用情况报告。服务提供商应在收到用户请求后的合理时间内（不超过 2 个工作日），向用户提供相关信息。</p>
                    <p>用户有权要求服务提供商删除其不再需要的时间戳数据。在收到用户的删除请求后，服务提供商将在确认用户身份和数据所有权后，在合理时间内（不超过 2 个工作日）从其所在的存储系统中删除相关数据。但需要注意的是，由于区块链技术的特性，已记录在区块链上的时间戳信息可能无法完全删除，但服务提供商将采取措施确保这些数据不再被关联到用户身份，并在技术可行的情况下对数据进行匿名化处理。</p>
                    <h2>五、数据共享与第三方服务</h2>
                    <h3>第三方合作伙伴</h3>
                    <p>在某些情况下，服务提供商可能需要与第三方合作伙伴（如区块链基础设施提供商、审计机构等）合作，以提供更优质的区块链时间戳服务。在与第三方共享用户数据之前，服务提供商将确保第三方遵守与本协议同等严格的隐私保护标准，并与第三方签订保密协议。</p>
                    <p>向用户明确告知第三方合作伙伴的身份和数据共享的目的、范围，在获得用户的明示同意后，方可进行数据共享。用户有权拒绝服务提供商与特定第三方的合作，如果用户拒绝，服务提供商应在不影响服务质量的前提下，寻求其他替代解决方案。</p>
                    <h3>法律法规要求的数据披露</h3>
                    <p>如果服务提供商收到来自政府部门、执法机构或其他有权机关的合法数据请求，且该请求符合相关法律法规的规定，服务提供商可能需要向这些机构披露用户数据。在这种情况下，服务提供商将尽力确保数据披露的范围仅限于满足法律要求的最低限度，并在法律允许的范围内及时通知用户。</p>
                    <h2>六、协议变更与终止</h2>
                    <h3>协议变更</h3>
                    <p>服务提供商有权根据业务发展、法律法规变化或技术改进等因素，对本隐私协议 / 使用协议进行适当修改。在协议变更前，服务提供商将通过合理的方式（如在官方网站发布通知、向用户发送电子邮件等）提前通知用户。</p>
                    <p>用户在收到协议变更通知后的 2 个工作日内有权选择接受或 终止使用服务。如果用户在规定时间内未提出异议，则视为用户接受协议变更内容；如果用户不同意协议变更，可以终止使用区块链时间戳服务，服务提供商将按照本协议的规定处理用户数据的删除和隐私保护相关事宜。</p>
                    <h3>协议终止</h3>
                    <p>用户可以随时终止使用区块链时间戳服务。在用户提出终止请求后，服务提供商将按照本协议的规定处理用户数据的删除和相关结算事宜（如有）。</p>
                    <p>服务提供商在因不可抗力、用户严重违反本协议或其他合法原因决定终止服务时，将提前通知用户，并在终止服务后按照本协议的规定妥善处理用户数据，确保用户隐私安全。</p>
                    <h2>七、争议解决</h2>
                    <p>如果用户与服务提供商在本协议的执行过程中发生争议，双方应首先尝试通过友好协商解决。协商过程中，双方应本着平等、诚信、互利的原则，充分沟通，寻求解决方案。</p>
                    <p>如果协商无法解决争议，双方同意将争议提交至有管辖权的四川省法院或仲裁机构进行裁决。在争议解决期间，除涉及争议的部分外，双方应继续履行本协议的其他条款。</p>
                    <h2>八、附则</h2>
                    <p>本协议构成用户与服务提供商之间关于区块链时间戳服务使用和隐私保护的完整协议，取代之前双方就同一主题所达成的任何口头或书面协议。</p>
                    <p>本协议的解释权归服务提供商所有，但解释过程应遵循公平、合理的原则，不得损害用户的合法权益。</p>
                    <p>本协议自用户开始使用区块链时间戳服务之日起生效，有效期至用户终止使用服务或协议被依法解除或终止之日止。
                `;
                Swal.fire({
                    title: '用户协议/隐私协议',
                    html: userAgreementContent,
                    showCloseButton: true,
                    showCancelButton: true,
                    confirmButtonText: '同意',
                    cancelButtonText: '不同意',
                    width: '900px',
                    customClass: {
                        popup: 'centered-popup'
                    }
                }).then((result) => {
                    if (result.isConfirmed) {
                        Swal.close();
                        isagree = true;
                        console.log('用户同意协议');
                    } else {
                        Swal.close();                      
                        console.log('用户不同意协议');
                    }
                });
            });
        });