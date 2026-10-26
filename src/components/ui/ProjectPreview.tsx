import type { Project } from '../../types/project'

export function ProjectPreview({ tone }: Pick<Project, 'tone'>) {
  const preview = {
    care: { brand: 'tapza', title: 'Care overview', stat1: ['ACTIVE PATIENTS', '1,284'], stat2: ['APPOINTMENTS', '38 today'], stat3: ['SATISFACTION', '4.9 / 5'], chart: 'Patient activity' },
    field: { brand: 'fieldflow', title: 'Operations overview', stat1: ['OPEN JOBS', '248'], stat2: ['COMPLETED', '92.4%'], stat3: ['ON TIME', '96.8%'], chart: 'Jobs completed' },
    quant: { brand: 'quant / engine', title: 'Market overview', stat1: ['PORTFOLIO VALUE', '$2.48m'], stat2: ['TODAY’S RETURN', '+2.84%'], stat3: ['ACTIVE SIGNALS', '12 live'], chart: 'Performance' },
  }[tone]

  return <div className={`project-preview ${tone}`} aria-hidden="true"><div className="preview-top"><span className="preview-brand"><i /> {preview.brand}</span><span className="preview-nav">Overview  Analytics  Reports</span><span className="preview-avatar">HM</span></div><div className="preview-body"><div className="preview-rail"><b /><b /><b /><b /><b /></div><div className="preview-main"><div className="preview-heading"><span>{preview.title}<small>Good morning, here’s your update.</small></span><i>•••</i></div><div className="preview-stats">{[preview.stat1, preview.stat2, preview.stat3].map(([label, value]) => <span key={label}><small>{label}</small><b>{value}</b></span>)}</div><div className="preview-chart"><div className="chart-label"><b>{preview.chart}</b><small>Last 7 days ⌄</small></div><svg viewBox="0 0 560 70" preserveAspectRatio="none"><path d="M0 57 C35 50 38 54 72 42 S120 48 154 32 S201 45 238 27 S286 37 326 19 S380 33 419 22 S475 32 520 10 S540 18 560 5" /></svg><div className="chart-days"><span>MON</span><span>TUE</span><span>WED</span><span>THU</span><span>FRI</span><span>SAT</span><span>SUN</span></div></div></div></div></div>
}
