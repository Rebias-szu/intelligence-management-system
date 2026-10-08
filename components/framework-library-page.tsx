'use client';

import { useState } from 'react';
import { ChevronDown, Plus, RefreshCw, Search } from 'lucide-react';

import { SceneCategoryDirectory } from '@/components/scene-category-directory';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  getSceneCategoryLabel,
  type BusinessSceneId,
  recordBelongsToSceneCategory,
} from '@/lib/business-scenes';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

export const frameworkPageIds = ['framework-website', 'framework-app', 'framework-protocol'] as const;
export type FrameworkPageId = (typeof frameworkPageIds)[number];

type FrameworkRecord = {
  code: string;
  name: string;
  objectType: string;
  frameworkType: string;
  category: string;
  updatedAt: string;
};

type FrameworkPage = {
  title: string;
  description: string;
  searchPlaceholder: string;
  records: FrameworkRecord[];
};

const frameworkPages: Record<FrameworkPageId, FrameworkPage> = {
  'framework-website': {
    title: '网站框架',
    description: '管理网站同源家族框架及其分类信息。',
    searchPlaceholder: '输入框架编码或框架名称',
    records: [
      {
        code: 'FW0001',
        name: '度小满仿冒网站框架',
        objectType: '网站',
        frameworkType: '业务仿冒框架',
        category: '贷款、代办信用卡类 / 虚假贷款',
        updatedAt: '2026-09-09',
      },
      {
        code: 'FW0002',
        name: '随行贷网站框架',
        objectType: '网站',
        frameworkType: '业务仿冒框架',
        category: '贷款、代办信用卡类 / 虚假贷款',
        updatedAt: '2026-09-08',
      },
      {
        code: 'FW0003',
        name: '积分贷网站框架',
        objectType: '网站',
        frameworkType: '业务网站框架',
        category: '贷款、代办信用卡类 / 虚假贷款',
        updatedAt: '2026-09-07',
      },
    ],
  },
  'framework-app': {
    title: 'APP框架',
    description: '管理APP同源家族框架及其分类信息。',
    searchPlaceholder: '输入框架编码或框架名称',
    records: [
      {
        code: 'FA0001',
        name: 'DCloud涉诈应用框架',
        objectType: 'APP',
        frameworkType: '通用技术框架',
        category: '虚假投资理财 / 刷单返利',
        updatedAt: '2026-09-09',
      },
      {
        code: 'FA0002',
        name: 'Flutter涉诈应用框架',
        objectType: 'APP',
        frameworkType: '通用技术框架',
        category: '网络投资平台 / 刷单返利',
        updatedAt: '2026-09-08',
      },
      {
        code: 'FA0003',
        name: 'NFCShare盗刷应用框架',
        objectType: 'APP',
        frameworkType: '业务技术框架',
        category: '其他类型诈骗 / NFC盗刷',
        updatedAt: '2026-09-07',
      },
    ],
  },
  'framework-protocol': {
    title: '协议框架',
    description: '管理协议同源家族框架及其分类信息。',
    searchPlaceholder: '输入框架编码或框架名称',
    records: [
      {
        code: 'FP0001',
        name: '客服聊天插件通信框架',
        objectType: '协议',
        frameworkType: '通信框架',
        category: '刷单返利类',
        updatedAt: '2026-09-09',
      },
      {
        code: 'FP0002',
        name: '刷单购物接口框架',
        objectType: '协议',
        frameworkType: '接口通信框架',
        category: '刷单返利类',
        updatedAt: '2026-09-08',
      },
    ],
  },
};

export function isFrameworkPageId(value: string): value is FrameworkPageId {
  return frameworkPageIds.includes(value as FrameworkPageId);
}

export function FrameworkLibraryPage({
  pageId,
  sceneId,
  sceneCategoryId = 'all',
  onPageIdChange,
  embedded = false,
}: {
  pageId: FrameworkPageId;
  sceneId?: BusinessSceneId | null;
  sceneCategoryId?: string;
  onPageIdChange?: (pageId: FrameworkPageId) => void;
  embedded?: boolean;
}) {
  const page = frameworkPages[pageId];
  const records = sceneId
    ? page.records.filter((record) => recordBelongsToSceneCategory(pageId, record.code, sceneId, sceneCategoryId))
    : page.records;

  return (
    <div className="space-y-4">
      {!embedded && <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
        <h1 className="text-2xl font-semibold tracking-tight text-slate-950">{page.title}</h1>
        <Button type="button" className="w-fit bg-blue-600 hover:bg-blue-700"><Plus />新建框架</Button>
      </div>}

      <Card className="border-0 py-0 shadow-[0_8px_32px_rgba(20,40,80,0.05)] ring-slate-200/80">
        <CardContent className="p-4 md:p-5">
          {sceneId && <p className="mb-3 text-sm font-semibold text-slate-700">{getSceneCategoryLabel(sceneId, sceneCategoryId)} / {page.title}</p>}
          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-[minmax(240px,1.3fr)_repeat(3,minmax(140px,.65fr))_auto_auto]">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
              <Input className="h-9 border-slate-200 bg-slate-50/60 pl-9" placeholder={page.searchPlaceholder} />
            </div>
            {onPageIdChange && (
              <Select value={pageId} onValueChange={(value) => value && onPageIdChange(value as FrameworkPageId)}>
                <SelectTrigger className="h-9 w-full border-slate-200 bg-white px-3 text-slate-600">
                  <SelectValue>{page.title}</SelectValue>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="framework-website">网站</SelectItem>
                  <SelectItem value="framework-app">APP</SelectItem>
                  <SelectItem value="framework-protocol">协议</SelectItem>
                </SelectContent>
              </Select>
            )}
            {['框架类型', '关联诈骗类型'].map((filter) => (
              <button key={filter} type="button" className="flex h-9 items-center justify-between rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-500 transition hover:border-blue-200 hover:bg-blue-50/30">
                <span>{filter}</span>
                <ChevronDown className="size-4 text-slate-400" />
              </button>
            ))}
            <Button type="button" className="h-9 bg-blue-600 px-5 hover:bg-blue-700"><Search />查询</Button>
            <Button type="button" variant="outline" className="h-9 border-slate-200"><RefreshCw />重置</Button>
          </div>
        </CardContent>
      </Card>

      <Card className="border-0 py-0 shadow-[0_8px_32px_rgba(20,40,80,0.06)] ring-slate-200/80">
        <CardHeader className="border-b border-slate-100 px-5 py-4">
          <CardTitle className="text-[15px] font-semibold text-slate-800">框架列表</CardTitle>
          <CardDescription className="mt-1 text-xs">{page.title} · 共 {records.length} 条</CardDescription>
        </CardHeader>
        <CardContent className="px-0 pb-0">
          <Table>
            <TableHeader>
              <TableRow className="border-slate-200 bg-slate-50/80 hover:bg-slate-50/80">
                {['框架编码', '框架名称', '适用对象', '框架类型', '关联诈骗类型', '更新时间'].map((column) => (
                  <TableHead key={column} className="h-11 whitespace-nowrap px-4 text-xs font-semibold text-slate-600">{column}</TableHead>
                ))}
                <TableHead className="h-11 whitespace-nowrap px-4 text-xs font-semibold text-slate-600">操作</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {records.length > 0 ? records.map((framework) => (
                <TableRow key={framework.code} className="border-slate-100 hover:bg-blue-50/30">
                  <TableCell className="h-16 whitespace-nowrap px-4 font-mono text-xs font-semibold text-blue-700">{framework.code}</TableCell>
                  <TableCell className="min-w-56 px-4 text-[13px] font-medium text-slate-900">{framework.name}</TableCell>
                  <TableCell className="whitespace-nowrap px-4 text-[13px] text-slate-600">{framework.objectType}</TableCell>
                  <TableCell className="whitespace-nowrap px-4 text-[13px] text-slate-600">{framework.frameworkType}</TableCell>
                  <TableCell className="min-w-56 px-4 text-[13px] text-slate-600">{framework.category}</TableCell>
                  <TableCell className="whitespace-nowrap px-4 text-[13px] text-slate-500">{framework.updatedAt}</TableCell>
                  <TableCell className="whitespace-nowrap px-4">
                    <Button type="button" variant="ghost" size="sm" className="text-blue-600 hover:bg-blue-50 hover:text-blue-700">查看</Button>
                  </TableCell>
                </TableRow>
              )) : (
                <TableRow>
                  <TableCell colSpan={7} className="h-32 text-center text-sm text-slate-400">暂无数据</TableCell>
                </TableRow>
              )}
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
    </div>
  );
}

export function SceneFrameworkLibraryPage({ sceneId }: { sceneId: BusinessSceneId }) {
  const [selectedPageId, setSelectedPageId] = useState<FrameworkPageId>('framework-website');
  const [selectedCategory, setSelectedCategory] = useState('all');

  return (
    <div className="space-y-4">
      <div className="grid items-start gap-4 xl:grid-cols-[17rem_minmax(0,1fr)]">
        <SceneCategoryDirectory sceneId={sceneId} value={selectedCategory} onValueChange={setSelectedCategory} />
        <FrameworkLibraryPage
          pageId={selectedPageId}
          sceneId={sceneId}
          sceneCategoryId={selectedCategory}
          onPageIdChange={setSelectedPageId}
          embedded
        />
      </div>
    </div>
  );
}
