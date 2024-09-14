### constructor()

##### 参数

​	无

##### 注释

​	创建合约，并记录创建者地址。

### addRecord()

##### 参数

	- `[in] fileHash`

​	类型：String

​	需要记录的文件哈希

- `[in] recordID`

  类型：String

  服务器提供的记录ID，用于与服务器同步数据

 - `[in,optional] filePart`

   类型：String

   用户给出的文件部分内容，用于防止hash碰撞

- `[in,optional] selfSign`

  类型：String

  用户给出的个人信息描述

##### 返回值

​	类型：int

​	反回错误码：

- 0：操作成功
- 1：记录ID冲突
- 2：转账金额不足

##### 注释

​	向合约添加一条记录

### withdraw()

##### 参数

- `[in] value`

​	类型：int

​	取出金额

##### 返回值

​	类型：bool

​	取出是否成功

##### 注释

​	使用创建者账户取出合约中的余额