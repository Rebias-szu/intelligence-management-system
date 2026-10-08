'use client';

import { useState } from 'react';
import {
  Braces,
  ChevronDown,
  CircleCheckBig,
  Plus,
  RefreshCw,
  Search,
} from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
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

export const rulePageIds = ['rule-website', 'rule-app', 'rule-protocol'] as const;
export type RulePageId = (typeof rulePageIds)[number];

type DetailItem = {
  label: string;
  value: string;
  wide?: boolean;
  code?: boolean;
};

type RuleRecord = {
  fullCode: string;
  name: string;
  category: string;
  source: string;
  template: string;
  summary: string;
  status: string;
  updatedAt: string;
  sections: Array<{
    title: string;
    icon: typeof Braces;
    items: DetailItem[];
  }>;
};

type RulePage = {
  title: string;
  description: string;
  count: string;
  effectiveCount: string;
  filters: string[];
  searchPlaceholder: string;
  records: RuleRecord[];
};

function buildSections(input: {
  fullCode: string;
  name: string;
  category: string;
  objectType: string;
  source: string;
  template: string;
  featureType: string;
  ruleContent: string;
  summary: string;
  externalCode: string;
  status?: string;
}) {
  return [
    {
      title: '基本信息',
      icon: CircleCheckBig,
      items: [
        { label: '规则全码', value: input.fullCode, code: true },
        { label: '规则名称', value: input.name },
        { label: '诈骗分类', value: input.category },
        { label: '适用对象', value: input.objectType },
        { label: '特征来源', value: input.source },
        { label: '所属模板', value: input.template },
        { label: '规则状态', value: input.status ?? '有效' },
        { label: '更新时间', value: '2026-09-09' },
      ],
    },
    {
      title: '规则定义',
      icon: Braces,
      items: [
        { label: '特征类型', value: input.featureType },
        { label: '规则摘要', value: input.summary, wide: true },
        { label: '对应四位码', value: input.externalCode || '待确认', code: true },
        { label: '规则内容', value: input.ruleContent || '—', wide: true, code: true },
      ],
    },
  ];
}

function makeRecord(input: {
  fullCode: string;
  name: string;
  category: string;
  objectType: string;
  source: string;
  template: string;
  featureType: string;
  ruleContent: string;
  summary: string;
  externalCode: string;
  status?: string;
}): RuleRecord {
  return {
    fullCode: input.fullCode,
    name: input.name,
    category: input.category,
    source: input.source,
    template: input.template,
    summary: input.summary,
    status: input.status ?? '有效',
    updatedAt: '2026-09-09',
    sections: buildSections(input),
  };
}

const rulePages: Record<RulePageId, RulePage> = {
  'rule-website': {
    title: '网站规则',
    description: '管理从网页内容、图标、源码和URL等网站特征中提取的最小颗粒度识别规则。',
    count: '70',
    effectiveCount: '69',
    searchPlaceholder: '输入规则全码、规则名称或规则内容',
    filters: ['诈骗大类/小类', '特征来源', '所属模板', '规则状态'],
    records: [
      makeRecord({
        fullCode: 'AA101A0001',
        name: '虚假贷款网站图标特征',
        category: '贷款、代办信用卡类 / 虚假贷款',
        objectType: '网站',
        source: '网页 / 图标MD5',
        template: '图标模板',
        featureType: '图标哈希',
        ruleContent: 'str_in_liststr(iconMd5,"a720c6e14da106ccce6255f6f13672f1")',
        summary: 'iconMd5 命中特征值 a720…72f1',
        externalCode: '2087',
      }),
      makeRecord({
        fullCode: 'AA101B0001',
        name: '虚假贷款网页内容组合特征',
        category: '贷款、代办信用卡类 / 虚假贷款',
        objectType: '网站',
        source: '网页正文',
        template: '网站内容模板',
        featureType: '关键词组合',
        ruleContent: "keywords_contains(bodyText, '成功借', 15) && bodyText =~ /(.*)申请金额(.*)/",
        summary: '正文包含“成功借”并匹配“申请金额”',
        externalCode: '2087',
      }),
    ],
  },
  'rule-app': {
    title: 'APP规则',
    description: '管理从APP名称、安装包源码、组件、SO引用和框架特征中提取的最小识别规则。',
    count: '13',
    effectiveCount: '13',
    searchPlaceholder: '输入规则全码、APP特征或规则名称',
    filters: ['诈骗大类/小类', '特征来源', '所属模板', '规则状态'],
    records: [
      makeRecord({
        fullCode: 'AL775L0001',
        name: '仿冒虚拟货币钱包APP名称特征',
        category: '其他类型诈骗 / 其他-仿冒虚拟货币钱包',
        objectType: 'APP',
        source: 'APK / APP名称',
        template: 'APP名称模板',
        featureType: '名称正则',
        ruleContent: 'appName=~/^MetaTrader(.*)/',
        summary: 'APP名称以 MetaTrader 开头',
        externalCode: '1053',
      }),
      makeRecord({
        fullCode: 'AL785N0001',
        name: 'NFC盗刷APP组件特征',
        category: '其他类型诈骗 / 其他-NFC盗刷',
        objectType: 'APP',
        source: 'APK / 组件清单',
        template: '组件模板',
        featureType: '组件组合',
        ruleContent: "content_include(components,'nfc.share.nfcshare.%,android.hardware.nfc,android.permission.NFC')",
        summary: '组件清单同时包含NFC共享组件和权限',
        externalCode: '1060',
      }),
    ],
  },
  'rule-protocol': {
    title: '协议规则',
    description: '管理从URL片段、Payload、网络流量和协议解析结果中提取的最小识别规则。',
    count: '7',
    effectiveCount: '7',
    searchPlaceholder: '输入规则全码、URL片段或协议特征',
    filters: ['诈骗大类/小类', '特征来源', '所属模板', '规则状态'],
    records: [
      makeRecord({
        fullCode: 'AB103H0001',
        name: '客服聊天插件Payload特征',
        category: '刷单返利类 / 刷单返利类',
        objectType: '协议',
        source: '协议解析 / Payload',
        template: 'Payload正则',
        featureType: 'Payload正则',
        ruleContent: 'pkt.dstport==3000 && pkt.payload 匹配指定字节序列',
        summary: '目标端口3000且Payload匹配指定字节序列',
        externalCode: '—',
      }),
      makeRecord({
        fullCode: 'AB102G0001',
        name: '刷单购物用户状态接口特征',
        category: '刷单返利类 / 刷单返利类',
        objectType: '协议',
        source: '协议解析 / URL',
        template: 'URL片段模板',
        featureType: 'URL片段',
        ruleContent: '/index.php/Wap/Api/checkUserStatus',
        summary: 'URL包含用户状态检查接口路径',
        externalCode: '—',
      }),
    ],
  },
};

export function isRulePageId(value: string): value is RulePageId {
  return rulePageIds.includes(value as RulePageId);
}

function ruleStatusClass(value: string) {
  if (value === '有效' || value === '通过' || value === '活跃') {
    return 'border-emerald-200 bg-emerald-50 text-emerald-700';
  }
  if (/未知|待|未评估/.test(value)) {
    return 'border-amber-200 bg-amber-50 text-amber-700';
  }
  return 'border-slate-200 bg-slate-50 text-slate-600';
}

function DetailValue({ item }: { item: DetailItem }) {
  return (
    <div className={item.wide ? 'md:col-span-2' : ''}>
      <p className="text-xs text-slate-400">{item.label}</p>
      <div className={`mt-1.5 min-h-9 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm leading-5 text-slate-700 ${item.code ? 'break-all font-mono text-xs' : ''}`}>
        {item.value}
      </div>
    </div>
  );
}

export function RuleLibraryPage({ pageId }: { pageId: RulePageId }) {
  const page = rulePages[pageId];
  const [selectedRule, setSelectedRule] = useState<RuleRecord | null>(null);

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="mb-2 text-xs font-semibold tracking-[0.12em] text-blue-600">规则库</p>
          <h1 className="text-2xl font-semibold tracking-tight text-slate-950">{page.title}</h1>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-500">{page.description}</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="outline" className="w-fit border-blue-200 bg-blue-50 px-3 py-1 text-blue-700">字段设计Demo</Badge>
          <Button type="button" className="bg-blue-600 hover:bg-blue-700"><Plus />新建规则</Button>
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <Card className="border-0 py-0 ring-slate-200/80">
          <CardContent className="p-4">
            <p className="text-xs text-slate-500">规则数量</p>
            <p className="mt-1 text-xl font-semibold text-slate-900">{page.count}</p>
          </CardContent>
        </Card>
        <Card className="border-0 py-0 ring-slate-200/80">
          <CardContent className="p-4">
            <p className="text-xs text-slate-500">有效规则</p>
            <p className="mt-1 text-xl font-semibold text-emerald-700">{page.effectiveCount}</p>
          </CardContent>
        </Card>
      </div>

      <Card className="border-0 py-0 shadow-[0_8px_32px_rgba(20,40,80,0.05)] ring-slate-200/80">
        <CardContent className="p-4 md:p-5">
          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4 2xl:grid-cols-[minmax(260px,1.3fr)_repeat(6,minmax(130px,.65fr))_auto_auto]">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
              <Input className="h-9 border-slate-200 bg-slate-50/60 pl-9" placeholder={page.searchPlaceholder} />
            </div>
            {page.filters.map((filter) => (
              <button key={filter} type="button" className="flex h-9 items-center justify-between rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-500 transition hover:border-blue-200 hover:bg-blue-50/30">
                <span className="truncate">{filter}</span>
                <ChevronDown className="size-4 shrink-0 text-slate-400" />
              </button>
            ))}
            <Button className="h-9 bg-blue-600 px-5 hover:bg-blue-700"><Search />查询</Button>
            <Button variant="outline" className="h-9 border-slate-200"><RefreshCw />重置</Button>
          </div>
        </CardContent>
      </Card>

      <Card className="border-0 py-0 shadow-[0_8px_32px_rgba(20,40,80,0.06)] ring-slate-200/80">
        <CardHeader className="border-b border-slate-100 px-5 py-4">
          <CardTitle className="text-[15px] font-semibold text-slate-800">规则列表</CardTitle>
          <CardDescription className="mt-1 text-xs">共 {page.count} 条 · 当前展示2条规则示例</CardDescription>
        </CardHeader>
        <CardContent className="px-0 pb-0">
          <Table>
            <TableHeader>
              <TableRow className="border-slate-200 bg-slate-50/80 hover:bg-slate-50/80">
                {['规则全码', '规则名称', '诈骗分类', '特征来源', '所属模板', '规则状态', '更新时间'].map((column) => (
                  <TableHead key={column} className="h-11 whitespace-nowrap px-4 text-xs font-semibold text-slate-600">{column}</TableHead>
                ))}
                <TableHead className="sticky right-0 h-11 bg-slate-50 px-4 text-xs font-semibold text-slate-600">操作</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {page.records.map((rule) => (
                <TableRow key={rule.fullCode} className="border-slate-100 hover:bg-blue-50/30">
                  <TableCell className="h-16 whitespace-nowrap px-4 font-mono text-xs font-semibold text-blue-700">{rule.fullCode}</TableCell>
                  <TableCell className="min-w-48 px-4 text-[13px] font-medium text-slate-900">{rule.name}</TableCell>
                  <TableCell className="min-w-56 px-4 text-[13px] text-slate-600">{rule.category}</TableCell>
                  <TableCell className="whitespace-nowrap px-4 text-[13px] text-slate-600">{rule.source}</TableCell>
                  <TableCell className="whitespace-nowrap px-4 text-[13px] text-slate-600">{rule.template}</TableCell>
                  <TableCell className="whitespace-nowrap px-4"><Badge variant="outline" className={ruleStatusClass(rule.status)}>{rule.status}</Badge></TableCell>
                  <TableCell className="whitespace-nowrap px-4 text-[13px] text-slate-500">{rule.updatedAt}</TableCell>
                  <TableCell className="sticky right-0 bg-white px-4 group-hover:bg-blue-50/30">
                    <Button variant="ghost" size="sm" onClick={() => setSelectedRule(rule)} className="text-blue-600 hover:bg-blue-50 hover:text-blue-700">查看</Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <div className="flex items-center justify-between border-t border-slate-100 px-5 py-3 text-xs text-slate-500">
            <span>每页 10 条</span>
            <div className="flex items-center gap-1">
              <Button variant="outline" size="xs" disabled>上一页</Button>
              <Button size="xs" className="bg-blue-600">1</Button>
              <Button variant="outline" size="xs" disabled>下一页</Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Sheet open={selectedRule !== null} onOpenChange={(open) => !open && setSelectedRule(null)}>
        <SheetContent className="w-full overflow-y-auto p-0 sm:max-w-2xl">
          {selectedRule && (
            <>
              <SheetHeader className="sticky top-0 z-10 border-b border-slate-200 bg-white px-6 py-5 pr-14">
                <div className="flex flex-wrap items-center gap-2">
                  <Badge variant="outline" className="border-blue-200 bg-blue-50 font-mono text-blue-700">{selectedRule.fullCode}</Badge>
                  <Badge variant="outline" className={ruleStatusClass(selectedRule.status)}>{selectedRule.status}</Badge>
                </div>
                <SheetTitle className="mt-3 text-xl font-semibold text-slate-900">{selectedRule.name}</SheetTitle>
                <SheetDescription className="mt-1">展示规则的基本信息和规则内容。</SheetDescription>
              </SheetHeader>
              <div className="space-y-6 px-6 py-5">
                {selectedRule.sections.map((section) => (
                  <section key={section.title}>
                    <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-slate-800">
                      <span className="flex size-8 items-center justify-center rounded-lg bg-blue-50 text-blue-600"><section.icon className="size-4" /></span>
                      {section.title}
                    </div>
                    <div className="grid gap-3 md:grid-cols-2">
                      {section.items.map((item) => <DetailValue key={`${section.title}-${item.label}`} item={item} />)}
                    </div>
                  </section>
                ))}
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}
