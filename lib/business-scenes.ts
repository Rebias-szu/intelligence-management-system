export const businessSceneIds = ['overseas-ip', 'relay', 'drainage', 'fraud', 'fund'] as const;

export type BusinessSceneId = (typeof businessSceneIds)[number];

export type RelationDimension =
  | '案件'
  | '线索'
  | 'IP'
  | '域名'
  | 'APP'
  | '手机号'
  | '账号'
  | '设备'
  | '时间';

export type BusinessScene = {
  id: BusinessSceneId;
  label: string;
  scope: string[];
  description: string;
  source: string;
  templatePageId?: 'template-relay' | 'template-drainage' | 'template-fraud' | 'template-fund';
  availableRelations: RelationDimension[];
};

export type SceneBusinessSubcategory = {
  id: string;
  label: string;
  code?: string;
};

export type SceneBusinessCategory = {
  id: string;
  label: string;
  code?: string;
  children: SceneBusinessSubcategory[];
};

export const businessScenes: BusinessScene[] = [
  {
    id: 'overseas-ip',
    label: '境外服务器IP',
    scope: ['研判'],
    description: '查看境外服务器IP的风险识别、关联资产和研判结果。',
    source: '境外服务器IP表单',
    availableRelations: ['IP', '域名', '时间'],
  },
  {
    id: 'relay',
    label: '中继载体',
    scope: ['打击'],
    description: '覆盖VOIP、GOIP、猫池、短链集群和物联网卡。',
    source: '中继载体表单',
    templatePageId: 'template-relay',
    availableRelations: ['案件', '线索', 'IP', '域名', 'APP', '手机号', '账号', '设备', '时间'],
  },
  {
    id: 'drainage',
    label: '引流载体',
    scope: ['提前预警', '打击', '封堵'],
    description: '覆盖卡片、短视频、社交和印刷等引流方式。',
    source: '引流载体表单',
    templatePageId: 'template-drainage',
    availableRelations: ['案件', '线索', 'IP', '域名', 'APP', '手机号', '账号', '设备', '时间'],
  },
  {
    id: 'fraud',
    label: '涉诈载体',
    scope: ['预警', '封堵'],
    description: '按12+2诈骗类型管理网站、APP和协议识别模板。',
    source: '涉诈载体表单',
    templatePageId: 'template-fraud',
    availableRelations: ['线索', 'IP', '域名', 'APP', '时间'],
  },
  {
    id: 'fund',
    label: '资金载体',
    scope: ['精准预警', '打击'],
    description: '覆盖二方、三方、四方聚合、跑分和虚拟币等资金载体。',
    source: '资金载体表单',
    templatePageId: 'template-fund',
    availableRelations: ['案件', '线索', 'IP', '域名', 'APP', '手机号', '账号', '设备', '时间'],
  },
];

export const businessSceneById = new Map(businessScenes.map((scene) => [scene.id, scene]));

export const businessSceneCategories: Record<BusinessSceneId, SceneBusinessCategory[]> = {
  'overseas-ip': [],
  relay: [
    { id: 'relay-voip', label: 'VOIP', children: [] },
    { id: 'relay-goip', label: 'GOIP', children: [] },
    { id: 'relay-modem-pool', label: '猫池', children: [] },
    { id: 'relay-short-link', label: '短链集群', children: [] },
    { id: 'relay-iot-card', label: '物联网卡', children: [] },
  ],
  drainage: [
    { id: 'drainage-card', label: '卡片引流', children: [] },
    { id: 'drainage-video', label: '短视频引流', children: [{ id: 'drainage-video-qr', label: '二维码' }] },
    { id: 'drainage-social', label: '社交引流', children: [] },
    {
      id: 'drainage-print',
      label: '印刷引流',
      children: [
        { id: 'drainage-print-spray', label: '喷绘' },
        { id: 'drainage-print-laser', label: '激光' },
        { id: 'drainage-print-press', label: '印刷' },
      ],
    },
  ],
  fraud: [
    {
      id: 'AA', code: 'AA', label: '贷款、代办信用卡类', children: [
        { id: 'AA10', code: '10', label: '虚假贷款' },
        { id: 'AA20', code: '20', label: '虚假代办信用卡' },
        { id: 'AA30', code: '30', label: '虚假提额套现' },
        { id: 'AA40', code: '40', label: '其他' },
        { id: 'AA41', code: '41', label: '其他-仿冒银行' },
        { id: 'AA42', code: '42', label: '其他-仿冒证券' },
        { id: 'AA43', code: '43', label: '其他-仿冒支付' },
      ],
    },
    { id: 'AB', code: 'AB', label: '刷单返利类', children: [{ id: 'AB10', code: '10', label: '刷单返利类' }] },
    {
      id: 'AC', code: 'AC', label: '冒充电商物流客服类', children: [
        { id: 'AC10', code: '10', label: '冒充电商客服' },
        { id: 'AC20', code: '20', label: '冒充物流客服' },
        { id: 'AC30', code: '30', label: '其他' },
      ],
    },
    {
      id: 'AD', code: 'AD', label: '虚假购物、服务类', children: [
        { id: 'AD10', code: '10', label: '虚假购物' },
        { id: 'AD20', code: '20', label: '虚假服务' },
        { id: 'AD30', code: '30', label: '其他' },
        { id: 'AD31', code: '31', label: '其他-仿冒苹果' },
        { id: 'AD32', code: '32', label: '其他-积分兑换' },
        { id: 'AD33', code: '33', label: '其他-虚假物流空包' },
        { id: 'AD34', code: '34', label: '其他-租号平台' },
        { id: 'AD35', code: '35', label: '其他-虚假会员充值' },
        { id: 'AD36', code: '36', label: '其他-仿冒抖音' },
      ],
    },
    {
      id: 'AE', code: 'AE', label: '杀猪盘类', children: [
        { id: 'AE10', code: '10', label: '虚假投资理财' },
        { id: 'AE20', code: '20', label: '虚假博彩' },
        { id: 'AE30', code: '30', label: '其他' },
      ],
    },
    {
      id: 'AF', code: 'AF', label: '冒充公检法及政府机关类', children: [
        { id: 'AF10', code: '10', label: '冒充公检法' },
        { id: 'AF20', code: '20', label: '冒充其他单位组织' },
      ],
    },
    {
      id: 'AG', code: 'AG', label: '冒充领导、熟人类', children: [
        { id: 'AG10', code: '10', label: '冒充领导' },
        { id: 'AG20', code: '20', label: '冒充熟人' },
        { id: 'AG30', code: '30', label: '冒充公众人物' },
        { id: 'AG40', code: '40', label: '冒充其他身份' },
      ],
    },
    {
      id: 'AH', code: 'AH', label: '网络游戏产品虚假交易类', children: [
        { id: 'AH10', code: '10', label: '游戏币、游戏点卡诈骗' },
        { id: 'AH20', code: '20', label: '游戏账号、游戏装备诈骗' },
        { id: 'AH30', code: '30', label: '其他' },
      ],
    },
    {
      id: 'AI', code: 'AI', label: '网络婚恋、交友类（非杀猪盘）', children: [
        { id: 'AI10', code: '10', label: '冒充外国军人' },
        { id: 'AI20', code: '20', label: '网络婚恋' },
        { id: 'AI30', code: '30', label: '网络交友' },
        { id: 'AI40', code: '40', label: '其他' },
      ],
    },
    {
      id: 'AJ', code: 'AJ', label: '虚假征信类', children: [
        { id: 'AJ10', code: '10', label: '消除校园贷记录' },
        { id: 'AJ20', code: '20', label: '消除不良记录' },
        { id: 'AJ30', code: '30', label: '其他' },
      ],
    },
    { id: 'AK', code: 'AK', label: '冒充军警购物诈骗', children: [{ id: 'AK10', code: '10', label: '冒充军警购物诈骗' }] },
    {
      id: 'AL', code: 'AL', label: '其他类型诈骗', children: [
        { id: 'AL10', code: '10', label: '虚假中奖诈骗' },
        { id: 'AL20', code: '20', label: '虚假招聘' },
        { id: 'AL30', code: '30', label: '充值（红包）返利' },
        { id: 'AL40', code: '40', label: '机票退、改签诈骗' },
        { id: 'AL50', code: '50', label: 'PS图片诈骗' },
        { id: 'AL60', code: '60', label: '重金求子（慈善捐款）' },
        { id: 'AL70', code: '70', label: '其他' },
        { id: 'AL71', code: '71', label: '其他-风险炒股金融类' },
        { id: 'AL72', code: '72', label: '其他-风险虚拟币交易' },
        { id: 'AL73', code: '73', label: '其他-加油卡充值诈骗' },
        { id: 'AL74', code: '74', label: '其他-色情' },
        { id: 'AL75', code: '75', label: '其他-博彩' },
        { id: 'AL76', code: '76', label: '其他-诈骗APP分发平台' },
        { id: 'AL77', code: '77', label: '其他-仿冒虚拟货币钱包' },
        { id: 'AL78', code: '78', label: '其他-NFC盗刷' },
        { id: 'AL79', code: '79', label: '其他-会议远控类软件' },
      ],
    },
    { id: 'AM', code: 'AM', label: '裸聊敲诈勒索', children: [{ id: 'AM10', code: '10', label: '裸聊敲诈勒索' }] },
    { id: 'AN', code: 'AN', label: '网络投资平台', children: [{ id: 'AN10', code: '10', label: '网络投资平台' }] },
  ],
  fund: [
    { id: 'fund-bank', label: '二方（银行）', children: [] },
    { id: 'fund-third-party', label: '三方', children: [] },
    { id: 'fund-aggregator', label: '四方聚合', children: [] },
    { id: 'fund-illegal', label: '非法四方 / 跑分', children: [] },
    { id: 'fund-crypto', label: '虚拟币', children: [] },
  ],
};

type RelationRefs = Partial<Record<RelationDimension, string[]>> & {
  templateCodes?: string[];
  modelCodes?: string[];
};

type AssetSceneEntry = {
  sceneIds: BusinessSceneId[];
  categoryIds?: string[];
  refs?: RelationRefs;
};

// 该索引只描述现有演示记录属于哪些场景。记录本身仍由各资产库维护，不在这里复制。
const assetSceneIndex: Record<string, AssetSceneEntry> = {
  'black-website:loan-service.example': { sceneIds: ['fraud'], categoryIds: ['AA10'], refs: { 域名: ['loan-service.example'], IP: ['192.0.2.18'], templateCodes: ['AA101B'] } },
  'black-website:invest-guide.example': { sceneIds: ['fraud'], categoryIds: ['AE10'], refs: { 域名: ['invest-guide.example'], IP: ['198.51.100.42'], templateCodes: ['AE102G'] } },
  'black-website:customer-help.example': { sceneIds: ['fraud'], categoryIds: ['AC10'], refs: { 域名: ['customer-help.example'], IP: ['203.0.113.71'], templateCodes: ['AC101A'] } },
  'black-app:惠民速贷': { sceneIds: ['fraud'], categoryIds: ['AA10'], refs: { APP: ['com.demo.quickloan'], templateCodes: ['AA105F'] } },
  'black-app:远程协作': { sceneIds: ['fraud'], categoryIds: ['AL79'], refs: { APP: ['com.demo.meeting'], templateCodes: ['AL105N'] } },
  'black-app:优选商城': { sceneIds: ['fraud'], categoryIds: ['AB10'], refs: { APP: ['com.demo.shop'], templateCodes: ['AB105M'] } },
  'pending-website:unavailable-site.example': { sceneIds: ['fraud'], refs: { 域名: ['unavailable-site.example'], IP: ['203.0.113.88'], templateCodes: ['AA101B'] } },
  'pending-app:聚合服务': { sceneIds: ['fraud'], refs: { APP: ['com.demo.service'], templateCodes: ['AL105N'] } },
  'result-website:service-center.example': { sceneIds: ['fraud', 'overseas-ip'], categoryIds: ['AC10'], refs: { 域名: ['service-center.example'], IP: ['192.0.2.18'], templateCodes: ['AC101B'] } },
  'result-website:finance-news.example': { sceneIds: ['fraud', 'overseas-ip'], categoryIds: ['AE10'], refs: { 域名: ['finance-news.example'], IP: ['198.51.100.42'], templateCodes: ['AE102G'] } },
  'result-website:sports-center.example': { sceneIds: ['fraud', 'overseas-ip'], categoryIds: ['AH10'], refs: { 域名: ['sports-center.example'], IP: ['203.0.113.71'], templateCodes: ['AH101B'] } },
  'result-app:在线会议助手': { sceneIds: ['fraud'], categoryIds: ['AL79'], refs: { APP: ['com.demo.online'], templateCodes: ['AL105N'] } },
  'result-app:财富优选': { sceneIds: ['fraud'], categoryIds: ['AE10'], refs: { APP: ['com.demo.wealth'], templateCodes: ['AE105P'] } },
  'result-app:放心借': { sceneIds: ['fraud'], categoryIds: ['AA10'], refs: { APP: ['com.demo.quickloan'], templateCodes: ['AA105F'] } },
  'result-ip:192.0.2.18': { sceneIds: ['overseas-ip', 'fraud'], categoryIds: ['AA10'], refs: { IP: ['192.0.2.18'] } },
  'result-ip:198.51.100.42': { sceneIds: ['overseas-ip', 'fraud'], categoryIds: ['AE10'], refs: { IP: ['198.51.100.42'] } },
  'result-ip:203.0.113.71': { sceneIds: ['overseas-ip', 'fraud'], categoryIds: ['AH10'], refs: { IP: ['203.0.113.71'] } },
  'template-fraud:AA101A': { sceneIds: ['fraud'] },
  'template-fraud:AA101B': { sceneIds: ['fraud'] },
  'template-fraud:AL775L': { sceneIds: ['fraud'] },
  'template-fraud:AL785N': { sceneIds: ['fraud'] },
  'template-fraud:AB103H': { sceneIds: ['fraud'] },
  'template-fraud:AB102G': { sceneIds: ['fraud'] },
  'framework-website:FW0001': { sceneIds: ['fraud'], categoryIds: ['AA10'] },
  'framework-website:FW0002': { sceneIds: ['fraud'], categoryIds: ['AA10'] },
  'framework-website:FW0003': { sceneIds: ['fraud'], categoryIds: ['AA10'] },
  'framework-app:FA0001': { sceneIds: ['fraud'], categoryIds: ['AE10', 'AB10'] },
  'framework-app:FA0002': { sceneIds: ['fraud'], categoryIds: ['AN10', 'AB10'] },
  'framework-app:FA0003': { sceneIds: ['fraud'], categoryIds: ['AL78'] },
  'framework-protocol:FP0001': { sceneIds: ['fraud'], categoryIds: ['AB10'] },
  'framework-protocol:FP0002': { sceneIds: ['fraud'], categoryIds: ['AB10'] },
  'model-warning:WM0001': { sceneIds: ['fraud'], categoryIds: ['AA10'], refs: { modelCodes: ['WM0001'], 时间: ['30分钟'] } },
  'model-warning:WM0002': { sceneIds: ['fraud'], categoryIds: ['AL79'], refs: { modelCodes: ['WM0002'], 时间: ['2小时'] } },
  'model-warning:WM0003': { sceneIds: ['fraud'], categoryIds: ['AB10'], refs: { modelCodes: ['WM0003'], 时间: ['24小时'] } },
  'model-clue:CM0001': { sceneIds: ['fraud'], categoryIds: ['AA10'], refs: { 线索: ['同源扩线'], modelCodes: ['CM0001'], 时间: ['近7天'] } },
  'model-clue:CM0002': { sceneIds: ['overseas-ip', 'fraud'], refs: { 线索: ['基础设施关联'], modelCodes: ['CM0002'], 时间: ['近24小时'] } },
  'model-clue:CM0003': { sceneIds: ['fraud'], categoryIds: ['AB10'], refs: { 线索: ['团伙串并'], modelCodes: ['CM0003'], 时间: ['近30天'] } },
};

export function recordBelongsToScene(datasetId: string, recordKey: string, sceneId: BusinessSceneId) {
  return assetSceneIndex[`${datasetId}:${recordKey}`]?.sceneIds.includes(sceneId) ?? false;
}

export function recordBelongsToSceneCategory(
  datasetId: string,
  recordKey: string,
  sceneId: BusinessSceneId,
  categoryId: string,
) {
  const entry = assetSceneIndex[`${datasetId}:${recordKey}`];
  if (!entry?.sceneIds.includes(sceneId)) return false;
  if (categoryId === 'all') return true;
  return entry.categoryIds?.some((id) => id === categoryId || id.startsWith(categoryId)) ?? false;
}

export function getSceneCategoryLabel(sceneId: BusinessSceneId, categoryId: string) {
  if (categoryId === 'all') return '全部业务分类';
  for (const category of businessSceneCategories[sceneId]) {
    if (category.id === categoryId) return category.label;
    const child = category.children.find((item) => item.id === categoryId);
    if (child) return `${category.label} / ${child.label}`;
  }
  return '全部业务分类';
}

export function countSceneRecords(sceneId: BusinessSceneId, datasetIds: string[]) {
  return Object.entries(assetSceneIndex).filter(([key, entry]) => (
    datasetIds.some((datasetId) => key.startsWith(`${datasetId}:`)) && entry.sceneIds.includes(sceneId)
  )).length;
}

export const allRelationDimensions: RelationDimension[] = ['案件', '线索', 'IP', '域名', 'APP', '手机号', '账号', '设备', '时间'];
