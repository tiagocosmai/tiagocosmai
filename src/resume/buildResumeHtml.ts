import rawContent from "../data/content.json";
import rawResources from "../data/resources.json";
import appConfig from "../data/config.json";
import coursesData from "../data/courses.json";
import { deepPick } from "../i18n/deepPick";
import {
  localizeCourseLine,
  localizeCourseProvider,
  type CoursesDataPt,
} from "../lib/courseI18n";
import type { PickedContent } from "../types/content";
import type { Locale } from "../types/locale";

export type ResumeMode =
  | "ultra_compact"
  | "compact"
  | "objective"
  | "favorito"
  | "complete"
  | "custom";

export const CUSTOM_RESUME_SECTION_ORDER = [
  "expertise",
  "certifications",
  "history",
  "education",
  "languages",
  "projects",
  "personal_projects",
  "courses",
  "hobbies",
] as const;

export type CustomResumeSectionKey =
  (typeof CUSTOM_RESUME_SECTION_ORDER)[number];

export type CustomResumeSelection = {
  sections: Record<CustomResumeSectionKey, boolean>;
  certificationsDetail: boolean;
  historyDetail: boolean;
  showSkills: boolean;
  educationDetail: boolean;
  languagesDetail: boolean;
};

export function defaultCustomResumeSelection(): CustomResumeSelection {
  return {
    sections: {
      expertise: true,
      certifications: true,
      history: true,
      education: true,
      languages: true,
      hobbies: true,
      projects: true,
      personal_projects: true,
      courses: true,
    },
    certificationsDetail: true,
    historyDetail: true,
    showSkills: true,
    educationDetail: true,
    languagesDetail: true,
  };
}

function esc(s: string): string {
  if (s == null || s === "") return "";
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function t(locale: Locale, key: string): string {
  const resources = rawResources as Record<string, Record<string, string>>;
  const row = resources[key];
  if (!row) return key;
  return row[locale] ?? row.en ?? key;
}

/** Paleta neutra + verdes #14532d / #166534 — layout duas colunas estilo CV moderno */
const RESUME_STYLES = `
  @page { margin: 10mm 11mm; size: A4; }
  * { box-sizing: border-box; }
  body {
    font-family: 'Segoe UI', system-ui, -apple-system, sans-serif;
    font-size: 9.75pt;
    line-height: 1.45;
    color: #374151;
    margin: 0;
    padding: 0;
    background: #fafaf9;
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }
  .resume-wrap { max-width: 210mm; margin: 0 auto; }

  .sidebar-identity {
    margin-bottom: 16px;
    padding-bottom: 14px;
    border-bottom: 1px solid #d5ddd8;
  }
  .sidebar-identity .resume-avatar {
    width: 80%;
    max-width: 80%;
    aspect-ratio: 1;
    height: auto;
    border-radius: 50%;
    object-fit: cover;
    display: block;
    margin: 0 auto 10px;
    border: 2px solid #e5e7eb;
    box-shadow: 0 1px 4px rgba(0,0,0,0.06);
  }
  .sidebar-identity .identity-name {
    font-size: 14pt;
    font-weight: 700;
    color: #111827;
    margin: 0 0 4px;
    line-height: 1.15;
    text-align: center;
  }
  .sidebar-identity .identity-role {
    font-size: 10pt;
    color: #166534;
    font-weight: 600;
    margin: 0;
    text-align: center;
  }
  .main-identity {
    margin-bottom: 18px;
    padding-bottom: 14px;
    border-bottom: 1px solid #d5ddd8;
    display: flex;
    align-items: center;
    gap: 16px;
  }
  .main-identity .resume-avatar {
    width: 64px;
    height: 64px;
    border-radius: 50%;
    object-fit: cover;
    flex-shrink: 0;
    border: 2px solid #e5e7eb;
    box-shadow: 0 1px 4px rgba(0,0,0,0.06);
  }
  .main-identity .identity-name { font-size: 18pt; font-weight: 700; color: #111827; margin: 0 0 2px; line-height: 1.1; }
  .main-identity .identity-role { font-size: 11pt; color: #166534; font-weight: 600; margin: 0; }
  .contact-sidebar .contact-item {
    display: flex;
    gap: 8px;
    margin-bottom: 11px;
    align-items: flex-start;
  }
  .contact-sidebar .contact-item:last-child { margin-bottom: 0; }
  .contact-sidebar .cicon {
    flex-shrink: 0;
    margin-top: 2px;
    display: block;
  }
  .contact-sidebar .cbody { min-width: 0; flex: 1; }
  .contact-sidebar .clabel {
    font-size: 7.5pt;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.03em;
    color: #6b7280;
    margin-bottom: 2px;
  }
  .contact-sidebar a.main-link {
    color: #14532d;
    font-weight: 600;
    text-decoration: none;
    font-size: 9pt;
    word-break: break-word;
  }
  .contact-sidebar .url-print {
    font-size: 7.25pt;
    color: #166534;
    word-break: break-all;
    line-height: 1.35;
    margin-top: 3px;
    font-family: ui-monospace, monospace;
  }

  .resume-body {
    display: grid;
    grid-template-columns: minmax(0, 32%) minmax(0, 1fr);
    gap: 0 22px;
    align-items: start;
    padding: 12px 4px 12px;
  }
  .resume-body.single-col {
    grid-template-columns: 1fr;
  }

  .section-head {
    margin: 0 0 8px;
    padding: 0;
  }
  .section-head-inner {
    display: inline-block;
    background: linear-gradient(105deg, #e4efe6 0%, #d8e8dc 100%);
    color: #14532d;
    font-size: 9.5pt;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.04em;
    padding: 5px 14px 5px 10px;
    transform: skewX(-5deg);
    border-left: 3px solid #166534;
    margin-left: 2px;
  }
  .section-head-inner span {
    display: inline-block;
    transform: skewX(5deg);
  }

  .resume-section-hr {
    margin: 14px 0;
    border: none;
    border-top: 1px solid #d5ddd8;
  }
  .col-sidebar .block { margin-bottom: 0; }
  .col-main .block { margin-bottom: 0; }

  .edu-item {
    border-left: 3px solid #166534;
    padding: 0 0 10px 10px;
    margin-bottom: 10px;
  }
  .edu-item:last-child { margin-bottom: 0; padding-bottom: 0; }
  .edu-degree { font-weight: 700; color: #166534; font-size: 9.75pt; margin: 0 0 2px; }
  .edu-meta { font-size: 8.75pt; color: #6b7280; margin: 0 0 4px; }
  .edu-item p { margin: 0; font-size: 9pt; color: #4b5563; }

  .cert-item { margin-bottom: 8px; }
  .cert-item h4 { margin: 0 0 2px; font-size: 9.25pt; font-weight: 700; color: #111827; }
  .cert-item p { margin: 0; font-size: 8.5pt; color: #6b7280; }

  .lang-line { font-size: 9pt; margin-bottom: 5px; color: #374151; }
  .lang-line strong { color: #14532d; }

  .skills-tags {
    display: flex;
    flex-wrap: wrap;
    gap: 4px 6px;
    font-size: 7.75pt;
    line-height: 1.35;
  }
  .skills-tags span {
    background: #f3f4f6;
    color: #374151;
    padding: 2px 7px;
    border-radius: 3px;
    border: 1px solid #e5e7eb;
  }

  .hobby-inline { margin: 4px 0 0; font-size: 9pt; color: #4b5563; }

  .summary-text p { margin: 0 0 8px; text-align: justify; color: #4b5563; font-size: 9.5pt; }
  .summary-text p:last-child { margin-bottom: 0; }

  .expertise-narr h3 { font-size: 10pt; margin: 10px 0 4px; color: #14532d; font-weight: 700; }
  .expertise-narr h3:first-child { margin-top: 0; }
  .expertise-narr ul { margin: 0 0 6px; padding-left: 16px; }
  .expertise-narr li { margin-bottom: 3px; font-size: 9pt; color: #4b5563; }
  .expertise-narr .exp-stack { font-size: 8.5pt; color: #4b5563; margin: 0 0 8px; line-height: 1.4; }

  .history-item {
    margin-bottom: 14px;
  }
  .history-dates { font-size: 8.75pt; color: #6b7280; margin-bottom: 2px; }
  .history-role { font-size: 10.25pt; font-weight: 700; color: #111827; margin: 0 0 2px; }
  .history-company { font-size: 9.25pt; font-weight: 600; color: #166534; margin: 0 0 6px; }
  .history-item ul { margin: 0; padding-left: 16px; }
  .history-item li { margin-bottom: 3px; font-size: 9pt; color: #4b5563; }
  .history-skills { font-size: 8.5pt; color: #6b7280; margin-top: 6px; }

  .project-item { margin-bottom: 12px; }
  .project-item h3 { font-size: 10pt; margin: 0 0 2px; color: #111827; }
  .project-meta { font-size: 8.75pt; color: #6b7280; margin: 0 0 4px; }
  .project-item p { margin: 0; font-size: 9pt; color: #4b5563; }

  .course-block { margin-bottom: 10px; }
  .course-block h4 { margin: 0 0 4px; font-size: 8.75pt; color: #14532d; font-weight: 600; }
  .course-block ul { margin: 0; padding-left: 14px; font-size: 8.25pt; color: #6b7280; }

  p { margin: 0 0 6px; }
  ul { margin: 4px 0 6px; }
`;

export type BuildResumeOptions = {
  portfolioUrl: string;
  customSelection?: CustomResumeSelection;
};

function sectionHeadHtml(title: string): string {
  return `<div class="section-head"><span class="section-head-inner"><span>${esc(title)}</span></span></div>`;
}

const ICON = {
  mail: `<svg class="cicon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#166534" stroke-width="2" aria-hidden="true"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><path d="m22 6-10 7L2 6"/></svg>`,
  phone: `<svg class="cicon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#166534" stroke-width="2" aria-hidden="true"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>`,
  map: `<svg class="cicon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#166534" stroke-width="2" aria-hidden="true"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>`,
  link: `<svg class="cicon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#166534" stroke-width="2" aria-hidden="true"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>`,
  linkedin: `<svg class="cicon" width="16" height="16" viewBox="0 0 24 24" fill="#166534" aria-hidden="true"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>`,
  github: `<svg class="cicon" width="16" height="16" viewBox="0 0 24 24" fill="#166534" aria-hidden="true"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>`,
};

function buildSidebarIdentity(c: PickedContent): string {
  return `<div class="block sidebar-identity">
    <img class="resume-avatar" src="${esc(c.main.avatar_url)}" alt="" />
    <h1 class="identity-name">${esc(c.main.name)}</h1>
    <p class="identity-role">${esc(c.main.role)}</p>
  </div>`;
}

function buildMainIdentity(c: PickedContent): string {
  return `<div class="block main-identity">
    <img class="resume-avatar" src="${esc(c.main.avatar_url)}" alt="" width="64" height="64" />
    <div>
      <h1 class="identity-name">${esc(c.main.name)}</h1>
      <p class="identity-role">${esc(c.main.role)}</p>
    </div>
  </div>`;
}

function blockContactsSidebar(
  c: PickedContent,
  locale: Locale,
  opts: BuildResumeOptions,
): string {
  const portfolio = opts.portfolioUrl.trim();
  const rows: string[] = [];

  const row = (
    icon: string,
    label: string,
    href: string,
    linkLabel: string,
    urlPrint: string | null,
  ) => {
    const urlLine =
      urlPrint != null && urlPrint !== ""
        ? `<div class="url-print">${esc(urlPrint)}</div>`
        : "";
    return `<div class="contact-item">${icon}<div class="cbody"><div class="clabel">${esc(label)}</div><a class="main-link" href="${esc(href)}">${esc(linkLabel)}</a>${urlLine}</div></div>`;
  };

  if (portfolio) {
    rows.push(
      row(
        ICON.link,
        t(locale, "resume_contact_portfolio"),
        portfolio,
        portfolio.replace(/^https?:\/\//i, ""),
        null,
      ),
    );
  }
  const em = c.main.social.email;
  rows.push(
    row(
      ICON.mail,
      t(locale, "resume_contact_email"),
      `mailto:${em}`,
      em,
      null,
    ),
  );
  rows.push(
    row(
      ICON.phone,
      t(locale, "resume_contact_whatsapp"),
      c.main.social.whatsapp_url,
      c.main.social.phone,
      null,
    ),
  );
  const li = c.main.social.linkedin;
  rows.push(
    row(
      ICON.linkedin,
      t(locale, "resume_contact_linkedin"),
      li,
      "LinkedIn",
      null,
    ),
  );
  const gh = c.main.social.github;
  rows.push(
    row(ICON.github, t(locale, "resume_contact_github"), gh, "GitHub", null),
  );
  rows.push(
    row(
      ICON.map,
      t(locale, "resume_contact_location"),
      c.main.social.location_maps_url,
      c.main.social.location_label,
      null,
    ),
  );

  return `<div class="block contact-sidebar">${rows.join("")}</div>`;
}

function blockEducation(
  c: PickedContent,
  detail: boolean,
  locale: Locale,
): string {
  let inner = "";
  for (const e of c.education.entries) {
    inner += `<div class="edu-item">`;
    inner += `<div class="edu-degree">${esc(e.title)}</div>`;
    inner += `<div class="edu-meta">${esc(e.date)} · ${esc(e.location)}</div>`;
    if (detail && e.description?.trim())
      inner += `<p>${esc(e.description)}</p>`;
    inner += `</div>`;
  }
  return `<div class="block">${sectionHeadHtml(t(locale, "nav_education"))}${inner}</div>`;
}

function blockCertifications(
  c: PickedContent,
  detail: boolean,
  locale: Locale,
): string {
  let inner = "";
  for (const it of c.certifications.items) {
    inner += `<div class="cert-item">`;
    inner += `<h4>${esc(it.title)}</h4>`;
    if (detail && it.description?.trim())
      inner += `<p>${esc(it.description)}</p>`;
    inner += `</div>`;
  }
  return `<div class="block">${sectionHeadHtml(t(locale, "nav_certifications"))}${inner}</div>`;
}

function blockLanguages(
  c: PickedContent,
  detail: boolean,
  locale: Locale,
): string {
  const keys = [
    t(locale, "lang_skill_communication"),
    t(locale, "lang_skill_conversation"),
    t(locale, "lang_skill_reading"),
    t(locale, "lang_skill_writing"),
  ];
  const fields = ["communication", "conversation", "reading", "writing"] as const;
  let inner = "";
  for (const item of c.languages.items) {
    inner += `<div class="lang-line"><strong>${esc(item.name)}</strong> — ${esc(item.level)}`;
    if (detail) {
      inner += `<div style="margin-top:4px;padding-left:8px;font-size:8.5pt;color:#6b7280;">`;
      fields.forEach((f, i) => {
        inner += `<div><em>${esc(keys[i])}:</em> ${esc(item[f])}</div>`;
      });
      if (item.note)
        inner += `<div style="margin-top:4px;"><em>${esc(t(locale, "lang_note_label"))}:</em> ${esc(item.note)}</div>`;
      inner += `</div>`;
    }
    inner += `</div>`;
  }
  return `<div class="block">${sectionHeadHtml(t(locale, "nav_languages"))}${inner}</div>`;
}

function blockHobbies(c: PickedContent, locale: Locale): string {
  const h = c.hobbies;
  if (!h?.items?.length) return "";
  const text = h.items.map((it) => esc(it.label)).join(" - ");
  return `<div class="block">${sectionHeadHtml(t(locale, "nav_hobbies"))}<p class="hobby-inline">${text}</p></div>`;
}

function blockSummary(
  c: PickedContent,
  maxParas: number | null,
  locale: Locale,
): string {
  const paras = c.main.intro_paragraphs ?? [];
  const slice =
    maxParas != null && maxParas > 0 ? paras.slice(0, maxParas) : paras;
  if (!slice.length) return "";
  const ps = slice.map((p) => `<p>${esc(p)}</p>`).join("");
  return `<div class="block">${sectionHeadHtml(t(locale, "resume_section_summary"))}<div class="summary-text">${ps}</div></div>`;
}

function blockExpertise(c: PickedContent, locale: Locale): string {
  let inner = `<div class="expertise-narr">`;
  for (const card of c.expertise.cards) {
    inner += `<h3>${esc(card.title)}</h3>`;
    inner += `<ul>${card.descriptions.map((d) => `<li>${esc(d)}</li>`).join("")}</ul>`;
    if (card.stack?.length) {
      inner += `<p class="exp-stack"><strong>Stack:</strong> ${esc(card.stack.join(", "))}</p>`;
    }
  }
  inner += `</div>`;
  return `<div class="block">${sectionHeadHtml(t(locale, "nav_expertise"))}${inner}</div>`;
}

function blockHistory(
  c: PickedContent,
  detail: boolean,
  locale: Locale,
  showSkills: boolean,
): string {
  let inner = "";
  for (const e of c.history.entries) {
    inner += `<div class="history-item">`;
    inner += `<div class="history-dates">${esc(e.date)}</div>`;
    inner += `<div class="history-role">${esc(e.role)}</div>`;
    inner += `<div class="history-company">${esc(e.company)} · ${esc(e.location)}</div>`;
    if (detail && e.description?.length) {
      inner += `<ul>${e.description.map((d) => `<li>${esc(d)}</li>`).join("")}</ul>`;
    }
    if (detail && showSkills) {
      const hard = (e.hard_skills ?? []).filter(Boolean).join(", ");
      const soft = (e.soft_skills ?? []).filter(Boolean).join(", ");
      if (hard)
        inner += `<p class="history-skills"><strong>${esc(t(locale, "history_hard_skills"))}:</strong> ${esc(hard)}</p>`;
      if (soft)
        inner += `<p class="history-skills"><strong>${esc(t(locale, "history_soft_skills"))}:</strong> ${esc(soft)}</p>`;
    }
    inner += `</div>`;
  }
  return `<div class="block">${sectionHeadHtml(t(locale, "nav_history"))}${inner}</div>`;
}

function blockProjects(c: PickedContent, locale: Locale): string {
  let inner = "";
  for (const p of c.projects.items) {
    inner += `<div class="project-item">`;
    inner += `<h3>${esc(p.title)}</h3>`;
    inner += `<p class="project-meta">${esc(p.period)}</p>`;
    inner += `<p>${esc(p.description)}</p>`;
    inner += `</div>`;
  }
  return `<div class="block">${sectionHeadHtml(t(locale, "nav_projects"))}${inner}</div>`;
}

function blockPersonalProjects(c: PickedContent, locale: Locale): string {
  let inner = "";
  for (const p of c.personal_projects.items) {
    inner += `<div class="project-item">`;
    inner += `<h3>${esc(p.title)}</h3>`;
    if (p.status?.trim())
      inner += `<p class="project-meta">${esc(p.status)}</p>`;
    inner += `<p>${esc(p.description)}</p>`;
    if (p.github_url?.trim())
      inner += `<p class="project-meta"><a href="${esc(p.github_url)}" class="main-link">${esc(p.github_url)}</a></p>`;
    if (p.live_url?.trim() && p.live_url !== "-")
      inner += `<p class="project-meta"><a href="${esc(p.live_url)}" class="main-link">${esc(p.live_url)}</a></p>`;
    inner += `</div>`;
  }
  return `<div class="block">${sectionHeadHtml(t(locale, "nav_personal_projects"))}${inner}</div>`;
}

function blockCourses(locale: Locale): string {
  const d = coursesData as CoursesDataPt;
  const distanceGroups = d.distance.map((g) => ({
    provider: localizeCourseProvider(g.provider, locale),
    url: g.url,
    items: g.items.map((it) => localizeCourseLine(it.pt, locale)),
  }));
  const presentialItems = d.presential.map((it) =>
    localizeCourseLine(it.pt, locale),
  );
  const eventItems = d.events.map((it) => localizeCourseLine(it.pt, locale));
  let inner = "";
  if (distanceGroups.length) {
    for (const g of distanceGroups) {
      inner += `<div class="course-block">`;
      inner += g.url
        ? `<h4>${esc(g.provider)}</h4>`
        : `<h4>${esc(g.provider)}</h4>`;
      inner += `<ul>${g.items.map((i) => `<li>${esc(i)}</li>`).join("")}</ul></div>`;
    }
  }
  if (presentialItems.length) {
    inner += `<div class="course-block"><h4>${esc(t(locale, "courses_section_presential"))}</h4><ul>`;
    inner += presentialItems.map((i) => `<li>${esc(i)}</li>`).join("");
    inner += `</ul></div>`;
  }
  if (eventItems.length) {
    inner += `<div class="course-block"><h4>${esc(t(locale, "courses_section_events"))}</h4><ul>`;
    inner += eventItems.map((i) => `<li>${esc(i)}</li>`).join("");
    inner += `</ul></div>`;
  }
  return `<div class="block">${sectionHeadHtml(t(locale, "nav_courses"))}${inner}</div>`;
}

export function buildResumeHtml(
  locale: Locale,
  mode: ResumeMode,
  options: BuildResumeOptions,
): string {
  const c = deepPick(rawContent, locale) as unknown as PickedContent;
  const siteIntroMax = (
    appConfig as { site?: { mainIntroParagraphsMax?: number } }
  ).site?.mainIntroParagraphsMax;

  let sections: string[];
  let mainParagraphsMax: number | null;
  let historyExperienceDetail: boolean;
  let showSkillsInHistory: boolean;
  let certificationsDetail: boolean;
  let languagesDetail: boolean;
  let educationDetail: boolean;

  if (mode === "custom") {
    const sel = options.customSelection ?? defaultCustomResumeSelection();
    sections = [
      "main",
      ...CUSTOM_RESUME_SECTION_ORDER.filter((id) => sel.sections[id]),
    ];
    mainParagraphsMax =
      siteIntroMax != null && siteIntroMax > 0 ? siteIntroMax : null;
    historyExperienceDetail = sel.historyDetail;
    showSkillsInHistory = sel.showSkills;
    certificationsDetail = sel.certificationsDetail;
    languagesDetail = sel.languagesDetail;
    educationDetail = sel.educationDetail;
  } else {
    const cfg = appConfig.resume.modes[mode] as {
      sections: string[];
      mainParagraphsMax?: number | null;
      historyDetail?: boolean;
      historyBrief?: boolean;
      showSkills?: boolean;
      certificationsDetail?: boolean;
      languagesDetail?: boolean;
      educationDetail?: boolean;
    };
    sections = cfg.sections;
    showSkillsInHistory = cfg.showSkills !== false;
    historyExperienceDetail =
      cfg.historyBrief !== true && cfg.historyDetail !== false;
    certificationsDetail = cfg.certificationsDetail !== false;
    languagesDetail = cfg.languagesDetail !== false;
    educationDetail = cfg.educationDetail !== false;
    mainParagraphsMax =
      cfg.mainParagraphsMax === null
        ? null
        : typeof cfg.mainParagraphsMax === "number" && cfg.mainParagraphsMax > 0
          ? cfg.mainParagraphsMax
          : siteIntroMax != null && siteIntroMax > 0
            ? siteIntroMax
            : null;
  }

  const has = (id: string) => sections.includes(id);

  /** Esquerda: Identidade (avatar, nome, cargo) → Contactos → Idiomas → Hobbies */
  const sidebar: string[] = [];
  sidebar.push(buildSidebarIdentity(c));
  sidebar.push(blockContactsSidebar(c, locale, options));
  if (has("languages"))
    sidebar.push(blockLanguages(c, languagesDetail, locale));
  if (has("hobbies")) sidebar.push(blockHobbies(c, locale));

  /** Direita: Resumo → Especialidades → Histórico → Formação → Certificações → Projetos → Cursos */
  const mainCol: string[] = [];
  if (has("main"))
    mainCol.push(blockSummary(c, mainParagraphsMax, locale));
  if (has("expertise")) mainCol.push(blockExpertise(c, locale));
  if (has("history"))
    mainCol.push(
      blockHistory(
        c,
        historyExperienceDetail,
        locale,
        showSkillsInHistory,
      ),
    );
  if (has("education"))
    mainCol.push(blockEducation(c, educationDetail, locale));
  if (has("certifications"))
    mainCol.push(blockCertifications(c, certificationsDetail, locale));
  if (has("projects")) mainCol.push(blockProjects(c, locale));
  if (has("personal_projects")) mainCol.push(blockPersonalProjects(c, locale));
  if (has("courses")) mainCol.push(blockCourses(locale));

  const HR = '<hr class="resume-section-hr" />';
  const sidebarHtml = sidebar.join(HR);
  const singleCol = !sidebarHtml.trim();
  if (singleCol) mainCol.unshift(buildMainIdentity(c));
  const mainHtml = mainCol.join(HR);
  const bodyClass = singleCol ? "resume-body single-col" : "resume-body";

  const innerBody = singleCol
    ? `<div class="col-main">${mainHtml}</div>`
    : `<aside class="col-sidebar">${sidebarHtml}</aside><div class="col-main">${mainHtml}</div>`;

  const langAttr = locale === "pt" ? "pt-BR" : locale === "es" ? "es" : "en";
  return `<!DOCTYPE html>
<html lang="${langAttr}">
<head>
  <meta charset="utf-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1"/>
  <title>${esc(c.main.name)} — CV</title>
  <style>${RESUME_STYLES}</style>
</head>
<body>
<div class="resume-wrap">
<div class="${bodyClass}">
${innerBody}
</div>
</div>
</body>
</html>`;
}
