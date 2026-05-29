﻿import type { IncidentReport } from './archives'

export const INCIDENT_REPORTS: IncidentReport[] = [
  {
    id: 'EVT-P0990-INC',
    code: 'EVT-P0990-INC',
    title: '第73区大规模慢性失眠集群事件报告',
    status: '活跃',
    threatLevel: '琥珀色-C',
    threatLevelColor: '琥珀色',
    archiveDate: '[数据删除]',
    sourceDepartment: '瞭望塔监控网络 / 第73区事件响应小组',
    accessLevel: '3级',
    responsibleDepartment: '瞭望塔监控网络 / 第73区事件响应小组',
    leadPerson: '第73区事件响应小组',
    lastUpdate: '[数据删除]',
    description:
      '本报告详细记录了由永夜钟楼(TMS-V0990)模因性渗透引发的大规模公共卫生事件。内容包括事件时间线、响应措施、当前状态及初步勘探数据。该事件揭示了此类认知危害通过剥夺基本生理需求进行扩散的独特模式，需持续监控与跨部门协作应对。',
    mainDangers: ['模因感染', '意识剥夺', '存在性危害'],
    relatedArchives: [
      {
        code: 'EXP-P0990',
        type: '勘探实验记录',
        title: '"夜莺"无人机勘探数据摘要',
        relation: '关联勘探数据',
      },
      {
        code: 'MED-P0990',
        type: '医疗报告',
        title: 'P-990-INC模因感染现象心理危害评估报告',
        relation: '关联医疗评估',
      },
    ],
    signatures: [
      {
        position: '事件响应小组负责人',
        name: '第73区事件响应小组',
        signature: '[ESIG-73]',
        date: '[数据删除]',
        note: '事件报告撰写人',
      },
      {
        position: '首席档案员',
        name: '安雅·夏尔马',
        signature: '[ESIG-AS]',
        date: '[数据删除]',
        note: '审阅批准',
      },
    ],
    finalReview: '审阅批准',
    reviewStatus: '已审阅',
    image: '',
    remarks:
      '建议持续监控第73区睡眠质量指标，并加强对TMS-V0990的长期观察研究。',
    category: '事件报告',
    incidentNature: '第73区发生大规模、指数级增长的慢性失眠症集群病例',
    symptomCharacteristics: '症状高度一致，且对常规治疗无效',
    confirmedCause: '永夜钟楼(TMS-V0990)的模因性渗透事件',
    transmissionMechanism:
      '通过感知认知渠道传播，持续掠夺受影响区域的"睡眠可能性"',
    threatAssessment: '对公众健康及现实稳定性构成严重威胁',
    events: [
      {
        time: 'T-6个月',
        description:
          '监控网络检测到73区背景"认知静默率"异常下降0.1%',
        threatLevel: '白色异常',
        response: '启动低优先级监控',
      },
      {
        time: 'T-4个月',
        description: '首次接收到民间医疗系统关于不明原因失眠的报告',
        threatLevel: '白色异常',
        response: '持续监控',
      },
      {
        time: 'T-2个月',
        description:
          '病例数呈指数增长。多名患者描述看到"不存在的钟楼"并听到钟声',
        threatLevel: '黄色',
        response: '威胁等级提升',
      },
      {
        time: 'T-1个月',
        description:
          '边际结构医疗与心理部介入，戴维·卡特博士团队确认模因感染模式',
        threatLevel: '琥珀色',
        response: '事件等级提升，全面响应',
      },
      {
        time: 'T-现在',
        description: '持续响应与管控中',
        threatLevel: '琥珀色-C',
        response: '多部门协作应对',
      },
    ],
    responseMeasures: [
      {
        department: '联络与掩盖部门',
        measureType: '信息管控',
        action:
          '启动"白噪音协议"。在所有受影响区域实施媒体管制，播撒反模因信息，强化"睡眠是安全和自然"的认知',
        status: '进行中',
      },
      {
        department: '后勤与架构部',
        measureType: '感知阻断',
        action:
          '向高风险区域居民配发型号为"BP-7"的屏蔽睡眠眼罩和"WN-4"白噪音发生器',
        status: '进行中',
      },
      {
        department: '医疗与心理部',
        measureType: '医疗干预',
        action:
          '建立专门隔离医疗设施"摇篮"。所有感染者按阶段进行分级隔离和治疗。三期患者（"结晶化"）转入永久性封闭监护',
        status: '进行中',
      },
      {
        department: '档案与研究部',
        measureType: '威胁评估',
        action:
          '通过远程无人机（代号：夜莺）对连接点进行勘探，确认V-990-INC内部环境特性',
        status: '已完成',
      },
      {
        department: '架构师/锁匠',
        measureType: '连接点管理',
        action:
          '对已识别的感知连接点（患者███的公寓窗口）施加认知屏蔽封印，降级其活性。持续监控区域渗透水平',
        status: '进行中',
      },
    ],
    currentStatus: [
      {
        indicator: '事件控制',
        assessment: '处于持续监控和管控下',
      },
      {
        indicator: '睡眠时长趋势',
        assessment: '区域平均睡眠时长下降趋势已减缓，但未停止',
      },
      {
        indicator: '渗透性质',
        assessment:
          'TMS-V0990的渗透表现为一种低强度、持续性的存在性危害',
      },
      {
        indicator: '解决方案',
        assessment: '彻底解决方案仍在研究中',
      },
    ],
    appendices: [
      {
        code: 'EVT-P0990-INC-Appendix.1',
        title: '患者访谈记录摘选（三期患者）',
        description: '详细记录三期患者的访谈内容和症状表现',
      },
      {
        code: 'EVT-P0990-INC-Appendix.2',
        title: '"夜莺"无人机勘探数据摘要',
        description: '远程勘探V-990-INC内部环境的详细数据',
      },
      {
        code: 'MED-P0990',
        title: '关于V-990-INC ("永夜钟楼") 模因感染现象的心理危害评估报告',
        description: '医疗与心理部的专业评估报告',
      },
    ],
  },
]
