# SSH 配置迁移指南

> 用于在新电脑上配置 SSH 并克隆 TheMarginalStructure 的三个仓库。

---

## 1. 生成 SSH 密钥（如无现有密钥）

```bash
# 主账号密钥
ssh-keygen -t ed25519 -C "your_main_email@example.com" -f ~/.ssh/id_ed25519

# TheMarginalStructure 专用密钥
ssh-keygen -t ed25519 -C "your_tms_email@example.com" -f ~/.ssh/tms
```

一路回车，不设密码。

## 2. 将公钥添加到 GitHub

查看公钥：

```bash
cat ~/.ssh/id_ed25519.pub
cat ~/.ssh/tms.pub
```

分别复制内容，添加到 GitHub：

1. 打开 https://github.com/settings/keys
2. 点击 **New SSH key**
3. 标题写 `主账号`，粘贴 `id_ed25519.pub` 内容
4. 再次点击 **New SSH key**
5. 标题写 `tms`，粘贴 `tms.pub` 内容

## 3. 创建 SSH 配置文件

```bash
nano ~/.ssh/config
```

粘贴以下内容：

```
# 主账号 - 默认 key
Host github.com
    HostName  ssh.github.com
    User git
    IdentityFile ~/.ssh/id_ed25519
    IdentitiesOnly yes
    Port 443

# TheMarginalStructure
Host tms
    HostName  ssh.github.com
    User git
    IdentityFile ~/.ssh/tms
    IdentitiesOnly yes
    Port 443
```

保存退出（`Ctrl+X` → `Y` → `Enter`）。

## 4. 验证连接

```bash
# 测试主账号
ssh -T git@github.com
# 应显示: Hi <主账号用户名>! You've successfully authenticated...

# 测试 tms 账号
ssh -T git@tms
# 应显示: Hi TheMarginalStructure! You've successfully authenticated...
```

## 5. 克隆三个仓库

```bash
cd D:/Github  # 或其他你喜欢的目录

git clone git@tms:TheMarginalStructure/ThresholdArchive.git
git clone git@tms:TheMarginalStructure/ThresholdArchive-Frontend.git
git clone git@tms:TheMarginalStructure/ThresholdArchive-Backend.git
```

## 6. 验证仓库状态

```bash
cd D:/Github/ThresholdArchive && git remote -v
# 应显示:
# origin  git@tms:TheMarginalStructure/ThresholdArchive.git (fetch)
# origin  git@tms:TheMarginalStructure/ThresholdArchive.git (push)

cd ../ThresholdArchive-Frontend && git remote -v
# 应显示:
# origin  git@tms:TheMarginalStructure/ThresholdArchive-Frontend.git (fetch)
# origin  git@tms:TheMarginalStructure/ThresholdArchive-Frontend.git (push)

cd ../ThresholdArchive-Backend && git remote -v
# 应显示:
# origin  git@tms:TheMarginalStructure/ThresholdArchive-Backend.git (fetch)
# origin  git@tms:TheMarginalStructure/ThresholdArchive-Backend.git (push)
```

## 7. 最终目录结构

配置完成后，目录结构应为：

```
D:/Github/
├── ThresholdArchive/          ← 文本内容（档案/设定/系列）
├── ThresholdArchive-Frontend/ ← 前端代码 (React + Vite)
└── ThresholdArchive-Backend/  ← 后端 API (Express + Prisma)
```

---

### 常见问题

**Q: `ssh -T git@tms` 报错 `Permission denied`？**
A: 确认 `~/.ssh/tms` 私钥文件存在，且其对应的公钥已添加到 GitHub 账号 TheMarginalStructure 的 SSH Keys 中。

**Q: 连接超时？**
A: 确认使用端口 443（`ssh.github.com:443`），部分网络会封锁默认的 SSH 端口 22。

**Q: 提示 `known_hosts` ？**
A: 输入 `yes` 确认并继续即可。
