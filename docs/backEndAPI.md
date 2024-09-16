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