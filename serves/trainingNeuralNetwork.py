import pandas as pd  # 导入pandas库用于数据处理
import numpy as np  # 导入numpy库用于数值计算
import json  # 导入json库用于处理JSON文件
import torch  # 导入PyTorch库用于深度学习
import torch.nn as nn  # 导入PyTorch的神经网络模块
import torch.optim as optim  # 导入PyTorch的优化器模块
from torch.utils.data import DataLoader, Dataset, Subset  # 导入PyTorch的数据加载器、数据集和数据子集工具
from sklearn.preprocessing import StandardScaler  # 导入sklearn的标准化工具
from sklearn.metrics import accuracy_score  # 导入sklearn的准确率计算工具
from sklearn.model_selection import StratifiedShuffleSplit  # 导入sklearn的分层抽样工具
from MyNetModel import NeuralNetwork  # 从自定义模块MyNetModel中导入NeuralNetwork类
import time


def seconds_to_hms(seconds):
    hours = seconds // 3600
    minutes = (seconds % 3600) // 60
    remaining_seconds = seconds % 60
    return hours, minutes, remaining_seconds


# 自定义数据集类
class CustomDataset(Dataset):

    def __init__(self, data, labels):  # 初始化方法
        self.data = data  # 保存数据
        self.labels = labels  # 保存标签

    def __len__(self):  # 返回数据集的大小
        return len(self.data)  # 返回数据长度

    def __getitem__(self, idx):  # 根据索引返回数据和标签
        return torch.tensor(self.data[idx], dtype=torch.float32), torch.tensor(
            self.labels[idx], dtype=torch.long)  # 返回数据和标签的Tensor表示


# 数据加载和预处理函数
def load_data(csv_file, json_file):
    data_df = pd.read_csv(csv_file)  # 从CSV文件中读取数据
    with open(json_file, 'r', encoding='utf-8') as f:  # 打开JSON文件
        json_data = json.load(f)  # 读取JSON数据

    num_classes = json_data['num']  # 获取类别数量
    class_dict = json_data['dic']  # 获取类别字典

    vectors = data_df.iloc[:, 1:-1].values  # 提取数据向量，忽略第一列（ID列）
    labels = data_df.iloc[:, -1].apply(
        lambda x: class_dict.index(x)).values  # 将标签转换为数值表示
    return vectors, labels, num_classes  # 返回数据向量、标签和类别数量


# 训练模型函数
def train_model(model, train_loader, criterion, optimizer, num_epochs=20):
    for epoch in range(num_epochs):  # 遍历每个epoch
        model.train()  # 将模型设置为训练模式
        running_loss = 0.0  # 初始化累计损失
        for inputs, labels in train_loader:  # 遍历每个批次
            optimizer.zero_grad()  # 清零梯度
            outputs = model(inputs)  # 前向传播计算输出
            #print('outputs=', outputs)  # 打印输出
            #print('labels=', labels)  # 打印标签
            loss = criterion(outputs, labels)  # 计算损失
            loss.backward()  # 反向传播计算梯度
            optimizer.step()  # 更新模型参数
            running_loss += loss.item()  # 累计损失

        print(
            f"Epoch [{epoch+1}/{num_epochs}], Loss: {running_loss/len(train_loader):.4f}"
        )  # 打印每个epoch的平均损失


# 评估模型函数
def evaluate_model(model, val_loader):
    model.eval()  # 将模型设置为评估模式
    all_preds = []  # 存储所有预测结果
    all_labels = []  # 存储所有真实标签
    with torch.no_grad():  # 关闭梯度计算
        for inputs, labels in val_loader:  # 遍历验证集
            outputs = model(inputs)  # 前向传播计算输出
            _, preds = torch.max(outputs, 1)  # 获取预测类别
            all_preds.extend(preds.numpy())  # 添加预测结果到列表
            all_labels.extend(labels.numpy())  # 添加真实标签到列表
    #print('all_preds=', all_preds)
    #print('all_labels=', all_labels)
    accuracy = accuracy_score(all_labels, all_preds)  # 计算准确率
    return accuracy  # 返回准确率


# 主函数
def main():
    # 加载和预处理数据
    csv_file = 'model/20240527240527001001/默认模型.csv'  # 替换为你的CSV文件路径
    json_file = 'model/20240527240527001001/dictionary.json'  # 替换为你的JSON文件路径

    vectors, labels, num_classes = load_data(csv_file, json_file)  # 加载数据并进行预处理

    # 创建数据集和数据加载器
    dataset = CustomDataset(vectors, labels)  # 创建自定义数据集
    # 使用StratifiedShuffleSplit进行分层抽样
    stratified_split = StratifiedShuffleSplit(n_splits=1,
                                              test_size=0.2,
                                              random_state=42)
    train_idx, val_idx = next(stratified_split.split(vectors, labels))

    train_dataset = Subset(dataset, train_idx)
    val_dataset = Subset(dataset, val_idx)

    train_loader = DataLoader(train_dataset, batch_size=64,
                              shuffle=True)  # 创建训练集的数据加载器
    val_loader = DataLoader(val_dataset, batch_size=64,
                            shuffle=False)  # 创建验证集的数据加载器

    # 模型、损失函数和优化器
    input_size = vectors.shape[1]  # 获取输入特征的维度
    model = NeuralNetwork(input_size, num_classes)  # 创建神经网络模型
    criterion = nn.CrossEntropyLoss()  # 定义交叉熵损失函数
    optimizer = optim.Adam(model.parameters(), lr=0.001)  # 定义Adam优化器
    startTime = time.time()
    print('开始训练...')
    for i in range(100000):  # 设置一个大循环，限制训练次数
        # 训练模型
        print('第', i + 1, '轮开始：')
        train_model(model, train_loader, criterion, optimizer,
                    num_epochs=5)  # 训练模型5个epoch

        # 评估模型
        accuracy = evaluate_model(model, val_loader)  # 在验证集上评估模型
        print(f"模型准确率: {accuracy * 100:.2f}%")  # 打印验证集的准确率
        useTime = time.time() - startTime
        hours, minutes, seconds = seconds_to_hms(useTime)
        print(f"当前总耗时:{hours}小时 {minutes}分钟 {seconds}秒")
        # 保存模型
        if accuracy >= 0.99:  # 如果准确率达到99%
            torch.save(model, 'model/20240527240527001001/netWork.pth')  # 保存模型
            print("Model saved successfully.")  # 打印模型保存成功
            break  # 终止循环


if __name__ == '__main__':  # 主程序入口
    main()  # 调用主函数
