以下是基于提供的Python Flask代码生成的API文档：

**API 文档**

### 1. 获取邮箱验证码

* **URL**: `/api/getEmailCaptcha`
* **方法**: `POST`
* **请求参数**:
 + `email`: 邮箱地址
* **返回值**:
 + `code`: 状态码（0：成功，1：参数过少，2：请求过于频繁，3：发送邮件失败）
 + `msg`: 状态信息

### 2. 登录

* **URL**: `/api/login`
* **方法**: `POST`
* **请求参数**:
 + `username`: 用户名
 + `password`: 密码（原始密码加盐后取hash，与时间戳连接后再取hash）
 + `t`: 时间戳
* **返回值**:
 + `code`: 状态码（0：成功，1：参数过少，2：请求超时，3：未找到用户，4：用户数量错误，5：密码错误）
 + `msg`: 状态信息
 + `userId`: 用户ID
 + `sessionId`: 会话ID
 + `hasEthAddress`: 用户是否绑定metamask，未绑定为0

### 3. 登出

* **URL**: `/api/logout`
* **方法**: `POST`
* **请求参数**:
 + `userId`: 用户ID
 + `sessionId`: 会话ID
* **返回值**:
 + `code`: 状态码（0：成功，1：参数过少，2：会话ID无效）
 + `msg`: 状态信息

### 4. 注册

* **URL**: `/api/signup`
* **方法**: `POST`
* **请求参数**:
 + `email`: 邮箱地址
 + `username`: 用户名
 + `password`: 密码（加盐后取hash）
 + `captcha`: 验证码
* **返回值**:
 + `code`: 状态码（0：成功，1：参数过少，2：邮箱已被注册，3：验证码错误，4：创建用户失败）
 + `msg`: 状态信息

### 5. 重置密码

* **URL**: `/api/resetPassword`
* **方法**: `POST`
* **请求参数**:
 + `email`: 邮箱地址
 + `password`: 新密码
 + `captcha`: 验证码
* **返回值**:
 + `code`: 状态码（0：成功，1：参数过少，2：邮箱不存在，3：验证码错误，4：修改密码失败）
 + `msg`: 状态信息

### 6. 使用Metamask登录

* **URL**: `/api/loginWithMeta`
* **方法**: `POST`
* **请求参数**:
 + `address`: Meta地址
 + `sign`: 签名("Trying to login timestamp service, time is {TIMESTAMP}")
 + `t`: 时间戳
* **返回值**:
 + `code`: 状态码（0：成功，1：参数过少，2：请求超时，3：未找到用户，4：用户数量错误，5：密码错误）
 + `msg`: 状态信息
 + `userId`: 用户ID
 + `sessionId`: 会话ID

### 7. 生成记录ID

* **URL**: `/api/generateRecordID`
* **方法**: `POST`
* **请求参数**:
 + `userId`: 用户ID
 + `sessionId`: 会话ID
* **返回值**:
 + `code`: 状态码（0：成功，1：参数过少，2：会话过期，3：未绑定）
 + `msg`: 状态信息
 + `recordId`: 记录ID

### 8. 设置以太坊地址

* **URL**: `/api/setEthAddress`
* **方法**: `POST`
* **请求参数**:
 + `userId`: 用户ID
 + `sessionId`: 会话ID
 + `address`: 以太坊地址
 + `sign`: 签名（"Trying to sign in timestamp service with {EMAIL}, time is {TIMESTAMP}"）
 + `t`: 时间戳
* **返回值**:
 + `code`: 状态码（0：成功，1：参数过少，2：请求超时，3：会话过期，4：地址已被绑定，5：已绑定，6：签名错误）
 + `msg`: 状态信息

### 9. 上传记录

* **URL**: `/api/uploadRecord`
* **方法**: `POST`
* **请求参数**:
 + `recordId`: 记录ID
 + `userId`: 用户ID
 + `sessionId`: 会话ID
 + `fileHash`: 文件哈希
 + `selfSign`: 自签名
 + `txId`: 交易ID
* **返回值**:
 + `code`: 状态码（0：成功，1：参数过少，2：会话过期，3：记录过期）
 + `msg`: 状态信息

### 10. 查询用户记录

* **URL**: `/api/queryUserRecords`
* **方法**: `POST`
* **请求参数**:
 + `userId`: 用户ID
 + `sessionId`: 会话ID
* **返回值**:
 + `code`: 状态码（0：成功，1：参数错误，2：会话过期）
 + `count`: 记录数量
 + `data`: 记录列表

### 11. 查询单个记录详情

* **URL**: `/api/querySingleRecordsDetail`
* **方法**: `POST`
* **请求参数**:
 + `userId`: 用户ID
 + `sessionId`: 会话ID
 + `recordId`: 记录ID
* **返回值**:
 + `code`: 状态码（0：成功，1：参数错误，2：会话过期）
 + `count`: 记录数量
 + `data`: 记录详情

### 12. 更新记录

* **URL**: `/api/updateRecord`
* **方法**: `POST`
* **请求参数**:
 + `recordId`: 记录ID
* **返回值**:
 + `code`: 状态码（0：成功，1：参数错误，2：等待客户返回信息，3：记录不存在，4：交易尚未完成，5：无法解析交易数据，6：区块数据不同步）
 + `msg`: 状态信息