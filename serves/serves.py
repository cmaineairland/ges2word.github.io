'''
Date: 2024-05-25 22:41:42
LastEditors: Qianshanju
E-mail: z1939784351@gmail.com
LastEditTime: 2024-05-28 13:26:24
FilePath: \gesrec\serves\serves.py
'''
from flask import Flask, jsonify, request
from flask_cors import CORS
import os
from getNews import getNews
from getPredict import get_predict

app = Flask(__name__)
CORS(app)


@app.route('/', methods=['POST'])
def getMessage():
    data = request.get_json()
    result = {'result': ''}
    print(data)
    if 'type' in data and data['type'] == 'ping':
        result['result'] = 'pingSuccess'
        return result, 200
    if 'type' in data and data['type'] == 'getNews':
        result['result'] = getNews(data['newsTitle'])
        return result, 200
    if 'type' in data and data['type'] == 'Landmarks':
        result['result'] = get_predict(eval(data['value']),
                                       data['selectedModel'])

        return result, 200
    else:
        result['result'] = 'invalid request'
        return result, 400


if __name__ == '__main__':
    # 获取操作系统名称
    if os.name == 'nt':
        app.run(host='127.0.0.1', port=5000)
    elif os.name == 'posix':
        app.run(host='172.19.38.20',
                ssl_context=('ca.crt', 'ca.key'),
                port=5000)
