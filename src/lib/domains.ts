import {
  Landmark,
  ShieldCheck,
  ArrowLeftRight,
  Globe2,
  FileBarChart2,
  Smartphone,
  type LucideIcon,
} from "lucide-react";

export type Domain = {
  key: string;
  label: string;
  href: string;
  icon: LucideIcon;
  live: boolean;
  blurb: string;
};

/** Integration domains from the Galaxy Launchpad build plan. */
export const DOMAINS: Domain[] = [
  {
    key: "core",
    label: "Core banking",
    href: "/core",
    icon: Landmark,
    live: true,
    blurb: "Account inquiry, memo post, validate and custom core facilities.",
  },
  {
    key: "screening",
    label: "Screening / OFAC",
    href: "/screening",
    icon: ShieldCheck,
    live: false,
    blurb: "OFAC / fraud screening across vendors (Verafin, LexisNexis, Actimize).",
  },
  {
    key: "payments",
    label: "Payment rails",
    href: "/payments",
    icon: ArrowLeftRight,
    live: false,
    blurb: "Route and process payments across rails.",
  },
  {
    key: "swift",
    label: "SWIFT Integration",
    href: "/swift",
    icon: Globe2,
    live: false,
    blurb: "Cross-border and trade finance flows.",
  },
  {
    key: "reporting",
    label: "Reporting",
    href: "/reporting",
    icon: FileBarChart2,
    live: false,
    blurb: "Custom reports — AML, GL, HardPost — CSV/TXT over SFTP, scheduled.",
  },
  {
    key: "digital",
    label: "Digital channels",
    href: "/digital",
    icon: Smartphone,
    live: false,
    blurb: "Digital banking channel integrations.",
  },
];
