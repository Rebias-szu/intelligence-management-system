'use client';

import { useState } from 'react';
import {
  Braces,
  ChevronDown,
  CircleCheckBig,
  Code2,
  Plus,
  RefreshCw,
  Search,
} from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { SceneCategoryDirectory } from '@/components/scene-category-directory';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  businessSceneCategories,
  getSceneCategoryLabel,
  type BusinessSceneId,
} from '@/lib/business-scenes';
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

export const templatePageIds = ['template-relay', 'template-drainage', 'template-fraud', 'template-fund'] as const;
export type TemplatePageId = (typeof templatePageIds)[number];
type LegacyTemplatePageId = 'template-website' | 'template-app' | 'template-protocol';

type TemplateRule = {
  alias: string;
  fullCode: string;
  name: string;
  source: string;
  featureType: string;
  status: '有效' | '停用';
  summary: string;
  content: string;
};

type TemplateRecord = {
  code: string;
  name: string;
  objectType: string;
  category: string;
  description: string;
  status: '启用' | '停用';
  updatedAt: string;
  combinationType: string;
  expression: string;
  combinationDescription: string;
  rules: TemplateRule[];
};

type TemplatePage = {
  title: string;
  description: string;
  count: string;
  enabledCount: string;
  searchPlaceholder: string;
  records: TemplateRecord[];
};

const templatePages: Record<LegacyTemplatePageId, TemplatePage> = {
  'template-website': {
    title: '网站模板',
    description: '将网站图标、网页内容和URL等原子规则组合为可复用的网站识别模板。',
    count: '61',
    enabledCount: '60',
    searchPlaceholder: '输入模板编码或模板名称',
    records: [
      {
        code: 'AA101A',
        name: '虚假贷款网页图标模板',
        objectType: '网站',
        category: '贷款、代办信用卡类 / 虚假贷款',
        description: '归集虚假贷款网页图标特征规则，用于识别命中特征图标的网站。',
        status: '启用',
        updatedAt: '2026-09-09',
        combinationType: '单规则命中',
        expression: 'A',
        combinationDescription: '图标MD5规则命中，则模板命中。',
        rules: [
          { alias: 'A', fullCode: 'AA101A0001', name: '虚假贷款—图标MD5特征', source: '网页图标', featureType: '图标哈希', status: '有效', summary: '网站图标MD5命中指定虚假贷款特征值。', content: 'str_in_liststr(iconMd5,"a720c6e14da106ccce6255f6f13672f1")' },
        ],
      },
      {
        code: 'AA101B',
        name: '虚假贷款网站内容模板',
        objectType: '网站',
        category: '贷款、代办信用卡类 / 虚假贷款',
        description: '归集虚假贷款网页正文和标题特征规则，用于识别具有相关内容特征的网站。',
        status: '启用',
        updatedAt: '2026-09-08',
        combinationType: '任一规则命中',
        expression: 'A || B || C',
        combinationDescription: '三条网站内容规则中任意一条命中，则模板命中。',
        rules: [
          { alias: 'A', fullCode: 'AA101B0001', name: '虚假贷款—成功借与申请金额组合特征', source: '网页正文', featureType: '关键词组合', status: '有效', summary: '正文包含“成功借”并匹配“申请金额”。', content: "keywords_contains(bodyText, '成功借', 15) && bodyText =~ /(.*)申请金额(.*)/" },
          { alias: 'B', fullCode: 'AA101B0002', name: '虚假贷款—APP下载页面内容特征', source: '网页正文', featureType: '标题与正文组合', status: '有效', summary: '页面标题出现APP下载，且正文命中渡小满下载文案。', content: 'title =~ /(.*)APP下载(.*)/ && extract_cn_content(bodyText) =~ /(.*)渡小满版本更新时间下载适用于安卓手机扫码二维码下载(.*)/' },
          { alias: 'C', fullCode: 'AA101B0003', name: '虚假贷款—随行贷标题特征', source: '网页标题', featureType: '标题匹配', status: '有效', summary: '网站标题与“随行贷消费金融”完全匹配。', content: "title == '随行贷消费金融'" },
        ],
      },
    ],
  },
  'template-app': {
    title: 'APP模板',
    description: '将APP名称、安装包组件和签名等原子规则组合为可复用的APP识别模板。',
    count: '13',
    enabledCount: '13',
    searchPlaceholder: '输入模板编码或APP模板名称',
    records: [
      {
        code: 'AL775L',
        name: '仿冒虚拟货币钱包APP名称模板',
        objectType: 'APP',
        category: '其他类型诈骗 / 仿冒虚拟货币钱包',
        description: '归集仿冒虚拟货币钱包的APP名称特征规则。',
        status: '启用',
        updatedAt: '2026-09-09',
        combinationType: '单规则命中',
        expression: 'A',
        combinationDescription: 'APP名称规则命中，则模板命中。',
        rules: [
          { alias: 'A', fullCode: 'AL775L0001', name: '虚拟货币钱包—APP名称特征', source: 'APP名称', featureType: '名称正则', status: '有效', summary: 'APP名称以MetaTrader开头。', content: 'appName =~ /^MetaTrader(.*)/' },
        ],
      },
      {
        code: 'AL785N',
        name: 'NFC盗刷APP组件模板',
        objectType: 'APP',
        category: '其他类型诈骗 / NFC盗刷',
        description: '归集NFC盗刷APP的组件及权限组合特征规则。',
        status: '启用',
        updatedAt: '2026-09-07',
        combinationType: '单规则命中',
        expression: 'A',
        combinationDescription: '组件清单规则命中，则模板命中。',
        rules: [
          { alias: 'A', fullCode: 'AL785N0001', name: 'NFC盗刷—组件特征', source: '组件清单', featureType: '组件匹配', status: '有效', summary: '组件清单同时包含NFC共享组件、硬件声明和NFC权限。', content: "content_include(components,'nfc.share.nfcshare.%,android.hardware.nfc,android.permission.NFC')" },
        ],
      },
    ],
  },
  'template-protocol': {
    title: '协议模板',
    description: '将URL、Payload和端口等协议规则组合为可复用的协议识别模板。',
    count: '7',
    enabledCount: '7',
    searchPlaceholder: '输入模板编码或协议模板名称',
    records: [
      {
        code: 'AB103H',
        name: '刷单返利Payload正则模板',
        objectType: '协议',
        category: '刷单返利类 / 刷单返利类',
        description: '归集刷单返利场景的协议Payload正则特征规则。',
        status: '启用',
        updatedAt: '2026-09-09',
        combinationType: '单规则命中',
        expression: 'A',
        combinationDescription: '目标端口与Payload字节序列组合规则命中，则模板命中。',
        rules: [
          { alias: 'A', fullCode: 'AB103H0001', name: '刷单返利—端口与Payload组合特征', source: '协议解析', featureType: 'Payload正则', status: '有效', summary: '目标端口为3000且Payload命中指定字节序列。', content: 'pkt.dstport == 3000 && pkt.payload =~ "^\\x09\\x01\\x03[\\x00-\\xff]{2}\\x00[\\x00-\\xff]{2}\\x00\\x00\\x00"' },
        ],
      },
      {
        code: 'AB102G',
        name: '刷单返利URL片段模板',
        objectType: '协议',
        category: '刷单返利类 / 刷单购物',
        description: '归集刷单返利场景的协议URL片段特征规则。',
        status: '启用',
        updatedAt: '2026-09-06',
        combinationType: '单规则命中',
        expression: 'A',
        combinationDescription: 'URL接口路径规则命中，则模板命中。',
        rules: [
          { alias: 'A', fullCode: 'AB102G0001', name: '刷单购物—URL接口特征', source: '协议URL', featureType: 'URL片段', status: '有效', summary: 'URL命中用户状态检查接口路径。', content: '/index.php/Wap/Api/checkUserStatus' },
        ],
      },
    ],
  },
};

const allTemplateRecords = Object.values(templatePages).flatMap((page) => page.records);

type TemplateScenePage = {
  sceneId: Exclude<BusinessSceneId, 'overseas-ip'>;
  title: string;
  description: string;
  objectTypes: string[];
  records: TemplateRecord[];
  templateCount: string;
  enabledCount: string;
  ruleCount: string;
};

const templateScenePages: Record<TemplatePageId, TemplateScenePage> = {
  'template-relay': {
    sceneId: 'relay',
    title: '中继载体模板',
    description: '管理VOIP、GOIP、猫池、短链集群和物联网卡相关识别模板，规则在模板内维护。',
    objectTypes: ['全部', '网站', 'APP', '协议'],
    records: [],
    templateCount: '—',
    enabledCount: '—',
    ruleCount: '—',
  },
  'template-drainage': {
    sceneId: 'drainage',
    title: '引流载体模板',
    description: '管理卡片、短视频、社交和印刷等引流方式相关识别模板，规则在模板内维护。',
    objectTypes: ['全部', '网站', 'APP', '协议'],
    records: [],
    templateCount: '—',
    enabledCount: '—',
    ruleCount: '—',
  },
  'template-fraud': {
    sceneId: 'fraud',
    title: '涉诈载体模板',
    description: '按照12+2诈骗类型组织网站、APP和协议模板，规则作为最小识别特征嵌入模板详情。',
    objectTypes: ['全部', '网站', 'APP', '协议'],
    records: allTemplateRecords,
    templateCount: '81',
    enabledCount: '80',
    ruleCount: '486',
  },
  'template-fund': {
    sceneId: 'fund',
    title: '资金载体模板',
    description: '管理二方、三方、四方聚合、跑分和虚拟币相关识别模板，规则在模板内维护。',
    objectTypes: ['全部', '网站', 'APP', '协议'],
    records: [],
    templateCount: '—',
    enabledCount: '—',
    ruleCount: '—',
  },
};

export function isTemplatePageId(value: string): value is TemplatePageId {
  return templatePageIds.includes(value as TemplatePageId);
}

export function getTemplatePageStats(pageId: TemplatePageId) {
  const records = templateScenePages[pageId].records;
  return {
    templateCount: records.length,
    ruleCount: records.reduce((total, template) => total + template.rules.length, 0),
  };
}

function statusClass(value: string) {
  if (value === '启用' || value === '有效') {
    return 'border-emerald-200 bg-emerald-50 text-emerald-700';
  }
  return 'border-slate-200 bg-slate-50 text-slate-600';
}

function DetailField({ label, value, code = false, wide = false }: { label: string; value: string; code?: boolean; wide?: boolean }) {
  return (
    <div className={wide ? 'md:col-span-2' : ''}>
      <p className="text-xs text-slate-400">{label}</p>
      <div className={`mt-1.5 min-h-9 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm leading-5 text-slate-700 ${code ? 'break-all font-mono text-xs' : ''}`}>
        {value}
      </div>
    </div>
  );
}

export function TemplateLibraryPage({
  pageId,
  embedded = false,
  initialObjectType = '全部',
  title,
  onObjectTypeChange,
}: {
  pageId: TemplatePageId;
  embedded?: boolean;
  initialObjectType?: string;
  title?: string;
  onObjectTypeChange?: (objectType: string) => void;
}) {
  const page = templateScenePages[pageId];
  const displayTitle = title ?? page.title;
  const [selectedTemplate, setSelectedTemplate] = useState<TemplateRecord | null>(null);
  const [selectedRule, setSelectedRule] = useState<{ rule: TemplateRule; template: TemplateRecord } | null>(null);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedObjectType, setSelectedObjectType] = useState(initialObjectType);
  const objectTypeOptions = initialObjectType === '全部' ? page.objectTypes : page.objectTypes.filter((objectType) => objectType !== '全部');

  const categories = businessSceneCategories[page.sceneId];
  const selectedRoot = categories.find((item) => item.id === selectedCategory || item.children.some((child) => child.id === selectedCategory));
  const selectedChild = selectedRoot?.children.find((item) => item.id === selectedCategory);
  const categoryRecords = selectedCategory === 'all'
    ? page.records
    : page.records.filter((template) => pageId === 'template-fraud'
      ? template.code.startsWith(selectedCategory)
      : template.category.includes(selectedChild?.label ?? selectedRoot?.label ?? ''));
  const filteredRecords = selectedObjectType === '全部'
    ? categoryRecords
    : categoryRecords.filter((template) => template.objectType === selectedObjectType);

  return (
    <div className="space-y-4">
      {!embedded && (
        <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
          <h1 className="text-2xl font-semibold tracking-tight text-slate-950">{displayTitle}</h1>
          <Button type="button" className="w-fit bg-blue-600 hover:bg-blue-700"><Plus />新建模板</Button>
        </div>
      )}

      {!embedded && (
        <div className="grid gap-3 sm:grid-cols-3">
          <Card className="border-0 py-0 ring-slate-200/80">
            <CardContent className="p-4">
              <p className="text-xs text-slate-500">模板数量</p>
              <p className="mt-1 text-xl font-semibold text-slate-900">{page.templateCount}</p>
            </CardContent>
          </Card>
          <Card className="border-0 py-0 ring-slate-200/80">
            <CardContent className="p-4">
              <p className="text-xs text-slate-500">启用模板</p>
              <p className="mt-1 text-xl font-semibold text-emerald-700">{page.enabledCount}</p>
            </CardContent>
          </Card>
          <Card className="border-0 py-0 ring-slate-200/80">
            <CardContent className="p-4">
              <p className="text-xs text-slate-500">内嵌规则</p>
              <p className="mt-1 text-xl font-semibold text-indigo-700">{page.ruleCount}</p>
            </CardContent>
          </Card>
        </div>
      )}

      <div className="grid items-start gap-4 xl:grid-cols-[17rem_minmax(0,1fr)]">
        <SceneCategoryDirectory sceneId={page.sceneId} value={selectedCategory} onValueChange={setSelectedCategory} />

        <div className="min-w-0 space-y-4">
          <Card className="border-0 py-0 shadow-[0_8px_32px_rgba(20,40,80,0.05)] ring-slate-200/80">
            <CardContent className="p-4 md:p-5">
              <p className="mb-4 text-sm font-semibold text-slate-800">{getSceneCategoryLabel(page.sceneId, selectedCategory)} / {selectedObjectType === '全部' ? '全部模板' : `${selectedObjectType}模板`}</p>
              <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-[minmax(240px,1fr)_minmax(140px,.55fr)_minmax(140px,.55fr)_auto_auto]">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
                  <Input className="h-9 border-slate-200 bg-slate-50/60 pl-9" placeholder={`输入${displayTitle.replace('模板', '')}分类、模板编码或名称`} />
                </div>
                <Select value={selectedObjectType} onValueChange={(value) => {
                  if (!value) return;
                  setSelectedObjectType(value);
                  onObjectTypeChange?.(value);
                }}>
                  <SelectTrigger className="h-9 w-full border-slate-200 bg-white px-3 text-slate-600">
                    <SelectValue>{selectedObjectType === '全部' ? '全部模板' : `${selectedObjectType}模板`}</SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    {objectTypeOptions.map((objectType) => (
                      <SelectItem key={objectType} value={objectType}>{objectType === '全部' ? '全部模板' : `${objectType}模板`}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <button type="button" className="flex h-9 items-center justify-between rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-500 transition hover:border-blue-200 hover:bg-blue-50/30">
                  <span>模板状态</span><ChevronDown className="size-4 text-slate-400" />
                </button>
                <Button type="button" className="h-9 bg-blue-600 px-5 hover:bg-blue-700"><Search />查询</Button>
                <Button type="button" variant="outline" onClick={() => { setSelectedCategory('all'); setSelectedObjectType(initialObjectType); }} className="h-9 border-slate-200"><RefreshCw />重置</Button>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 py-0 shadow-[0_8px_32px_rgba(20,40,80,0.06)] ring-slate-200/80">
            <CardHeader className="border-b border-slate-100 px-5 py-4">
              <CardTitle className="text-[15px] font-semibold text-slate-800">模板列表</CardTitle>
              <CardDescription className="mt-1 text-xs">{selectedObjectType === '全部' ? '全部模板' : `${selectedObjectType}模板`} · 共 {filteredRecords.length} 条</CardDescription>
            </CardHeader>
            <CardContent className="px-0 pb-0">
              <Table>
                <TableHeader>
                  <TableRow className="border-slate-200 bg-slate-50/80 hover:bg-slate-50/80">
                    {['模板编码', '模板名称', '适用对象', '业务分类', '规则数量', '模板状态', '更新时间'].map((column) => (
                      <TableHead key={column} className="h-11 whitespace-nowrap px-4 text-xs font-semibold text-slate-600">{column}</TableHead>
                    ))}
                    <TableHead className="sticky right-0 h-11 bg-slate-50 px-4 text-xs font-semibold text-slate-600">操作</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredRecords.length > 0 ? filteredRecords.map((template) => (
                    <TableRow key={template.code} className="border-slate-100 hover:bg-blue-50/30">
                      <TableCell className="h-16 whitespace-nowrap px-4 font-mono text-xs font-semibold text-blue-700">{template.code}</TableCell>
                      <TableCell className="min-w-56 px-4 text-[13px] font-medium text-slate-900">{template.name}</TableCell>
                      <TableCell className="whitespace-nowrap px-4 text-[13px] text-slate-600">{template.objectType}</TableCell>
                      <TableCell className="min-w-56 px-4 text-[13px] text-slate-600">{template.category}</TableCell>
                      <TableCell className="whitespace-nowrap px-4 text-[13px] text-slate-600">{template.rules.length}</TableCell>
                      <TableCell className="whitespace-nowrap px-4"><Badge variant="outline" className={statusClass(template.status)}>{template.status}</Badge></TableCell>
                      <TableCell className="whitespace-nowrap px-4 text-[13px] text-slate-500">{template.updatedAt}</TableCell>
                      <TableCell className="sticky right-0 bg-white px-4">
                        <Button type="button" variant="ghost" size="sm" onClick={() => setSelectedTemplate(template)} className="text-blue-600 hover:bg-blue-50 hover:text-blue-700">查看</Button>
                      </TableCell>
                    </TableRow>
                  )) : (
                    <TableRow>
                      <TableCell colSpan={8} className="h-36 text-center text-sm text-slate-400">暂无数据</TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
              <div className="flex items-center justify-between border-t border-slate-100 px-5 py-3 text-xs text-slate-500">
                <span>共 {filteredRecords.length} 条</span>
                <div className="flex items-center gap-1">
                  <Button variant="outline" size="xs" disabled>上一页</Button>
                  <Button size="xs" className="bg-blue-600">1</Button>
                  <Button variant="outline" size="xs" disabled>下一页</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <Sheet open={selectedTemplate !== null} onOpenChange={(open) => !open && setSelectedTemplate(null)}>
        <SheetContent className="w-full overflow-y-auto p-0 sm:max-w-4xl">
          {selectedTemplate && (
            <>
              <SheetHeader className="sticky top-0 z-10 border-b border-slate-200 bg-white px-6 py-5 pr-14">
                <div className="flex flex-wrap items-center gap-2">
                  <Badge variant="outline" className="border-blue-200 bg-blue-50 font-mono text-blue-700">{selectedTemplate.code}</Badge>
                  <Badge variant="outline" className={statusClass(selectedTemplate.status)}>{selectedTemplate.status}</Badge>
                </div>
                <SheetTitle className="mt-3 text-xl font-semibold text-slate-900">{selectedTemplate.name}</SheetTitle>
                <SheetDescription className="mt-1">展示模板基本信息、引用规则以及规则组合表达式。</SheetDescription>
              </SheetHeader>

              <div className="space-y-7 px-6 py-5">
                <section>
                  <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-slate-800">
                    <span className="flex size-8 items-center justify-center rounded-lg bg-blue-50 text-blue-600"><CircleCheckBig className="size-4" /></span>
                    基本信息
                  </div>
                  <div className="grid gap-3 md:grid-cols-2">
                    <DetailField label="模板编码" value={selectedTemplate.code} code />
                    <DetailField label="模板名称" value={selectedTemplate.name} />
                    <DetailField label="适用对象" value={selectedTemplate.objectType} />
                    <DetailField label="业务分类" value={selectedTemplate.category} />
                    <DetailField label="模板状态" value={selectedTemplate.status} />
                    <DetailField label="更新时间" value={selectedTemplate.updatedAt} />
                    <DetailField label="模板说明" value={selectedTemplate.description} wide />
                  </div>
                </section>

                <section>
                  <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-slate-800">
                    <span className="flex size-8 items-center justify-center rounded-lg bg-blue-50 text-blue-600"><Braces className="size-4" /></span>
                    规则组成
                  </div>
                  <div className="overflow-hidden rounded-xl border border-slate-200">
                    <Table>
                      <TableHeader>
                        <TableRow className="bg-slate-50 hover:bg-slate-50">
                          {['标识', '规则全码', '规则名称', '特征来源', '特征类型', '状态'].map((column) => (
                            <TableHead key={column} className="h-10 whitespace-nowrap px-3 text-xs font-semibold text-slate-600">{column}</TableHead>
                          ))}
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {selectedTemplate.rules.map((rule) => (
                          <TableRow key={rule.fullCode} className="border-slate-100">
                            <TableCell className="px-3"><Badge variant="outline" className="border-violet-200 bg-violet-50 font-mono text-violet-700">{rule.alias}</Badge></TableCell>
                            <TableCell className="whitespace-nowrap px-3">
                              <Button
                                type="button"
                                variant="link"
                                onClick={() => setSelectedRule({ rule, template: selectedTemplate })}
                                className="h-auto p-0 font-mono text-xs font-semibold text-blue-700 underline-offset-4 hover:text-blue-800 hover:underline"
                              >
                                {rule.fullCode}
                              </Button>
                            </TableCell>
                            <TableCell className="min-w-48 px-3 text-[13px] font-medium text-slate-800">{rule.name}</TableCell>
                            <TableCell className="whitespace-nowrap px-3 text-[13px] text-slate-600">{rule.source}</TableCell>
                            <TableCell className="whitespace-nowrap px-3 text-[13px] text-slate-600">{rule.featureType}</TableCell>
                            <TableCell className="px-3"><Badge variant="outline" className={statusClass(rule.status)}>{rule.status}</Badge></TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </section>

                <section>
                  <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-slate-800">
                    <span className="flex size-8 items-center justify-center rounded-lg bg-blue-50 text-blue-600"><Code2 className="size-4" /></span>
                    规则组合逻辑
                  </div>
                  <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                    <div className="grid gap-4 md:grid-cols-[180px_1fr]">
                      <div>
                        <p className="text-xs text-slate-400">组合类型</p>
                        <p className="mt-2 text-sm font-medium text-slate-800">{selectedTemplate.combinationType}</p>
                      </div>
                      <div>
                        <p className="text-xs text-slate-400">技术表达式</p>
                        <code className="mt-2 block overflow-x-auto rounded-lg bg-slate-950 px-4 py-3 font-mono text-sm font-semibold text-cyan-300">{selectedTemplate.expression}</code>
                      </div>
                    </div>
                    <div className="mt-4 border-t border-slate-200 pt-4">
                      <p className="text-xs text-slate-400">组合说明</p>
                      <p className="mt-2 text-sm leading-6 text-slate-700">{selectedTemplate.combinationDescription}</p>
                    </div>
                  </div>
                </section>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>

      <Dialog open={selectedRule !== null} onOpenChange={(open) => !open && setSelectedRule(null)}>
        <DialogContent className="max-h-[85vh] overflow-y-auto p-0 sm:max-w-2xl">
          {selectedRule && (
            <>
              <DialogHeader className="border-b border-slate-200 px-6 py-5 pr-14">
                <div className="flex flex-wrap items-center gap-2">
                  <Badge variant="outline" className="border-blue-200 bg-blue-50 font-mono text-blue-700">{selectedRule.rule.fullCode}</Badge>
                  <Badge variant="outline" className={statusClass(selectedRule.rule.status)}>{selectedRule.rule.status}</Badge>
                </div>
                <DialogTitle className="mt-2 text-lg font-semibold text-slate-900">{selectedRule.rule.name}</DialogTitle>
                <DialogDescription>规则详情</DialogDescription>
              </DialogHeader>
              <div className="grid gap-3 px-6 pb-6 md:grid-cols-2">
                <DetailField label="规则全码" value={selectedRule.rule.fullCode} code />
                <DetailField label="规则名称" value={selectedRule.rule.name} />
                <DetailField label="业务分类" value={selectedRule.template.category} />
                <DetailField label="适用对象" value={selectedRule.template.objectType} />
                <DetailField label="特征来源" value={selectedRule.rule.source} />
                <DetailField label="所属模板" value={`${selectedRule.template.name}（${selectedRule.template.code}）`} />
                <DetailField label="特征类型" value={selectedRule.rule.featureType} />
                <DetailField label="规则状态" value={selectedRule.rule.status} />
                <DetailField label="规则摘要" value={selectedRule.rule.summary} wide />
                <DetailField label="规则内容" value={selectedRule.rule.content} code wide />
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
