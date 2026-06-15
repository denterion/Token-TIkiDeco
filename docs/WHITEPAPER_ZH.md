# TikiDeco 白皮书

版本：draft 0.1

## 概述

TikiDeco 是一个基于 Ethereum 的代币项目，连接未来的 TikiDeco Miami Beach Hotel 概念。该项目旨在为品牌参与、社区奖励、未来酒店权益以及公开项目报告建立透明的数字层。

TIDE 并不是一个不受控制的融资代币。当前智能合约系统重点关注固定供应、透明分配、归属期管理、treasury 纪律以及链上报告哈希记录。

## 代币

- 名称：TikiDeco
- 符号：TIDE
- 目标网络：Ethereum 以及 Ethereum 测试网
- 标准：ERC-20 compatible
- 总供应量：100,000,000 TIDE
- 初始供应持有人：项目 treasury 或 multisig 钱包

该代币具有固定最大供应量。当前合约没有公开 mint 函数。

## Utility 模型

计划中的 utility 模型包括：

- 社区奖励
- loyalty 活动
- 未来酒店相关体验的早期访问
- 在法律和运营允许的情况下提供预订相关权益
- 透明发布项目更新
- 围绕 TikiDeco hospitality 概念进行品牌参与

任何未来的金融权利、revenue share、类似股权的功能或投资发行，都必须通过单独且合规的法律结构处理。

## 代币经济

初始分配模型如下：

| 类别 | 百分比 | 数量 |
| --- | ---: | ---: |
| Treasury operations | 20% | 20,000,000 TIDE |
| Team and advisors | 15% | 15,000,000 TIDE |
| Strategic partners | 10% | 10,000,000 TIDE |
| Community rewards | 20% | 20,000,000 TIDE |
| Future hotel perks | 15% | 15,000,000 TIDE |
| Strategic reserve | 20% | 20,000,000 TIDE |

团队、合作伙伴、社区以及未来酒店权益的分配可以放入 vesting schedules，以减少短期抛压并提高责任透明度。

## 归属期

TikiDecoVestingVault 支持：

- cliff periods
- 线性 vesting
- beneficiary 释放代币
- owner-assisted release
- revocable schedules 的撤销
- 未归属代币退回到指定 treasury address

Vault 会拒绝意外发送的 native ETH，并使用安全的 token calls 和 reentrancy protection。

## 透明度

代币合约允许 owner 在链上发布报告哈希。这会为项目更新、财务摘要、许可进展或里程碑报告创建公开的时间戳记录。

建议流程：

1. 准备最终报告。
2. 将报告上传到 IPFS 或其他持久公开存储。
3. 计算最终文档的 hash。
4. 通过代币合约发布 hash 和 URI。

## 安全

初始安全模型包括：

- 固定供应
- 两步 ownership 转移
- owner 与 treasury 分离
- 启动阶段 pause/unpause control
- non-reentrant vesting operations
- vesting vault 中的安全 token transfers
- 明确拒绝意外 ETH transfers
- core token 和 vesting behavior 测试

在 mainnet deployment 之前，合约应接受独立 audit review。

## 法律声明

本文档是技术和项目 draft，不构成证券销售要约、投资建议、法律建议或利润承诺。未经 securities counsel 审查并建立合规法律结构，不应将 TIDE 宣传为 equity、debt、revenue share、profit share 或保证升值的资产。
