'use client';

import { useState } from 'react';
import { ChevronDown, ChevronRight, FolderTree } from 'lucide-react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  businessSceneCategories,
  type BusinessSceneId,
} from '@/lib/business-scenes';

export function SceneCategoryDirectory({
  sceneId,
  value,
  onValueChange,
}: {
  sceneId: BusinessSceneId;
  value: string;
  onValueChange: (value: string) => void;
}) {
  const categories = businessSceneCategories[sceneId];
  const selectedRoot = categories.find((item) => item.id === value || item.children.some((child) => child.id === value));
  const [expandedId, setExpandedId] = useState(selectedRoot?.id ?? categories[0]?.id ?? '');

  return (
    <Card className="border-0 py-0 shadow-[0_8px_32px_rgba(20,40,80,0.05)] ring-slate-200/80">
      <CardHeader className="border-b border-slate-100 px-4 py-4">
        <CardTitle className="flex items-center gap-2 text-[15px] font-semibold text-slate-800">
          <FolderTree className="size-4 text-blue-600" />业务分类目录
        </CardTitle>
      </CardHeader>
      <CardContent className="p-2">
        <button
          type="button"
          onClick={() => onValueChange('all')}
          className={`flex min-h-9 w-full items-center gap-2 rounded-lg px-2.5 py-2 text-left text-[13px] transition ${value === 'all' ? 'bg-blue-50 font-medium text-blue-700' : 'text-slate-600 hover:bg-slate-50'}`}
        >
          <span className="min-w-0 flex-1">全部业务分类</span>
          <span className="w-8 shrink-0 text-right text-[10px] font-medium text-slate-400">编号</span>
        </button>
        <div className="mt-1 space-y-0.5">
          {categories.map((item) => {
            const expanded = expandedId === item.id;
            const active = value === item.id || item.children.some((child) => child.id === value);
            return (
              <div key={item.id}>
                <button
                  type="button"
                  onClick={() => {
                    setExpandedId(expanded ? '' : item.id);
                    onValueChange(item.id);
                  }}
                  className={`flex min-h-9 w-full items-center gap-2 rounded-lg px-2.5 py-2 text-left text-[13px] transition ${active ? 'bg-blue-50 font-medium text-blue-700' : 'text-slate-600 hover:bg-slate-50'}`}
                >
                  {expanded ? <ChevronDown className="size-3.5 shrink-0" /> : <ChevronRight className="size-3.5 shrink-0 text-slate-400" />}
                  <span className="min-w-0 flex-1 leading-5">{item.label}</span>
                  <span className="w-8 shrink-0 text-right font-mono text-[10px] text-slate-400">{item.code ?? ''}</span>
                </button>
                {expanded && (
                  <div className="ml-4 border-l border-slate-200 py-1 pl-2">
                    {item.children.length > 0 ? item.children.map((child) => (
                      <button
                        key={child.id}
                        type="button"
                        onClick={() => onValueChange(child.id)}
                        className={`flex min-h-8 w-full items-center justify-between gap-2 rounded-md px-2 py-1.5 text-left text-xs transition ${value === child.id ? 'bg-slate-100 font-medium text-slate-800' : 'text-slate-500 hover:bg-slate-50'}`}
                      >
                        <span className="leading-5">{child.label}</span>
                        <span className="w-8 shrink-0 text-right font-mono text-[10px] text-slate-400">{child.code ?? ''}</span>
                      </button>
                    )) : (
                      <p className="px-2 py-2 text-xs text-slate-400">暂无下级分类</p>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
