from flask import Flask,request,jsonify
import pymysql
import redis
import random
import string,time,math,hashlib,uuid
import requests
from web3 import Web3,HTTPProvider 
app = Flask(__name__)
global db,rd,w3
db = pymysql.connect(host='mysql.sqlpub.com',database="ccbcts", user='sqladmin', passwd='ALPSHkGRSeMQgk9r', port=3306)
w3 = Web3(Web3.HTTPProvider(' https://rpc.sepolia.org'))
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
    if("@" in username):userCount=cursor.execute("SELECT id FROM users WHERE email=%s;",username)
    #else:userCount=cursor.execute("SELECT * FROM users WHERE username=%s",username)
    if(userCount==0):return jsonify({"code":3,"msg":"未找到用户"})
    if(userCount>1):return jsonify({"code":4,"msg":"用户数量错误"})
    userInf=cursor.fetchone()
    if(hashlib.sha3_256((str(userInf[2])+str(t)).encode()).hexdigest()!=password):return jsonify({"code":5,"msg":"密码错误"})
    while(1):
        newSessionId=uuid.uuid4().hex
        if(not rd.exists(str(newSessionId)+"sessionId")):
            rd.setex(str(newSessionId)+"sessionId",userInf[0],86400)
            rd.sadd(str(userInf[0])+"sessionList",newSessionId)
            break
    cursor.close()
    return jsonify({"code":0,"msg":"成功",userId:userInf[0],sessionId:newSessionId})
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
    rd.srem(userId+"sessionList",sessionId)
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
    cnt=cursor.execute('INSERT INTO users (email, password, username) VALUES ("%s", "%s", "%s");',[email,password,username])
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
    emailCount=cursor.execute("SELECT id FROM users WHERE email=%s",email)
    if(emailCount==0):return jsonify({"code":2,"msg":"邮箱不存在"})    
    if(not rd.exists(email+"EmailCaptcha") or rd.get(email+"EmailCaptcha")!=captcha):return jsonify({"code":3,"msg":"验证码错误"})
    cnt=cursor.execute('UPDATE users SET password=%s WHERE email=%s;',[password,email])
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
    userCount=cursor.execute("SELECT * FROM users WHERE ethAddress=%s;",address)
    #else:userCount=cursor.execute("SELECT * FROM users WHERE username=%s",username)
    if(userCount==0):return jsonify({"code":3,"msg":"未找到用户"})
    if(userCount>1):return jsonify({"code":4,"msg":"用户数量错误"})
    if(not w3.eth.account.verify_message("Trying to login timestamp service, time is "+str(t),address)):
        return jsonify({"code":5,"msg":"密码错误"})
    userInf=cursor.fetchone()
    while(1):
        newSessionId=uuid.uuid4().hex
        if(not rd.exists(str(newSessionId)+"sessionId")):
            rd.setex(str(newSessionId)+"sessionId",userInf[0],86400)
            rd.sadd(str(userInf[0])+"sessionList",newSessionId)
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
    if(sessionId!="anonymous" and ((not rd.exists(str(sessionId)+"sessionId")) or rd.get(str(sessionId)+"sessionId")!=userId)):
        return jsonify({"code":2,"msg":"会话过期"})
    if(sessionId=="anonymous"):userId=0
    while(1):
        newRecordId=uuid.uuid4().hex
        if(not rd.exists(str(newRecordId)+"RecordId") and cursor.execute("SELECT id FROM records WHERE recordId=%s;",[newRecordId])==0):
            rd.setex(str(newRecordId)+"RecordId",userId,600)
            break
    cursor.close()
    return jsonify({"code":0,"msg":"成功","recordId":newRecordId})
@app.route("/api/setEthAddress",method=["post"])
def setEthAddress():
    userId=request.json.get("userId")
    sessionId=request.json.get("sessionId")    
    address=request.json.get("address")
    sign=request.json.get("sign")
    t=request.json.get("t")
    if(None in [address,sign,t,userId,sessionId]):return jsonify({"code":1,"msg":"参数过少"})
    t=int(t)
    if(abs(t=time.time())>100):return jsonify({"code":2,"msg":"请求超时"})
    global db,rd,w3
    if((not rd.exists(str(sessionId)+"sessionId")) or rd.get(str(sessionId)+"sessionId")!=userId):
        return jsonify({"code":3,"msg":"会话过期"})
    db.ping(reconnect=True) 
    cursor = db.cursor()  
    cnt=0
    cnt=cursor.execute("SELECT ethAddress FROM users WHERE ethAddress=%s;",[address])
    if(cnt!=0):return jsonify({"code":4,"msg":"地址已被绑定"})
    cnt=cursor.execute("SELECT ethAddress,email FROM users WHERE id=%s;",[userId])
    inf=cursor.fetchone()
    if(inf[0]!=None):return jsonify({"code":5,"msg":"已绑定"})
    if(not w3.eth.account.verify_message("Trying to sign in timestamp service with %s, time is %s"%(inf[1],str(t)),address)):
        return jsonify({"code":6,"msg":"签名错误"})
    cnt=cursor.execute('UPDATE users SET ethAddress=%s WHERE id=%s;',[address,userId])
    return jsonify({"code":0,"msg":"成功"})    
@app.route("/api/uploadRecord",methods=["post"])
def uploadRecord():
    recordId=request.json.get("recordId")
    userId=request.json.get("userId")
    sessionId=request.json.get("sessionId")
    fileHash=request.json.get("fileHash")
    selfSign=request.json.get("selfSign")
    transactionId=request.json.get("transactionId")
    if(None in [userId,sessionId,recordId,selfSign,sessionId,fileHash,transactionId]):return jsonify({"code":1,"msg":"参数过少"})
    global rd,db
    db.ping(reconnect=True) 
    cursor = db.cursor()    
    if(sessionId!="anonymous" and ((not rd.exists(str(sessionId)+"sessionId")) or rd.get(str(sessionId)+"sessionId")!=userId)):
        return jsonify({"code":2,"msg":"会话过期"})
    if(not rd.exists(str(recordId)+"RecordId") or rd.get(str(recordId)+"RecordId")!=userId):
        return jsonify({"code":3,"msg":"会话过期"})
    cnt=0
    cnt=cursor.execute('INSERT INTO records (recordId, fileHash, selfSign, transactionId, status, userId) VALUES ("%s", "%s", "%s", "%s", 1, %s);',
                   [recordId, fileHash, selfSign, transactionId,userId])
    return jsonify({"code":cnt-1,"msg":"完成"})
@app.route("/api/queryRecords",methods=["post"])
def queryRecords():
    userId=request.json.get("userId")
    sessionId=request.json.get("sessionId") 
    count=request.json.get("count")
    begin=request.json.get("begin")
    if(None in [userId,sessionId,count,begin] or count>100):return jsonify({"code":1,"msg":"参数错误"})
    global rd,db
    if(((not rd.exists(str(sessionId)+"sessionId")) or rd.get(str(sessionId)+"sessionId")!=userId)):
        return jsonify({"code":2,"msg":"会话过期"})
    db.ping(reconnect=True) 
    cursor = db.cursor() 
    cnt=0
    cnt=cursor.execute('SELECT id,fileHash FROM records WHERE userId=%s AND id>%s LIMIT %s;',[userId,begin,count])
    ret={"code":0,"count":cnt,"data":[]}
    for _ in range(cnt):ret["data"].append(cursor.fetchone())
    return jsonify(ret)
@app.route("/api/querySingleRecordsDetail",methods=["post"])
def querySingleRecords():
    userId=request.json.get("userId")
    sessionId=request.json.get("sessionId") 
    recordId=request.json.get("recordId")
    if(None in [userId,sessionId,count,begin] or count>100):return jsonify({"code":1,"msg":"参数错误"})
    global rd,db
    if(sessionId!="anonymous" and ((not rd.exists(str(sessionId)+"sessionId")) or rd.get(str(sessionId)+"sessionId")!=userId)):
        return jsonify({"code":2,"msg":"会话过期"})
    db.ping(reconnect=True) 
    cursor = db.cursor() 
    cnt=0
    if(sessionId!="anonymous"):cnt=cursor.execute('SELECT recordId, fileHash, selfSign, transactionId, status, userId' 
    'FROM records WHERE userId=%s AND recordId="%s";',[userId,recordId])
    else:cnt=cursor.execute('SELECT recordId, fileHash, selfSign, transactionId, status, userId' 
    'FROM records WHERE recordId="%s" AND (status=3 OR status=4);',[recordId])
    ret={"code":0,"count":cnt,"data":[]}
    for _ in range(cnt):ret["data"].append(cursor.fetchone())
    return jsonify(ret)
if __name__ == "__main__":
    app.run()