from flask import Flask
import pymysql
app = Flask(__name__)
global db
db = pymysql.connect(host='mysql.sqlpub.com',database="ccbcts", user='sqladmin', passwd='ALPSHkGRSeMQgk9r', port=3306)
@app.route("/")
def hello():
    global db
    cursor = db.cursor()
    
    # 使用 execute()  方法执行 SQL 查询
    cursor.execute("SELECT VERSION()")
    
    # 使用 fetchone() 方法获取单条数据.
    data = cursor.fetchone()
    
    return str(data)

if __name__ == "__main__":
    app.run()