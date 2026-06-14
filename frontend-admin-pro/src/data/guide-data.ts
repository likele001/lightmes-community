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
</ul>
<h4>QC 审核中可关联质检模板与缺陷代码</h4>
<p>新版 QC 终审支持<strong>按质检模板逐项打勾</strong>，并对不合格项<strong>关联缺陷代码</strong>，自动落库到 <code>inspection_records</code>。详见 <a>6.3 质量管理</a>。</p>`
          },
          {
            id: 'ch6-3',
            title: '6.3 质量管理（质检模板 / 缺陷代码 / 检测记录）',
            content: `<h3>质量管理</h3>
<p>LightMes 提供「<strong>质检模板 → 检测记录 → 缺陷分析</strong>」的完整质量管理闭环：先配置好模板（哪些工序要查什么），QC 审核报工时按模板逐项打勾，结果自动汇总到缺陷分析报表里。</p>
<h4>角色与权限</h4>
<ul>
<li><code>report.audit</code> 权限：可管理质检模板、缺陷代码、查看检测记录</li>
<li>QC 终审岗：审核报工时填写检测记录</li>
<li>质量分析（厂长/经理）：查看缺陷分析报表</li>
</ul>
<h4>1. 质检模板（Inspection Template）</h4>
<p><strong>路径</strong>：主数据 → 质检模板</p>
<p>模板是「某个工序 / 某类产品要做哪些检查项」的清单。</p>
<p>字段说明：</p>
<ul>
<li><strong>编码 / 名称</strong>：如 <code>WELD-STD-01</code>「标准焊接检查」</li>
<li><strong>关联工序</strong>（可选）：限定本模板只在该工序审核时出现</li>
<li><strong>关联产品</strong>（可选）：限定只对该产品生效</li>
<li><strong>是否启用</strong>：停用后审核页不再出现</li>
</ul>
<p>模板下有多个<strong>检查明细项</strong>，每项 3 种类型：</p>
<ul>
<li><code>pass_fail</code> 合格/不合格：最常用（焊点是否饱满、尺寸是否合规）</li>
<li><code>measure</code> 测量值：填实测数值（厚度 1.2mm、长度 50mm），需配 <code>standard_value</code> / <code>upper_limit</code> / <code>lower_limit</code> / <code>unit</code>，系统自动判定 pass/fail</li>
<li><code>text</code> 文本描述：开放文字（外观描述、备注）</li>
</ul>
<p>明细项可设置 <code>is_required</code> 必填，QC 不填该项不能通过审核。</p>
<h4>2. 缺陷代码（Defect Code）</h4>
<p><strong>路径</strong>：主数据 → 缺陷代码</p>
<p>把工厂常出现的质量问题<strong>标准化成代码</strong>，便于统计与趋势分析。</p>
<p>字段：</p>
<ul>
<li><strong>编码 / 名称</strong>：如 <code>D-001</code>「焊点虚焊」、<code>D-002</code>「尺寸超差」</li>
<li><strong>严重度</strong>：
  <ul>
    <li><code>critical</code> 致命：影响安全的缺陷，必须返工/报废</li>
    <li><code>major</code> 主要：影响功能但可让步接收</li>
    <li><code>minor</code> 次要：轻微外观缺陷，不影响使用</li>
  </ul>
</li>
<li><strong>是否启用</strong>：旧缺陷下线后停用</li>
</ul>
<h4>3. 检测记录（Inspection Record）</h4>
<p><strong>录入路径</strong>：报工审核 → QC 终审时</p>
<p>QC 进入审核页 → 系统自动加载该工序/产品对应的<strong>生效模板</strong> → 逐项打勾 / 填值：</p>
<ul>
<li><code>pass_fail</code> 项：选「合格 / 不合格 / 不适用」</li>
<li><code>measure</code> 项：填实测值，超上下限自动标红</li>
<li>不合格项必填<strong>缺陷代码</strong> + 备注</li>
</ul>
<p>审核提交后写入 <code>inspection_records</code> 表，与 <code>report_unit_audits</code> 关联。</p>
<h4>4. 缺陷分析报表</h4>
<p><strong>路径</strong>：报表 → 缺陷分析</p>
<p>从 <code>inspection_records</code> 汇总：</p>
<ul>
<li><strong>缺陷码 TOP 10</strong>：出现频率最高的缺陷，便于针对性改善工艺</li>
<li><strong>缺陷严重度分布</strong>：critical / major / minor 占比，监控质量趋势</li>
<li><strong>按工序 / 产品 / 时间段</strong>筛选</li>
<li><strong>缺陷-员工关联</strong>：分析某员工的高频缺陷，定位培训需求</li>
</ul>
<h4>典型流程</h4>
<ol>
<li>质量主管在「主数据 → 质检模板」配置模板（如「焊接检查」），挂 5~10 个检查项</li>
<li>在「主数据 → 缺陷代码」维护 10~30 个缺陷码（含 critical/major/minor）</li>
<li>QC 审核报工时，系统自动加载模板，QC 逐项打勾 + 标缺陷</li>
<li>月底看缺陷分析报表，对 top 缺陷做工艺改善或员工培训</li>
</ol>
<h4>与报工审核的关联</h4>
<p>QC 终审不通过时，可以同时：</p>
<ul>
<li>把报工<strong>驳回</strong>（员工重新报工）</li>
<li>把对应<strong>缺陷码</strong>绑定到 <code>inspection_records</code>（用于缺陷分析）</li>
</ul>
<p>这样驳回原因有数据支撑，后续能追到「哪个工序 / 哪个员工 / 哪类缺陷最多」。</p>`
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
        title: '第十二章 智能中心与 IM 推送',
        icon: 'ChatLineRound',
        children: [
          {
            id: 'ch12-1',
            title: '12.1 飞书消息推送',
            content: `<h3>飞书消息推送</h3>
<p>LightMes 通过飞书自建应用把派工、报工审核、工资、预警等事件推送到飞书群或个人。<strong>必须先在飞书开放平台创建企业自建应用</strong>，详见 <a href="https://admin.mes.cenkor.cn" target="_blank">《飞书消息推送部署指南》</a>（docs/飞书消息推送部署指南.md）。</p>
<h4>配置入口</h4>
<p>侧边栏 → <strong>系统管理 → 飞书消息推送</strong>（需 <code>setting.manage</code> 权限）。</p>
<h4>三步开启</h4>
<ol>
<li><strong>填入 App ID / App Secret</strong>：从飞书开放平台 → 应用 → 凭证获取；<code>Encrypt Key</code> / <code>Verification Token</code> 在「事件订阅」页获取。</li>
<li><strong>设置事件回调</strong>：在「飞书消息推送」页面保存后会显示事件回调 URL（<code>{域名}/api/feishu/events</code>），粘贴到飞书开放平台 → 事件订阅 → 请求地址 URL，飞书会发起 <code>url_verification</code> 验证。</li>
<li><strong>配置群组 chat_id</strong>：点「拉取机器人所在群」自动列出机器人已加入的群；选三个固定群（<strong>生产群 / 管理群 / 全厂群</strong>），<code>chat_id</code> 必须以 <code>oc_</code> 开头，<em>不是</em>机器人 webhook URL。</li>
</ol>
<h4>员工飞书账号绑定（推到个人）</h4>
<ul>
<li><strong>方案 A · OAuth（推荐）</strong>：员工在 H5 个人中心点「绑定我的飞书」跳转飞书授权，回调后系统自动存 <code>open_id</code>。</li>
<li><strong>方案 B · 管理员后台批量匹配</strong>：Admin → 飞书消息推送 → 「按手机号批量匹配」，员工手机号与飞书账号一致时一键批量绑定。</li>
<li><strong>方案 C · 个人手动</strong>：Admin → 「人员绑定」用邮箱 / 手机号逐个匹配（适用于手机号不一致的少数员工）。</li>
</ul>
<h4>推送规则</h4>
<p>事件码 → 推送目标 → 通道。系统默认规则可按需调整，典型事件：</p>
<ul>
<li><code>dispatch.assigned</code> 派工 → 推给被派员工（飞书 + 站内）</li>
<li><code>report.submitted</code> 报工提交 → 推给部门负责人 + 车间负责人（飞书 + 站内）</li>
<li><code>report.leader_approved</code> / <code>report.qc_approved</code> 审核通过 → 推给员工</li>
<li><code>report.rejected</code> 驳回 → 推给员工</li>
<li><code>salary.slip_remind</code> / <code>salary.slip_reset</code> 工资条 → 推给员工</li>
<li><code>alert</code> 预警 → 按 <code>level</code>（info/warning/danger/critical）逐级升级到部门管理 / 老板 / 全厂群</li>
<li><code>brief.daily</code> 每日简报 → 推给老板 + 管理群 + 全厂群（每天 20:00 自动跑，需开启 <code>briefing.daily_enabled</code>）</li>
</ul>
<h4>静默时段</h4>
<p>配置 <code>quiet_hours</code>（默认 22:00–07:00）后，该时段事件会落库为 <code>deferred</code> 状态，<strong>Celery Beat 每 5 分钟</strong>触发 <code>feishu.flush_deferred</code> 任务到点发送。</p>
<h4>故障排查</h4>
<ul>
<li>「完全收不到」：检查 Celery worker + beat 是否在跑（<code>ps aux | grep celery -A app.celery_app</code>）。</li>
<li>「deferred 一直不发」：Beat 没起来或调度没加载，<code>grep feishu /tmp/lightmes-celery/beat.log</code> 应能看到 <code>feishu-flush-deferred</code> 每 5 分钟。</li>
<li>「open_id 与 App 不匹配」：更换了飞书 App ID 但员工 <code>open_id</code> 没重绑 → 走「按手机号批量匹配」一键恢复。</li>
<li>日志查 <code>/tmp/lightmes-celery/worker.log</code>，失败任务会有 <code>error</code> 字段。</li>
</ul>`
          },
          {
            id: 'ch12-2',
            title: '12.2 钉钉消息推送',
            content: `<h3>钉钉消息推送</h3>
<p>钉钉通道支持两种推送方式：</p>
<ul>
<li><strong>群机器人 Webhook</strong>（推荐）：最简，群里加个机器人即可收消息；支持 ActionCard 卡片（含按钮），无需企业自建应用。</li>
<li><strong>工作通知（企业自建应用）</strong>：需在钉钉开放平台建应用、配置 <code>AgentId</code>，可向指定员工单发；可发卡片含审核按钮（报工审核场景）。</li>
</ul>
<h4>配置入口</h4>
<p>侧边栏 → <strong>系统管理 → 钉钉消息推送</strong>（需 <code>setting.manage</code> 权限）。</p>
<h4>群机器人配置</h4>
<ol>
<li>在钉钉群里「群设置 → 智能群助手 → 添加机器人 → 自定义」获取 <strong>Webhook URL</strong>；如启用「加签」会得到 <strong>Secret</strong>，两者都要填到 LightMes。</li>
<li>LightMes → 钉钉消息推送 → 选群（生产群 / 管理群 / 全厂群）→ 填 webhook + secret → 保存。</li>
<li>点「测试推送」验证。</li>
</ol>
<h4>工作通知配置</h4>
<ol>
<li>钉钉开放平台 → 应用开发 → 创建「企业内部应用」→ 拿到 <code>AppKey</code> / <code>AppSecret</code> / <code>AgentId</code>。</li>
<li>应用权限开通「<strong>机器人发送消息</strong>」「<strong>工作通知</strong>」「<strong>免登</strong>」。</li>
<li>LightMes → 钉钉消息推送 → 顶部填 AppKey / AppSecret / AgentId → 保存。</li>
</ol>
<h4>员工钉钉账号绑定</h4>
<p>工作通知通道依赖 <code>dingtalk_userid</code>，三种方式：</p>
<ul>
<li><strong>OAuth 绑定</strong>：员工在 H5 个人中心 → 「绑定钉钉」走授权。</li>
<li><strong>手机号匹配</strong>：Admin → 钉钉推送 → 「按手机号批量匹配」。</li>
<li><strong>手动</strong>：Admin → 人员绑定 → 输入钉钉 userid。</li>
</ul>
<h4>卡片含审核按钮</h4>
<p>报工提交后推给审核人，钉钉卡片含「初审通过 / 驳回」按钮，点按钮直接审批（不打开网页）。需在钉钉推送页开启 <code>card_actions_enabled</code>，并在「安全设置」配置回调 URL <code>{域名}/api/dingtalk/card_action</code>。</p>
<h4>推送规则与静默时段</h4>
<p>事件码 → 目标 → 通道结构与飞书一致；静默时段配置 <code>quiet_hours</code>，<strong>Beat 每 5 分钟</strong>触发 <code>dingtalk.flush_deferred</code>。</p>
<h4>故障排查</h4>
<ul>
<li>「完全收不到」：Celery worker/beat 未跑；或总开关未启用。</li>
<li>「ActionCard 报错 400002」：ActionCard 字段名错（已修复为 <code>markdown</code>），<code>grep 'dingtalk webhook failed' /tmp/lightmes-celery/worker.log</code> 看实际发出去的 payload。</li>
<li>「工作通知 task_id 返回但收不到」：钉钉「机器人单聊」需在钉钉里主动给应用发一条消息激活。</li>
</ul>`
          },
          {
            id: 'ch12-3',
            title: '12.3 企业微信消息推送',
            content: `<h3>企业微信消息推送</h3>
<p>企微通道以<strong>群机器人 Webhook</strong>为主，把派工、报工审核、工资、预警推到企微群。无需企业自建应用，几分钟就能配好。</p>
<h4>配置入口</h4>
<p>侧边栏 → <strong>系统管理 → 企微消息推送</strong>（需 <code>setting.manage</code> 权限）。</p>
<h4>三步开启</h4>
<ol>
<li>企微群里「群设置 → 群机器人 → 添加」拿到 <strong>Webhook URL</strong>。</li>
<li>LightMes → 企微推送 → 选群（生产群 / 管理群 / 全厂群）→ 填 webhook → 保存。</li>
<li>点「测试推送」验证。</li>
</ol>
<h4>员工企微账号绑定</h4>
<p>企微通道默认只推群。如需推个人，需在「企业微信推送」页配置企业自建应用 <code>CorpID</code> + 应用 <code>AgentId</code> + <code>Secret</code>，并让员工在 H5 完成 OAuth 绑定。详细见 <a href="https://admin.mes.cenkor.cn" target="_blank">docs/飞书消息推送部署指南.md</a>（IM 通道通用部分）。</p>
<h4>故障排查</h4>
<ul>
<li>「完全收不到」：<code>grep wecom /tmp/lightmes-celery/worker.log</code>，看任务是否被消费；<code>wecom.flush_deferred</code> beat 调度是否注册。</li>
<li>「Webhook 返回 40069」：频率超限，企业微信群机器人限制 20 条/分钟。</li>
</ul>`
          },
          {
            id: 'ch12-4',
            title: '12.4 统一消息中心',
            content: `<h3>统一消息中心</h3>
<p>统一管理飞书 / 企微 / 钉钉多通道推送。<strong>三个通道的群组、规则、日志</strong>在一页面对照维护，避免飞书配一遍企微又配一遍。</p>
<h4>配置入口</h4>
<p>侧边栏 → <strong>系统管理 → 统一消息中心</strong>（需 <code>setting.manage</code> 权限）。</p>
<h4>系统指定 3 个群</h4>
<p>无论用哪个 IM 通道，都建议维护这三群：</p>
<ul>
<li><strong>生产群</strong>：车间班组长、生产主管（收派工、报工提醒、异常报警）。</li>
<li><strong>管理群</strong>：厂长 / 经理 / 业务（收订单、工资异常、每天 20:00 工厂日报）。</li>
<li><strong>全厂群</strong>：老板 / 管理层（收 critical 级别预警、工厂日报）。</li>
</ul>
<p>每个群可在三个通道里各设一个 webhook / chat_id，<strong>可同时启用</strong>，消息会同步发到三个通道。</p>
<h4>推送规则</h4>
<p>事件码 → 目标 → 通道。三通道默认规则一致，可独立微调；修改后需分别点保存。</p>
<h4>推送日志</h4>
<p>页面底部表格显示最近 <code>feishu_push_logs</code> / <code>wecom_push_logs</code> / <code>dingtalk_push_logs</code>，含状态（pending / deferred / success / failed）、错误信息、飞书 message_id / 钉钉 task_id。可按状态、目标筛选。</p>
<h4>绑定状态</h4>
<p>页面右侧显示员工 IM 绑定情况：</p>
<ul>
<li><code>feishu_open_id</code> 已绑 / 未绑</li>
<li><code>wecom_userid</code> 已绑 / 未绑</li>
<li><code>dingtalk_userid</code> 已绑 / 未绑</li>
</ul>
<p>未绑员工收不到个人通知，会回退到站内通知（铃铛）。</p>`
          },
          {
            id: 'ch12-5',
            title: '12.5 AI 助手（智能对话）',
            content: `<h3>AI 助手（智能对话）</h3>
<p>LightMes 内置 AI 助手，按角色提供问答与操作建议。需要先在 <code>.env</code> 配置 <code>AI_BASE_URL</code> / <code>AI_API_KEY</code>，并开启 <code>AI_ENABLED=true</code>。详见 <a href="https://admin.mes.cenkor.cn" target="_blank">docs/AI集成说明.md</a>。</p>
<h4>入口</h4>
<p>侧边栏 → <strong>智能中心 → AI 助手</strong>（需 <code>ai.use</code> 权限）。</p>
<h4>典型用法</h4>
<ul>
<li><strong>老板/管理层</strong>：「本月订单达成率」「毛利最高的产品」「昨天异常报警有哪些」「帮我写个催货话术」。</li>
<li><strong>生产主管</strong>：「某订单当前在哪个工序」「这个工序积压了多少待报工任务」「帮我排个 30 号前能交的计划」。</li>
<li><strong>班组长</strong>：「今天的待审报工」「最近一次驳回原因最多的缺陷码是什么」。</li>
<li><strong>员工</strong>：H5 端也能用，「我本月预估工资」「我的任务里最紧急的是哪个」。</li>
</ul>
<h4>上下文（context_id）</h4>
<p>多次对话会自动带上 <code>context_id</code>，AI 能记得前文（如「那上一单呢？」「把这个订单的工价也对比下」）。同一会话最长保留 30 轮，超过会触发摘要压缩。</p>
<h4>智能中心其他模块</h4>
<ul>
<li><strong>首页 AI 数据预警</strong>：Celery 每天 8/12/16/20 点扫描指标，超阈值推飞书/企微/钉钉群。</li>
<li><strong>工厂日报（每日简报）</strong>：每天 20:00 自动生成，汇总当日产值、达成率、不良率、订单进度；推老板 + 管理群 + 全厂群。</li>
<li><strong>排产 AI 建议</strong>：生产计划保存时，<code>aiScheduleSuggest</code> 调用 OR-Tools + AI 给出交期/优先级建议。</li>
<li><strong>AI 交期分析</strong>：对当前计划跑一遍瓶颈分析，提示哪道工序会卡交期。</li>
</ul>`
          },
        ]
      },
      {
        id: 'ch13',
        title: '附录：常见问题与最佳实践',
        icon: 'QuestionFilled',
        children: [
          {
            id: 'ch13-1',
            title: '13.1 常见问题',
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
<p>已确认的订单按原工艺路线执行不受影响。只有新确认的订单才用新工艺路线。建议新旧同时维护一段时间再删除旧的。</p>
<h4>Q7：飞书推送"完全收不到"怎么查？</h4>
<p>三步定位：① <code>ps aux | grep 'celery -A app.celery_app worker'</code> 确认 worker 活着；② <code>grep feishu /tmp/lightmes-celery/worker.log</code> 看任务是否成功；③ 飞书推送页 → 推送日志，按时间查 error_msg 字段。</p>
<h4>Q8：换服务器后旧飞书 open_id 全部失效？</h4>
<p>更换了飞书 App ID 才会失效（飞书 open_id 按应用隔离）。换服务器但 App ID 不变则不受影响。失效时 Admin → 飞书推送 → 「按手机号批量匹配」一键恢复。</p>
<h4>Q9：Celery 任务一直 "pending" 不执行？</h4>
<p>看 Redis db 是否被同机其他项目占用（典型症状：和 bizcloud/dify 撞 db 0）。修改 <code>backend/.env</code> 的 <code>CELERY_BROKER_URL</code> 到独立 db（推荐 db 2），重启 worker。</p>
<h4>Q10：报工审核后没推飞书？</h4>
<p>检查三件事：① 飞书推送总开关是否启用；② 员工 <code>feishu_open_id</code> 是否已绑（未绑会回退到站内通知）；③ 事件码规则里 <code>channels</code> 是否包含 <code>feishu</code>。</p>`
          },
          {
            id: 'ch13-2',
            title: '13.2 最佳实践建议',
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
</ul>
<h4>6. IM 推送运维必做</h4>
<ul>
<li>服务器迁移后必须改 <code>.env</code> 的 Redis db（避免和同机项目撞库）</li>
<li>飞书 / 钉钉 改了 App ID / AgentId 后必须重做员工 open_id 绑定</li>
<li>改完代码 / 上线新功能后必须重启 Celery（Beat 不会热加载调度表）</li>
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
</table>
<h4>Q7：怎么绑定飞书 / 钉钉 / 企微 收个人通知？</h4>
<ol>
<li>「我的」→「账号设置」→ 找到「飞书 / 钉钉 / 企微绑定」</li>
<li>点「去绑定」会跳到对应 IM 授权页（需安装对应 App）</li>
<li>授权后回跳 LightMes，自动存 <code>open_id</code> / <code>dingtalk_userid</code> / <code>wecom_userid</code></li>
<li>绑定后派工、报工审核、工资条会推送到对应 IM</li>
</ol>
<p><strong>注意</strong>：未绑定也能用站内通知（铃铛），但 IM 推送需要绑定才能收个人消息。</p>
<h4>Q8：收不到派工/工资推送通知？</h4>
<ul>
<li>先确认已绑定 IM（见 Q7）</li>
<li>检查手机 IM App 通知权限是否被关闭</li>
<li>在「我的 → 通知设置」里检查是否被静默</li>
<li>静默时段（默认 22:00–07:00）内的消息会延迟到点发送</li>
</ul>`
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
  {
    id: 'part4',
    title: '第四篇：微信小程序管理端使用指南',
    icon: 'Cellphone',
    children: [
      {
        id: 'wx-ch1',
        title: '第一章 小程序管理端简介',
        icon: 'Cellphone',
        children: [
          {
            id: 'wx-1-1',
            title: '1.1 什么是管理端小程序',
            content: `<h3>微信小程序管理端</h3>
<p>LightMes 提供一个<strong>微信小程序版"轻量管理端"</strong>，面向厂长 / 班组长 / 财务 / 业务，适合<strong>出差、外勤、车间走动</strong>等不方便打开 PC 的场景。功能定位：<strong>PC 端的手机伴侣</strong>，不是替代。</p>
<h4>入口</h4>
<p>微信 → 搜索「LightMes」小程序（或扫码「管理端」入口）→ 选择「<strong>管理端</strong>」模式登录。</p>
<h4>登录方式</h4>
<ul>
<li>手机号 + 验证码（默认）</li>
<li>账号密码（PC 创建账号后可用）</li>
</ul>
<h4>适用角色</h4>
<table>
<tr><th>角色</th><th>核心场景</th></tr>
<tr><td>老板 / 厂长</td><td>查实时看板、看工厂日报、审重要单据</td></tr>
<tr><td>班组长</td><td>现场审核报工、扫码分配、查本组任务</td></tr>
<tr><td>财务</td><td>查工资 / 对账、确认工资条</td></tr>
<tr><td>业务</td><td>客户管理、订单跟进、外勤报价</td></tr>
</table>
<h4>与 PC 管理端的区别</h4>
<ul>
<li>✅ 手机端能做的：审核、查询、扫码、轻度配置</li>
<li>❌ 手机端<strong>不能</strong>做的：批量导入、复杂报表导出、初始化配置、生产计划全流程编排</li>
<li>数据：与 PC 端实时同步（同一后端）</li>
</ul>`
          },
          {
            id: 'wx-1-2',
            title: '1.2 角色与权限',
            content: `<h3>角色与权限</h3>
<p>管理端小程序登录后，<strong>角色权限与 PC 端完全一致</strong>。例如：</p>
<ul>
<li>没有 <code>order.manage</code> 权限，看不到订单管理入口</li>
<li>只有 <code>report.audit</code> 权限，能进入审核页但不能改产品/工价</li>
</ul>
<p>权限按租户隔离，员工只能看到自己租户下的数据。</p>
<h4>切换角色（一人多租户时）</h4>
<p>「我的」→ 「切换租户 / 角色」→ 选目标租户。小程序会刷新权限与菜单。</p>`
          },
        ]
      },
      {
        id: 'wx-ch2',
        title: '第二章 首页与看板',
        icon: 'DataLine',
        children: [
          {
            id: 'wx-2-1',
            title: '2.1 首页（管理端仪表盘）',
            content: `<h3>首页</h3>
<p>登录后默认进入首页，展示：</p>
<ul>
<li>今日关键指标：产值、订单达成率、不良率</li>
<li>待办事项：待审报工、待确认工资、待处理预警</li>
<li>实时生产趋势：折线图展示当日各小时产量</li>
<li>快捷入口：根据角色推荐（审核 / 看板 / 工厂助手）</li>
</ul>`
          },
          {
            id: 'wx-2-2',
            title: '2.2 看板 / 车间大屏',
            content: `<h3>看板 / 车间大屏</h3>
<p><strong>路径</strong>：底部 tab「首页」→ 「看板」/「车间大屏」</p>
<p>与 PC 端相同：实时显示各产线进度、异常报警、交期倒计时。车间大屏建议投到 TV，做横屏自适应。</p>`
          },
        ]
      },
      {
        id: 'wx-ch3',
        title: '第三章 报工审核',
        icon: 'Document',
        children: [
          {
            id: 'wx-3-1',
            title: '3.1 批量审核',
            content: `<h3>批量审核（小程序特色）</h3>
<p><strong>路径</strong>：底部「管理」tab → 报工审核 → 批量</p>
<p>班组长在现场用手机审核最频繁，<strong>小程序为审核做了大量优化</strong>：</p>
<ul>
<li>按工序 / 班组 / 员工筛选待审</li>
<li>支持<strong>滑动审批</strong>（左滑通过 / 右滑驳回）</li>
<li>支持<strong>扫码</strong>调出报工详情（扫任务二维码定位到具体报工）</li>
<li>一次最多 20 条批量过 / 批量驳</li>
</ul>
<h4>审核要点</h4>
<ol>
<li>看员工上传的照片/视频（小程序能直接预览原图与视频）</li>
<li>核对数量（合格数 / 不良数）</li>
<li>通过 → 进入 QC 终审；驳回 → 填原因</li>
</ol>`
          },
          {
            id: 'wx-3-2',
            title: '3.2 单位审核（QC 终审）',
            content: `<h3>单位审核（QC 终审）</h3>
<p><strong>路径</strong>：底部「管理」tab → 报工单位</p>
<p>QC 终审岗用，<strong>支持按质检模板逐项打勾</strong>（详见 PC 端 6.3 节）：</p>
<ul>
<li>选择不合格项 → 必填缺陷代码 + 备注</li>
<li>测量型项目填入实测值，系统自动判定 pass/fail</li>
</ul>`
          },
          {
            id: 'wx-3-3',
            title: '3.3 审核详情',
            content: `<h3>审核详情</h3>
<p><strong>路径</strong>：报工列表 → 点某条报工</p>
<p>展示：员工 / 工序 / 数量 / 报工时间 / 照片视频 / 历史审核记录 / 关联工单 / 关联订单。</p>
<p>驳回时可选择驳回原因模板（从字典里选）或填自定义原因。</p>`
          },
        ]
      },
      {
        id: 'wx-ch4',
        title: '第四章 主数据管理',
        icon: 'Box',
        children: [
          {
            id: 'wx-4-1',
            title: '4.1 产品 / 型号 / 工序 / 工艺路线',
            content: `<h3>产品 / 型号 / 工序 / 工艺路线</h3>
<p><strong>路径</strong>：底部「管理」tab → 主数据</p>
<p>小程序支持<strong>浏览 + 轻量编辑</strong>，适合：</p>
<ul>
<li>外勤报价时翻产品库、看价格、复制产品编码给客户</li>
<li>车间现场查询某产品用的什么工艺路线、每道工序工价</li>
</ul>
<p><strong>不能</strong>在小程序做的：批量导入、复杂公式配置、删除（避免误操作）。这些需回 PC。</p>`
          },
          {
            id: 'wx-4-2',
            title: '4.2 物料 / BOM / 供应商',
            content: `<h3>物料 / BOM / 供应商</h3>
<p><strong>路径</strong>：主数据 → 物料 / BOM / 供应商</p>
<p>查询用得最多，看库存、看供应商联系方式、看某产品的 BOM 结构。</p>`
          },
          {
            id: 'wx-4-3',
            title: '4.3 批量设置型号工价',
            content: `<h3>批量设置型号工价</h3>
<p><strong>路径</strong>：主数据 → 型号 → 批量工价</p>
<p>车间调整工价时，老板/厂长在手机上<strong>勾选多个型号 + 多个工序</strong>，一键设工价。比 PC 操作快很多。</p>`
          },
        ]
      },
      {
        id: 'wx-ch5',
        title: '第五章 订单与工单',
        icon: 'List',
        children: [
          {
            id: 'wx-5-1',
            title: '5.1 订单管理',
            content: `<h3>订单管理</h3>
<p><strong>路径</strong>：底部「管理」tab → 订单</p>
<p>支持：浏览、筛选、改状态（确认 / 作废）、看订单详情、查客户联系方式。</p>
<p><strong>不能</strong>在小程序做：新建订单、编辑订单明细（需 PC）。</p>`
          },
          {
            id: 'wx-5-2',
            title: '5.2 工单 / 任务',
            content: `<h3>工单 / 任务</h3>
<p><strong>路径</strong>：底部「管理」tab → 工单 / 任务</p>
<p>小程序特色功能：</p>
<ul>
<li><strong>任务二维码</strong>：点单条任务 → 「生成任务码」→ 把图片保存到相册 → 打印贴工位，员工扫码报工</li>
<li><strong>扫码分配</strong>：扫员工码 + 扫任务码 → 一键派工</li>
<li><strong>任务跟踪</strong>：看每个任务当前进度（待报工 / 报工中 / 已完成）</li>
</ul>`
          },
          {
            id: 'wx-5-3',
            title: '5.3 客户管理',
            content: `<h3>客户管理</h3>
<p><strong>路径</strong>：底部「管理」tab → 客户</p>
<p>查客户档案、跟进记录、订单历史、联系人。客户详情页可直接拨打电话或加微信。</p>`
          },
        ]
      },
      {
        id: 'wx-ch6',
        title: '第六章 生产与计划',
        icon: 'Calendar',
        children: [
          {
            id: 'wx-6-1',
            title: '6.1 生产计划',
            content: `<h3>生产计划</h3>
<p><strong>路径</strong>：底部「管理」tab → 计划</p>
<p>小程序支持：浏览计划、看每条计划的甘特图（简化版）、改计划状态、<strong>AI 排产建议</strong>查看。</p>
<p><strong>不能</strong>在小程序做：新建复杂计划、甘特图拖拽、APS 高级选项（需 PC）。</p>`
          },
          {
            id: 'wx-6-2',
            title: '6.2 产能设置',
            content: `<h3>产能设置</h3>
<p><strong>路径</strong>：计划 → 产能</p>
<p>配置每道工序的<strong>标准工时</strong>、<strong>每日产能上限</strong>，APS 排产会用到。适合车间主任现场调整。</p>`
          },
          {
            id: 'wx-6-3',
            title: '6.3 自动化设置',
            content: `<h3>自动化设置</h3>
<p><strong>路径</strong>：底部「管理」tab → 系统 → 自动化</p>
<p>配置自动化规则：</p>
<ul>
<li>订单确认后自动派工</li>
<li>报工审核后自动推送飞书 / 钉钉</li>
<li>异常自动报警</li>
</ul>`
          },
        ]
      },
      {
        id: 'wx-ch7',
        title: '第七章 采购与仓库',
        icon: 'Goods',
        children: [
          {
            id: 'wx-7-1',
            title: '7.1 采购单 / 对账单',
            content: `<h3>采购单 / 对账单</h3>
<p><strong>路径</strong>：底部「管理」tab → 采购</p>
<p>查采购单进度（待发货 / 在途 / 已入库）、对账单确认、查供应商联系方式。</p>
<p>采购对账单的<strong>确认 / 标记已付</strong>操作可在小程序完成。</p>`
          },
          {
            id: 'wx-7-2',
            title: '7.2 仓库 / 库存',
            content: `<h3>仓库 / 库存</h3>
<p><strong>路径</strong>：底部「管理」tab → 仓库</p>
<p>查实时库存、看安全库存预警、查入库出库流水。</p>`
          },
        ]
      },
      {
        id: 'wx-ch8',
        title: '第八章 财务与工资',
        icon: 'Wallet',
        children: [
          {
            id: 'wx-8-1',
            title: '8.1 工资管理',
            content: `<h3>工资管理</h3>
<p><strong>路径</strong>：底部「管理」tab → 工资</p>
<p>支持：浏览月工资、点员工看明细、加补贴 / 扣款、确认工资、导出 Excel。</p>`
          },
          {
            id: 'wx-8-2',
            title: '8.2 工资条',
            content: `<h3>工资条</h3>
<p><strong>路径</strong>：工资 → 工资条</p>
<p>生成员工的电子工资条、查看签名进度、催签。</p>`
          },
          {
            id: 'wx-8-3',
            title: '8.3 利润分析 / 收支流水',
            content: `<h3>利润分析 / 收支流水</h3>
<p><strong>路径</strong>：底部「管理」tab → 财务</p>
<p>看月度利润、客户毛利、订单毛利。收支流水可查每笔进账出账。</p>`
          },
          {
            id: 'wx-8-4',
            title: '8.4 对账单',
            content: `<h3>对账单</h3>
<p><strong>路径</strong>：财务 → 对账单</p>
<p>客户对账单的生成、确认、催收、标记已收。</p>`
          },
        ]
      },
      {
        id: 'wx-ch9',
        title: '第九章 CRM',
        icon: 'UserFilled',
        children: [
          {
            id: 'wx-9-1',
            title: '9.1 销售机会',
            content: `<h3>销售机会</h3>
<p><strong>路径</strong>：底部「管理」tab → CRM → 销售机会</p>
<p>业务外勤时最常用：客户拜访后实时录入机会、改阶段、记跟进。</p>
<p>公海池自动回收：超期未跟进的机会自动回收到公海，业务可重新认领。</p>`
          },
          {
            id: 'wx-9-2',
            title: '9.2 客户标签 / 机会统计',
            content: `<h3>客户标签 / 机会统计</h3>
<p>客户标签用于分类（如 VIP、长期、一次性）。机会统计看转化率、阶段分布、外勤业绩。</p>`
          },
        ]
      },
      {
        id: 'wx-ch10',
        title: '第十章 设备与报表',
        icon: 'Tools',
        children: [
          {
            id: 'wx-10-1',
            title: '10.1 设备管理',
            content: `<h3>设备管理</h3>
<p><strong>路径</strong>：底部「管理」tab → 设备</p>
<p>查设备档案、看保养计划、登记保养记录、报修。</p>
<p><strong>日常点检</strong>：设备管理员现场扫码点检，避免漏检。</p>`
          },
          {
            id: 'wx-10-2',
            title: '10.2 报表',
            content: `<h3>报表</h3>
<p><strong>路径</strong>：底部「管理」tab → 报表</p>
<p>小程序支持<strong>图表速览</strong>（生产报表、采购统计、缺陷分析、利润分析），不提供 Excel 导出（需 PC）。</p>
<p>老板最常用：手机打开看本月关键指标。</p>`
          },
        ]
      },
      {
        id: 'wx-ch11',
        title: '第十一章 系统与设置',
        icon: 'Setting',
        children: [
          {
            id: 'wx-11-1',
            title: '11.1 系统设置',
            content: `<h3>系统设置</h3>
<p><strong>路径</strong>：底部「管理」tab → 系统</p>
<p>可做：</p>
<ul>
<li>查看租户信息、套餐</li>
<li>用户/角色/部门<strong>查询</strong>（增删改回 PC）</li>
<li>字典查看、打印模板查看</li>
<li>操作日志查询</li>
</ul>`
          },
          {
            id: 'wx-11-2',
            title: '11.2 考勤',
            content: `<h3>考勤</h3>
<p><strong>路径</strong>：系统 → 考勤</p>
<p>查看员工打卡记录、补卡、导出月度考勤表。员工自己打卡用「员工端」小程序（不同模式）。</p>`
          },
          {
            id: 'wx-11-3',
            title: '11.3 IM 推送配置',
            content: `<h3>IM 推送配置（小程序仅查看）</h3>
<p>飞书 / 钉钉 / 企微的 AppID、AppSecret 等敏感配置<strong>不能在小程序修改</strong>，必须回 PC 管理端（系统管理 → 飞书消息推送 / 钉钉消息推送 / 企微消息推送）。</p>
<p>小程序可查看：当前启用了哪些群、推送规则、推送日志。</p>`
          },
          {
            id: 'wx-11-4',
            title: '11.4 通知中心',
            content: `<h3>通知中心</h3>
<p><strong>路径</strong>：底部「我的」→ 通知</p>
<p>站内通知（铃铛）汇总，按事件码分类。已读 / 未读 / 一键全读。</p>`
          },
        ]
      },
      {
        id: 'wx-ch12',
        title: '第十二章 工厂助手 / AI 中心',
        icon: 'MagicStick',
        children: [
          {
            id: 'wx-12-1',
            title: '12.1 工厂助手（AI 对话）',
            content: `<h3>工厂助手（AI 对话）</h3>
<p><strong>路径</strong>：底部「管理」tab → AI → 工厂助手</p>
<p>小程序 AI 助手与 PC 完全同步：</p>
<ul>
<li>支持多轮对话 + <code>context_id</code> 上下文</li>
<li>问「今天产量 / 本月毛利 / 哪个工序卡交期 / 帮我写个催货话术」</li>
<li>语音输入：长按麦克风按钮直接说话</li>
</ul>`
          },
          {
            id: 'wx-12-2',
            title: '12.2 AI 深度分析 / 统计',
            content: `<h3>AI 深度分析 / 统计</h3>
<p><strong>深度分析</strong>：因果分析，帮你定位「为什么本月不良率上升」。</p>
<p><strong>AI 统计</strong>：AI 调用量、按场景拆解（问得最多的是什么）、调用成功率。</p>`
          },
        ]
      },
      {
        id: 'wx-ch13',
        title: '第十三章 小程序常见问题',
        icon: 'QuestionFilled',
        children: [
          {
            id: 'wx-13-1',
            title: '13.1 登录与权限',
            content: `<h3>登录与权限</h3>
<h4>Q1：登录后看不到某些菜单？</h4>
<p>权限问题。让 PC 端超级管理员在「系统管理 → 角色」里给该员工加对应权限码（如 <code>order.manage</code>、<code>report.audit</code>）。</p>
<h4>Q2：登录后显示「无租户」？</h4>
<p>该手机号没绑定到任何租户。让管理员在「用户管理」里给该员工绑定手机号。</p>
<h4>Q3：登录态过期？</h4>
<p>默认 token 8 小时有效。超期会自动跳登录页，重新验证码登录即可。</p>`
          },
          {
            id: 'wx-13-2',
            title: '13.2 数据同步',
            content: `<h3>数据同步</h3>
<h4>Q1：手机上看到的订单状态和 PC 不一致？</h4>
<p>下拉刷新页面。LightMes 没有走实时推送，每页进入时拉取最新。</p>
<h4>Q2：上传照片失败？</h4>
<ul>
<li>检查微信是否授权「使用相册」</li>
<li>单张最大 100MB（可在 PC 端 .env 调 <code>FILE_MAX_UPLOAD_SIZE</code>）</li>
<li>网络问题：切换 WiFi / 数据流量重试</li>
</ul>`
          },
          {
            id: 'wx-13-3',
            title: '13.3 拍照与扫码',
            content: `<h3>拍照与扫码</h3>
<h4>Q1：报工拍照模糊？</h4>
<p>小程序拍照调用微信原生相机，点击对焦后等 1 秒再按快门。避免逆光。</p>
<h4>Q2：扫码扫不出来？</h4>
<ul>
<li>二维码太小：手机距离 15~30cm</li>
<li>模糊：对焦后再扫</li>
<li>屏幕太暗：调亮屏幕</li>
<li>仍扫不出：用手输任务码兜底</li>
</ul>`
          },
          {
            id: 'wx-13-4',
            title: '13.4 与 PC 端数据对应',
            content: `<h3>与 PC 端数据对应</h3>
<p>小程序管理端、PC 管理端、H5 端 三者共享同一后端，<strong>数据完全一致</strong>。差异只在交互方式：</p>
<table>
<tr><th>场景</th><th>推荐</th></tr>
<tr><td>车间走动审核</td><td>小程序</td></tr>
<tr><td>复杂报表导出</td><td>PC</td></tr>
<tr><td>外勤报价 / 客户管理</td><td>小程序</td></tr>
<tr><td>初始化配置 / 批量导入</td><td>PC</td></tr>
<tr><td>客户下单</td><td>客户端 H5 / 小程序</td></tr>
<tr><td>员工报工 / 查工资</td><td>员工端 H5 / 小程序</td></tr>
</table>`
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
