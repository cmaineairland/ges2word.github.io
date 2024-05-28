'''
Date: 2023-11-09 15:27:05
LastEditors: Qianshanju
E-mail: z1939784351@gmail.com
LastEditTime: 2024-05-28 15:24:16
FilePath: \gesrec\serves\creat_CSV_file.py
'''
import csv
import os
from get_hand_key_point_from_image import get_hand_key_point
import json
import time


def seconds_to_hms(seconds):
    hours = seconds // 3600
    minutes = (seconds % 3600) // 60
    remaining_seconds = seconds % 60
    return hours, minutes, remaining_seconds


def CreateCSVFile(FileList, folder_path, file_name):
    startTime = time.time()
    CSVHead = ['id'] + [x for x in range(64)] + ['label']
    csv_path = os.path.join(folder_path, f"{file_name}.csv")
    f = open(csv_path, "w", encoding='utf-8', newline='')
    csv_write = csv.writer(f)
    csv_write.writerow(CSVHead)
    frame_path = os.path.join(folder_path, 'dataset')
    for i in range(0, len(FileList)):
        j = 0
        while True:
            path = os.path.join(frame_path, FileList[i],
                                f'{FileList[i]}_{j}.jpg')
            vector = get_hand_key_point(path)
            if (vector == -1):
                break
            if (vector != 0):
                csv_write.writerow(
                    ([FileList[i] + '_{}'.format(j)] + vector + [FileList[i]]))
            useTime = time.time() - startTime
            hours, minutes, seconds = seconds_to_hms(useTime)
            print(
                f'{FileList[i]}_{j}已完成读取,总耗时{hours}小时 {minutes}分钟 {seconds}秒')
            j = j + 1

    f.close()


if __name__ == '__main__':

    path = os.path.join(
        os.path.dirname(os.path.dirname(os.path.abspath(__file__))),
        'model/20240527240527001001')
    with open(os.path.join(path, 'dictionary.json'), 'r',
              encoding='utf-8') as file:
        data = json.load(file)
    FileList = data['dic']
    folder_path = os.path.join(
        os.path.dirname(os.path.dirname(os.path.abspath(__file__))),
        'model/20240527240527001001')
    file_name = data['name']
    CreateCSVFile(FileList, folder_path, file_name)
