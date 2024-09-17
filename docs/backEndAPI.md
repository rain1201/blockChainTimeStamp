### getEmailChaptcha()

##### 参数：

 - `email: string`

   注册使用的邮箱地址

##### 返回值：

 - `code: int`

   请求结果

- `msg: string`

  请求结果的文字说明

##### 注释：

​	请求邮箱验证码

### doRegister()

##### 参数：

 - `email: string`

   用于注册的邮箱

- `chaptcha: int`

  邮箱验证码

- `passwordHash: string`

  用户密码的hash值

##### 返回值：

 - `code: int`

   请求结果

- `msg: string`

  请求结果的文字说明

##### 注释：

​	进行注册

### doLogin()

##### 参数：

 - `email: string`

   登录使用的邮箱

- `password: string`

  密码的hash与时间戳进行字符串连接后再取hash的结果

- `_t: int`

  登录时间戳

##### 返回值：

 - `code: int`

   请求结果

- `msg: string`

  请求结果的文字说明

- `firstLogin: bool`

  如果是第一次登陆则为真

- `authId: string`

  本次会话的用户标识id

##### 注释：

​	进行登录

### resetPassword（）

##### 参数：

 - `email: string`

   用于注册的邮箱

- `chaptcha: int`

  邮箱验证码，调用`getEmailChaptcha()`获取

- `passwordHash: string`

  用户新设置密码的hash值

##### 返回值：

 - `code: int`

   请求结果

- `msg: string`

  请求结果的文字说明

##### 注释：

​	修改用户密码

### changeUserProfile()

##### 参数：

	- `authId: string`

​	由`doLogin()`返回

- `blockChainAddress[optional]: string`

  新的用户区块链地址(仅允许修改一次)

- `selfIdentity[optional]: string`

  新的默认用户自定义标识

##### 返回值：

 - `code: int`

   请求结果

- `msg: string`

  请求结果的文字说明

##### 注释：

​	修改用户信息

### queryUserRecord()

##### 参数：

 - `authId: string`

​	由`doLogin()`返回

- `beginPosition: int`

  查询记录起始位置

- `count: int`

  查询数量

##### 返回值：

 - `code: int`

   请求结果

- `msg: string`

  请求结果的文字说明

- `result: list`

  返回的记录

  - `name: string`

    记录名称

  - `recordId: string`

    记录ID

  - `_t: int`

    记录产生时间戳

##### 注释：

​	查询用户已有记录