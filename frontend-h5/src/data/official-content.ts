export const coreFeatures = [
  {
    icon: 'shopping-cart',
    color: 'blue',
    title: '客户自助下单',
    desc: '手机浏览产品型号，选数量交期，订单进度全程可查。',
  },
  {
    icon: 'scan',
    color: 'green',
    title: '扫码报工',
    desc: '每道工序独立任务码，扫码录入合格/不良，可附照片视频。',
  },
  {
    icon: 'wallet',
    color: 'orange',
    title: '自动计件算薪',
    desc: '型号 × 工序工价，审核通过即计入工资，月底一键汇总。',
  },
  {
    icon: 'shield-check',
    color: 'slate',
    title: '质量溯源',
    desc: '一物一码反查物料批次、操作人、加工时间与质检记录。',
  },
  {
    icon: 'calendar',
    color: 'cyan',
    title: '排产派工',
    desc: '甘特拖拽排产，智能派工到人，任务码一键打印推送。',
  },
  {
    icon: 'check-circle',
    color: 'indigo',
    title: '报工审核',
    desc: '班组长初审 + 质检终审，驳回附原因，照片视频在线查看。',
  },
  {
    icon: 'monitor',
    color: 'emerald',
    title: '进度看板',
    desc: '订单全生命周期追踪，车间大屏实时滚动，异常高亮预警。',
  },
  {
    icon: 'file-text',
    color: 'rose',
    title: '电子工资条',
    desc: '员工手机查看工资明细，支持电子签名确认与异议反馈。',
  },
] as const

export const workflowSteps = [
  {
    step: 1,
    title: '接单确认',
    tag: '客户 / 管理员',
    desc: '客户 H5 自助下单，或后台手工建单；确认后自动分解生产工单。',
    screen: 'home' as const,
  },
  {
    step: 2,
    title: '排产派工',
    tag: '计划员',
    desc: '按交期排产，生成任务二维码，推送到员工手机任务列表。',
    screen: 'tasks' as const,
  },
  {
    step: 3,
    title: '扫码报工',
    tag: '一线员工',
    desc: '扫描任务码报工，上传完工证据，提交后即时显示预估工资。',
    screen: 'report' as const,
  },
  {
    step: 4,
    title: '审核算薪',
    tag: '班组长 / 质检',
    desc: '多级审核通过后自动算薪，支持电子工资条与签名确认。',
    screen: 'home' as const,
  },
]

export const featureModules = [
  {
    group: '生产管理',
    accent: '#2563eb',
    items: [
      { title: '产品基础库', desc: '编码、分类、默认工艺路线' },
      { title: '产品型号 SKU', desc: '颜色材料规格、多角度图、Excel 导入' },
      { title: '工序与工价', desc: '型号 × 工序计件单价，变更可追溯' },
      { title: '订单与计划', desc: '全渠道订单、甘特排产、齐套检查' },
      { title: '分工派工', desc: '智能派工、任务码、手机推送' },
      { title: '报工审核', desc: '扫码/页面报工，多级审核与驳回' },
      { title: '进度看板', desc: '车间大屏、订单全生命周期追踪' },
      { title: '溯源查询', desc: '成品码反查物料、人员与时间' },
      { title: '模具管理', desc: '模具档案、保养计划、工序绑定' },
      { title: '质检模板', desc: '自定义质检项目、合格/测量/文本' },
      { title: '缺陷代码', desc: '缺陷分类与严重程度管理' },
      { title: '审批流程', desc: '自定义审核步骤与审核人角色' },
      { title: '排班管理', desc: '班次规则、员工排班日历' },
      { title: '外协管理', desc: '外协订单、外协报工与对账' },
      { title: 'SPC 质量图表', desc: '工序能力分析、Xbar-R 控制图' },
    ],
  },
  {
    group: '移动与协同',
    accent: '#f97316',
    items: [
      { title: '员工端 H5', desc: '报工、任务、工资、电子工资条' },
      { title: '客户端 H5', desc: '浏览下单、查进度、下载对账单' },
      { title: '微信小程序', desc: '员工/客户双端，扫码报工与下单' },
      { title: '智能中心', desc: '工厂助手、数据预警、操作指引' },
      { title: 'AI 照片计数', desc: '上传照片自动识别产品数量，免手动输入' },
      { title: 'AI 缺陷分类', desc: '照片上传后 AI 自动识别缺陷类型' },
      { title: '语音报工', desc: '语音输入产量数据，系统语音播报确认' },
      { title: 'AI 员工中心', desc: 'AI 虚拟员工辅助管理生产任务' },
    ],
  },
  {
    group: '经营支撑',
    accent: '#64748b',
    items: [
      { title: '工资管理', desc: '计件自动汇总、补贴扣款、Excel 导出' },
      { title: '时薪管理', desc: '按时计薪、加班倍率、工时统计' },
      { title: 'CRM 客户', desc: '档案、销售机会、公海与跟进' },
      { title: '人事设备', desc: '组织架构、考勤、设备点检与保养计划' },
      { title: '出货管理', desc: '出库单、发货跟踪、签收确认' },
      { title: '数据报表', desc: '产量良率、销售趋势、客户贡献' },
    ],
  },
]

export const userRoles = [
  {
    role: '老板 / 厂长',
    title: '掌握全厂动态',
    points: ['今日产值与订单达成', '车间大屏与异常预警', '经营报表与客户分析'],
    color: '#0891b2',
  },
  {
    role: '班组长 / 质检',
    title: '管好质量与审核',
    points: ['报工初审与终审', '查看照片/视频证据', '驳回原因与重报追溯'],
    color: '#6366f1',
  },
  {
    role: '一线员工',
    title: '扫码就能干活',
    points: ['手机接收派工任务', '扫码/主动报工', '实时预估工资'],
    color: '#f97316',
  },
  {
    role: '客户',
    title: '下单跟进度',
    points: ['浏览型号自助下单', '订单进度透明可查', '对账单下载确认'],
    color: '#10b981',
  },
]

export const highlights = [
  { label: '轻量化部署', desc: '无需 Docker，Windows/Linux 均可' },
  { label: '快速交付', desc: '聚焦加工厂高频核心场景' },
  { label: '移动优先', desc: '报工算薪在手机上完成' },
]
