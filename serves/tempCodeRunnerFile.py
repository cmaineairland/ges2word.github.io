from flask import Flask, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)


@app.route('/run_script')
def run_script():
    text = "Your text here"  # 替换为你要转换的文本
    json_data = {"text": text}
    return jsonify(json_data)


if __name__ == '__main__':
    app.run(host='127.0.0.1', port=5000)
