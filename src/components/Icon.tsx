import {
  BriefcaseBusiness,
  CalendarClock,
  ChartNoAxesCombined,
  ClipboardList,
  Database,
  FileSignature,
  Globe2,
  Handshake,
  Headset,
  Inbox,
  LockKeyhole,
  Network,
  Presentation,
  Scale,
  ScrollText,
  Search,
  ShieldCheck,
  MessagesSquare,
  UserRoundCheck,
  Users,
  Workflow,
  Wrench,
  type LucideIcon,
} from "lucide-react";
import type { IconKey } from "@/content/services";

const icons: Record<IconKey, LucideIcon> = {
  assistant: Headset,
  hr: Users,
  recruitment: UserRoundCheck,
  leadership: ChartNoAxesCombined,
  mediation: Scale,
  calendar: CalendarClock,
  inbox: Inbox,
  database: Database,
  workflow: Workflow,
  support: MessagesSquare,
  executive: BriefcaseBusiness,
  policy: ScrollText,
  compliance: ShieldCheck,
  structure: Network,
  people: Users,
  search: Search,
  contract: FileSignature,
  tools: Wrench,
  globe: Globe2,
  coaching: Presentation,
  training: ClipboardList,
  handshake: Handshake,
  shield: LockKeyhole,
};

export function Icon({ name, className = "size-5" }: { name: IconKey; className?: string }) {
  const Component = icons[name];
  return <Component className={className} aria-hidden="true" strokeWidth={1.6} />;
}
