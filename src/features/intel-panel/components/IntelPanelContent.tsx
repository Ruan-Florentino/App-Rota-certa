import React from 'react';
import { X, ChevronRight, Sparkles, Bell, Share, Building2 } from 'lucide-react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, ResponsiveContainer } from 'recharts';

export function IntelPanelContent({ asset, onClose }: { asset: any, onClose: () => void }) {
  if (!asset) return null;

  return (
    <div className="flex flex-col h-full overflow-y-auto overflow-x-hidden text-slate-300">
      {/* 1 - HERO */}
      <div className="relative h-48 flex-shrink-0 bg-slate-900 overflow-hidden">
        {/* Placeholder for satellite image */}
        <div className="absolute inset-0 bg-blue-950/40" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-slate-950/95" />
        
        <div className="absolute top-4 left-4 right-4 flex justify-between items-start">
          <span className="px-2 py-0.5 rounded text-[10px] font-mono tracking-wider font-semibold border border-red-500/30 bg-red-500/10 text-red-400 uppercase">
            {asset.classification}
          </span>
          <button 
            onClick={onClose}
            className="p-1.5 rounded-full bg-black/40 hover:bg-white/10 text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="absolute bottom-4 left-4">
          <div className="flex items-center gap-2 px-2 py-1 rounded bg-black/40 backdrop-blur border border-white/5 w-fit">
            <div className="w-2 h-2 rounded-full bg-cyan-400" />
            <span className="text-xs font-medium text-cyan-50">{asset.primaryCommodity}</span>
          </div>
        </div>
      </div>

      <div className="p-5 flex flex-col gap-6 bg-slate-950/90 flex-1">
        
        {/* 2 - IDENTIFICATION */}
        <div>
          <h1 className="text-2xl font-bold text-white mb-1">{asset.name}</h1>
          {asset.localName && (
            <p className="text-sm text-slate-400 mb-3">{asset.localName}</p>
          )}
          
          <div className="flex items-center gap-2 text-xs text-slate-300 font-mono">
            <span>{asset.location.country}</span>
            <span>·</span>
            <span>{asset.location.region}, {asset.location.countryName}</span>
            <span>·</span>
            <span className="text-cyan-400">
              {asset.location.lat.toFixed(2)}, {asset.location.lng.toFixed(2)}
            </span>
          </div>
          <div className="mt-3 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <span className="text-[10px] uppercase tracking-widest text-green-400">{asset.status}</span>
          </div>
        </div>

        {/* 3 - METRICS */}
        <div>
          <h2 className="section-title text-[10px] uppercase tracking-widest text-slate-500 font-mono border-t border-white/5 pt-4 mb-3">Key Metrics</h2>
          <div className="grid grid-cols-2 gap-3">
            <MetricCard label="Reserves" value={asset.metrics.reserves.value.toLocaleString()} unit={asset.metrics.reserves.unit} subtext={asset.metrics.reserves.grade} />
            <MetricCard label="Annual Prod" value={asset.metrics.annualProduction.value} unit={asset.metrics.annualProduction.unit} subtext={`${asset.metrics.annualProduction.trend.toUpperCase()} ${asset.metrics.annualProduction.yoyChange}%`} />
            <MetricCard label="Lifespan" value={asset.metrics.lifespan.yearsRemaining} unit="years" subtext={`Est. closure ${asset.metrics.lifespan.plannedClosure}`} />
            <MetricCard label="Workforce" value={asset.metrics.workforce.toLocaleString()} unit="people" />
          </div>
        </div>

        {/* 4 - OPERATOR */}
        <div>
          <h2 className="section-title text-[10px] uppercase tracking-widest text-slate-500 font-mono border-t border-white/5 pt-4 mb-3">Operator</h2>
          <div className="bg-white/5 border border-white/5 rounded-lg p-3 flex items-center gap-3">
            <div className="w-10 h-10 bg-slate-800 rounded flex items-center justify-center shrink-0">
              <Building2 className="w-5 h-5 text-slate-400" />
            </div>
            <div>
              <div className="text-sm font-medium text-white">{asset.operator.name}</div>
              <div className="text-xs text-slate-400 flex items-center gap-1.5 mt-0.5">
                <span className="font-mono text-[10px] bg-white/10 px-1 rounded">{asset.operator.ticker}</span>
                <span>·</span>
                <span className="truncate">{asset.operator.headquarters}</span>
              </div>
            </div>
          </div>
        </div>

        {/* 5 - GEOPOLITICAL RISK (Radar) */}
      <div>
        <h2 className="section-title text-[10px] uppercase tracking-widest text-slate-500 font-mono border-t border-white/5 pt-4 mb-3">Geopolitical Risk</h2>
        
        <div className="bg-white/5 border border-white/5 rounded-lg p-4 flex flex-col gap-4">
          <div className="h-48 w-full -ml-3">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="70%" data={[
                { subject: 'Political', A: asset.intel.geopoliticalRisk.political, fullMark: 100 },
                { subject: 'Security', A: asset.intel.geopoliticalRisk.security, fullMark: 100 },
                { subject: 'Regulatory', A: asset.intel.geopoliticalRisk.regulatory, fullMark: 100 },
                { subject: 'Operational', A: asset.intel.geopoliticalRisk.operational, fullMark: 100 },
                { subject: 'Environment', A: asset.intel.geopoliticalRisk.environmental, fullMark: 100 },
              ]}>
                <PolarGrid stroke="rgba(255,255,255,0.1)" />
                <PolarAngleAxis dataKey="subject" tick={{ fill: 'rgba(148, 163, 184, 0.7)', fontSize: 10 }} />
                <Radar name="Risk" dataKey="A" stroke="#22D3EE" strokeWidth={1.5} fill="#06B6D4" fillOpacity={0.2} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
          
          <div className="flex items-center justify-between border-t border-white/5 pt-3">
            <div className="flex flex-col">
              <span className="text-[10px] text-slate-500 uppercase tracking-widest">Threat Level</span>
              <span className={`text-xs font-bold font-mono mt-0.5 ${asset.intel.threatLevel === 'LOW' ? 'text-green-400' : asset.intel.threatLevel === 'MEDIUM' ? 'text-amber-400' : 'text-red-400'}`}>
                {asset.intel.threatLevel}
              </span>
            </div>
            <div className="flex flex-col items-end">
              <span className="text-[10px] text-slate-500 uppercase tracking-widest">Composite Score</span>
              <span className="text-xl font-bold font-mono text-cyan-400">{asset.intel.geopoliticalRisk.composite}/100</span>
            </div>
          </div>
        </div>
      </div>

      {/* 6 - STRATEGIC PROFILE */}
        <div>
          <h2 className="section-title text-[10px] uppercase tracking-widest text-slate-500 font-mono border-t border-white/5 pt-4 mb-3">Strategic Profile</h2>
          <div className="space-y-4">
            <StrategicBar label="Strategic Importance" value={asset.intel.strategicImportance} />
            <StrategicBar label="Supply Chain Criticality" value={asset.intel.supplyChainCriticality} />
            {asset.intel.globalRanking && (
              <div className="mt-3 inline-flex px-2 py-1 rounded bg-amber-500/10 border border-amber-500/20 text-amber-400 text-[10px] uppercase tracking-wider font-mono">
                #{asset.intel.globalRanking.position} {asset.intel.globalRanking.metric} ({asset.intel.globalRanking.scope})
              </div>
            )}
          </div>
        </div>

        {/* 6 - OVERVIEW */}
        <div>
          <h2 className="section-title text-[10px] uppercase tracking-widest text-slate-500 font-mono border-t border-white/5 pt-4 mb-3">Overview</h2>
          <p className="text-sm leading-relaxed text-slate-300 mb-4">{asset.description.detailed}</p>
          <ul className="space-y-2">
            {asset.description.highlights.map((h: string, i: number) => (
              <li key={i} className="flex items-start gap-2 text-sm text-slate-400">
                <ChevronRight className="w-4 h-4 text-cyan-500 shrink-0 mt-0.5" />
                <span>{h}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* 7 - TIMELINE */}
        <div>
          <h2 className="section-title text-[10px] uppercase tracking-widest text-slate-500 font-mono border-t border-white/5 pt-4 mb-3">Timeline</h2>
          <div className="flex flex-col">
            {asset.timeline.map((event: any, i: number) => (
              <div key={i} className={`flex flex-col gap-1 py-3 border-l-2 pl-3 ml-1 ${event.severity === 'SEVERE' ? 'border-red-500' : event.severity === 'WARNING' ? 'border-amber-500' : 'border-cyan-500/30'}`}>
                <div className="text-[10px] text-slate-500 font-mono">{event.date}</div>
                <div className="text-sm text-slate-200">{event.headline}</div>
              </div>
            ))}
          </div>
        </div>

        {/* 8 - TRADE FLOWS */}
        <div>
          <h2 className="section-title text-[10px] uppercase tracking-widest text-slate-500 font-mono border-t border-white/5 pt-4 mb-3">Trade Flows (Primary Buyers)</h2>
          <div className="flex flex-wrap gap-2">
            {asset.relations?.primaryBuyers?.map((buyer: string, i: number) => (
              <span key={i} className="px-2.5 py-1 rounded bg-slate-800 text-slate-300 text-xs border border-white/5">
                {buyer}
              </span>
            ))}
          </div>
        </div>

        {/* 9 - ACTIONS */}
        <div className="border-t border-white/5 pt-4 mt-2 flex flex-col gap-2">
          <button className="flex items-center justify-center gap-2 p-3 bg-cyan-600 hover:bg-cyan-500 text-white font-medium text-sm rounded-lg transition-colors">
            <Sparkles className="w-4 h-4" />
            Ask GRIS-AI about this asset
          </button>
          <div className="grid grid-cols-2 gap-2">
            <button className="flex items-center justify-center gap-2 p-2.5 bg-white/5 hover:bg-white/10 text-slate-300 text-xs font-medium rounded-lg transition-colors border border-white/5">
              <Bell className="w-4 h-4" /> Set Alert
            </button>
            <button className="flex items-center justify-center gap-2 p-2.5 bg-white/5 hover:bg-white/10 text-slate-300 text-xs font-medium rounded-lg transition-colors border border-white/5">
              <Share className="w-4 h-4" /> Share Intel
            </button>
          </div>
        </div>
        
        {/* Fill space at bottom for scrolling */}
        <div className="h-6" />
      </div>
    </div>
  );
}

function MetricCard({ label, value, unit, subtext }: { label: string, value: string | number, unit?: string, subtext?: string }) {
  return (
    <div className="bg-white/5 border border-white/5 rounded-lg p-3 flex flex-col">
      <span className="text-[9px] uppercase tracking-wider text-slate-500 mb-1">{label}</span>
      <div className="flex items-baseline gap-1">
        <span className="font-mono text-xl font-semibold text-slate-100">{value}</span>
        {unit && <span className="text-[10px] text-slate-400">{unit}</span>}
      </div>
      {subtext && <span className="text-[10px] text-slate-500 mt-1 truncate">{subtext}</span>}
    </div>
  );
}

function StrategicBar({ label, value }: { label: string, value: number }) {
  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex justify-between items-center text-xs">
        <span className="text-slate-400">{label}</span>
        <span className="font-mono text-cyan-400">{value}/100</span>
      </div>
      <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
        <div 
          className="h-full bg-gradient-to-r from-cyan-500 to-cyan-300 rounded-full transition-all duration-1000 ease-out"
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  );
}
