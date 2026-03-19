import {
  Award,
  BookOpen,
  Briefcase,
  Code2,
  FileText,
  FolderKanban,
  GraduationCap,
  Heart,
  Languages,
  Layers,
  Mail,
} from "lucide-react";

/** Ícones alinhados ao menu / títulos de secção */
export const SECTION_ICONS = {
  expertise: Layers,
  certifications: Award,
  history: Briefcase,
  education: GraduationCap,
  languages: Languages,
  projects: FolderKanban,
  personal_projects: Code2,
  courses: BookOpen,
  hobbies: Heart,
  resume: FileText,
  contact: Mail,
} as const;

export type SectionIconKey = keyof typeof SECTION_ICONS;

export function SectionTitleIcon({
  name,
  className = "",
}: {
  name: SectionIconKey;
  className?: string;
}) {
  const Icon = SECTION_ICONS[name];
  return <Icon className={className} strokeWidth={1.4} aria-hidden />;
}
