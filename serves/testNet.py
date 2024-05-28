import csv
import random
from getPredict import get_predict

# 定义CSV文件的路径
csv_file_path = 'model/20240527240527001001/默认模型.csv'

# 读取CSV文件
with open(csv_file_path, newline='', encoding='utf-8') as csvfile:
    reader = csv.reader(csvfile)
    data = list(reader)
rightNumber = 0
for i in range(1, 100000):
    # 随机选择一行
    random_row = random.choice(data)
    if random_row[0] == 'id':
        continue
    vector = random_row[1:-1]
    for j in range(len(vector)):
        vector[j] = float(vector[j])
    # 输出随机选择的那一行
    label = random_row[-1]
    if get_predict(vector, '') == label:
        rightNumber = rightNumber + 1
    print(f"第{i}轮测试，当前正确率为{rightNumber * 100 / i}%")
