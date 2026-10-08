'use client';

import { useMemo, useState } from 'react';
import {
  Activity,
  ArrowRight,
  Database,
  GitBranch,
  Link2,
  Network,
  PhoneCall,
  RadioTower,
  RefreshCw,
  Search,
  ShieldCheck,
  Smartphone,
  SquareStack,
  Waypoints,
  Wifi,
} from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export const relayScenePageIds = ['scene-relay-overview', 'scene-relay-objects', 'scene-relay-analysis'] as const;
export type RelayScenePageId = (typeof relayScenePageIds)[number];

export function isRelayScenePageId(value: string): value is RelayScenePageId {
  return relayScenePageIds.includes(value as RelayScenePageId);
}

type RelayCategoryId = 'relay-voip' | 'relay-goip' | 'relay-modem-pool' | 'relay-short-link' | 'relay-iot-card';

type RelayRecord = {
  id: string;
  categoryId: RelayCategoryId;
  category: string;
  coreIdentifier: string;
  ip: string;
  relatedObjects: string;
  behavior: string;
  firstSeen: string;
  lastActive: string;
  risk: '高风险' | '中风险';
  status: '待研判' | '研判中' | '已确认';
  details: Array<{ label: string; value: string }>;
  relations: Array<{ type: string; value: string; description: string }>;
  conclusion: string;
  evidence: string[];
};

const relayCategories: Array<{
  id: RelayCategoryId;
  label: string;
  icon: typeof PhoneCall;
  description: string;
}> = [
  { id: 'relay-voip', label: 'VOIP', icon: PhoneCall, description: '关注SIP账号、IP端口和异常呼叫行为' },
  { id: 'relay-goip', label: 'GOIP', icon: RadioTower, description: '关注设备、号码池、SIM卡和接入IP' },
  { id: 'relay-modem-pool', label: '猫池', icon: Wifi, description: '关注批量卡槽、设备指纹和号码轮换' },
  { id: 'relay-short-link', label: '短链集群', icon: Link2, description: '关注短链域名、跳转路径和最终落地目标' },
  { id: 'relay-iot-card', label: '物联网卡', icon: Smartphone, description: '关注卡号、终端设备、运营商和活跃基站' },
];

const relayRecords: RelayRecord[] = [
  {
    id: 'RLY-VOIP-001',
    categoryId: 'relay-voip',
    category: 'VOIP',
    coreIdentifier: '192.0.2.18:5060',
    ip: '192.0.2.18',
    relatedObjects: '12个号码',
    behavior: '夜间高频呼叫，主叫号码快速轮换',
    firstSeen: '2026-09-08 21:10',
    lastActive: '2026-09-09 03:42',
    risk: '高风险',
    status: '研判中',
    details: [
      { label: 'IP与端口', value: '192.0.2.18:5060' },
      { label: 'SIP账号', value: 'sip_demo_01' },
      { label: '关联主叫', value: '12个示例号码' },
      { label: '活跃时段', value: '21:00—04:00' },
    ],
    relations: [
      { type: 'IP', value: '192.0.2.18', description: '当前VOIP服务接入IP' },
      { type: '手机号', value: '12个示例号码', description: '近24小时出现的主叫号码集合' },
      { type: '时间', value: '夜间活跃', description: '集中出现在21:00—04:00' },
    ],
    conclusion: '该对象存在短时高频呼叫及号码快速轮换特征，建议结合IP研判结果继续核验。',
    evidence: ['SIP会话频次异常', '主叫号码轮换速度较高', '活跃时间集中在夜间'],
  },
  {
    id: 'RLY-GOIP-002',
    categoryId: 'relay-goip',
    category: 'GOIP',
    coreIdentifier: 'GOIP-DEMO-16',
    ip: '198.51.100.42',
    relatedObjects: '16张SIM卡',
    behavior: '多卡槽并发，设备与号码池固定关联',
    firstSeen: '2026-09-07 10:15',
    lastActive: '2026-09-09 14:20',
    risk: '高风险',
    status: '已确认',
    details: [
      { label: '设备编号', value: 'GOIP-DEMO-16' },
      { label: '接入IP', value: '198.51.100.42' },
      { label: '卡槽数量', value: '16' },
      { label: '关联号码池', value: '16个示例号码' },
    ],
    relations: [
      { type: '设备', value: 'GOIP-DEMO-16', description: '多卡槽GOIP设备' },
      { type: 'IP', value: '198.51.100.42', description: '设备最近接入IP' },
      { type: '手机号', value: '16个示例号码', description: '设备卡槽关联号码池' },
    ],
    conclusion: '设备、号码池和接入IP形成稳定关联，具备持续性中继活动特征。',
    evidence: ['多卡槽并发通信', '号码池与设备指纹稳定关联', '接入IP持续活跃'],
  },
  {
    id: 'RLY-MP-003',
    categoryId: 'relay-modem-pool',
    category: '猫池',
    coreIdentifier: 'MODEM-POOL-DEMO-03',
    ip: '203.0.113.71',
    relatedObjects: '8张SIM卡',
    behavior: '号码轮换频繁，通信时间高度集中',
    firstSeen: '2026-09-08 09:32',
    lastActive: '2026-09-09 11:05',
    risk: '中风险',
    status: '待研判',
    details: [
      { label: '设备编号', value: 'MODEM-POOL-DEMO-03' },
      { label: '接入IP', value: '203.0.113.71' },
      { label: '卡槽数量', value: '8' },
      { label: '设备指纹', value: 'fp_demo_modem_03' },
    ],
    relations: [
      { type: '设备', value: 'MODEM-POOL-DEMO-03', description: '猫池设备标识' },
      { type: 'IP', value: '203.0.113.71', description: '设备接入IP' },
      { type: '手机号', value: '8个示例号码', description: '卡槽关联号码' },
    ],
    conclusion: '当前关联信息仍不足，需要结合后续通信频次和号码变化继续观察。',
    evidence: ['号码轮换频繁', '设备指纹已提取', '通信时间分布集中'],
  },
  {
    id: 'RLY-LINK-004',
    categoryId: 'relay-short-link',
    category: '短链集群',
    coreIdentifier: 's.example/r7K2',
    ip: '192.0.2.18',
    relatedObjects: '3个落地域名',
    behavior: '多级跳转，最终落地目标重复出现',
    firstSeen: '2026-09-08 16:40',
    lastActive: '2026-09-09 13:18',
    risk: '高风险',
    status: '研判中',
    details: [
      { label: '短链', value: 's.example/r7K2' },
      { label: '解析IP', value: '192.0.2.18' },
      { label: '跳转层级', value: '3级' },
      { label: '最终落地', value: 'loan-service.example' },
    ],
    relations: [
      { type: '域名', value: 's.example', description: '短链服务域名' },
      { type: 'IP', value: '192.0.2.18', description: '短链解析IP' },
      { type: '域名', value: 'loan-service.example', description: '最终落地网站' },
    ],
    conclusion: '短链通过多级跳转导向已有关联记录的网站，应结合网站黑样本和框架信息核验。',
    evidence: ['多级跳转路径稳定', '最终落地域名重复出现', '落地网站存在关联研判结果'],
  },
  {
    id: 'RLY-IOT-005',
    categoryId: 'relay-iot-card',
    category: '物联网卡',
    coreIdentifier: 'ICCID-DEMO-0005',
    ip: '198.51.100.42',
    relatedObjects: '2台设备',
    behavior: '跨设备使用，活跃基站变化异常',
    firstSeen: '2026-09-06 08:20',
    lastActive: '2026-09-09 12:36',
    risk: '中风险',
    status: '待研判',
    details: [
      { label: 'ICCID', value: 'ICCID-DEMO-0005' },
      { label: 'IMSI', value: 'IMSI-DEMO-0005' },
      { label: '所属运营商', value: '示例运营商' },
      { label: '关联设备', value: '2台示例设备' },
    ],
    relations: [
      { type: '账号', value: 'ICCID-DEMO-0005', description: '物联网卡标识' },
      { type: '设备', value: '2台示例设备', description: '近期使用该卡的终端' },
      { type: 'IP', value: '198.51.100.42', description: '最近通信IP' },
    ],
    conclusion: '该物联网卡存在跨设备使用情况，需要结合设备和基站变化进一步判断。',
    evidence: ['同一卡号关联多台设备', '活跃基站变化较快', '最近通信IP已有研判记录'],
  },
];

const relationRows = relayRecords.flatMap((record) => record.relations.map((relation, index) => ({
  id: `${record.id}-${index}`,
  source: record.coreIdentifier,
  sourceType: record.category,
  relationType: relation.type,
  target: relation.value,
  description: relation.description,
  lastActive: record.lastActive,
})));

function riskClass(risk: RelayRecord['risk']) {
  return risk === '高风险'
    ? 'border-red-200 bg-red-50 text-red-700'
    : 'border-amber-200 bg-amber-50 text-amber-700';
}

function statusClass(status: RelayRecord['status']) {
  if (status === '已确认') return 'border-emerald-200 bg-emerald-50 text-emerald-700';
  if (status === '研判中') return 'border-blue-200 bg-blue-50 text-blue-700';
  return 'border-slate-200 bg-slate-50 text-slate-600';
}

export function RelaySceneNavigation({
  activeId,
  onNavigate,
}: {
  activeId: RelayScenePageId;
  onNavigate: (id: RelayScenePageId) => void;
}) {
  const items = [
    { id: 'scene-relay-overview' as const, label: '场景总览', icon: Activity },
    { id: 'scene-relay-objects' as const, label: '中继对象', icon: RadioTower },
    { id: 'scene-relay-analysis' as const, label: '关联研判', icon: Network },
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

function RelayOverview({ onOpenCategory }: { onOpenCategory: (categoryId: RelayCategoryId) => void }) {
  const workflow = [
    ['发现中继对象', '采集IP、号码、设备和短链'],
    ['提取关键标识', '统一整理不同类型的对象信息'],
    ['建立关联关系', '连接IP、号码、设备、域名和时间'],
    ['形成研判结论', '汇总行为特征与关联依据'],
    ['输出情报', '形成预警、封堵建议或线索'],
  ];

  return (
    <div className="space-y-4">
      <Card className="border-blue-200 bg-gradient-to-br from-blue-50 to-white py-0 shadow-[0_10px_36px_rgba(20,40,80,0.07)]">
        <CardContent className="p-5 md:p-6">
          <div className="flex items-start gap-4">
            <span className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-blue-100 text-blue-700"><RadioTower className="size-6" /></span>
            <div>
              <h1 className="text-2xl font-semibold tracking-tight text-slate-950">中继载体</h1>
              <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">围绕中继对象的关键标识、通信行为和关联关系开展场景研判。</p>
              <Badge variant="outline" className="mt-3 border-blue-200 bg-white text-blue-700">打击</Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-0 py-0 shadow-[0_8px_32px_rgba(20,40,80,0.06)] ring-slate-200/80">
        <CardHeader className="border-b border-slate-100 px-5 py-4">
          <CardTitle className="text-[15px] font-semibold text-slate-800">中继载体分类</CardTitle>
        </CardHeader>
        <CardContent className="p-5">
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
            {relayCategories.map((category) => (
              <button
                key={category.id}
                type="button"
                onClick={() => onOpenCategory(category.id)}
                className="group rounded-xl border border-slate-200 bg-white p-4 text-left outline-none transition hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-[0_12px_28px_rgba(20,60,120,0.09)] focus-visible:ring-2 focus-visible:ring-blue-500"
              >
                <span className="flex items-start justify-between gap-3">
                  <span className="flex size-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600"><category.icon className="size-5" /></span>
                  <ArrowRight className="size-4 text-slate-300 transition group-hover:translate-x-0.5 group-hover:text-blue-500" />
                </span>
                <span className="mt-4 block text-sm font-semibold text-slate-900">{category.label}</span>
                <span className="mt-2 block text-xs leading-5 text-slate-500">{category.description}</span>
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="border-0 py-0 shadow-[0_8px_32px_rgba(20,40,80,0.06)] ring-slate-200/80">
        <CardHeader className="border-b border-slate-100 px-5 py-4">
          <CardTitle className="text-[15px] font-semibold text-slate-800">中继研判过程</CardTitle>
        </CardHeader>
        <CardContent className="p-5">
          <div className="grid gap-3 md:grid-cols-5">
            {workflow.map(([title, description], index) => (
              <div key={title} className="relative rounded-xl border border-slate-200 bg-slate-50/70 p-4">
                <span className="flex size-7 items-center justify-center rounded-full bg-blue-600 text-xs font-semibold text-white">{index + 1}</span>
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

function RelayCategoryFilter({ value, onChange }: { value: string; onChange: (value: string) => void }) {
  return (
    <Card className="border-0 py-0 shadow-[0_8px_32px_rgba(20,40,80,0.05)] ring-slate-200/80">
      <CardHeader className="border-b border-slate-100 px-4 py-4">
        <CardTitle className="flex items-center gap-2 text-[15px] font-semibold text-slate-800"><Waypoints className="size-4 text-blue-600" />中继类型</CardTitle>
      </CardHeader>
      <CardContent className="space-y-1 p-2">
        <button type="button" onClick={() => onChange('all')} className={`flex min-h-9 w-full items-center rounded-lg px-3 text-left text-[13px] transition ${value === 'all' ? 'bg-blue-50 font-medium text-blue-700' : 'text-slate-600 hover:bg-slate-50'}`}>全部中继类型</button>
        {relayCategories.map((category) => (
          <button
            key={category.id}
            type="button"
            onClick={() => onChange(category.id)}
            className={`flex min-h-9 w-full items-center gap-2 rounded-lg px-3 text-left text-[13px] transition ${value === category.id ? 'bg-blue-50 font-medium text-blue-700' : 'text-slate-600 hover:bg-slate-50'}`}
          >
            <category.icon className="size-3.5 shrink-0" />{category.label}
          </button>
        ))}
      </CardContent>
    </Card>
  );
}

function RelayRecordDetail({
  record,
  onClose,
  onNavigateAsset,
}: {
  record: RelayRecord | null;
  onClose: () => void;
  onNavigateAsset: (id: string) => void;
}) {
  const assetLinks = record ? [
    { label: 'IP研判结果', note: record.ip, icon: Database, target: 'result-ip' },
    ...(record.categoryId === 'relay-short-link' ? [
      { label: '网站黑样本', note: 'loan-service.example', icon: ShieldCheck, target: 'black-sample' },
      { label: '网站框架', note: '代码或结构同源时关联', icon: GitBranch, target: 'framework-website' },
    ] : []),
    { label: '协议模板', note: '按命中特征关联', icon: SquareStack, target: 'template-protocol' },
  ] : [];

  return (
    <Sheet open={record !== null} onOpenChange={(open) => !open && onClose()}>
      <SheetContent className="w-full overflow-y-auto p-0 sm:max-w-3xl">
        {record && (
          <>
            <SheetHeader className="sticky top-0 z-10 border-b border-slate-200 bg-white px-6 py-5 pr-14">
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant="outline" className="border-blue-200 bg-blue-50 text-blue-700">{record.category}</Badge>
                <Badge variant="outline" className={riskClass(record.risk)}>{record.risk}</Badge>
                <Badge variant="outline" className="border-amber-200 bg-amber-50 text-amber-700">示例记录</Badge>
              </div>
              <SheetTitle className="mt-2 text-xl font-semibold text-slate-950">{record.coreIdentifier}</SheetTitle>
              <SheetDescription>{record.id}</SheetDescription>
            </SheetHeader>

            <Tabs defaultValue="basic" className="px-6 pb-8">
              <TabsList className="my-5 h-10 w-full justify-start overflow-x-auto bg-slate-100 p-1">
                <TabsTrigger value="basic" className="shrink-0">基本信息</TabsTrigger>
                <TabsTrigger value="relations" className="shrink-0">关联关系</TabsTrigger>
                <TabsTrigger value="analysis" className="shrink-0">研判信息</TabsTrigger>
                <TabsTrigger value="assets" className="shrink-0">关联情报资产</TabsTrigger>
              </TabsList>

              <TabsContent value="basic">
                <div className="grid gap-3 sm:grid-cols-2">
                  {record.details.map((detail) => (
                    <div key={detail.label} className="rounded-xl border border-slate-200 bg-slate-50/70 p-4">
                      <p className="text-xs text-slate-400">{detail.label}</p>
                      <p className="mt-1.5 break-all text-sm font-medium text-slate-800">{detail.value}</p>
                    </div>
                  ))}
                  <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-4">
                    <p className="text-xs text-slate-400">首次发现时间</p>
                    <p className="mt-1.5 text-sm font-medium text-slate-800">{record.firstSeen}</p>
                  </div>
                  <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-4">
                    <p className="text-xs text-slate-400">最近活跃时间</p>
                    <p className="mt-1.5 text-sm font-medium text-slate-800">{record.lastActive}</p>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="relations" className="space-y-4">
                <div className="flex flex-wrap items-center justify-center gap-2 rounded-xl border border-slate-200 bg-slate-50/70 p-5">
                  <span className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs text-slate-600">关联号码／设备</span>
                  <ArrowRight className="size-4 text-slate-300" />
                  <span className="rounded-lg bg-blue-600 px-3 py-2 text-xs font-medium text-white">{record.coreIdentifier}</span>
                  <ArrowRight className="size-4 text-slate-300" />
                  <span className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs text-slate-600">IP／域名／APP</span>
                </div>
                <div className="space-y-2">
                  {record.relations.map((relation) => (
                    <div key={`${relation.type}-${relation.value}`} className="flex items-start gap-3 rounded-xl border border-slate-200 p-4">
                      <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600"><Link2 className="size-4" /></span>
                      <div className="min-w-0">
                        <p className="text-xs text-slate-400">{relation.type}</p>
                        <p className="mt-1 break-all text-sm font-medium text-slate-800">{relation.value}</p>
                        <p className="mt-1 text-xs text-slate-500">{relation.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="analysis" className="space-y-4">
                <div className="rounded-xl border border-blue-200 bg-blue-50/60 p-4">
                  <p className="text-xs font-medium text-blue-600">研判结论</p>
                  <p className="mt-2 text-sm leading-6 text-slate-700">{record.conclusion}</p>
                </div>
                <div>
                  <p className="mb-2 text-sm font-semibold text-slate-800">研判依据</p>
                  <div className="space-y-2">
                    {record.evidence.map((item) => <div key={item} className="flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2.5 text-sm text-slate-600"><ShieldCheck className="size-4 text-blue-500" />{item}</div>)}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="assets" className="space-y-3">
                {assetLinks.map((asset) => (
                  <button
                    key={asset.label}
                    type="button"
                    onClick={() => onNavigateAsset(asset.target)}
                    className="group flex w-full items-center gap-3 rounded-xl border border-slate-200 p-4 text-left transition hover:border-blue-200 hover:bg-blue-50/30"
                  >
                    <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600"><asset.icon className="size-4" /></span>
                    <span className="min-w-0 flex-1">
                      <span className="block text-sm font-medium text-slate-800">{asset.label}</span>
                      <span className="mt-1 block truncate text-xs text-slate-500">{asset.note}</span>
                    </span>
                    <ArrowRight className="size-4 text-slate-300 transition group-hover:translate-x-0.5 group-hover:text-blue-500" />
                  </button>
                ))}
              </TabsContent>
            </Tabs>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}

function RelayObjects({
  initialCategory,
  onNavigateAsset,
}: {
  initialCategory: string;
  onNavigateAsset: (id: string) => void;
}) {
  const [category, setCategory] = useState(initialCategory);
  const [risk, setRisk] = useState('all');
  const [status, setStatus] = useState('all');
  const [keyword, setKeyword] = useState('');
  const [selectedRecord, setSelectedRecord] = useState<RelayRecord | null>(null);
  const filteredRecords = useMemo(() => relayRecords.filter((record) => (
    (category === 'all' || record.categoryId === category)
    && (risk === 'all' || record.risk === risk)
    && (status === 'all' || record.status === status)
    && (!keyword || `${record.id}${record.coreIdentifier}${record.ip}${record.behavior}`.toLowerCase().includes(keyword.toLowerCase()))
  )), [category, keyword, risk, status]);

  return (
    <>
      <div className="grid items-start gap-4 xl:grid-cols-[15rem_minmax(0,1fr)]">
        <RelayCategoryFilter value={category} onChange={setCategory} />
        <div className="min-w-0 space-y-4">
          <Card className="border-0 py-0 shadow-[0_8px_32px_rgba(20,40,80,0.05)] ring-slate-200/80">
            <CardContent className="p-4 md:p-5">
              <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-[minmax(240px,1fr)_minmax(130px,.45fr)_minmax(130px,.45fr)_auto]">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
                  <Input value={keyword} onChange={(event) => setKeyword(event.target.value)} className="h-9 border-slate-200 bg-slate-50/60 pl-9" placeholder="输入对象编号、IP、号码或设备标识" />
                </div>
                <Select value={risk} onValueChange={(value) => value && setRisk(value)}>
                  <SelectTrigger className="h-9 w-full border-slate-200 bg-white px-3 text-slate-600"><SelectValue>风险等级</SelectValue></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">全部风险等级</SelectItem>
                    <SelectItem value="高风险">高风险</SelectItem>
                    <SelectItem value="中风险">中风险</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={status} onValueChange={(value) => value && setStatus(value)}>
                  <SelectTrigger className="h-9 w-full border-slate-200 bg-white px-3 text-slate-600"><SelectValue>研判状态</SelectValue></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">全部研判状态</SelectItem>
                    <SelectItem value="待研判">待研判</SelectItem>
                    <SelectItem value="研判中">研判中</SelectItem>
                    <SelectItem value="已确认">已确认</SelectItem>
                  </SelectContent>
                </Select>
                <Button type="button" variant="outline" onClick={() => { setCategory('all'); setRisk('all'); setStatus('all'); setKeyword(''); }} className="h-9 border-slate-200"><RefreshCw />重置</Button>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 py-0 shadow-[0_8px_32px_rgba(20,40,80,0.06)] ring-slate-200/80">
            <CardHeader className="border-b border-slate-100 px-5 py-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <CardTitle className="text-[15px] font-semibold text-slate-800">中继对象列表</CardTitle>
                  <CardDescription className="mt-1 text-xs">共 {filteredRecords.length} 条</CardDescription>
                </div>
                <Badge variant="outline" className="border-amber-200 bg-amber-50 text-amber-700">示例数据</Badge>
              </div>
            </CardHeader>
            <CardContent className="overflow-x-auto px-0 pb-0">
              <Table>
                <TableHeader>
                  <TableRow className="border-slate-200 bg-slate-50/80 hover:bg-slate-50/80">
                    {['对象编号', '中继类型', '核心标识', '关联IP', '关联对象', '行为摘要', '最近活跃时间', '风险等级', '研判状态', '操作'].map((column) => <TableHead key={column} className="h-11 whitespace-nowrap px-4 text-xs font-semibold text-slate-600">{column}</TableHead>)}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredRecords.map((record) => (
                    <TableRow key={record.id} className="border-slate-100 hover:bg-blue-50/30">
                      <TableCell className="whitespace-nowrap px-4 font-mono text-xs font-semibold text-blue-700">{record.id}</TableCell>
                      <TableCell className="whitespace-nowrap px-4 text-[13px] text-slate-700">{record.category}</TableCell>
                      <TableCell className="min-w-44 px-4 text-[13px] font-medium text-slate-900">{record.coreIdentifier}</TableCell>
                      <TableCell className="whitespace-nowrap px-4 text-[13px] text-slate-600">{record.ip}</TableCell>
                      <TableCell className="whitespace-nowrap px-4 text-[13px] text-slate-600">{record.relatedObjects}</TableCell>
                      <TableCell className="min-w-60 px-4 text-[13px] leading-5 text-slate-600">{record.behavior}</TableCell>
                      <TableCell className="whitespace-nowrap px-4 text-[13px] text-slate-500">{record.lastActive}</TableCell>
                      <TableCell className="whitespace-nowrap px-4"><Badge variant="outline" className={riskClass(record.risk)}>{record.risk}</Badge></TableCell>
                      <TableCell className="whitespace-nowrap px-4"><Badge variant="outline" className={statusClass(record.status)}>{record.status}</Badge></TableCell>
                      <TableCell className="whitespace-nowrap px-4"><Button type="button" variant="ghost" size="sm" onClick={() => setSelectedRecord(record)} className="text-blue-600 hover:bg-blue-50 hover:text-blue-700">查看</Button></TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <div className="flex items-center justify-between border-t border-slate-100 px-5 py-3 text-xs text-slate-500"><span>每页 10 条</span><span>共 {filteredRecords.length} 条</span></div>
            </CardContent>
          </Card>
        </div>
      </div>

      <RelayRecordDetail record={selectedRecord} onClose={() => setSelectedRecord(null)} onNavigateAsset={onNavigateAsset} />
    </>
  );
}

function RelayAnalysis() {
  const [selectedRecordId, setSelectedRecordId] = useState(relayRecords[0].id);
  const selectedRecord = relayRecords.find((record) => record.id === selectedRecordId) ?? relayRecords[0];
  const visibleRelations = relationRows.filter((relation) => relation.source === selectedRecord.coreIdentifier);

  return (
    <div className="space-y-4">
      <Card className="border-0 py-0 shadow-[0_8px_32px_rgba(20,40,80,0.05)] ring-slate-200/80">
        <CardContent className="p-4 md:p-5">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-sm font-semibold text-slate-800">关联对象</p>
              <p className="mt-1 text-xs text-slate-500">选择一个中继对象查看其IP、号码、设备、域名和时间关系。</p>
            </div>
            <Select value={selectedRecordId} onValueChange={(value) => value && setSelectedRecordId(value)}>
              <SelectTrigger className="h-9 w-full border-slate-200 bg-white px-3 text-slate-600 md:w-72"><SelectValue>{selectedRecord.coreIdentifier}</SelectValue></SelectTrigger>
              <SelectContent>{relayRecords.map((record) => <SelectItem key={record.id} value={record.id}>{record.category} · {record.coreIdentifier}</SelectItem>)}</SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card className="border-0 py-0 shadow-[0_8px_32px_rgba(20,40,80,0.06)] ring-slate-200/80">
        <CardHeader className="border-b border-slate-100 px-5 py-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <CardTitle className="text-[15px] font-semibold text-slate-800">关联关系图</CardTitle>
            <Badge variant="outline" className="border-amber-200 bg-amber-50 text-amber-700">示例数据</Badge>
          </div>
        </CardHeader>
        <CardContent className="p-5">
          <div className="grid items-center gap-4 lg:grid-cols-[1fr_auto_1.2fr_auto_1fr]">
            <div className="space-y-2">
              {selectedRecord.relations.filter((relation) => relation.type === '手机号' || relation.type === '设备' || relation.type === '账号').map((relation) => (
                <div key={`${relation.type}-${relation.value}`} className="rounded-xl border border-slate-200 bg-slate-50/70 p-4 text-center"><p className="text-xs text-slate-400">{relation.type}</p><p className="mt-1 text-sm font-medium text-slate-700">{relation.value}</p></div>
              ))}
              {selectedRecord.relations.every((relation) => relation.type !== '手机号' && relation.type !== '设备' && relation.type !== '账号') && <div className="rounded-xl border border-dashed border-slate-200 p-4 text-center text-xs text-slate-400">暂无号码或设备关系</div>}
            </div>
            <ArrowRight className="mx-auto size-5 rotate-90 text-slate-300 lg:rotate-0" />
            <div className="rounded-2xl border border-blue-200 bg-blue-600 p-5 text-center text-white shadow-[0_12px_32px_rgba(37,99,235,.2)]">
              <RadioTower className="mx-auto size-6" />
              <p className="mt-2 text-xs text-blue-100">{selectedRecord.category}</p>
              <p className="mt-1 break-all text-sm font-semibold">{selectedRecord.coreIdentifier}</p>
            </div>
            <ArrowRight className="mx-auto size-5 rotate-90 text-slate-300 lg:rotate-0" />
            <div className="space-y-2">
              {selectedRecord.relations.filter((relation) => relation.type === 'IP' || relation.type === '域名' || relation.type === 'APP').map((relation) => (
                <div key={`${relation.type}-${relation.value}`} className="rounded-xl border border-slate-200 bg-slate-50/70 p-4 text-center"><p className="text-xs text-slate-400">{relation.type}</p><p className="mt-1 break-all text-sm font-medium text-slate-700">{relation.value}</p></div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-0 py-0 shadow-[0_8px_32px_rgba(20,40,80,0.06)] ring-slate-200/80">
        <CardHeader className="border-b border-slate-100 px-5 py-4"><CardTitle className="text-[15px] font-semibold text-slate-800">关系明细</CardTitle><CardDescription className="mt-1 text-xs">共 {visibleRelations.length} 条</CardDescription></CardHeader>
        <CardContent className="overflow-x-auto px-0 pb-0">
          <Table>
            <TableHeader><TableRow className="border-slate-200 bg-slate-50/80 hover:bg-slate-50/80">{['源对象', '中继类型', '关系类型', '目标对象', '关系说明', '最近活跃时间'].map((column) => <TableHead key={column} className="h-11 whitespace-nowrap px-4 text-xs font-semibold text-slate-600">{column}</TableHead>)}</TableRow></TableHeader>
            <TableBody>{visibleRelations.map((relation) => <TableRow key={relation.id} className="border-slate-100"><TableCell className="px-4 text-[13px] font-medium text-slate-800">{relation.source}</TableCell><TableCell className="px-4 text-[13px] text-slate-600">{relation.sourceType}</TableCell><TableCell className="px-4"><Badge variant="outline">{relation.relationType}</Badge></TableCell><TableCell className="px-4 text-[13px] text-slate-700">{relation.target}</TableCell><TableCell className="px-4 text-[13px] text-slate-600">{relation.description}</TableCell><TableCell className="whitespace-nowrap px-4 text-[13px] text-slate-500">{relation.lastActive}</TableCell></TableRow>)}</TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

export function RelayScenePage({
  pageId,
  initialCategory,
  onOpenCategory,
  onNavigateAsset,
}: {
  pageId: RelayScenePageId;
  initialCategory: string;
  onOpenCategory: (categoryId: string) => void;
  onNavigateAsset: (id: string) => void;
}) {
  if (pageId === 'scene-relay-overview') {
    return <RelayOverview onOpenCategory={onOpenCategory} />;
  }
  if (pageId === 'scene-relay-objects') {
    return <RelayObjects key={initialCategory} initialCategory={initialCategory} onNavigateAsset={onNavigateAsset} />;
  }
  return <RelayAnalysis />;
}
