'use client';

import { useMemo, useState } from 'react';
import {
  Activity,
  ArrowRight,
  Film,
  GitBranch,
  Link2,
  MapPin,
  MessageCircle,
  QrCode,
  RefreshCw,
  Route,
  Search,
  ShieldCheck,
  Smartphone,
  SquareStack,
} from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export const drainageScenePageIds = ['scene-drainage-overview', 'scene-drainage-objects', 'scene-drainage-paths'] as const;
export type DrainageScenePageId = (typeof drainageScenePageIds)[number];

export function isDrainageScenePageId(value: string): value is DrainageScenePageId {
  return drainageScenePageIds.includes(value as DrainageScenePageId);
}

type DrainageCategoryId = 'drainage-card' | 'drainage-video' | 'drainage-social' | 'drainage-print';

type DrainagePathNode = {
  type: string;
  label: string;
  note: string;
};

type DrainageRecord = {
  id: string;
  categoryId: DrainageCategoryId;
  category: string;
  subcategory?: string;
  coreIdentifier: string;
  sourceChannel: string;
  target: string;
  targetType: '网站' | 'APP' | '账号';
  extractedObjects: string;
  summary: string;
  firstSeen: string;
  lastActive: string;
  risk: '高风险' | '中风险';
  status: '待研判' | '研判中' | '已确认';
  details: Array<{ label: string; value: string }>;
  content: Array<{ label: string; value: string }>;
  path: DrainagePathNode[];
  conclusion: string;
};

const drainageCategories: Array<{
  id: DrainageCategoryId;
  label: string;
  icon: typeof QrCode;
  description: string;
  children?: string[];
}> = [
  { id: 'drainage-card', label: '卡片引流', icon: QrCode, description: '提取卡片中的二维码、号码、链接和引导内容' },
  { id: 'drainage-video', label: '短视频引流', icon: Film, description: '关联发布账号、视频内容、二维码和评论区线索' },
  { id: 'drainage-social', label: '社交引流', icon: MessageCircle, description: '关联社交账号、群组、邀请链接和联系方式' },
  { id: 'drainage-print', label: '印刷引流', icon: MapPin, description: '提取线下印刷物中的文字、二维码和联系方式', children: ['喷绘', '激光', '印刷'] },
];

const drainageRecords: DrainageRecord[] = [
  {
    id: 'DRN-CARD-001',
    categoryId: 'drainage-card',
    category: '卡片引流',
    coreIdentifier: 'CARD-DEMO-001',
    sourceChannel: '线下采集',
    target: 'rebate-service.example',
    targetType: '网站',
    extractedObjects: '二维码、短链',
    summary: '卡片以兼职返利为由，引导扫码后访问落地网站',
    firstSeen: '2026-09-08 09:20',
    lastActive: '2026-09-09 16:12',
    risk: '高风险',
    status: '已确认',
    details: [
      { label: '对象编号', value: 'CARD-DEMO-001' },
      { label: '采集渠道', value: '线下采集' },
      { label: '载体形式', value: '二维码小卡片' },
      { label: '主要话术', value: '兼职返利、扫码咨询' },
    ],
    content: [
      { label: '二维码内容', value: 'https://s.example/rebate-demo' },
      { label: '短链域名', value: 's.example' },
      { label: '落地域名', value: 'rebate-service.example' },
    ],
    path: [
      { type: '引流入口', label: '二维码卡片', note: '线下发现' },
      { type: '中间媒介', label: 's.example/rebate-demo', note: '扫码后访问短链' },
      { type: '落地目标', label: 'rebate-service.example', note: '最终访问网站' },
    ],
    conclusion: '卡片通过二维码和短链将访问者引向涉诈风险网站，链路完整。',
  },
  {
    id: 'DRN-VIDEO-002',
    categoryId: 'drainage-video',
    category: '短视频引流',
    coreIdentifier: 'video.example/@demo/002',
    sourceChannel: '示例短视频平台',
    target: 'APP-DEMO-002',
    targetType: 'APP',
    extractedObjects: '账号、二维码、下载链接',
    summary: '视频口播引导私信，主页二维码指向APP下载页',
    firstSeen: '2026-09-07 18:05',
    lastActive: '2026-09-09 11:30',
    risk: '高风险',
    status: '研判中',
    details: [
      { label: '发布平台', value: '示例短视频平台' },
      { label: '发布账号', value: 'video_demo_account' },
      { label: '视频地址', value: 'video.example/@demo/002' },
      { label: '发布时间', value: '2026-09-07 17:42' },
    ],
    content: [
      { label: '引导方式', value: '口播引导私信并查看主页二维码' },
      { label: '二维码内容', value: 'https://download.example/app-demo' },
      { label: '落地目标', value: 'APP-DEMO-002' },
    ],
    path: [
      { type: '引流入口', label: '短视频内容', note: '账号 video_demo_account 发布' },
      { type: '中间媒介', label: '主页二维码', note: '跳转APP下载地址' },
      { type: '落地目标', label: 'APP-DEMO-002', note: '示例APP' },
    ],
    conclusion: '短视频、发布账号和主页二维码共同构成稳定引流入口，最终指向风险APP。',
  },
  {
    id: 'DRN-SOCIAL-003',
    categoryId: 'drainage-social',
    category: '社交引流',
    coreIdentifier: 'social_demo_account',
    sourceChannel: '示例社交平台',
    target: 'support_demo_account',
    targetType: '账号',
    extractedObjects: '账号、群组、邀请链接',
    summary: '社交账号通过群组邀请链接引导添加客服账号',
    firstSeen: '2026-09-06 14:22',
    lastActive: '2026-09-09 10:08',
    risk: '中风险',
    status: '待研判',
    details: [
      { label: '平台', value: '示例社交平台' },
      { label: '发布账号', value: 'social_demo_account' },
      { label: '群组标识', value: 'GROUP-DEMO-003' },
      { label: '引导方式', value: '群组邀请与客服私聊' },
    ],
    content: [
      { label: '邀请链接', value: 'chat.example/invite-demo' },
      { label: '客服账号', value: 'support_demo_account' },
      { label: '关联号码', value: '1个示例号码' },
    ],
    path: [
      { type: '引流入口', label: 'social_demo_account', note: '社交平台发布内容' },
      { type: '中间媒介', label: 'GROUP-DEMO-003', note: '邀请进入群组' },
      { type: '落地目标', label: 'support_demo_account', note: '引导添加客服账号' },
    ],
    conclusion: '账号、群组和客服账号之间存在连续引导关系，需要结合后续对话和落地目标继续核验。',
  },
  {
    id: 'DRN-PRINT-004',
    categoryId: 'drainage-print',
    category: '印刷引流',
    subcategory: '喷绘',
    coreIdentifier: 'PRINT-DEMO-004',
    sourceChannel: '线下采集',
    target: 'loan-guide.example',
    targetType: '网站',
    extractedObjects: '二维码、手机号、域名',
    summary: '喷绘内容以贷款咨询为由，引导扫码访问网站',
    firstSeen: '2026-09-05 12:10',
    lastActive: '2026-09-08 17:25',
    risk: '中风险',
    status: '研判中',
    details: [
      { label: '印刷类型', value: '喷绘' },
      { label: '对象编号', value: 'PRINT-DEMO-004' },
      { label: '发现区域', value: '示例区域' },
      { label: '主要内容', value: '贷款咨询、扫码办理' },
    ],
    content: [
      { label: '二维码内容', value: 'https://loan-guide.example/start' },
      { label: '关联号码', value: '1个示例号码' },
      { label: '落地域名', value: 'loan-guide.example' },
    ],
    path: [
      { type: '引流入口', label: '线下喷绘', note: '贷款咨询内容' },
      { type: '中间媒介', label: '二维码', note: '扫码访问落地页' },
      { type: '落地目标', label: 'loan-guide.example', note: '最终访问网站' },
    ],
    conclusion: '印刷物中的二维码直接指向风险网站，号码和域名可作为后续关联依据。',
  },
];

function riskClass(risk: DrainageRecord['risk']) {
  return risk === '高风险'
    ? 'border-red-200 bg-red-50 text-red-700'
    : 'border-amber-200 bg-amber-50 text-amber-700';
}

function statusClass(status: DrainageRecord['status']) {
  if (status === '已确认') return 'border-emerald-200 bg-emerald-50 text-emerald-700';
  if (status === '研判中') return 'border-blue-200 bg-blue-50 text-blue-700';
  return 'border-slate-200 bg-slate-50 text-slate-600';
}

export function DrainageSceneNavigation({
  activeId,
  onNavigate,
}: {
  activeId: DrainageScenePageId;
  onNavigate: (id: DrainageScenePageId) => void;
}) {
  const items = [
    { id: 'scene-drainage-overview' as const, label: '场景总览', icon: Activity },
    { id: 'scene-drainage-objects' as const, label: '引流对象', icon: QrCode },
    { id: 'scene-drainage-paths' as const, label: '引流链路', icon: Route },
  ];

  return (
    <Card className="mb-4 border-0 py-0 shadow-[0_6px_24px_rgba(20,40,80,0.05)] ring-slate-200/80">
      <CardContent className="flex items-center gap-2 overflow-x-auto p-3 md:px-4">
        {items.map((item) => (
          <Button
            key={item.id}
            type="button"
            variant={activeId === item.id ? 'default' : 'outline'}
            size="sm"
            onClick={() => onNavigate(item.id)}
            className={activeId === item.id ? 'shrink-0 bg-slate-900 text-white hover:bg-slate-800' : 'shrink-0 border-slate-200 bg-white text-slate-600'}
          >
            <item.icon className="size-3.5" />{item.label}
          </Button>
        ))}
      </CardContent>
    </Card>
  );
}

function DrainageOverview({ onOpenCategory }: { onOpenCategory: (categoryId: DrainageCategoryId) => void }) {
  const workflow = [
    ['发现引流内容', '采集视频、账号、二维码和印刷内容'],
    ['提取关键标识', '整理链接、号码、账号和群组'],
    ['还原跳转路径', '识别中间媒介与跳转关系'],
    ['关联落地目标', '连接网站、APP、IP和账号'],
    ['形成研判结论', '汇总链路与关联依据'],
  ];

  return (
    <div className="space-y-4">
      <Card className="border-violet-200 bg-gradient-to-br from-violet-50 to-white py-0 shadow-[0_10px_36px_rgba(20,40,80,0.07)]">
        <CardContent className="p-5 md:p-6">
          <div className="flex items-start gap-4">
            <span className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-violet-100 text-violet-700"><Route className="size-6" /></span>
            <div>
              <h1 className="text-2xl font-semibold tracking-tight text-slate-950">引流载体</h1>
              <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">围绕引流入口、跳转媒介和最终落地目标还原完整引流链路。</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {['提前预警', '打击', '封堵'].map((item) => <Badge key={item} variant="outline" className="border-violet-200 bg-white text-violet-700">{item}</Badge>)}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-0 py-0 shadow-[0_8px_32px_rgba(20,40,80,0.06)] ring-slate-200/80">
        <CardHeader className="border-b border-slate-100 px-5 py-4"><CardTitle className="text-[15px] font-semibold text-slate-800">引流载体分类</CardTitle></CardHeader>
        <CardContent className="p-5">
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            {drainageCategories.map((category) => (
              <button key={category.id} type="button" onClick={() => onOpenCategory(category.id)} className="group rounded-xl border border-slate-200 bg-white p-4 text-left outline-none transition hover:-translate-y-0.5 hover:border-violet-200 hover:shadow-[0_12px_28px_rgba(80,40,140,0.09)] focus-visible:ring-2 focus-visible:ring-violet-500">
                <span className="flex items-start justify-between gap-3"><span className="flex size-10 items-center justify-center rounded-xl bg-violet-50 text-violet-600"><category.icon className="size-5" /></span><ArrowRight className="size-4 text-slate-300 transition group-hover:translate-x-0.5 group-hover:text-violet-500" /></span>
                <span className="mt-4 block text-sm font-semibold text-slate-900">{category.label}</span>
                <span className="mt-2 block text-xs leading-5 text-slate-500">{category.description}</span>
                {category.children && <span className="mt-3 flex flex-wrap gap-1.5">{category.children.map((child) => <span key={child} className="rounded-md bg-slate-100 px-2 py-1 text-[11px] text-slate-500">{child}</span>)}</span>}
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="border-0 py-0 shadow-[0_8px_32px_rgba(20,40,80,0.06)] ring-slate-200/80">
        <CardHeader className="border-b border-slate-100 px-5 py-4"><CardTitle className="text-[15px] font-semibold text-slate-800">引流研判过程</CardTitle></CardHeader>
        <CardContent className="p-5">
          <div className="grid gap-3 md:grid-cols-5">
            {workflow.map(([title, description], index) => (
              <div key={title} className="relative rounded-xl border border-slate-200 bg-slate-50/70 p-4">
                <span className="flex size-7 items-center justify-center rounded-full bg-violet-600 text-xs font-semibold text-white">{index + 1}</span>
                <p className="mt-3 text-sm font-semibold text-slate-800">{title}</p>
                <p className="mt-1 text-xs leading-5 text-slate-500">{description}</p>
                {index < workflow.length - 1 && <ArrowRight className="absolute -right-2 top-1/2 hidden size-4 -translate-y-1/2 text-slate-300 md:block" />}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function DrainageCategoryFilter({ value, onChange }: { value: string; onChange: (value: string) => void }) {
  return (
    <Card className="border-0 py-0 shadow-[0_8px_32px_rgba(20,40,80,0.05)] ring-slate-200/80">
      <CardHeader className="border-b border-slate-100 px-4 py-4"><CardTitle className="flex items-center gap-2 text-[15px] font-semibold text-slate-800"><Route className="size-4 text-violet-600" />引流类型</CardTitle></CardHeader>
      <CardContent className="space-y-1 p-2">
        <button type="button" onClick={() => onChange('all')} className={`flex min-h-9 w-full items-center rounded-lg px-3 text-left text-[13px] transition ${value === 'all' ? 'bg-violet-50 font-medium text-violet-700' : 'text-slate-600 hover:bg-slate-50'}`}>全部引流类型</button>
        {drainageCategories.map((category) => (
          <div key={category.id}>
            <button type="button" onClick={() => onChange(category.id)} className={`flex min-h-9 w-full items-center gap-2 rounded-lg px-3 text-left text-[13px] transition ${value === category.id ? 'bg-violet-50 font-medium text-violet-700' : 'text-slate-600 hover:bg-slate-50'}`}><category.icon className="size-3.5 shrink-0" />{category.label}</button>
            {category.children?.map((child) => <button key={child} type="button" onClick={() => onChange(`${category.id}:${child}`)} className={`flex min-h-8 w-full items-center rounded-lg pl-9 pr-3 text-left text-xs transition ${value === `${category.id}:${child}` ? 'bg-violet-50 font-medium text-violet-700' : 'text-slate-400 hover:bg-slate-50 hover:text-slate-600'}`}>{child}</button>)}
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

function DrainageRecordDetail({ record, onClose, onNavigateAsset }: { record: DrainageRecord | null; onClose: () => void; onNavigateAsset: (id: string) => void }) {
  const assetLinks = record ? [
    ...(record.targetType === '网站' ? [
      { label: '网站黑样本', note: record.target, icon: ShieldCheck, target: 'black-sample' },
      { label: '网站研判结果', note: record.target, icon: Link2, target: 'result-website' },
      { label: '网站框架', note: '存在代码或页面结构同源特征时关联', icon: GitBranch, target: 'framework-website' },
    ] : []),
    ...(record.targetType === 'APP' ? [
      { label: 'APP黑样本', note: record.target, icon: ShieldCheck, target: 'black-sample' },
      { label: 'APP研判结果', note: record.target, icon: Smartphone, target: 'result-app' },
      { label: 'APP框架', note: '存在代码或组件同源特征时关联', icon: GitBranch, target: 'framework-app' },
    ] : []),
    ...(record.content.some((item) => item.label.includes('二维码') || item.label.includes('短链')) ? [
      { label: '协议模板', note: '按二维码、短链或跳转特征关联', icon: SquareStack, target: 'template-protocol' },
    ] : []),
  ] : [];

  return (
    <Sheet open={record !== null} onOpenChange={(open) => !open && onClose()}>
      <SheetContent className="w-full overflow-y-auto p-0 sm:max-w-3xl">
        {record && <>
          <SheetHeader className="sticky top-0 z-10 border-b border-slate-200 bg-white px-6 py-5 pr-14">
            <div className="flex flex-wrap items-center gap-2"><Badge variant="outline" className="border-violet-200 bg-violet-50 text-violet-700">{record.category}</Badge>{record.subcategory && <Badge variant="outline">{record.subcategory}</Badge>}<Badge variant="outline" className={riskClass(record.risk)}>{record.risk}</Badge><Badge variant="outline" className="border-amber-200 bg-amber-50 text-amber-700">示例记录</Badge></div>
            <SheetTitle className="mt-2 text-xl font-semibold text-slate-950">{record.coreIdentifier}</SheetTitle>
            <SheetDescription>{record.id}</SheetDescription>
          </SheetHeader>
          <Tabs defaultValue="basic" className="px-6 pb-8">
            <TabsList className="my-5 h-10 w-full justify-start overflow-x-auto bg-slate-100 p-1"><TabsTrigger value="basic" className="shrink-0">基本信息</TabsTrigger><TabsTrigger value="content" className="shrink-0">引流内容</TabsTrigger><TabsTrigger value="path" className="shrink-0">引流链路</TabsTrigger><TabsTrigger value="assets" className="shrink-0">关联情报资产</TabsTrigger></TabsList>
            <TabsContent value="basic"><div className="grid gap-3 sm:grid-cols-2">{record.details.map((detail) => <div key={detail.label} className="rounded-xl border border-slate-200 bg-slate-50/70 p-4"><p className="text-xs text-slate-400">{detail.label}</p><p className="mt-1.5 break-all text-sm font-medium text-slate-800">{detail.value}</p></div>)}<div className="rounded-xl border border-slate-200 bg-slate-50/70 p-4"><p className="text-xs text-slate-400">首次发现时间</p><p className="mt-1.5 text-sm font-medium text-slate-800">{record.firstSeen}</p></div><div className="rounded-xl border border-slate-200 bg-slate-50/70 p-4"><p className="text-xs text-slate-400">最近活跃时间</p><p className="mt-1.5 text-sm font-medium text-slate-800">{record.lastActive}</p></div></div></TabsContent>
            <TabsContent value="content" className="space-y-3">{record.content.map((item) => <div key={item.label} className="rounded-xl border border-slate-200 p-4"><p className="text-xs text-slate-400">{item.label}</p><p className="mt-1.5 break-all text-sm font-medium text-slate-800">{item.value}</p></div>)}<div className="rounded-xl border border-violet-200 bg-violet-50/60 p-4"><p className="text-xs font-medium text-violet-600">研判结论</p><p className="mt-2 text-sm leading-6 text-slate-700">{record.conclusion}</p></div></TabsContent>
            <TabsContent value="path"><div className="space-y-3">{record.path.map((node, index) => <div key={`${node.type}-${node.label}`}><div className={`rounded-xl border p-4 ${index === record.path.length - 1 ? 'border-violet-200 bg-violet-50/60' : 'border-slate-200 bg-white'}`}><p className="text-xs text-slate-400">{node.type}</p><p className="mt-1 break-all text-sm font-semibold text-slate-800">{node.label}</p><p className="mt-1 text-xs text-slate-500">{node.note}</p></div>{index < record.path.length - 1 && <ArrowRight className="mx-auto my-2 size-4 rotate-90 text-slate-300" />}</div>)}</div></TabsContent>
            <TabsContent value="assets" className="space-y-3">{assetLinks.length > 0 ? assetLinks.map((asset) => <button key={asset.label} type="button" onClick={() => onNavigateAsset(asset.target)} className="group flex w-full items-center gap-3 rounded-xl border border-slate-200 p-4 text-left transition hover:border-violet-200 hover:bg-violet-50/30"><span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-violet-50 text-violet-600"><asset.icon className="size-4" /></span><span className="min-w-0 flex-1"><span className="block text-sm font-medium text-slate-800">{asset.label}</span><span className="mt-1 block truncate text-xs text-slate-500">{asset.note}</span></span><ArrowRight className="size-4 text-slate-300 transition group-hover:translate-x-0.5 group-hover:text-violet-500" /></button>) : <div className="rounded-xl border border-dashed border-slate-200 p-6 text-center text-sm text-slate-400">当前仅形成账号关联，暂无可跳转的情报资产</div>}</TabsContent>
          </Tabs>
        </>}
      </SheetContent>
    </Sheet>
  );
}

function DrainageObjects({ initialCategory, onNavigateAsset }: { initialCategory: string; onNavigateAsset: (id: string) => void }) {
  const [category, setCategory] = useState(initialCategory);
  const [risk, setRisk] = useState('all');
  const [status, setStatus] = useState('all');
  const [keyword, setKeyword] = useState('');
  const [selectedRecord, setSelectedRecord] = useState<DrainageRecord | null>(null);
  const filteredRecords = useMemo(() => drainageRecords.filter((record) => {
    const [categoryId, subcategory] = category.split(':');
    return (category === 'all' || (record.categoryId === categoryId && (!subcategory || record.subcategory === subcategory)))
      && (risk === 'all' || record.risk === risk)
      && (status === 'all' || record.status === status)
      && (!keyword || `${record.id}${record.coreIdentifier}${record.sourceChannel}${record.target}${record.summary}`.toLowerCase().includes(keyword.toLowerCase()));
  }), [category, keyword, risk, status]);

  return <>
    <div className="grid items-start gap-4 xl:grid-cols-[15rem_minmax(0,1fr)]">
      <DrainageCategoryFilter value={category} onChange={setCategory} />
      <div className="min-w-0 space-y-4">
        <Card className="border-0 py-0 shadow-[0_8px_32px_rgba(20,40,80,0.05)] ring-slate-200/80"><CardContent className="p-4 md:p-5"><div className="grid gap-3 md:grid-cols-2 xl:grid-cols-[minmax(240px,1fr)_minmax(130px,.45fr)_minmax(130px,.45fr)_auto]"><div className="relative"><Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" /><Input value={keyword} onChange={(event) => setKeyword(event.target.value)} className="h-9 border-slate-200 bg-slate-50/60 pl-9" placeholder="输入对象编号、账号、链接或落地目标" /></div><Select value={risk} onValueChange={(value) => value && setRisk(value)}><SelectTrigger className="h-9 w-full border-slate-200 bg-white px-3 text-slate-600"><SelectValue>风险等级</SelectValue></SelectTrigger><SelectContent><SelectItem value="all">全部风险等级</SelectItem><SelectItem value="高风险">高风险</SelectItem><SelectItem value="中风险">中风险</SelectItem></SelectContent></Select><Select value={status} onValueChange={(value) => value && setStatus(value)}><SelectTrigger className="h-9 w-full border-slate-200 bg-white px-3 text-slate-600"><SelectValue>研判状态</SelectValue></SelectTrigger><SelectContent><SelectItem value="all">全部研判状态</SelectItem><SelectItem value="待研判">待研判</SelectItem><SelectItem value="研判中">研判中</SelectItem><SelectItem value="已确认">已确认</SelectItem></SelectContent></Select><Button type="button" variant="outline" onClick={() => { setCategory('all'); setRisk('all'); setStatus('all'); setKeyword(''); }} className="h-9 border-slate-200"><RefreshCw />重置</Button></div></CardContent></Card>
        <Card className="border-0 py-0 shadow-[0_8px_32px_rgba(20,40,80,0.06)] ring-slate-200/80"><CardHeader className="border-b border-slate-100 px-5 py-4"><div className="flex flex-wrap items-center justify-between gap-2"><div><CardTitle className="text-[15px] font-semibold text-slate-800">引流对象列表</CardTitle><CardDescription className="mt-1 text-xs">共 {filteredRecords.length} 条</CardDescription></div><Badge variant="outline" className="border-amber-200 bg-amber-50 text-amber-700">示例数据</Badge></div></CardHeader><CardContent className="overflow-x-auto px-0 pb-0"><Table><TableHeader><TableRow className="border-slate-200 bg-slate-50/80 hover:bg-slate-50/80">{['对象编号', '引流类型', '核心标识', '来源渠道', '引流目标', '提取信息', '最近活跃时间', '风险等级', '研判状态', '操作'].map((column) => <TableHead key={column} className="h-11 whitespace-nowrap px-4 text-xs font-semibold text-slate-600">{column}</TableHead>)}</TableRow></TableHeader><TableBody>{filteredRecords.map((record) => <TableRow key={record.id} className="border-slate-100 hover:bg-violet-50/30"><TableCell className="whitespace-nowrap px-4 font-mono text-xs font-semibold text-violet-700">{record.id}</TableCell><TableCell className="whitespace-nowrap px-4 text-[13px] text-slate-700">{record.subcategory ? `${record.category} / ${record.subcategory}` : record.category}</TableCell><TableCell className="min-w-44 px-4 text-[13px] font-medium text-slate-900">{record.coreIdentifier}</TableCell><TableCell className="whitespace-nowrap px-4 text-[13px] text-slate-600">{record.sourceChannel}</TableCell><TableCell className="min-w-40 px-4 text-[13px] text-slate-600">{record.target}</TableCell><TableCell className="min-w-44 px-4 text-[13px] text-slate-600">{record.extractedObjects}</TableCell><TableCell className="whitespace-nowrap px-4 text-[13px] text-slate-500">{record.lastActive}</TableCell><TableCell className="whitespace-nowrap px-4"><Badge variant="outline" className={riskClass(record.risk)}>{record.risk}</Badge></TableCell><TableCell className="whitespace-nowrap px-4"><Badge variant="outline" className={statusClass(record.status)}>{record.status}</Badge></TableCell><TableCell className="whitespace-nowrap px-4"><Button type="button" variant="ghost" size="sm" onClick={() => setSelectedRecord(record)} className="text-violet-600 hover:bg-violet-50 hover:text-violet-700">查看</Button></TableCell></TableRow>)}</TableBody></Table></CardContent></Card>
      </div>
    </div>
    <DrainageRecordDetail record={selectedRecord} onClose={() => setSelectedRecord(null)} onNavigateAsset={onNavigateAsset} />
  </>;
}

function DrainagePaths() {
  const [recordId, setRecordId] = useState(drainageRecords[0].id);
  const selectedRecord = drainageRecords.find((record) => record.id === recordId) ?? drainageRecords[0];
  return <div className="space-y-4">
    <Card className="border-0 py-0 shadow-[0_8px_32px_rgba(20,40,80,0.05)] ring-slate-200/80"><CardContent className="p-4 md:p-5"><div className="flex flex-wrap items-center justify-between gap-3"><div><p className="text-sm font-semibold text-slate-800">选择引流对象</p><p className="mt-1 text-xs text-slate-500">查看引流入口、中间媒介和最终落地目标。</p></div><Select value={recordId} onValueChange={(value) => value && setRecordId(value)}><SelectTrigger className="h-9 w-full border-slate-200 bg-white px-3 text-slate-600 md:w-80"><SelectValue>{selectedRecord.coreIdentifier}</SelectValue></SelectTrigger><SelectContent>{drainageRecords.map((record) => <SelectItem key={record.id} value={record.id}>{record.category} · {record.coreIdentifier}</SelectItem>)}</SelectContent></Select></div></CardContent></Card>
    <Card className="border-0 py-0 shadow-[0_8px_32px_rgba(20,40,80,0.06)] ring-slate-200/80"><CardHeader className="border-b border-slate-100 px-5 py-4"><div className="flex flex-wrap items-center justify-between gap-2"><CardTitle className="text-[15px] font-semibold text-slate-800">引流链路图</CardTitle><Badge variant="outline" className="border-amber-200 bg-amber-50 text-amber-700">示例数据</Badge></div></CardHeader><CardContent className="p-5"><div className="grid items-center gap-3 lg:grid-cols-[1fr_auto_1fr_auto_1fr]">{selectedRecord.path.map((node, index) => <div key={`${node.type}-${node.label}`} className="contents"><div className={`rounded-2xl border p-5 text-center ${index === selectedRecord.path.length - 1 ? 'border-violet-200 bg-violet-600 text-white shadow-[0_12px_32px_rgba(124,58,237,.18)]' : 'border-slate-200 bg-slate-50/70 text-slate-800'}`}><p className={`text-xs ${index === selectedRecord.path.length - 1 ? 'text-violet-100' : 'text-slate-400'}`}>{node.type}</p><p className="mt-2 break-all text-sm font-semibold">{node.label}</p><p className={`mt-1 text-xs ${index === selectedRecord.path.length - 1 ? 'text-violet-100' : 'text-slate-500'}`}>{node.note}</p></div>{index < selectedRecord.path.length - 1 && <ArrowRight className="mx-auto size-5 rotate-90 text-slate-300 lg:rotate-0" />}</div>)}</div></CardContent></Card>
    <Card className="border-0 py-0 shadow-[0_8px_32px_rgba(20,40,80,0.06)] ring-slate-200/80"><CardHeader className="border-b border-slate-100 px-5 py-4"><CardTitle className="text-[15px] font-semibold text-slate-800">链路节点明细</CardTitle><CardDescription className="mt-1 text-xs">共 {selectedRecord.path.length} 个节点</CardDescription></CardHeader><CardContent className="overflow-x-auto px-0 pb-0"><Table><TableHeader><TableRow className="border-slate-200 bg-slate-50/80 hover:bg-slate-50/80">{['节点顺序', '节点类型', '对象标识', '关系说明', '首次发现时间', '最近活跃时间'].map((column) => <TableHead key={column} className="h-11 whitespace-nowrap px-4 text-xs font-semibold text-slate-600">{column}</TableHead>)}</TableRow></TableHeader><TableBody>{selectedRecord.path.map((node, index) => <TableRow key={`${node.type}-${node.label}`} className="border-slate-100"><TableCell className="px-4 text-[13px] font-semibold text-violet-700">{index + 1}</TableCell><TableCell className="px-4"><Badge variant="outline">{node.type}</Badge></TableCell><TableCell className="px-4 text-[13px] font-medium text-slate-800">{node.label}</TableCell><TableCell className="px-4 text-[13px] text-slate-600">{node.note}</TableCell><TableCell className="whitespace-nowrap px-4 text-[13px] text-slate-500">{selectedRecord.firstSeen}</TableCell><TableCell className="whitespace-nowrap px-4 text-[13px] text-slate-500">{selectedRecord.lastActive}</TableCell></TableRow>)}</TableBody></Table></CardContent></Card>
  </div>;
}

export function DrainageScenePage({ pageId, initialCategory, onOpenCategory, onNavigateAsset }: { pageId: DrainageScenePageId; initialCategory: string; onOpenCategory: (categoryId: string) => void; onNavigateAsset: (id: string) => void }) {
  if (pageId === 'scene-drainage-overview') return <DrainageOverview onOpenCategory={onOpenCategory} />;
  if (pageId === 'scene-drainage-objects') return <DrainageObjects key={initialCategory} initialCategory={initialCategory} onNavigateAsset={onNavigateAsset} />;
  return <DrainagePaths />;
}
