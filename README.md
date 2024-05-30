<!--
 * @Date: 2024-05-25 22:07:41
 * @LastEditors: Qianshanju
 * @E-mail: z1939784351@gmail.com
 * @LastEditTime: 2024-05-30 19:03:06
 * @FilePath: \gesrec\README.md
-->
<!--
 * @Date: 2024-05-25 22:07:41
 * @LastEditors: Qianshanju
 * @E-mail: z1939784351@gmail.com
 * @LastEditTime: 2024-05-30 18:57:58
 * @FilePath: \gesrec\README.md
-->
<!--
 * @Date: 2024-05-25 22:07:41
 * @LastEditors: Qianshanju
 * @E-mail: z1939784351@gmail.com
 * @LastEditTime: 2024-05-30 17:07:41
 * @FilePath: \gesrec\README.md
-->
# 支持自定义词典的手语识别系统

## 2. 部署网页代码至服务器

### 服务器配置如下

| 服务器供应商 |     操作系统      |  CPU  | 内存  |    公网ip    |
| :----------: | :---------------: | :---: | :---: | :----------: |
|    阿里云    | CentOS 7.9 64 bit |   2   | 2048  | 47.93.31.230 |

因为后续需要网络访问，所以这里直接打开所有端口

![开放端口](/markdownImage/开放端口.png)

### 2.1 部署相关配置

#### 2.1.1 部署Apache

（1）安装Apache

``` bash
sudo yum install httpd
```

（2）启动Apache服务

``` bash
sudo systemctl start httpd
```

（3）设置Apache开机自启

``` bash
sudo systemctl enable httpd
```

（4）设置防火墙，允许http与https流量通过

``` bash
sudo firewall-cmd --permanent --add-service=http
sudo firewall-cmd --permanent --add-service=https
sudo firewall-cmd --reload
```

（5）重启Apache

```bash
sudo systemctl restart httpd
```

#### 2.1.2 配置https连接

（1）安装mod_ssl模块

```bash
sudo yum install mod_ssl
```

（2）生成自签名证书

注：如果已有ssl证书则无需进行自签名。

```bash
cd /etc/httpd/ #使用yum安装Apache的默认安装目录。如果您手动修改过该目录或使用其他方式安装的Apache，请根据实际配置调整。
mkdir cert
cd cert
sudo openssl req -newkey rsa:2048 -nodes -keyout ca.key -x509 -days 365 -out ca.crt #中间根据实际情况填写信息
```

（3）读取ca.crt和ca.key内容并修改网页代码中/server/ca.crt与/server/ca.key

（4）修改与证书相关的配置

```bash
vim /etc/httpd/conf.d/ssl.conf
```

将

```bash
#DocumentRoot "/var/www/html"
#ServerName www.example.com:443
SSLCertificateFile /etc/pki/tls/certs/localhost.crt
SSLCertificateKeyFile /etc/pki/tls/private/localhost.key
```

修改为

```bash
DocumentRoot "/var/www/html"
ServerName 47.93.31.230
SSLCertificateFile cert/ca.crt
SSLCertificateKeyFile cert/ca.key
```

在终端输入

```bash
vim /etc/httpd/conf/httpd.conf
```

在文件顶部输入：

```bash
ServerName 47.93.31.230
```

（5）重启Apache

```bash
sudo systemctl restart httpd
```

（6）验证https是否配置成功

```bash
cd /var/www/html/
touch index.html
vim index.html
```

在文件中输入以下内容：

```html
<p>hello world</p>
```

在浏览器输入[https://47.93.31.230/](https://47.93.31.230/)，出现以下内容则代表配置成功：

![https配置成功](/markdownImage/查看https是否配置成功.png)

#### 2.1.3 安装OpenSSL

（1）下载OpenSSL

```bash
cd /usr/src
wget https://www.openssl.org/source/openssl-1.1.1w.tar.gz
```

（2）解压压缩包

```bash
tar -zxvf openssl-1.1.1n.tar.gz
cd openssl-1.1.1n
```

（3）安装OpenSSL

```bash
./config --prefix=/usr/local/openssl   
make 
make install
```

（4）修改链接文件

```bash
mv /usr/bin/openssl /usr/bin/openssl.bak
ln -sf /usr/local/openssl/bin/openssl /usr/bin/openssl
echo "/usr/local/openssl/lib" >> /etc/ld.so.conf 
ldconfig -v
```

#### 2.1.4 安装python3.10

（1）安装基本开发工具

```bash
sudo yum groupinstall -y "Development Tools"
sudo yum install -y wget openssl-devel bzip2-devel libffi-devel zlib-devel
```

（2）下载python3.10.0源代码

```bash
cd /usr/src
sudo wget https://www.python.org/ftp/python/3.10.0/Python-3.10.0.tgz
```

（3）解压源代码

```bash
sudo tar xzf Python-3.10.0.tgz
```

（4）修改SSL配置

```bash
cd Python-3.10.0 
vim Module/Setup
```

第211行路径修改为OpenSSL编译的路径，

第212-214解除注释。

修改完成后如下：

``` Makefile
# socket line above, and edit the OPENSSL variable:
OPENSSL=/usr/local/openssl
_ssl _ssl.c \
      -I$(OPENSSL)/include -L$(OPENSSL)/lib \
      -lssl -lcrypto
```

（5）配置编译并安装python

```bash
./configure --prefix=/usr/local/python3.10
make && make install
```

（5）配置环境变量

```bash
sudo alternatives --install /usr/bin/python3 python3 /usr/local/python3.10/bin/python3.10 1
sudo alternatives --set python3 /usr/local/python3.10/bin/python3.10
```

#### 2.1.5 编写更新脚本

（1）创建更新程序

```bash
cd /var/www
touch update.py
vim update.py
```

输入以下内容并保存：

```python
import shutil
import subprocess
import os

def delete_html_folder():
    html_folder = "html"
    if os.path.exists(html_folder):
        shutil.rmtree(html_folder)
        print(f"Deleted {html_folder} folder.")

def clone_github_repo(repo_url):
    try:
        subprocess.run(["git", "clone", repo_url, "html"], check=True)
        print("GitHub repository cloned successfully.")
    except subprocess.CalledProcessError:
        print("Failed to clone GitHub repository.")

def main():
    # 删除同目录下的 html 文件夹
    delete_html_folder()

    # 从 GitHub 仓库中克隆代码到 html 文件夹
    github_repo_url = "https://github.com/cmaineairland/ges2word.github.io.git"
    clone_github_repo(github_repo_url)

if __name__ == "__main__":
    main()
```

（2）执行更新脚本

```bash
python3 update.py
```

（3）安装必要第三方包

需要安装的包如下：

- mediapipe
- opencv-python
- Flask
- flask-cors
- pandas
- numpy
- torch
- scikit-learn

你可以执行以下命令一键安装：

```bash
pip3 install mediapipe opencv-python Flask flask-cors pandas numpy torch scikit-learn
```
