'''
Date: 2024-05-25 22:41:42
LastEditors: Qianshanju
E-mail: z1939784351@gmail.com
LastEditTime: 2024-05-26 23:33:34
FilePath: \gesrec\serves\serves.py
'''
from flask import Flask, jsonify, request
from flask_cors import CORS
import os
from getNews import getNews

app = Flask(__name__)
CORS(app)


@app.route('/', methods=['POST'])
def getMessage():
    data = request.get_json()
    result = {'result': ''}
    if data == None:
        result['result'] = 'success'
        return result
    print(data)

    if data['type'] == 'getNews':

        result['result'] = getNews(data['newsTitle'])
        return result


if __name__ == '__main__':
    # 获取操作系统名称
    if os.name == 'nt':
        app.run(host='127.0.0.1', port=5000)
    if os.name == 'posix':
        app.run(host='172.20.104.194', port=5000)
