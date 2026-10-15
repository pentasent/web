import type { DeckSlide, PitchDeckMeta } from '@/types/investors';

export type { DeckSlide, PitchDeckMeta };

export const PITCH_DECK_META: PitchDeckMeta = {
  title: "Pentasent Pre-Seed Investor Pitch Deck",
  subtitle: "Building the operating layer for connected healthcare",
  version: "October 2026",
  round: "Pre-Seed",
  targetRaise: "€750,000",
  targetDilution: "~10–12%",
  runway: "~24 months",
  pdfPath: "/assets/records/funding/Pentasent_Investor_Pitch_Deck_PreSeed_2026.pdf",
  pptxPath: "/assets/records/funding/Pentasent_Investor_Pitch_Deck_PreSeed_2026.pptx",
  slug: "Pentasent_Investor_Pitch_Deck_PreSeed_2026",
  totalSlides: 17,
};

export const PITCH_DECK_SLIDES: DeckSlide[] = [
  {
    slideNum: 1,
    badge: "PRE-SEED • INVESTOR DECK",
    title: "Building the operating layer for connected healthcare.",
    subtitle:
      "Pentasent brings people, healthcare organizations, products, communities, events, jobs, and news into one healthcare ecosystem.",
    metrics: [
      { label: "Fundraise", value: "€750k", subtext: "Pre-Seed Round" },
      { label: "Target Dilution", value: "~10–12%", subtext: "Preserving Founder Alignment" },
      { label: "Target Runway", value: "~24 Months", subtext: "Disciplined Execution" },
    ],
    highlight: "October 2026 • Confidential Investor Briefing",
  },
  {
    slideNum: 2,
    badge: "02 / THESIS",
    title: "Healthcare has products. It lacks a connected ecosystem.",
    subtitle:
      "Patients, professionals and organizations still move between disconnected destinations to discover, participate, build and innovate.",
    details: [
      {
        title: "Discover",
        desc: "People, verified providers, clinics, organizations & evidence-based products.",
      },
      {
        title: "Participate",
        desc: "Condition-specific communities, clinical events, wellness initiatives & challenges.",
      },
      {
        title: "Build",
        desc: "Healthcare jobs, organizational presence, clinical rosters & professional identity.",
      },
      {
        title: "Innovate",
        desc: "Published clinical research, scientific evidence, health news & collaborative ventures.",
      },
    ],
    takeaway:
      "The Gap: The healthcare internet is fragmented by workflow. Care happens in one place. Communities in another. Products somewhere else. Research, jobs and events elsewhere.",
  },
  {
    slideNum: 3,
    badge: "03 / PROBLEM",
    title: "Every healthcare participant is forced to stitch together their own ecosystem.",
    subtitle: "The fragmentation is structural—not just a missing feature.",
    details: [
      {
        title: "People",
        desc: "Struggle to find verified expertise, transparent tools & trusted patient profiles.",
      },
      {
        title: "Organizations",
        desc: "Face high acquisition costs finding providers, clinical partners & skilled talent.",
      },
      {
        title: "Products",
        desc: "Lack clean discovery channels to reach health-conscious consumers and clinicians.",
      },
      {
        title: "Communities",
        desc: "Scattered across generic social platforms that lack clinical nuance and health privacy.",
      },
      {
        title: "Events",
        desc: "Conferences, CME workshops, and meetups operate in marketing isolation.",
      },
      {
        title: "Research",
        desc: "Evidence-based papers remain locked in silos away from active clinical practitioners.",
      },
    ],
    takeaway: "Pentasent’s job is to make these connections native.",
  },
  {
    slideNum: 4,
    badge: "04 / PRODUCT",
    title: "One ecosystem. Four entry points. One healthcare graph.",
    subtitle: "The experience adapts to what a person is trying to accomplish.",
    details: [
      {
        title: "01 • FOR ME",
        desc: "Track health metrics, discover care, use evidence-based calculators, and access Maya AI health guidance in a private environment.",
      },
      {
        title: "02 • PROFESSIONALS",
        desc: "Build verified clinical identity, publish peer expertise, join specialized clinical communities, and discover jobs and CME events.",
      },
      {
        title: "03 • ORGANIZATIONS",
        desc: "Establish verified institutional presence, list clinical services, showcase product portfolios, manage team rosters, and recruit talent.",
      },
      {
        title: "04 • ECOSYSTEM",
        desc: "Connect peer-reviewed research, health industry news, product registries, active communities, and collaborative projects.",
      },
    ],
    takeaway: "The same underlying ecosystem becomes more valuable as more healthcare entities participate.",
  },
  {
    slideNum: 5,
    badge: "05 / PRODUCT SURFACE",
    title: "A healthcare ecosystem, not a single-purpose app.",
    subtitle: "The platform is organized around the entities people already encounter in healthcare.",
    details: [
      { title: "PEOPLE", desc: "Profiles, expertise, identity & discovery" },
      { title: "ORGANIZATIONS", desc: "Hospitals, clinics, companies, institutions" },
      { title: "PRODUCTS", desc: "Healthcare products, tools & solutions" },
      { title: "COMMUNITIES", desc: "Peer groups, professional & founder communities" },
      { title: "EVENTS", desc: "Conferences, workshops, challenges & meetups" },
      { title: "JOBS", desc: "Healthcare opportunities & talent discovery" },
      { title: "RESEARCH", desc: "Papers, projects, collaboration & innovation" },
      { title: "NEWS", desc: "Healthcare updates, insights & ecosystem signals" },
    ],
    takeaway: "8 core healthcare entities interconnected through a shared, verified health graph.",
  },
  {
    slideNum: 6,
    badge: "06 / EXPERIENCE",
    title: "Start with an intent. Move through the ecosystem.",
    subtitle: "Pentasent is designed around journeys, not menus.",
    details: [
      {
        title: "A PERSON",
        desc: "“I want to understand or improve my health.”",
        bullet: ["Discover → Tools → Communities → Trusted providers"],
      },
      {
        title: "A PROFESSIONAL",
        desc: "“I want to build my presence and grow my career.”",
        bullet: ["Profile → Expertise → Community → Jobs / Events"],
      },
      {
        title: "AN ORGANIZATION",
        desc: "“I want to be discovered and build relationships.”",
        bullet: ["Organization → Services → Products → Talent / Events"],
      },
      {
        title: "AN INNOVATOR",
        desc: "“I want to find people, evidence and opportunities.”",
        bullet: ["Research → People → Products → Events / Collaboration"],
      },
    ],
    takeaway: "The product becomes harder to replace as a user’s identity, relationships and activity accumulate.",
  },
  {
    slideNum: 7,
    badge: "07 / WHY NOW",
    title: "Healthcare is becoming digitally addressable at ecosystem scale.",
    subtitle: "India is creating the infrastructure, market momentum and behavior for connected digital health.",
    metrics: [
      { label: "ABHA Accounts", value: "86.96 Crore", subtext: "Government digital health IDs (As of 22 Mar 2026)" },
      { label: "Health Facilities", value: "4.86 Lakh", subtext: "Verified entities on HFR registry" },
      { label: "Healthcare Professionals", value: "8.35 Lakh", subtext: "Registered on HPR healthcare registry" },
      { label: "Digital Health Market", value: "$17.81B", subtext: "2025 estimate, scaling to $106.97B by 2033 (25.12% CAGR)" },
    ],
    points: [
      "ABDM (Ayushman Bharat Digital Mission) is explicitly building an integrated, citizen-centric digital health infrastructure.",
      "Pentasent is building the discovery, participation, and relationship layer that sits natively on top of this standardized foundation.",
    ],
    sources: "Sources: Government of India / ABDM (22 Mar 2026); Grand View Research (India Digital Health, 2025 estimate)",
  },
  {
    slideNum: 8,
    badge: "08 / BUSINESS MODEL",
    title: "Multiple revenue streams. One compounding ecosystem.",
    subtitle: "Monetization follows the value Pentasent creates for each participant.",
    details: [
      {
        title: "Organizations",
        desc: "Paid institutional presence, enhanced verified profiles, team/roster tools, patient inquiry routing & API integrations.",
      },
      {
        title: "Professionals",
        desc: "Premium practitioner profiles, priority directory discovery, career placement tools & CME event ticketing.",
      },
      {
        title: "Products",
        desc: "Sponsored discovery, product registry verification, category placement, and evidence-backed product launches.",
      },
      {
        title: "Communities & Events",
        desc: "Paid community capabilities, symposium & event promotion, and sponsored healthcare innovation challenges.",
      },
      {
        title: "Data & Infrastructure",
        desc: "Future macro-analytics, health trend intelligence, and workflow integrations—always subject to strict patient consent & privacy.",
      },
    ],
    takeaway: "Initial monetization focus: organizations + professional profiles + sponsored ecosystem discovery.",
  },
  {
    slideNum: 9,
    badge: "09 / GO-TO-MARKET",
    title: "Build supply first. Let network density pull demand.",
    subtitle: "The initial wedge is healthcare professionals and organizations, where identity and discovery have immediate value.",
    details: [
      {
        title: "Step 1 • Seed Trusted Supply",
        desc: "Recruit respected medical professionals, clinics, diagnostic centers, hospitals, and specialized health communities.",
      },
      {
        title: "Step 2 • Create Useful Profiles",
        desc: "Ensure practitioner and organization profiles are discoverable, SEO-indexed, and immediately useful even before local network density is complete.",
      },
      {
        title: "Step 3 • Activate Participation",
        desc: "Use evidence-based health tools, condition communities, CME events, health jobs, and research papers to establish high-frequency retention.",
      },
      {
        title: "Step 4 • Monetize High-Intent Demand",
        desc: "Convert high-volume clinics, healthcare organizations, and specialized clinicians into paid recurring visibility, roster, and workflow plans.",
      },
    ],
    takeaway: "Distribution loop: Identity → Discovery → Participation → Relationships → Repeat Usage → Monetization.",
  },
  {
    slideNum: 10,
    badge: "10 / POSITIONING",
    title: "We are not replacing every healthcare product. We are connecting them.",
    subtitle: "Pentasent sits between single-purpose products and the broader healthcare ecosystem.",
    details: [
      {
        title: "Single-Purpose Products",
        desc: "Narrow workflow, point-solutions: Booking-only apps, single-disease trackers, isolated telehealth portals.",
      },
      {
        title: "Generic Professional Networks",
        desc: "Broad scope, but lack clinical taxonomy, medical credentials, evidence-based tools, or healthcare compliance.",
      },
      {
        title: "Pentasent Connected Ecosystem",
        desc: "Multi-sided, healthcare-native graph combining personal health tools, verified clinical identity, peer research, and institutional directories.",
      },
    ],
    takeaway: "The strategic distinction is not feature count. It is the shared graph of entities, relationships and activity.",
  },
  {
    slideNum: 11,
    badge: "11 / MOAT",
    title: "The moat is the graph, not the interface.",
    subtitle: "Every verified entity and relationship makes the ecosystem more useful for the next participant.",
    details: [
      {
        title: "Structured Healthcare Graph",
        desc: "Native schema connecting People ↔ Organizations ↔ Products ↔ Communities ↔ Events ↔ Research ↔ News.",
      },
      {
        title: "Trust & Verification Layer",
        desc: "Healthcare-specific profiles, medical registration validation, and organizational credentials establish high fidelity.",
      },
      {
        title: "Compounding Network Effects",
        desc: "More active clinicians pull more patients; more patient engagement attracts hospitals, events, and health researchers.",
      },
      {
        title: "Persistent Ecosystem History",
        desc: "Published papers, community discussions, and professional credentials create high switching costs and durable tenure.",
      },
    ],
    takeaway: "Long-term advantage: Healthcare context + Trusted identity + Verified relationships + Accumulated ecosystem activity.",
  },
  {
    slideNum: 12,
    badge: "12 / ROADMAP",
    title: "The next 24 months are about proving the engine.",
    subtitle: "We are raising to turn a broad product thesis into a measurable, repeatable business.",
    details: [
      {
        title: "0–6 MONTHS • DENSITY",
        desc: "Strengthen core discovery and verified directory. Seed initial cohort of healthcare professionals & organizations. Roll out calculators, communities, and research workflows. Instrument funnel conversion.",
      },
      {
        title: "6–12 MONTHS • REPEATABILITY",
        desc: "Validate repeat user loops across communities and tools. Launch paid organization & professional subscription tiers. Refine low-CAC acquisition playbooks. Establish first recurring revenue.",
      },
      {
        title: "12–24 MONTHS • SCALE",
        desc: "Expand geographic density across tier-1 healthcare hubs. Deepen organizational roster integrations. Expand sponsored ecosystem discovery. Prepare metrics for Series A institutional round.",
      },
    ],
    takeaway: "Fundraising milestone: Leave this round with clear evidence of product-market pull—not just a larger feature set.",
  },
  {
    slideNum: 13,
    badge: "13 / FUNDRAISE",
    title: "€750k pre-seed to prove the ecosystem can become a business.",
    subtitle: "A disciplined 24-month plan focused on product, distribution, trust and monetization.",
    metrics: [
      { label: "Target Raise", value: "€750,000", subtext: "Priced Equity / SAFE" },
      { label: "Target Dilution", value: "~10–12%", subtext: "Founder Alignment Intact" },
      { label: "Operational Runway", value: "~24 Months", subtext: "Efficient Capital Allocation" },
    ],
    breakdown: [
      { label: "Product & Engineering", percentage: 45, description: "Core web platform, graph architecture, tools & privacy infrastructure" },
      { label: "Growth & Ecosystem", percentage: 30, description: "Provider recruitment, community curation, organic SEO & content loops" },
      { label: "Operations & Admin", percentage: 15, description: "Core team, infrastructure hosting, toolsets & reporting" },
      { label: "Compliance, Legal & Contingency", percentage: 10, description: "Healthcare regulatory compliance, corporate governance & reserve" },
    ],
    takeaway:
      "What this round buys: A measurable acquisition loop, retained users, first recurring revenue, and definitive proof points for our next institutional milestone.",
  },
  {
    slideNum: 14,
    badge: "14 / USE OF CAPITAL",
    title: "Capital is tied to proof points, not headcount for its own sake.",
    subtitle: "The objective is to build a durable healthcare network and demonstrate the economics behind it.",
    details: [
      {
        title: "PRODUCT PROOF POINTS",
        desc: "Ship the core ecosystem cleanly. Polish practitioner directories, health calculators, and Maya AI interactions. Ensure zero data leaks and rock-solid privacy compliance.",
      },
      {
        title: "DISTRIBUTION PROOF POINTS",
        desc: "Seed high-quality practitioner supply. Build self-sustaining community & event loops. Establish predictable organic acquisition channels with minimal paid acquisition reliance.",
      },
      {
        title: "BUSINESS PROOF POINTS",
        desc: "Launch paid organization and verified professional products. Validate unit pricing and conversion velocity. Establish recurring subscription revenue discipline.",
      },
    ],
    takeaway: "The round is successful if Pentasent shows that ecosystem density creates measurable retention and willingness to pay.",
  },
  {
    slideNum: 15,
    badge: "15 / FOUNDER",
    title: "Built by a product-led founder who understands both software and the healthcare problem.",
    subtitle: "Ankit Kumar combines product management, software engineering and hands-on healthcare product building.",
    details: [
      {
        title: "Ankit Kumar • Founder & Product",
        desc: "M.Tech CSE • B.Tech CSE. Hands-on experience architecting full-stack software and consumer health products.",
      },
      {
        title: "Why This Founder-Market Fit",
        desc: "Thinks in end-to-end user journeys rather than isolated features. Moves rapidly from concept → design → engineering → continuous deployment. Actively operating and scaling the Pentasent platform infrastructure.",
      },
      {
        title: "Long-Term Stewardship",
        desc: "Committed to building a lasting, compounding healthcare ecosystem with principled data ethics and high scientific integrity.",
      },
    ],
    takeaway: "Technical founder with full-stack execution capability and deep domain conviction in connected healthcare.",
  },
  {
    slideNum: 16,
    badge: "16 / THE OPPORTUNITY",
    title: "Pentasent can become the place where healthcare participation starts.",
    subtitle:
      "Not another destination for one healthcare task—an ecosystem where people, organizations, products and innovation reinforce one another.",
    details: [
      { title: "More People", desc: "Discover evidence-based tools, calculators, and verified health guidance." },
      { title: "More Organizations", desc: "Showcase clinical capabilities, list services, and attract qualified talent." },
      { title: "More Products", desc: "Gain clinical validation and authentic discovery among health-conscious users." },
      { title: "More Communities", desc: "Exchange peer insights, clinical research, and verified medical discussions." },
    ],
    takeaway: "We are raising €750k to prove this flywheel—and build the foundation for the next stage of healthcare.",
  },
  {
    slideNum: 17,
    badge: "17 / APPENDIX",
    title: "Selected market evidence & fundraising notes.",
    subtitle: "Reference material for investor diligence and background verification.",
    details: [
      {
        title: "Market & Infrastructure Citations",
        desc: "• ABDM (Government of India): 86.96 Crore ABHA accounts, 4.86 Lakh facilities on HFR, 8.35 Lakh professionals on HPR as of 22 March 2026.\n• Grand View Research: India digital health market estimated at $17.81B (2025) scaling to $106.97B by 2033 (25.12% CAGR).\n• Grand View Research: India mHealth apps market projected at $4.827B by 2030 (17.1% CAGR).",
      },
      {
        title: "Pre-Seed Fundraising Summary",
        desc: "• Target Raise: €750k\n• Target Dilution: ~10–12%\n• Planning Runway: ~24 months\n• Capital Allocation: 45% Product/Eng, 30% Growth/Ecosystem, 15% Operations, 10% Compliance/Legal\n• The valuation will be finalized against demonstrated progress and founder alignment—not treated as a speculative claim.",
      },
    ],
    takeaway: "All platform infrastructure and evidence-based calculators are live and operational on Pentasent.",
  },
];
