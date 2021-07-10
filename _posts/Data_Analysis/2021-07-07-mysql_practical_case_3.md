---

layout:     post   				    # 使用的布局（不需要改）
title:      MySQL 实战案例：销售部门数据分析   	# 标题 
subtitle:    #副标题
date:       2021-07-07 				# 时间
author:     YEY 						# 作者
header-img: img/post-sample-image04.jpg 	#这篇文章标题背景图片
catalog: true 						# 是否归档
mathjax: true   
tags:								#标签
    - 数据分析
    - MySQL

---

## 1. 业务逻辑介绍

公司中有一些销售人员，然后公司有一些线上客户，销售与客户之间存在一定的任务关系。例如：公司的销售人员每天都需要向客户电话推销某线上产品。

对于客户而言，可能会有以下三种情况：

* 购买
* 不购买
* 表现出了一定的意向，但是还没有下单

总体上，我们的业务逻辑是为了提升销售对于客户的订单转化能力：对于明确购买或者不购买的客户，情况比较简单；但是对于意向客户，我们这里还有一些问题需要处理。例如，可能存在这样的情况：某客户可能确实有一定的购买意向，但是可能和与其对接的销售不是很合得来。

所以，我们可以采取一些措施，例如：规定一名销售人员与一名客户的对接时间周期最长为 2 天，如果两天之后，该客户仍然具有一定购买意向但是还没有付款的话，就移交给另外一名销售人员进行对接。 

为此，我们开发了以下业务逻辑：

<img src="http://andy-blog.oss-cn-beijing.aliyuncs.com/blog/2021-07-09-WX20210709-164137%402x.png" width="70%">

某公司有 6 个销售小组，每个小组中有 5 名销售人员。所有销售人员在每天开始上班时都需要接一些客户新量（所谓新量，就是之前还没有沟通过的客户的电话号码），然后销售人员会得到来自这些新量客户的结果：购买、不购买、有意向。如果 2 天之后，该客户还没有购买的话，就将其移交给其他销售。这意味着，销售人员不仅会对接新量客户，也会对接来自其他销售人员的老量客户，对于这些老量客户，也存在三种结果：购买、不购买、有意向。

但是，这里还存在一个漏洞：可能存在某些客户一直停留在意向阶段，如果按照上面的方式一直更换与其对接的销售人员，将导致公司销售人员资源的极大浪费。因此，我们需要进行一些限制：与一位客户对接的销售人员的数量最多不超过 3 人。如果某客户与 3 名销售人员沟通后仍然没有下单，则放弃对该客户的继续跟进。

以上就是本案例中销售系统的业务逻辑。

### 1.1 表与表的关系

* 每个销售人员（`salesstaff`）有且必须被分配到一个销售小组（`sgroup`）

* 每个客户（`customer`）必须所属于一个用户画像（`cateogry`）
* 销售人员（`salesstaff`）与客户（`customer`）沟通，形成历史任务表（`mission`），`mission` 中包含沟通的结果（`status`）

### 1.2 沟通规则

每天每个销售人员接收 25 个顾客新量并进行沟通，沟通的结果有以下 3 种情况：

1. 【直接签单成功】

2. 【非意向用户】，不再跟进

3. 【继续跟单】，顾客有购买意向，但此销售未与客户签单成功，移交给其他销售再做跟进

销售人员可以跟进意向用户的最大时长是 2 天，2 天后需给出的结果如下：

1. 未成单，但仍有购买倾向，移交给其他销售，记为【继续跟单】

2. 客户失去了购买商品的可能，记为【跟踪失败】，无需移交其他销售跟踪

3. 【跟单成功】

4. 【跟踪超时】

每个意向客户最多只能被 3 个销售人员沟通，如果之后仍未成单，则记为【跟踪超时】，不再跟进该客户。

## 2. 需要的数据结果

1. 统计当月每位销售直接成单数、直接成单率、跟踪成单数、跟踪成单率 
2. 每位销售人员组内贡献度及其排名 
3. 生成销售人员的基本工资（直接成单：100 元，间接成单：80 元，底薪 2000 元） 
4. 销售小组业绩排名 
5. 统计当月流水与净收入（用户成本：250 元，商品单价：8000 元，商品成本：1000 元）

## 3. 代码实现

### 3.1 案例数据导入

#### 3.1.1 创建数据库

```bash
mysql -u root -p
```

输入密码后，进入 MySQL 环境，创建数据库 `recommend2`，然后退出 MySQL 环境：

```sql
CREATE DATABASE recommend2;
EXIT;
```

<img src="http://andy-blog.oss-cn-beijing.aliyuncs.com/blog/2021-07-09-iShot2021-07-09%2020.42.55.png" width="100%">

#### 3.1.2 导入 SQL

在终端环境下，将路径切换到 SQL 脚本 `recommend2.sql` 所在的文件夹，然后将数据导入到我们刚才创建的数据库 `recommend2` 中：

```bash
mysql -u root -p recommend2 < recommend2.sql
```

<img src="http://andy-blog.oss-cn-beijing.aliyuncs.com/blog/2021-07-09-iShot2021-07-09%2020.50.50.png" width="100%">

注：

* `<` 后面的 `recommend2.sql` 是 SQL 文件的相对位置 

* 如果提示找不到指定文件，可以在终端中重新 cd 到保存 `recommend2.sql` 的父级文件夹，然后再执行导入命令

* 或者使用 `recommend2.sql` 的绝对地址，例如：

  `mysql -u root -p recommend2 < /Users/andy/Desktop/recommend2.sql`

#### 3.1.3 查看数据

```sql
-- 查看数据库 recommend2 中有哪些数据表
USE recommend2;
SHOW TABLES;
```

<img src="http://andy-blog.oss-cn-beijing.aliyuncs.com/blog/2021-07-09-WX20210709-212327%402x.png" width="30%">

```sql
-- 查看销售人员表 
SELECT * FROM salesstaff;
```

<img src="http://andy-blog.oss-cn-beijing.aliyuncs.com/blog/2021-07-09-WX20210709-212830%402x.png" width="80%">

```sql
-- 查看销售小组表 sgroup
SELECT * FROM sgroup;
```

<img src="http://andy-blog.oss-cn-beijing.aliyuncs.com/blog/2021-07-09-WX20210709-213033%402x.png" width="24%">

```sql
-- 查看客户表 customer，其中 tel 字段为加密后的客户电话号码
SELECT * FROM customer;
```

<img src="http://andy-blog.oss-cn-beijing.aliyuncs.com/blog/2021-07-09-WX20210709-213126%402x.png" width="65%">

```sql
-- 查看用户画像表 category
SELECT * FROM category;
```

<img src="http://andy-blog.oss-cn-beijing.aliyuncs.com/blog/2021-07-09-WX20210709-213253%402x.png" width="28%">

```sql
-- 查看历史任务表 mission
SELECT * FROM mission;
```

<img src="http://andy-blog.oss-cn-beijing.aliyuncs.com/blog/2021-07-09-WX20210709-212120%402x.png" width="80%">

```sql
-- 查看沟通结果表 status
SELECT * FROM `status`;
```

<img src="http://andy-blog.oss-cn-beijing.aliyuncs.com/blog/2021-07-09-WX20210709-213525%402x.png" width="28%">

### 3.2 统计当月每位销售直接成单数、直接成单率、跟踪成单数、跟踪成单率

**1）多表连接，显示任务编号、销售小组、销售姓名、顾客编号、沟通结果与沟通日期**

```sql
CREATE VIEW v1 AS
SELECT
  m.id AS id,
  s3.`name` AS group_name,
  s.`name` AS salesstaff_name,
  m.customer_id,
  s2.content AS result,
  m.createDate AS createDate
FROM
  mission AS m
  INNER JOIN salesstaff AS s ON m.salesstaff_id = s.id
  INNER JOIN `status` AS s2 ON m.status_id = s2.id
  INNER JOIN sgroup AS s3 ON s.group_id = s3.id
WHERE
  createDate >= '2020-06-01'
  AND createDate < '2020-07-01';

SELECT * FROM v1;
```

<img src="http://andy-blog.oss-cn-beijing.aliyuncs.com/blog/2021-07-09-WX20210710-000057%402x.png" width="90%">

**2）统计每个销售的沟通客户总数、直接签单成功数、跟单成功数**

```sql
CREATE VIEW v2 AS
SELECT
  group_name,
  salesstaff_name,
  COUNT(DISTINCT customer_id) AS total_customer,
  COUNT(DISTINCT IF(result = '直接签单成功', customer_id, NULL)) AS suc_1,
  COUNT(DISTINCT IF(result = '跟单成功', customer_id, NULL)) AS suc_2
FROM v1
GROUP BY group_name, salesstaff_name;

SELECT * FROM v2;
```

<img src="http://andy-blog.oss-cn-beijing.aliyuncs.com/blog/2021-07-09-WX20210710-003617%402x.png" width="75%">

**3）得到每个销售人员的直接成单率与跟单成单率**

```sql
CREATE VIEW v3 AS
SELECT
  *,
  suc_1 / total_customer AS rate1,
  suc_2 / total_customer AS rate2
FROM v2;

SELECT * FROM v3;
```

<img src="http://andy-blog.oss-cn-beijing.aliyuncs.com/blog/2021-07-09-WX20210710-004550%402x.png" width="95%">

**4）展示最终结果**

```sql
CREATE VIEW ret1 AS
SELECT
  group_name AS '销售小组',
  salesstaff_name AS '销售人员',
  total_customer AS '本月沟通客户总数',
  suc_1 AS '直接成单数',
  suc_2 AS '跟单成功数',
  rate1 AS '直接成单率',
  rate2 AS '跟单成功率'
FROM v3;

SELECT * FROM ret1;
```

<img src="http://andy-blog.oss-cn-beijing.aliyuncs.com/blog/2021-07-09-WX20210710-005213%402x.png" width="95%">

### 3.3 每位销售人员组内贡献度及其排名

**1）通过窗口函数，统计每个销售人员的组内贡献度**

组内贡献度 ＝ (个人直接签单成功数 ＋ 个人跟踪成功数) / (本组成单总数)

```sql
CREATE VIEW v4 AS
SELECT
  *,
  (suc_1 + suc_2) /
  (SUM(suc_1) OVER (PARTITION BY group_name) + SUM(suc_2) OVER (PARTITION BY group_name))
  AS group_contribute_rate  
FROM v2;

SELECT * FROM v4;
```

<img src="http://andy-blog.oss-cn-beijing.aliyuncs.com/blog/2021-07-09-WX20210710-010518%402x.png" width="100%">

**2）对每组的组内贡献度进行排名，并用中文输出结果**

```sql
CREATE VIEW ret2 AS
SELECT
  group_name AS '销售小组',
  salesstaff_name AS '销售人员',
  total_customer AS '本月沟通客户总数',
  suc_1 AS '直接成单数',
  suc_2 AS '跟单成功数',
  group_contribute_rate AS '组内贡献度',
  RANK() OVER (PARTITION BY group_name ORDER BY group_contribute_rate DESC) AS '组内贡献排名'
FROM v4;

SELECT * FROM ret2;
```

<img src="http://andy-blog.oss-cn-beijing.aliyuncs.com/blog/2021-07-09-WX20210710-011001%402x.png" width="100%">

### 3.4 生成销售人员的基本工资

工资规则：

* 直接成单提成：100 元 
* 间接成单提成：80 元
* 底薪 2000 元

```sql
CREATE VIEW salary_view AS
SELECT
  group_name AS '销售小组',
  salesstaff_name AS '销售人员',
  total_customer AS '本月沟通客户总数',
  suc_1 AS '直接成单数',
  suc_2 AS '跟单成功数',
  suc_1 * 100 + suc_2 * 80 + 2000 AS '本月薪资'
FROM v2;

SELECT * FROM salary_view;
```

<img src="http://andy-blog.oss-cn-beijing.aliyuncs.com/blog/2021-07-09-WX20210710-011625%402x.png" width="85%">

### 3.5 销售小组业绩排名

```sql
CREATE VIEW ret4 AS 
SELECT
  group_name AS '组名',
  total_suc AS '当月成单总数',
  RANK() OVER (ORDER BY total_suc DESC) AS '排名' 
FROM
  (SELECT
     group_name,
     SUM(suc_1) + SUM(suc_2) AS total_suc 
   FROM v2 
   GROUP BY group_name) f1;

SELECT * FROM ret4;
```

<img src="http://andy-blog.oss-cn-beijing.aliyuncs.com/blog/2021-07-09-WX20210710-012841%402x.png" width="47%">

### 3.6 统计当月流水与净收入

初步的计算规则：

* 用户成本：250 元

* 商品单价：8000 元

* 商品成本：1000 元

* 流水 ＝ 月成交用户数 * 商品单价

* 净收入 ＝ 流水 － 薪资成本 － 流量成本 － 商品成本

* 薪资成本 ＝ 销售员工的工资累加

* 流量成本 ＝ 月沟通用户数 * 用户成本

  注：用户成本就是流量的价格，即获取一个意向客户联系方式的花销

* 商品成本 ＝ 月成交用户数 * 单个商品成本

**1）计算薪资成本与月流水**

```sql
CREATE VIEW b1 AS
SELECT
  SUM(`本月薪资`) AS '薪资成本',
  (SUM(`直接成单数`) + SUM(`跟单成功数`)) * 8000 AS '月流水',
  (SUM(`直接成单数`) + SUM(`跟单成功数`)) * 1000 AS '商品成本'
FROM salary_view;

SELECT * FROM b1;
```

<img src="http://andy-blog.oss-cn-beijing.aliyuncs.com/blog/2021-07-09-WX20210710-013913%402x.png" width="50%">

**2）计算流量成本**

```sql
CREATE VIEW b2 AS
SELECT COUNT(DISTINCT customer_id) * 250 AS '当月流量成本'
FROM mission
WHERE createDate >= '2020-06-01' AND createDate < '2020-07-01';

SELECT * FROM b2;
```

<img src="http://andy-blog.oss-cn-beijing.aliyuncs.com/blog/2021-07-09-WX20210710-014156%402x.png" width="25%">

**3）统计收入最终结果**

```sql
SELECT
  *,
  (`月流水` - `薪资成本` - `当月流量成本` - `商品成本`) AS '本月部门净收入'
FROM b1, b2;
```

<img src="http://andy-blog.oss-cn-beijing.aliyuncs.com/blog/2021-07-09-WX20210710-014426%402x.png" width="95%">

**4）补充部分**

公司净收入核算，成本不仅仅只有员工的工资，诸如流量的费用、与其他公司的费用支出、每个员工的管理成本（人均场地费用，五险一金等）、纳税都应该纳入成本范畴。
