import { useEffect, useMemo, useState } from "react"
import {
  Activity,
  AlertTriangle,
  BarChart3,
  Bell,
  CheckCircle2,
  Clock3,
  Database,
  FileSearch,
  Gavel,
  LineChart,
  LockKeyhole,
  RefreshCw,
  ShieldAlert,
  SlidersHorizontal,
  WalletCards,
  XCircle,
  Zap,
} from "lucide-react"

import { Button } from "@/components/ui/button"

type ModuleKey =
  | "overview"
  | "markets"
  | "instrumentRules"
  | "instruments"
  | "groupRules"
  | "groups"
  | "autoOrder"
  | "orders"
  | "positions"
  | "auth"
  | "risk"
  | "reports"

type Tone = "green" | "amber" | "red" | "blue" | "neutral" | "purple"

const navItems: Array<{ key: ModuleKey; label: string; icon: typeof Activity }> = [
  { key: "overview", label: "总览", icon: Activity },
  { key: "markets", label: "市场同步", icon: Database },
  { key: "instruments", label: "可交易标的", icon: FileSearch },
  { key: "groups", label: "归组审核", icon: SlidersHorizontal },
  { key: "autoOrder", label: "智能推荐", icon: Zap },
  { key: "orders", label: "订单管理", icon: Gavel },
  { key: "positions", label: "持仓结算", icon: WalletCards },
  { key: "instrumentRules", label: "标的过滤规则", icon: SlidersHorizontal },
  { key: "groupRules", label: "事件归组规则", icon: SlidersHorizontal },
  { key: "auth", label: "API 认证", icon: LockKeyhole },
  { key: "risk", label: "风控审计", icon: ShieldAlert },
  { key: "reports", label: "数据报表", icon: BarChart3 },
]

const statusCards = [
  { label: "Polymarket API", value: "healthy", tone: "green" as Tone, detail: "CLOB 96ms" },
  { label: "Predict.fun API", value: "degraded", tone: "amber" as Tone, detail: "Orders 重试中" },
  { label: "WebSocket 心跳", value: "stable", tone: "green" as Tone, detail: "3 个频道" },
  { label: "Quote 过期", value: "12", tone: "amber" as Tone, detail: "自动隐藏" },
  { label: "订单失败率", value: "0.82%", tone: "blue" as Tone, detail: "低于阈值" },
  { label: "签名失败率", value: "0.47%", tone: "green" as Tone, detail: "护栏正常" },
]

const metrics = [
  { label: "今日 GMV", value: "$482K", trend: "+18.4%", tone: "green" as Tone },
  { label: "下单成功率", value: "97.6%", trend: "+2.1%", tone: "green" as Tone },
  { label: "活跃标的", value: "1,284", trend: "Polymarket 812", tone: "blue" as Tone },
  { label: "高匹配待确认", value: "18", trend: "仅 >=95 入队", tone: "amber" as Tone },
]

const instruments = [
  {
    id: "INS-WC-ESP",
    eventId: "EVT-WC-CHAMPION-2026",
    venueMarketId: "poly-world-cup-winner-2026",
    outcomeId: "0x21...ESP",
    outcomeName: "西班牙",
    settlementStatus: "未结算",
    title: "世界杯冠军 - 西班牙",
    eventName: "世界杯冠军",
    venue: "Polymarket",
    chain: "Polygon",
    asset: "USDC",
    odds: "0.161",
    noOdds: "0.839",
    liquidity: "$34.8M",
    status: "tradable",
    freshness: "6s",
    recommendation: "可进入推荐池",
    lastChange: "10:28 系统刷新西班牙价格",
    supportedDirections: "买 YES / 买 NO / 卖 YES / 卖 NO",
  },
  {
    id: "INS-WC-FRA",
    eventId: "EVT-WC-CHAMPION-2026",
    venueMarketId: "poly-world-cup-winner-2026",
    outcomeId: "0x32...FRA",
    outcomeName: "法国",
    settlementStatus: "未结算",
    title: "世界杯冠军 - 法国",
    eventName: "世界杯冠军",
    venue: "Polymarket",
    chain: "Polygon",
    asset: "USDC",
    odds: "0.168",
    noOdds: "0.832",
    liquidity: "$42.2M",
    status: "tradable",
    freshness: "6s",
    recommendation: "可进入推荐池",
    lastChange: "10:28 系统刷新法国价格",
    supportedDirections: "买 YES / 买 NO / 卖 YES / 卖 NO",
  },
  {
    id: "INS-WC-ENG",
    eventId: "EVT-WC-CHAMPION-2026",
    venueMarketId: "poly-world-cup-winner-2026",
    outcomeId: "0x43...ENG",
    outcomeName: "英格兰",
    settlementStatus: "未结算",
    title: "世界杯冠军 - 英格兰",
    eventName: "世界杯冠军",
    venue: "Polymarket",
    chain: "Polygon",
    asset: "USDC",
    odds: "0.111",
    noOdds: "0.889",
    liquidity: "$30.2M",
    status: "tradable",
    freshness: "7s",
    recommendation: "可进入推荐池",
    lastChange: "10:27 系统刷新英格兰价格",
    supportedDirections: "买 YES / 买 NO / 卖 YES / 卖 NO",
  },
  {
    id: "INS-WC-POR",
    eventId: "EVT-WC-CHAMPION-2026",
    venueMarketId: "poly-world-cup-winner-2026",
    outcomeId: "0x54...POR",
    outcomeName: "葡萄牙",
    settlementStatus: "未结算",
    title: "世界杯冠军 - 葡萄牙",
    eventName: "世界杯冠军",
    venue: "Polymarket",
    chain: "Polygon",
    asset: "USDC",
    odds: "0.074",
    noOdds: "0.926",
    liquidity: "$36.5M",
    status: "tradable",
    freshness: "7s",
    recommendation: "可进入推荐池",
    lastChange: "10:27 系统刷新葡萄牙价格",
    supportedDirections: "买 YES / 买 NO / 卖 YES / 卖 NO",
  },
  {
    id: "INS-2048",
    eventId: "EVT-BTC-105K-0614",
    venueMarketId: "poly-btc-105k-0614",
    outcomeId: "0x8f...YES",
    outcomeName: "YES",
    settlementStatus: "未结算",
    title: "Bitcoin above 105K on Jun 14?",
    eventName: "Bitcoin above 105K on Jun 14?",
    venue: "Polymarket",
    chain: "Polygon",
    asset: "USDC",
    odds: "0.62",
    noOdds: "0.38",
    liquidity: "$1.8M",
    status: "tradable",
    freshness: "8s",
    recommendation: "可进入推荐池",
    lastChange: "10:22 系统刷新 CLOB 价格",
    supportedDirections: "买 YES / 买 NO / 卖 YES / 卖 NO",
  },
  {
    id: "INS-2091",
    eventId: "EVT-BTC-105K-FRIDAY",
    venueMarketId: "predict-88219",
    outcomeId: "YES",
    outcomeName: "YES",
    settlementStatus: "未结算",
    title: "BTC higher than 105K by Friday?",
    eventName: "BTC higher than 105K by Friday?",
    venue: "Predict.fun",
    chain: "BNB Chain",
    asset: "USDT",
    odds: "0.61",
    noOdds: "0.39",
    liquidity: "$420K",
    status: "tradable",
    freshness: "12s",
    recommendation: "可进入推荐池",
    lastChange: "10:20 Markets 同步成功",
    supportedDirections: "买 YES / 买 NO / 卖 YES / 卖 NO",
  },
  {
    id: "INS-1880",
    eventId: "EVT-ETH-4000-WEEK",
    venueMarketId: "poly-eth-4000-week",
    outcomeId: "0x4a...YES",
    outcomeName: "YES",
    settlementStatus: "未结算",
    title: "ETH above 4,000 this week?",
    eventName: "ETH above 4,000 this week?",
    venue: "Polymarket",
    chain: "Polygon",
    asset: "USDC",
    odds: "0.44",
    noOdds: "0.56",
    liquidity: "$910K",
    status: "stale_market",
    freshness: "94s",
    recommendation: "暂停推荐",
    lastChange: "10:18 盘口超过有效期",
    supportedDirections: "买 YES / 买 NO / 卖 YES / 卖 NO",
  },
  {
    id: "INS-1744",
    eventId: "EVT-CPI-LOWER-FORECAST",
    venueMarketId: "predict-77201",
    outcomeId: "YES",
    outcomeName: "YES",
    settlementStatus: "未结算",
    title: "US CPI lower than forecast?",
    eventName: "US CPI lower than forecast?",
    venue: "Predict.fun",
    chain: "BNB Chain",
    asset: "USDT",
    odds: "0.53",
    noOdds: "0.47",
    liquidity: "$76K",
    status: "low_liquidity",
    freshness: "18s",
    recommendation: "不进入推荐池",
    lastChange: "10:15 流动性低于阈值",
    supportedDirections: "买 YES / 买 NO / 卖 YES / 卖 NO",
  },
]

const groupCandidates = [
  {
    id: "EG-883",
    title: "Bitcoin above 105K on Jun 14",
    matchRate: "96%",
    type: "高匹配建议归组",
    delta: "赔率差 0.01 / 交割一致",
    status: "manual_review",
    statusLabel: "待确认",
  },
  {
    id: "EG-884",
    title: "ETH above 4,000 this week",
    matchRate: "95%",
    type: "高匹配建议归组",
    delta: "标题差异 / 结算一致",
    status: "manual_review",
    statusLabel: "待确认",
  },
]

const autoOrders = [
  {
    id: "AO-441",
    title: "0.62 USDC 买入，若成立可变成 1 USDC",
    instrument: "INS-2048",
    score: 91,
    priority: 1,
    status: "live",
    reason: "高流动性 / 规则清晰",
    copyStatus: "已审核",
    exposure: "首页 Banner / 标的详情快捷入口",
    quoteTtl: "24s",
  },
  {
    id: "AO-388",
    title: "0.53 USDT 买入，若 CPI 低于预期可得 1 USDT",
    instrument: "INS-1744",
    score: 72,
    priority: 8,
    status: "paused",
    reason: "低流动性暂停",
    copyStatus: "已审核",
    exposure: "已隐藏",
    quoteTtl: "18s",
  },
  {
    id: "AO-355",
    title: "0.44 USDC 买入，若 ETH 突破可得 1 USDC",
    instrument: "INS-1880",
    score: 68,
    priority: 0,
    status: "delisted",
    reason: "orderbook_stale",
    copyStatus: "已下架",
    exposure: "已下架",
    quoteTtl: "已过期",
  },
  {
    id: "AO-512",
    title: "0.61 USDT 买入，若 BTC 高于 105K 可得 1 USDT",
    instrument: "INS-2091",
    score: 86,
    priority: 3,
    status: "reviewing",
    reason: "新推荐待确认",
    copyStatus: "待审核",
    exposure: "未上线",
    quoteTtl: "21s",
  },
]

const orders = [
  {
    id: "ORD-90012",
    wallet: "0x7b...91e2",
    venue: "Polymarket",
    chain: "Polygon",
    asset: "USDC",
    instrument: "INS-2048",
    eventName: "Bitcoin above 105K on Jun 14",
    optionName: "BTC above 105K",
    side: "买入",
    outcome: "YES",
    type: "Market",
    amount: "$250",
    price: "0.62",
    shares: "403.22",
    status: "filled",
    venueOrderId: "0xclob-8821",
    orderHash: "0x91e2...f4a0",
    txHash: "0x7a1...be22",
    quoteId: "Q-88721",
    signature: "EIP-712",
    createdAt: "10:21:03",
    updatedAt: "10:21:40",
    failureReason: "--",
  },
  {
    id: "ORD-90008",
    wallet: "0x34...c110",
    venue: "Predict.fun",
    chain: "BNB Chain",
    asset: "USDT",
    instrument: "INS-2091",
    eventName: "BTC higher than 105K by Friday",
    optionName: "BTC higher than 105K",
    side: "买入",
    outcome: "NO",
    type: "Limit",
    amount: "$800",
    price: "0.61",
    shares: "1,311.47",
    status: "partially_filled",
    venueOrderId: "PF-774210",
    orderHash: "0x34c...9f10",
    txHash: "0xb21...0aa8",
    quoteId: "Q-88709",
    signature: "EIP-712",
    createdAt: "10:18:31",
    updatedAt: "10:20:09",
    failureReason: "--",
  },
  {
    id: "ORD-89998",
    wallet: "0x80...aa42",
    venue: "Predict.fun",
    chain: "BNB Chain",
    asset: "USDT",
    instrument: "INS-1744",
    eventName: "US CPI lower than forecast",
    optionName: "CPI lower than forecast",
    side: "买入",
    outcome: "YES",
    type: "Market",
    amount: "$120",
    price: "0.53",
    shares: "0",
    status: "failed",
    venueOrderId: "--",
    orderHash: "--",
    txHash: "--",
    quoteId: "Q-88688",
    signature: "EIP-712 rejected by API",
    createdAt: "10:12:20",
    updatedAt: "10:12:39",
    failureReason: "Predict.fun JWT refresh failed",
  },
  {
    id: "ORD-87122",
    wallet: "0x54...aee3",
    venue: "Predict.fun",
    chain: "BNB Chain",
    asset: "USDT",
    instrument: "INS-1744",
    eventName: "US CPI lower than forecast",
    optionName: "CPI lower than forecast",
    side: "买入",
    outcome: "YES",
    type: "Market",
    amount: "$120",
    price: "0.53",
    shares: "226.41",
    status: "filled",
    venueOrderId: "PF-87122",
    orderHash: "0x871...22ab",
    txHash: "0xbsc...7122",
    quoteId: "Q-87122",
    signature: "EIP-712",
    createdAt: "09:42:11",
    updatedAt: "09:42:35",
    failureReason: "--",
  },
  {
    id: "ORD-87140",
    wallet: "0x68...bb20",
    venue: "Polymarket",
    chain: "Polygon",
    asset: "USDC",
    instrument: "INS-1880",
    eventName: "ETH above 4,000 this week",
    optionName: "ETH above 4,000",
    side: "买入",
    outcome: "NO",
    type: "Limit",
    amount: "$300",
    price: "0.56",
    shares: "535.71",
    status: "filled",
    venueOrderId: "0xclob-7140",
    orderHash: "0x714...0f12",
    txHash: "0xpoly...7140",
    quoteId: "Q-87140",
    signature: "EIP-712",
    createdAt: "09:21:19",
    updatedAt: "09:23:02",
    failureReason: "--",
  },
  {
    id: "ORD-87155",
    wallet: "0x22...fe19",
    venue: "Predict.fun",
    chain: "BNB Chain",
    asset: "USDT",
    instrument: "INS-2091",
    eventName: "BTC higher than 105K by Friday",
    optionName: "BTC higher than 105K",
    side: "买入",
    outcome: "YES",
    type: "Market",
    amount: "$500",
    price: "0.61",
    shares: "819.67",
    status: "filled",
    venueOrderId: "PF-87155",
    orderHash: "0x871...55cd",
    txHash: "0xbsc...7155",
    quoteId: "Q-87155",
    signature: "EIP-712",
    createdAt: "09:10:42",
    updatedAt: "09:11:06",
    failureReason: "--",
  },
]

const settlements = [
  {
    id: "SET-320",
    title: "Bitcoin above 105K on Jun 14",
    wallet: "0x7b...91e2",
    orderId: "ORD-90012",
    instrumentId: "INS-2048",
    eventName: "Bitcoin above 105K on Jun 14",
    optionName: "BTC above 105K",
    venue: "Polymarket",
    side: "买入",
    outcome: "YES",
    result: "YES 成立",
    position: "403.22 YES",
    settlementAmount: "$403.22",
    pnl: "+$96.40",
    status: "claimable",
    notice: "待发送",
    action: "可通知用户领取",
  },
  {
    id: "SET-319",
    title: "ETH above 4,000 this week",
    wallet: "0x91...5bc2",
    orderId: "ORD-88810",
    instrumentId: "INS-1880",
    eventName: "ETH above 4,000 this week",
    optionName: "ETH above 4,000",
    venue: "Polymarket",
    side: "买入",
    outcome: "YES",
    result: "YES 未成立",
    position: "120.00 YES",
    settlementAmount: "$0.00",
    pnl: "-$42.00",
    status: "settled",
    notice: "已发送",
    action: "无需处理",
  },
  {
    id: "SET-310",
    title: "US CPI lower than forecast",
    wallet: "0x54...aee3",
    orderId: "ORD-87122",
    instrumentId: "INS-1744",
    eventName: "US CPI lower than forecast",
    optionName: "CPI lower than forecast",
    venue: "Predict.fun",
    side: "买入",
    outcome: "YES",
    result: "待人工确认",
    position: "226.41 YES",
    settlementAmount: "--",
    pnl: "--",
    status: "settlement_error",
    notice: "不发送",
    action: "已暂停相关标的",
  },
  {
    id: "SET-311",
    title: "ETH above 4,000 this week",
    wallet: "0x68...bb20",
    orderId: "ORD-87140",
    instrumentId: "INS-1880",
    eventName: "ETH above 4,000 this week",
    optionName: "ETH above 4,000",
    venue: "Polymarket",
    side: "买入",
    outcome: "NO",
    result: "底层平台未返回结果",
    position: "535.71 NO",
    settlementAmount: "--",
    pnl: "--",
    status: "settlement_error",
    notice: "不发送",
    action: "等待创建复核任务",
  },
  {
    id: "SET-312",
    title: "BTC higher than 105K by Friday",
    wallet: "0x22...fe19",
    orderId: "ORD-87155",
    instrumentId: "INS-2091",
    eventName: "BTC higher than 105K by Friday",
    optionName: "BTC higher than 105K",
    venue: "Predict.fun",
    side: "买入",
    outcome: "YES",
    result: "平台结果与本地缓存不一致",
    position: "819.67 YES",
    settlementAmount: "--",
    pnl: "--",
    status: "settlement_error",
    notice: "不发送",
    action: "已有复核任务",
  },
]

const settlementReviewTasks = [
  {
    id: "REV-310",
    settlementId: "SET-310",
    orderId: "ORD-87122",
    eventName: "US CPI lower than forecast",
    venue: "Predict.fun",
    status: "待核对底层结果",
    owner: "结算运营",
    nextStep: "核对 Predict.fun 事件结果、用户持仓和可领取金额",
    createdAt: "10:34",
  },
  {
    id: "REV-312",
    settlementId: "SET-312",
    orderId: "ORD-87155",
    eventName: "BTC higher than 105K by Friday",
    venue: "Predict.fun",
    status: "待确认结算金额",
    owner: "结算运营",
    nextStep: "核对平台结果与本地缓存差异，并确认用户可领取金额",
    createdAt: "10:41",
  },
]

const riskRecords = [
  {
    id: "RISK-118",
    target: "Predict.fun WebSocket",
    targetName: "Predict.fun WebSocket 心跳",
    targetKind: "平台连接",
    type: "websocket_heartbeat_lost",
    reason: "WebSocket 心跳连续 3 次未响应",
    action: "启用降级轮询",
    frontendImpact: "Predict.fun 标的行情由实时推送临时切换为定时刷新，快捷交易 Quote 有效期缩短并加强过期提示",
    status: "拦截中",
    recoverCondition: "WebSocket 连续 5 分钟心跳正常，且行情延迟低于 2 秒后恢复实时推送",
    owner: "运营手动",
    time: "刚刚",
    auditTrail: ["10:31 WebSocket market 频道心跳超时", "10:32 自动重连 2 次失败", "10:33 运营点击降级轮询", "10:33 行情同步改为 5 秒轮询"],
  },
  {
    id: "RISK-112",
    target: "INS-1880",
    targetName: "ETH above 4,000 this week?",
    targetKind: "可交易标的",
    type: "orderbook_stale",
    reason: "盘口价格超过有效时间",
    action: "隐藏下单报价",
    frontendImpact: "快捷交易和专业交易不展示可点击报价",
    status: "拦截中",
    recoverCondition: "连续 2 次获取到 30 秒内的新盘口",
    owner: "系统自动",
    time: "2 分钟前",
    auditTrail: ["10:18 检测到盘口超过 90 秒未更新", "10:18 隐藏 Quote 与快捷下单入口", "10:19 等待下一次盘口刷新"],
  },
  {
    id: "RISK-109",
    target: "Predict.fun",
    targetName: "Predict.fun",
    targetKind: "底层平台",
    type: "auth_failed",
    reason: "平台认证失败",
    action: "暂停新下单",
    frontendImpact: "Predict.fun 相关标的仍可查看，但确认下单按钮不可用",
    status: "待处理",
    recoverCondition: "API Key / JWT 重新检测通过，并补同步受影响订单",
    owner: "系统自动",
    time: "8 分钟前",
    auditTrail: ["10:21 JWT 刷新失败", "10:22 自动重试 3 次失败", "10:23 暂停 Predict.fun 新下单"],
  },
  {
    id: "RISK-100",
    target: "AO-355",
    targetName: "BTC 0.88 USDC 快捷买入推荐",
    targetKind: "智能推荐",
    type: "low_liquidity",
    reason: "流动性低于推荐阈值",
    action: "下架推荐入口",
    frontendImpact: "首页 Banner 和快捷下单推荐卡片不再展示",
    status: "已处理",
    recoverCondition: "流动性恢复到阈值以上后重新进入推荐审核",
    owner: "系统自动",
    time: "19 分钟前",
    auditTrail: ["10:04 流动性降至 $72K", "10:05 自动下架推荐 AO-355", "10:06 写入智能推荐操作记录"],
  },
]

const reports = [
  { label: "DAU", value: "18,420", split: "简洁 61% / 专业 39%" },
  { label: "平台订单分布", value: "Polymarket 64% / Predict.fun 36%", split: "按 venue 实时刷新" },
  { label: "API 故障时长", value: "13m", split: "Predict Orders 主要贡献" },
  { label: "主页加载增加", value: "128ms", split: "低于 200ms 护栏" },
]

const apiHealthRows = [
  {
    id: "poly-gamma",
    venue: "Polymarket",
    api: "Gamma",
    status: "healthy",
    latency: "88ms",
    impact: "0 标的",
    primary: "详情",
    more: ["立即检测", "日志"],
    suggestion: "健康，定期检测即可",
    flowTitle: "详情流程",
    flow:
      "打开 API 健康详情，展示市场元数据同步成功率、平均延迟、最近同步时间、最近错误、影响标的数、重试记录和最近 10 条日志。",
  },
  {
    id: "poly-data",
    venue: "Polymarket",
    api: "Data",
    status: "healthy",
    latency: "104ms",
    impact: "0 标的",
    primary: "详情",
    more: ["立即检测", "日志"],
    suggestion: "健康，定期检测即可",
    flowTitle: "详情流程",
    flow:
      "打开 API 健康详情，展示历史成交、价格、持仓类数据同步成功率、平均延迟、最近错误和影响范围。",
  },
  {
    id: "poly-clob",
    venue: "Polymarket",
    api: "CLOB",
    status: "healthy",
    latency: "96ms",
    impact: "0 标的",
    primary: "详情",
    more: ["立即检测", "日志"],
    suggestion: "健康，定期检测即可",
    flowTitle: "详情流程",
    flow:
      "打开 API 健康详情，展示盘口、Quote、下单、撤单、用户订单同步能力，以及最近错误、影响标的和审计记录。",
  },
  {
    id: "predict-markets",
    venue: "Predict.fun",
    api: "Markets / Search",
    status: "healthy",
    latency: "122ms",
    impact: "0 标的",
    primary: "详情",
    more: ["立即检测", "日志"],
    suggestion: "健康，定期检测即可",
    flowTitle: "详情流程",
    flow:
      "打开 API 健康详情，展示市场发现、分类、搜索和原始市场同步成功率，以及最近错误和影响范围。",
  },
  {
    id: "predict-orders",
    venue: "Predict.fun",
    api: "Orders",
    status: "degraded",
    latency: "440ms",
    impact: "23 标的",
    primary: "详情",
    more: ["手动重试", "暂停下单", "失败订单"],
    suggestion: "已降级，先确认影响范围",
    flowTitle: "异常处理流程",
    flow:
      "进入降级处理面板，先展示失败率、频控、重试次数和影响标的；运营可手动重试、暂停 Predict.fun 下单、切为仅展示或查看失败订单。所有动作写入审计日志。",
  },
  {
    id: "predict-ws",
    venue: "Predict.fun",
    api: "WebSocket",
    status: "stable",
    latency: "31ms",
    impact: "0 标的",
    primary: "心跳",
    more: ["手动重连", "降级轮询", "日志"],
    suggestion: "连接稳定，关注心跳",
    flowTitle: "心跳监控流程",
    flow:
      "打开 WebSocket 连接监控，展示 market / user / orderbook 频道、最近心跳时间、断线次数、重连次数和降级轮询状态。连接异常时可手动重连或启用轮询。",
  },
]

const rawMarketRows = [
  { venue: "Polymarket", source: "Gamma", title: "Bitcoin above 105K on Jun 14?", status: "success", error: "--", candidate: "是" },
  { venue: "Predict.fun", source: "Markets", title: "BTC higher than 105K by Friday?", status: "success", error: "--", candidate: "是" },
  { venue: "Predict.fun", source: "Search", title: "US CPI lower than forecast?", status: "rate_limited", error: "429 / 重试中", candidate: "否" },
  { venue: "Polymarket", source: "CLOB", title: "ETH above 4,000 this week?", status: "orderbook_stale", error: "盘口超过有效期", candidate: "否" },
]

const instrumentRuleWeights = [
  {
    name: "流动性",
    weight: 30,
    description: "用盘口深度和价差衡量用户是否能顺畅成交",
    sourceFields: ["liquidityUsd", "depthUsdWithin2Pct", "bestBid", "bestAsk", "spreadBps", "orderbookUpdatedAt"],
    scoreRule: "按可成交金额、2% 价差内深度、买卖价差和盘口更新时间打分。",
    scoreBands: [
      "depthUsdWithin2Pct >= $1M 且 spreadBps <= 150：90-100 分",
      "$300K <= depthUsdWithin2Pct < $1M 且 spreadBps <= 250：75-89 分",
      "$100K <= depthUsdWithin2Pct < $300K：55-74 分",
      "depthUsdWithin2Pct < $100K 或 spreadBps > 500：0-54 分",
      "orderbookUpdatedAt 超过有效期：最高 40 分",
    ],
    example: "$1.8M 且价差正常 = 100 分",
  },
  {
    name: "成交量/热度",
    weight: 20,
    description: "用成交、持仓和原平台热度衡量是否值得展示",
    sourceFields: ["volume24hUsd", "tradeCount24h", "openInterestUsd", "venueHotRank", "watchlistCount"],
    scoreRule: "按 24h 成交额、成交次数、open interest、原平台热门排序和收藏/关注数量打分。",
    scoreBands: [
      "venueHotRank <= 20 且 volume24hUsd >= $500K：90-100 分",
      "volume24hUsd >= $100K 或 tradeCount24h >= 100：70-89 分",
      "volume24hUsd >= $20K 或 tradeCount24h >= 20：45-69 分",
      "长期无成交或 openInterestUsd 极低：0-44 分",
    ],
    example: "热门榜 Top 10 + 高频成交 = 95 分",
  },
  {
    name: "规则清晰度",
    weight: 20,
    description: "用标准化字段完整度衡量用户能否理解事件如何开奖",
    sourceFields: ["hasResolutionSource", "hasResolutionRule", "hasEndTime", "hasOutcomeMapping", "ruleParseStatus", "descriptionCompleteness"],
    scoreRule: "按结算来源、结算规则、到期时间、选项映射和规则解析状态打分。",
    scoreBands: [
      "结算来源、规则、到期时间、选项映射全部完整且 ruleParseStatus=clear：90-100 分",
      "缺少 1 个非关键字段或描述较弱：70-89 分",
      "缺少结算规则入口或解析结果为 ambiguous：40-69 分",
      "结算来源缺失、描述无法解析、结果定义冲突：0-39 分，并可被强制规则拦截",
    ],
    example: "有结算规则链接和明确数据源 = 92 分",
  },
  {
    name: "到期时间",
    weight: 15,
    description: "用到期时间窗口衡量是否适合一期交易和推荐",
    sourceFields: ["endTime", "hoursToClose", "settlementWindowHours", "isTradingClosed"],
    scoreRule: "按距离停止交易/结算时间、结算窗口长度和交易关闭状态打分。",
    scoreBands: [
      "6 小时 <= hoursToClose <= 30 天：90-100 分",
      "2 小时 <= hoursToClose < 6 小时：60-79 分",
      "30 天 < hoursToClose <= 90 天：55-75 分",
      "hoursToClose < 2 小时、已停止交易或无明确 endTime：0-50 分",
    ],
    example: "3 天后到期 = 95 分",
  },
  {
    name: "API 可交易性",
    weight: 15,
    description: "用标准化交易能力字段判断是否能真实下单和追踪",
    sourceFields: ["orderbookStatus", "quoteAvailable", "canPlaceOrder", "canCancelOrder", "canQueryOrder", "canQueryPosition", "authStatus", "chainSupported", "collateralSupported"],
    scoreRule: "按盘口、Quote、下单、撤单、订单查询、持仓查询、认证、链和资产支持状态打分。",
    scoreBands: [
      "全部交易能力可用，authStatus=valid：95-100 分",
      "非核心查询能力降级但下单/撤单可用：70-94 分",
      "Quote 或订单状态查询不稳定：40-69 分",
      "下单接口不可用、认证失败、链或资产不支持：0-39 分",
    ],
    example: "CLOB 与订单查询正常 = 100 分",
  },
]

const instrumentFilterRules = [
  { id: "IFR-001", rule: "敏感关键词", condition: "标题/描述/标签/分类/结算规则命中：election, president, sanction", action: "进入人工审核", status: "启用" },
  { id: "IFR-003", rule: "到期时间过近", condition: "到期时间早于 2026-06-11T12:00", action: "直接过滤", status: "启用" },
  { id: "IFR-004", rule: "受限分类", condition: "分类命中：政治, 战争, 制裁", action: "进入人工审核", status: "启用" },
  { id: "IFR-005", rule: "规则不清晰", condition: "结算来源缺失或描述无法解析", action: "进入人工审核", status: "启用" },
]

const instrumentRulePreview = [
  { title: "Bitcoin above 105K on Jun 14?", venue: "Polymarket", score: 91, decision: "进入可交易标的", reason: "流动性 100 / 热度 95 / 规则 92 / API 100", next: "进入智能推荐候选池" },
  { title: "BTC higher than 105K by Friday?", venue: "Predict.fun", score: 86, decision: "进入可交易标的", reason: "热度高，但流动性低于 Polymarket", next: "进入智能推荐候选池" },
  { title: "US CPI lower than forecast?", venue: "Predict.fun", score: 68, decision: "人工审核", reason: "流动性偏低，结算口径需要确认", next: "审核通过后才进入可交易标的" },
  { title: "Regional election outcome?", venue: "Polymarket", score: 54, decision: "人工审核", reason: "标题/描述命中敏感关键词", next: "审核通过后才进入可交易标的" },
]

const admissionCandidates = [
  {
    id: "ADM-1024",
    rawMarketId: "RAW-PRED-77201",
    venue: "Predict.fun",
    source: "Markets",
    title: "US CPI lower than forecast?",
    score: 68,
    status: "待审核",
    trigger: "推荐分处于人工审核区间",
    reason: "流动性偏低，结算口径需要确认",
    liquidityUsd: "$76K",
    volume24hUsd: "$18K",
    endTime: "2026-06-16 12:30 UTC",
    ruleParseStatus: "ambiguous",
    sensitiveHit: "未命中",
    apiTradable: "Quote 可用 / 下单可用 / 持仓查询可用",
    sourceFields: "liquidityUsd, volume24hUsd, resolutionRuleText, ruleParseStatus, canPlaceOrder",
    nextAction: "通过后生成 TradeableInstrument；拒绝后不进入本平台",
  },
  {
    id: "ADM-1025",
    rawMarketId: "RAW-POLY-91991",
    venue: "Polymarket",
    source: "Gamma",
    title: "Regional election outcome?",
    score: 54,
    status: "待审核",
    trigger: "命中敏感关键词强制人工审核",
    reason: "标题/描述命中 sensitiveKeywords：election",
    liquidityUsd: "$640K",
    volume24hUsd: "$92K",
    endTime: "2026-07-08 23:59 UTC",
    ruleParseStatus: "clear",
    sensitiveHit: "election",
    apiTradable: "Quote 可用 / CLOB 可下单 / 持仓查询可用",
    sourceFields: "rawTitle, description, tags, category, resolutionRuleText",
    nextAction: "需运营判断是否符合平台准入政策",
  },
]

const groupRuleWeights = [
  {
    name: "主题语义相似",
    weight: 25,
    description: "用标题、描述、关键词和分类判断是否指向同一事件",
    sourceFields: ["normalizedTitle", "rawTitle", "description", "category", "tags", "semanticEmbeddingScore"],
    scoreRule: "按标题语义、关键词、分类和描述相似度打分。",
    scoreBands: [
      "semanticEmbeddingScore >= 0.92 且核心关键词一致：90-100 分",
      "0.82 <= semanticEmbeddingScore < 0.92 且分类一致：70-89 分",
      "0.68 <= semanticEmbeddingScore < 0.82：45-69 分",
      "semanticEmbeddingScore < 0.68 或主题范围不同：0-44 分",
    ],
    example: "Bitcoin above 105K / BTC higher than 105K = 96 分",
  },
  {
    name: "结果定义一致",
    weight: 30,
    description: "用结果选项和成立条件判断用户买的是不是同一件事",
    sourceFields: ["outcomeName", "outcomeSide", "outcomeDefinition", "thresholdValue", "comparisonOperator", "unit"],
    scoreRule: "按结果选项、阈值、方向、单位和成立条件一致性打分。",
    scoreBands: [
      "outcomeDefinition、thresholdValue、comparisonOperator、unit 全部一致：95-100 分",
      "表述不同但阈值、方向和单位一致：80-94 分",
      "阈值或方向存在轻微歧义：40-79 分",
      "结果定义不同、买 YES 含义不同或多选项范围不同：0-39 分",
    ],
    example: "BTC 高于 105K 且 YES 含义一致 = 98 分",
  },
  {
    name: "结算时间一致",
    weight: 15,
    description: "用到期时间、结算窗口和时区判断是否同一开奖周期",
    sourceFields: ["endTime", "closeTime", "resolutionTime", "timezone", "settlementWindowHours"],
    scoreRule: "按结束时间差、结算窗口和时区换算结果打分。",
    scoreBands: [
      "结束时间差 <= 5 分钟且结算窗口一致：95-100 分",
      "结束时间差 <= 1 小时：75-94 分",
      "结束时间差 <= 12 小时：40-74 分",
      "结束时间差 > 12 小时或无明确时间：0-39 分",
    ],
    example: "同为 2026-06-14 23:59 UTC = 100 分",
  },
  {
    name: "结算规则一致",
    weight: 25,
    description: "用数据源、判定口径和异常处理规则判断是否会按同一标准开奖",
    sourceFields: ["resolutionSource", "resolutionRuleText", "oracleSource", "dataProvider", "tieBreakRule", "ruleParseStatus"],
    scoreRule: "按结算来源、数据口径、异常处理和规则解析状态打分。",
    scoreBands: [
      "resolutionSource、数据口径、异常处理全部一致：95-100 分",
      "来源一致但描述细节略有差异：75-94 分",
      "来源不同但可人工确认等价：45-74 分",
      "判定口径冲突、异常处理不同或规则无法解析：0-44 分",
    ],
    example: "均以 Coinbase BTC/USD 结算价判定 = 96 分",
  },
  {
    name: "交易参数一致性",
    weight: 5,
    description: "用价格、交易状态、可交易性辅助判断是否适合放在同主题展示",
    sourceFields: ["probability", "bestAsk", "bestBid", "tradableStatus", "marketType", "collateralToken", "chainId"],
    scoreRule: "交易参数只作低权重辅助，不决定是否同一事件。",
    scoreBands: [
      "交易状态均可交易且概率差 <= 5%：90-100 分",
      "均可交易但概率差 5%-15%：65-89 分",
      "其中一方仅展示或流动性偏低：40-64 分",
      "市场类型冲突或一方已关闭：0-39 分",
    ],
    example: "两边都可交易，概率差 1% = 95 分",
  },
]

type ApiHealthRow = (typeof apiHealthRows)[number]
type GroupCandidate = (typeof groupCandidates)[number]
type AutoOrder = (typeof autoOrders)[number]
type OrderItem = (typeof orders)[number]
type SettlementItem = (typeof settlements)[number]
type SettlementReviewTask = (typeof settlementReviewTasks)[number]
type RiskRecord = (typeof riskRecords)[number]
type InstrumentScoringRule = (typeof instrumentRuleWeights)[number]
type InstrumentFilterRule = (typeof instrumentFilterRules)[number]
type GroupScoringRule = (typeof groupRuleWeights)[number]
type AdmissionCandidate = (typeof admissionCandidates)[number]
type DetailView = "api" | "batchSync" | "instrument" | "instrumentScoreRule" | "instrumentRuleCreate" | "instrumentForceRuleView" | "admissionReview" | "groupScoreRule" | "group" | "autoOrder" | "order" | "settlement" | "auth" | "risk"
type RawMarketRow = (typeof rawMarketRows)[number]

const apiDirectActions = ["立即检测", "刷新健康", "手动重试", "暂停下单", "手动重连", "降级轮询", "同步该来源", "同步当前筛选来源"]

const groupReviewDetails: Record<string, {
  instruments: Array<{
    id: string
    venue: string
    chain: string
    asset: string
    title: string
    outcome: string
    price: string
    liquidity: string
    closeTime: string
    rule: string
    source: string
  }>
  checks: Array<[string, string, Tone]>
  diffs: Array<[string, string, string, Tone]>
  audit: string[]
}> = {
  "EG-883": {
    instruments: [
      {
        id: "INS-2048",
        venue: "Polymarket",
        chain: "Polygon",
        asset: "USDC",
        title: "Bitcoin above 105K on Jun 14?",
        outcome: "YES",
        price: "0.62",
        liquidity: "$1.8M",
        closeTime: "2026-06-14 23:59 UTC",
        rule: "Coinbase BTC/USD 结算价高于 105,000",
        source: "Gamma / CLOB",
      },
      {
        id: "INS-2091",
        venue: "Predict.fun",
        chain: "BNB Chain",
        asset: "USDT",
        title: "BTC higher than 105K by Friday?",
        outcome: "YES",
        price: "0.61",
        liquidity: "$420K",
        closeTime: "2026-06-14 23:59 UTC",
        rule: "Coinbase BTC/USD 结算价高于 105,000",
        source: "Markets / Orders",
      },
    ],
    checks: [
      ["主题/问题", "一致", "green"],
      ["结果定义", "一致", "green"],
      ["结算时间", "一致", "green"],
      ["结算规则", "一致", "green"],
      ["赔率/价格", "接近，需前台分别展示", "amber"],
      ["抵押资产口径", "USDC / USDT，不影响主题归组", "amber"],
      ["交易状态", "均可交易", "green"],
    ],
    diffs: [
      ["标题/问题", "Bitcoin above 105K on Jun 14?", "BTC higher than 105K by Friday?", "green"],
      ["结果定义", "BTC 结算价高于 105,000", "BTC 结算价高于 105,000", "green"],
      ["结算时间", "2026-06-14 23:59 UTC", "2026-06-14 23:59 UTC", "green"],
      ["结算规则", "Coinbase BTC/USD 结算价", "Coinbase BTC/USD 结算价", "green"],
      ["赔率/价格", "0.62", "0.61", "amber"],
      ["抵押资产", "USDC", "USDT", "amber"],
      ["交易状态", "可交易", "可交易", "green"],
      ["流动性", "$1.8M", "$420K", "amber"],
      ["底层平台", "Polymarket", "Predict.fun", "blue"],
      ["交易链", "Polygon", "BNB Chain", "blue"],
    ],
    audit: ["匹配度 96%", "关键交易参数通过 5/7", "建议同主题归组展示，不合并盘口"],
  },
  "EG-884": {
    instruments: [
      {
        id: "INS-3301",
        venue: "Polymarket",
        chain: "Polygon",
        asset: "USDC",
        title: "Ethereum above $4,000 this week?",
        outcome: "YES",
        price: "0.44",
        liquidity: "$910K",
        closeTime: "2026-06-19 23:59 UTC",
        rule: "Coinbase ETH/USD 结算价在本周结束时高于 4,000",
        source: "Gamma / CLOB",
      },
      {
        id: "INS-3312",
        venue: "Predict.fun",
        chain: "BNB Chain",
        asset: "USDT",
        title: "ETH above 4,000 this week?",
        outcome: "YES",
        price: "0.43",
        liquidity: "$520K",
        closeTime: "2026-06-19 23:59 UTC",
        rule: "Coinbase ETH/USD 结算价在本周结束时高于 4,000",
        source: "Markets / Orders",
      },
    ],
    checks: [
      ["主题/问题", "一致", "green"],
      ["结果定义", "一致", "green"],
      ["结算时间", "一致", "green"],
      ["结算规则", "一致", "green"],
      ["赔率/价格", "接近，需前台分别展示", "amber"],
      ["抵押资产口径", "USDC / USDT，不影响主题归组", "amber"],
      ["交易状态", "均可交易", "green"],
    ],
    diffs: [
      ["标题/问题", "Ethereum above $4,000 this week?", "ETH above 4,000 this week?", "green"],
      ["结果定义", "ETH 高于 4,000", "ETH 高于 4,000", "green"],
      ["结算时间", "2026-06-19 23:59 UTC", "2026-06-19 23:59 UTC", "green"],
      ["结算规则", "Coinbase ETH/USD 结算价", "Coinbase ETH/USD 结算价", "green"],
      ["赔率/价格", "0.44", "0.43", "amber"],
      ["抵押资产", "USDC", "USDT", "amber"],
      ["交易状态", "可交易", "可交易", "green"],
      ["流动性", "$910K", "$520K", "amber"],
      ["底层平台", "Polymarket", "Predict.fun", "blue"],
      ["交易链", "Polygon", "BNB Chain", "blue"],
    ],
    audit: ["匹配度 95%", "关键交易参数通过 5/7", "建议同主题归组展示，不合并盘口"],
  },
}

const authResources = [
  {
    id: "AUTH-POLY-CLOB",
    name: "Polymarket 交易凭证",
    platform: "Polymarket",
    credentialType: "CLOB L2",
    usage: "下单 / 撤单 / 用户订单",
    status: "valid",
    lastError: "--",
    impact: "0 订单",
    expiresAt: "长期有效，需按安全策略轮换",
    lastChecked: "10:31",
    owner: "交易服务",
    affectedActions: ["下单：正常", "撤单：正常", "订单同步：正常"],
    audit: ["10:31 系统检测通过", "09:00 安全巡检通过", "昨日 18:20 凭证轮换完成"],
  },
  {
    id: "AUTH-PRED-KEY",
    name: "Predict.fun 主网 API Key",
    platform: "Predict.fun",
    credentialType: "API Key",
    usage: "市场 / 订单 / 持仓接口请求",
    status: "valid",
    lastError: "--",
    impact: "0 标的",
    expiresAt: "2026-07-10",
    lastChecked: "10:30",
    owner: "API 适配服务",
    affectedActions: ["市场同步：正常", "订单提交：正常", "持仓查询：正常"],
    audit: ["10:30 系统检测通过", "09:12 未触发频控", "昨日 21:05 Key 权限校验通过"],
  },
  {
    id: "AUTH-PRED-JWT",
    name: "Predict.fun 用户私有数据令牌",
    platform: "Predict.fun",
    credentialType: "JWT",
    usage: "用户订单流 / 私有成交 / 持仓同步",
    status: "auth_failed",
    lastError: "refresh failed",
    impact: "8 订单",
    expiresAt: "已过期",
    lastChecked: "10:29",
    owner: "订单同步服务",
    affectedActions: ["用户订单流：阻断", "成交补同步：需重试", "持仓刷新：降级为轮询"],
    audit: ["10:29 JWT 刷新失败", "10:25 自动重试 3 次", "10:21 已暂停 Predict.fun 私有流自动推荐"],
  },
]

function toneClass(tone: Tone) {
  const tones = {
    green: "border-emerald-200 bg-emerald-50 text-emerald-800",
    amber: "border-amber-200 bg-amber-50 text-amber-800",
    red: "border-rose-200 bg-rose-50 text-rose-800",
    blue: "border-sky-200 bg-sky-50 text-sky-800",
    purple: "border-violet-200 bg-violet-50 text-violet-800",
    neutral: "border-zinc-200 bg-zinc-50 text-zinc-700",
  }
  return tones[tone]
}

function statusTone(status: string): Tone {
  if (["healthy", "stable", "valid", "tradable", "live", "filled", "claimable", "settled", "published", "synced"].includes(status)) return "green"
  if (["running", "degraded", "manual_review", "reviewing", "paused", "partially_filled", "low_liquidity"].includes(status)) return "amber"
  if (["failed", "auth_failed", "stale_market", "settlement_error", "delisted", "rejected"].includes(status)) return "red"
  return "blue"
}

function authStatusText(status: string) {
  if (status === "valid") return "正常"
  if (status === "auth_failed") return "认证失败"
  if (status === "paused") return "已暂停"
  if (status === "expired") return "已过期"
  return status
}

function Badge({ children, tone = "neutral" }: { children: React.ReactNode; tone?: Tone }) {
  return (
    <span className={`inline-flex items-center rounded-md border px-2 py-1 text-xs font-medium ${toneClass(tone)}`}>
      {children}
    </span>
  )
}

function Panel({ title, action, children }: { title: string; action?: React.ReactNode; children: React.ReactNode }) {
  return (
    <section className="min-w-0 rounded-lg border bg-card">
      <header className="flex items-center justify-between gap-4 border-b px-4 py-3">
        <h2 className="text-sm font-semibold text-foreground">{title}</h2>
        {action}
      </header>
      <div className="p-4">{children}</div>
    </section>
  )
}

function StatCard({ label, value, trend, tone }: { label: string; value: string; trend: string; tone: Tone }) {
  return (
    <div className="rounded-lg border bg-card p-4">
      <div className="text-xs text-muted-foreground">{label}</div>
      <div className="mt-2 flex items-end justify-between gap-3">
        <div className="text-2xl font-semibold">{value}</div>
        <Badge tone={tone}>{trend}</Badge>
      </div>
    </div>
  )
}

function DataTable({
  columns,
  rows,
}: {
  columns: string[]
  rows: Array<Array<React.ReactNode>>
}) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[760px] border-separate border-spacing-0 text-left text-sm">
        <thead>
          <tr>
            {columns.map((column) => (
              <th key={column} className="border-b bg-muted/60 px-3 py-2 text-xs font-medium text-muted-foreground">
                {column}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, rowIndex) => (
            <tr key={rowIndex} className="hover:bg-muted/30">
              {row.map((cell, cellIndex) => (
                <td key={cellIndex} className="border-b px-3 py-3 align-middle">
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

type ListFilterState = {
  keyword: string
  status: string
}

function createFilter() {
  return { keyword: "", status: "全部" }
}

function itemMatchesFilter(searchText: string, statusText: string, filter: ListFilterState) {
  const keyword = filter.keyword.trim().toLowerCase()
  const matchesKeyword = !keyword || searchText.toLowerCase().includes(keyword)
  const matchesStatus = filter.status === "全部" || statusText === filter.status
  return matchesKeyword && matchesStatus
}

function ListToolbar({
  filter,
  statusOptions,
  onChange,
  keywordPlaceholder = "搜索关键词",
  statusLabel = "状态",
}: {
  filter: ListFilterState
  statusOptions: string[]
  onChange: (next: ListFilterState) => void
  keywordPlaceholder?: string
  statusLabel?: string
}) {
  return (
    <div className="mb-4 flex flex-col gap-3 rounded-lg border bg-zinc-50 p-3 lg:flex-row lg:items-center">
      <input
        className="h-10 min-w-0 flex-1 rounded-md border bg-white px-3 text-sm outline-none focus:border-zinc-900"
        placeholder={keywordPlaceholder}
        value={filter.keyword}
        onChange={(event) => onChange({ ...filter, keyword: event.target.value })}
      />
      <label className="flex items-center gap-2 text-sm text-muted-foreground">
        {statusLabel}
        <select
          className="h-10 rounded-md border bg-white px-3 text-sm text-foreground outline-none focus:border-zinc-900"
          value={filter.status}
          onChange={(event) => onChange({ ...filter, status: event.target.value })}
        >
          {["全部", ...statusOptions].map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </label>
    </div>
  )
}

function Modal({
  title,
  children,
  onClose,
}: {
  title: string
  children: React.ReactNode
  onClose: () => void
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4">
      <div className="flex max-h-[88vh] w-full max-w-6xl flex-col rounded-lg border bg-white shadow-xl">
        <div className="flex items-center justify-between border-b px-4 py-3">
          <h3 className="text-sm font-semibold">{title}</h3>
          <Button size="sm" variant="outline" onClick={onClose}>关闭</Button>
        </div>
        <div className="min-h-0 overflow-y-auto p-4">{children}</div>
      </div>
    </div>
  )
}

function FieldGrid({ items }: { items: Array<[string, React.ReactNode]> }) {
  return (
    <div className="grid gap-3 md:grid-cols-2">
      {items.map(([label, value]) => (
        <Info key={label} label={label} value={String(value)} />
      ))}
    </div>
  )
}

function ReviewResult({ value }: { value: string }) {
  if (value === "pending") return <Badge tone="amber">待确认</Badge>
  if (value === "approved") return <Badge tone="green">已同意，待发布</Badge>
  if (value === "rejected") return <Badge tone="red">已拒绝</Badge>
  if (value === "paused") return <Badge tone="red">已暂停</Badge>
  if (value === "published") return <Badge tone="green">已上线</Badge>
  if (value === "delisted") return <Badge tone="red">已下架</Badge>
  if (value === "copy_edit") return <Badge tone="amber">文案已修改</Badge>
  if (value === "checked") return <Badge tone="green">检测完成</Badge>
  if (value === "rotated") return <Badge tone="green">凭证已刷新</Badge>
  if (value === "audit") return <Badge tone="blue">审计已打开</Badge>
  if (value === "running") return <Badge tone="blue">执行中</Badge>
  if (value === "retry") return <Badge tone="blue">重试已触发</Badge>
  if (value === "logs") return <Badge tone="blue">日志已打开</Badge>
  if (value === "orders") return <Badge tone="amber">失败订单已筛选</Badge>
  if (value === "reconnect") return <Badge tone="blue">重连中</Badge>
  if (value === "polling") return <Badge tone="amber">已启用轮询</Badge>
  return <Badge tone="blue">{value}</Badge>
}

function InstrumentFilterRuleForm({
  onCreate,
  initialRule,
  readonly = false,
}: {
  onCreate: (rule: InstrumentFilterRule) => void
  initialRule?: InstrumentFilterRule
  readonly?: boolean
}) {
  const [ruleName, setRuleName] = useState(initialRule?.rule ?? "高风险关键词组合")
  const [action, setAction] = useState(initialRule?.action ?? "进入人工审核")
  const [keywordEnabled, setKeywordEnabled] = useState(initialRule?.condition.includes("命中") ?? true)
  const [keywords, setKeywords] = useState(initialRule?.condition.match(/命中：([^；]+)/)?.[1] ?? "election, sanction, president")
  const [categoryEnabled, setCategoryEnabled] = useState(false)
  const [categories, setCategories] = useState("政治, 战争, 制裁")
  const [expiryEnabled, setExpiryEnabled] = useState(initialRule?.condition.includes("到期时间") ?? false)
  const [earliestEnd, setEarliestEnd] = useState(initialRule?.condition.match(/早于 ([^；]+)/)?.[1] ?? "2026-06-11T12:00")
  const [latestEnd, setLatestEnd] = useState("")
  const [unclearRuleEnabled, setUnclearRuleEnabled] = useState(initialRule?.condition.includes("结算来源缺失") ?? false)
  const enabledCount = [keywordEnabled, categoryEnabled, expiryEnabled, unclearRuleEnabled].filter(Boolean).length
  const conditions = [
    keywordEnabled ? `标题/描述/标签/分类/结算规则命中：${keywords || "未填写"}` : "",
    categoryEnabled ? `分类命中：${categories || "未填写"}` : "",
    expiryEnabled ? `到期时间${earliestEnd ? `早于 ${earliestEnd}` : ""}${earliestEnd && latestEnd ? " 或 " : ""}${latestEnd ? `晚于 ${latestEnd}` : ""}` : "",
    unclearRuleEnabled ? "结算来源缺失或描述无法解析" : "",
  ].filter(Boolean)

  return (
    <Panel title="新增强制过滤规则">
      <div className="space-y-4">
        <div className="rounded-md border bg-zinc-50 p-3 text-sm text-muted-foreground">
          强制规则先于推荐分执行。一次新增可以勾选多个条件，多个条件默认按“任一命中即触发”处理；需要组合成“全部命中才触发”时，可在正式 PRD 的高级规则里扩展。
        </div>
        <div className="grid gap-3 md:grid-cols-2">
          <label className="space-y-1 text-sm">
            <span className="text-xs text-muted-foreground">规则名称</span>
            <input disabled={readonly} className="h-10 w-full rounded-md border px-3 outline-none focus:border-zinc-900 disabled:bg-zinc-50" value={ruleName} onChange={(event) => setRuleName(event.target.value)} />
          </label>
          <label className="space-y-1 text-sm">
            <span className="text-xs text-muted-foreground">处理动作</span>
            <select disabled={readonly} className="h-10 w-full rounded-md border px-3 outline-none focus:border-zinc-900 disabled:bg-zinc-50" value={action} onChange={(event) => setAction(event.target.value)}>
              <option>直接过滤</option>
              <option>进入人工审核</option>
            </select>
          </label>
        </div>

        <div className="grid gap-3 xl:grid-cols-2">
          <div className="rounded-lg border bg-white p-4">
            <label className="flex items-center gap-2 text-sm font-semibold">
              <input disabled={readonly} type="checkbox" checked={keywordEnabled} onChange={(event) => setKeywordEnabled(event.target.checked)} />
              启用敏感关键词过滤
            </label>
            {keywordEnabled && (
              <label className="mt-3 block space-y-1 text-sm">
                <span className="text-xs text-muted-foreground">命中字段：标题、描述、标签、分类、结算规则文本。多个关键词用逗号隔开</span>
                <input disabled={readonly} className="h-10 w-full rounded-md border px-3 outline-none focus:border-zinc-900 disabled:bg-zinc-50" value={keywords} onChange={(event) => setKeywords(event.target.value)} />
              </label>
            )}
          </div>

          <div className="rounded-lg border bg-white p-4">
            <label className="flex items-center gap-2 text-sm font-semibold">
              <input disabled={readonly} type="checkbox" checked={categoryEnabled} onChange={(event) => setCategoryEnabled(event.target.checked)} />
              启用分类过滤
            </label>
            {categoryEnabled && (
              <label className="mt-3 block space-y-1 text-sm">
                <span className="text-xs text-muted-foreground">需要过滤或复核的分类，多个用逗号隔开</span>
                <input disabled={readonly} className="h-10 w-full rounded-md border px-3 outline-none focus:border-zinc-900 disabled:bg-zinc-50" value={categories} onChange={(event) => setCategories(event.target.value)} />
              </label>
            )}
          </div>

          <div className="rounded-lg border bg-white p-4">
            <label className="flex items-center gap-2 text-sm font-semibold">
              <input disabled={readonly} type="checkbox" checked={expiryEnabled} onChange={(event) => setExpiryEnabled(event.target.checked)} />
              启用到期时间过滤
            </label>
            {expiryEnabled && (
              <div className="mt-3 grid gap-3 md:grid-cols-2">
                <label className="space-y-1 text-sm">
                  <span className="text-xs text-muted-foreground">到期早于该时间</span>
                  <input disabled={readonly} className="h-10 w-full rounded-md border px-3 outline-none focus:border-zinc-900 disabled:bg-zinc-50" type="datetime-local" value={earliestEnd} onChange={(event) => setEarliestEnd(event.target.value)} />
                </label>
                <label className="space-y-1 text-sm">
                  <span className="text-xs text-muted-foreground">到期晚于该时间，可为空</span>
                  <input disabled={readonly} className="h-10 w-full rounded-md border px-3 outline-none focus:border-zinc-900 disabled:bg-zinc-50" type="datetime-local" value={latestEnd} onChange={(event) => setLatestEnd(event.target.value)} />
                </label>
              </div>
            )}
          </div>

          <div className="rounded-lg border bg-white p-4 xl:col-span-2">
            <label className="flex items-center gap-2 text-sm font-semibold">
              <input disabled={readonly} type="checkbox" checked={unclearRuleEnabled} onChange={(event) => setUnclearRuleEnabled(event.target.checked)} />
              启用规则不清晰过滤
            </label>
            {unclearRuleEnabled && (
              <div className="mt-3 rounded-md border bg-zinc-50 p-3 text-sm text-muted-foreground">
                无需额外填写。命中条件固定为：结算来源缺失、结算描述无法解析、结果定义存在明显歧义。
              </div>
            )}
          </div>
        </div>

        <div className="grid gap-3 md:grid-cols-3">
          <Info label="已启用条件" value={`${enabledCount} 项`} />
          <Info label="保存后状态" value="加入草稿规则，需试算后保存版本" />
          <Info label="审计要求" value="记录操作人、启用条件、填写值和影响范围" />
        </div>
        <div className="rounded-md border bg-zinc-50 p-3 text-sm text-muted-foreground">
          当前规则预览：{conditions.length ? conditions.join("；") : "尚未启用任何条件"}
        </div>
        {!readonly && (
          <Button
            size="sm"
            disabled={enabledCount === 0}
            onClick={() => {
              onCreate({ id: initialRule?.id ?? `IFR-${Date.now().toString().slice(-4)}`, rule: ruleName, condition: conditions.join("；"), action, status: "启用" })
            }}
          >
            {initialRule ? "保存修改" : "保存并加入规则列表"}
          </Button>
        )}
      </div>
    </Panel>
  )
}

function InstrumentScoreRuleEditor({
  rule,
  onSave,
}: {
  rule: InstrumentScoringRule
  onSave: (rule: InstrumentScoringRule) => void
}) {
  const [draft, setDraft] = useState(rule)
  return (
    <Panel title={`${rule.name}评分配置`}>
      <div className="space-y-4">
        <div className="rounded-md border bg-zinc-50 p-3 text-sm text-muted-foreground">
          这里配置的是该评分项的量化规则。字段来源来自 PM B 标准化后的接口，不直接依赖 Polymarket 或 Predict.fun 的原始字段名。
        </div>
        <div>
          <div className="mb-2 text-sm font-semibold">参与计算的接口字段</div>
          <div className="flex flex-wrap gap-2">
            {draft.sourceFields.map((field) => (
              <Badge key={field} tone="blue">{field}</Badge>
            ))}
          </div>
        </div>
        <label className="block space-y-1 text-sm">
          <span className="text-xs text-muted-foreground">字段来源，可用逗号增减字段</span>
          <input
            className="h-10 w-full rounded-md border px-3 outline-none focus:border-zinc-900"
            value={draft.sourceFields.join(", ")}
            onChange={(event) => setDraft({ ...draft, sourceFields: event.target.value.split(",").map((item) => item.trim()).filter(Boolean) })}
          />
        </label>
        <label className="block space-y-1 text-sm">
          <span className="text-xs text-muted-foreground">评分逻辑说明</span>
          <textarea
            className="min-h-20 w-full rounded-md border px-3 py-2 outline-none focus:border-zinc-900"
            value={draft.scoreRule}
            onChange={(event) => setDraft({ ...draft, scoreRule: event.target.value })}
          />
        </label>
        <div className="space-y-2">
          <div className="text-sm font-semibold">评分区间配置</div>
          {draft.scoreBands.map((band, index) => (
            <div key={`${draft.name}-${index}`} className="flex gap-2">
              <input
                className="h-10 min-w-0 flex-1 rounded-md border px-3 text-sm outline-none focus:border-zinc-900"
                value={band}
                onChange={(event) => {
                  const nextBands = [...draft.scoreBands]
                  nextBands[index] = event.target.value
                  setDraft({ ...draft, scoreBands: nextBands })
                }}
              />
              <Button
                size="sm"
                variant="outline"
                onClick={() => setDraft({ ...draft, scoreBands: draft.scoreBands.filter((_, bandIndex) => bandIndex !== index) })}
              >
                删除
              </Button>
            </div>
          ))}
          <Button size="sm" variant="outline" onClick={() => setDraft({ ...draft, scoreBands: [...draft.scoreBands, "新增条件：分值区间"] })}>
            新增区间
          </Button>
        </div>
        <label className="block space-y-1 text-sm">
          <span className="text-xs text-muted-foreground">评分示例</span>
          <input
            className="h-10 w-full rounded-md border px-3 outline-none focus:border-zinc-900"
            value={draft.example}
            onChange={(event) => setDraft({ ...draft, example: event.target.value })}
          />
        </label>
        <div className="flex flex-wrap gap-2">
          <Button size="sm" onClick={() => onSave(draft)}>保存该评分项</Button>
        </div>
      </div>
    </Panel>
  )
}

function GroupScoreRuleEditor({
  rule,
  onSave,
}: {
  rule: GroupScoringRule
  onSave: (rule: GroupScoringRule) => void
}) {
  const [draft, setDraft] = useState(rule)
  return (
    <Panel title={`${rule.name}匹配配置`}>
      <div className="space-y-4">
        <div className="rounded-md border bg-zinc-50 p-3 text-sm text-muted-foreground">
          这里配置的是单个归组匹配项的量化规则。字段来源来自两个候选标的的标准化字段对比，保存后先进入草稿，最终随“保存规则”发布版本。
        </div>
        <div>
          <div className="mb-2 text-sm font-semibold">参与比对的接口字段</div>
          <div className="flex flex-wrap gap-2">
            {draft.sourceFields.map((field) => (
              <Badge key={field} tone="blue">{field}</Badge>
            ))}
          </div>
        </div>
        <label className="block space-y-1 text-sm">
          <span className="text-xs text-muted-foreground">字段来源，可用逗号增减字段</span>
          <input
            className="h-10 w-full rounded-md border px-3 outline-none focus:border-zinc-900"
            value={draft.sourceFields.join(", ")}
            onChange={(event) => setDraft({ ...draft, sourceFields: event.target.value.split(",").map((item) => item.trim()).filter(Boolean) })}
          />
        </label>
        <label className="block space-y-1 text-sm">
          <span className="text-xs text-muted-foreground">匹配逻辑说明</span>
          <textarea
            className="min-h-20 w-full rounded-md border px-3 py-2 outline-none focus:border-zinc-900"
            value={draft.scoreRule}
            onChange={(event) => setDraft({ ...draft, scoreRule: event.target.value })}
          />
        </label>
        <div className="space-y-2">
          <div className="text-sm font-semibold">匹配分区间配置</div>
          {draft.scoreBands.map((band, index) => (
            <div key={`${draft.name}-${index}`} className="flex gap-2">
              <input
                className="h-10 min-w-0 flex-1 rounded-md border px-3 text-sm outline-none focus:border-zinc-900"
                value={band}
                onChange={(event) => {
                  const nextBands = [...draft.scoreBands]
                  nextBands[index] = event.target.value
                  setDraft({ ...draft, scoreBands: nextBands })
                }}
              />
              <Button size="sm" variant="outline" onClick={() => setDraft({ ...draft, scoreBands: draft.scoreBands.filter((_, bandIndex) => bandIndex !== index) })}>
                删除
              </Button>
            </div>
          ))}
          <Button size="sm" variant="outline" onClick={() => setDraft({ ...draft, scoreBands: [...draft.scoreBands, "新增条件：匹配分区间"] })}>
            新增区间
          </Button>
        </div>
        <label className="block space-y-1 text-sm">
          <span className="text-xs text-muted-foreground">匹配示例</span>
          <input
            className="h-10 w-full rounded-md border px-3 outline-none focus:border-zinc-900"
            value={draft.example}
            onChange={(event) => setDraft({ ...draft, example: event.target.value })}
          />
        </label>
        <Button size="sm" onClick={() => onSave(draft)}>保存该匹配项</Button>
      </div>
    </Panel>
  )
}

function autoOrderState(status: string) {
  if (status === "live") return "published"
  if (status === "paused") return "paused"
  if (status === "delisted") return "delisted"
  return "pending"
}

function orderStatusText(status: string) {
  if (status === "filled") return "已成交"
  if (status === "partially_filled") return "部分成交"
  if (status === "failed") return "失败"
  if (status === "open") return "委托中"
  return status
}

function settlementStatusText(status: string) {
  if (status === "claimable") return "可领取"
  if (status === "settled") return "已结算"
  if (status === "settlement_error") return "结算异常"
  if (status === "resolving") return "结算中"
  return status
}

function getApiActionMeta(action: string, api: ApiHealthRow) {
  if (action === "详情" || action === "查看" || action === "查看状态" || action === "查看影响") {
    if (api.status === "degraded") {
      return {
        title: "降级影响详情",
        intent: "查看哪些标的、推荐入口和订单能力正在被该 API 异常影响，再决定是否重试、暂停下单或查看失败订单。",
        primary: "手动重试",
        next: "retry",
        feedback: `${api.venue} ${api.api} 已进入重试队列，完成后会刷新状态和影响范围。`,
      }
    }
    return {
      title: "API 状态详情",
      intent: "查看当前 API 是否健康，以及最近同步、延迟、错误和影响范围。",
      primary: "立即检测",
      next: "running",
      feedback: `${api.venue} ${api.api} 正在检测，完成后会刷新状态和影响范围。`,
    }
  }
  if (action === "立即检测" || action === "刷新健康") {
    return {
      title: "手动检测",
      intent: "主动检测该 API 的认证、延迟、频控、订单提交和行情新鲜度。",
      primary: "开始检测",
      next: "running",
      feedback: `${api.venue} ${api.api} 正在检测，完成后会刷新状态和影响范围。`,
    }
  }
  if (action === "日志" || action === "查看日志") {
    return {
      title: "API 日志",
      intent: "查看最近请求、错误码、重试次数、调用来源和关联标的/订单。",
      primary: "打开日志",
      next: "logs",
      feedback: `${api.venue} ${api.api} 最近日志已打开。`,
    }
  }
  if (action === "查看影响") {
    return {
      title: "降级影响详情",
      intent: "先看清楚哪些标的、推荐、订单被影响，再决定是否重试或暂停下单。",
      primary: "手动重试",
      next: "retry",
      feedback: `${api.venue} ${api.api} 已触发一次手动重试。`,
    }
  }
  if (action === "手动重试") {
    return {
      title: "手动重试",
      intent: "重新请求该 API，确认是否为短时抖动或第三方临时错误。",
      primary: "执行重试",
      next: "retry",
      feedback: `${api.venue} ${api.api} 已进入重试队列。`,
    }
  }
  if (action === "暂停下单") {
    return {
      title: "暂停下单确认",
      intent: "暂停该 API 影响范围内的新下单，已有订单、撤单和持仓查询保留审计追踪。",
      primary: "确认暂停",
      next: "paused",
      feedback: `${api.venue} 受影响的新下单能力已暂停。`,
    }
  }
  if (action === "失败订单") {
    return {
      title: "失败订单筛选",
      intent: "查看由该 API 异常导致的失败订单，用于客服解释、补同步和研发排障。",
      primary: "筛选失败订单",
      next: "orders",
      feedback: `${api.venue} ${api.api} 关联失败订单已筛选。`,
    }
  }
  if (action === "心跳" || action === "查看心跳") {
    return {
      title: "WebSocket 心跳详情",
      intent: "查看频道连接、最近心跳、断线次数和是否需要降级轮询。",
      primary: "手动重连",
      next: "reconnect",
      feedback: `${api.venue} WebSocket 已开始重连。`,
    }
  }
  if (action === "手动重连") {
    return {
      title: "手动重连",
      intent: "主动重连 WebSocket 频道，恢复实时行情和用户订单流。",
      primary: "执行重连",
      next: "reconnect",
      feedback: `${api.venue} WebSocket 重连任务已提交。`,
    }
  }
  if (action === "降级轮询") {
    return {
      title: "启用降级轮询",
      intent: "当 WebSocket 不稳定时，临时用定时轮询保证行情和订单状态不完全中断。",
      primary: "启用轮询",
      next: "polling",
      feedback: `${api.venue} WebSocket 已启用降级轮询。`,
    }
  }
  if (action.startsWith("同步当前筛选来源")) {
    return {
      title: "同步当前筛选来源",
      intent: "按当前筛选条件重新拉取原始市场数据。操作对象是筛选结果里的 Venue + API 来源，例如 Polymarket Gamma、Predict.fun Markets、Predict.fun Orders 或 Polymarket CLOB。",
      primary: "开始同步",
      next: "running",
      feedback: "当前筛选范围内的原始市场来源已提交同步任务，完成后会刷新同步状态、最近错误和候选标记。",
    }
  }
  if (action.startsWith("同步该来源")) {
    return {
      title: "同步该来源",
      intent: "只重新拉取当前这一行对应的原始市场来源，不影响其他平台或其他 API 来源。",
      primary: "开始同步",
      next: "running",
      feedback: `${api.venue} / ${api.api} 已提交同步任务。完成后会刷新该来源的同步状态、最近错误和候选标记。`,
    }
  }
  if (action.startsWith("查看原始市场")) {
    return {
      title: "原始市场同步详情",
      intent: "查看当前原始市场来源的同步状态、最近错误、是否进入候选池，以及后续是否会生成可交易标的。",
      primary: "重新检测",
      next: "running",
      feedback: `${action.replace("查看原始市场：", "")} 已重新检测同步状态。`,
    }
  }
  return {
    title: "API 操作详情",
    intent: api.flow,
    primary: "开始检测",
    next: "running",
    feedback: `${api.venue} ${api.api} 操作已提交。`,
  }
}

function isApiDirectAction(action: string) {
  return apiDirectActions.some((directAction) => action.startsWith(directAction))
}

function getApiDetailActions(api: ApiHealthRow) {
  if (api.id.startsWith("raw-")) return ["同步该来源"]
  if (api.id === "predict-orders") return ["手动重试", "暂停下单", "失败订单"]
  if (api.id === "predict-ws") return ["手动重连", "降级轮询", "日志"]
  return ["立即检测", "日志"]
}

function apiFromRawMarket(row: RawMarketRow): ApiHealthRow {
  return {
    id: `raw-${row.venue}-${row.source}`,
    venue: row.venue,
    api: row.source,
    status: row.status,
    latency: row.status === "success" ? "最近同步成功" : "需复查",
    impact: row.candidate === "是" ? "进入候选池" : "未进入候选池",
    primary: "详情",
    more: ["同步该来源"],
    suggestion: row.error === "--" ? "同步正常" : row.error,
    flowTitle: "原始市场同步详情",
    flow: "查看这一条原始市场来源的同步状态、最近错误和是否进入候选池。同步该来源只会重新拉取这一行对应的平台/API 来源。",
  }
}

function GroupReviewDetail({
  group,
  decision,
  onDecision,
}: {
  group: GroupCandidate
  decision: string
  onDecision: (next: string) => void
}) {
  const detail = groupReviewDetails[group.id] ?? groupReviewDetails["EG-883"]
  const [note, setNote] = useState("")
  const [noteError, setNoteError] = useState(false)
  const canSubmit = note.trim().length >= 6
  const submitDecision = (next: "approved" | "rejected") => {
    if (!canSubmit) {
      setNoteError(true)
      return
    }
    setNoteError(false)
    onDecision(next)
  }

  return (
    <Panel
      title="归组审核详情"
      action={
        <div className="flex items-center gap-2">
          <ReviewResult value={decision} />
          <Button size="sm" onClick={() => submitDecision("approved")}>
            同意归组
          </Button>
          <Button size="sm" variant="outline" onClick={() => submitDecision("rejected")}>
            拒绝归组
          </Button>
        </div>
      }
    >
      <div className="space-y-5">
        {decision !== "pending" && (
          <div className="rounded-md border border-sky-200 bg-sky-50 p-3 text-sm text-sky-800">
            {decision === "approved"
              ? `${group.id} 已确认归组，后端将生成或更新 EventGroup，但不会合并盘口、深度或成本池。`
              : `${group.id} 已拒绝归组，两个标的仍作为独立主题展示。`}
          </div>
        )}
        <div className="flex flex-col gap-2 md:flex-row md:items-start md:justify-between">
          <div>
            <div className="text-xs text-muted-foreground">审核单 {group.id}</div>
            <h3 className="mt-1 text-xl font-semibold">{group.title}</h3>
            <div className="mt-2 flex flex-wrap gap-2">
              <Badge tone={statusTone(group.status)}>{group.statusLabel}</Badge>
              <Badge tone="blue">匹配度 {group.matchRate}</Badge>
              <Badge tone="neutral">{group.type}</Badge>
            </div>
          </div>
          <div className="rounded-md border bg-zinc-50 p-3 text-sm text-muted-foreground">
            审核结论只影响 EventGroup 展示、前台同主题切换、持仓归组和推荐，不合并盘口、不合并深度、不合并成本池。
          </div>
        </div>

        <div className={`rounded-lg border p-4 ${noteError ? "border-red-200 bg-red-50" : "bg-white"}`}>
          <div className="flex flex-col gap-2 lg:flex-row lg:items-start lg:justify-between">
            <div className="lg:max-w-sm">
              <label className="text-sm font-medium">审核说明</label>
              <div className="mt-1 text-xs text-muted-foreground">
                同意或拒绝归组前必须填写原因，该说明会写入 EventGroup 审计日志。
              </div>
            </div>
            <textarea
              className="min-h-20 flex-1 rounded-md border bg-white px-3 py-2 text-sm outline-none focus:border-zinc-900"
              placeholder="例如：两边结果定义、结算时间和结算规则一致，仅标题表达不同。"
              value={note}
              onChange={(event) => {
                setNote(event.target.value)
                if (event.target.value.trim().length >= 6) setNoteError(false)
              }}
            />
          </div>
          {(noteError || !canSubmit) && (
            <div className={`mt-2 text-xs ${noteError ? "text-red-700" : "text-muted-foreground"}`}>
              请先填写至少 6 个字符的审核说明，再提交同意或拒绝。
            </div>
          )}
        </div>

        <div className="grid gap-4 xl:grid-cols-2">
          {detail.instruments.map((instrument) => (
            <div key={instrument.id} className="rounded-lg border bg-white p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="text-xs text-muted-foreground">{instrument.id}</div>
                  <div className="mt-1 font-semibold">{instrument.title}</div>
                </div>
                <Badge tone={instrument.venue === "Polymarket" ? "blue" : "purple"}>{instrument.venue}</Badge>
              </div>
              <div className="mt-4 grid gap-2 text-sm sm:grid-cols-2">
                <Info label="链 / 资产" value={`${instrument.chain} / ${instrument.asset}`} />
                <Info label="Outcome" value={instrument.outcome} />
                <Info label="价格 / 概率" value={instrument.price} />
                <Info label="流动性" value={instrument.liquidity} />
                <Info label="到期时间" value={instrument.closeTime} />
                <Info label="数据来源" value={instrument.source} />
              </div>
              <div className="mt-3 rounded-md border bg-zinc-50 p-3 text-sm">
                <span className="font-medium">结算规则：</span>
                {instrument.rule}
              </div>
            </div>
          ))}
        </div>

        <div className="grid gap-4 xl:grid-cols-[0.8fr_1.2fr]">
          <div className="rounded-lg border bg-white p-4">
          <div className="text-sm font-semibold">关键参数校验</div>
            <div className="mt-3 space-y-2">
              {detail.checks.map(([label, value, tone]) => (
                <div key={label} className="flex items-center justify-between gap-3 rounded-md border p-2 text-sm">
                  <span>{label}</span>
                  <Badge tone={tone}>{value}</Badge>
                </div>
              ))}
            </div>
          </div>
          <div className="rounded-lg border bg-white p-4">
            <div className="text-sm font-semibold">影响交易的参数对比</div>
            <DataTable
              columns={["字段", "Polymarket 标的", "Predict.fun 标的", "判断"]}
              rows={detail.diffs.map(([label, left, right, tone]) => [label, left, right, <Badge tone={tone}>{tone === "red" ? "需拒绝" : tone === "amber" ? "需确认" : "可接受"}</Badge>])}
            />
          </div>
        </div>

        <div className="rounded-lg border bg-zinc-50 p-4">
          <div className="text-sm font-semibold">审核记录预览</div>
          <div className="mt-3 grid gap-2 md:grid-cols-3">
            {detail.audit.map((item) => (
              <div key={item} className="rounded-md border bg-white p-3 text-sm">
                {item}
              </div>
            ))}
          </div>
        </div>
      </div>
    </Panel>
  )
}

function ApiOperationDetail({
  api,
  action,
  onExecute,
  onOpenAction,
}: {
  api: ApiHealthRow
  action: string
  onExecute: (action: string, api: ApiHealthRow) => void
  onOpenAction: (action: string) => void
}) {
  const impacted = api.id === "predict-orders" ? ["INS-1744 US CPI lower than forecast", "AO-388 CPI 智能推荐", "ORD-89998 认证失败订单"] : ["暂无受影响标的"]
  const actionMeta = getApiActionMeta(action, api)
  const detailActions = getApiDetailActions(api)

  return (
    <Panel
      title={actionMeta.title}
      action={
        <div className="flex flex-wrap gap-2">
          {detailActions.map((detailAction) => (
            <Button
              key={detailAction}
              size="sm"
              variant={isApiDirectAction(detailAction) ? "default" : "outline"}
              onClick={() => {
                if (isApiDirectAction(detailAction)) {
                  onExecute(detailAction, api)
                  return
                }
                onOpenAction(detailAction)
              }}
            >
              {detailAction}
            </Button>
          ))}
        </div>
      }
    >
      <div className="space-y-4">
        <FieldGrid
          items={[
            ["平台", api.venue],
            ["API", api.api],
            ["当前查看", action],
            ["状态", api.status],
            ["平均延迟", api.latency],
            ["影响范围", api.impact],
          ]}
        />
        <div className="rounded-lg border bg-zinc-50 p-4 text-sm text-muted-foreground">
          {actionMeta.intent}
        </div>
        <div className="grid gap-4 lg:grid-cols-2">
          <div className="rounded-lg border p-4">
            <div className="text-sm font-semibold">{action === "日志" || action === "查看日志" ? "最近日志" : action === "失败订单" ? "关联失败订单" : action.includes("心跳") || action.includes("重连") || action.includes("轮询") ? "连接状态" : "检测结果"}</div>
            <DataTable
              columns={["检查项", "结果", "最近一次"]}
              rows={
                action === "日志" || action === "查看日志"
                  ? [
                      ["最近错误", api.id === "predict-orders" ? <Badge tone="amber">429 retrying</Badge> : <Badge tone="green">无错误</Badge>, "2 分钟前"],
                      ["重试次数", api.id === "predict-orders" ? "3 次" : "0 次", "5 分钟窗口"],
                      ["调用来源", "数据同步 / 订单服务", "持续记录"],
                      ["审计状态", <Badge tone="green">已记录</Badge>, "实时"],
                    ]
                  : action === "失败订单"
                    ? [
                        ["失败订单", api.id === "predict-orders" ? <Badge tone="red">ORD-89998</Badge> : <Badge tone="green">无</Badge>, "10:12:39"],
                        ["失败原因", api.id === "predict-orders" ? "JWT refresh failed" : "--", "最近一次"],
                        ["用户提示", "下单失败，请稍后重试", "前台同步"],
                        ["处理建议", "恢复认证后补同步状态", "需补同步"],
                      ]
                    : action.includes("心跳") || action.includes("重连") || action.includes("轮询")
                      ? [
                          ["Market 频道", <Badge tone="green">正常</Badge>, "31ms"],
                          ["User 频道", <Badge tone="green">正常</Badge>, "33ms"],
                          ["断线次数", "0 次", "30 分钟窗口"],
                          ["降级轮询", action === "降级轮询" ? <Badge tone="amber">已启用</Badge> : <Badge tone="green">未启用</Badge>, "当前"],
                        ]
                      : [
                          ["认证状态", api.status === "degraded" ? <Badge tone="amber">需复查</Badge> : <Badge tone="green">正常</Badge>, "1 分钟前"],
                          ["频控状态", api.id === "predict-orders" ? <Badge tone="amber">429 retrying</Badge> : <Badge tone="green">正常</Badge>, "2 分钟前"],
                          ["订单提交", api.id === "predict-orders" ? <Badge tone="red">失败率 3.8%</Badge> : <Badge tone="green">正常</Badge>, "5 分钟窗口"],
                          ["行情新鲜度", <Badge tone="green">可用</Badge>, "31ms - 96ms"],
                        ]
              }
            />
          </div>
          <div className="rounded-lg border p-4">
            <div className="text-sm font-semibold">受影响对象</div>
            <div className="mt-3 space-y-2">
              {impacted.map((item) => (
                <div key={item} className="rounded-md border bg-zinc-50 p-3 text-sm">
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Panel>
  )
}

function BatchSyncDetail({
  rows,
  result,
  onResult,
}: {
  rows: RawMarketRow[]
  result: string
  onResult: (next: string) => void
}) {
  const sourceCount = rows.length
  const venueCount = new Set(rows.map((row) => row.venue)).size
  const apiSources = Array.from(new Set(rows.map((row) => `${row.venue} / ${row.source}`)))

  return (
    <Panel
      title="同步当前筛选来源"
      action={
        <div className="flex flex-wrap gap-2">
          <ReviewResult value={result} />
          <Button size="sm" onClick={() => onResult("running")}>开始同步</Button>
        </div>
      }
    >
      <div className="space-y-4">
        {result !== "pending" && (
          <div className="rounded-md border border-sky-200 bg-sky-50 p-3 text-sm text-sky-800">
            已提交 {sourceCount} 个来源的批量同步任务。同步完成后会刷新每一行的同步状态、最近错误和候选标记。
          </div>
        )}
        <FieldGrid
          items={[
            ["同步范围", "当前筛选结果"],
            ["来源数量", `${sourceCount} 个来源`],
            ["涉及平台", `${venueCount} 个平台`],
            ["执行方式", "批量拉取原始市场数据"],
            ["同步内容", "原始标题 / 同步状态 / 最近错误 / 候选标记"],
            ["不会影响", "不会下单，不会修改用户订单和持仓"],
          ]}
        />
        <div className="rounded-lg border bg-zinc-50 p-4 text-sm text-muted-foreground">
          这个按钮的操作对象不是单个平台，而是下面列表当前筛选出来的全部来源。比如当前筛选为“全部”时，会同时包含 Polymarket Gamma、Predict.fun Markets、Predict.fun Orders、Polymarket CLOB。
        </div>
        <div className="rounded-lg border bg-white p-4">
          <div className="text-sm font-semibold">本次同步包含的来源</div>
          <div className="mt-3 flex flex-wrap gap-2">
            {apiSources.map((source) => (
              <Badge key={source} tone={source.includes("Predict") ? "purple" : "blue"}>{source}</Badge>
            ))}
          </div>
        </div>
        <DataTable
          columns={["平台", "API 来源", "原始标题", "当前同步状态", "最近错误", "候选"]}
          rows={rows.map((row) => [
            row.venue,
            row.source,
            row.title,
            <Badge tone={statusTone(row.status)}>{row.status}</Badge>,
            row.error,
            row.candidate,
          ])}
        />
      </div>
    </Panel>
  )
}

function AdmissionReviewDetail({ item }: { item: AdmissionCandidate }) {
  const [decision, setDecision] = useState("pending")
  const [note, setNote] = useState("")
  const canSubmit = note.trim().length >= 6

  return (
    <Panel
      title="标的准入审核详情"
      action={
        <div className="flex flex-wrap gap-2">
          <ReviewResult value={decision} />
          <Button
            size="sm"
            disabled={!canSubmit}
            onClick={() => setDecision("approved")}
          >
            通过准入
          </Button>
          <Button
            size="sm"
            variant="outline"
            disabled={!canSubmit}
            onClick={() => setDecision("rejected")}
          >
            拒绝准入
          </Button>
        </div>
      }
    >
      <div className="space-y-5">
        {decision !== "pending" && (
          <div className="rounded-md border border-sky-200 bg-sky-50 p-3 text-sm text-sky-800">
            {decision === "approved"
              ? `${item.id} 已通过准入。后端将按当前规则版本生成 TradeableInstrument，并进入可交易标的列表。`
              : `${item.id} 已拒绝准入。该原平台市场不会进入本平台可交易标的，原因会写入审计日志。`}
          </div>
        )}
        <FieldGrid
          items={[
            ["审核单号", item.id],
            ["原始市场 ID", item.rawMarketId],
            ["平台 / 来源", `${item.venue} / ${item.source}`],
            ["原始标题", item.title],
            ["推荐分", item.score],
            ["触发原因", item.trigger],
            ["准入判断", item.reason],
            ["当前状态", item.status],
          ]}
        />
        <div className="grid gap-4 xl:grid-cols-[1fr_1fr]">
          <Panel title="量化字段来源">
            <DataTable
              columns={["字段", "当前值", "用途"]}
              rows={[
                ["liquidityUsd", item.liquidityUsd, "计算流动性评分"],
                ["volume24hUsd", item.volume24hUsd, "计算成交量/热度评分"],
                ["endTime", item.endTime, "计算到期时间评分"],
                ["ruleParseStatus", item.ruleParseStatus, "计算规则清晰度评分"],
                ["sensitiveKeywords", item.sensitiveHit, "判断是否命中强制人工审核"],
                ["apiTradable", item.apiTradable, "计算 API 可交易性评分"],
              ]}
            />
          </Panel>
          <Panel title="审核影响">
            <FieldGrid
              items={[
                ["字段来源", item.sourceFields],
                ["通过后", "生成 TradeableInstrument，进入可交易标的列表；若推荐分 >= 85 再进入智能推荐候选池"],
                ["拒绝后", "保留 RawVenueMarket 和审核记录，不生成可交易标的"],
                ["审计要求", "记录操作人、原因、规则版本、原始市场 ID 和影响范围"],
              ]}
            />
          </Panel>
        </div>
        <div className="rounded-lg border p-4">
          <label className="text-sm font-medium">审核说明</label>
          <textarea
            className="mt-2 min-h-24 w-full rounded-md border px-3 py-2 text-sm outline-none focus:border-zinc-900"
            placeholder="请填写通过或拒绝的原因，至少 6 个字符。该说明会写入审计日志。"
            value={note}
            onChange={(event) => setNote(event.target.value)}
          />
          {!canSubmit && <div className="mt-2 text-xs text-muted-foreground">填写审核说明后，才可以提交通过或拒绝。</div>}
        </div>
      </div>
    </Panel>
  )
}

function AutoOrderDetail({
  item,
  result,
  onResult,
}: {
  item: AutoOrder
  result: string
  onResult: (next: string) => void
}) {
  const instrument = instruments.find((candidate) => candidate.id === item.instrument) ?? instruments[0]
  const isPublished = result === "published"
  const isPaused = result === "paused"
  const isDelisted = result === "delisted"
  const [dialog, setDialog] = useState<"copy" | "sort" | null>(null)
  const [draftCopy, setDraftCopy] = useState(item.title)
  const [savedCopy, setSavedCopy] = useState(item.title)
  const [draftPriority, setDraftPriority] = useState(String(item.priority))
  const [savedPriority, setSavedPriority] = useState(String(item.priority))

  useEffect(() => {
    setDialog(null)
    setDraftCopy(item.title)
    setSavedCopy(item.title)
    setDraftPriority(String(item.priority))
    setSavedPriority(String(item.priority))
  }, [item.id, item.priority, item.title])

  return (
    <Panel
      title={isPublished ? "推荐入口管理详情" : "推荐机会审核详情"}
      action={
        <div className="flex flex-wrap gap-2">
          <ReviewResult value={result} />
          {isPublished && (
            <>
              <Button size="sm" variant="outline" onClick={() => onResult("paused")}>暂停推荐</Button>
              <Button size="sm" variant="outline" onClick={() => onResult("delisted")}>下架推荐</Button>
              <Button size="sm" variant="outline" onClick={() => setDialog("copy")}>修改推荐文案</Button>
              <Button size="sm" variant="outline" onClick={() => setDialog("sort")}>调整排序</Button>
            </>
          )}
          {isPaused && (
            <>
              <Button size="sm" onClick={() => onResult("published")}>恢复上线</Button>
              <Button size="sm" variant="outline" onClick={() => onResult("delisted")}>下架推荐</Button>
              <Button size="sm" variant="outline" onClick={() => setDialog("copy")}>修改推荐文案</Button>
            </>
          )}
          {isDelisted && (
            <Button size="sm" variant="outline" onClick={() => onResult("pending")}>重新评估</Button>
          )}
          {!isPublished && !isPaused && !isDelisted && (
            <>
              <Button size="sm" onClick={() => onResult("published")}>通过并上线</Button>
              <Button size="sm" variant="outline" onClick={() => setDialog("copy")}>修改推荐文案</Button>
              <Button size="sm" variant="outline" onClick={() => onResult("paused")}>风险暂停</Button>
            </>
          )}
        </div>
      }
    >
      <div className="grid gap-5 xl:grid-cols-[1fr_0.8fr]">
        <div className="space-y-4">
          <div>
            <div className="text-xs text-muted-foreground">{item.id} / {item.instrument}</div>
            <h3 className="mt-1 text-lg font-semibold">{item.title}</h3>
          </div>
          <DataTable
            columns={["校验项", "当前值", "判断"]}
            rows={[
              ["推荐分", item.score, <Badge tone={item.score >= 80 ? "green" : "amber"}>{item.score >= 80 ? "可上线" : "需复核"}</Badge>],
              ["标的状态", instrument.status, <Badge tone={statusTone(instrument.status)}>{instrument.status}</Badge>],
              ["流动性", instrument.liquidity, <Badge tone={instrument.liquidity.includes("76K") ? "amber" : "green"}>{instrument.liquidity.includes("76K") ? "偏低" : "充足"}</Badge>],
              ["Quote 有效期", item.quoteTtl, <Badge tone={item.quoteTtl === "已过期" ? "red" : "green"}>{item.quoteTtl === "已过期" ? "过期" : "有效"}</Badge>],
              ["结算规则", "已解析", <Badge tone="green">清晰</Badge>],
              ["文案状态", item.copyStatus, <Badge tone={item.copyStatus === "待审核" ? "amber" : item.copyStatus === "已下架" ? "red" : "green"}>{item.copyStatus}</Badge>],
            ]}
          />
          <div className="rounded-lg border bg-zinc-50 p-4">
            <div className="text-sm font-semibold">前台预览</div>
            <div className="mt-3 rounded-lg border bg-white p-4">
              <div className="text-xs text-muted-foreground">快捷购买 Banner</div>
              <div className="mt-2 text-xl font-semibold">{savedCopy}</div>
              <div className="mt-3 flex flex-wrap gap-2">
                <Badge tone="blue">{instrument.venue}</Badge>
                <Badge tone="neutral">{instrument.chain} / {instrument.asset}</Badge>
                <Badge tone="amber">最大亏损 = 投入金额</Badge>
              </div>
            </div>
          </div>
        </div>
        <div className="rounded-lg border bg-white p-4">
          <div className="text-sm font-semibold">上线影响</div>
          <div className="mt-3 space-y-3">
            <Info label="展示位置" value={item.exposure} />
            <Info label="下架条件" value="Quote 过期 / 流动性下降 / API 异常 / 临近异常结算" />
            <Info label="风险文案" value="展示概率、到期时间、最大亏损、结算条件入口" />
            <Info label="交易边界" value="只提交到当前标的绑定平台，不拆单" />
            <Info label="文案处理" value="若文案不清楚或风险提示不足，可修改推荐文案后重新提交审核" />
            <Info label="推荐排序" value={`第 ${savedPriority} 位`} />
          </div>
        </div>
      </div>
      {dialog === "copy" && (
        <Modal title="修改推荐文案" onClose={() => setDialog(null)}>
          <div className="space-y-4">
            <div className="text-sm text-muted-foreground">
              用于首页 Banner、推荐卡片和快捷下单入口。文案必须包含买入价格、成立后可得、最大亏损或结算条件入口，避免让用户误以为收益无风险。
            </div>
            <label className="block text-sm font-medium">
              推荐文案
              <textarea
                className="mt-2 min-h-28 w-full rounded-md border px-3 py-2 text-sm outline-none focus:border-zinc-900"
                value={draftCopy}
                onChange={(event) => setDraftCopy(event.target.value)}
              />
            </label>
            <div className="rounded-md border bg-zinc-50 p-3 text-sm">
              预览：{draftCopy || "请输入推荐文案"}
            </div>
            <div className="flex justify-end gap-2">
              <Button size="sm" variant="outline" onClick={() => setDialog(null)}>取消</Button>
              <Button
                size="sm"
                onClick={() => {
                  setSavedCopy(draftCopy)
                  onResult(isPublished ? "published" : "copy_edit")
                  setDialog(null)
                }}
              >
                保存文案
              </Button>
            </div>
          </div>
        </Modal>
      )}
      {dialog === "sort" && (
        <Modal title="调整推荐排序" onClose={() => setDialog(null)}>
          <div className="space-y-4">
            <div className="text-sm text-muted-foreground">
              排序只影响前台推荐入口的展示优先级，不改变标的价格、Quote、盘口或用户订单执行路径。
            </div>
            <label className="block text-sm font-medium">
              推荐排序
              <input
                className="mt-2 h-10 w-full rounded-md border px-3 text-sm outline-none focus:border-zinc-900"
                min="0"
                type="number"
                value={draftPriority}
                onChange={(event) => setDraftPriority(event.target.value)}
              />
            </label>
            <div className="grid gap-3 md:grid-cols-2">
              <Info label="当前推荐分" value={String(item.score)} />
              <Info label="当前排序" value={`第 ${savedPriority} 位`} />
            </div>
            <div className="flex justify-end gap-2">
              <Button size="sm" variant="outline" onClick={() => setDialog(null)}>取消</Button>
              <Button
                size="sm"
                onClick={() => {
                  setSavedPriority(draftPriority)
                  setDialog(null)
                }}
              >
                保存排序
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </Panel>
  )
}

function OrderDetail({
  order,
  result,
  onResult,
}: {
  order: OrderItem
  result: string
  onResult: (next: string) => void
}) {
  const [toast, setToast] = useState("")
  const [showPlatformOrder, setShowPlatformOrder] = useState(false)
  const [lastRefresh, setLastRefresh] = useState(order.updatedAt)

  useEffect(() => {
    setToast("")
    setShowPlatformOrder(false)
    setLastRefresh(order.updatedAt)
  }, [order.id, order.updatedAt])

  const timeline = [
    { stage: "生成报价", status: "完成", time: order.createdAt, detail: order.quoteId, tone: "green" as Tone },
    { stage: "钱包签名", status: order.status === "failed" ? "已签名" : "完成", time: order.createdAt, detail: order.signature, tone: "green" as Tone },
    {
      stage: "提交平台",
      status: order.status === "failed" ? "失败" : "完成",
      time: order.updatedAt,
      detail: order.status === "failed" ? order.failureReason : order.venueOrderId,
      tone: order.status === "failed" ? "red" as Tone : "green" as Tone,
    },
    {
      stage: "成交同步",
      status: order.status === "partially_filled" ? "同步中" : order.status === "failed" ? "未成交" : "完成",
      time: order.updatedAt,
      detail: order.status === "failed" ? "订单未进入成交阶段" : `份额 ${order.shares}`,
      tone: order.status === "partially_filled" ? "amber" as Tone : order.status === "failed" ? "red" as Tone : "green" as Tone,
    },
  ]

  return (
    <Panel
      title="订单详情"
      action={
        <div className="flex flex-wrap gap-2">
          <Badge tone={statusTone(order.status)}>{orderStatusText(order.status)}</Badge>
          {result === "synced" && <Badge tone="blue">刚刚已刷新</Badge>}
          <Button
            size="sm"
            onClick={() => {
              onResult("synced")
              setLastRefresh("刚刚")
              setToast(`已刷新 ${order.id} 的最新状态：${orderStatusText(order.status)}`)
            }}
          >
            刷新状态
          </Button>
          <Button size="sm" variant="outline" onClick={() => setShowPlatformOrder(true)}>
            查看平台订单信息
          </Button>
        </div>
      }
    >
      <div className="space-y-5">
        {toast && (
          <div className="rounded-md border border-sky-200 bg-sky-50 p-3 text-sm text-sky-800">
            {toast}
          </div>
        )}

        <div className="grid gap-3 md:grid-cols-3">
          <Info label="聚合订单号" value={order.id} />
          <Info label="钱包地址" value={order.wallet} />
          <Info label="订单状态" value={orderStatusText(order.status)} />
          <Info label="交易平台" value={order.venue} />
          <Info label="交易链 / 资产" value={`${order.chain} / ${order.asset}`} />
          <Info label="事件名称" value={order.eventName} />
          <Info label="选项" value={order.optionName} />
          <Info label="交易方向" value={`${order.side} ${order.outcome}`} />
          <Info label="订单类型" value={order.type === "Market" ? "市价" : "限价"} />
          <Info label="价格 / 金额" value={`${order.price} / ${order.amount}`} />
          <Info label="预计或成交份额" value={order.shares} />
        </div>

        <div className="rounded-lg border bg-white p-4">
          <div className="flex items-center justify-between gap-3">
            <div className="text-sm font-semibold">执行过程</div>
            <div className="text-xs text-muted-foreground">最近刷新：{lastRefresh}</div>
          </div>
          <div className="mt-4 space-y-3">
            {timeline.map((item) => (
              <div key={item.stage} className="grid gap-3 rounded-md border bg-zinc-50 p-3 text-sm md:grid-cols-[1fr_120px_96px_1.6fr]">
                <div className="font-medium">{item.stage}</div>
                <Badge tone={item.tone}>{item.status}</Badge>
                <div className="text-muted-foreground">{item.time}</div>
                <div className="break-all text-muted-foreground">{item.detail}</div>
              </div>
            ))}
          </div>
        </div>

        {order.status === "failed" && (
          <div className="rounded-lg border border-rose-200 bg-rose-50 p-4 text-sm text-rose-800">
            失败原因：{order.failureReason}。该订单没有进入底层成交阶段，不会生成有效平台订单。
          </div>
        )}

        <div className="rounded-lg border bg-zinc-50 p-4 text-sm text-muted-foreground">
          订单详情用于运营排查用户订单状态。平台订单信息是 Polymarket / Predict.fun 返回的底层订单编号、hash 和签名记录，用于对账和排障；普通用户前台不需要理解这些字段。
        </div>

        {showPlatformOrder && (
          <Modal title="平台订单信息" onClose={() => setShowPlatformOrder(false)}>
            <div className="space-y-4">
              <div className="text-sm text-muted-foreground">
                这里展示的是底层平台返回的订单信息，用于排查、对账和审计，不代表会重新提交订单。
              </div>
              <FieldGrid
                items={[
                  ["平台", order.venue],
                  ["链 / 资产", `${order.chain} / ${order.asset}`],
                  ["平台订单 ID", order.venueOrderId],
                  ["订单 Hash", order.orderHash],
                  ["交易 Hash", order.txHash],
                  ["Quote ID", order.quoteId],
                  ["事件名称", order.eventName],
                  ["选项", order.optionName],
                  ["交易方向", `${order.side} ${order.outcome}`],
                  ["签名方式", order.signature],
                  ["失败原因", order.failureReason],
                ]}
              />
              <div className="flex justify-end">
                <Button size="sm" onClick={() => setShowPlatformOrder(false)}>我知道了</Button>
              </div>
            </div>
          </Modal>
        )}
      </div>
    </Panel>
  )
}

function AuthDetail({
  resource,
  result,
  onResult,
}: {
  resource: (typeof authResources)[number]
  result: string
  onResult: (next: string) => void
}) {
  const isFailed = resource.status === "auth_failed"

  return (
    <Panel
      title="平台认证状态详情"
      action={
        <div className="flex flex-wrap gap-2">
          <Badge tone={statusTone(resource.status)}>{authStatusText(resource.status)}</Badge>
          <Button size="sm" onClick={() => onResult("checked")}>重新检测</Button>
          <Button size="sm" variant="outline" onClick={() => onResult("rotated")}>刷新凭证</Button>
          <Button size="sm" variant="outline" onClick={() => onResult("paused")}>暂停影响范围</Button>
        </div>
      }
    >
      <div className="space-y-4">
        {result !== "pending" && (
          <div className="rounded-md border border-sky-200 bg-sky-50 p-3 text-sm text-sky-800">
            {result === "checked" && `${resource.name} 已完成一次实时检测，检测结果会写入认证日志并同步到平台监控。`}
            {result === "rotated" && `${resource.name} 已提交刷新凭证流程。新凭证生效前，交易服务继续使用当前可用凭证；失败凭证会保持拦截。`}
            {result === "paused" && `${resource.platform} 受影响能力已暂停新请求，已有订单和持仓查询保留状态同步与人工复核入口。`}
            {result === "audit" && `${resource.name} 的最近操作记录已展开，关键动作会进入风控审计。`}
          </div>
        )}
        <FieldGrid
          items={[
            ["认证对象", resource.name],
            ["所属平台", resource.platform],
            ["认证类型", resource.credentialType],
            ["用途", resource.usage],
            ["当前状态", authStatusText(resource.status)],
            ["最近失败", resource.lastError],
            ["影响范围", resource.impact],
            ["有效期", resource.expiresAt],
            ["最近检测", resource.lastChecked],
            ["负责服务", resource.owner],
          ]}
        />
        <div className="grid gap-4 lg:grid-cols-2">
          <div className="rounded-lg border p-4">
            <div className="text-sm font-semibold">影响能力</div>
            <div className="mt-3 space-y-2">
              {resource.affectedActions.map((item) => {
                const [label, value] = item.split("：")
                const tone = value?.includes("正常") ? "green" : value?.includes("阻断") ? "red" : "amber"
                return (
                  <div key={item} className="flex items-center justify-between gap-3 rounded-md border bg-zinc-50 p-3 text-sm">
                    <span className="text-muted-foreground">{label}</span>
                    <Badge tone={tone as Tone}>{value}</Badge>
                  </div>
                )
              })}
            </div>
          </div>
          <div className="rounded-lg border p-4">
            <div className="text-sm font-semibold">建议处理流程</div>
            <div className="mt-3 space-y-2 text-sm text-muted-foreground">
              {isFailed ? (
                <>
                  <div className="rounded-md border bg-white p-3">1. 先点击“重新检测”，确认是否为短暂网络或第三方异常。</div>
                  <div className="rounded-md border bg-white p-3">2. 若仍失败，点击“刷新凭证”，触发凭证更新或 JWT 重新获取流程。</div>
                  <div className="rounded-md border bg-white p-3">3. 若影响下单、撤单或持仓同步，点击“暂停影响范围”，避免继续产生失败请求。</div>
                </>
              ) : (
                <>
                  <div className="rounded-md border bg-white p-3">1. 保持定时检测，状态正常时不需要人工处理。</div>
                  <div className="rounded-md border bg-white p-3">2. 临近有效期时提前刷新凭证，并记录轮换结果。</div>
                  <div className="rounded-md border bg-white p-3">3. 如出现 401 / 403 / 429，再进入暂停或降级流程。</div>
                </>
              )}
            </div>
          </div>
        </div>
        <div className="rounded-lg border p-4">
          <div className="flex items-center justify-between gap-3">
            <div className="text-sm font-semibold">最近操作记录</div>
            <Button size="sm" variant="outline" onClick={() => onResult("audit")}>查看审计记录</Button>
          </div>
          <div className="mt-3 space-y-2">
            {resource.audit.map((item) => (
              <div key={item} className="rounded-md border bg-zinc-50 p-3 text-sm text-muted-foreground">{item}</div>
            ))}
          </div>
        </div>
        <div className="rounded-md border bg-zinc-50 p-3 text-sm text-muted-foreground">
          该模块只管理平台 API 凭证和服务端认证状态，不展示用户钱包授权。用户钱包授权、切链和签名状态在前台交易流程与订单审计中记录。
        </div>
      </div>
    </Panel>
  )
}

function RiskDetail({ record }: { record: RiskRecord }) {
  return (
    <Panel title="风险处理详情">
      <div className="space-y-4">
        <FieldGrid
          items={[
            ["记录编号", record.id],
            ["影响对象", record.targetName],
            ["对象类型", record.targetKind],
            ["触发原因", record.reason],
            ["系统处理结果", record.action],
            ["当前状态", record.status],
            ["触发时间", record.time],
            ["处理来源", record.owner],
          ]}
        />
        <div className="grid gap-4 lg:grid-cols-2">
          <div className="rounded-lg border p-4">
            <div className="text-sm font-semibold">前台会发生什么</div>
            <div className="mt-3 rounded-md border bg-zinc-50 p-3 text-sm text-muted-foreground">{record.frontendImpact}</div>
          </div>
          <div className="rounded-lg border p-4">
            <div className="text-sm font-semibold">恢复条件</div>
            <div className="mt-3 rounded-md border bg-zinc-50 p-3 text-sm text-muted-foreground">{record.recoverCondition}</div>
          </div>
        </div>
        <div className="rounded-lg border p-4">
          <div className="text-sm font-semibold">处理记录</div>
          <div className="mt-3 space-y-2">
            {record.auditTrail.map((item) => (
              <div key={item} className="rounded-md border bg-zinc-50 p-3 text-sm text-muted-foreground">
                {item}
              </div>
            ))}
          </div>
        </div>
        <div className="rounded-md border bg-zinc-50 p-3 text-sm text-muted-foreground">
          这里记录的是系统或运营为了保护用户交易而做出的拦截、暂停、下架和恢复动作。每次操作都需要保留原因、影响范围和处理记录，方便后续排查和复盘。
        </div>
      </div>
    </Panel>
  )
}

function SettlementDetail({
  settlement,
  reviewTask,
  onCreateReviewTask,
}: {
  settlement: SettlementItem
  reviewTask?: SettlementReviewTask
  onCreateReviewTask: (settlement: SettlementItem) => SettlementReviewTask
}) {
  const [toast, setToast] = useState("")
  const [localReviewTask, setLocalReviewTask] = useState<SettlementReviewTask | undefined>(reviewTask)
  const [platformResultStatus, setPlatformResultStatus] = useState("待核对")

  useEffect(() => {
    setToast("")
    setLocalReviewTask(reviewTask)
    setPlatformResultStatus("待核对")
  }, [reviewTask, settlement.id])

  const relatedOrder = orders.find((order) => order.id === settlement.orderId)
  const relatedInstrument = instruments.find((instrument) => instrument.id === settlement.instrumentId)
  const hasReviewTask = Boolean(localReviewTask)
  const canNotify = settlement.status !== "settlement_error"

  return (
    <Panel
      title="结算详情"
      action={
        <div className="flex flex-wrap gap-2">
          <Badge tone={statusTone(settlement.status)}>{settlementStatusText(settlement.status)}</Badge>
          <Button
            size="sm"
            disabled={!canNotify}
            onClick={() => {
              if (!canNotify) return
              setToast(`已向 ${settlement.wallet} 发送结算通知，关联结算记录 ${settlement.id}`)
            }}
          >
            <Bell className="size-4" />
            发送通知
          </Button>
          {settlement.status === "settlement_error" && (
            <Button
              size="sm"
              variant="outline"
              onClick={() => {
                if (localReviewTask) {
                  setToast(`${localReviewTask.id} 已在下方“结算异常复核任务”队列中，可继续核对底层结果和结算金额。`)
                  return
                }
                const createdTask = onCreateReviewTask(settlement)
                setLocalReviewTask(createdTask)
                setToast(`已创建结算复核任务 ${createdTask.id}，并插入下方“结算异常复核任务”队列。下一步是核对底层平台给出的事件最终结果和用户持仓结算金额。`)
              }}
            >
              {hasReviewTask ? "查看复核任务" : "创建复核任务"}
            </Button>
          )}
        </div>
      }
    >
      <div className="space-y-5">
        {toast && (
          <div className="rounded-md border border-sky-200 bg-sky-50 p-3 text-sm text-sky-800">
            {toast}
          </div>
        )}

        <div className="rounded-lg border bg-zinc-50 p-4 text-sm text-muted-foreground">
          结算记录号用于追踪某个订单/持仓在事件到期后的结算结果。它不是订单号；一笔订单成交后形成持仓，事件结算时会生成对应的结算记录。
        </div>

        <div className="grid gap-3 md:grid-cols-3">
          <Info label="结算记录号" value={settlement.id} />
          <Info label="关联订单号" value={settlement.orderId} />
          <Info label="关联标的" value={settlement.instrumentId} />
          <Info label="事件名称" value={settlement.eventName} />
          <Info label="选项" value={settlement.optionName} />
          <Info label="钱包地址" value={settlement.wallet} />
          <Info label="底层平台" value={settlement.venue} />
          <Info label="用户方向" value={`${settlement.side} ${settlement.outcome}`} />
          <Info label="标的结果" value={settlement.result} />
          <Info label="持仓份额" value={settlement.position} />
          <Info label="结算金额" value={settlement.settlementAmount} />
          <Info label="盈亏" value={settlement.pnl} />
          <Info label="通知状态" value={settlement.notice} />
          <Info label="处理动作" value={settlement.action} />
        </div>

        <div className="grid gap-4 xl:grid-cols-2">
          <div className="rounded-lg border bg-white p-4">
            <div className="text-sm font-semibold">关联订单信息</div>
            {relatedOrder ? (
              <div className="mt-3 grid gap-3 md:grid-cols-2">
                <Info label="订单类型" value={relatedOrder.type === "Market" ? "市价" : "限价"} />
                <Info label="事件名称" value={relatedOrder.eventName} />
                <Info label="选项" value={relatedOrder.optionName} />
                <Info label="交易方向" value={`${relatedOrder.side} ${relatedOrder.outcome}`} />
                <Info label="订单金额" value={relatedOrder.amount} />
                <Info label="订单价格" value={relatedOrder.price} />
                <Info label="订单状态" value={orderStatusText(relatedOrder.status)} />
              </div>
            ) : (
              <div className="mt-3 rounded-md border bg-zinc-50 p-3 text-sm text-muted-foreground">历史订单，当前 mock 列表未加载详情。</div>
            )}
          </div>
          <div className="rounded-lg border bg-white p-4">
            <div className="text-sm font-semibold">关联标的信息</div>
            {relatedInstrument ? (
              <div className="mt-3 grid gap-3 md:grid-cols-2">
                <Info label="标的标题" value={relatedInstrument.title} />
                <Info label="平台/链" value={`${relatedInstrument.venue} / ${relatedInstrument.chain}`} />
                <Info label="结算资产" value={relatedInstrument.asset} />
                <Info label="交易状态" value={relatedInstrument.status} />
              </div>
            ) : (
              <div className="mt-3 rounded-md border bg-zinc-50 p-3 text-sm text-muted-foreground">历史标的，当前 mock 列表未加载详情。</div>
            )}
          </div>
        </div>

        {settlement.status === "settlement_error" && (
          <>
            <div className="rounded-lg border border-rose-200 bg-rose-50 p-4 text-sm text-rose-800">
              该结算存在异常，已暂停相关标的或推荐入口。通知状态为“不发送”，原因是在底层平台最终结果和用户可领取金额确认前，不能通知用户领取或确认收益。
            </div>

            <div className="grid gap-4 xl:grid-cols-[0.9fr_1.1fr]">
              <div className="rounded-lg border bg-white p-4">
                <div className="flex items-center justify-between gap-3">
                  <div className="text-sm font-semibold">复核任务</div>
                  <Badge tone={hasReviewTask ? "amber" : "neutral"}>{hasReviewTask ? "已创建" : "未创建"}</Badge>
                </div>
                <div className="mt-3 grid gap-3">
                  <Info label="任务编号" value={localReviewTask?.id ?? "点击创建后生成"} />
                  <Info label="关联结算记录" value={settlement.id} />
                  <Info label="任务状态" value={localReviewTask?.status ?? "未创建"} />
                  <Info label="处理人" value={localReviewTask?.owner ?? "待分配"} />
                  <Info label="下一步" value={localReviewTask?.nextStep ?? "创建复核任务后进入异常队列"} />
                </div>
              </div>

              <div className="rounded-lg border bg-white p-4">
                <div className="text-sm font-semibold">底层平台结果核对</div>
                <div className="mt-3 rounded-md border bg-zinc-50 p-3 text-sm text-muted-foreground">
                  “底层平台结果”指 Predict.fun 或 Polymarket 对这个事件给出的最终开奖和结算状态，包括事件结果、用户持仓是否可结算、可领取金额或失败原因。这里不是我们平台自己判断结果，而是核对底层平台返回的数据。
                </div>
                <div className="mt-3 grid gap-3 md:grid-cols-2">
                  <Info label="平台事件结果" value={platformResultStatus === "已核对" ? "YES 成立" : "待从 Predict.fun 拉取"} />
                  <Info label="用户持仓结算" value={platformResultStatus === "已核对" ? "226.41 YES 可按结果结算" : "待核对"} />
                  <Info label="平台订单记录" value={settlement.orderId} />
                  <Info label="核对状态" value={platformResultStatus} />
                </div>
                <div className="mt-3 flex flex-wrap gap-2">
                  <Button
                    size="sm"
                    onClick={() => {
                      setPlatformResultStatus("已核对")
                      setToast(`${settlement.id} 已刷新底层平台结果：事件结果 YES 成立，待运营确认结算金额。`)
                    }}
                  >
                    刷新底层结果
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    disabled={platformResultStatus !== "已核对"}
                    onClick={() => setToast(`${settlement.id} 已确认底层结果，下一步可生成结算金额并重新发送通知。`)}
                  >
                    确认结果
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setToast(`${settlement.id} 已保持异常状态，并记录为继续等待底层平台结果。`)}
                  >
                    继续等待
                  </Button>
                </div>
              </div>
            </div>

            <div className="rounded-lg border bg-white p-4">
              <div className="text-sm font-semibold">异常处理流程</div>
              <div className="mt-3 grid gap-3 md:grid-cols-4">
                {[
                  ["1", "创建复核任务", hasReviewTask ? "已完成" : "待创建"],
                  ["2", "刷新底层结果", platformResultStatus],
                  ["3", "确认用户结算金额", platformResultStatus === "已核对" ? "待确认" : "等待结果"],
                  ["4", "恢复通知或保持异常", "待决定"],
                ].map(([step, label, value]) => (
                  <div key={step} className="rounded-md border bg-zinc-50 p-3">
                    <div className="text-xs text-muted-foreground">步骤 {step}</div>
                    <div className="mt-1 text-sm font-medium">{label}</div>
                    <div className="mt-2"><Badge tone={value === "已完成" || value === "已核对" ? "green" : value === "待创建" ? "neutral" : "amber"}>{value}</Badge></div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </Panel>
  )
}

function InstrumentDetail({
  instrument,
  eventInstruments,
  toast,
  onToast,
}: {
  instrument: (typeof instruments)[number]
  eventInstruments: typeof instruments
  toast: string
  onToast: (next: string) => void
}) {
  return (
    <Panel title="标的详情与状态记录">
      <div className="space-y-4">
        {toast && (
          <div className="rounded-md border border-sky-200 bg-sky-50 p-3 text-sm text-sky-800">
            {toast}
          </div>
        )}
        <div>
          <div className="text-xs text-muted-foreground">标准化 ID：{instrument.id}</div>
          <h3 className="mt-1 text-lg font-semibold">{instrument.title}</h3>
        </div>
        <div className="grid gap-3 text-sm md:grid-cols-2 xl:grid-cols-3">
          <Info label="底层平台" value={instrument.venue} />
          <Info label="交易链" value={instrument.chain} />
          <Info label="结算资产" value={instrument.asset} />
          <Info label="行情新鲜度" value={instrument.freshness} />
          <Info label="底层市场 ID" value={instrument.venueMarketId} />
          <Info label="结果选项" value={instrument.outcomeName} />
          <Info label="底层选项 ID" value={instrument.outcomeId} />
          <Info label="结算状态" value={instrument.settlementStatus} />
          <Info label="推荐池状态" value={instrument.recommendation} />
          <Info label="最近变更" value={instrument.lastChange} />
        </div>
        <div className="rounded-md border bg-zinc-50 p-3 text-sm text-muted-foreground">
          可交易标的是“底层平台 + 一个事件 + 一个结果选项”的组合。结果选项是用户买的对象，例如西班牙；买 YES 表示买它会发生，买 NO 表示买它不会发生。底层选项 ID 是平台订单接口使用的标识，不是开奖结果。
        </div>
        <div className="text-sm font-semibold">同事件结果选项</div>
        <DataTable
          columns={["结果选项", "YES 价格", "NO 价格", "流动性", "底层选项 ID", "支持交易方向", "状态"]}
          rows={eventInstruments.map((eventInstrument) => [
            eventInstrument.outcomeName,
            eventInstrument.odds,
            eventInstrument.noOdds,
            eventInstrument.liquidity,
            eventInstrument.outcomeId,
            eventInstrument.supportedDirections,
            <Badge tone={statusTone(eventInstrument.status)}>{eventInstrument.status}</Badge>,
          ])}
        />
        <div className="rounded-md border bg-zinc-50 p-3 text-sm text-muted-foreground">
          多选项事件不会在后台拆成“西班牙 YES”和“西班牙 NO”两条标的；后台只保留“世界杯冠军 - 西班牙”这一条可交易标的，YES / NO 作为该标的下单时的交易方向。
        </div>
        <div className="text-sm font-semibold">状态变更记录</div>
        <DataTable
          columns={["时间", "来源", "操作人", "记录", "影响"]}
          rows={[
            ["10:22", "行情同步", "系统自动", instrument.lastChange, "刷新价格/概率"],
            ["10:18", "映射校验", "系统自动", "底层市场 ID 与底层选项 ID 已校验", "允许进入交易面板"],
            ["10:10", "风控规则", "系统自动", instrument.recommendation, "影响智能推荐候选"],
          ]}
        />
        <div className="rounded-md border bg-zinc-50 p-3 text-sm text-muted-foreground">
          状态变更记录包含系统自动同步、风控规则触发和运营人工操作，用来追踪为什么标的可交易、暂停交易或被禁止推荐。
        </div>
        <div className="flex flex-wrap gap-2">
          <Button size="sm" onClick={() => onToast(`${instrument.id} 已确认可交易，前台交易入口可展示。`)}>
            恢复/确认可交易
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => onToast(`${instrument.id} 已暂停当前标的交易。该操作只阻止新订单，不影响其他标的和已有订单/持仓查询。`)}
          >
            暂停当前标的
          </Button>
          <Button size="sm" variant="outline" onClick={() => onToast(`${instrument.id} 已禁止进入智能推荐，但仍可在标的详情页交易。`)}>
            禁止推荐
          </Button>
        </div>
      </div>
    </Panel>
  )
}

function App() {
  const [active, setActive] = useState<ModuleKey>("overview")
  const [detailView, setDetailView] = useState<DetailView | null>(null)
  const [selectedInstrument, setSelectedInstrument] = useState(instruments[0])
  const [instrumentToast, setInstrumentToast] = useState("")
  const [selectedApi, setSelectedApi] = useState(apiHealthRows[1])
  const [selectedApiAction, setSelectedApiAction] = useState("处理")
  const [apiResult, setApiResult] = useState("pending")
  const [selectedGroup, setSelectedGroup] = useState(groupCandidates[0])
  const [groupDecision, setGroupDecision] = useState("pending")
  const [selectedAutoOrder, setSelectedAutoOrder] = useState(autoOrders[0])
  const [autoOrderResult, setAutoOrderResult] = useState(autoOrderState(autoOrders[0].status))
  const [selectedOrder, setSelectedOrder] = useState(orders[0])
  const [orderResult, setOrderResult] = useState("pending")
  const [selectedSettlement, setSelectedSettlement] = useState(settlements[0])
  const [reviewTasks, setReviewTasks] = useState<SettlementReviewTask[]>(settlementReviewTasks)
  const [selectedAuth, setSelectedAuth] = useState(authResources[2])
  const [authResult, setAuthResult] = useState("pending")
  const [selectedRisk, setSelectedRisk] = useState(riskRecords[0])
  const [toastMessage, setToastMessage] = useState("")
  const [instrumentRulesEditing, setInstrumentRulesEditing] = useState(false)
  const [instrumentRuleVersion, setInstrumentRuleVersion] = useState("v1.3 / 生效中")
  const [instrumentScoringRules, setInstrumentScoringRules] = useState(instrumentRuleWeights)
  const [selectedInstrumentScoringRule, setSelectedInstrumentScoringRule] = useState<InstrumentScoringRule>(instrumentRuleWeights[0])
  const [currentInstrumentFilterRules, setCurrentInstrumentFilterRules] = useState<InstrumentFilterRule[]>(instrumentFilterRules)
  const [selectedInstrumentFilterRule, setSelectedInstrumentFilterRule] = useState<InstrumentFilterRule>(instrumentFilterRules[0])
  const [instrumentFilterRuleMode, setInstrumentFilterRuleMode] = useState<"create" | "edit" | "view">("create")
  const [selectedAdmission, setSelectedAdmission] = useState<AdmissionCandidate>(admissionCandidates[0])
  const [groupRulesEditing, setGroupRulesEditing] = useState(false)
  const [groupRuleVersion, setGroupRuleVersion] = useState("v1.2 / 生效中")
  const [groupScoringRules, setGroupScoringRules] = useState<GroupScoringRule[]>(groupRuleWeights)
  const [selectedGroupScoringRule, setSelectedGroupScoringRule] = useState<GroupScoringRule>(groupRuleWeights[0])
  const [filters, setFilters] = useState<Record<string, ListFilterState>>({
    api: createFilter(),
    rawMarkets: createFilter(),
    admission: createFilter(),
    instruments: createFilter(),
    groups: createFilter(),
    autoOrder: createFilter(),
    orders: createFilter(),
    positions: createFilter(),
    auth: createFilter(),
    risk: createFilter(),
  })

  const activeLabel = useMemo(() => navItems.find((item) => item.key === active)?.label ?? "总览", [active])
  const totalInstrumentWeight = useMemo(() => instrumentScoringRules.reduce((sum, item) => sum + item.weight, 0), [instrumentScoringRules])
  const totalGroupWeight = useMemo(() => groupScoringRules.reduce((sum, item) => sum + item.weight, 0), [groupScoringRules])
  const updateFilter = (key: string, next: ListFilterState) => setFilters((current) => ({ ...current, [key]: next }))
  const updateInstrumentWeight = (name: string, weight: number) => {
    setInstrumentScoringRules((current) => current.map((item) => item.name === name ? { ...item, weight } : item))
  }
  const saveInstrumentScoringRule = (rule: InstrumentScoringRule) => {
    setInstrumentScoringRules((current) => current.map((item) => item.name === rule.name ? rule : item))
    setInstrumentRulesEditing(true)
    setDetailView(null)
    showToast(`${rule.name}评分配置已更新为草稿。请确认总权重和试算结果后保存规则版本。`)
  }
  const saveInstrumentFilterRule = (rule: InstrumentFilterRule) => {
    setCurrentInstrumentFilterRules((current) => {
      const exists = current.some((item) => item.id === rule.id)
      return exists ? current.map((item) => item.id === rule.id ? rule : item) : [rule, ...current]
    })
    setInstrumentRulesEditing(true)
    setDetailView(null)
    showToast("强制过滤规则已更新为草稿。建议点击“试算规则”确认影响范围，再保存规则版本。")
  }
  const updateGroupWeight = (name: string, weight: number) => {
    setGroupScoringRules((current) => current.map((item) => item.name === name ? { ...item, weight } : item))
  }
  const saveGroupScoringRule = (rule: GroupScoringRule) => {
    setGroupScoringRules((current) => current.map((item) => item.name === rule.name ? rule : item))
    setGroupRulesEditing(true)
    setDetailView(null)
    showToast(`${rule.name}匹配配置已更新为草稿。请确认总权重后保存规则版本。`)
  }
  const showToast = (message: string) => setToastMessage(message)
  useEffect(() => {
    if (!toastMessage) return
    const timer = window.setTimeout(() => setToastMessage(""), 4200)
    return () => window.clearTimeout(timer)
  }, [toastMessage])
  const runApiAction = (action: string, api: ApiHealthRow) => {
    const meta = getApiActionMeta(action, api)
    showToast(meta.feedback)
  }
  const createSettlementReviewTask = (settlement: SettlementItem) => {
    const existingTask = reviewTasks.find((task) => task.settlementId === settlement.id)
    if (existingTask) return existingTask
    const createdTask: SettlementReviewTask = {
      id: `REV-${settlement.id.replace("SET-", "")}`,
      settlementId: settlement.id,
      orderId: settlement.orderId,
      eventName: settlement.eventName,
      venue: settlement.venue,
      status: "待核对底层结果",
      owner: "结算运营",
      nextStep: `核对 ${settlement.venue} 事件结果、用户持仓和可领取金额`,
      createdAt: "刚刚",
    }
    setReviewTasks((current) => [createdTask, ...current])
    return createdTask
  }
  const filteredApiRows = useMemo(
    () => apiHealthRows.filter((row) => itemMatchesFilter(`${row.venue} ${row.api} ${row.impact}`, row.status, filters.api)),
    [filters.api],
  )
  const filteredRawMarketRows = useMemo(
    () => rawMarketRows.filter((row) => itemMatchesFilter(`${row.venue} ${row.source} ${row.title} ${row.error}`, row.status, filters.rawMarkets)),
    [filters.rawMarkets],
  )
  const filteredInstruments = useMemo(
    () =>
      instruments.filter((instrument) =>
        itemMatchesFilter(
          `${instrument.title} ${instrument.eventName} ${instrument.outcomeName} ${instrument.venue} ${instrument.chain} ${instrument.asset}`,
          instrument.status,
          filters.instruments,
        ),
      ),
    [filters.instruments],
  )
  const filteredAdmissionCandidates = useMemo(
    () =>
      admissionCandidates.filter((item) =>
        itemMatchesFilter(
          `${item.id} ${item.rawMarketId} ${item.venue} ${item.source} ${item.title} ${item.trigger} ${item.reason}`,
          item.status,
          filters.admission,
        ),
      ),
    [filters.admission],
  )
  const filteredGroups = useMemo(
    () => groupCandidates.filter((group) => itemMatchesFilter(`${group.title} ${group.type} ${group.delta}`, group.statusLabel, filters.groups)),
    [filters.groups],
  )
  const filteredAutoOrders = useMemo(
    () => autoOrders.filter((item) => itemMatchesFilter(`${item.title} ${item.instrument} ${item.reason} ${item.exposure}`, item.status, filters.autoOrder)),
    [filters.autoOrder],
  )
  const filteredOrders = useMemo(
    () => orders.filter((order) => itemMatchesFilter(`${order.id} ${order.wallet} ${order.eventName} ${order.optionName} ${order.side} ${order.outcome} ${order.venue}`, order.status, filters.orders)),
    [filters.orders],
  )
  const filteredSettlements = useMemo(
    () => settlements.filter((settlement) => itemMatchesFilter(`${settlement.id} ${settlement.orderId} ${settlement.eventName} ${settlement.optionName} ${settlement.wallet}`, settlement.status, filters.positions)),
    [filters.positions],
  )
  const filteredAuthResources = useMemo(
    () => authResources.filter((resource) => itemMatchesFilter(`${resource.name} ${resource.platform} ${resource.usage} ${resource.lastError}`, authStatusText(resource.status), filters.auth)),
    [filters.auth],
  )
  const filteredRiskRecords = useMemo(
    () => riskRecords.filter((record) => itemMatchesFilter(`${record.id} ${record.targetName} ${record.targetKind} ${record.reason} ${record.action}`, record.status, filters.risk)),
    [filters.risk],
  )
  const selectedEventInstruments = useMemo(
    () =>
      instruments.filter(
        (instrument) =>
          instrument.eventId === selectedInstrument.eventId &&
          instrument.venue === selectedInstrument.venue &&
          instrument.chain === selectedInstrument.chain,
      ),
    [selectedInstrument],
  )

  return (
    <main className="min-h-svh bg-zinc-100 text-foreground">
      {toastMessage && (
        <div className="fixed right-5 top-5 z-[80] max-w-md rounded-lg border border-sky-200 bg-white px-4 py-3 text-sm text-sky-900 shadow-lg">
          <div className="flex items-start gap-3">
            <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-sky-600" />
            <div className="min-w-0 flex-1">{toastMessage}</div>
            <button className="text-zinc-400 hover:text-zinc-700" onClick={() => setToastMessage("")}>关闭</button>
          </div>
        </div>
      )}
      <div className="flex min-h-svh">
        <aside className="hidden w-64 shrink-0 border-r bg-white lg:block">
          <div className="border-b p-5">
            <div className="flex items-center gap-3">
              <div className="flex size-10 items-center justify-center rounded-lg bg-zinc-950 text-sm font-semibold text-white">
                PM
              </div>
              <h1 className="text-xl font-semibold">管理后台</h1>
            </div>
          </div>
          <nav className="space-y-1 p-3">
            {navItems.map((item) => {
              const Icon = item.icon
              const isActive = active === item.key
              return (
                <button
                  key={item.key}
                  onClick={() => setActive(item.key)}
                  className={`flex h-10 w-full items-center gap-3 rounded-md px-3 text-left text-sm transition ${
                    isActive ? "bg-zinc-900 text-white" : "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-950"
                  }`}
                >
                  <Icon className="size-4" />
                  {item.label}
                </button>
              )
            })}
          </nav>
        </aside>

        <section className="min-w-0 flex-1">
          <header className="sticky top-0 z-10 border-b bg-white/95 backdrop-blur">
            <div className="flex flex-col gap-4 px-4 py-4 xl:flex-row xl:items-center xl:justify-between xl:px-6">
              <div>
                <div className="text-xs text-muted-foreground">预测市场聚合器一期 / 交易底座与后台</div>
                <h2 className="mt-1 text-2xl font-semibold">{activeLabel}</h2>
              </div>
              <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-6">
                {statusCards.map((card) => (
                  <div key={card.label} className="rounded-md border bg-white px-3 py-2">
                    <div className="text-[11px] text-muted-foreground">{card.label}</div>
                    <div className="mt-1 flex items-center justify-between gap-2">
                      <Badge tone={card.tone}>{card.value}</Badge>
                      <span className="text-[11px] text-muted-foreground">{card.detail}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex gap-2 overflow-x-auto px-4 pb-3 lg:hidden">
              {navItems.map((item) => (
                <Button
                  key={item.key}
                  variant={active === item.key ? "default" : "outline"}
                  size="sm"
                  onClick={() => setActive(item.key)}
                >
                  {item.label}
                </Button>
              ))}
            </div>
          </header>

          <div className="space-y-5 p-4 xl:p-6">
            <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              {metrics.map((metric) => (
                <StatCard key={metric.label} {...metric} />
              ))}
            </section>

            {active === "overview" && (
              <div className="grid gap-5 xl:grid-cols-[1.4fr_0.8fr]">
                <Panel
                  title="API 健康与降级状态"
                  action={
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        setActive("markets")
                        setSelectedApi(apiHealthRows[1])
                        setSelectedApiAction("处理")
                      }}
                    >
                      进入市场同步
                    </Button>
                  }
                >
                  <DataTable
                    columns={["平台", "API", "状态", "延迟", "影响", "总览判断"]}
                    rows={apiHealthRows.map((row) => [
                      row.venue,
                      row.api,
                      <Badge tone={statusTone(row.status)}>{row.status}</Badge>,
                      row.latency,
                      row.impact,
                      row.status === "healthy" || row.status === "stable" ? "无需处理" : "需进入市场同步处理",
                    ])}
                  />
                  <div className="mt-4 rounded-lg border bg-zinc-50 p-4 text-sm text-muted-foreground">
                    总览页只展示健康摘要、延迟和影响范围；API 详情、手动重试、暂停/恢复、日志和 WebSocket 心跳统一在“市场同步”页面处理。
                  </div>
                </Panel>
                <Panel title="今日待处理">
                  <div className="space-y-3">
                    {[
                      ["高匹配归组待确认", "18", "仅匹配度 >= 95 的候选进入"],
                      ["智能推荐待审", "14", "3 个 Quote 即将过期"],
                      ["结算异常", "2", "需要人工刷新底层状态"],
                      ["认证告警", "1", "Predict.fun JWT 刷新失败"],
                    ].map(([label, value, note]) => (
                      <div key={label} className="flex items-center justify-between rounded-md border p-3">
                        <div>
                          <div className="text-sm font-medium">{label}</div>
                          <div className="text-xs text-muted-foreground">{note}</div>
                        </div>
                        <div className="text-xl font-semibold">{value}</div>
                      </div>
                    ))}
                  </div>
                </Panel>
              </div>
            )}

            {active === "markets" && (
              <div className="space-y-5">
                <Panel
                  title="API 管理与降级操作"
                  action={
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        const count = filteredApiRows.length
                        showToast(`已提交 ${count} 个 API 来源的健康刷新任务，完成后会更新状态、延迟和影响范围。`)
                      }}
                    >
                      <RefreshCw className="size-4" />
                      刷新健康
                    </Button>
                  }
                >
                  <ListToolbar
                    filter={filters.api}
                    statusOptions={["healthy", "degraded", "stable"]}
                    onChange={(next) => updateFilter("api", next)}
                    keywordPlaceholder="搜索平台、API、影响范围"
                  />
                  <DataTable
                    columns={["平台", "API", "状态", "延迟", "影响", "建议处理", "操作"]}
                    rows={filteredApiRows.map((row) => [
                      row.venue,
                      row.api,
                      <Badge tone={statusTone(row.status)}>{row.status}</Badge>,
                      row.latency,
                      row.impact,
                      row.suggestion,
                      <div className="flex flex-wrap gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setSelectedApi(row)
                            setSelectedApiAction(row.primary)
                            setDetailView("api")
                          }}
                        >
                          {row.primary}
                        </Button>
                        {row.more.map((action) => (
                          <Button
                            key={action}
                            size="sm"
                            variant={isApiDirectAction(action) ? "default" : "outline"}
                            onClick={() => {
                              setSelectedApi(row)
                              setSelectedApiAction(action)
                              if (isApiDirectAction(action)) {
                                runApiAction(action, row)
                                return
                              }
                              setDetailView("api")
                            }}
                          >
                            {action}
                          </Button>
                        ))}
                      </div>,
                    ])}
                  />
                  <div className="mt-4 grid gap-3 md:grid-cols-3">
                    <Info label="详情范围" value="成功率 / 延迟 / 最近错误 / 影响标的" />
                    <Info label="可执行动作" value="检测 / 重试 / 暂停下单 / 日志 / 心跳" />
                    <Info label="审计要求" value="关键操作必须记录操作人、原因和影响范围" />
                  </div>
                </Panel>

                <div className="space-y-5">
                  <Panel
                    title="原始市场同步记录"
                    action={
                      <Button
                        size="sm"
                        onClick={() => {
                          const sources = Array.from(new Set(filteredRawMarketRows.map((row) => `${row.venue} / ${row.source}`))).join("、")
                          showToast(`已提交 ${filteredRawMarketRows.length} 个当前筛选来源的同步任务：${sources}。完成后会刷新同步状态、最近错误和候选标记。`)
                        }}
                      >
                        <RefreshCw className="size-4" />
                        同步当前筛选来源
                      </Button>
                    }
                  >
                    <div className="mb-4 grid gap-3 md:grid-cols-3">
                      <Info label="同步对象" value="当前筛选结果中的 Venue + API 来源" />
                      <Info label="同步内容" value="原始标题、状态、错误、是否进入候选池" />
                      <Info label="不会影响" value="不会直接下单，也不会修改用户订单和持仓" />
                    </div>
                    <ListToolbar
                      filter={filters.rawMarkets}
                      statusOptions={["success", "rate_limited", "orderbook_stale"]}
                      onChange={(next) => updateFilter("rawMarkets", next)}
                      keywordPlaceholder="搜索平台、来源、原始标题、错误"
                      statusLabel="同步状态"
                    />
                    <DataTable
                      columns={["Venue", "API 来源", "原始标题", "同步状态", "最近错误", "候选", "操作"]}
                      rows={filteredRawMarketRows.map((row) => [
                        row.venue,
                        row.source,
                        row.title,
                        <Badge tone={statusTone(row.status)}>{row.status}</Badge>,
                        row.error,
                        row.candidate,
                        <div className="flex flex-wrap gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              setSelectedApi(apiFromRawMarket(row))
                              setSelectedApiAction(`查看原始市场：${row.venue} / ${row.source}`)
                              setDetailView("api")
                            }}
                          >
                            查看
                          </Button>
                          <Button
                            size="sm"
                            variant="default"
                            onClick={() => {
                              showToast(`${row.venue} / ${row.source} 已提交同步任务。完成后会刷新该来源的同步状态、最近错误和候选标记。`)
                            }}
                          >
                            同步该来源
                          </Button>
                        </div>,
                      ])}
                    />
                  </Panel>
                </div>
              </div>
            )}

            {active === "instrumentRules" && (
              <div className="space-y-5">
                <Panel
                  title="标的过滤规则配置"
                  action={
                    <div className="flex flex-wrap gap-2">
                      <Badge tone={instrumentRulesEditing ? "amber" : "green"}>{instrumentRuleVersion}</Badge>
                      {instrumentRulesEditing ? (
                        <>
                          <Button
                            size="sm"
                            disabled={totalInstrumentWeight !== 100}
                            onClick={() => {
                              setInstrumentRulesEditing(false)
                              setInstrumentRuleVersion("v1.4 / 生效中")
                              showToast("标的过滤规则已保存为新版本。后续市场同步会按最新评分、阈值和强制过滤规则重新计算候选结果。")
                            }}
                          >
                            保存规则
                          </Button>
                          <Button size="sm" variant="outline" onClick={() => setInstrumentRulesEditing(false)}>取消编辑</Button>
                        </>
                      ) : (
                        <Button size="sm" onClick={() => setInstrumentRulesEditing(true)}>编辑规则</Button>
                      )}
                    </div>
                  }
                >
                  <div className="grid gap-4 xl:grid-cols-[1fr_0.8fr]">
                    <div className="space-y-4">
                      <div className="rounded-lg border bg-zinc-50 p-4 text-sm text-muted-foreground">
                        这里配置的是“原平台市场是否能进入本聚合平台成为可交易标的”的准入规则。系统先执行强制过滤规则，再计算推荐分；推荐分决定自动入池、人工审核或直接过滤。
                      </div>
                      <div className="rounded-lg border bg-white p-4">
                        <div className="text-sm font-semibold">推荐分计算公式</div>
                        <div className="mt-2 text-sm text-muted-foreground">
                          推荐分 = {instrumentScoringRules.map((item) => `${item.name}分 × ${item.weight}%`).join(" + ")}。
                        </div>
                        <div className="mt-3 grid gap-3 md:grid-cols-3">
                          <Info label="单项分范围" value="每个参数先独立计算 0-100 分" />
                          <Info label="权重要求" value="单项 0-60%，全部权重合计必须等于 100%" />
                          <Info label="强制规则优先级" value="先拦截或强制人工审核，再看推荐分" />
                        </div>
                        <div className={`mt-3 rounded-md border p-3 text-sm ${totalInstrumentWeight === 100 ? "border-emerald-200 bg-emerald-50 text-emerald-800" : "border-amber-200 bg-amber-50 text-amber-800"}`}>
                          当前总权重：{totalInstrumentWeight}%。{totalInstrumentWeight === 100 ? "可以保存。" : "必须调整为 100% 后才能保存。"}
                        </div>
                      </div>
                      <DataTable
                        columns={["评分参数", "权重", "接口字段", "说明"]}
                        rows={instrumentScoringRules.map((item) => [
                          item.name,
                          <div className="flex min-w-40 items-center gap-3">
                            <input
                              className="h-2 flex-1 accent-zinc-900 disabled:opacity-40"
                              type="range"
                              min="0"
                              max="60"
                              value={item.weight}
                              disabled={!instrumentRulesEditing}
                              onChange={(event) => updateInstrumentWeight(item.name, Number(event.target.value))}
                            />
                            <span className="w-10 text-right font-medium">{item.weight}%</span>
                          </div>,
                          <div className="max-w-md text-xs text-muted-foreground">{item.sourceFields.join(", ")}</div>,
                          item.description,
                        ])}
                      />
                    </div>
                    <div className="space-y-3">
                      <Info label="自动进入可交易标的" value="推荐分 >= 80" />
                      <Info label="进入人工审核" value="60 <= 推荐分 < 80" />
                      <Info label="直接过滤" value="推荐分 < 60" />
                      <Info label="进入智能推荐候选池" value="已成为可交易标的且推荐分 >= 85" />
                      <Info label="当前状态" value={instrumentRulesEditing ? "编辑中，未保存前不影响线上同步" : "浏览态，规则正在生效"} />
                      <Info label="保存条件" value={totalInstrumentWeight === 100 ? "权重校验通过" : `当前总权重 ${totalInstrumentWeight}%，不能保存`} />
                      <div className="rounded-lg border bg-white p-4 text-sm text-muted-foreground">
                        保存规则不是单纯保存页面文字，而是生成新的规则版本。保存后，后续市场同步、候选标的筛选、人工审核队列和智能推荐候选池都会按新规则重新计算。
                      </div>
                    </div>
                  </div>
                </Panel>

                <Panel title="单项评分规则">
                  <div className="grid gap-3 xl:grid-cols-2">
                    {instrumentScoringRules.map((item) => (
                      <div key={item.name} className="rounded-lg border bg-white p-4">
                        <div className="flex items-center justify-between gap-3">
                          <div>
                            <div className="text-sm font-semibold">{item.name}</div>
                            <div className="mt-1 text-xs text-muted-foreground">{item.sourceFields.slice(0, 3).join(" / ")}{item.sourceFields.length > 3 ? " ..." : ""}</div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge tone="blue">权重 {item.weight}%</Badge>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => {
                                setSelectedInstrumentScoringRule(item)
                                setInstrumentRulesEditing(true)
                                setDetailView("instrumentScoreRule")
                              }}
                            >
                              编辑
                            </Button>
                          </div>
                        </div>
                        <div className="mt-2 text-sm text-muted-foreground">{item.scoreRule}</div>
                        <div className="mt-3 space-y-2">
                          {item.scoreBands.slice(0, 3).map((band) => (
                            <div key={band} className="rounded-md border bg-zinc-50 p-2 text-xs text-muted-foreground">{band}</div>
                          ))}
                        </div>
                        <div className="mt-3 rounded-md border bg-white p-3 text-xs text-muted-foreground">示例：{item.example}</div>
                      </div>
                    ))}
                  </div>
                </Panel>

                <Panel title="强制过滤规则">
                  <DataTable
                    columns={["规则名称", "触发条件", "处理动作", "状态", "操作"]}
                    rows={currentInstrumentFilterRules.map((item) => [
                      item.rule,
                      item.condition,
                      <Badge tone={item.action === "直接过滤" ? "red" : "amber"}>{item.action}</Badge>,
                      <Badge tone="green">{item.status}</Badge>,
                      <div className="flex flex-wrap gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setSelectedInstrumentFilterRule(item)
                            setInstrumentFilterRuleMode("view")
                            setDetailView("instrumentForceRuleView")
                          }}
                        >
                          查看
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setSelectedInstrumentFilterRule(item)
                            setInstrumentFilterRuleMode("edit")
                            setInstrumentRulesEditing(true)
                            setDetailView("instrumentRuleCreate")
                          }}
                        >
                          编辑
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setCurrentInstrumentFilterRules((current) => current.filter((rule) => rule.id !== item.id))
                            setInstrumentRulesEditing(true)
                            showToast(`${item.rule} 已从规则草稿中删除。保存规则版本后生效。`)
                          }}
                        >
                          删除
                        </Button>
                      </div>,
                    ])}
                  />
                  <div className="mt-4 flex flex-wrap gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        setInstrumentRulesEditing(true)
                        setInstrumentFilterRuleMode("create")
                        setSelectedInstrumentFilterRule(instrumentFilterRules[0])
                        setDetailView("instrumentRuleCreate")
                      }}
                    >
                      新增规则
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => showToast("已试算当前规则：4 个样例标的完成重算，其中 2 个自动入池、1 个进入人工审核、1 个被强制过滤。")}>试算规则</Button>
                  </div>
                </Panel>

                <Panel title="规则试算结果">
                  <DataTable
                    columns={["原平台标的", "平台", "推荐分", "准入结果", "主要原因", "后续流向"]}
                    rows={instrumentRulePreview.map((item) => [
                      item.title,
                      item.venue,
                      <Badge tone={item.score >= 80 ? "green" : item.score >= 60 ? "amber" : "red"}>{item.score}</Badge>,
                      <Badge tone={item.decision === "进入可交易标的" ? "green" : item.decision === "人工审核" ? "amber" : "red"}>{item.decision}</Badge>,
                      item.reason,
                      item.next,
                    ])}
                  />
                </Panel>

                <Panel title="标的准入人工审核队列">
                  <ListToolbar
                    filter={filters.admission}
                    statusOptions={["待审核", "已通过", "已拒绝"]}
                    onChange={(next) => updateFilter("admission", next)}
                    keywordPlaceholder="搜索审核单、原始市场、平台、来源、触发原因"
                    statusLabel="审核状态"
                  />
                  <DataTable
                    columns={["审核单号", "原平台标的", "平台/来源", "推荐分", "触发原因", "状态", "操作"]}
                    rows={filteredAdmissionCandidates.map((item) => [
                      item.id,
                      item.title,
                      `${item.venue} / ${item.source}`,
                      <Badge tone={item.score >= 80 ? "green" : item.score >= 60 ? "amber" : "red"}>{item.score}</Badge>,
                      item.trigger,
                      <Badge tone={item.status === "待审核" ? "amber" : item.status === "已通过" ? "green" : "red"}>{item.status}</Badge>,
                      <Button
                        size="sm"
                        variant={selectedAdmission.id === item.id ? "default" : "outline"}
                        onClick={() => {
                          setSelectedAdmission(item)
                          setDetailView("admissionReview")
                        }}
                      >
                        查看
                      </Button>,
                    ])}
                  />
                  <div className="mt-4 rounded-lg border bg-zinc-50 p-4 text-sm text-muted-foreground">
                    该队列承接推荐分处于人工审核区间，或命中强制人工审核规则的原平台市场。通过后才生成可交易标的；拒绝后只保留原始市场和审核记录。
                  </div>
                </Panel>
              </div>
            )}

            {active === "instruments" && (
              <div className="space-y-5">
                <Panel
                  title="可交易标的管理"
                >
                  <ListToolbar
                    filter={filters.instruments}
                    statusOptions={["tradable", "stale_market", "low_liquidity"]}
                    onChange={(next) => updateFilter("instruments", next)}
                    keywordPlaceholder="搜索事件、结果选项、平台、链、资产"
                    statusLabel="交易状态"
                  />
                  <DataTable
                    columns={["可交易标的", "结果选项", "平台/链", "资产", "YES 价格", "流动性", "交易状态", "操作"]}
                    rows={filteredInstruments.map((item) => [
                      <button
                        className="text-left font-medium text-sky-700"
                        onClick={() => {
                          setSelectedInstrument(item)
                          setInstrumentToast("")
                          setDetailView("instrument")
                        }}
                      >
                        {item.title}
                      </button>,
                      item.outcomeName,
                      `${item.venue} / ${item.chain}`,
                      item.asset,
                      item.odds,
                      item.liquidity,
                      <Badge tone={statusTone(item.status)}>{item.status}</Badge>,
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setSelectedInstrument(item)
                          setInstrumentToast("")
                          setDetailView("instrument")
                        }}
                      >
                        查看
                      </Button>,
                    ])}
                  />
                </Panel>
              </div>
            )}

            {active === "groupRules" && (
              <div className="space-y-5">
                <Panel
                  title="事件归组规则配置"
                  action={
                    <div className="flex flex-wrap gap-2">
                      <Badge tone={groupRulesEditing ? "amber" : "green"}>{groupRuleVersion}</Badge>
                      {groupRulesEditing ? (
                        <>
                          <Button
                            size="sm"
                            disabled={totalGroupWeight !== 100}
                            onClick={() => {
                              setGroupRulesEditing(false)
                              setGroupRuleVersion("v1.3 / 生效中")
                              showToast("事件归组规则已保存为新版本。后续归组任务会按最新匹配度阈值重新计算。")
                            }}
                          >
                            保存规则
                          </Button>
                          <Button size="sm" variant="outline" onClick={() => setGroupRulesEditing(false)}>取消编辑</Button>
                        </>
                      ) : (
                        <Button size="sm" onClick={() => setGroupRulesEditing(true)}>编辑规则</Button>
                      )}
                    </div>
                  }
                >
                  <div className="grid gap-4 xl:grid-cols-[1fr_0.8fr]">
                    <div className="space-y-4">
                      <div className="rounded-lg border bg-zinc-50 p-4 text-sm text-muted-foreground">
                        这里配置的是“两个原平台事件是否属于同一主题”的判断规则。它只决定 EventGroup 展示归组，不代表合并盘口、合并深度或合并持仓成本。
                      </div>
                      <div className="rounded-lg border bg-white p-4">
                        <div className="text-sm font-semibold">匹配度计算公式</div>
                        <div className="mt-2 text-sm text-muted-foreground">
                          匹配度 = {groupScoringRules.map((item) => `${item.name}分 × ${item.weight}%`).join(" + ")}。
                        </div>
                        <div className="mt-3 grid gap-3 md:grid-cols-3">
                          <Info label="单项分范围" value="每个匹配项先独立计算 0-100 分" />
                          <Info label="权重要求" value="单项 0-60%，全部权重合计必须等于 100%" />
                          <Info label="归组原则" value="高匹配才归组，否则不归组" />
                        </div>
                        <div className={`mt-3 rounded-md border p-3 text-sm ${totalGroupWeight === 100 ? "border-emerald-200 bg-emerald-50 text-emerald-800" : "border-amber-200 bg-amber-50 text-amber-800"}`}>
                          当前总权重：{totalGroupWeight}%。{totalGroupWeight === 100 ? "可以保存。" : "必须调整为 100% 后才能保存。"}
                        </div>
                      </div>
                      <DataTable
                        columns={["匹配参数", "权重", "接口字段", "说明"]}
                        rows={groupScoringRules.map((item) => [
                          item.name,
                          <div className="flex min-w-40 items-center gap-3">
                            <input
                              className="h-2 flex-1 accent-zinc-900 disabled:opacity-40"
                              type="range"
                              min="0"
                              max="60"
                              value={item.weight}
                              disabled={!groupRulesEditing}
                              onChange={(event) => updateGroupWeight(item.name, Number(event.target.value))}
                            />
                            <span className="w-10 text-right font-medium">{item.weight}%</span>
                          </div>,
                          <div className="max-w-md text-xs text-muted-foreground">{item.sourceFields.join(", ")}</div>,
                          item.description,
                        ])}
                      />
                    </div>
                    <div className="space-y-3">
                      <Info label="允许归组" value="匹配度 >= 95" />
                      <Info label="不归组" value="匹配度 < 95" />
                      <Info label="归组口径" value="结果定义、结算时间、结算规则必须高度一致" />
                      <Info label="当前状态" value={groupRulesEditing ? "编辑中，未保存前不影响线上归组" : "浏览态，规则正在生效"} />
                      <Info label="保存条件" value={totalGroupWeight === 100 ? "权重校验通过" : `当前总权重 ${totalGroupWeight}%，不能保存`} />
                      <div className="rounded-lg border bg-white p-4 text-sm text-muted-foreground">
                        Polygon/BNB Chain、USDC/USDT 等平台资产差异不作为匹配评分项，只在前台和订单详情里展示，不代表不能归组。
                      </div>
                    </div>
                  </div>
                </Panel>

                <Panel title="单项匹配规则">
                  <div className="grid gap-3 xl:grid-cols-2">
                    {groupScoringRules.map((item) => (
                      <div key={item.name} className="rounded-lg border bg-white p-4">
                        <div className="flex items-center justify-between gap-3">
                          <div>
                            <div className="text-sm font-semibold">{item.name}</div>
                            <div className="mt-1 text-xs text-muted-foreground">{item.sourceFields.slice(0, 3).join(" / ")}{item.sourceFields.length > 3 ? " ..." : ""}</div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge tone="blue">权重 {item.weight}%</Badge>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => {
                                setSelectedGroupScoringRule(item)
                                setGroupRulesEditing(true)
                                setDetailView("groupScoreRule")
                              }}
                            >
                              编辑
                            </Button>
                          </div>
                        </div>
                        <div className="mt-2 text-sm text-muted-foreground">{item.scoreRule}</div>
                        <div className="mt-3 space-y-2">
                          {item.scoreBands.slice(0, 3).map((band) => (
                            <div key={band} className="rounded-md border bg-zinc-50 p-2 text-xs text-muted-foreground">{band}</div>
                          ))}
                        </div>
                        <div className="mt-3 rounded-md border bg-white p-3 text-xs text-muted-foreground">示例：{item.example}</div>
                      </div>
                    ))}
                  </div>
                </Panel>
              </div>
            )}

            {active === "groups" && (
              <div className="space-y-5">
                <Panel title="同主题归组待确认列表">
                  <ListToolbar
                    filter={filters.groups}
                    statusOptions={["待确认"]}
                    onChange={(next) => updateFilter("groups", next)}
                    keywordPlaceholder="搜索主题、类型、参数摘要"
                    statusLabel="确认状态"
                  />
                  <DataTable
                    columns={["主题", "匹配度", "类型", "参数摘要", "状态", "操作"]}
                    rows={filteredGroups.map((item) => [
                      item.title,
                      item.matchRate,
                      item.type,
                      item.delta,
                      <Badge tone={statusTone(item.status)}>{item.statusLabel}</Badge>,
                      <Button
                        size="sm"
                        variant={selectedGroup.id === item.id ? "default" : "outline"}
                        onClick={() => {
                          setSelectedGroup(item)
                          setGroupDecision("pending")
                          setDetailView("group")
                        }}
                      >
                        查看
                      </Button>,
                    ])}
                  />
                  <div className="mt-4 grid gap-3 md:grid-cols-3">
                    <Info label="进入条件" value="匹配度 >= 95，且结果定义、结算时间、结算规则、赔率方向等关键参数一致" />
                    <Info label="确认动作" value="运营确认后只生成 EventGroup，用于同主题展示、持仓归组和套利提示" />
                    <Info label="不入选规则" value="匹配度不足或关键参数冲突的市场不进入该列表，也不会被人工强行归组" />
                  </div>
                </Panel>
              </div>
            )}

            {active === "autoOrder" && (
              <div className="space-y-5">
                <Panel title="AI 快捷下单推荐列表">
                  <ListToolbar
                    filter={filters.autoOrder}
                    statusOptions={["live", "paused", "delisted", "reviewing"]}
                    onChange={(next) => updateFilter("autoOrder", next)}
                    keywordPlaceholder="搜索推荐文案、标的、原因、展示位置"
                    statusLabel="推荐状态"
                  />
                  <DataTable
                    columns={["推荐文案", "标的", "推荐分", "状态", "原因", "动作"]}
                    rows={filteredAutoOrders.map((item) => [
                      item.title,
                      item.instrument,
                      item.score,
                      <Badge tone={statusTone(item.status)}>{item.status}</Badge>,
                      item.reason,
                      <Button
                        size="sm"
                        variant={selectedAutoOrder.id === item.id ? "default" : "outline"}
                        onClick={() => {
                          setSelectedAutoOrder(item)
                          setAutoOrderResult(autoOrderState(item.status))
                          setDetailView("autoOrder")
                        }}
                      >
                        查看
                      </Button>,
                    ])}
                  />
                  <div className="mt-4 rounded-lg border bg-zinc-50 p-4 text-sm text-muted-foreground">
                    这里管理的是“快捷下单推荐入口”，不是系统替用户自动下单。上线后只影响 Banner、推荐卡片和快捷入口曝光；真实交易仍由用户确认、签名后提交到当前标的绑定平台。
                  </div>
                </Panel>
              </div>
            )}

            {active === "orders" && (
              <div className="space-y-5">
                <Panel title="订单列表">
                  <ListToolbar
                    filter={filters.orders}
                    statusOptions={["filled", "partially_filled", "failed", "open"]}
                    onChange={(next) => updateFilter("orders", next)}
                    keywordPlaceholder="搜索订单号、钱包、事件、选项、平台"
                    statusLabel="订单状态"
                  />
                  <DataTable
                    columns={["订单号", "事件名称", "选项", "交易方向", "平台", "金额", "状态", "操作"]}
                    rows={filteredOrders.map((item) => [
                      item.id,
                      item.eventName,
                      item.optionName,
                      `${item.side} ${item.outcome}`,
                      item.venue,
                      item.amount,
                      <Badge tone={statusTone(item.status)}>{orderStatusText(item.status)}</Badge>,
                      <Button
                        size="sm"
                        variant={selectedOrder.id === item.id ? "default" : "outline"}
                        onClick={() => {
                          setSelectedOrder(item)
                          setOrderResult("pending")
                          setDetailView("order")
                        }}
                      >
                        查看
                      </Button>,
                    ])}
                  />
                </Panel>
              </div>
            )}

            {active === "positions" && (
              <div className="space-y-5">
                <Panel title="结算记录列表">
                  <ListToolbar
                    filter={filters.positions}
                    statusOptions={["claimable", "settled", "settlement_error"]}
                    onChange={(next) => updateFilter("positions", next)}
                    keywordPlaceholder="搜索结算记录、订单号、事件、选项、钱包"
                    statusLabel="结算状态"
                  />
                  <DataTable
                    columns={["结算记录号", "关联订单", "事件名称", "选项", "用户方向", "标的结果", "结算状态", "操作"]}
                    rows={filteredSettlements.map((item) => [
                      item.id,
                      item.orderId,
                      item.eventName,
                      item.optionName,
                      `${item.side} ${item.outcome}`,
                      item.result,
                      <Badge tone={statusTone(item.status)}>{settlementStatusText(item.status)}</Badge>,
                      <Button
                        size="sm"
                        variant={selectedSettlement.id === item.id ? "default" : "outline"}
                        onClick={() => {
                          setSelectedSettlement(item)
                          setDetailView("settlement")
                        }}
                      >
                        查看
                      </Button>,
                    ])}
                  />
                  <div className="mt-4 rounded-lg border bg-zinc-50 p-4 text-sm text-muted-foreground">
                    结算记录来自订单成交后的持仓，在事件到期并产生结果后生成。结算记录用于追踪用户是否赢、可领取金额、通知状态和异常处理。
                  </div>
                </Panel>

                <Panel title="结算异常复核任务">
                  <DataTable
                    columns={["任务编号", "结算记录", "关联订单", "事件名称", "平台", "任务状态", "下一步", "操作"]}
                    rows={reviewTasks.map((task) => [
                      task.id,
                      task.settlementId,
                      task.orderId,
                      task.eventName,
                      task.venue,
                      <Badge tone="amber">{task.status}</Badge>,
                      task.nextStep,
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          const target = settlements.find((settlement) => settlement.id === task.settlementId) ?? settlements[0]
                          setSelectedSettlement(target)
                          setDetailView("settlement")
                        }}
                      >
                        查看结算
                      </Button>,
                    ])}
                  />
                  <div className="mt-4 rounded-lg border bg-zinc-50 p-4 text-sm text-muted-foreground">
                    复核任务用于承接“结算异常”的人工处理。任务不是新的用户订单，而是运营核对底层平台开奖结果、用户持仓和可领取金额的工作单。
                  </div>
                </Panel>
              </div>
            )}

            {active === "auth" && (
              <div className="space-y-5">
                <Panel title="平台认证状态列表">
                  <ListToolbar
                    filter={filters.auth}
                    statusOptions={["正常", "认证失败", "已暂停", "已过期"]}
                    onChange={(next) => updateFilter("auth", next)}
                    keywordPlaceholder="搜索认证对象、平台、用途、最近失败"
                    statusLabel="认证状态"
                  />
                  <DataTable
                    columns={["认证对象", "平台", "用途", "当前状态", "最近失败", "影响范围", "操作"]}
                    rows={filteredAuthResources.map((resource) => [
                      resource.name,
                      resource.platform,
                      resource.usage,
                      <Badge tone={statusTone(resource.status)}>{authStatusText(resource.status)}</Badge>,
                      resource.lastError,
                      resource.impact,
                      <Button
                        size="sm"
                        variant={selectedAuth.id === resource.id ? "default" : "outline"}
                        onClick={() => {
                          setSelectedAuth(resource)
                          setAuthResult("pending")
                          setDetailView("auth")
                        }}
                      >
                        查看
                      </Button>,
                    ])}
                  />
                </Panel>
              </div>
            )}

            {active === "risk" && (
              <div className="space-y-5">
                <Panel
                  title="风险处理记录"
                  action={
                    <Button size="sm" variant="outline" onClick={() => showToast("已生成风险处理记录导出任务，完成后会下载当前筛选条件下的审计记录。")}>
                      <AlertTriangle className="size-4" />
                      导出记录
                    </Button>
                  }
                >
                  <ListToolbar
                    filter={filters.risk}
                    statusOptions={["拦截中", "待处理", "已处理"]}
                    onChange={(next) => updateFilter("risk", next)}
                    keywordPlaceholder="搜索记录、影响对象、触发原因、处理结果"
                    statusLabel="当前状态"
                  />
                  <DataTable
                    columns={["记录编号", "影响对象", "对象类型", "触发原因", "系统处理", "当前状态", "时间", "操作"]}
                    rows={filteredRiskRecords.map((item) => [
                      item.id,
                      item.targetName,
                      item.targetKind,
                      item.reason,
                      item.action,
                      <Badge tone={item.status === "已处理" ? "green" : item.status === "待处理" ? "amber" : "red"}>{item.status}</Badge>,
                      item.time,
                      <Button
                        size="sm"
                        variant={selectedRisk.id === item.id ? "default" : "outline"}
                        onClick={() => {
                          setSelectedRisk(item)
                          setDetailView("risk")
                        }}
                      >
                        查看
                      </Button>,
                    ])}
                  />
                </Panel>
              </div>
            )}

            {active === "reports" && (
              <div className="grid gap-5 xl:grid-cols-[1fr_1fr]">
                <Panel title="业务报表与护栏指标">
                  <div className="grid gap-3 md:grid-cols-2">
                    {reports.map((item) => (
                      <div key={item.label} className="rounded-md border p-4">
                        <div className="text-xs text-muted-foreground">{item.label}</div>
                        <div className="mt-2 text-xl font-semibold">{item.value}</div>
                        <div className="mt-1 text-xs text-muted-foreground">{item.split}</div>
                      </div>
                    ))}
                  </div>
                </Panel>
                <Panel title="护栏告警">
                  <div className="space-y-3">
                    <Guardrail icon={CheckCircle2} label="聚合器页面可用率" value="99.42%" status="正常" tone="green" />
                    <Guardrail icon={Clock3} label="GemW 主页加载增加" value="128ms" status="低于阈值" tone="green" />
                    <Guardrail icon={XCircle} label="Predict Orders 失败率" value="3.8%" status="观察中" tone="amber" />
                    <Guardrail icon={LineChart} label="Quote 过期率" value="2.1%" status="稳定" tone="blue" />
                  </div>
                </Panel>
              </div>
            )}

            {detailView && (
              <Modal
                title={
                  detailView === "api" ? getApiActionMeta(selectedApiAction, selectedApi).title :
                  detailView === "batchSync" ? "同步当前筛选来源" :
                  detailView === "instrument" ? "可交易标的详情" :
                  detailView === "instrumentScoreRule" ? "评分项量化配置" :
                  detailView === "instrumentRuleCreate" ? (instrumentFilterRuleMode === "edit" ? "编辑强制过滤规则" : "新增强制过滤规则") :
                  detailView === "instrumentForceRuleView" ? "强制过滤规则详情" :
                  detailView === "admissionReview" ? "标的准入审核详情" :
                  detailView === "groupScoreRule" ? "归组匹配项量化配置" :
                  detailView === "group" ? "归组审核详情" :
                  detailView === "autoOrder" ? "智能推荐详情" :
                  detailView === "order" ? "订单详情" :
                  detailView === "settlement" ? "结算详情" :
                  detailView === "auth" ? "平台认证状态详情" :
                  "风险处理详情"
                }
                onClose={() => setDetailView(null)}
              >
                {detailView === "api" && (
                  <ApiOperationDetail
                    api={selectedApi}
                    action={selectedApiAction}
                    onExecute={runApiAction}
                    onOpenAction={setSelectedApiAction}
                  />
                )}
                {detailView === "batchSync" && <BatchSyncDetail rows={filteredRawMarketRows} result={apiResult} onResult={setApiResult} />}
                {detailView === "instrument" && (
                  <InstrumentDetail
                    instrument={selectedInstrument}
                    eventInstruments={selectedEventInstruments}
                    toast={instrumentToast}
                    onToast={setInstrumentToast}
                  />
                )}
                {detailView === "instrumentScoreRule" && (
                  <InstrumentScoreRuleEditor rule={selectedInstrumentScoringRule} onSave={saveInstrumentScoringRule} />
                )}
                {detailView === "instrumentRuleCreate" && (
                  <InstrumentFilterRuleForm
                    initialRule={instrumentFilterRuleMode === "edit" ? selectedInstrumentFilterRule : undefined}
                    onCreate={saveInstrumentFilterRule}
                  />
                )}
                {detailView === "instrumentForceRuleView" && (
                  <InstrumentFilterRuleForm
                    initialRule={selectedInstrumentFilterRule}
                    readonly
                    onCreate={saveInstrumentFilterRule}
                  />
                )}
                {detailView === "admissionReview" && <AdmissionReviewDetail item={selectedAdmission} />}
                {detailView === "groupScoreRule" && (
                  <GroupScoreRuleEditor rule={selectedGroupScoringRule} onSave={saveGroupScoringRule} />
                )}
                {detailView === "group" && <GroupReviewDetail group={selectedGroup} decision={groupDecision} onDecision={setGroupDecision} />}
                {detailView === "autoOrder" && <AutoOrderDetail item={selectedAutoOrder} result={autoOrderResult} onResult={setAutoOrderResult} />}
                {detailView === "order" && <OrderDetail order={selectedOrder} result={orderResult} onResult={setOrderResult} />}
                {detailView === "settlement" && (
                  <SettlementDetail
                    settlement={selectedSettlement}
                    reviewTask={reviewTasks.find((task) => task.settlementId === selectedSettlement.id)}
                    onCreateReviewTask={createSettlementReviewTask}
                  />
                )}
                {detailView === "auth" && <AuthDetail resource={selectedAuth} result={authResult} onResult={setAuthResult} />}
                {detailView === "risk" && <RiskDetail record={selectedRisk} />}
              </Modal>
            )}
          </div>
        </section>
      </div>
    </main>
  )
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md border bg-white p-3">
      <div className="text-xs text-muted-foreground">{label}</div>
      <div className="mt-1 text-sm font-medium">{value}</div>
    </div>
  )
}

function Guardrail({
  icon: Icon,
  label,
  value,
  status,
  tone,
}: {
  icon: typeof Activity
  label: string
  value: string
  status: string
  tone: Tone
}) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-md border p-3">
      <div className="flex min-w-0 items-center gap-3">
        <div className={`rounded-md border p-2 ${toneClass(tone)}`}>
          <Icon className="size-4" />
        </div>
        <div className="min-w-0">
          <div className="truncate text-sm font-medium">{label}</div>
          <div className="text-xs text-muted-foreground">{status}</div>
        </div>
      </div>
      <div className="text-sm font-semibold">{value}</div>
    </div>
  )
}

export default App
