'use client';

import { useMemo, useState } from 'react';
import {
  Activity,
  ArrowRight,
  Bitcoin,
  Building2,
  CircleDollarSign,
  GitBranch,
  Landmark,
  Link2,
  Network,
  RefreshCw,
  Search,
  ShieldCheck,
  Smartphone,
  SquareStack,
  WalletCards,
} from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export const fundScenePageIds = ['scene-fund-overview', 'scene-fund-objects', 'scene-fund-paths'] as const;
export type FundScenePageId = (typeof fundScenePageIds)[number];

export function isFundScenePageId(value: string): value is FundScenePageId {
  return fundScenePageIds.includes(value as FundScenePageId);
}

type FundCategoryId = 'fund-bank' | 'fund-third-party' | 'fund-aggregator' | 'fund-illegal' | 'fund-crypto';

type FundPathNode = {
  type: string;
  label: string;
  relation: string;
  channel: string;
  amount: string;
};

type FundRecord = {
  id: string;
  categoryId: FundCategoryId;
  category: string;
  coreIdentifier: string;
  objectType: string;
  channel: string;
  relatedObjects: string;
  behavior: string;
  firstSeen: string;
  lastActive: string;
  risk: '高风险' | '中风险';
  status: '待研判' | '研判中' | '已确认';
  details: Array<{ label: string; value: string }>;
  attributes: Array<{ label: string; value: string }>;
  path: FundPathNode[];
  conclusion: string;
  assetType?: '网站' | 'APP' | 'IP';
  assetIdentifier?: string;
};

const fundCategories: Array<{
  id: FundCategoryId;
  label: string;
  icon: typeof Landmark;
  description: string;
}> = [
  { id: 'fund-bank', label: '二方（银行）', icon: Landmark, description: '关注付款账户、收款账户、开户主体和交易时间' },
  { id: 'fund-third-party', label: '三方', icon: WalletCards, description: '关注支付平台、商户号、支付账号和结算账户' },
  { id: 'fund-aggregator', label: '四方聚合', icon: Network, description: '关注聚合平台、通道接口、商户和结算关系' },
  { id: 'fund-illegal', label: '非法四方 / 跑分', icon: CircleDollarSign, description: '关注平台账号、收款账户、设备、IP和订单关系' },
  { id: 'fund-crypto', label: '虚拟币', icon: Bitcoin, description: '关注链、钱包地址、币种和链上交易关系' },
];

const fundRecords: FundRecord[] = [
  {
    id: 'FUND-BANK-001',
    categoryId: 'fund-bank',
    category: '二方（银行）',
    coreIdentifier: '示例账户尾号 1024',
    objectType: '银行账户',
    channel: '示例银行',
    relatedObjects: '2个关联账户',
    behavior: '短时间内接收多笔资金后集中转出',
    firstSeen: '2026-09-07 10:20',
    lastActive: '2026-09-09 15:42',
    risk: '高风险',
    status: '研判中',
    details: [
      { label: '账户标识', value: '示例账户尾号 1024' },
      { label: '账户类型', value: '个人结算账户' },
      { label: '所属渠道', value: '示例银行' },
      { label: '开户主体', value: '示例主体甲' },
    ],
    attributes: [
      { label: '交易特征', value: '多笔转入后短时集中转出' },
      { label: '活跃时段', value: '10:00—18:00' },
      { label: '关联设备', value: '1台示例设备' },
      { label: '关联号码', value: '1个示例号码' },
    ],
    path: [
      { type: '资金来源', label: '示例付款账户A', relation: '银行转账', channel: '示例银行', amount: '¥20,000（示例）' },
      { type: '资金载体', label: '示例账户尾号 1024', relation: '接收资金', channel: '示例银行', amount: '¥20,000（示例）' },
      { type: '资金去向', label: '示例收款账户B', relation: '集中转出', channel: '示例银行', amount: '¥19,800（示例）' },
    ],
    conclusion: '该账户存在多笔资金快速汇入后集中转出的行为，需要结合关联主体、设备和时间继续核验。',
  },
  {
    id: 'FUND-THIRD-002',
    categoryId: 'fund-third-party',
    category: '三方',
    coreIdentifier: 'MERCHANT-DEMO-002',
    objectType: '支付商户',
    channel: '示例支付平台',
    relatedObjects: '1个结算账户',
    behavior: '商户收款与经营信息不匹配，资金快速结算',
    firstSeen: '2026-09-06 09:15',
    lastActive: '2026-09-09 14:18',
    risk: '中风险',
    status: '待研判',
    details: [
      { label: '商户号', value: 'MERCHANT-DEMO-002' },
      { label: '支付平台', value: '示例支付平台' },
      { label: '商户名称', value: '示例商户乙' },
      { label: '结算方式', value: '自动结算' },
    ],
    attributes: [
      { label: '支付账号', value: 'PAY-DEMO-002' },
      { label: '结算账户', value: '示例账户尾号 2088' },
      { label: '支付场景', value: '网页收银台' },
      { label: '接入IP', value: '192.0.2.18' },
    ],
    path: [
      { type: '资金来源', label: '示例支付账号', relation: '发起支付', channel: '示例支付平台', amount: '¥8,000（示例）' },
      { type: '资金载体', label: 'MERCHANT-DEMO-002', relation: '商户收款', channel: '三方支付', amount: '¥8,000（示例）' },
      { type: '资金去向', label: '示例账户尾号 2088', relation: '自动结算', channel: '银行账户', amount: '¥7,920（示例）' },
    ],
    conclusion: '商户支付行为与展示的经营信息存在差异，建议结合接入IP和结算账户开展关联研判。',
    assetType: 'IP',
    assetIdentifier: '192.0.2.18',
  },
  {
    id: 'FUND-AGG-003',
    categoryId: 'fund-aggregator',
    category: '四方聚合',
    coreIdentifier: 'pay-gateway.example',
    objectType: '聚合支付平台',
    channel: '网页支付接口',
    relatedObjects: '3个商户',
    behavior: '多个商户共用支付接口并结算至同一账户',
    firstSeen: '2026-09-05 16:32',
    lastActive: '2026-09-09 12:06',
    risk: '高风险',
    status: '已确认',
    details: [
      { label: '平台域名', value: 'pay-gateway.example' },
      { label: '平台类型', value: '聚合支付平台' },
      { label: '接口协议', value: 'HTTPS' },
      { label: '解析IP', value: '198.51.100.42' },
    ],
    attributes: [
      { label: '关联商户', value: '3个示例商户' },
      { label: '下游通道', value: '2个示例支付通道' },
      { label: '结算账户', value: '示例账户尾号 3099' },
      { label: '接口特征', value: '统一支付回调与订单格式' },
    ],
    path: [
      { type: '资金来源', label: '示例商户组', relation: '提交支付订单', channel: '商户接口', amount: '¥50,000（示例）' },
      { type: '资金载体', label: 'pay-gateway.example', relation: '聚合订单', channel: '四方聚合', amount: '¥50,000（示例）' },
      { type: '中间通道', label: '示例三方支付通道', relation: '完成代收', channel: '三方支付', amount: '¥49,500（示例）' },
      { type: '资金去向', label: '示例账户尾号 3099', relation: '统一结算', channel: '银行账户', amount: '¥49,000（示例）' },
    ],
    conclusion: '多个商户通过同一接口和通道完成收款，并集中结算到同一账户，已形成稳定聚合关系。',
    assetType: '网站',
    assetIdentifier: 'pay-gateway.example',
  },
  {
    id: 'FUND-RUN-004',
    categoryId: 'fund-illegal',
    category: '非法四方 / 跑分',
    coreIdentifier: 'RUN-DEMO-004',
    objectType: '跑分平台账号',
    channel: 'APP',
    relatedObjects: '4个收款账户',
    behavior: '订单与收款账户高频匹配，资金快速归集',
    firstSeen: '2026-09-08 08:45',
    lastActive: '2026-09-09 13:52',
    risk: '高风险',
    status: '研判中',
    details: [
      { label: '平台账号', value: 'RUN-DEMO-004' },
      { label: '平台APP', value: 'APP-RUN-DEMO' },
      { label: '关联群组', value: 'GROUP-DEMO-004' },
      { label: '接入IP', value: '203.0.113.71' },
    ],
    attributes: [
      { label: '收款账户', value: '4个示例账户' },
      { label: '关联设备', value: '2台示例设备' },
      { label: '匹配方式', value: '订单与收款账户自动匹配' },
      { label: '行为特征', value: '收款后短时归集' },
    ],
    path: [
      { type: '资金来源', label: '示例订单组', relation: '订单匹配', channel: '跑分平台', amount: '¥30,000（示例）' },
      { type: '资金载体', label: '4个示例收款账户', relation: '分散收款', channel: '银行/支付账号', amount: '¥30,000（示例）' },
      { type: '中间通道', label: 'RUN-DEMO-004', relation: '平台记账', channel: 'APP-RUN-DEMO', amount: '¥29,400（示例）' },
      { type: '资金去向', label: '示例归集账户', relation: '资金归集', channel: '银行账户', amount: '¥28,800（示例）' },
    ],
    conclusion: '订单、收款账户、平台账号和归集账户之间存在连续资金关系，建议结合设备与IP继续核验。',
    assetType: 'APP',
    assetIdentifier: 'APP-RUN-DEMO',
  },
  {
    id: 'FUND-CRYPTO-005',
    categoryId: 'fund-crypto',
    category: '虚拟币',
    coreIdentifier: '0xDemoWallet0005',
    objectType: '虚拟币钱包',
    channel: '示例公链',
    relatedObjects: '3个关联钱包',
    behavior: '接收多地址转入后向单一钱包集中转出',
    firstSeen: '2026-09-04 20:18',
    lastActive: '2026-09-09 09:36',
    risk: '中风险',
    status: '待研判',
    details: [
      { label: '钱包地址', value: '0xDemoWallet0005' },
      { label: '链名称', value: '示例公链' },
      { label: '币种', value: '示例稳定币' },
      { label: '地址类型', value: '普通地址' },
    ],
    attributes: [
      { label: '交易哈希', value: '0xDemoTransaction0005' },
      { label: '关联钱包', value: '3个示例钱包' },
      { label: '关联场外账号', value: 'OTC-DEMO-005' },
      { label: '行为特征', value: '多地址转入后集中转出' },
    ],
    path: [
      { type: '资金来源', label: '3个示例钱包', relation: '链上转入', channel: '示例公链', amount: '12,000 USDT（示例）' },
      { type: '资金载体', label: '0xDemoWallet0005', relation: '接收并归集', channel: '示例公链', amount: '12,000 USDT（示例）' },
      { type: '中间通道', label: 'OTC-DEMO-005', relation: '场外交易关联', channel: '示例场外渠道', amount: '11,800 USDT（示例）' },
      { type: '资金去向', label: '0xTargetWalletDemo', relation: '链上转出', channel: '示例公链', amount: '11,700 USDT（示例）' },
    ],
    conclusion: '该钱包存在多地址转入和集中转出特征，当前需要结合关联钱包与场外账号继续核验。',
  },
];

function riskClass(risk: FundRecord['risk']) {
  return risk === '高风险'
    ? 'border-red-200 bg-red-50 text-red-700'
    : 'border-amber-200 bg-amber-50 text-amber-700';
}

function statusClass(status: FundRecord['status']) {
  if (status === '已确认') return 'border-emerald-200 bg-emerald-50 text-emerald-700';
  if (status === '研判中') return 'border-blue-200 bg-blue-50 text-blue-700';
  return 'border-slate-200 bg-slate-50 text-slate-600';
}

export function FundSceneNavigation({ activeId, onNavigate }: { activeId: FundScenePageId; onNavigate: (id: FundScenePageId) => void }) {
  const items = [
    { id: 'scene-fund-overview' as const, label: '场景总览', icon: Activity },
    { id: 'scene-fund-objects' as const, label: '资金对象', icon: WalletCards },
    { id: 'scene-fund-paths' as const, label: '资金链路', icon: Network },
  ];

  return <Card className="mb-4 border-0 py-0 shadow-[0_6px_24px_rgba(20,40,80,0.05)] ring-slate-200/80"><CardContent className="flex items-center gap-2 overflow-x-auto p-3 md:px-4">{items.map((item) => <Button key={item.id} type="button" variant={activeId === item.id ? 'default' : 'outline'} size="sm" onClick={() => onNavigate(item.id)} className={activeId === item.id ? 'shrink-0 bg-slate-900 text-white hover:bg-slate-800' : 'shrink-0 border-slate-200 bg-white text-slate-600'}><item.icon className="size-3.5" />{item.label}</Button>)}</CardContent></Card>;
}

function FundOverview({ onOpenCategory }: { onOpenCategory: (categoryId: FundCategoryId) => void }) {
  const workflow = [
    ['发现资金载体', '采集账户、商户、通道和钱包信息'],
    ['提取关键标识', '整理账号、商户号、接口和地址'],
    ['关联交易对象', '连接账户、设备、IP和时间'],
    ['还原资金流向', '识别资金来源、中间通道和去向'],
    ['形成研判结论', '输出预警或打击线索'],
  ];

  return <div className="space-y-4">
    <Card className="border-amber-200 bg-gradient-to-br from-amber-50 to-white py-0 shadow-[0_10px_36px_rgba(20,40,80,0.07)]"><CardContent className="p-5 md:p-6"><div className="flex items-start gap-4"><span className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-amber-100 text-amber-700"><CircleDollarSign className="size-6" /></span><div><h1 className="text-2xl font-semibold tracking-tight text-slate-950">资金载体</h1><p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">围绕账户、商户、支付通道和钱包之间的关系还原资金流向。</p><div className="mt-3 flex flex-wrap gap-2">{['精准预警', '打击'].map((item) => <Badge key={item} variant="outline" className="border-amber-200 bg-white text-amber-700">{item}</Badge>)}</div></div></div></CardContent></Card>
    <Card className="border-0 py-0 shadow-[0_8px_32px_rgba(20,40,80,0.06)] ring-slate-200/80"><CardHeader className="border-b border-slate-100 px-5 py-4"><CardTitle className="text-[15px] font-semibold text-slate-800">资金载体分类</CardTitle></CardHeader><CardContent className="p-5"><div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">{fundCategories.map((category) => <button key={category.id} type="button" onClick={() => onOpenCategory(category.id)} className="group rounded-xl border border-slate-200 bg-white p-4 text-left outline-none transition hover:-translate-y-0.5 hover:border-amber-200 hover:shadow-[0_12px_28px_rgba(120,80,20,0.09)] focus-visible:ring-2 focus-visible:ring-amber-500"><span className="flex items-start justify-between gap-3"><span className="flex size-10 items-center justify-center rounded-xl bg-amber-50 text-amber-600"><category.icon className="size-5" /></span><ArrowRight className="size-4 text-slate-300 transition group-hover:translate-x-0.5 group-hover:text-amber-500" /></span><span className="mt-4 block text-sm font-semibold text-slate-900">{category.label}</span><span className="mt-2 block text-xs leading-5 text-slate-500">{category.description}</span></button>)}</div></CardContent></Card>
    <Card className="border-0 py-0 shadow-[0_8px_32px_rgba(20,40,80,0.06)] ring-slate-200/80"><CardHeader className="border-b border-slate-100 px-5 py-4"><CardTitle className="text-[15px] font-semibold text-slate-800">资金研判过程</CardTitle></CardHeader><CardContent className="p-5"><div className="grid gap-3 md:grid-cols-5">{workflow.map(([title, description], index) => <div key={title} className="relative rounded-xl border border-slate-200 bg-slate-50/70 p-4"><span className="flex size-7 items-center justify-center rounded-full bg-amber-600 text-xs font-semibold text-white">{index + 1}</span><p className="mt-3 text-sm font-semibold text-slate-800">{title}</p><p className="mt-1 text-xs leading-5 text-slate-500">{description}</p>{index < workflow.length - 1 && <ArrowRight className="absolute -right-2 top-1/2 hidden size-4 -translate-y-1/2 text-slate-300 md:block" />}</div>)}</div></CardContent></Card>
  </div>;
}

function FundCategoryFilter({ value, onChange }: { value: string; onChange: (value: string) => void }) {
  return <Card className="border-0 py-0 shadow-[0_8px_32px_rgba(20,40,80,0.05)] ring-slate-200/80"><CardHeader className="border-b border-slate-100 px-4 py-4"><CardTitle className="flex items-center gap-2 text-[15px] font-semibold text-slate-800"><CircleDollarSign className="size-4 text-amber-600" />资金类型</CardTitle></CardHeader><CardContent className="space-y-1 p-2"><button type="button" onClick={() => onChange('all')} className={`flex min-h-9 w-full items-center rounded-lg px-3 text-left text-[13px] transition ${value === 'all' ? 'bg-amber-50 font-medium text-amber-700' : 'text-slate-600 hover:bg-slate-50'}`}>全部资金类型</button>{fundCategories.map((category) => <button key={category.id} type="button" onClick={() => onChange(category.id)} className={`flex min-h-9 w-full items-center gap-2 rounded-lg px-3 text-left text-[13px] transition ${value === category.id ? 'bg-amber-50 font-medium text-amber-700' : 'text-slate-600 hover:bg-slate-50'}`}><category.icon className="size-3.5 shrink-0" />{category.label}</button>)}</CardContent></Card>;
}

function FundRecordDetail({ record, onClose, onNavigateAsset }: { record: FundRecord | null; onClose: () => void; onNavigateAsset: (id: string) => void }) {
  const assetLinks = record ? [
    ...(record.assetType === '网站' ? [
      { label: '网站黑样本', note: record.assetIdentifier ?? '', icon: ShieldCheck, target: 'black-sample' },
      { label: '网站研判结果', note: record.assetIdentifier ?? '', icon: Link2, target: 'result-website' },
      { label: '协议模板', note: '按支付接口与跳转特征关联', icon: SquareStack, target: 'template-protocol' },
      { label: '网站框架', note: '存在代码或页面结构同源特征时关联', icon: GitBranch, target: 'framework-website' },
    ] : []),
    ...(record.assetType === 'APP' ? [
      { label: 'APP黑样本', note: record.assetIdentifier ?? '', icon: ShieldCheck, target: 'black-sample' },
      { label: 'APP研判结果', note: record.assetIdentifier ?? '', icon: Smartphone, target: 'result-app' },
      { label: 'APP框架', note: '存在代码或组件同源特征时关联', icon: GitBranch, target: 'framework-app' },
    ] : []),
    ...(record.assetType === 'IP' ? [
      { label: 'IP研判结果', note: record.assetIdentifier ?? '', icon: Building2, target: 'result-ip' },
    ] : []),
  ] : [];

  return <Sheet open={record !== null} onOpenChange={(open) => !open && onClose()}><SheetContent className="w-full overflow-y-auto p-0 sm:max-w-3xl">{record && <><SheetHeader className="sticky top-0 z-10 border-b border-slate-200 bg-white px-6 py-5 pr-14"><div className="flex flex-wrap items-center gap-2"><Badge variant="outline" className="border-amber-200 bg-amber-50 text-amber-700">{record.category}</Badge><Badge variant="outline" className={riskClass(record.risk)}>{record.risk}</Badge><Badge variant="outline" className="border-amber-200 bg-amber-50 text-amber-700">示例记录</Badge></div><SheetTitle className="mt-2 text-xl font-semibold text-slate-950">{record.coreIdentifier}</SheetTitle><SheetDescription>{record.id}</SheetDescription></SheetHeader><Tabs defaultValue="basic" className="px-6 pb-8"><TabsList className="my-5 h-10 w-full justify-start overflow-x-auto bg-slate-100 p-1"><TabsTrigger value="basic" className="shrink-0">基本信息</TabsTrigger><TabsTrigger value="attributes" className="shrink-0">载体属性</TabsTrigger><TabsTrigger value="relations" className="shrink-0">资金关系</TabsTrigger><TabsTrigger value="assets" className="shrink-0">关联情报资产</TabsTrigger></TabsList><TabsContent value="basic"><div className="grid gap-3 sm:grid-cols-2">{record.details.map((detail) => <div key={detail.label} className="rounded-xl border border-slate-200 bg-slate-50/70 p-4"><p className="text-xs text-slate-400">{detail.label}</p><p className="mt-1.5 break-all text-sm font-medium text-slate-800">{detail.value}</p></div>)}<div className="rounded-xl border border-slate-200 bg-slate-50/70 p-4"><p className="text-xs text-slate-400">首次发现时间</p><p className="mt-1.5 text-sm font-medium text-slate-800">{record.firstSeen}</p></div><div className="rounded-xl border border-slate-200 bg-slate-50/70 p-4"><p className="text-xs text-slate-400">最近活跃时间</p><p className="mt-1.5 text-sm font-medium text-slate-800">{record.lastActive}</p></div></div></TabsContent><TabsContent value="attributes" className="grid gap-3 sm:grid-cols-2">{record.attributes.map((item) => <div key={item.label} className="rounded-xl border border-slate-200 p-4"><p className="text-xs text-slate-400">{item.label}</p><p className="mt-1.5 break-all text-sm font-medium text-slate-800">{item.value}</p></div>)}</TabsContent><TabsContent value="relations" className="space-y-4"><div className="space-y-2">{record.path.map((node, index) => <div key={`${node.type}-${node.label}`}><div className="rounded-xl border border-slate-200 p-4"><div className="flex flex-wrap items-center justify-between gap-2"><p className="text-xs text-slate-400">{node.type}</p><Badge variant="outline">{node.amount}</Badge></div><p className="mt-1 break-all text-sm font-semibold text-slate-800">{node.label}</p><p className="mt-1 text-xs text-slate-500">{node.relation} · {node.channel}</p></div>{index < record.path.length - 1 && <ArrowRight className="mx-auto my-2 size-4 rotate-90 text-slate-300" />}</div>)}</div><div className="rounded-xl border border-amber-200 bg-amber-50/60 p-4"><p className="text-xs font-medium text-amber-700">研判结论</p><p className="mt-2 text-sm leading-6 text-slate-700">{record.conclusion}</p></div></TabsContent><TabsContent value="assets" className="space-y-3">{assetLinks.length > 0 ? assetLinks.map((asset) => <button key={asset.label} type="button" onClick={() => onNavigateAsset(asset.target)} className="group flex w-full items-center gap-3 rounded-xl border border-slate-200 p-4 text-left transition hover:border-amber-200 hover:bg-amber-50/30"><span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-amber-50 text-amber-600"><asset.icon className="size-4" /></span><span className="min-w-0 flex-1"><span className="block text-sm font-medium text-slate-800">{asset.label}</span><span className="mt-1 block truncate text-xs text-slate-500">{asset.note}</span></span><ArrowRight className="size-4 text-slate-300 transition group-hover:translate-x-0.5 group-hover:text-amber-500" /></button>) : <div className="rounded-xl border border-dashed border-slate-200 p-6 text-center text-sm text-slate-400">当前对象仅形成账户或钱包关系，暂无可跳转的情报资产</div>}</TabsContent></Tabs></>}</SheetContent></Sheet>;
}

function FundObjects({ initialCategory, onNavigateAsset }: { initialCategory: string; onNavigateAsset: (id: string) => void }) {
  const [category, setCategory] = useState(initialCategory);
  const [risk, setRisk] = useState('all');
  const [status, setStatus] = useState('all');
  const [keyword, setKeyword] = useState('');
  const [selectedRecord, setSelectedRecord] = useState<FundRecord | null>(null);
  const filteredRecords = useMemo(() => fundRecords.filter((record) => (category === 'all' || record.categoryId === category) && (risk === 'all' || record.risk === risk) && (status === 'all' || record.status === status) && (!keyword || `${record.id}${record.coreIdentifier}${record.objectType}${record.channel}${record.behavior}`.toLowerCase().includes(keyword.toLowerCase()))), [category, keyword, risk, status]);

  return <><div className="grid items-start gap-4 xl:grid-cols-[15rem_minmax(0,1fr)]"><FundCategoryFilter value={category} onChange={setCategory} /><div className="min-w-0 space-y-4"><Card className="border-0 py-0 shadow-[0_8px_32px_rgba(20,40,80,0.05)] ring-slate-200/80"><CardContent className="p-4 md:p-5"><div className="grid gap-3 md:grid-cols-2 xl:grid-cols-[minmax(240px,1fr)_minmax(130px,.45fr)_minmax(130px,.45fr)_auto]"><div className="relative"><Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" /><Input value={keyword} onChange={(event) => setKeyword(event.target.value)} className="h-9 border-slate-200 bg-slate-50/60 pl-9" placeholder="输入对象编号、账号、商户号或钱包地址" /></div><Select value={risk} onValueChange={(value) => value && setRisk(value)}><SelectTrigger className="h-9 w-full border-slate-200 bg-white px-3 text-slate-600"><SelectValue>风险等级</SelectValue></SelectTrigger><SelectContent><SelectItem value="all">全部风险等级</SelectItem><SelectItem value="高风险">高风险</SelectItem><SelectItem value="中风险">中风险</SelectItem></SelectContent></Select><Select value={status} onValueChange={(value) => value && setStatus(value)}><SelectTrigger className="h-9 w-full border-slate-200 bg-white px-3 text-slate-600"><SelectValue>研判状态</SelectValue></SelectTrigger><SelectContent><SelectItem value="all">全部研判状态</SelectItem><SelectItem value="待研判">待研判</SelectItem><SelectItem value="研判中">研判中</SelectItem><SelectItem value="已确认">已确认</SelectItem></SelectContent></Select><Button type="button" variant="outline" onClick={() => { setCategory('all'); setRisk('all'); setStatus('all'); setKeyword(''); }} className="h-9 border-slate-200"><RefreshCw />重置</Button></div></CardContent></Card><Card className="border-0 py-0 shadow-[0_8px_32px_rgba(20,40,80,0.06)] ring-slate-200/80"><CardHeader className="border-b border-slate-100 px-5 py-4"><div className="flex flex-wrap items-center justify-between gap-2"><div><CardTitle className="text-[15px] font-semibold text-slate-800">资金对象列表</CardTitle><CardDescription className="mt-1 text-xs">共 {filteredRecords.length} 条</CardDescription></div><Badge variant="outline" className="border-amber-200 bg-amber-50 text-amber-700">示例数据</Badge></div></CardHeader><CardContent className="overflow-x-auto px-0 pb-0"><Table><TableHeader><TableRow className="border-slate-200 bg-slate-50/80 hover:bg-slate-50/80">{['对象编号', '资金类型', '核心标识', '对象类型', '所属渠道', '关联对象', '最近活跃时间', '风险等级', '研判状态', '操作'].map((column) => <TableHead key={column} className="h-11 whitespace-nowrap px-4 text-xs font-semibold text-slate-600">{column}</TableHead>)}</TableRow></TableHeader><TableBody>{filteredRecords.map((record) => <TableRow key={record.id} className="border-slate-100 hover:bg-amber-50/30"><TableCell className="whitespace-nowrap px-4 font-mono text-xs font-semibold text-amber-700">{record.id}</TableCell><TableCell className="whitespace-nowrap px-4 text-[13px] text-slate-700">{record.category}</TableCell><TableCell className="min-w-44 px-4 text-[13px] font-medium text-slate-900">{record.coreIdentifier}</TableCell><TableCell className="whitespace-nowrap px-4 text-[13px] text-slate-600">{record.objectType}</TableCell><TableCell className="min-w-36 px-4 text-[13px] text-slate-600">{record.channel}</TableCell><TableCell className="min-w-36 px-4 text-[13px] text-slate-600">{record.relatedObjects}</TableCell><TableCell className="whitespace-nowrap px-4 text-[13px] text-slate-500">{record.lastActive}</TableCell><TableCell className="whitespace-nowrap px-4"><Badge variant="outline" className={riskClass(record.risk)}>{record.risk}</Badge></TableCell><TableCell className="whitespace-nowrap px-4"><Badge variant="outline" className={statusClass(record.status)}>{record.status}</Badge></TableCell><TableCell className="whitespace-nowrap px-4"><Button type="button" variant="ghost" size="sm" onClick={() => setSelectedRecord(record)} className="text-amber-700 hover:bg-amber-50 hover:text-amber-800">查看</Button></TableCell></TableRow>)}</TableBody></Table></CardContent></Card></div></div><FundRecordDetail record={selectedRecord} onClose={() => setSelectedRecord(null)} onNavigateAsset={onNavigateAsset} /></>;
}

function FundPaths() {
  const [recordId, setRecordId] = useState(fundRecords[0].id);
  const selectedRecord = fundRecords.find((record) => record.id === recordId) ?? fundRecords[0];
  return <div className="space-y-4"><Card className="border-0 py-0 shadow-[0_8px_32px_rgba(20,40,80,0.05)] ring-slate-200/80"><CardContent className="p-4 md:p-5"><div className="flex flex-wrap items-center justify-between gap-3"><div><p className="text-sm font-semibold text-slate-800">选择资金对象</p><p className="mt-1 text-xs text-slate-500">查看资金来源、中间通道和最终去向。</p></div><Select value={recordId} onValueChange={(value) => value && setRecordId(value)}><SelectTrigger className="h-9 w-full border-slate-200 bg-white px-3 text-slate-600 md:w-80"><SelectValue>{selectedRecord.coreIdentifier}</SelectValue></SelectTrigger><SelectContent>{fundRecords.map((record) => <SelectItem key={record.id} value={record.id}>{record.category} · {record.coreIdentifier}</SelectItem>)}</SelectContent></Select></div></CardContent></Card><Card className="border-0 py-0 shadow-[0_8px_32px_rgba(20,40,80,0.06)] ring-slate-200/80"><CardHeader className="border-b border-slate-100 px-5 py-4"><div className="flex flex-wrap items-center justify-between gap-2"><CardTitle className="text-[15px] font-semibold text-slate-800">资金链路图</CardTitle><Badge variant="outline" className="border-amber-200 bg-amber-50 text-amber-700">示例数据</Badge></div></CardHeader><CardContent className="overflow-x-auto p-5"><div className="flex min-w-max items-center gap-3">{selectedRecord.path.map((node, index) => <div key={`${node.type}-${node.label}`} className="contents"><div className={`w-56 rounded-2xl border p-5 text-center ${index === selectedRecord.path.length - 1 ? 'border-amber-200 bg-amber-500 text-white shadow-[0_12px_32px_rgba(217,119,6,.18)]' : index === 0 ? 'border-slate-200 bg-slate-50/70 text-slate-800' : 'border-amber-100 bg-amber-50/70 text-slate-800'}`}><p className={`text-xs ${index === selectedRecord.path.length - 1 ? 'text-amber-50' : 'text-slate-400'}`}>{node.type}</p><p className="mt-2 break-all text-sm font-semibold">{node.label}</p><p className={`mt-1 text-xs ${index === selectedRecord.path.length - 1 ? 'text-amber-50' : 'text-slate-500'}`}>{node.relation}</p><p className={`mt-3 text-xs font-medium ${index === selectedRecord.path.length - 1 ? 'text-white' : 'text-amber-700'}`}>{node.amount}</p></div>{index < selectedRecord.path.length - 1 && <ArrowRight className="size-5 shrink-0 text-slate-300" />}</div>)}</div></CardContent></Card><Card className="border-0 py-0 shadow-[0_8px_32px_rgba(20,40,80,0.06)] ring-slate-200/80"><CardHeader className="border-b border-slate-100 px-5 py-4"><CardTitle className="text-[15px] font-semibold text-slate-800">资金链路明细</CardTitle><CardDescription className="mt-1 text-xs">共 {selectedRecord.path.length} 个节点，次数与金额均为示例数据</CardDescription></CardHeader><CardContent className="overflow-x-auto px-0 pb-0"><Table><TableHeader><TableRow className="border-slate-200 bg-slate-50/80 hover:bg-slate-50/80">{['顺序', '节点类型', '对象标识', '关系类型', '通道', '次数/金额', '最近活跃时间'].map((column) => <TableHead key={column} className="h-11 whitespace-nowrap px-4 text-xs font-semibold text-slate-600">{column}</TableHead>)}</TableRow></TableHeader><TableBody>{selectedRecord.path.map((node, index) => <TableRow key={`${node.type}-${node.label}`} className="border-slate-100"><TableCell className="px-4 text-[13px] font-semibold text-amber-700">{index + 1}</TableCell><TableCell className="px-4"><Badge variant="outline">{node.type}</Badge></TableCell><TableCell className="px-4 text-[13px] font-medium text-slate-800">{node.label}</TableCell><TableCell className="px-4 text-[13px] text-slate-600">{node.relation}</TableCell><TableCell className="px-4 text-[13px] text-slate-600">{node.channel}</TableCell><TableCell className="whitespace-nowrap px-4 text-[13px] text-slate-700">{node.amount}</TableCell><TableCell className="whitespace-nowrap px-4 text-[13px] text-slate-500">{selectedRecord.lastActive}</TableCell></TableRow>)}</TableBody></Table></CardContent></Card></div>;
}

export function FundScenePage({ pageId, initialCategory, onOpenCategory, onNavigateAsset }: { pageId: FundScenePageId; initialCategory: string; onOpenCategory: (categoryId: string) => void; onNavigateAsset: (id: string) => void }) {
  if (pageId === 'scene-fund-overview') return <FundOverview onOpenCategory={onOpenCategory} />;
  if (pageId === 'scene-fund-objects') return <FundObjects key={initialCategory} initialCategory={initialCategory} onNavigateAsset={onNavigateAsset} />;
  return <FundPaths />;
}
