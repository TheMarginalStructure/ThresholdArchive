﻿import type { ExperimentLog } from './archives'

export const EXPERIMENT_LOGS: ExperimentLog[] = [
  {
    id: 'EXP-O0442-V2',
    code: 'EXP-O0442-V2',
    title: '阈界物品共鸣水晶(TMS-O0442-01) 实验记录',
    status: '活跃',
    threatLevel: '黄色-CP',
    threatLevelColor: '黄色',
    archiveDate: '[数据删除]',
    sourceDepartment: '档案与研究部 (DRA) - 实验室团队',
    accessLevel: '3级',
    responsibleDepartment: '档案与研究部 (DRA) - 实验室团队',
    leadPerson: '林博士',
    lastUpdate: '[数据删除]',
    description:
      '本实验记录详细记载了阈界物品共鸣水晶(TMS-O0442-01)的受控环境测试过程，包括基础物理特性测试、认知共鸣效应测试和现实扭曲现象测试。该物品由勘探队"Beta"从回音殿堂(TMS-O0442)中回收，是一块约15cm高的半透明晶体，呈现不规则的八面体结构，表面散发微弱的蓝紫色光芒，能够与接触者的情绪状态产生共鸣，在特定条件下可引发局部现实扭曲。',
    mainDangers: ['认知共鸣效应', '现实扭曲现象', '精神污染风险'],
    relatedArchives: [
      {
        code: 'TMS-O0442-01',
        type: '阈界档案',
        title: '共鸣水晶阈界档案',
        relation: '主要研究对象',
      },
      {
        code: 'EXP-O0442',
        type: '勘探实验记录',
        title: '勘探队"Beta"发现记录',
        relation: '物品来源',
      },
      {
        code: 'MED-O0442',
        type: '医疗报告',
        title: '实验团队心理评估报告',
        relation: '人员安全评估',
      },
      {
        code: 'PRT-0003',
        type: '协议手册',
        title: '实验室安全操作规程',
        relation: '安全协议参考',
      },
    ],
    signatures: [
      {
        position: '主实验员',
        name: '林知远博士',
        signature: '[ESIG-LZ]',
        date: '[数据删除]',
        note: '实验执行负责人',
      },
      {
        position: '部门主管',
        name: '陈维华博士',
        signature: '[ESIG-CW]',
        date: '[数据删除]',
        note: '实验批准与监督',
      },
      {
        position: '安全审查',
        name: '维克多·科瓦列夫/铁墙',
        signature: '[ESIG-VK]',
        date: '[数据删除]',
        note: '安全协议确认',
      },
      {
        position: '档案员',
        name: '安雅·夏尔马',
        signature: '[ESIG-AS]',
        date: '[数据删除]',
        note: '档案归档确认',
      },
    ],
    finalReview: '陈维华博士',
    reviewStatus: '通过',
    image: '/assets/TMS-O0442.png',
    remarks:
      '实验数据完整，建议定期复查安全协议的有效性。共鸣水晶实验成功评估了O-442-RES的基本特性和潜在风险，确认其具有可控的认知共鸣和现实扭曲能力。',
    category: '实验记录',
    experimentDate: '[数据删除]',
    leadDepartment: '档案与研究部 (DRA) - 实验室团队',
    experimentLead: '林博士',
    dataSource: '实验室团队直接观测数据',
    contentScope: '物品特性测试、认知影响评估、安全协议验证',
    experimentPurpose: '评估O-442-RES的实用性与潜在危险',
    experimentType: '受控环境测试',
    safetyLevel: '3级隔离实验室',
    objectives: [
      {
        code: 'T-1',
        objective: '测定TMS-O0442-01的基础物理特性',
        expectedResult: '获得准确的物理参数数据',
      },
      {
        code: 'T-2',
        objective: '评估认知共鸣效应的触发条件',
        expectedResult: '确定安全接触协议',
      },
      {
        code: 'T-3',
        objective: '验证现实扭曲现象的范围与强度',
        expectedResult: '建立有效的隔离措施',
      },
      {
        code: 'T-4',
        objective: '勘探潜在的实用价值',
        expectedResult: '评估是否可用于组织任务',
      },
    ],
    objectDescription:
      '共鸣水晶(TMS-O0442-01)是一块约15cm高的半透明晶体，呈现不规则的八面体结构。表面散发微弱的蓝紫色光芒，触摸时会产生轻微的振动感。该物品由勘探队"Beta"从回音殿堂(TMS-O0442)中回收。',
    knownCharacteristics: [
      '能够与接触者的情绪状态产生共鸣',
      '在特定条件下可引发局部现实扭曲',
      '对电磁场具有异常敏感性',
    ],
    environment: [
      {
        parameter: '实验室',
        specification: '3级隔离实验室 (Lab-C3)',
      },
      {
        parameter: '防护措施',
        specification: '电磁屏蔽、认知过滤器、现实锚定装置',
      },
      {
        parameter: '监控设备',
        specification: '全频谱摄像、脑电图监测、现实稳定性检测器',
      },
      {
        parameter: '安全协议',
        specification: '2人操作制、紧急撤离程序、心理支援待命',
      },
    ],
    team: [
      {
        role: '主实验员',
        name: '林博士',
        field: '异常物理学',
        clearance: '3级',
      },
      {
        role: '助理研究员',
        name: '张研究员',
        field: '认知心理学',
        clearance: '3级',
      },
      {
        role: '安全监督员',
        name: '王特工',
        field: '现场安全',
        clearance: '4级',
      },
      {
        role: '医疗支援',
        name: '李医生',
        field: '精神医学',
        clearance: '3级',
      },
    ],
    testResults: [
      {
        item: '质量',
        measuredValue: '2.847 kg',
        standardValue: 'N/A',
        anomalyLevel: '密度异常高',
      },
      {
        item: '硬度',
        measuredValue: '莫氏硬度 8.5',
        standardValue: '石英: 7',
        anomalyLevel: '轻微异常',
      },
      {
        item: '温度',
        measuredValue: '18.3°C',
        standardValue: '室温: 22°C',
        anomalyLevel: '持续低温',
      },
      {
        item: '电导率',
        measuredValue: '0.001 S/m',
        standardValue: '石英: <10⁻¹⁸',
        anomalyLevel: '异常导电',
      },
      {
        item: '磁化率',
        measuredValue: '-2.3×10⁻⁵',
        standardValue: '石英: -1.5×10⁻⁵',
        anomalyLevel: '轻微异常',
      },
    ],
    experimentRounds: [
      {
        round: 'R-1',
        inducedEmotion: '平静',
        contactDuration: '30秒',
        distance: '直接接触',
        observedEffect: '轻微放松感，心率下降',
        intensity: '低',
      },
      {
        round: 'R-2',
        inducedEmotion: '焦虑',
        contactDuration: '30秒',
        distance: '直接接触',
        observedEffect: '水晶发出红光，实验员报告恐惧感加剧',
        intensity: '中等',
      },
      {
        round: 'R-3',
        inducedEmotion: '愤怒',
        contactDuration: '15秒',
        distance: '直接接触',
        observedEffect: '水晶剧烈振动，实验员头痛',
        intensity: '高',
      },
      {
        round: 'R-4',
        inducedEmotion: '悲伤',
        contactDuration: '45秒',
        distance: '直接接触',
        observedEffect: '水晶变暗，实验员流泪',
        intensity: '中等',
      },
      {
        round: 'R-5',
        inducedEmotion: '喜悦',
        contactDuration: '60秒',
        distance: '直接接触',
        observedEffect: '水晶发出金光，实验员报告欣快感',
        intensity: '中等',
      },
      {
        round: 'R-6',
        inducedEmotion: '平静',
        contactDuration: 'N/A',
        distance: '2米',
        observedEffect: '无明显效应',
        intensity: '无',
      },
    ],
    observations: [
      {
        time: '09:15',
        note: '水晶表面光芒强度随实验员情绪波动而变化',
      },
      {
        time: '10:30',
        note: '接触测试时，林博士报告"听到微弱的音乐声"',
      },
      {
        time: '11:45',
        note: '电磁测试期间，实验室内温度下降2°C',
      },
      {
        time: '10:30',
        note: '实验员在极度专注状态下接触O-442-RES，水晶开始发出强烈白光，现实稳定性检测器读数下降至85%',
      },
      {
        time: '11:15',
        note: '实验室内出现轻微的空间扭曲，部分仪器显示读数异常，实验员报告"看到了不存在的门"',
      },
      {
        time: '12:00',
        note: '现实稳定性降至70%，触发安全协议，立即中断接触，启动现实锚定装置，15分钟后环境恢复正常',
      },
    ],
    riskAssessments: [
      {
        riskType: '认知污染',
        threatLevel: '中等',
        probability: '高',
        potentialConsequence: '情绪失控、判断力受损',
        mitigation: '限制接触时间、心理监控',
      },
      {
        riskType: '现实扭曲',
        threatLevel: '高',
        probability: '中等',
        potentialConsequence: '空间异常、设备故障',
        mitigation: '现实锚定装置、紧急协议',
      },
      {
        riskType: '精神创伤',
        threatLevel: '中等',
        probability: '低',
        potentialConsequence: 'PTSD、认知障碍',
        mitigation: '医疗支援、定期评估',
      },
      {
        riskType: '物理伤害',
        threatLevel: '低',
        probability: '低',
        potentialConsequence: '轻微外伤',
        mitigation: '标准防护设备',
      },
    ],
    safetyRequirements: [
      '任何与O-442-RES的接触必须在3级或以上实验室进行',
      '接触时间不得超过60秒',
      '实验员必须通过心理稳定性评估',
      '现实锚定装置必须保持运行状态',
    ],
    recommendedMeasures: [
      '实验前进行冥想或放松训练',
      '配备情绪调节药物',
      '建立实验员轮换制度',
      '定期校准检测设备',
    ],
    conclusions: [
      {
        finding: '物理特性',
        description: 'O-442-RES具有异常的物理属性，但整体稳定',
      },
      {
        finding: '认知效应',
        description: '能够放大接触者的情绪状态，存在认知危害风险',
      },
      {
        finding: '现实扭曲',
        description: '在特定条件下可引发局部现实异常，但范围有限',
      },
      {
        finding: '实用价值',
        description: '潜在的情绪调节和现实操作应用，但风险较高',
      },
    ],
    threatLevelAssessment: '建议维持威胁等级：黄色-CP (条件危险，认知污染)',
    followUpSuggestions: [
      {
        type: '研究方向',
        content: '勘探情绪调节的治疗应用',
        priority: '中等',
      },
      {
        type: '安全协议',
        content: '制定标准化接触程序',
        priority: '高',
      },
      {
        type: '人员培训',
        content: '加强实验员心理抗性训练',
        priority: '高',
      },
      {
        type: '设备升级',
        content: '改进现实稳定性监测系统',
        priority: '中等',
      },
    ],
  },
]
