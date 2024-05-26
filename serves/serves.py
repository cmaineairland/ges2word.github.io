'''
Date: 2024-05-25 22:41:42
LastEditors: Qianshanju
E-mail: z1939784351@gmail.com
LastEditTime: 2024-05-26 12:05:25
FilePath: \gesrec\serves\serves.py
'''
from flask import Flask, jsonify, request
from flask_cors import CORS
import os

app = Flask(__name__)
CORS(app)


@app.route('/run_script', methods=['POST'])
def run_script():
    data = request.get_json()
    print(data)
    return 'success'


if __name__ == '__main__':
    # 获取操作系统名称
    if os.name=='nt':
        app.run(host='127.0.0.1', port=5000)
    if os.name=='posix':
        app.run(host='172.20.104.194', port=5000)
