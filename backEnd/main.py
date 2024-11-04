from flask import Flask,request,jsonify
import pymysql
import redis
import random
import string,time,math,hashlib,uuid
import requests,os
from web3 import Web3,HTTPProvider 
app = Flask(__name__)
abi='[{"inputs": [{"internalType": "uint256","name": "fileHash","type": "uint256"},{"internalType": "uint128","name": "recordID","type": "uint128"},{"internalType": "string","name": "selfSign","type": "string"}],"name": "addRecord","outputs": [{"internalType": "uint256","name": "","type": "uint256"}],"stateMutability": "payable","type": "function"},{"inputs": [{"internalType": "uint256","name": "recordPrice","type": "uint256"}],"name": "setPrice","outputs": [{"internalType": "bool","name": "","type": "bool"}],"stateMutability": "nonpayable","type": "function"},{"inputs": [],"stateMutability": "nonpayable","type": "constructor"},{"inputs": [{"internalType": "uint256","name": "value","type": "uint256"}],"name": "withdraw","outputs": [{"internalType": "bool","name": "","type": "bool"}],"stateMutability": "nonpayable","type": "function"},{"inputs": [],"name": "creator","outputs": [{"internalType": "address","name": "","type": "address"}],"stateMutability": "view","type": "function"},{"inputs": [],"name": "price","outputs": [{"internalType": "uint256","name": "","type": "uint256"}],"stateMutability": "view","type": "function"},{"inputs": [{"internalType": "uint256","name": "","type": "uint256"}],"name": "records","outputs": [{"internalType": "uint256","name": "fileHash","type": "uint256"},{"internalType": "uint128","name": "recordID","type": "uint128"},{"internalType": "string","name": "sign","type": "string"}],"stateMutability": "view","type": "function"}]'
contract="0x618399f465602b385ab77adb4b772bdcca8bf601"
global db,rd,w3,ct
db = pymysql.connect(host='mysql.a.hypxs.eu.org',database="ccbcts", user='root', passwd='ALPSHkGRSeMQgk9r', port=2206)
w3 = Web3(Web3.HTTPProvider(' https://rpc.sepolia.org'))
ct=w3.eth.contract(address=w3.to_checksum_address(contract),abi=abi)
pool = redis.ConnectionPool(host='localhost', port=6379, decode_responses=True)
rd = redis.Redis(connection_pool=pool)
def generate_random_string(length:int):
    letters = string.ascii_letters + string.digits  # 包含字母和数字
    random_string = ''.join(random.choice(letters) for _ in range(length))
    return random_string
def send_email(emailList:list,subject:str,html:str):
    apiKey="ts re_frcw2ANL_LWdxuTQeXrU4JqzHzBEThcV9"
    headers={'Content-Type':"application/json",'Authorization': apiKey}
    para={"from": "TimeStampService <ts@ts.hypxs.eu.org>",
          "to": emailList,
          "subject": subject,
          "html": html}
    url='https://api.resend.com/emails' 
    r=requests.post(url=url,json=para,headers=headers)
    return r.status_code==200,r.text
@app.route("/api/getEmailCaptcha",methods=["post"])
def getEmailCaptcha():
    email=request.json.get("email")
    if(email is None):return jsonify({"code":1,"msg":"参数过少"})
    global db,rd
    cursor = db.cursor()
    db.ping(reconnect=True) 
    #emailCount=cursor.execute("SELECT * FROM users WHERE email=%s",email)
    #if(emailCount!=0):return jsonify({"code":1,"msg":"邮箱已被注册"})
    if(rd.exists(email+"EmailCaptchaTime")):return jsonify({"code":2,"msg":"请求过于频繁"})
    captcha=generate_random_string(6)
    r,t=send_email([email],"TimeStamp Service Captcha",captcha)
    if(r):
        rd.setex(email+"EmailCaptcha",600,captcha)
        rd.setex(email+"EmailCaptchaTime",60,0)
        return jsonify({"code":0,"msg":"成功"})
    else:return jsonify({"code":3,"msg":"发送邮件失败"})
@app.route("/api/login",methods=["post"])
def login():
    username=request.json.get("username")
    password=request.json.get("password")
    t=request.json.get("t")
    if(None in [username,password,t]):return jsonify({"code":1,"msg":"参数过少"})
    global db,rd
    if(abs(time.time()-t)==10):return jsonify({"code":2,"msg":"请求超时"})
    db.ping(reconnect=True) 
    cursor = db.cursor()
    userCount=0
    if("@" in username): userCount=cursor.execute('SELECT id,password,ethAddress FROM users WHERE email="%s";',username)
    #else:userCount=cursor.execute("SELECT * FROM users WHERE username=%s",username)
    if(userCount==0):return jsonify({"code":3,"msg":"未找到用户"})
    if(userCount>1):return jsonify({"code":4,"msg":"用户数量错误"})
    userInf=cursor.fetchone()
    if(hashlib.sha3_256((userInf[1].removeprefix("'").removesuffix("'")+str(t)).encode()).hexdigest()!=password):return jsonify({"code":5,"msg":"密码错误"})
    while(1):
        newSessionId=uuid.uuid4().hex
        if(not rd.exists(str(newSessionId)+"sessionId")):
            rd.setex(str(newSessionId)+"sessionId",86400,userInf[0])
            #rd.sadd(str(userInf[0])+"sessionList",newSessionId)
            break
    cursor.close()
    return jsonify({"code":0,"msg":"成功","userId":userInf[0],"sessionId":newSessionId,"hasEthAddress":len(str(userInf[2]))})
"""
@app.route("/api/logoutAll",methods=["post"])
def logoutAll():
    userId=request.json.get("userId")
    sessionId=request.json.get("sessionId")
    if(None in [userId,sessionId]):return jsonify({"code":1,"msg":"参数过少"})
    userId=str(userId)
    global rd
    if(not rd.exists(sessionId+"sessionId") or str(rd.get(sessionId+"sessionId"))!=userId):
        return jsonify({"code":2,"msg":"会话id无效"})
    for _ in range(rd.scard(userId+"sessionList")):
        toRemoveId=rd.spop(userId+"sessionList")
        rd.delete(toRemoveId+"sessionId")
    return jsonify({"code":0,"msg":"成功"})
"""
@app.route("/api/logout",methods=["post"])
def logout():
    userId=request.json.get("userId")
    sessionId=request.json.get("sessionId")
    if(None in [userId,sessionId]):return jsonify({"code":1,"msg":"参数过少"})
    userId=str(userId)
    global rd
    if(not rd.exists(sessionId+"sessionId") or str(rd.get(sessionId+"sessionId"))!=userId):
        return jsonify({"code":2,"msg":"会话id无效"})
    rd.delete(sessionId+"sessionId")
    #rd.srem(userId+"sessionList",sessionId)
    return jsonify({"code":0,"msg":"成功"})
@app.route("/api/signup",methods=["post"])
def signup():
    email=request.json.get("email")
    username=request.json.get("username")
    password=request.json.get("password")
    captcha=request.json.get("captcha")
    if(None in [email,username,password,captcha]):return jsonify({"code":1,"msg":"参数过少"})
    global db,rd
    cursor=db.cursor()
    db.ping(reconnect=True)
    emailCount=cursor.execute("SELECT id FROM users WHERE email=%s",email)
    if(emailCount!=0):return jsonify({"code":2,"msg":"邮箱已被注册"})
    if(not rd.exists(email+"EmailCaptcha") or rd.get(email+"EmailCaptcha")!=captcha):return jsonify({"code":3,"msg":"验证码错误"})
    rd.delete(email+"EmailCaptcha")
    cnt=cursor.execute('INSERT INTO users (email, password, username) VALUES ("%s", "%s", "%s");',[email,password,username])
    db.commit()
    if(cnt==1):return jsonify({"code":0,"msg":"成功"})
    else:return jsonify({"code":4,"msg":"创建用户失败"})
@app.route("/api/resetPassword",methods=["post"])
def resetPassword():
    email=request.json.get("email")
    password=request.json.get("password")
    captcha=request.json.get("captcha")
    if(None in [email,password,captcha]):return jsonify({"code":1,"msg":"参数过少"})
    global db,rd
    cursor=db.cursor()
    db.ping(reconnect=True)
    emailCount=cursor.execute('SELECT id FROM users WHERE email="%s"',email)
    if(emailCount==0):return jsonify({"code":2,"msg":"邮箱不存在"})    
    if(not rd.exists(email+"EmailCaptcha") or rd.get(email+"EmailCaptcha")!=captcha):return jsonify({"code":3,"msg":"验证码错误"})
    cnt=cursor.execute('UPDATE users SET password="%s" WHERE email="%s";',[password,email])
    db.commit()
    if(cnt==1):return jsonify({"code":0,"msg":"成功"})
    else:return jsonify({"code":4,"msg":"修改密码失败"})
@app.route("/api/loginWithMeta",methods=["post"])
def loginWithMeta():
    address=request.json.get("address")
    sign=request.json.get("sign")
    t=request.json.get("t")
    if(None in [address,sign,t]):return jsonify({"code":1,"msg":"参数过少"})
    t=int(t)
    if(abs(t=time.time())>100):return jsonify({"code":2,"msg":"请求超时"})
    global db,rd,w3
    db.ping(reconnect=True) 
    cursor = db.cursor()
    userCount=0
    userCount=cursor.execute("SELECT userId FROM users WHERE ethAddress=%s;",address)
    #else:userCount=cursor.execute("SELECT * FROM users WHERE username=%s",username)
    if(userCount==0):return jsonify({"code":3,"msg":"未找到用户"})
    if(userCount>1):return jsonify({"code":4,"msg":"用户数量错误"})
    if(w3.eth.account.verify_message("Trying to login timestamp service, time is "+str(t),sign)!=address):
        return jsonify({"code":5,"msg":"密码错误"})
    userInf=cursor.fetchone()
    while(1):
        newSessionId=uuid.uuid4().hex
        if(not rd.exists(str(newSessionId)+"sessionId")):
            rd.setex(str(newSessionId)+"sessionId",userInf[0],86400)
            #rd.sadd(str(userInf[0])+"sessionList",newSessionId)
            break
    return jsonify({"code":0,"msg":"成功","userId":userInf[0],"sessionId":newSessionId})
@app.route("/api/generateRecordID",methods=["post"])
def generateRecordID():
    userId=request.json.get("userId")
    sessionId=request.json.get("sessionId")
    if(None in [userId,sessionId]):return jsonify({"code":1,"msg":"参数过少"})
    global rd,db
    db.ping(reconnect=True) 
    cursor = db.cursor()
    if(sessionId!="anonymous" and ((not rd.exists(str(sessionId)+"sessionId")) or rd.get(str(sessionId)+"sessionId")!=str(userId))):
        return jsonify({"code":2,"msg":"会话过期"})
    if(sessionId=="anonymous"):userId="0"
    cnt=cursor.execute('SELECT ethAddress FROM users WHERE id=%s;',[userId])
    if(cursor.fetchone()[0]==""):return jsonify({"code":3,"msg":"未绑定"})
    while(1):
        newRecordId=uuid.uuid4().hex
        if(not rd.exists(str(newRecordId)+"RecordId") and cursor.execute("SELECT id FROM records WHERE recordId=%s;",[newRecordId])==0):
            rd.setex(str(newRecordId)+"RecordId",6000,userId)
            break
    cursor.close()
    return jsonify({"code":0,"msg":"成功","recordId":newRecordId})
@app.route("/api/setEthAddress",methods=["post"])
def setEthAddress():
    userId=request.json.get("userId")
    sessionId=request.json.get("sessionId")    
    address=request.json.get("address")
    sign=request.json.get("sign")
    t=request.json.get("t")
    if(None in [address,sign,t,userId,sessionId]):return jsonify({"code":1,"msg":"参数过少"})
    t=int(t)
    if(abs(t-time.time())==100):return jsonify({"code":2,"msg":"请求超时"})
    global db,rd,w3
    if((not rd.exists(str(sessionId)+"sessionId")) or rd.get(str(sessionId)+"sessionId")!=str(userId)):
        return jsonify({"code":3,"msg":"会话过期"})
    db.ping(reconnect=True) 
    cursor = db.cursor()  
    cnt=0
    cnt=cursor.execute("SELECT ethAddress FROM users WHERE ethAddress=%s;",[address])
    if(cnt!=0):return jsonify({"code":4,"msg":"地址已被绑定"})
    cnt=cursor.execute("SELECT ethAddress,email FROM users WHERE id=%s;",[userId])
    inf=cursor.fetchone()
    if(inf[0]!=None):return jsonify({"code":5,"msg":"已绑定"})
    if(w3.eth.account.verify_message("Trying to sign in timestamp service with %s, time is %s"%(inf[1],str(t)),sign)!=address):
        return jsonify({"code":6,"msg":"签名错误"})
    cnt=cursor.execute('UPDATE users SET ethAddress=%s WHERE id=%s;',[address,userId])
    db.commit()
    return jsonify({"code":0,"msg":"成功"})
@app.route("/api/uploadRecord",methods=["post"])
def uploadRecord():
    recordId=request.json.get("recordId")
    userId=request.json.get("userId")
    sessionId=request.json.get("sessionId")
    fileHash=request.json.get("fileHash")
    selfSign=request.json.get("selfSign")
    txId=request.json.get("txId")
    if(None in [userId,sessionId,recordId,selfSign,sessionId,fileHash,txId]):return jsonify({"code":1,"msg":"参数过少"})
    global rd,db
    db.ping(reconnect=True) 
    cursor = db.cursor()    
    if(sessionId!="anonymous" and ((not rd.exists(str(sessionId)+"sessionId")) or rd.get(str(sessionId)+"sessionId")!=str(userId))):
        return jsonify({"code":2,"msg":"会话过期"})
    if(not rd.exists(str(recordId)+"RecordId") or rd.get(str(recordId)+"RecordId")!=str(userId)):
        return jsonify({"code":3,"msg":"会话过期"})
    cnt=0
    cnt=cursor.execute('INSERT INTO records (recordId, fileHash, selfSign, txId, status, userId) VALUES ("%s", "%s", "%s", "%s", 1, %s);',
                   [recordId, fileHash, selfSign, txId,userId])
    db.commit()
    rd.delete(str(recordId)+"RecordId")
    return jsonify({"code":cnt-1,"msg":"完成"})
@app.route("/api/queryUserRecords",methods=["post"])
def queryUserRecords():
    userId=request.json.get("userId")
    sessionId=request.json.get("sessionId") 
    if(None in [userId,sessionId]):return jsonify({"code":1,"msg":"参数错误"})
    global rd,db
    if(((not rd.exists(str(sessionId)+"sessionId")) or rd.get(str(sessionId)+"sessionId")!=str(userId))):
        return jsonify({"code":2,"msg":"会话过期"})
    db.ping(reconnect=True) 
    cursor = db.cursor() 
    cnt=0
    cnt=cursor.execute('SELECT recordId,fileHash FROM records WHERE userId=%s;',[userId])
    ret={"code":0,"count":cnt,"data":[]}
    for _ in range(cnt):ret["data"].append(cursor.fetchone())
    return jsonify(ret)
@app.route("/api/querySingleRecordsDetail",methods=["post"])
def querySingleRecords():
    userId=request.json.get("userId")
    sessionId=request.json.get("sessionId") 
    recordId=request.json.get("recordId")

    if(None in [userId,sessionId,recordId]):return jsonify({"code":1,"msg":"参数错误"})
    global rd,db
    if(sessionId!="anonymous" and ((not rd.exists(str(sessionId)+"sessionId")) or rd.get(str(sessionId)+"sessionId")!=str(userId))):
        return jsonify({"code":2,"msg":"会话过期"})
    db.ping(reconnect=True) 
    cursor = db.cursor() 
    cnt=0
    if(sessionId!="anonymous"):cnt=cursor.execute('SELECT recordId, fileHash, selfSign, txId, status, userId' 
    'FROM records WHERE userId=%s AND recordId="%s";',[userId,recordId])
    else:cnt=cursor.execute('SELECT recordId, fileHash, selfSign, txId, status, userId' 
    'FROM records WHERE recordId="%s" AND (status=3 OR status=4);',[recordId])
    ret={"code":0,"count":cnt,"data":[]}
    for _ in range(cnt):ret["data"].append(cursor.fetchone())
    return jsonify(ret)
@app.route("/api/updateRecord",methods=["post"])
def updateRecord():
    recordId=request.json.get("recordId")
    if(recordId==None):return jsonify({"code":1,"msg":"参数错误"})
    global rd,db,w3,ct
    if(rd.exists(str(recordId)+"RecordId")):return jsonify({"code":2,"msg":"等待客户返回信息"})
    db.ping(reconnect=True) 
    cursor = db.cursor() 
    cnt=0
    cnt=cursor.execute('SELECT status,txId FROM records WHERE recordId="%s";',[recordId])
    if(cnt==0):return jsonify({"code":3,"msg":"记录不存在"})
    inf=cursor.fetchone()
    if(inf[0]==1):
        try:
        #if(True):
            tx=w3.eth.get_transaction(inf[1].removeprefix("'").removesuffix("'"))
            blockNumber = tx.blockNumber
            block = w3.eth.get_block(blockNumber)
            ts = block.timestamp            
            tx.input.hex()
        except:return jsonify({"code":4,"msg":"交易尚未完成"})
        try:blockInf=ct.decode_function_input(tx.input)
        except:
            cursor.execute('UPDATE records SET status=2 WHERE recordId="%s";',[recordId]);
            db.commit()
            return jsonify({"code":5,"msg":"无法解析交易数据"})
        blockInf=blockInf[1]
        cursor.execute('SELECT fileHash,selfSign,userId FROM records WHERE recordId="%s";',[recordId]);
        databaseInf=cursor.fetchone();
        if(databaseInf[0].lower().removeprefix("'").removesuffix("'")!=hex(blockInf["fileHash"]).removeprefix("0x") or 
           databaseInf[1].removeprefix("'").removesuffix("'")!=blockInf["selfSign"]):
            cursor.execute('UPDATE records SET status=2 WHERE recordId="%s";',[recordId]);
            db.commit()
            return jsonify({"code":6,"msg":"区块数据不同步"})
        cursor.execute('SELECT ethAddress FROM users WHERE id=%s;',[databaseInf[2]])
        if(cursor.fetchone()[0].removeprefix("'").removesuffix("'")!=tx.get("from") and databaseInf[2]!=0):
            cursor.execute('UPDATE records SET status=2 WHERE recordId="%s";',[recordId]);
            db.commit()
            return jsonify({"code":6,"msg":"区块数据不同步"})
        cursor.execute('UPDATE records SET status=3 WHERE recordId="%s";',[recordId]);
        cursor.execute('UPDATE records SET `timestamp`=%s WHERE recordId="%s";',[ts,recordId]);
        db.commit()
        return jsonify({"code":0,"msg":"记录已更新"})
    elif(inf[0]==2):return jsonify({"code":1,"msg":"区块数据不同步"})
    elif(inf[0]==3):return jsonify({"code":0,"msg":"记录已更新"})
    elif(inf[0]==4):return jsonify({"code":3,"msg":"记录不存在"})
    else:return jsonify({"code":1,"msg":"数据错误"})
@app.route("/api/upgrade",methods=["get"])
def upgreade():    
    return str(os.system("cd /home/azureuser/blockChainTimeStamp && git pull"))
if __name__ == "__main__":
    app.run()