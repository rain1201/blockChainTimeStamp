from flask import Flask,request,jsonify
import pymysql
import redis
import random
import string
app = Flask(__name__)
global db,rd
db = pymysql.connect(host='mysql.sqlpub.com',database="ccbcts", user='sqladmin', passwd='ALPSHkGRSeMQgk9r', port=3306)
pool = redis.ConnectionPool(host='localhost', port=6379, decode_responses=True)
rd = redis.Redis(connection_pool=pool)
def generate_random_string(length):
    letters = string.ascii_letters + string.digits  # 包含字母和数字
    random_string = ''.join(random.choice(letters) for _ in range(length))
    return random_string
@app.route("/api/getEmailCaptcha",methods=["post"])
def getEmailCaptcha():
    email=request.json.get("email")
    global db,rd
    cursor = db.cursor()
    db.ping(reconnect=True) 
    emailCount=cursor.execute("SELECT * FROM users WHERE email=%s",email)
    if(emailCount!=0):return jsonify({"code":1,"msg":"邮箱已被注册"})
    if(rd.exists(email+"EmailCaptchaTime")):return jsonify({"code":2,"msg":"请求过于频繁"})
    rd.setex(email+"EmailCaptcha",600,generate_random_string(6))
    rd.setex(email+"EmailCaptchaTime",60,0)
    return jsonify({"code":0,"msg":"成功"})

if __name__ == "__main__":
    app.run()