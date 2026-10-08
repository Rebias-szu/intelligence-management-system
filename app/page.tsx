'use client';

import { useMemo, useState } from 'react';
import {
  Activity,
  ArrowRight,
  Blocks,
  Bot,
  ChevronDown,
  CircleCheckBig,
  CircleUserRound,
  ClipboardList,
  Database,
  Fingerprint,
  GitBranch,
  Globe2,
  House,
  Plus,
  RefreshCw,
  Route,
  Search,
  ShieldCheck,
  SquareStack,
  X,
} from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DrainageSceneNavigation,
  DrainageScenePage,
  isDrainageScenePageId,
  type DrainageScenePageId,
} from '@/components/drainage-scene-page';
import { FrameworkLibraryPage, isFrameworkPageId, SceneFrameworkLibraryPage } from '@/components/framework-library-page';
import {
  FundSceneNavigation,
  FundScenePage,
  isFundScenePageId,
  type FundScenePageId,
} from '@/components/fund-scene-page';
import {
  isRelayScenePageId,
  RelaySceneNavigation,
  RelayScenePage,
  type RelayScenePageId,
} from '@/components/relay-scene-page';
import { SceneCategoryDirectory } from '@/components/scene-category-directory';
import { getTemplatePageStats, isTemplatePageId, TemplateLibraryPage } from '@/components/template-library-page';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarProvider,
  SidebarRail,
  useSidebar,
} from '@/components/ui/sidebar';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  businessSceneById,
  businessScenes,
  type BusinessScene,
  type BusinessSceneId,
  countSceneRecords,
  getSceneCategoryLabel,
  recordBelongsToScene,
  recordBelongsToSceneCategory,
} from '@/lib/business-scenes';

type CellValue = string | number;

type DemoPage = {
  title: string;
  eyebrow: string;
  description: string;
  count: string;
  searchPlaceholder: string;
  filters: string[];
  columns: string[];
  rows: CellValue[][];
  actionLabel?: string;
};

type TabbedDataset = Pick<
  DemoPage,
  'title' | 'count' | 'searchPlaceholder' | 'filters' | 'columns' | 'rows'
> & {
  id: string;
  label: string;
};

type TabbedDemoPage = Pick<DemoPage, 'title' | 'eyebrow' | 'description'> & {
  tabs: TabbedDataset[];
};

type NavItem = {
  id: string;
  label: string;
  children?: NavItem[];
};

type NavGroup = {
  label: string;
  icon: typeof Database;
  items: NavItem[];
};

const demoPages: Record<string, DemoPage> = {
  'black-website': {
    title: '网站黑样本',
    eyebrow: '样本库 / 黑样本',
    description: '管理公安、管局、信通院等权威来源已确认的网站黑样本。',
    count: '12,601',
    searchPlaceholder: '输入域名、URL或样本编号',
    filters: ['诈骗大类/小类', '开始时间', '结束时间'],
    columns: ['URL / 域名', '网站标题', '服务器IP', '命中模板', '网站图标', 'IP归属地', '诈骗类型', '复核状态', '数据来源', '更新时间'],
    rows: [
      ['loan-service.example', '在线贷款服务', '192.0.2.18', 'AA101B-网站内容模板', '对象图标', '中国 / 福建省', '虚假贷款', '待复核', '公安机关', '2026-09-09 12:00'],
      ['invest-guide.example', '投资理财资讯', '198.51.100.42', 'AE102G-URL片段模板', '对象图标', '中国 / 广东省', '虚假投资理财', '待复核', '通信管理局', '2026-09-09 11:59'],
      ['customer-help.example', '客户服务中心', '203.0.113.71', 'AC101A-图标模板', '对象图标', '中国 / 北京市', '冒充电商客服', '待复核', '公安机关', '2026-09-09 11:58'],
    ],
  },
  'black-app': {
    title: 'APP黑样本',
    eyebrow: '样本库 / 黑样本',
    description: '管理权威机构确认的涉诈APP安装包、签名及关联信息。',
    count: '7,111',
    searchPlaceholder: '输入APP名称、包名或文件哈希',
    filters: ['数据来源', '诈骗大类/小类', '更新时间'],
    columns: ['APP名称', '包名', '命中模板', 'APP图标', '研判类型', '复核状态', '数据来源', '更新时间'],
    rows: [
      ['惠民速贷', 'com.demo.quickloan', 'AA105F-APP综合模板', '对象图标', '虚假贷款', '待复核', '公安机关', '2026-09-09 13:21'],
      ['远程协作', 'com.demo.meeting', 'AL105N-组件模板', '对象图标', '客服会议类软件', '待复核', '公安机关', '2026-09-09 12:21'],
      ['优选商城', 'com.demo.shop', 'AB105M-APP源码模板', '对象图标', '刷单返利', '待复核', '信通院', '2026-09-09 12:17'],
    ],
  },
  'result-website': {
    title: '网站研判结果',
    eyebrow: '研判结果库',
    description: '汇总规则和模型运行产生的网站研判结果，与权威黑样本严格分离。',
    count: '114,444,719',
    searchPlaceholder: '输入域名、URL或研判编号',
    filters: ['诈骗大类/小类', '开始时间', '结束时间'],
    columns: ['URL / 域名', '网站标题', '服务器IP', '命中模板', '网站图标', 'IP归属地', '诈骗类型', '复核状态', '数据来源', '更新时间'],
    rows: [
      ['service-center.example', '客户服务中心', '192.0.2.18', 'AC101B-网站内容模板', '对象图标', '中国-香港特别行政区', '冒充电商客服', '待复核', '北京_反诈', '2026-09-09 14:42'],
      ['finance-news.example', '财富资讯平台', '198.51.100.42', 'AE102G-URL片段模板', '对象图标', '美国-加利福尼亚州', '虚假投资理财', '待复核', '北京_反诈', '2026-09-09 14:42'],
      ['sports-center.example', '体育活动中心', '203.0.113.71', 'AH101B-网站内容模板', '对象图标', '中国-福建省', '游戏产品虚假交易', '待复核', '内蒙_反诈', '2026-09-09 14:41'],
    ],
  },
  'result-app': {
    title: 'APP研判结果',
    eyebrow: '研判结果库',
    description: '展示APP静态、动态和关联行为模型产生的机器研判结果。',
    count: '92,448',
    searchPlaceholder: '输入APP名称、包名或MD5',
    filters: ['数据来源', '诈骗大类/小类', '更新时间'],
    columns: ['APP名称', '包名', '命中模板', 'APP图标', '研判类型', '复核状态', '数据来源', '更新时间'],
    rows: [
      ['在线会议助手', 'com.demo.online', 'AL105N-组件模板', '对象图标', '客服会议类软件', '待复核', 'ga_陕西', '2026-09-09 14:52'],
      ['财富优选', 'com.demo.wealth', 'AE105P-DCloud页面模板', '对象图标', '虚假投资理财', '待复核', '网站源码提取', '2026-09-09 14:45'],
      ['放心借', 'com.demo.quickloan', 'AA105F-APP综合模板', '对象图标', '虚假贷款', '待复核', 'ga_河南', '2026-09-09 14:41'],
    ],
  },
  'result-ip': {
    title: 'IP研判结果',
    eyebrow: '研判结果库',
    description: '集中展示IP及端口的关联资产、协议活动和风险研判信息。',
    count: '14,872,572',
    searchPlaceholder: '输入IP地址或端口',
    filters: ['IP归属地', '开始时间', '结束时间'],
    columns: ['IP地址', 'IP归属地', '风险等级', '关联涉诈应用个数', '涉诈比例', '更新时间'],
    rows: [
      ['192.0.2.18', '美国', '高风险 90', '2,202', '99.2%', '2026-09-09 14:52'],
      ['198.51.100.42', '英国-英格兰', '高风险 88', '169', '98.3%', '2026-09-09 14:52'],
      ['203.0.113.71', '中国-香港特别行政区', '中风险 71', '40', '85.1%', '2026-09-09 14:52'],
    ],
  },
  'model-website': {
    title: '网站模型',
    eyebrow: '模型库',
    description: '管理网站实体识别模型及其运行、评估和复核情况。',
    count: '2,997',
    searchPlaceholder: '输入模型名称或模型代码',
    filters: ['诈骗大类/小类', '模型状态'],
    actionLabel: '新建模型',
    columns: ['模型名称', '模型代码', '诈骗类型', '模型状态', '研判结果数', '模型准确率', '待复核数量', '更新人', '更新时间'],
    rows: [
      ['M02076-内容匹配', 'M02076', '代孕求子', '正式运行', '1', '—', '0', '潘练', '2026-09-04 18:10'],
      ['M02075-源码匹配', 'M02075', '色情网站', '正式运行', '259', '—', '0', '潘练', '2026-09-03 15:07'],
      ['M02072-源码匹配', 'M02072', '色情网站', '正式运行', '292', '—', '0', '潘练', '2026-09-03 15:07'],
    ],
  },
  'model-app': {
    title: 'APP模型',
    eyebrow: '模型库',
    description: '管理APP实体模型，并跟踪研判结果、准确率和人工复核进度。',
    count: '214',
    searchPlaceholder: '输入模型名称或模型代码',
    filters: ['模型状态'],
    actionLabel: '新建模型',
    columns: ['模型名称', '模型代码', '诈骗类型', '模型状态', '研判结果数', '模型准确率', '待复核数量', '更新人', '更新时间'],
    rows: [
      ['网易云信SDK+包名', 'A00094', '刷单返利类', '正式运行', '749', '0.0%', '749', '尹修恒', '2026-08-25 16:30'],
      ['企业协作会议', 'A00290', '客服会议类软件', '正式运行', '0', '—', '0', '尹修恒', '2026-08-25 16:24'],
      ['DCloud投资', 'A00345', '网络投资平台', '正式运行', '1', '—', '1', '尹修恒', '2026-08-25 16:04'],
    ],
  },
  'model-protocol': {
    title: '协议模型',
    eyebrow: '模型库',
    description: '由原“涉诈应用日志特征库”优化而来，管理HTTP、DNS等协议行为模型。',
    count: '572',
    searchPlaceholder: '输入场景、模型名称或特征描述',
    filters: ['诈骗大类/小类', '状态'],
    actionLabel: '新建模型',
    columns: ['场景名', '特征描述', '状态', '评估状态', '说明/适用范围', '更新人', '更新时间'],
    rows: [
      ['APP动态_虚假投资', '【80】虚假投资 APP 使用者（HTTP）', '上线', '已反馈', '模型验证说明', '张彦', '2026-08-25 21:56'],
      ['APP动态_虚假贷款', '【91】虚假贷款 APP 使用者（HTTP）', '上线', '已反馈', '模型验证说明', '张彦', '2026-08-25 17:17'],
      ['APP动态_虚假投资', '【100】虚假投资 APP 使用者（域名）', '上线', '已反馈', '模型验证说明', '张彦', '2026-07-24 17:22'],
    ],
  },
  'model-person': {
    title: '人员模型',
    eyebrow: '模型库',
    description: '管理基于行为序列识别受害人或涉诈人员的复合模型。',
    count: '24',
    searchPlaceholder: '输入模型名称、编码或特征标签',
    filters: ['状态'],
    actionLabel: '新建模型',
    columns: ['策略名称', '模型类型', '人员类型', '诈骗类型', '特征标签', '策略状态', '评估状态', '更新人', '更新时间'],
    rows: [
      ['【41】虚假贷款同源APP监测模型（模型编码：20110）', '行为序列模型', '受害人', '诈骗类型 / 虚假贷款', '—', '上线', '未评估', '彭剑钢', '2026-06-25 20:28'],
      ['【15】虚假投资多路径组合检测模型（模型编号：20103）', '行为序列模型', '受害人', '诈骗类型 / 虚假投资理财', '—', '上线', '未评估', '彭剑钢', '2026-06-25 20:27'],
      ['【58】远程控制诈骗APP监测模型（模型编码：20104）', '行为序列模型', '受害人', '诈骗类型 / 其他类型诈骗', '—', '上线', '未评估', '彭剑钢', '2026-06-25 20:27'],
    ],
  },
  'model-warning': {
    title: '预警模型',
    eyebrow: '模型库',
    description: '在模板和框架能力基础上叠加行为、时序和频次条件，用于输出实时或准实时风险预警。',
    count: '12',
    searchPlaceholder: '输入模型编码或模型名称',
    filters: ['诈骗类型（12+2）', '预警等级', '模型状态'],
    actionLabel: '新建模型',
    columns: ['模型编码', '模型名称', '诈骗类型', '参与组合', '时序条件', '预警等级', '模型状态', '更新时间'],
    rows: [
      ['WM0001', '虚假贷款受害人预警模型', '贷款、代办信用卡类', '贷款模板 + 支付行为', '30分钟内连续命中', '高危', '上线', '2026-09-14 16:30'],
      ['WM0002', '远程控制诈骗预警模型', '其他类型诈骗', '远控模板 + 支付行为', '2小时内先后命中', '高危', '上线', '2026-09-14 15:20'],
      ['WM0003', '刷单返利风险预警模型', '刷单返利类', 'APP模板 + 协议模板', '24小时内命中3次', '中危', '试运行', '2026-09-13 18:10'],
    ],
  },
  'model-clue': {
    title: '线索模型',
    eyebrow: '模型库',
    description: '组合模板、同源框架及关联数据，用于发现可进一步研判、串并和推动的涉诈线索。',
    count: '8',
    searchPlaceholder: '输入模型编码、模型名称或线索类型',
    filters: ['诈骗类型（12+2）', '线索类型', '模型状态'],
    actionLabel: '新建模型',
    columns: ['模型编码', '模型名称', '线索类型', '诈骗类型', '参与组合', '分析窗口', '模型状态', '更新时间'],
    rows: [
      ['CM0001', '涉诈网站同源扩线模型', '同源扩线', '贷款、代办信用卡类', '网站模板 + 同源框架', '近7天', '上线', '2026-09-14 14:30'],
      ['CM0002', '境外服务器关联线索模型', '基础设施关联', '多诈骗类型', '境外IP + 协议模板 + 关联域名', '近24小时', '上线', '2026-09-14 11:20'],
      ['CM0003', '刷单应用团伙聚类模型', '团伙串并', '刷单返利类', 'APP模板 + APP框架', '近30天', '试运行', '2026-09-12 10:10'],
    ],
  },
};

const overseasIpScenePage: DemoPage = {
  ...demoPages['result-ip'],
  title: '境外服务器IP',
  eyebrow: '业务场景 / 境外服务器IP',
  description: '查看境外服务器IP的风险等级、关联涉诈应用和最新研判信息。',
};

const tabbedDemoPages: Record<string, TabbedDemoPage> = {
  'black-sample': {
    title: '黑样本',
    eyebrow: '样本库',
    description: '管理权威来源已确认的网站和APP黑样本。',
    tabs: [
      {
        id: 'black-website',
        label: '网站',
        title: demoPages['black-website'].title,
        count: demoPages['black-website'].count,
        searchPlaceholder: demoPages['black-website'].searchPlaceholder,
        filters: demoPages['black-website'].filters,
        columns: demoPages['black-website'].columns,
        rows: demoPages['black-website'].rows,
      },
      {
        id: 'black-app',
        label: 'APP',
        title: demoPages['black-app'].title,
        count: demoPages['black-app'].count,
        searchPlaceholder: demoPages['black-app'].searchPlaceholder,
        filters: demoPages['black-app'].filters,
        columns: demoPages['black-app'].columns,
        rows: demoPages['black-app'].rows,
      },
    ],
  },
  'pending-sample': {
    title: '待判样本',
    eyebrow: '样本库',
    description: '管理第三方权威机构已确认涉诈，但因对象无法访问或当前技术能力不足而暂时无法完成分类的样本。',
    tabs: [
      {
        id: 'pending-website',
        label: '网站',
        title: '待判网站样本',
        count: '1',
        searchPlaceholder: '输入域名、URL或网站标题',
        filters: ['待判原因', '研判状态', '数据来源'],
        columns: ['URL / 域名', '网站标题', '服务器IP', '最近命中模板', '网站图标', 'IP归属地', '权威报送类型', '待判原因', '研判状态', '研判次数', '数据来源', '最近研判时间', '更新时间'],
        rows: [
          ['unavailable-site.example', '客户服务平台', '203.0.113.88', 'AA101B-网站内容模板', '对象图标', '中国 / 广东省', '涉诈网站', '网站无法访问', '等待重新研判', '2', '公安机关', '2026-09-08 10:30', '2026-09-09 09:20'],
        ],
      },
      {
        id: 'pending-app',
        label: 'APP',
        title: '待判APP样本',
        count: '1',
        searchPlaceholder: '输入APP名称、包名或文件MD5',
        filters: ['待判原因', '研判状态', '数据来源'],
        columns: ['APP名称', '包名', '文件MD5', '最近命中模板', 'APP图标', '权威报送类型', '待判原因', '研判状态', '研判次数', '数据来源', '最近研判时间', '更新时间'],
        rows: [
          ['聚合服务', 'com.demo.service', 'D41D8CD98F00B204E9800998ECF8427E', 'AL105N-组件模板', '对象图标', '涉诈APP', '安装包加固，当前无法解析', '技术能力待补充', '1', '通信管理局', '2026-09-08 16:20', '2026-09-09 09:18'],
        ],
      },
    ],
  },
  whitelist: {
    title: '白名单',
    eyebrow: '样本库',
    description: '管理经确认无需参与风险研判或需要在指定范围内排除的正常网站和APP对象。',
    tabs: [
      {
        id: 'whitelist-website',
        label: '网站',
        title: '网站白名单',
        count: '1',
        searchPlaceholder: '输入域名、URL或网站标题',
        filters: ['白名单类型', '白名单状态', '有效期'],
        columns: ['URL / 域名', '网站标题', '服务器IP', '网站图标', 'IP归属地', '白名单类型', '加白原因', '适用范围', '数据来源', '生效时间', '失效时间', '白名单状态', '更新时间'],
        rows: [
          ['official-service.example', '某机构官方网站', '192.0.2.66', '对象图标', '中国 / 北京市', '长期白名单', '权威机构官方网站', '全部研判任务', '内部业务确认', '2026-01-01 00:00', '—', '生效中', '2026-09-09 09:10'],
        ],
      },
      {
        id: 'whitelist-app',
        label: 'APP',
        title: 'APP白名单',
        count: '1',
        searchPlaceholder: '输入APP名称、包名或文件MD5',
        filters: ['白名单类型', '白名单状态', '有效期'],
        columns: ['APP名称', '包名', '文件MD5', 'APP图标', '白名单类型', '加白原因', '适用范围', '数据来源', '生效时间', '失效时间', '白名单状态', '更新时间'],
        rows: [
          ['内部测试应用', 'com.demo.internal', '0CC175B9C0F1B6A831C399E269772661', '对象图标', '临时白名单', '内部模型测试使用', '测试环境', '内部业务确认', '2026-09-01 00:00', '2026-12-31 23:59', '生效中', '2026-09-09 09:08'],
        ],
      },
    ],
  },
};

function datasetFromPage(id: string, label: string): TabbedDataset {
  const page = demoPages[id];
  return {
    id,
    label,
    title: page.title,
    count: page.count,
    searchPlaceholder: page.searchPlaceholder,
    filters: page.filters,
    columns: page.columns,
    rows: page.rows,
  };
}

tabbedDemoPages['scene-results'] = {
  title: '研判结果',
  eyebrow: '业务场景 / 研判结果',
  description: '集中查看当前业务场景关联的网站、APP和IP研判结果。',
  tabs: [
    datasetFromPage('result-website', '网站'),
    datasetFromPage('result-app', 'APP'),
    datasetFromPage('result-ip', 'IP'),
  ],
};

const templateObjectTypeByNavId = {
  'template-website': '网站',
  'template-app': 'APP',
  'template-protocol': '协议',
} as const;

const navGroups: NavGroup[] = [
  {
    label: '情报资产',
    icon: Database,
    items: [
      {
        id: 'sample-library',
        label: '样本库',
        children: [
          { id: 'black-sample', label: '黑样本' },
          { id: 'pending-sample', label: '待判样本' },
          { id: 'whitelist', label: '白名单' },
        ],
      },
      {
        id: 'result-library',
        label: '研判结果库',
        children: [
          { id: 'result-website', label: '网站' },
          { id: 'result-app', label: 'APP' },
          { id: 'result-ip', label: 'IP' },
        ],
      },
      {
        id: 'template-library',
        label: '模板库',
        children: [
          { id: 'template-website', label: '网站' },
          { id: 'template-app', label: 'APP' },
          { id: 'template-protocol', label: '协议' },
        ],
      },
      {
        id: 'framework-library',
        label: '框架库',
        children: [
          { id: 'framework-website', label: '网站框架' },
          { id: 'framework-app', label: 'APP框架' },
          { id: 'framework-protocol', label: '协议框架' },
        ],
      },
      {
        id: 'model-library',
        label: '模型库',
        children: [
          { id: 'model-warning', label: '预警模型' },
          { id: 'model-clue', label: '线索模型' },
        ],
      },
    ],
  },
  {
    label: '工作支撑',
    icon: ClipboardList,
    items: [
      {
        id: 'collection-root',
        label: '情报采集任务',
        children: [
          { id: 'collection-website', label: '网站采集任务库' },
          { id: 'collection-app', label: 'APP采集任务库' },
        ],
      },
      {
        id: 'work-root',
        label: '工作任务管理',
        children: [
          { id: 'workbench', label: '我的任务台' },
          { id: 'contribution', label: '人员贡献分析' },
        ],
      },
      {
        id: 'tool-root',
        label: '特征分析工具',
        children: [
          { id: 'traffic-log', label: '流量日志' },
          { id: 'cluster-analysis', label: '聚类分析' },
          { id: 'feature-rule', label: '特征规则' },
          { id: 'behavior-translate', label: '行为翻译' },
        ],
      },
    ],
  },
];

const labelById = new Map<string, string>();
function collectNavLabels(items: NavItem[]) {
  items.forEach((item) => {
    labelById.set(item.id, item.label);
    if (item.children) collectNavLabels(item.children);
  });
}
navGroups.forEach((group) => collectNavLabels(group.items));

function navItemContains(item: NavItem, activeId: string): boolean {
  if (item.id === 'template-library' && activeId.startsWith('template-')) return true;
  return item.id === activeId || Boolean(item.children?.some((child) => navItemContains(child, activeId)));
}

function statusClass(value: CellValue) {
  const text = String(value);
  if (/已确认|正式运行|上线|活跃|监测中|生效中/.test(text)) {
    return 'border-emerald-200 bg-emerald-50 text-emerald-700';
  }
  if (/高风险|疑似涉诈|黑|待复核|未评估|待评估|等待重新研判|技术能力待补充/.test(text)) {
    return 'border-amber-200 bg-amber-50 text-amber-700';
  }
  if (/非黑|已归档|低风险/.test(text)) {
    return 'border-slate-200 bg-slate-50 text-slate-600';
  }
  return '';
}

function DemoTable({
  page,
  sceneLabel,
}: {
  page: Pick<DemoPage, 'title' | 'count' | 'columns' | 'rows' | 'actionLabel'>;
  sceneLabel?: string;
}) {
  return (
    <Card className="border-0 py-0 shadow-[0_8px_32px_rgba(20,40,80,0.06)] ring-slate-200/80">
      <CardHeader className="border-b border-slate-100 px-5 py-4 md:px-6">
        <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
          <div>
            <CardTitle className="text-[15px] font-semibold text-slate-800">列表数据</CardTitle>
            <CardDescription className="mt-1 text-xs">
              {sceneLabel ? `${page.title} · 共 ${page.rows.length} 条` : `共 ${page.count} 条 · 当前显示 ${page.rows.length} 条`}
            </CardDescription>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Button variant="outline" size="sm">批量导入</Button>
            <Button variant="outline" size="sm">导出</Button>
            {!page.actionLabel && <Button type="button" size="sm" className="bg-blue-600 hover:bg-blue-700">新增记录</Button>}
          </div>
        </div>
      </CardHeader>
      <CardContent className="px-0 pb-0">
        <Table>
          <TableHeader>
            <TableRow className="border-slate-200 bg-slate-50/80 hover:bg-slate-50/80">
              {page.columns.map((column) => (
                <TableHead key={column} className="h-11 px-4 text-xs font-semibold text-slate-600">{column}</TableHead>
              ))}
              <TableHead className="h-11 px-4 text-xs font-semibold text-slate-600">操作</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {page.rows.length > 0 ? page.rows.map((row, rowIndex) => (
              <TableRow key={`${page.title}-${rowIndex}`} className="border-slate-100 hover:bg-blue-50/30">
                {row.map((cell, cellIndex) => {
                  const badgeClass = statusClass(cell);
                  return (
                    <TableCell key={`${cell}-${cellIndex}`} className="h-14 px-4 text-[13px] text-slate-700">
                      {badgeClass ? (
                        <Badge variant="outline" className={badgeClass}>{cell}</Badge>
                      ) : (
                        <span className={cellIndex === 0 ? 'font-medium text-slate-900' : ''}>{cell}</span>
                      )}
                    </TableCell>
                  );
                })}
                <TableCell className="h-14 px-4">
                  <Button variant="ghost" size="sm" className="text-blue-600 hover:bg-blue-50 hover:text-blue-700">查看</Button>
                </TableCell>
              </TableRow>
            )) : (
              <TableRow>
                <TableCell colSpan={page.columns.length + 1} className="h-32 text-center text-sm text-slate-400">
                  暂无数据
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
        <div className="flex items-center justify-between border-t border-slate-100 px-5 py-3 text-xs text-slate-500">
          <span>每页 10 条</span>
          <div className="flex items-center gap-1">
            <Button variant="outline" size="xs" disabled>上一页</Button>
            <Button size="xs" className="bg-blue-600">1</Button>
            <Button variant="outline" size="xs">2</Button>
            <Button variant="outline" size="xs">下一页</Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

type QueryTypeFilter = {
  label: string;
  value: string;
  options: Array<{ value: string; label: string }>;
  onValueChange: (value: string) => void;
};

function QueryPanel({
  page,
  typeFilter,
  contextLabel,
}: {
  page: Pick<DemoPage, 'searchPlaceholder' | 'filters'>;
  typeFilter?: QueryTypeFilter;
  contextLabel?: string;
}) {
  return (
    <Card className="border-0 py-0 shadow-[0_8px_32px_rgba(20,40,80,0.05)] ring-slate-200/80">
      <CardContent className="p-4 md:p-5">
        {contextLabel && <p className="mb-3 text-sm font-semibold text-slate-700">{contextLabel}</p>}
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-[minmax(240px,1.3fr)_repeat(4,minmax(130px,.65fr))_auto_auto]">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
            <Input className="h-9 border-slate-200 bg-slate-50/60 pl-9" placeholder={page.searchPlaceholder} />
          </div>
          {typeFilter && (
            <Select value={typeFilter.value} onValueChange={(value) => value && typeFilter.onValueChange(value)}>
              <SelectTrigger className="h-9 w-full border-slate-200 bg-white px-3 text-slate-600">
                <SelectValue>{typeFilter.options.find((item) => item.value === typeFilter.value)?.label ?? typeFilter.label}</SelectValue>
              </SelectTrigger>
              <SelectContent>
                {typeFilter.options.map((option) => <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>)}
              </SelectContent>
            </Select>
          )}
          {page.filters.map((filter) => (
            <button key={filter} type="button" className="flex h-9 items-center justify-between rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-500 transition hover:border-blue-200 hover:bg-blue-50/30">
              <span>{filter}</span>
              <ChevronDown className="size-4 text-slate-400" />
            </button>
          ))}
          <Button className="h-9 bg-blue-600 px-5 hover:bg-blue-700"><Search />查询</Button>
          <Button variant="outline" className="h-9 border-slate-200"><RefreshCw />重置</Button>
        </div>
      </CardContent>
    </Card>
  );
}

function DataPage({ pageId, page, scene }: { pageId: string; page: DemoPage; scene?: BusinessScene | null }) {
  const rows = scene
    ? page.rows.filter((row) => recordBelongsToScene(pageId, String(row[0]), scene.id))
    : page.rows;
  const scopedPage = scene ? { ...page, count: String(rows.length), rows } : page;

  return (
    <div className="space-y-4">
      {!scene && (
        <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
          <h1 className="text-2xl font-semibold tracking-tight text-slate-950">{page.title}</h1>
          {page.actionLabel && (
            <Button type="button" className="w-fit bg-blue-600 hover:bg-blue-700"><Plus />{page.actionLabel}</Button>
          )}
        </div>
      )}

      <QueryPanel page={scopedPage} />

      <DemoTable page={scopedPage} sceneLabel={scene?.label} />
    </div>
  );
}

function TabbedDataPage({ page, scene }: { page: TabbedDemoPage; scene?: BusinessScene | null }) {
  const [selectedDatasetId, setSelectedDatasetId] = useState(page.tabs[0].id);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const selectedTab = page.tabs.find((tab) => tab.id === selectedDatasetId) ?? page.tabs[0];

  if (scene) {
    const rows = selectedTab.rows.filter((row) => recordBelongsToSceneCategory(
      selectedTab.id,
      String(row[0]),
      scene.id,
      selectedCategory,
    ));
    const scopedTab = {
      ...selectedTab,
      count: String(rows.length),
      filters: selectedTab.filters.filter((filter) => !filter.includes('诈骗大类') && !filter.includes('12+2')),
      rows,
    };
    const typeOptions = page.tabs.map((tab) => ({ value: tab.id, label: tab.label === '全部' ? '全部类型' : tab.label }));

    return (
      <div className="space-y-4">
        <div className="grid items-start gap-4 xl:grid-cols-[17rem_minmax(0,1fr)]">
          <SceneCategoryDirectory sceneId={scene.id} value={selectedCategory} onValueChange={setSelectedCategory} />
          <div className="min-w-0 space-y-4">
            <QueryPanel
              page={scopedTab}
              contextLabel={`${getSceneCategoryLabel(scene.id, selectedCategory)} / ${selectedTab.label}`}
              typeFilter={{ label: '资产类型', value: selectedDatasetId, options: typeOptions, onValueChange: setSelectedDatasetId }}
            />
            <DemoTable page={scopedTab} sceneLabel={scene.label} />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold tracking-tight text-slate-950">{page.title}</h1>

      <Tabs defaultValue={page.tabs[0].id}>
        <TabsList className="mb-2 h-10 bg-slate-200/70 p-1">
          {page.tabs.map((tab) => (
            <TabsTrigger key={tab.id} value={tab.id} className="min-w-24 px-5 data-active:text-blue-700">
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>
        {page.tabs.map((tab) => {
          return (
            <TabsContent key={tab.id} value={tab.id} className="space-y-4">
              <QueryPanel page={tab} />
              <DemoTable page={tab} />
            </TabsContent>
          );
        })}
      </Tabs>
    </div>
  );
}

const sceneVisuals: Record<BusinessSceneId, { icon: typeof Globe2; tone: string; iconTone: string }> = {
  'overseas-ip': { icon: Globe2, tone: 'border-cyan-200 bg-cyan-50 text-cyan-800', iconTone: 'bg-cyan-100 text-cyan-700' },
  relay: { icon: Activity, tone: 'border-blue-200 bg-blue-50 text-blue-800', iconTone: 'bg-blue-100 text-blue-700' },
  drainage: { icon: Route, tone: 'border-violet-200 bg-violet-50 text-violet-800', iconTone: 'bg-violet-100 text-violet-700' },
  fraud: { icon: ShieldCheck, tone: 'border-indigo-200 bg-indigo-50 text-indigo-800', iconTone: 'bg-indigo-100 text-indigo-700' },
  fund: { icon: Blocks, tone: 'border-amber-200 bg-amber-50 text-amber-800', iconTone: 'bg-amber-100 text-amber-700' },
};

function Overview({
  onNavigateAsset,
  onSelectScene,
}: {
  onNavigateAsset: (id: string) => void;
  onSelectScene: (id: BusinessSceneId) => void;
}) {
  const assetCards = [
    { label: '黑样本', value: '19,712', note: '网站、APP', icon: ShieldCheck, target: 'black-sample' },
    { label: '白名单', value: '2', note: '网站、APP', icon: CircleCheckBig, target: 'whitelist' },
    { label: '研判结果', value: '1.15亿', note: '网站、APP、IP', icon: Database, target: 'result-website' },
    { label: '模板', value: '81', note: '内嵌 486 条规则', icon: SquareStack, target: 'template-website' },
    { label: '框架', value: '18', note: '同源家族维度', icon: GitBranch, target: 'framework-app' },
    { label: '模型', value: '20', note: '预警模型、线索模型', icon: Bot, target: 'model-warning' },
  ];

  return (
    <div className="space-y-5">
      <p className="text-xs font-semibold tracking-[0.12em] text-blue-600">首页 / 总览</p>

      <Card className="border-0 py-0 shadow-[0_10px_36px_rgba(20,40,80,0.07)] ring-slate-200/80">
        <CardHeader className="border-b border-slate-100 px-5 py-4">
          <CardTitle className="text-[15px] font-semibold">情报资产</CardTitle>
          <CardDescription className="mt-1">查看当前已纳入管理的样本、研判结果和识别能力资产。</CardDescription>
        </CardHeader>
        <CardContent className="p-5">
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-6">
            {assetCards.map((card) => (
              <button key={card.label} type="button" aria-label={`查看${card.label}`} onClick={() => onNavigateAsset(card.target)} className="group rounded-xl text-left outline-none focus-visible:ring-2 focus-visible:ring-blue-500">
                <div className="h-full rounded-xl border border-slate-200 bg-white p-4 transition group-hover:-translate-y-0.5 group-hover:border-blue-200 group-hover:shadow-[0_12px_28px_rgba(20,60,120,0.09)]">
                  <div className="flex items-start justify-between gap-3">
                    <span className="flex size-9 items-center justify-center rounded-lg bg-blue-50 text-blue-600"><card.icon className="size-4" /></span>
                    <ArrowRight className="size-4 text-slate-300 transition group-hover:translate-x-0.5 group-hover:text-blue-500" />
                  </div>
                  <span className="mt-3 block text-xs text-slate-500">{card.label}</span>
                  <span className="mt-1 block text-2xl font-semibold tracking-tight text-slate-900">{card.value}</span>
                  <span className="mt-1 block text-xs text-slate-400">{card.note}</span>
                </div>
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="border-0 py-0 shadow-[0_10px_36px_rgba(20,40,80,0.07)] ring-slate-200/80">
        <CardHeader className="border-b border-slate-100 px-5 py-4">
          <CardTitle className="text-[15px] font-semibold">业务场景</CardTitle>
          <CardDescription className="mt-1">按业务场景进入对应的研判结果或模板分类。</CardDescription>
        </CardHeader>
        <CardContent className="p-5">
          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-5">
            {businessScenes.map((scene) => {
              const visual = sceneVisuals[scene.id];
              const relayCategories = ['VOIP', 'GOIP', '猫池', '短链集群', '物联网卡'];
              const drainageCategories = ['卡片引流', '短视频引流', '社交引流', '印刷引流'];
              const fundCategories = ['二方（银行）', '三方', '四方聚合', '非法四方 / 跑分', '虚拟币'];
              const stats = scene.id === 'overseas-ip'
                ? [{ label: 'IP数量', value: demoPages['result-ip'].count }]
                : [
                  { label: '黑样本', value: countSceneRecords(scene.id, ['black-website', 'black-app']) },
                  { label: '研判结果', value: countSceneRecords(scene.id, ['result-website', 'result-app', 'result-ip']) },
                  { label: '模板', value: scene.templatePageId ? countSceneRecords(scene.id, [scene.templatePageId]) : 0 },
                  { label: '框架', value: countSceneRecords(scene.id, ['framework-website', 'framework-app', 'framework-protocol']) },
                ];
              return (
              <button
                key={scene.id}
                type="button"
                aria-label={`进入${scene.label}业务场景`}
                onClick={() => onSelectScene(scene.id)}
                className={`group relative flex min-h-64 overflow-hidden rounded-xl border p-4 text-left outline-none transition hover:-translate-y-0.5 hover:shadow-[0_12px_28px_rgba(20,60,120,0.10)] focus-visible:ring-2 focus-visible:ring-blue-500 ${visual.tone}`}
              >
                <span className="flex w-full flex-1 flex-col self-stretch transition duration-200 group-hover:opacity-0 group-focus-visible:opacity-0">
                  <span className="flex items-start justify-between gap-3">
                    <span className={`flex size-10 items-center justify-center rounded-xl ${visual.iconTone}`}><visual.icon className="size-5" /></span>
                    <ArrowRight className="size-4 opacity-40 transition group-hover:translate-x-0.5 group-hover:opacity-80" />
                  </span>
                  <span className="mt-4 text-base font-semibold">{scene.label}</span>
                  <span className="mt-2 flex flex-wrap gap-1.5">
                    {scene.scope.map((item) => <span key={item} className="rounded-md bg-white/70 px-2 py-1 text-[11px] font-medium">{item}</span>)}
                  </span>
                  <span className="mt-3 block text-xs leading-5 opacity-75">{scene.description}</span>
                </span>
                <span className="pointer-events-none absolute inset-0 flex translate-y-2 flex-col bg-white/95 p-4 opacity-0 backdrop-blur-sm transition duration-200 group-hover:translate-y-0 group-hover:opacity-100 group-focus-visible:translate-y-0 group-focus-visible:opacity-100">
                  <span className="flex items-center justify-between gap-3">
                    <span className="text-sm font-semibold text-slate-800">{scene.label}</span>
                    <ArrowRight className="size-4 text-blue-500" />
                  </span>
                  {scene.id === 'relay' || scene.id === 'drainage' || scene.id === 'fund' ? (
                    <span className="mt-4 grid grid-cols-2 gap-2">
                      {(scene.id === 'relay' ? relayCategories : scene.id === 'drainage' ? drainageCategories : fundCategories).map((category, index, categories) => (
                        <span key={category} className={`rounded-lg border border-slate-200 bg-slate-50/90 px-3 py-3 text-center text-xs font-medium text-slate-700 ${categories.length % 2 === 1 && index === categories.length - 1 ? 'col-span-2' : ''}`}>
                          {category}
                        </span>
                      ))}
                    </span>
                  ) : (
                    <span className={`mt-4 grid gap-2 ${stats.length === 1 ? 'grid-cols-1' : 'grid-cols-2'}`}>
                      {stats.map((stat) => (
                        <span key={stat.label} className={`rounded-lg border border-slate-200 bg-slate-50/90 px-3 py-2.5 ${stats.length === 1 ? 'mt-4 text-center' : ''}`}>
                          <span className="block text-[11px] text-slate-500">{stat.label}</span>
                          <span className={`mt-1 block font-semibold text-slate-900 ${stats.length === 1 ? 'text-xl' : 'text-base'}`}>{stat.value}</span>
                        </span>
                      ))}
                    </span>
                  )}
                </span>
              </button>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function SceneContextBar({
  scene,
  onSwitch,
  onClear,
}: {
  scene: BusinessScene;
  onSwitch: (id: BusinessSceneId) => void;
  onClear: () => void;
}) {
  return (
    <Card className="mb-4 border-blue-200 bg-blue-50/70 py-0 shadow-none">
      <CardContent className="flex flex-wrap items-center justify-start gap-1.5 p-3 md:px-4">
        {businessScenes.map((item) => (
            <Button
              key={item.id}
              type="button"
              variant={item.id === scene.id ? 'default' : 'outline'}
              size="xs"
              onClick={() => onSwitch(item.id)}
              className={item.id === scene.id ? 'bg-blue-600 hover:bg-blue-700' : 'border-blue-200 bg-white text-slate-600'}
            >
              {item.label}
            </Button>
          ))}
        <Button type="button" variant="ghost" size="xs" onClick={onClear} className="text-slate-500 hover:bg-white hover:text-slate-700">
          <X className="size-3.5" />清除筛选
        </Button>
      </CardContent>
    </Card>
  );
}

function SceneAssetSwitcher({
  scene,
  activeId,
  onNavigate,
}: {
  scene: BusinessScene;
  activeId: string;
  onNavigate: (id: string) => void;
}) {
  const assets = [
    { id: 'black-sample', label: '黑样本', icon: ShieldCheck, active: activeId === 'black-sample' },
    { id: 'scene-results', label: '研判结果', icon: Database, active: activeId === 'scene-results' || activeId.startsWith('result-') },
    { id: scene.templatePageId ?? 'template-fraud', label: '模板及规则', icon: SquareStack, active: activeId.startsWith('template-') },
    { id: 'scene-frameworks', label: '框架', icon: GitBranch, active: activeId === 'scene-frameworks' || activeId.startsWith('framework-') },
  ];
  const blackWebsiteCount = countSceneRecords(scene.id, ['black-website']);
  const blackAppCount = countSceneRecords(scene.id, ['black-app']);
  const resultWebsiteCount = countSceneRecords(scene.id, ['result-website']);
  const resultAppCount = countSceneRecords(scene.id, ['result-app']);
  const resultIpCount = countSceneRecords(scene.id, ['result-ip']);
  const frameworkWebsiteCount = countSceneRecords(scene.id, ['framework-website']);
  const frameworkAppCount = countSceneRecords(scene.id, ['framework-app']);
  const frameworkProtocolCount = countSceneRecords(scene.id, ['framework-protocol']);
  const templateStats = scene.templatePageId
    ? getTemplatePageStats(scene.templatePageId)
    : { templateCount: 0, ruleCount: 0 };
  const statistics = activeId === 'black-sample'
    ? [
      { label: '黑样本数量', value: blackWebsiteCount + blackAppCount },
    ]
    : activeId === 'scene-results' || activeId.startsWith('result-')
      ? [
        { label: '研判结果数量', value: resultWebsiteCount + resultAppCount + resultIpCount },
      ]
      : activeId.startsWith('template-')
        ? [
          { label: '模板数量', value: templateStats.templateCount },
        ]
        : activeId === 'scene-frameworks' || activeId.startsWith('framework-')
          ? [
            { label: '框架数量', value: frameworkWebsiteCount + frameworkAppCount + frameworkProtocolCount },
          ]
          : [];

  return (
    <Card className="mb-4 border-0 py-0 shadow-[0_6px_24px_rgba(20,40,80,0.05)] ring-slate-200/80">
      <CardContent className="flex flex-nowrap items-center gap-4 overflow-x-auto p-3 md:px-4">
        <div className="flex shrink-0 gap-2">
          {assets.map((asset) => (
            <Button
              key={asset.label}
              type="button"
              variant={asset.active ? 'default' : 'outline'}
              size="sm"
              onClick={() => onNavigate(asset.id)}
              className={asset.active ? 'bg-slate-900 text-white hover:bg-slate-800' : 'border-slate-200 bg-white text-slate-600'}
            >
              <asset.icon className="size-3.5" />{asset.label}
            </Button>
          ))}
        </div>
        <div className="ml-auto flex shrink-0 items-center gap-2">
          {statistics.map((stat) => (
            <div key={stat.label} className="flex min-w-16 items-baseline justify-between gap-3 rounded-lg border border-slate-200 bg-slate-50/80 px-3 py-2 shadow-sm">
              <span className="whitespace-nowrap text-xs text-slate-500">{stat.label}</span>
              <span className="text-base font-semibold text-slate-900">{stat.value}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

function BusinessSceneOverview({ scene, onNavigate }: { scene: BusinessScene; onNavigate: (id: string) => void }) {
  const visual = sceneVisuals[scene.id];
  const blackSampleCount = countSceneRecords(scene.id, ['black-website', 'black-app']);
  const resultCount = countSceneRecords(scene.id, ['result-website', 'result-app', 'result-ip']);
  const templateCount = countSceneRecords(scene.id, ['template-fraud']);
  const frameworkCount = countSceneRecords(scene.id, ['framework-website', 'framework-app', 'framework-protocol']);
  const assetCards = [
    { label: '黑样本', value: blackSampleCount, note: blackSampleCount > 0 ? '网站、APP' : '暂无数据', icon: ShieldCheck, target: blackSampleCount > 0 ? 'black-sample' : undefined },
    { label: '研判结果', value: resultCount, note: resultCount > 0 ? '网站、APP、IP' : '暂无数据', icon: Database, target: resultCount > 0 ? 'scene-results' : undefined },
    { label: '模板及规则', value: templateCount, note: templateCount > 0 ? '6个模板、8条内嵌规则' : '暂无数据', icon: SquareStack, target: scene.templatePageId },
    { label: '框架', value: frameworkCount, note: frameworkCount > 0 ? '同源家族维度' : '暂无数据', icon: GitBranch, target: frameworkCount > 0 ? 'scene-frameworks' : undefined },
  ];

  return (
    <div className="space-y-4">
      <Card className={`border py-0 shadow-[0_10px_36px_rgba(20,40,80,0.07)] ${visual.tone}`}>
        <CardContent className="p-5 md:p-6">
          <div className="flex items-start gap-4">
            <span className={`flex size-12 shrink-0 items-center justify-center rounded-2xl ${visual.iconTone}`}><visual.icon className="size-6" /></span>
            <div>
              <p className="text-xs font-semibold tracking-[0.12em] opacity-65">业务场景视图</p>
              <h1 className="mt-2 text-2xl font-semibold tracking-tight">{scene.label}</h1>
              <p className="mt-2 max-w-3xl text-sm leading-6 opacity-75">{scene.description}</p>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {scene.scope.map((item) => <span key={item} className="rounded-md bg-white/70 px-2 py-1 text-[11px] font-medium">{item}</span>)}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-0 py-0 shadow-[0_8px_32px_rgba(20,40,80,0.06)] ring-slate-200/80">
        <CardHeader className="border-b border-slate-100 px-5 py-4">
          <CardTitle className="text-[15px] font-semibold">当前场景关联资产</CardTitle>
        </CardHeader>
        <CardContent className="p-5">
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            {assetCards.map((card) => (
              <button
                key={card.label}
                type="button"
                disabled={!card.target}
                onClick={() => card.target && onNavigate(card.target)}
                className="group rounded-xl border border-slate-200 bg-white p-4 text-left outline-none transition enabled:hover:-translate-y-0.5 enabled:hover:border-blue-200 enabled:hover:shadow-[0_12px_28px_rgba(20,60,120,0.09)] disabled:cursor-default disabled:bg-slate-50/70 focus-visible:ring-2 focus-visible:ring-blue-500"
              >
                <span className="flex items-start justify-between gap-3">
                  <span className={`flex size-9 items-center justify-center rounded-lg ${card.target ? 'bg-blue-50 text-blue-600' : 'bg-slate-100 text-slate-400'}`}><card.icon className="size-4" /></span>
                  {card.target && <ArrowRight className="size-4 text-slate-300 transition group-hover:translate-x-0.5 group-hover:text-blue-500" />}
                </span>
                <span className="mt-3 block text-xs text-slate-500">{card.label}</span>
                <span className="mt-1 block text-2xl font-semibold text-slate-900">{card.value}</span>
                <span className="mt-1 block text-xs text-slate-400">{card.note}</span>
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

    </div>
  );
}

function PlaceholderPage({ id }: { id: string }) {
  const label = labelById.get(id) ?? '页面';
  return (
    <div className="flex min-h-[62vh] items-center justify-center">
      <Card className="w-full max-w-2xl border-0 py-0 text-center ring-slate-200/80">
        <CardContent className="flex flex-col items-center px-6 py-16">
          <span className="mb-5 flex size-14 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
            <ClipboardList className="size-6" />
          </span>
          <h1 className="text-xl font-semibold text-slate-900">{label}</h1>
          <p className="mt-3 text-sm text-slate-500">功能建设中</p>
        </CardContent>
      </Card>
    </div>
  );
}

function NestedItem({ item, activeId, onSelect, depth = 0 }: { item: NavItem; activeId: string; onSelect: (id: string) => void; depth?: number }) {
  const branchActive = navItemContains(item, activeId);
  const paddingClass = depth === 0 ? 'px-2' : depth === 1 ? 'pl-4 pr-2' : 'pl-6 pr-2';

  if (item.children) {
    return (
      <SidebarMenuSubItem>
        <Collapsible defaultOpen={branchActive} className="group/nested">
          <CollapsibleTrigger className={`flex h-8 w-full items-center justify-between rounded-md text-left text-[13px] outline-none transition hover:bg-white/8 hover:text-white focus-visible:ring-2 focus-visible:ring-blue-400 ${paddingClass} ${branchActive ? 'text-white' : 'text-slate-300'}`}>
            <span className="flex min-w-0 items-center gap-2">
              <span className="size-1.5 shrink-0 rounded-full bg-current opacity-50" />
              <span className="truncate">{item.label}</span>
            </span>
            <ChevronDown className="size-3.5 transition-transform group-data-panel-open/nested:rotate-180" />
          </CollapsibleTrigger>
          <CollapsibleContent>
            <ul className="ml-2 border-l border-white/10 py-1 pl-2">
              {item.children.map((child) => (
                <NestedItem key={`${child.id}-${navItemContains(child, activeId)}`} item={child} activeId={activeId} onSelect={onSelect} depth={depth + 1} />
              ))}
            </ul>
          </CollapsibleContent>
        </Collapsible>
      </SidebarMenuSubItem>
    );
  }

  return (
    <SidebarMenuSubItem>
      <button type="button" onClick={() => onSelect(item.id)} className={`flex h-8 w-full items-center rounded-md text-left text-[13px] outline-none transition focus-visible:ring-2 focus-visible:ring-blue-400 ${paddingClass} ${activeId === item.id ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-400 hover:bg-white/8 hover:text-white'}`}>
        {item.label}
      </button>
    </SidebarMenuSubItem>
  );
}

function AppSidebar({ activeId, onSelect }: { activeId: string; onSelect: (id: string) => void }) {
  const { isMobile, setOpen } = useSidebar();

  return (
    <Sidebar
      collapsible="icon"
      onMouseEnter={() => { if (!isMobile) setOpen(true); }}
      onMouseLeave={() => { if (!isMobile) setOpen(false); }}
      className="border-r-0 bg-[#0b1630] text-white"
    >
      <SidebarHeader className="border-b border-white/8 px-4 py-4 group-data-[collapsible=icon]:px-1">
        <div className="flex items-center gap-3 group-data-[collapsible=icon]:justify-center">
          <div className="relative flex size-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-cyan-400 shadow-[0_8px_28px_rgba(37,99,235,.3)]">
            <Fingerprint className="size-5 text-white" />
          </div>
          <div className="min-w-0 group-data-[collapsible=icon]:hidden">
            <p className="truncate text-sm font-semibold tracking-wide text-white">涉诈情报管理系统</p>
            <p className="mt-0.5 text-[10px] tracking-[0.16em] text-slate-500">INTELLIGENCE CENTER</p>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent className="bg-[#0b1630] px-2 py-3">
        <SidebarGroup className="p-0">
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton onClick={() => onSelect('overview')} isActive={activeId === 'overview'} className={`h-9 rounded-lg px-3 text-[13px] ${activeId === 'overview' ? 'bg-blue-600 text-white hover:bg-blue-600' : 'text-slate-300 hover:bg-white/8 hover:text-white'}`}>
                  <House className="size-4" />
                  <span>首页 / 总览</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {navGroups.map((group) => {
          const groupActive = group.items.some((item) => navItemContains(item, activeId));
          return (
          <Collapsible key={`${group.label}-${groupActive}`} defaultOpen={groupActive} className="group/nav-section">
            <SidebarGroup className="mt-1 p-0">
              <CollapsibleTrigger className="flex h-9 w-full items-center gap-2 rounded-lg px-3 text-left text-[13px] text-slate-300 outline-none transition hover:bg-white/8 hover:text-white focus-visible:ring-2 focus-visible:ring-blue-400 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:px-0">
                <group.icon className="size-4 shrink-0" />
                <span className="min-w-0 flex-1 truncate font-medium group-data-[collapsible=icon]:hidden">{group.label}</span>
                <ChevronDown className="size-3.5 shrink-0 transition-transform group-data-panel-open/nav-section:rotate-180 group-data-[collapsible=icon]:hidden" />
              </CollapsibleTrigger>
              <CollapsibleContent>
                <SidebarMenuSub className="border-white/10 py-1">
                  {group.items.map((item) => <NestedItem key={`${item.id}-${navItemContains(item, activeId)}`} item={item} activeId={activeId} onSelect={onSelect} />)}
                </SidebarMenuSub>
              </CollapsibleContent>
            </SidebarGroup>
          </Collapsible>
          );
        })}
      </SidebarContent>
      <SidebarFooter className="border-t border-white/8 bg-[#0b1630] p-3">
        <div className="flex items-center gap-3 rounded-xl bg-white/5 px-3 py-2.5 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:px-1">
          <div className="flex size-8 items-center justify-center rounded-full bg-blue-500/15 text-blue-300"><CircleUserRound className="size-4" /></div>
          <div className="min-w-0 flex-1 group-data-[collapsible=icon]:hidden">
            <p className="truncate text-xs font-medium text-slate-200">系统用户</p>
          </div>
        </div>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}

export default function Home() {
  const [activeId, setActiveId] = useState('overview');
  const [selectedSceneId, setSelectedSceneId] = useState<BusinessSceneId | null>(null);
  const [relayCategoryId, setRelayCategoryId] = useState('all');
  const [drainageCategoryId, setDrainageCategoryId] = useState('all');
  const [fundCategoryId, setFundCategoryId] = useState('all');
  const currentPage = useMemo(() => demoPages[activeId], [activeId]);
  const currentTabbedPage = useMemo(() => tabbedDemoPages[activeId], [activeId]);
  const currentTemplateObjectType = templateObjectTypeByNavId[activeId as keyof typeof templateObjectTypeByNavId];
  const selectedScene = selectedSceneId ? businessSceneById.get(selectedSceneId) ?? null : null;

  function selectScene(sceneId: BusinessSceneId) {
    if (sceneId === 'overseas-ip') {
      setSelectedSceneId(sceneId);
      setActiveId('scene-overseas-ip');
      return;
    }
    if (sceneId === 'relay') {
      setSelectedSceneId(sceneId);
      setRelayCategoryId('all');
      setActiveId('scene-relay-overview');
      return;
    }
    if (sceneId === 'drainage') {
      setSelectedSceneId(sceneId);
      setDrainageCategoryId('all');
      setActiveId('scene-drainage-overview');
      return;
    }
    if (sceneId === 'fund') {
      setSelectedSceneId(sceneId);
      setFundCategoryId('all');
      setActiveId('scene-fund-overview');
      return;
    }
    setSelectedSceneId(sceneId);
    setActiveId('scene-overview');
  }

  function navigateFromAssetOverview(id: string) {
    setSelectedSceneId(null);
    setActiveId(id);
  }

  function navigateFromSidebar(id: string) {
    setSelectedSceneId(null);
    setActiveId(id);
  }

  function navigateWithinScene(id: string) {
    setActiveId(id);
  }

  function clearScene() {
    setSelectedSceneId(null);
    if (activeId === 'scene-overview') setActiveId('overview');
    if (activeId === 'scene-overseas-ip') setActiveId('result-ip');
    if (isRelayScenePageId(activeId)) setActiveId('overview');
    if (isDrainageScenePageId(activeId)) setActiveId('overview');
    if (isFundScenePageId(activeId)) setActiveId('overview');
    if (activeId === 'scene-results') setActiveId('result-website');
    if (activeId === 'scene-frameworks') setActiveId('framework-website');
  }

  return (
    <SidebarProvider defaultOpen style={{ '--sidebar-width': '14rem' } as React.CSSProperties}>
      <AppSidebar activeId={activeId === 'scene-overseas-ip' ? 'result-ip' : activeId} onSelect={navigateFromSidebar} />
      <SidebarInset className="min-w-0 bg-[#f5f7fb]">
        <div className="flex-1 overflow-auto p-4 md:p-6 xl:p-7">
          <div className="mx-auto w-full max-w-[1540px]">
            {selectedScene && activeId !== 'overview' && (
              <SceneContextBar scene={selectedScene} onSwitch={selectScene} onClear={clearScene} />
            )}
            {selectedScene?.id === 'relay' && isRelayScenePageId(activeId) && (
              <RelaySceneNavigation activeId={activeId} onNavigate={(id: RelayScenePageId) => setActiveId(id)} />
            )}
            {selectedScene?.id === 'drainage' && isDrainageScenePageId(activeId) && (
              <DrainageSceneNavigation activeId={activeId} onNavigate={(id: DrainageScenePageId) => setActiveId(id)} />
            )}
            {selectedScene?.id === 'fund' && isFundScenePageId(activeId) && (
              <FundSceneNavigation activeId={activeId} onNavigate={(id: FundScenePageId) => setActiveId(id)} />
            )}
            {selectedScene && selectedScene.id !== 'overseas-ip' && selectedScene.id !== 'relay' && selectedScene.id !== 'drainage' && selectedScene.id !== 'fund' && activeId !== 'overview' && activeId !== 'scene-overview' && (
              <SceneAssetSwitcher scene={selectedScene} activeId={activeId} onNavigate={navigateWithinScene} />
            )}
            {activeId === 'overview' ? (
              <Overview onNavigateAsset={navigateFromAssetOverview} onSelectScene={selectScene} />
            ) : activeId === 'scene-overview' && selectedScene ? (
              <BusinessSceneOverview scene={selectedScene} onNavigate={navigateWithinScene} />
            ) : selectedScene?.id === 'relay' && isRelayScenePageId(activeId) ? (
              <RelayScenePage
                pageId={activeId}
                initialCategory={relayCategoryId}
                onOpenCategory={(categoryId) => {
                  setRelayCategoryId(categoryId);
                  setActiveId('scene-relay-objects');
                }}
                onNavigateAsset={navigateFromAssetOverview}
              />
            ) : selectedScene?.id === 'drainage' && isDrainageScenePageId(activeId) ? (
              <DrainageScenePage
                pageId={activeId}
                initialCategory={drainageCategoryId}
                onOpenCategory={(categoryId) => {
                  setDrainageCategoryId(categoryId);
                  setActiveId('scene-drainage-objects');
                }}
                onNavigateAsset={navigateFromAssetOverview}
              />
            ) : selectedScene?.id === 'fund' && isFundScenePageId(activeId) ? (
              <FundScenePage
                pageId={activeId}
                initialCategory={fundCategoryId}
                onOpenCategory={(categoryId) => {
                  setFundCategoryId(categoryId);
                  setActiveId('scene-fund-objects');
                }}
                onNavigateAsset={navigateFromAssetOverview}
              />
            ) : activeId === 'scene-overseas-ip' && selectedScene?.id === 'overseas-ip' ? (
              <DataPage pageId="result-ip" page={overseasIpScenePage} scene={selectedScene} />
            ) : activeId === 'scene-frameworks' && selectedScene ? (
              <SceneFrameworkLibraryPage sceneId={selectedScene.id} />
            ) : currentPage ? (
              <DataPage pageId={activeId} page={currentPage} scene={selectedScene} />
            ) : currentTabbedPage ? (
              <TabbedDataPage key={`${selectedSceneId ?? 'global'}-${activeId}`} page={currentTabbedPage} scene={selectedScene} />
            ) : currentTemplateObjectType ? (
              <TemplateLibraryPage
                key={activeId}
                pageId="template-fraud"
                initialObjectType={currentTemplateObjectType}
                title={`${currentTemplateObjectType}模板`}
                onObjectTypeChange={(objectType) => {
                  const nextPage = Object.entries(templateObjectTypeByNavId).find(([, type]) => type === objectType)?.[0];
                  if (nextPage) setActiveId(nextPage);
                }}
              />
            ) : isTemplatePageId(activeId) ? (
              <TemplateLibraryPage key={activeId} pageId={activeId} embedded={Boolean(selectedScene)} />
            ) : isFrameworkPageId(activeId) ? (
              <FrameworkLibraryPage pageId={activeId} sceneId={selectedSceneId} />
            ) : (
              <PlaceholderPage id={activeId} />
            )}
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
