'''
Date: 2024-05-26 14:49:19
LastEditors: Qianshanju
E-mail: z1939784351@gmail.com
LastEditTime: 2024-05-26 15:04:55
FilePath: \gesrec\serves\getNews.py
'''
import os


def getNews(url):
    path = os.path.join(
        os.path.dirname(os.path.dirname(os.path.abspath(__file__))),
        'components', url + '.html')
    with open(path, 'r', encoding='utf-8') as file:
        html_content = file.read()
    return html_content


if __name__ == '__main__':

    print(getNews('WTO'))
