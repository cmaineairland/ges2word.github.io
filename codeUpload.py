'''
Date: 2024-05-26 13:53:59
LastEditors: Qianshanju
E-mail: z1939784351@gmail.com
LastEditTime: 2024-05-26 14:11:46
FilePath: \gesrec\codeUpload.py
'''
import subprocess
import paramiko


def run_commands(commands):
    for command in commands:
        try:
            # Run the command
            result = subprocess.run(command,
                                    shell=True,
                                    capture_output=True,
                                    text=True)

            # Print the command
            print(f"Command: {command}")

            # Print the command's output
            print("Output:")
            print(result.stdout)

            # Print any errors
            if result.stderr:
                print("Error:")
                print(result.stderr)

            print("-" * 40)

        except Exception as e:
            print(f"Failed to run command: {command}")
            print(f"Error: {e}")


def execute_command(hostname, port, username, password, command):
    # 创建SSH客户端对象
    ssh_client = paramiko.SSHClient()

    # 允许连接不在known_hosts文件中的主机
    ssh_client.set_missing_host_key_policy(paramiko.AutoAddPolicy())

    try:
        # 连接到服务器
        ssh_client.connect(hostname=hostname,
                           port=port,
                           username=username,
                           password=password)

        # 执行命令
        stdin, stdout, stderr = ssh_client.exec_command(command)

        # 读取命令执行结果
        output = stdout.read().decode('utf-8')

        # 输出结果
        print("Command Output:")
        print(output)

    except paramiko.AuthenticationException:
        print("Authentication failed, please check your credentials.")
    except paramiko.SSHException as e:
        print("Unable to establish SSH connection: %s" % str(e))
    finally:
        # 关闭连接
        ssh_client.close()


if __name__ == "__main__":
    # List of commands to run
    updateInfo = input('请输入更新信息：')
    commands = [
        'git add .', f"git commit -m {updateInfo}", 'git push -u origin main'
    ]

    hostname = '182.92.78.173'
    port = 22  # 默认SSH端口为22
    username = 'root'
    password = 'Han20020710@'
    command = 'python3 /var/www/updateWeb.py'

    run_commands(commands)
    execute_command(hostname, port, username, password, command)
