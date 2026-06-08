export interface GuideSection {
  id: string
  title: string
  icon?: string
  content?: string
  children?: GuideSection[]
}

const guideData: GuideSection[] = [
  {
    id: 'part1',
    title: '第一篇：管理员PC端操作指南',
    icon: 'Setting',
    children: [
      {
        id: 'ch1',
        title: '第一章 系统初始化配置',
        icon: 'Tools',
        children: [
          {
            id: 'ch1-1',
            title: '1.1 用户管理',
            content: `<h3>用户管理</h3>
<p><strong>使用者</strong>：系统管理员 / 超级管理员</p>
<p><strong>操作路径</strong>：系统 → 用户管理</p>
<h4>操作步骤</h4>
<ol>
<li>点击「+ 新建用户」按钮</li>
<li>填写基本信息：用户名（必填，建议格式如 <code>employee_001</code>）、密码、姓名、部门、手机号、邮箱</li>
<li>选择角色（必填，可多选）</li>
<li>点击「保存」</li>
</ol>
<h4>注意事项</h4>
<ul>
<li>用户名全局唯一，一旦创建不可更改</li>
<li>一个用户可绑定多个角色，系统合并权限</li>
<li>员工离职时建议禁用而非删除，保留操作日志</li>
<li>首次登录强制修改密码</li>
</ul>
<h4>相关操作</h4>
<ul>
<li><strong>编辑</strong>：点击用户行 → 修改 → 保存</li>
<li><strong>禁用</strong>：点击用户行 → 禁用（禁用后无法登录）</li>
<li><strong>重置密码</strong>：点击用户行 → 重置密码 → 发送临时密码</li>
</ul>`
          },
          {
            id: 'ch1-2',
            title: '1.2 角色管理',
            content: `<h3>角色管理</h3>
<p><strong>使用者</strong>：系统管理员 / 超级管理员</p>
<p><strong>操作路径</strong>：系统 → 角色管理</p>
<h4>内置角色</h4>
<table>
<tr><th>角色</th><th>说明</th></tr>
<tr><td>超级管理员</td><td>全部权限</td></tr>
<tr><td>厂长</td><td>生产/财务/报表管理</td></tr>
<tr><td>生产计划员</td><td>订单/排产/派工</td></tr>
<tr><td>班组长</td><td>派工审核/报工审核</td></tr>
<tr><td>操作员工</td><td>报工/查看任务</td></tr>
<tr><td>客户</td><td>下单/查看进度</td></tr>
<tr><td>财务</td><td>工资/对账/报表</td></tr>
</table>
<h4>核心权限点</h4>
<table>
<tr><th>权限点</th><th>说明</th></tr>
<tr><td>dashboard.view</td><td>仪表盘查看</td></tr>
<tr><td>user.manage</td><td>用户管理</td></tr>
<tr><td>product.manage</td><td>产品管理</td></tr>
<tr><td>order.manage</td><td>订单管理</td></tr>
<tr><td>plan.manage</td><td>生产计划</td></tr>
<tr><td>report.audit</td><td>报工审核</td></tr>
<tr><td>salary.manage</td><td>工资管理</td></tr>
<tr><td>trace.query</td><td>溯源查询</td></tr>
</table>
<h4>注意事项</h4>
<ul>
<li>最小权限原则：只分配必要的权限</li>
<li>权限更新后，当前用户需重新登录才能生效</li>
<li>内置角色建议不要修改，可创建新角色</li>
</ul>`
          },
          {
            id: 'ch1-3',
            title: '1.3 部门管理',
            content: `<h3>部门管理</h3>
<p><strong>使用者</strong>：系统管理员 / HR</p>
<p><strong>操作路径</strong>：系统 → 部门管理</p>
<h4>操作步骤</h4>
<ol>
<li>点击「+ 新建部门」</li>
<li>填写：部门名称（必填，如"冲压车间"）、负责人、描述</li>
<li>点击「保存」</li>
<li>可设置上级部门建立层级关系</li>
</ol>
<h4>注意事项</h4>
<ul>
<li>部门名称建议不超过20个字</li>
<li>负责人一般是该部门的班组长或主管</li>
<li>启用了数据权限控制时，用户只能查看本部门数据</li>
<li>删除部门前确认该部门没有员工</li>
</ul>`
          },
          {
            id: 'ch1-4',
            title: '1.4 字典管理',
            content: `<h3>字典管理</h3>
<p><strong>使用者</strong>：系统管理员 / 主数据管理员</p>
<p><strong>操作路径</strong>：系统 → 字典管理</p>
<h4>系统预置字典</h4>
<ul>
<li><strong>单位</strong>：个、米、吨等</li>
<li><strong>颜色</strong>：红、蓝、黄等（可设十六进制色值）</li>
<li><strong>工序分类</strong>：机加、热处理等</li>
<li><strong>订单状态</strong>：草稿、已确认等</li>
</ul>
<h4>操作步骤</h4>
<ol>
<li>选择字典分类 → 点击「+ 新建」</li>
<li>输入字典值代码（唯一，保存后不可改）、文本、排序值</li>
<li>点击「保存」</li>
</ol>
<h4>注意事项</h4>
<ul>
<li>字典值代码一旦保存不能修改</li>
<li>删除前检查是否已被数据引用</li>
<li>不要删除系统预置的关键字典</li>
</ul>`
          },
        ]
      },
      {
        id: 'ch2',
        title: '第二章 主数据管理',
        icon: 'Box',
        children: [
          {
            id: 'ch2-1',
            title: '2.1 产品管理',
            content: `<h3>产品管理</h3>
<p><strong>使用者</strong>：主数据管理员 / 生产部</p>
<p><strong>操作路径</strong>：主数据 → 产品</p>
<h4>操作步骤</h4>
<ol>
<li>点击「+ 新建产品」</li>
<li>填写：产品编码（必填唯一）、产品名称、分类、单位、描述、主图</li>
<li>点击「保存」</li>
<li>支持 Excel 批量导入：下载模板 → 填充数据 → 上传</li>
</ol>
<h4>注意事项</h4>
<ul>
<li>产品编码全局唯一，建议建立编码规范（如 P + 3位数字）</li>
<li>一个产品可对应多个型号（SKU），如不同颜色/规格</li>
<li>产品建立后在型号中关联</li>
<li>删除产品前确认没有关联的订单或型号</li>
</ul>`
          },
          {
            id: 'ch2-2',
            title: '2.2 产品型号（SKU）管理',
            content: `<h3>产品型号（SKU）管理</h3>
<p><strong>使用者</strong>：主数据管理员</p>
<p><strong>操作路径</strong>：主数据 → 产品型号</p>
<h4>操作步骤</h4>
<ol>
<li>点击「+ 新建型号」</li>
<li>选择关联的<strong>产品</strong>（必填）</li>
<li>填写型号编码（唯一），如 <code>P001-RED</code></li>
<li>设置扩展属性：<ul>
<li><strong>颜色</strong>：从色卡选择或自定义</li>
<li><strong>材料</strong>：材质说明、用料标准</li>
<li><strong>规格</strong>：尺寸、重量、厚度等自定义字段</li>
<li><strong>备注</strong>：特殊说明</li>
<li><strong>多角度图片</strong>：正面/侧面/细节图</li>
</ul></li>
<li>点击「保存」</li>
</ol>
<h4>批量导入</h4>
<p>支持 Excel 批量导入，下载模板后按格式填充数据，上传即可批量创建型号。</p>
<h4>注意事项</h4>
<ul>
<li>型号编码全局唯一</li>
<li>一个产品可以有多个型号，但一个型号只能属于一个产品</li>
<li>型号可以启用/停用，停用的型号不可用于新订单</li>
</ul>`
          },
          {
            id: 'ch2-3',
            title: '2.3 工序管理',
            content: `<h3>工序管理</h3>
<p><strong>使用者</strong>：主数据管理员 / 生产部</p>
<p><strong>操作路径</strong>：主数据 → 工序</p>
<h4>操作步骤</h4>
<ol>
<li>点击「+ 新建工序」</li>
<li>填写：工序编码（如 OP-010）、工序名称（如"下料""冲压""焊接"）、所属车间、标准工时、责任人</li>
<li>点击「保存」</li>
</ol>
<h4>命名示例</h4>
<table>
<tr><th>编码</th><th>名称</th><th>车间</th><th>标准工时</th></tr>
<tr><td>OP-010</td><td>下料</td><td>下料车间</td><td>0.5h/件</td></tr>
<tr><td>OP-020</td><td>冲压</td><td>冲压车间</td><td>0.3h/件</td></tr>
<tr><td>OP-030</td><td>焊接</td><td>焊接车间</td><td>0.8h/件</td></tr>
</table>
<h4>注意事项</h4>
<ul>
<li>工序编码建议有规律，便于排序和识别</li>
<li>标准工时用于产能估算和排产参考</li>
<li>修改工序后，已有订单按原工序执行</li>
</ul>`
          },
          {
            id: 'ch2-4',
            title: '2.4 工艺路线管理',
            content: `<h3>工艺路线管理</h3>
<p><strong>使用者</strong>：主数据管理员 / 生产部</p>
<p><strong>操作路径</strong>：主数据 → 工艺路线</p>
<h4>操作步骤</h4>
<ol>
<li>点击「+ 新建工艺路线」</li>
<li>选择产品（必填）</li>
<li>输入路线名称（如"标准工艺路线"）</li>
<li>逐条添加工序步骤，可拖拽调整顺序</li>
<li>设置默认路线（一个产品只能有一个默认路线）</li>
<li>点击「保存」</li>
</ol>
<h4>注意事项</h4>
<ul>
<li>一个产品可设置多条工艺路线（如"标准路线"和"加急路线"）</li>
<li>订单确认时选择使用哪条工艺路线</li>
<li>工序顺序通过拖拽调整，非常直观</li>
<li>工艺路线变更不影响已确认的订单</li>
</ul>`
          },
          {
            id: 'ch2-5',
            title: '2.5 物料管理',
            content: `<h3>物料管理</h3>
<p><strong>使用者</strong>：主数据管理员 / 采购</p>
<p><strong>操作路径</strong>：主数据 → 物料</p>
<h4>操作步骤</h4>
<ol>
<li>点击「+ 新建物料」</li>
<li>填写：物料编码、物料名称、规格型号、单位、默认供应商、最低库存预警</li>
<li>点击「保存」</li>
</ol>
<h4>注意事项</h4>
<ul>
<li>物料编码全局唯一</li>
<li>设置最低库存预警，库存低于阈值时系统提示</li>
<li>物料用于 BOM 和采购管理</li>
</ul>`
          },
          {
            id: 'ch2-6',
            title: '2.6 BOM（物料清单）管理',
            content: `<h3>BOM（物料清单）管理</h3>
<p><strong>使用者</strong>：主数据管理员 / 生产部</p>
<p><strong>操作路径</strong>：主数据 → BOM</p>
<h4>操作步骤</h4>
<ol>
<li>点击「+ 新建 BOM」</li>
<li>选择产品（必填）</li>
<li>逐条添加物料：选择物料、输入用量、设定损耗率</li>
<li>设置版本号，BOM 支持版本管理</li>
<li>点击「保存」</li>
</ol>
<h4>注意事项</h4>
<ul>
<li>BOM 用于物料需求计算和成本核算</li>
<li>损耗率影响实际物料采购量</li>
<li>BOM 变更后，新订单使用新版本，旧订单用旧版本</li>
<li>建议建立 BOM 审核流程</li>
</ul>`
          },
          {
            id: 'ch2-7',
            title: '2.7 供应商管理',
            content: `<h3>供应商管理</h3>
<p><strong>使用者</strong>：采购 / 主数据管理员</p>
<p><strong>操作路径</strong>：主数据 → 供应商</p>
<h4>操作步骤</h4>
<ol>
<li>点击「+ 新建供应商」</li>
<li>填写：供应商编码、名称、联系人、联系方式、地址、供应商等级</li>
<li>点击「保存」</li>
</ol>
<h4>注意事项</h4>
<ul>
<li>供应商编码建议有规律，便于管理</li>
<li>供应商关联到采购订单</li>
<li>定期评估供应商绩效（交期准时率、质量合格率）</li>
</ul>`
          },
        ]
      },
      {
        id: 'ch3',
        title: '第三章 工价设置',
        icon: 'Money',
        children: [
          {
            id: 'ch3-1',
            title: '3.1 工序工价设置',
            content: `<h3>工序工价设置</h3>
<p><strong>使用者</strong>：财务 / 主数据管理员</p>
<p><strong>操作路径</strong>：主数据 → 工序工价</p>
<p>工价是 LightMes 的核心计费逻辑，按「产品型号 × 工序」设定计件单价（元/件）。</p>
<h4>设置方法一：逐个型号设置</h4>
<ol>
<li>进入产品型号详情页</li>
<li>点击「工价设置」Tab</li>
<li>为每个工序输入单价，如：下料 ¥0.5/件、冲压 ¥0.8/件、焊接 ¥1.2/件</li>
<li>点击「保存」</li>
</ol>
<h4>设置方法二：批量设置</h4>
<ol>
<li>在工序工价页面，选择产品型号</li>
<li>点击「批量设置」</li>
<li>输入各工序的统一单价</li>
<li>一键应用到所有选中型号</li>
</ol>
<h4>注意事项</h4>
<ul>
<li>工价精度到 2 位小数</li>
<li><strong>历史追溯</strong>：工价变更后，旧订单按旧价，新订单按新价</li>
<li>工价直接影响工资计算，务必准确</li>
<li>定期的工价审计有助于控制成本</li>
</ul>
<h4>示例</h4>
<table>
<tr><th>产品型号</th><th>工序</th><th>单价（元/件）</th></tr>
<tr><td>离心泵-标准型</td><td>下料</td><td>0.50</td></tr>
<tr><td>离心泵-标准型</td><td>冲压</td><td>0.80</td></tr>
<tr><td>离心泵-标准型</td><td>焊接</td><td>1.20</td></tr>
<tr><td>离心泵-标准型</td><td>组装</td><td>0.60</td></tr>
<tr><td>离心泵-标准型</td><td>质检</td><td>0.30</td></tr>
</table>`
          },
        ]
      },
      {
        id: 'ch4',
        title: '第四章 订单与生产',
        icon: 'List',
        children: [
          {
            id: 'ch4-1',
            title: '4.1 订单管理',
            content: `<h3>订单管理</h3>
<p><strong>使用者</strong>：生产计划员 / 销售</p>
<p><strong>操作路径</strong>：生产 → 订单管理</p>
<h4>手工创建订单</h4>
<ol>
<li>点击「+ 新建订单」</li>
<li>选择<strong>客户</strong>（必填）</li>
<li>选择<strong>产品型号</strong>（必填），支持多行</li>
<li>输入<strong>数量</strong>（必填）</li>
<li>设定<strong>交期</strong>（必填）</li>
<li>填写备注信息（可选）</li>
<li>点击「保存」</li>
</ol>
<h4>订单状态流转</h4>
<table>
<tr><th>状态</th><th>说明</th></tr>
<tr><td>草稿</td><td>刚创建，可修改</td></tr>
<tr><td>已确认</td><td>确认后自动分解为工单，不可修改</td></tr>
<tr><td>生产中</td><td>至少一个工单开始生产</td></tr>
<tr><td>已完成</td><td>所有工单生产完成</td></tr>
<tr><td>已发货</td><td>产品已出库</td></tr>
<tr><td>已取消</td><td>订单取消</td></tr>
</table>
<h4>批量导入</h4>
<p>点击「导入订单」→ 下载 Excel 模板 → 按格式填写 → 上传 → 系统自动校验并创建。</p>
<h4>注意事项</h4>
<ul>
<li>已确认的订单不能直接修改，需取消后重建</li>
<li>订单确认后自动分解为工单</li>
<li>订单交期影响排产优先级</li>
</ul>`
          },
          {
            id: 'ch4-2',
            title: '4.2 工单查看',
            content: `<h3>工单查看</h3>
<p><strong>使用者</strong>：生产计划员 / 班组长</p>
<p><strong>操作路径</strong>：生产 → 工单管理</p>
<h4>工单说明</h4>
<p>订单确认后，系统按工艺路线自动分解为工单。每个工单对应一个订单的一个工序。</p>
<h4>工单管理</h4>
<ul>
<li><strong>筛选</strong>：按订单号、产品型号、工序、状态筛选</li>
<li><strong>状态查看</strong>：待生产、生产中、已完成</li>
<li><strong>进度查看</strong>：每个工单的完成数量和比例</li>
<li><strong>操作</strong>：可暂停/恢复工单</li>
</ul>
<h4>注意事项</h4>
<ul>
<li>工单是排产和派工的最小单位</li>
<li>工单完成后才能进行下一道工序</li>
<li>可在工单详情中查看报工记录和审核状态</li>
</ul>`
          },
        ]
      },
      {
        id: 'ch5',
        title: '第五章 派工与执行',
        icon: 'User',
        children: [
          {
            id: 'ch5-1',
            title: '5.1 生产计划',
            content: `<h3>生产计划</h3>
<p><strong>使用者</strong>：生产计划员</p>
<p><strong>操作路径</strong>：生产 → 生产计划</p>
<h4>操作步骤</h4>
<ol>
<li>进入「生产计划」页面，查看所有待排产工单</li>
<li><strong>手动排产</strong>：选择工单 → 分配设备和产线 → 设定开始时间</li>
<li><strong>甘特图</strong>：可视化展示工单分布，支持拖拽平移调整起止日期</li>
<li><strong>物料齐套检查</strong>：排产前自动计算物料需求，提示缺料</li>
<li>点击「发布计划」</li>
</ol>
<h4>注意事项</h4>
<ul>
<li>排产时考虑设备负荷和人员可用性</li>
<li>物料不足时系统会提示不齐套，不建议强行排产</li>
<li>甘特图拖拽调整非常直观，适合快速调整排产</li>
<li>排产冲突时系统会高亮提示</li>
</ul>`
          },
          {
            id: 'ch5-2',
            title: '5.2 任务派工',
            content: `<h3>任务派工</h3>
<p><strong>使用者</strong>：生产主管 / 班组长</p>
<p><strong>操作路径</strong>：生产 → 任务派工</p>
<h4>操作步骤</h4>
<ol>
<li>进入「任务派工」页面，选择要派工的工单</li>
<li>系统<strong>智能推荐</strong>合适员工（根据技能标签和当前负荷）</li>
<li>选择员工，输入派工数量</li>
<li>点击「派工」，系统自动生成任务</li>
<li><strong>二维码标签</strong>：每个任务生成唯一二维码，可打印粘贴在工件上</li>
<li>系统自动<strong>推送通知</strong>到员工手机端</li>
</ol>
<h4>注意事项</h4>
<ul>
<li>派工时考虑员工的技能标签，确保能力匹配</li>
<li>合理分配负荷，避免部分员工过忙、部分闲置</li>
<li>二维码标签是扫码报工的关键入口</li>
<li>可批量派工：一次选择多个员工和数量</li>
</ul>`
          },
          {
            id: 'ch5-3',
            title: '5.3 员工技能管理',
            content: `<h3>员工技能管理</h3>
<p><strong>使用者</strong>：HR / 班组长</p>
<p><strong>操作路径</strong>：系统 → 技能管理</p>
<h4>操作步骤</h4>
<ol>
<li>进入「技能管理」页面</li>
<li>点击「+ 新建技能标签」，如：氩弧焊、冲压操作、质检</li>
<li>进入员工档案，为员工分配技能</li>
<li>技能等级可选：初级、中级、高级</li>
</ol>
<h4>派工中的应用</h4>
<p>排产派工时，系统会根据技能标签智能推荐合适的员工，提高派工效率和准确性。</p>`
          },
        ]
      },
      {
        id: 'ch6',
        title: '第六章 报工与审核',
        icon: 'Edit',
        children: [
          {
            id: 'ch6-1',
            title: '6.1 报工（员工端）',
            content: `<h3>报工（员工端 - 手机/H5）</h3>
<p><strong>使用者</strong>：操作员工</p>
<p><strong>操作路径</strong>：手机端 → 扫码报工 或 页面报工</p>
<h4>扫码报工流程</h4>
<ol>
<li>打开手机端，点击「扫码报工」</li>
<li>扫描任务二维码，系统自动识别任务</li>
<li>输入<strong>合格数</strong>和<strong>不良数</strong></li>
<li>上传完工照片或短视频（1-5张照片，视频最长30秒）</li>
<li>填写备注（如问题说明）</li>
<li>点击「提交」，立即显示预估工资</li>
</ol>
<h4>页面报工流程</h4>
<ol>
<li>在手机端点击「报工」，进入报工页面</li>
<li>手工选择任务（或搜索任务编号）</li>
<li>输入合格数/不良数 + 上传证据 + 提交</li>
</ol>
<h4>注意事项</h4>
<ul>
<li>合格数 + 不良数 ≤ 派工总数</li>
<li>多媒体证据越清晰，审核通过越快</li>
<li>提交后不可修改，如需修改联系班组长驳回</li>
<li>报工数据影响工资，务必真实准确</li>
</ul>`
          },
          {
            id: 'ch6-2',
            title: '6.2 报工审核',
            content: `<h3>报工审核（班组长/QC 后台）</h3>
<p><strong>使用者</strong>：班组长 / QC 质检员</p>
<p><strong>操作路径</strong>：生产 → 报工审核 / 报工单位</p>
<h4>多级审核流程</h4>
<ol>
<li><strong>班组长初审</strong>：<ul>
<li>查看报工照片/视频</li>
<li>核实合格数和不良数是否合理</li>
<li>通过→进入 QC 终审</li>
<li>驳回→填写原因，员工重新报工</li>
</ul></li>
<li><strong>QC 终审</strong>：<ul>
<li>从质检角度审核产品质量</li>
<li>通过→报工生效，自动计入工资</li>
<li>驳回→填写质检原因，返回员工</li>
</ul></li>
</ol>
<h4>批量审核</h4>
<p>支持批量选择报工记录 → 批量通过/驳回，提高审核效率。</p>
<h4>注意事项</h4>
<ul>
<li>审核时仔细查看员工上传的照片/视频</li>
<li>驳回时务必填写明确的原因</li>
<li>审核通过后报工数据即进入工资计算</li>
<li>定期审核避免积压影响工资计算</li>
</ul>`
          },
        ]
      },
      {
        id: 'ch7',
        title: '第七章 工资结算',
        icon: 'Money',
        children: [
          {
            id: 'ch7-1',
            title: '7.1 工资自动计算',
            content: `<h3>工资自动计算</h3>
<p><strong>使用者</strong>：财务 / 班组长</p>
<p><strong>操作路径</strong>：生产 → 工资管理</p>
<h4>计算逻辑</h4>
<p><strong>公式</strong>：<br>
<code>计件工资 = Σ(审核通过的报工合格数 × 工序工价)</code><br>
<code>月总工资 = 计件工资 + 补贴 - 扣款</code></p>
<h4>操作步骤</h4>
<ol>
<li>进入「工资管理」，选择月份</li>
<li>系统自动汇总所有审核通过的报工记录</li>
<li>查看员工工资明细：<ul>
<li>姓名、部门、工序数量、合格数、单价、金额</li>
<li>补贴项：全勤奖、岗位津贴等</li>
<li>扣款项：迟到扣款、罚款等</li>
</ul></li>
<li>确认无误后，点击「确认工资」</li>
<li>支持导出 Excel 工资表</li>
</ol>
<h4>注意事项</h4>
<ul>
<li>工资计算严格基于"审核通过的报工"</li>
<li>未审核的报工不计入工资</li>
<li>财务确认前可以手动调整补贴/扣款</li>
<li>工资确认后生成电子工资条</li>
</ul>`
          },
          {
            id: 'ch7-2',
            title: '7.2 电子工资条',
            content: `<h3>电子工资条</h3>
<p><strong>使用者</strong>：财务（生成）/ 员工（查看）</p>
<p><strong>操作路径</strong>：生产 → 工资条管理</p>
<h4>操作步骤</h4>
<ol>
<li>财务确认工资后，点击「生成工资条」</li>
<li>系统为每个员工生成电子工资条</li>
<li>员工在手机端查看工资条明细</li>
<li>员工可进行<strong>电子签名确认</strong></li>
<li>如员工有异议，可拒绝签名并提交问题</li>
</ol>
<h4>工资条内容</h4>
<ul>
<li>员工信息：姓名、部门、工号</li>
<li>计件工资：各工序报工明细</li>
<li>补贴明细：全勤奖、岗位津贴等</li>
<li>扣款明细：迟到、罚款等</li>
<li>实发金额</li>
<li>电子签名区</li>
</ul>
<h4>注意事项</h4>
<ul>
<li>员工签名后视为确认工资，不可再修改</li>
<li>异议处理流程：员工提出 → 财务复核 → 调整→重新生成</li>
<li>支持 PDF 下载和打印</li>
</ul>`
          },
        ]
      },
      {
        id: 'ch8',
        title: '第八章 进度监控',
        icon: 'Monitor',
        children: [
          {
            id: 'ch8-1',
            title: '8.1 首页仪表盘',
            content: `<h3>首页仪表盘</h3>
<p><strong>使用者</strong>：所有管理员</p>
<p><strong>操作路径</strong>：首页</p>
<h4>关键数据概览</h4>
<ul>
<li><strong>今日产值</strong>：当天完成的订单产值</li>
<li><strong>订单达成率</strong>：本月已完成 / 本月目标</li>
<li><strong>不良率</strong>：当日不良品占比</li>
<li><strong>待办事项</strong>：待审核报工、待派工任务</li>
</ul>
<h4>实时生产趋势图</h4>
<ul>
<li>产量趋势折线图（近7天/30天）</li>
<li>良率趋势图</li>
<li>订单达成率饼图</li>
</ul>
<h4>紧急提醒</h4>
<ul>
<li>交期即将逾期的订单（红色高亮）</li>
<li>异常报警：高不良率、未报工、设备故障</li>
</ul>`
          },
          {
            id: 'ch8-2',
            title: '8.2 进度看板',
            content: `<h3>进度看板</h3>
<p><strong>使用者</strong>：班组长 / 工厂主管</p>
<p><strong>操作路径</strong>：仪表盘 → 进度看板</p>
<h4>显示内容</h4>
<ul>
<li>所有订单的实时进度</li>
<li>各工序完成比例</li>
<li>交期倒计时</li>
<li>异常提醒（延迟、物料缺货）</li>
</ul>
<h4>注意事项</h4>
<ul>
<li>看板数据自动更新，无需手动刷新</li>
<li>快逾期的订单高亮显示</li>
<li>客户也可登录查看自己订单的进度</li>
</ul>`
          },
          {
            id: 'ch8-3',
            title: '8.3 车间大屏',
            content: `<h3>车间大屏</h3>
<p><strong>使用者</strong>：班组长 / 工厂主管</p>
<p><strong>操作路径</strong>：仪表盘 → 车间大屏</p>
<h4>显示内容</h4>
<ul>
<li><strong>实时产量</strong>：各工序当日目标 vs 实际</li>
<li><strong>良率/不良率</strong></li>
<li><strong>异常报警</strong>：不良率过高、未报工、物料不足</li>
<li><strong>交期倒计时</strong>：绿色(正常) / 黄色(当日) / 红色(逾期)</li>
<li><strong>员工排名</strong>：日完成数量排行、良率排行</li>
</ul>
<h4>注意事项</h4>
<ul>
<li>大屏应投放在车间显眼位置</li>
<li>数据每1-2分钟自动刷新</li>
<li>具有激励作用，员工可看到自己的排名</li>
</ul>`
          },
        ]
      },
      {
        id: 'ch9',
        title: '第九章 财务管理',
        icon: 'Coin',
        children: [
          {
            id: 'ch9-1',
            title: '9.1 客户对账单',
            content: `<h3>客户对账单</h3>
<p><strong>使用者</strong>：财务 / 销售客服</p>
<p><strong>操作路径</strong>：财务 → 客户对账单</p>
<h4>操作步骤</h4>
<ol>
<li>点击「+ 新建对账单」</li>
<li>选择客户和对账周期（如2026年5月）</li>
<li>系统自动列出该周期内所有订单及金额</li>
<li>核实订单数量和金额</li>
<li>确认无误后，对账单发送给客户</li>
<li>客户确认后，结束对账</li>
<li>支持导出 PDF 或 Excel</li>
</ol>
<h4>注意事项</h4>
<ul>
<li>定期对账（月底或季度末），不要积压</li>
<li>确保订单状态准确（已交付/已结款）</li>
<li>保留对账记录以备查证</li>
</ul>`
          },
          {
            id: 'ch9-2',
            title: '9.2 收支流水',
            content: `<h3>收支流水</h3>
<p><strong>使用者</strong>：财务 / 会计</p>
<p><strong>操作路径</strong>：财务 → 收支流水</p>
<h4>主要功能</h4>
<ul>
<li>查看所有收支记录（应收/应付/实收/实付）</li>
<li>按时间、类型、客户/供应商筛选</li>
<li>手动新增收支记录</li>
<li>与银行流水对账</li>
</ul>
<h4>注意事项</h4>
<ul>
<li>订单应收和采购应付自动生成</li>
<li>定期对账银行流水，确保账实相符</li>
</ul>`
          },
          {
            id: 'ch9-3',
            title: '9.3 成本毛利分析',
            content: `<h3>成本毛利分析</h3>
<p><strong>使用者</strong>：财务 / 运营主管</p>
<p><strong>操作路径</strong>：财务 → 成本毛利</p>
<h4>主要分析维度</h4>
<ul>
<li>订单总收入、生产成本（工资+物料）</li>
<li>毛利率、单笔订单毛利</li>
<li>毛利趋势图、成本占比图</li>
<li>产品毛利对比</li>
</ul>
<h4>注意事项</h4>
<ul>
<li>成本计算基于工价和 BOM，必须准确</li>
<li>定期分析毛利，识别低毛利产品</li>
<li>用毛利分析指导定价策略</li>
</ul>`
          },
        ]
      },
      {
        id: 'ch10',
        title: '第十章 溯源与报表',
        icon: 'DataBoard',
        children: [
          {
            id: 'ch10-1',
            title: '10.1 溯源查询',
            content: `<h3>溯源查询</h3>
<p><strong>使用者</strong>：质管 / 客户服务 / 工程</p>
<p><strong>操作路径</strong>：生产 → 溯源查询</p>
<h4>操作步骤</h4>
<ol>
<li>输入或扫描成品二维码/条码</li>
<li>系统反查全生命周期信息：<ul>
<li><strong>订单信息</strong>：订单号、客户、交期</li>
<li><strong>工单信息</strong>：工单号、产品型号、数量</li>
<li><strong>工序追踪</strong>：各工序操作员工、时间、数量、照片/视频</li>
<li><strong>质检记录</strong>：QC 审核意见、不良率</li>
<li><strong>物料批次</strong>：使用物料来源和批次号</li>
<li><strong>设备记录</strong>：使用设备和工序参数</li>
</ul></li>
<li>生成 PDF 溯源报告</li>
</ol>
<h4>注意事项</h4>
<ul>
<li>溯源信息完整性很重要，确保所有工序有记录</li>
<li>报工时必须上传照片/视频，否则无法溯源</li>
<li>用于：质量问题追责、客户投诉、产品召回</li>
</ul>`
          },
          {
            id: 'ch10-2',
            title: '10.2 生产报表',
            content: `<h3>生产报表</h3>
<p><strong>使用者</strong>：厂长 / 生产经理 / 财务</p>
<p><strong>操作路径</strong>：报表 → 生产报表</p>
<h4>指标类型</h4>
<ul>
<li><strong>产量</strong>：目标产量、实际完成量、达成率</li>
<li><strong>质量</strong>：合格率、不良率、重点工序不良率</li>
<li><strong>工时</strong>：总工时、有效工时、工时利用率、人均产出</li>
<li><strong>工序分析</strong>：各工序产出量、不良数、瓶颈识别</li>
<li><strong>员工排名</strong>：按产量、良率、工资排名</li>
</ul>
<h4>注意事项</h4>
<ul>
<li>报表基于报工数据，报工准确性影响报表准确性</li>
<li>异常数据需调查（如产量突增/骤减）</li>
<li>用报表数据指导改进（消除瓶颈、提高良率）</li>
</ul>`
          },
          {
            id: 'ch10-3',
            title: '10.3 经营报表',
            content: `<h3>经营报表</h3>
<p><strong>使用者</strong>：厂长 / 财务 / 运营</p>
<p><strong>操作路径</strong>：报表 → 经营报表</p>
<h4>指标类型</h4>
<ul>
<li><strong>销售</strong>：订单总数、总金额、平均金额、完成率</li>
<li><strong>客户</strong>：客户总数、活跃客户数、贡献度排名</li>
<li><strong>成本毛利</strong>：总收入、总成本、毛利、毛利率</li>
<li><strong>趋势</strong>：月销售额趋势、客户增长趋势</li>
</ul>`
          },
          {
            id: 'ch10-4',
            title: '10.4 采购统计',
            content: `<h3>采购统计</h3>
<p><strong>使用者</strong>：采购 / 财务 / 运营</p>
<p><strong>操作路径</strong>：报表 → 采购统计</p>
<h4>指标类型</h4>
<ul>
<li>采购总金额，按供应商/物料类别排名</li>
<li>供应商评价：交期准时率、质量合格率</li>
<li>物料库存：积压预警、缺货预警、周转率</li>
</ul>`
          },
        ]
      },
      {
        id: 'ch11',
        title: '第十一章 设备与保养',
        icon: 'Tools',
        children: [
          {
            id: 'ch11-1',
            title: '11.1 设备档案',
            content: `<h3>设备档案</h3>
<p><strong>使用者</strong>：设备管理员 / 生产主管</p>
<p><strong>操作路径</strong>：生产 → 设备管理</p>
<h4>操作步骤</h4>
<ol>
<li>点击「新增设备」</li>
<li>填写设备名称（必填）、型号、所属车间</li>
<li>编码可留空，系统自动生成</li>
<li>保存后可在列表查看上次/下次维护日期</li>
</ol>
<p>设备状态：<strong>正常</strong>、<strong>维修中</strong>、<strong>已退役</strong></p>`
          },
          {
            id: 'ch11-2',
            title: '11.2 日常点检',
            content: `<h3>日常点检</h3>
<p><strong>使用者</strong>：班组长 / 设备员</p>
<p><strong>操作路径</strong>：设备管理 → 列表「点检」</p>
<h4>操作步骤</h4>
<ol>
<li>在设备行点击「点检」</li>
<li>系统默认登记「日检 / 合格」</li>
<li>异常设备应改为「维修中」状态</li>
</ol>
<p>点检数据供 AI 设备健康分析参考。</p>`
          },
          {
            id: 'ch11-3',
            title: '11.3 保养计划',
            content: `<h3>保养计划（预防性维护）</h3>
<p><strong>使用者</strong>：设备管理员</p>
<p><strong>操作路径</strong>：设备管理 →「保养」→ 保养计划</p>
<h4>操作步骤</h4>
<ol>
<li>点击设备行的「保养」，打开保养管理抽屉</li>
<li>点击「新增计划」</li>
<li>配置：计划类型（日检/周检/月检）、周期(天)、下次日期、负责人、检查项</li>
<li>保存计划</li>
</ol>
<h4>注意事项</h4>
<ul>
<li>同一设备可配置多条计划（如周检+月检）</li>
<li>周期天数用于登记保养后自动推算下次维护日期</li>
</ul>`
          },
          {
            id: 'ch11-4',
            title: '11.4 登记保养记录',
            content: `<h3>登记保养记录</h3>
<p><strong>使用者</strong>：设备员 / 班组长</p>
<p><strong>操作路径</strong>：保养抽屉 → 执行/登记保养</p>
<h4>操作步骤</h4>
<ol>
<li><strong>从计划执行</strong>：点击计划行的「执行」→ 选择结果（合格/不合格/部分完成）→ 填写说明 → 提交</li>
<li><strong>直接登记</strong>：点击「登记保养」→ 可选关联计划 → 填写结果与说明 → 提交</li>
<li>提交后上次维护更新为当天，下次维护自动顺延</li>
</ol>`
          },
        ]
      },
      {
        id: 'ch12',
        title: '附录：常见问题与最佳实践',
        icon: 'QuestionFilled',
        children: [
          {
            id: 'ch12-1',
            title: '12.1 常见问题',
            content: `<h3>常见问题</h3>
<h4>Q1：订单确认后发现产品型号错了，怎么办？</h4>
<p>已确认的订单不能直接修改。操作：<strong>作废该订单 → 新建正确的订单</strong>，系统会记录作废原因和时间。</p>
<h4>Q2：报工提交后发现数字填错了，怎么办？</h4>
<p>已提交的报工不能自己修改。联系班组长「<strong>驳回</strong>」该报工，员工重新报工。</p>
<h4>Q3：工资计算似乎有误，怎么复查？</h4>
<p>进入「工资管理」，点击员工名称查看详细计算过程，每笔报工的数量和金额都有记录。如确实有误，通知财务调整。</p>
<h4>Q4：物料库存不足，排产能推进吗？</h4>
<p>排产前系统会提示「物料不齐套」。两种选择：<strong>A. 延期排产</strong>（等物料到货）或 <strong>B. 紧急采购</strong>（加急订货）。不建议在物料不足时排产。</p>
<h4>Q5：员工对工资有异议，怎么处理？</h4>
<p>在工资管理里查看明细，每笔报工的工序和金额都有记录。如有虚报，可查看报工照片/视频对质。确实算错的由财务调整。</p>
<h4>Q6：产品的工艺路线要改，已生成的订单受影响吗？</h4>
<p>已确认的订单按原工艺路线执行不受影响。只有新确认的订单才用新工艺路线。建议新旧同时维护一段时间再删除旧的。</p>`
          },
          {
            id: 'ch12-2',
            title: '12.2 最佳实践建议',
            content: `<h3>最佳实践建议</h3>
<h4>1. 数据准确性最重要</h4>
<ul>
<li>产品/型号/工价/BOM 一定要准确</li>
<li>报工数据关系到工资，员工很关注</li>
<li>定期审计数据，发现异常及时处理</li>
</ul>
<h4>2. 建立规范和标准</h4>
<ul>
<li>产品编码规范、订单号规范、字典值规范</li>
<li>便于数据查询和维护</li>
</ul>
<h4>3. 权限最小化原则</h4>
<ul>
<li>员工只能看自己的任务和工资</li>
<li>班组长能管理自己部门的工作</li>
<li>财务独立管理工资和对账</li>
</ul>
<h4>4. 定期备份和复盘</h4>
<ul>
<li>定期导出重要数据（工资表、订单表）</li>
<li>月度或季度复盘各项指标</li>
</ul>
<h4>5. 员工培训很关键</h4>
<ul>
<li>不同角色需要培训不同功能</li>
<li>班组长要理解报工审核的重要性</li>
<li>员工要知道如何正确报工</li>
</ul>`
          },
        ]
      },
    ]
  },
  {
    id: 'part2',
    title: '第二篇：H5员工端使用指南',
    icon: 'User',
    children: [
      {
        id: 'emp-ch1',
        title: '第一章 登录与首页',
        icon: 'Key',
        children: [
          {
            id: 'emp-1-1',
            title: '1.1 登录与认证',
            content: `<h3>登录与身份认证</h3>
<p><strong>适用用户</strong>：工厂员工 / 操作工人</p>
<p><strong>访问方式</strong>：手机浏览器打开 H5 链接，或扫描工厂发放的二维码</p>
<h4>首次登录</h4>
<ol>
<li>在手机浏览器输入应用 URL，或扫描二维码</li>
<li>输入用户名（通常是工号）和密码</li>
<li>首次登录需修改初始密码</li>
<li>成功后自动跳转到首页</li>
</ol>
<h4>注意事项</h4>
<ul>
<li>账户由 HR 分配，联系人力资源部获取</li>
<li>忘记密码：点击「忘记密码」→ 输入手机号 → 验证码 → 重置</li>
<li>15分钟无操作自动退出</li>
<li>工作完毕记得退出登录</li>
</ul>`
          },
          {
            id: 'emp-1-2',
            title: '1.2 首页仪表盘',
            content: `<h3>首页仪表盘</h3>
<h4>页面布局</h4>
<ul>
<li><strong>账户信息栏</strong>：显示姓名、部门、日期</li>
<li><strong>今日概览卡片</strong>：<ul>
<li>待报工：还未报工的任务数</li>
<li>已报工：已提交报工数</li>
<li>待审核：班组长待初审的报工数</li>
<li>今日工资：基于已审核报工的实时估算</li>
</ul></li>
<li><strong>快速操作按钮</strong>：我的任务、扫码报工、打卡</li>
<li><strong>待办提醒</strong>：新任务、驳回通知等</li>
<li><strong>本周产量趋势图</strong></li>
</ul>`
          },
        ]
      },
      {
        id: 'emp-ch2',
        title: '第二章 任务与报工',
        icon: 'Edit',
        children: [
          {
            id: 'emp-2-1',
            title: '2.1 我的任务',
            content: `<h3>我的任务</h3>
<p><strong>路径</strong>：首页「我的任务」或底部导航「任务」</p>
<h4>任务列表</h4>
<ul>
<li>显示派给自己的所有任务</li>
<li>每项任务卡片显示：任务编码、产品信息、工序名称、派工数量、进度、状态</li>
<li><strong>任务状态</strong>：待开始 / 生产中 / 已完成 / 已驳回</li>
<li>可按工序、状态筛选，按产品名/订单号搜索</li>
</ul>
<h4>任务操作</h4>
<ul>
<li>点击任务 → 查看任务详情</li>
<li>点击「扫码报工」→ 进入报工流程</li>
</ul>`
          },
          {
            id: 'emp-2-2',
            title: '2.2 扫码报工',
            content: `<h3>扫码报工</h3>
<p><strong>路径</strong>：首页「扫码报工」或底部导航「报工」</p>
<h4>完整报工流程</h4>
<ol>
<li><strong>扫码识别</strong>：扫描任务二维码，系统自动识别任务</li>
<li><strong>输入数量</strong>：输入合格数和不良数（合格+不良 ≤ 派工数）</li>
<li><strong>上传证据</strong>：<ul>
<li>照片：1-5张，JPG/PNG，每张 ≤ 5MB</li>
<li>视频：最长30秒，MP4 格式，≤ 10MB</li>
</ul></li>
<li><strong>填写备注</strong>：如有异常或特殊情况</li>
<li><strong>确认提交</strong>：提交后立即显示预估工资</li>
</ol>
<h4>预估工资计算</h4>
<p><code>预估工资 = 合格数 × 工序工价</code></p>
<p>注意：这是预估值，最终工资需要审核通过后才确认。</p>
<h4>注意事项</h4>
<ul>
<li>数据要真实准确，虚报影响工资和信誉</li>
<li>照片要清晰展示产品细节</li>
<li>如有问题一定在备注中说明</li>
<li>提交后不可修改，被驳回可重新报工</li>
</ul>`
          },
        ]
      },
      {
        id: 'emp-ch3',
        title: '第三章 工资与考勤',
        icon: 'Money',
        children: [
          {
            id: 'emp-3-1',
            title: '3.1 我的工资',
            content: `<h3>我的工资</h3>
<p><strong>路径</strong>：底部导航「我的」→「工资」</p>
<h4>月工资汇总</h4>
<ul>
<li>选择月份查看</li>
<li><strong>计件工资</strong>：基于审核通过的报工合格数 × 工序工价</li>
<li><strong>补贴</strong>：全勤奖、岗位津贴等</li>
<li><strong>扣款</strong>：迟到扣款、罚款等</li>
<li><strong>实发金额</strong>：计件工资 + 补贴 - 扣款</li>
</ul>
<h4>工序报工明细</h4>
<p>显示每笔报工的工序名称、合格数、单价和金额，完全透明可查。</p>`
          },
          {
            id: 'emp-3-2',
            title: '3.2 电子工资条',
            content: `<h3>电子工资条</h3>
<p><strong>路径</strong>：我的 → 工资条</p>
<h4>功能特点</h4>
<ul>
<li>三种查看模式：简洁版、详细版、PDF 下载</li>
<li>显示完整的工资明细和各项金额</li>
<li><strong>电子签名</strong>：确认工资后可签名确认</li>
<li>有异议可选择「拒绝签名」并提交问题</li>
<li>支持 PDF 下载和打印</li>
</ul>
<h4>注意事项</h4>
<ul>
<li>签名后视为确认工资，不可再修改</li>
<li>有异议先和班组长沟通，再联系财务</li>
<li>在下月发薪前完成签名</li>
</ul>`
          },
          {
            id: 'emp-3-3',
            title: '3.3 考勤打卡',
            content: `<h3>考勤打卡</h3>
<p><strong>路径</strong>：首页「打卡」或底部导航「我的」→「考勤打卡」</p>
<h4>操作步骤</h4>
<ol>
<li><strong>签到</strong>：上班时点击「签到」按钮，系统记录签到时间</li>
<li><strong>签退</strong>：下班时点击「签退」按钮，显示工作时长</li>
</ol>
<h4>打卡记录</h4>
<p>显示最近打卡记录：日期、签到时间、签退时间、工作时长、状态（准时/迟到）。</p>
<h4>注意事项</h4>
<ul>
<li>准时打卡，避免迟到扣款</li>
<li>忘记打卡可申请补卡（需班组长审批）</li>
<li>迟到15分钟起扣款，累计迟到影响全勤奖</li>
<li>考勤数据用于加班费计算和绩效考核</li>
</ul>`
          },
        ]
      },
      {
        id: 'emp-ch4',
        title: '第四章 员工FAQ',
        icon: 'QuestionFilled',
        children: [
          {
            id: 'emp-4-1',
            title: '4.1 常见问题',
            content: `<h3>常见问题</h3>
<h4>Q1：怎样快速报工？</h4>
<p>推荐使用<strong>扫码报工</strong>：打开手机端 → 首页「扫码报工」→ 扫描二维码 → 输入合格数/不良数 → 提交，整个流程不超过30秒。</p>
<h4>Q2：报工被驳回了，怎么办？</h4>
<ol>
<li>查看驳回原因通知</li>
<li>进入「我的任务」找到被驳回的任务</li>
<li>根据反馈重新报工（可修正数据和照片）</li>
</ol>
<p>常见驳回原因：照片不清晰、数量异常、没有备注、没上传视频。</p>
<h4>Q3：报工多久能到账工资？</h4>
<ul>
<li>报工提交 → 预估工资：立即（秒级）</li>
<li>预估 → 最终工资（审核通过）：1-3天</li>
<li>月工资最终确认：月底或次月初</li>
</ul>
<h4>Q4：预估工资和最终工资为什么不一样？</h4>
<ul>
<li>报工被驳回：返工或废品不计工资</li>
<li>还在审核中的报工未计入</li>
<li>最终工资可能加入补贴或扣款</li>
</ul>
<h4>Q5：如何避免报工被驳回？</h4>
<ul>
<li>数字准确：不虚报</li>
<li>拍好照片：至少3张，清晰展示产品</li>
<li>写好备注：有问题一定说明</li>
<li>及时报工：当天完成当天报</li>
<li>不确定时先问班组长</li>
</ul>
<h4>Q6：员工端和客户端有什么区别？</h4>
<table>
<tr><th>功能</th><th>员工端</th><th>客户端</th></tr>
<tr><td>查看任务</td><td>✅</td><td>❌</td></tr>
<tr><td>扫码报工</td><td>✅</td><td>❌</td></tr>
<tr><td>查看工资</td><td>✅</td><td>❌</td></tr>
<tr><td>客户下单</td><td>❌</td><td>✅</td></tr>
<tr><td>查看订单进度</td><td>❌</td><td>✅</td></tr>
<tr><td>对账单</td><td>❌</td><td>✅</td></tr>
</table>`
          },
        ]
      },
    ]
  },
  {
    id: 'part3',
    title: '第三篇：H5客户端使用指南',
    icon: 'ShoppingCart',
    children: [
      {
        id: 'cust-ch1',
        title: '第一章 登录与首页',
        icon: 'Key',
        children: [
          {
            id: 'cust-1-1',
            title: '1.1 登录与认证',
            content: `<h3>登录与认证</h3>
<p><strong>适用用户</strong>：客户 / 会员用户</p>
<p><strong>访问方式</strong>：手机浏览器打开 H5 链接，或扫描企业提供的二维码</p>
<h4>登录步骤</h4>
<ol>
<li>打开应用，进入登录页</li>
<li>输入用户名（手机号或账号）和密码</li>
<li>点击「登录」，系统验证身份</li>
<li>首次登录可能需要完善用户资料</li>
</ol>
<h4>注意事项</h4>
<ul>
<li>账户由企业分配，联系销售或客服获取</li>
<li>忘记密码：点击「忘记密码」→ 输入手机号 → 验证码 → 重置</li>
<li>15分钟未操作自动退出</li>
<li>一个客户账户对应一个公司</li>
</ul>`
          },
          {
            id: 'cust-1-2',
            title: '1.2 首页与导航',
            content: `<h3>首页与导航</h3>
<h4>首页布局</h4>
<ul>
<li><strong>账户信息栏</strong>：用户名、公司名、余额</li>
<li><strong>快速菜单</strong>：我要下单、订单列表、订单追踪、对账单、消息中心、个人设置</li>
<li><strong>最近订单</strong>：最近订单卡片列表</li>
</ul>
<h4>底部导航</h4>
<table>
<tr><th>菜单</th><th>功能</th></tr>
<tr><td>首页</td><td>仪表盘、快速菜单</td></tr>
<tr><td>下单</td><td>产品浏览与下单</td></tr>
<tr><td>订单</td><td>订单列表与详情</td></tr>
<tr><td>追踪</td><td>订单进度查询</td></tr>
<tr><td>我的</td><td>个人中心、设置</td></tr>
</table>`
          },
        ]
      },
      {
        id: 'cust-ch2',
        title: '第二章 下单与订单',
        icon: 'List',
        children: [
          {
            id: 'cust-2-1',
            title: '2.1 客户下单',
            content: `<h3>客户下单</h3>
<p><strong>路径</strong>：底部导航「下单」或首页「我要下单」</p>
<h4>完整下单流程</h4>
<p><strong>第一步：浏览产品</strong></p>
<ol>
<li>进入下单页面，显示产品列表</li>
<li>可按分类过滤或搜索产品</li>
<li>点击产品查看详情</li>
</ol>
<p><strong>第二步：选择型号与规格</strong></p>
<ol>
<li>点击要购买的产品，进入型号选择页</li>
<li>显示该产品的所有可用型号（颜色、材料、规格、库存状态）</li>
<li>选择需要的型号</li>
</ol>
<p><strong>第三步：输入订单信息</strong></p>
<ol>
<li>输入订单数量（≥ 1件）</li>
<li>选择交期（建议至少7天后）</li>
<li>填写特殊要求备注</li>
<li>点击「提交订单」→ 确认信息 → 订单提交成功</li>
</ol>
<h4>注意事项</h4>
<ul>
<li>确认型号和数量无误后再提交</li>
<li>建议提前7天下单，紧急订单请电话咨询</li>
<li>草稿状态的订单可修改，已确认后不可修改</li>
</ul>`
          },
          {
            id: 'cust-2-2',
            title: '2.2 订单管理',
            content: `<h3>订单管理</h3>
<p><strong>路径</strong>：底部导航「订单」</p>
<h4>订单列表</h4>
<ul>
<li>显示所有历史订单（卡片形式）</li>
<li>按状态、时间筛选，搜索订单号</li>
<li>每张卡片显示：订单号、产品、数量、金额、状态、交期</li>
</ul>
<h4>订单详情</h4>
<ul>
<li>基本信息：订单号、创建时间、状态</li>
<li>产品信息：名称、型号、数量、单价</li>
<li>进度信息：当前工序、完成比例、预计完成时间</li>
<li>操作：查看进度、联系客服、下载文档</li>
</ul>
<h4>订单状态</h4>
<p>草稿 → 已确认 → 生产中 → 已完成 → 已发货 → 已取消</p>`
          },
          {
            id: 'cust-2-3',
            title: '2.3 订单进度追踪',
            content: `<h3>订单进度追踪</h3>
<p><strong>路径</strong>：底部导航「追踪」或订单详情「查看进度」</p>
<h4>进度查看</h4>
<ul>
<li><strong>时间线视图</strong>：显示各工序的完成状态（已完成/进行中/待开始）</li>
<li><strong>工序详情</strong>：派工人数、完成数量、预计完成时间</li>
<li><strong>自动刷新</strong>：每2分钟更新一次，也可手动刷新</li>
</ul>
<h4>注意事项</h4>
<ul>
<li>如显示「延迟」，说明可能无法按时交期，建议联系客服</li>
<li>生产完成时会自动推送通知</li>
<li>可在订单列表直接查看进度概要</li>
</ul>`
          },
        ]
      },
      {
        id: 'cust-ch3',
        title: '第三章 对账与消息',
        icon: 'Document',
        children: [
          {
            id: 'cust-3-1',
            title: '3.1 对账单查看',
            content: `<h3>对账单查看</h3>
<p><strong>路径</strong>：底部导航「我的」→「对账单」</p>
<h4>操作步骤</h4>
<ol>
<li>按月选择对账单</li>
<li>查看对账明细：各订单号、产品、金额、状态</li>
<li>核对总金额、已付金额、待付金额</li>
<li>支持操作：下载 PDF、申请发票、确认对账、提出异议</li>
</ol>
<h4>注意事项</h4>
<ul>
<li>定期查看对账单，及时确认</li>
<li>如有不符，点击「提出异议」，财务3-5个工作日回复</li>
<li>已确认的对账单不可再修改</li>
</ul>`
          },
          {
            id: 'cust-3-2',
            title: '3.2 消息通知',
            content: `<h3>消息通知</h3>
<p><strong>路径</strong>：底部导航「我的」→「消息中心」</p>
<h4>消息类型</h4>
<ul>
<li>订单确认通知</li>
<li>生产开始通知</li>
<li>工序完成通知</li>
<li>生产完成通知</li>
<li>已发货通知</li>
<li>对账单通知</li>
<li>系统通知</li>
</ul>
<h4>消息管理</h4>
<ul>
<li>消息列表按时间倒序显示</li>
<li>已读/未读标记</li>
<li>可删除单条或清空所有消息</li>
<li>可配置推送开关、推送类型和不打扰时段</li>
</ul>`
          },
        ]
      },
      {
        id: 'cust-ch4',
        title: '第四章 客户FAQ',
        icon: 'QuestionFilled',
        children: [
          {
            id: 'cust-4-1',
            title: '4.1 常见问题',
            content: `<h3>常见问题</h3>
<h4>Q1：提交订单后可以修改吗？</h4>
<p><strong>草稿状态</strong>：可以修改，进入订单详情点击「编辑」修改数量或交期。<br>
<strong>已确认状态</strong>：不能修改，需作废原订单重新下单，或联系客服。</p>
<h4>Q2：如何知道订单是否按时完成？</h4>
<p>三种方式：1. 消息推送通知 2. 「订单追踪」实时查看 3. 订单列表显示预计完成时间</p>
<h4>Q3：进度显示「延迟」是什么意思？</h4>
<p>表示可能无法按时完成，原因可能是物料延迟、产能不足、质检不通过。建议立即联系客服了解情况。</p>
<h4>Q4：对账单金额与我的账目不符怎么办？</h4>
<ol>
<li>仔细核对每个订单号和金额</li>
<li>检查是否有已取消订单被包含</li>
<li>如仍不符，点击「提出异议」说明情况</li>
<li>财务会在3-5个工作日回复</li>
</ol>
<h4>Q5：如何联系工厂客服？</h4>
<ul>
<li>订单详情页点击「联系客服」</li>
<li>消息中心点击「询问工厂」</li>
<li>个人中心查看客服电话和微信</li>
</ul>
<h4>Q6：支持哪些浏览器？</h4>
<p>iPhone：Safari 或 Chrome；Android：Chrome、Firefox。推荐使用最新版 Chrome 或 Safari。</p>`
          },
        ]
      },
    ]
  },
]

export function getGuideData(): GuideSection[] {
  return guideData
}

export function flattenSections(sections: GuideSection[]): GuideSection[] {
  const result: GuideSection[] = []
  function walk(list: GuideSection[]) {
    for (const s of list) {
      if (s.content) {
        result.push(s)
      }
      if (s.children) {
        walk(s.children)
      }
    }
  }
  walk(sections)
  return result
}

export function findSectionById(id: string): GuideSection | undefined {
  function walk(list: GuideSection[]): GuideSection | undefined {
    for (const s of list) {
      if (s.id === id) return s
      if (s.children) {
        const found = walk(s.children)
        if (found) return found
      }
    }
    return undefined
  }
  return walk(guideData)
}

export function getBreadcrumb(id: string): GuideSection[] {
  const path: GuideSection[] = []
  function walk(list: GuideSection[]): boolean {
    for (const s of list) {
      path.push(s)
      if (s.id === id) return true
      if (s.children && walk(s.children)) return true
      path.pop()
    }
    return false
  }
  walk(guideData)
  return path
}

export default guideData
