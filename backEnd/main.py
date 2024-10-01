from flask import Flask,request,jsonify
import pymysql
import redis
import random
import string,time,math,hashlib,uuid
import requests
app = Flask(__name__)
global db,rd
db = pymysql.connect(host='mysql.sqlpub.com',database="ccbcts", user='sqladmin', passwd='ALPSHkGRSeMQgk9r', port=3306)
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
    if("@" in username):userCount=cursor.execute("SELECT * FROM users WHERE email=%s",username)
    #else:userCount=cursor.execute("SELECT * FROM users WHERE username=%s",username)
    if(userCount==0):return jsonify({"code":3,"msg":"未找到用户"})
    if(userCount>1):return jsonify({"code":4,"msg":"用户数量错误"})
    if(hashlib.sha3_256((str(cursor.fetchone()[2])+str(t)).encode()).hexdigest()!=password):return jsonify({"code":5,"msg":"密码错误"})
    userInf=cursor.fetchone()
    while(1):
        newSessionId=uuid.uuid4().hex
        if(not rd.exists(str(newSessionId)+"sessionId")):
            rd.setex(str(newSessionId)+"sessionId",userInf[0],86400)
            rd.sadd(str(userInf[0])+"sessionList",newSessionId)
            break
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
    emailCount=cursor.execute("SELECT * FROM users WHERE email=%s",email)
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
    emailCount=cursor.execute("SELECT * FROM users WHERE email=%s",email)
    if(emailCount==0):return jsonify({"code":2,"msg":"邮箱不存在"})    
    if(not rd.exists(email+"EmailCaptcha") or rd.get(email+"EmailCaptcha")!=captcha):return jsonify({"code":3,"msg":"验证码错误"})
    cnt=cursor.execute('UPDATE users SET password=%s WHERE email=%s;',[password,email])
    if(cnt==1):return jsonify({"code":0,"msg":"成功"})
    else:return jsonify({"code":4,"msg":"修改密码失败"})
if __name__ == "__main__":
    app.run()