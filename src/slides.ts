export interface SlideData {
  title: string;
  subtitle: string;
  body: string;
  tag: string;
  color: string;
  accent: string;
  cameraPos: number[];
  cameraTarget: number[];
  icon: string;
  stats?: { label: string; value: string; color?: string }[];
  highlights?: string[];
  visual?: 'pipeline' | 'mindmap' | 'survey' | 'tools' | 'timeline' | 'arch' | 'future';
}

export const SLIDES: SlideData[] = [
  {
    title: "JioHotstar",
    subtitle: "DevOps Case Study — MCA 2026",
    body: "How India's #1 OTT platform engineered a world-record\nstream of 61 Million Concurrent Users\nduring the 2023 ICC Cricket World Cup Final.\n\n🏏  Domain: Media Tech & Entertainment",
    tag: "Introduction",
    color: "#00bfff",
    accent: "#ff00ff",
    icon: "🌐",
    stats: [
      { label: "Concurrent Users", value: "61M", color: "#00bfff" },
      { label: "Uptime", value: "99.99%", color: "#22C55E" },
      { label: "World Record", value: "#1", color: "#F5A623" },
    ],
    cameraPos: [0, 20, 35],
    cameraTarget: [5, 0, 0]
  },
  {
    title: "01 / Introduction",
    subtitle: "What is JioHotstar?",
    body: "Born from the merger of JioCinema + Disney+ Hotstar (Feb 2025),\nJioHotstar is now the undisputed king of Indian streaming.\n\n• 300,000+ hours of content across 19 languages\n• 500M+ registered users — 1 in 3 Indians\n• Sports, movies, originals, news — all in one platform\n• Backed by Reliance Jio + The Walt Disney Company\n\n★  Scale challenge: One IPL ball = 60M people watching live.",
    tag: "Business Background",
    color: "#00C2CB",
    accent: "#8B5CF6",
    icon: "📺",
    stats: [
      { label: "Registered Users", value: "500M+", color: "#00C2CB" },
      { label: "Content Hours", value: "300K+", color: "#8B5CF6" },
      { label: "Languages", value: "19", color: "#F5A623" },
    ],
    cameraPos: [-20, 15, 20],
    cameraTarget: [-20, 0, 0]
  },
  {
    title: "02 / Problem Analysis",
    subtitle: "What Broke Before DevOps?",
    body: "Before the DevOps transformation, every big match was a gamble:",
    tag: "Challenges Identified",
    color: "#F5A623",
    accent: "#E8433A",
    icon: "⚠️",
    highlights: [
      "⚡  Traffic Spikes — Only 25M capacity on 2 Kubernetes clusters",
      "🔧  Manual Infra — 800+ microservices, each with its own load balancer",
      "🐢  Slow Deploys — Bug fixes during live matches took 45+ minutes",
      "📡  No Smart Caching — Every API hit reached the origin server directly",
      "💸  Runaway Costs — Blind horizontal scaling burned crores per day",
      "📊  Zero Observability — No unified dashboard; alerts arrived too late",
    ],
    cameraPos: [0, 30, 40],
    cameraTarget: [0, 0, 0]
  },
  {
    title: "03 / Literature Review",
    subtitle: "Research: ByteByteGo + AWS Case Study, 2025",
    body: "Sources studied:\n• \"How Hotstar Scaled to 60M Concurrent Users\" — ByteByteGo\n• AWS Re:Invent 2023 — Hotstar Engineering Track\n• ACM Paper on Event-Driven Autoscaling Patterns\n\nKey Validated Findings:",
    tag: "Literature Review",
    color: "#8B5CF6",
    accent: "#00C2CB",
    icon: "📚",
    highlights: [
      "→  Smart caching split reduced origin server load by 70%+",
      "→  Migrating to AWS EKS removed 40% of infra management overhead",
      "→  Custom Golang autoscaler responded to demand spikes in 30 seconds",
      "→  Chaos engineering runs increased MTTR resilience by 3×",
    ],
    stats: [
      { label: "Load Reduction", value: "70%", color: "#8B5CF6" },
      { label: "Spike Response", value: "30s", color: "#22C55E" },
      { label: "MTTR Gain", value: "3×", color: "#00C2CB" },
    ],
    cameraPos: [-10, 10, 15],
    cameraTarget: [-10, 0, 0]
  },
  {
    title: "04 / DevOps Solutions",
    subtitle: "Problem → Tool → Outcome",
    body: "Every bottleneck was answered with a purpose-built DevOps solution:",
    tag: "Tools & Solutions",
    color: "#22C55E",
    accent: "#00bfff",
    icon: "🛠️",
    visual: "tools",
    highlights: [
      "Traffic Spikes     →  AWS EKS + Custom Autoscaler   →  61M users in 30s",
      "800 Microservices  →  Kubernetes + Istio Mesh        →  Smart routing",
      "Slow Deployments   →  GitHub Actions CI/CD           →  Zero manual steps",
      "API Overload       →  Redis Cache + AWS CloudFront   →  70% load drop",
      "No Observability   →  Prometheus + Grafana           →  Real-time alerts",
      "Env Mismatch       →  Docker Containers              →  Runs everywhere",
    ],
    cameraPos: [12, 10, 15],
    cameraTarget: [12, 0, -5]
  },
  {
    title: "05 / Architecture",
    subtitle: "The CI/CD Pipeline — End to End",
    body: "Every code push flows through this fully automated pipeline:",
    tag: "Architecture Deep Dive",
    color: "#00C2CB",
    accent: "#22C55E",
    icon: "🏗️",
    visual: "arch",
    highlights: [
      "CODE     →  GitHub repo — engineers push feature branches",
      "BUILD    →  GitHub Actions triggers — Docker image compiled",
      "TEST     →  Jest + Pytest — unit & integration tests validated",
      "PACKAGE  →  Docker image tagged & pushed to AWS ECR registry",
      "DEPLOY   →  AWS EKS rolling update — zero-downtime deployment",
      "MONITOR  →  Grafana + Prometheus — 24/7 health dashboards live",
    ],
    stats: [
      { label: "Deploy Time", value: "<5 min", color: "#22C55E" },
      { label: "Test Coverage", value: "94%", color: "#00C2CB" },
      { label: "Manual Steps", value: "0", color: "#F5A623" },
    ],
    cameraPos: [0, 20, 25],
    cameraTarget: [0, 0, 0]
  },
  {
    title: "06 / Mind Map",
    subtitle: "DevOps at JioHotstar — Full Picture",
    body: "The complete DevOps ecosystem across four strategic pillars:",
    tag: "Mind Map Overview",
    color: "#E8433A",
    accent: "#F5A623",
    icon: "🗺️",
    visual: "mindmap",
    highlights: [
      "🧰  TOOLS:       Docker · Kubernetes · GitHub Actions · Terraform · Prometheus · Grafana",
      "🔄  STAGES:      Build → Test → Package → Deploy → Monitor → Feedback → Repeat",
      "🤖  AUTOMATION:  Auto-Scale · Auto-Heal · Auto-Deploy · Load Test · Cost Optimize",
      "👥  PEOPLE:      Dev Team · SRE / Ops · QA · Security · Data Eng · Product",
    ],
    cameraPos: [5, 25, 30],
    cameraTarget: [12, 0, -5]
  },
  {
    title: "07 / Survey Results",
    subtitle: "Primary Research — 12 Respondents",
    body: "Mini survey conducted among tech students & working professionals:",
    tag: "Survey & Data Analysis",
    color: "#F5A623",
    accent: "#E8433A",
    icon: "📊",
    visual: "survey",
    highlights: [
      "Q1 — Do you know what DevOps is?      Yes 58% · Heard of it 33% · No 9%",
      "Q2 — Does automation reduce errors?   Strongly Agree 67% · Agree 25% · Unsure 8%",
      "Q3 — Is DevOps the future of IT?      Yes 75% · Maybe 17% · No 8%",
    ],
    stats: [
      { label: "Aware of DevOps", value: "91%", color: "#F5A623" },
      { label: "Back Automation", value: "92%", color: "#22C55E" },
      { label: "See it as Future", value: "75%", color: "#00C2CB" },
    ],
    cameraPos: [25, 10, 15],
    cameraTarget: [25, 0, -10]
  },
  {
    title: "08 / Personal Insights",
    subtitle: "What This Case Study Taught Me",
    body: "Three takeaways that changed how I think about software at scale:",
    tag: "Reflection & Learning",
    color: "#8B5CF6",
    accent: "#00bfff",
    icon: "💡",
    highlights: [
      "🏆  Most Impressive — Kubernetes auto-managing 800 microservices live, zero human work",
      "🤝  DevOps = Culture — It forces Dev and Ops to share both ownership and accountability",
      "📐  Start Small — Docker + GitHub Actions alone can transform a small team's delivery speed",
      "🔥  Real Stakes — In a live match, a 2-minute outage means 120M+ frustrated viewers",
    ],
    cameraPos: [12, 5, 20],
    cameraTarget: [12, -2, -5]
  },
  {
    title: "09 / Future Scope",
    subtitle: "Where is DevOps in OTT Heading?",
    body: "The next five years will push DevOps even further:",
    tag: "Future Trends",
    color: "#22C55E",
    accent: "#8B5CF6",
    icon: "🚀",
    visual: "future",
    highlights: [
      "🤖  AI-Driven Autoscaling — ML predicts traffic 10 minutes before it spikes",
      "☁️  Multi-Cloud Strategy — AWS + Azure + GCP for true zero-single-failure-point",
      "🔐  DevSecOps — Security scans baked into every PR and every pipeline run",
      "📱  Edge + 5G Computing — Jio 5G edge nodes cut stream start latency below 1s",
      "💼  700,000+ DevOps roles needed in India alone by 2027 (NASSCOM Report)",
    ],
    stats: [
      { label: "India DevOps Jobs 2027", value: "700K+", color: "#22C55E" },
      { label: "5G Latency Target", value: "<1s", color: "#00bfff" },
      { label: "Cost Saving via AI", value: "40%", color: "#F5A623" },
    ],
    cameraPos: [0, 20, 35],
    cameraTarget: [5, 0, 0]
  },
  {
    title: "10 / Conclusion",
    subtitle: "What 61 Million Users Proved",
    body: "\"61 million people. One match. Zero downtime.\"\n\nJioHotstar's World Cup stream was not luck. It was the result\nof two years of deliberate DevOps transformation:\n\n✅  Automated everything that could fail manually\n✅  Built resilience through chaos engineering\n✅  Measured everything with Prometheus + Grafana\n✅  Deployed in minutes, not hours\n\nDevOps is not a tool — it is a mindset that scales infinitely.",
    tag: "Conclusion",
    color: "#00bfff",
    accent: "#22C55E",
    icon: "🏆",
    stats: [
      { label: "Peak Users", value: "61M", color: "#00bfff" },
      { label: "Downtime", value: "0s", color: "#22C55E" },
      { label: "World Record", value: "✓", color: "#F5A623" },
    ],
    cameraPos: [0, 25, 38],
    cameraTarget: [0, 0, 0]
  },
  {
    title: "Thank You",
    subtitle: "Questions & Discussion",
    body: "Thank you for exploring the JioHotstar DevOps Case Study.\n\n\"61 million people. One match. Zero downtime.\"\nThat is the power of DevOps done right.\n\nFeel free to ask anything!",
    tag: "Q & A",
    color: "#ff00ff",
    accent: "#00bfff",
    icon: "🙏",
    cameraPos: [0, 30, 40],
    cameraTarget: [0, 0, 0]
  }
];
