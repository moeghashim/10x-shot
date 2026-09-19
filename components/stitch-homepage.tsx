"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Link } from "@/i18n/routing";
import { buildCode, formatVisits, gradeSegments, hasSpotlightData, projectTools, projectLaunchUrl, type SpotlightProject } from "@/lib/home/project-presentation";
import type { Project, StackGrade, StackItem, SupportedLocale } from "@/types/database";
import "@/styles/claws-home.css";

function useReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(media.matches);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);
  return reduced;
}

function useCount(duration: number, enabled: boolean, reduced: boolean, resetKey = 0) {
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    setProgress(0);
    if (!enabled) return;
    if (reduced) { setProgress(1); return; }
    let frame: number;
    const start = performance.now();
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      setProgress(1 - Math.pow(1 - t, 3));
      if (t < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [duration, enabled, reduced, resetKey]);
  return progress;
}

function GradeBar({ grade, ar, node = false }: { grade?: StackGrade; ar: boolean; node?: boolean }) {
  const label = grade ? `${ar ? "التقييم" : "Grade"} ${grade}` : ar ? "غير مقيّم" : "Ungraded";
  return <span className={`claws-grade ${node ? "claws-grade-node" : ""}`} title={label}>
    <span className="claws-segments" aria-hidden="true">
      {[1, 2, 3, 4, 5].map((segment) => <span key={segment} data-filled={segment <= gradeSegments(grade)} />)}
    </span>
    <span className={node || !grade ? "claws-grade-label" : "sr-only"}>{label}</span>
  </span>;
}

function Spotlight({ projects, ready, reduced, ar }: { projects: SpotlightProject[]; ready: boolean; reduced: boolean; ar: boolean }) {
  const [index, setIndex] = useState(0);
  const [sliding, setSliding] = useState(false);
  const [paused, setPaused] = useState(false);
  const [interacting, setInteracting] = useState(false);
  const transition = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [countReady, setCountReady] = useState(false);
  useEffect(() => {
    if (!ready) return;
    const timer = setTimeout(() => setCountReady(true), reduced ? 0 : 300);
    return () => clearTimeout(timer);
  }, [ready, reduced]);
  useEffect(() => () => { if (transition.current) clearTimeout(transition.current); }, []);
  const go = (next: number) => {
    if (transition.current) clearTimeout(transition.current);
    if (reduced) { setIndex(next); setSliding(false); return; }
    setSliding(true);
    transition.current = setTimeout(() => { setIndex(next); setSliding(false); }, 450);
  };
  useEffect(() => {
    if (!countReady || reduced || paused || interacting || sliding || projects.length < 2) return;
    const timer = setTimeout(() => {
      setSliding(true);
      transition.current = setTimeout(() => { setIndex((current) => (current + 1) % projects.length); setSliding(false); }, 450);
    }, 6000);
    return () => clearTimeout(timer);
  }, [countReady, index, interacting, paused, projects.length, reduced, sliding]);
  const count = useCount(900, countReady, reduced, index);
  const project = projects[index % projects.length];
  const growth = project ? Math.round(project.growth * count) : 0;

  return <div className="claws-spotlight" data-ready={ready} inert={!ready}
    onMouseEnter={() => setInteracting(true)} onMouseLeave={() => setInteracting(false)}
    onFocusCapture={() => setInteracting(true)} onBlurCapture={(event) => { if (!event.currentTarget.contains(event.relatedTarget)) setInteracting(false); }}
    aria-label={ar ? "المشروع المميز" : "Project Spotlight"}>
    <div className="claws-spotlight-label claws-label">
      <span>{ar ? "تحت الضوء" : "Spotlight"}{project ? <> / <bdi>{buildCode(project.id)}</bdi></> : ""}</span>
      {projects.length > 1 && <div className="claws-spotlight-controls">
        <button type="button" className="claws-pause" aria-pressed={paused} onClick={() => setPaused(!paused)}>{paused ? (ar ? "تشغيل" : "Play") : (ar ? "إيقاف" : "Pause")}</button>
        {projects.map((item, i) => <button type="button" key={item.id} className="claws-dot" aria-label={`${ar ? "عرض" : "Show"} ${item.title}`} aria-pressed={i === index} onClick={() => go(i)}><span /></button>)}
      </div>}
    </div>
    {project ? <div className="claws-spotlight-slide" data-sliding={sliding}>
      <div className="claws-spotlight-title"><h2>{project.title}</h2><span className="claws-label">{project.sector}</span></div>
      <div className="claws-spotlight-metrics">
        {[
          [Math.round(project.commits * count).toString(), ar ? "التحديثات" : "Commits"],
          [formatVisits(Math.round(project.visits * count)), ar ? "زيارة / شهر" : "Visits / mo"],
          [`${growth >= 0 ? "+" : ""}${growth}%`, ar ? "النمو" : "Growth"],
        ].map(([value, label], i) => <div key={label}><span className={`claws-metric ${i === 2 ? "claws-growth" : ""}`} dir="ltr">{value}</span><span className="claws-label">{label}</span></div>)}
      </div>
    </div> : <div className="claws-spotlight-empty"><h2>{ar ? "القادم يستحق المتابعة." : "More to come."}</h2><p>{ar ? "ستظهر هنا أرقام المشاريع عند توفرها." : "Project insights will appear here as they become available."}</p></div>}
  </div>;
}

export function StitchHomepage({ projects, stackItems, locale, toolCount }: { projects: Project[]; stackItems: StackItem[]; locale: SupportedLocale; toolCount?: number }) {
  const ar = locale === "ar";
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [density, setDensity] = useState("comfortable");
  const [bars, setBars] = useState(true);
  const [selectedId, setSelectedId] = useState(projects.find((p) => p.status === "active")?.id ?? projects[0]?.id);
  const reduced = useReducedMotion();
  const count = useCount(1400, true, reduced);
  const ready = count === 1;
  const selected = projects.find((p) => p.id === selectedId) ?? projects[0];
  const selectedTools = selected ? projectTools(selected, stackItems) : [];
  const spots = projects.filter(hasSpotlightData);
  const stats = [
    { value: projects.length, label: ar ? "إجمالي المشاريع" : "Total projects" },
    { value: projects.filter((p) => p.status === "active").length, label: ar ? "مشاريع نشطة" : "Active builds" },
    { value: toolCount ?? new Set(projects.flatMap((p) => p.tools)).size, label: ar ? "أدوات مدمجة" : "Tools integrated" },
  ];
  const nav = <>
    <Link href="/about">{ar ? "من نحن" : "About us"}</Link>
    <a href="#projects">{ar ? "المشاريع" : "Projects"}</a>
    <a href="#stack">{ar ? "الأدوات" : "Stack"}</a>
    <Link href="/future">{ar ? "المستقبل" : "Future"}</Link>
    <Link href="/track">{ar ? "المتابعة" : "Track"}</Link>
  </>;

  return <div className="claws-home" data-theme={theme} data-density={density}>
    <a className="claws-skip" href="#main">{ar ? "انتقل إلى المحتوى" : "Skip to content"}</a>
    <header className="claws-header">
      <Link href="/" className="claws-brand"><Image src="/10claws.svg" width={28} height={28} alt="" priority /><span dir="ltr">10 Claws</span></Link>
      <nav aria-label={ar ? "التنقل الرئيسي" : "Main navigation"}>{nav}</nav>
      <Link href="/" locale={ar ? "en" : "ar"} className="claws-language" aria-label={ar ? "Switch to English" : "التبديل إلى العربية"}>{ar ? "EN" : "AR"}</Link>
    </header>
    <main id="main">
      <section className="claws-hero" aria-label={ar ? "التجربة" : "The experiment"}>
        <div className="claws-hero-copy">
          <div className="claws-kicker claws-label"><span>{ar ? "معظم المشاريع تفشل" : "Most projects fail"}</span><span>/</span><span>{ar ? "التجربة تنجح" : "The experiment wins"}</span></div>
          <div><h1>{ar ? <>أعيش<br /><em>ذلك</em> الحلم.</> : <>Living<br /><em>the</em> dream.</>}</h1><p>{ar ? "أبني كل فكرة لطالما حلمت بها." : "Building every idea I've ever dreamed of."}</p></div>
        </div>
        <div className="claws-hero-data">
          <div className="claws-stats" data-ready={ready}>
            {stats.map((stat) => <div key={stat.label}><span className="claws-stat" aria-label={String(stat.value)}><span aria-hidden="true">{Math.round(stat.value * count)}</span></span><span className="claws-label">{stat.label}</span></div>)}
          </div>
          <Spotlight projects={spots} ready={ready} reduced={reduced} ar={ar} />
        </div>
      </section>
      <section id="projects" className="claws-ledger" aria-label={ar ? "المشاريع" : "Projects"}>
        <div className="claws-ledger-head claws-label" aria-hidden="true">{(ar ? ["البناء", "المشروع", "نبذة / الأدوات", "الحالة", "التقدم", "الرابط"] : ["Build", "Project", "Brief / Stack", "Status", "Progress", "Link"]).map((label) => <span key={label}>{label}</span>)}</div>
        {projects.map((project) => <article className="claws-row" key={project.id}>
          <span className="claws-build" dir="ltr">{buildCode(project.id)}</span>
          <h2 className="claws-project-name">{project.title}</h2>
          <div className="claws-brief"><p>{project.description}</p><div className="claws-tags">{projectTools(project, stackItems).map((tool) => <span className="claws-tool" key={tool.name}>{tool.name}<GradeBar grade={tool.grade} ar={ar} /></span>)}</div></div>
          <span className="claws-status" data-status={project.status}><span aria-hidden="true" />{ar ? ({ active: "نشط", planning: "مخطط", completed: "مكتمل" })[project.status] : project.status}</span>
          <div className="claws-progress"><div><span>{project.progress}%</span><span>{project.timeframe}</span></div>{bars && <div className="claws-progress-track" role="progressbar" aria-label={`${project.title} ${ar ? "التقدم" : "progress"}`} aria-valuemin={0} aria-valuemax={100} aria-valuenow={project.progress}><span style={{ width: `${project.progress}%` }} /></div>}</div>
          <div className="claws-launch">{projectLaunchUrl(project) ? <a href={projectLaunchUrl(project)!} target="_blank" rel="noreferrer" aria-label={`${ar ? "افتح" : "Launch"} ${project.title}`}>{ar ? "افتح ↗" : "Launch ↗"}</a> : <span>{ar ? "قريباً" : "Soon"}</span>}</div>
        </article>)}
      </section>
      <section id="stack" className="claws-stack" aria-label={ar ? "الأدوات التقنية" : "Tech Stack"}>
        <div className="claws-stack-copy">
          <div className="claws-label">{ar ? "مكونات النظام / شبكة الأدوات" : "System components / Tool lattice"}</div>
          <h2>{ar ? "الأدوات التقنية" : "Tech Stack"}</h2>
          <p>{ar ? "اكتشف الأدوات ومهارات الذكاء الاصطناعي وراء كل تجربة. اختر مشروعاً لاستعراض أدواته." : "Explore the tools and AI skills behind each experiment. The active project selector drives the stack preview below."}</p>
          <div className="claws-project-selector">{projects.map((project) => <button type="button" key={project.id} aria-pressed={selected?.id === project.id} aria-controls="stack-nodes" onClick={() => setSelectedId(project.id)}><span>{project.title}</span><span aria-hidden="true" dir="ltr">{selected?.id === project.id ? "●" : buildCode(project.id)}</span></button>)}</div>
        </div>
        <div className="claws-stack-preview" id="stack-nodes" aria-live="polite">
          <div className="claws-stack-heading claws-label"><span>{selected ? <><bdi>{buildCode(selected.id)}</bdi> / {selected.title}</> : (ar ? "لا توجد مشاريع" : "No projects yet")}</span><span>{selectedTools.length} {ar ? "أدوات" : "nodes"}</span></div>
          <div className="claws-nodes">{selectedTools.map((tool, index) => <div className="claws-node" key={tool.name}><span className="claws-label">{ar ? "أداة" : "node"} {index}</span><div><h3 title={tool.name}>{tool.name}</h3><GradeBar grade={tool.grade} ar={ar} node /></div></div>)}{!selectedTools.length && <p className="claws-empty">{ar ? "لم تُسجّل أدوات بعد." : "No tools logged yet."}</p>}</div>
        </div>
      </section>
      <section id="contact" className="claws-newsletter">
        <div><span className="claws-label">{ar ? "ابقَ على اطلاع" : "Stay updated"}</span><h2>{ar ? "احصل على آخر المستجدات" : "Get the Latest Updates"}</h2></div>
        <div><p>{ar ? "تابع توثيقي للأثر الحقيقي للذكاء الاصطناعي على الإنتاجية. رؤى ودروس وتحديثات من وراء الكواليس لكل مشروع." : "Follow along as I document the real impact of AI on productivity. Get insights, lessons learned, and behind-the-scenes updates from each project."}</p>
          <form action="https://buildinpublic.substack.com/subscribe" method="get"><input name="email" type="email" autoComplete="email" required placeholder="you@domain.com" aria-label={ar ? "البريد الإلكتروني" : "Email address"} /><button type="submit">{ar ? "اشترك" : "Subscribe"}</button></form>
          <p className="claws-newsletter-note">{ar ? "أكمل الاشتراك على Substack. بلا رسائل مزعجة، ويمكنك الإلغاء في أي وقت." : "Continue on Substack. No spam, unsubscribe at any time."}</p>
        </div>
      </section>
    </main>
    <footer className="claws-footer">
      <div className="claws-footer-brand"><Link href="/" className="claws-brand"><Image src="/10claws.svg" alt="" width={18} height={18} /><span dir="ltr">10 Claws</span></Link><p>{ar ? "قياس الأثر الحقيقي للذكاء الاصطناعي على الإنتاجية عبر 10 مشاريع متنوعة." : "Measuring the real impact of AI on productivity across 10 diverse projects."}</p></div>
      <nav aria-label={ar ? "روابط التذييل" : "Footer navigation"}>{nav}<a href="https://x.com/moeghashim" target="_blank" rel="noreferrer">X / Twitter</a></nav>
      <details className="claws-tweaks"><summary>{ar ? "إعدادات العرض" : "Display settings"}</summary><div>
        <label>{ar ? "المظهر" : "Theme"}<select value={theme} onChange={(event) => setTheme(event.target.value as "light" | "dark")}><option value="light">{ar ? "فاتح" : "Light"}</option><option value="dark">{ar ? "داكن" : "Dark"}</option></select></label>
        <label>{ar ? "كثافة الصفوف" : "Ledger density"}<select value={density} onChange={(event) => setDensity(event.target.value)}><option value="comfortable">{ar ? "مريح" : "Comfortable"}</option><option value="compact">{ar ? "مضغوط" : "Compact"}</option></select></label>
        <label><input type="checkbox" checked={bars} onChange={(event) => setBars(event.target.checked)} />{ar ? "أشرطة التقدم" : "Progress bars"}</label>
      </div></details>
    </footer>
  </div>;
}
