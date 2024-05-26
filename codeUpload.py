'''
Date: 2024-05-26 13:53:59
LastEditors: Qianshanju
E-mail: z1939784351@gmail.com
LastEditTime: 2024-05-26 13:59:16
FilePath: \gesrec\codeUpload.py
'''
import subprocess


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


if __name__ == "__main__":
    # List of commands to run
    updateInfo = input('请输入更新信息：')
    commands = [
        'git add .',
        f'git commit -m {updateInfo}',
        'git commit -u origin main']

    run_commands(commands)
