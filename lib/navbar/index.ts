/**
 * Navbar routing configuration, pattern matching, and style resolution.
 */

export type RouteNavConfig = {
  bg?: string;
  dark?: boolean;
  logoColor?: 'white' | 'dark';
  lineColor?: string;
  inkColor?: string;
  animate?: boolean;
  position?: 'absolute' | 'relative' | 'fixed' | 'sticky';
};

export type RouteNavRule = {
  routes: string | string[];
  config: RouteNavConfig;
};

export type RouteNavConfigs =
  | Record<string, RouteNavConfig>
  | RouteNavRule[];

/**
 * Route-specific default navigation configurations.
 * Supports exact paths and wildcards (e.g. `/legal/*`, `/company/**`).
 * Multiple paths can also be grouped with `||` or `|`.
 */
export const ROUTE_NAV_CONFIGS: Record<string, RouteNavConfig> = {
  '/ || /company/about || /company/press || /company/life || /company/careers || /company/careers/research': {
    bg: 'bg-transparent',
    dark: false,
    logoColor: 'white',
    lineColor: 'bg-white',
    inkColor: 'text-white',
    animate: true,
    position: 'absolute',
  },
  '/jobs || /people || /products || /organizations || /communities || /events': {
    bg: 'bg-transparent',
    dark: false,
    logoColor: 'white',
    lineColor: 'bg-white',
    inkColor: 'text-white',
    animate: false,
    position: 'absolute',
  },
  '/company/contact || /blog/* || /pricing || /tools/* || /coming-soon || /account/* || /my-health/* || /communities/* || /events/*': {
    bg: 'bg-primary',
    dark: false,
    logoColor: 'white',
    lineColor: 'bg-white',
    inkColor: 'text-white',
    animate: false,
    position: 'absolute',
  },
  '/news/* || /organizations/* || /people/* || /products/* || /research/*': {
    bg: 'bg-white',
    dark: true,
    logoColor: 'dark',
    lineColor: 'bg-[#3f0038]',
    inkColor: 'text-[#3f0038]',
    animate: false,
    position: 'relative',
  },
};

export const DEFAULT_FALLBACK_CONFIG: RouteNavConfig = {
  bg: 'bg-transparent',
  dark: true,
  logoColor: 'dark',
  lineColor: 'bg-[#3f0038]',
  inkColor: 'text-[#3f0038]',
  animate: false,
  position: 'relative',
};

/**
 * Checks if a pathname matches a single route pattern.
 */
export function matchSinglePattern(pattern: string, pathname: string): boolean {
  const p = pattern.trim().toLowerCase();
  if (!p) return false;

  const normP = p.replace(/\/$/, '') || '/';
  const normPath = pathname.trim().toLowerCase().replace(/\/$/, '') || '/';

  // Exact match
  if (normP === normPath) return true;

  // Wildcard trailing: e.g. /legal/* or /legal/**
  if (p.endsWith('/*') || p.endsWith('/**')) {
    const base = p.replace(/\/\*+$/, '') || '/';
    if (normPath === base || normPath.startsWith(base === '/' ? '/' : base + '/')) {
      return true;
    }
  }

  // General glob matching with '*'
  if (p.includes('*')) {
    const escaped = p
      .replace(/[.+?^${}()|[\]\\]/g, '\\$&')
      .replace(/\*\*/g, '.*')
      .replace(/\*/g, '.*');
    try {
      const regex = new RegExp(`^${escaped}$`);
      return regex.test(normPath);
    } catch {
      return false;
    }
  }

  return false;
}

/**
 * Finds the matching navigation configuration for a given pathname.
 * Prioritizes exact matches before testing wildcard patterns.
 */
export function findMatchingRouteConfig(
  pathname: string,
  configs?: RouteNavConfigs
): RouteNavConfig | undefined {
  if (!configs) return undefined;
  const normPath = pathname ? pathname.trim().toLowerCase().replace(/\/$/, '') || '/' : '/';

  const entries: [string | string[], RouteNavConfig][] = Array.isArray(configs)
    ? configs.map((item) => [item.routes, item.config])
    : Object.entries(configs);

  // Pass 1: Prioritize exact matches
  for (const [key, config] of entries) {
    const routeList = Array.isArray(key)
      ? key
      : key.split(/\s*(?:\|\||\||,)\s*/).filter(Boolean);

    for (const r of routeList) {
      const clean = r.trim().toLowerCase().replace(/\/$/, '') || '/';
      if (!clean.includes('*') && clean === normPath) {
        return config;
      }
    }
  }

  // Pass 2: Wildcards and pattern matching (e.g. /legal/*, /company/**)
  for (const [key, config] of entries) {
    const routeList = Array.isArray(key)
      ? key
      : key.split(/\s*(?:\|\||\||,)\s*/).filter(Boolean);

    for (const r of routeList) {
      if (matchSinglePattern(r, normPath)) {
        return config;
      }
    }
  }

  return undefined;
}

/**
 * Computes SVG stroke class for hamburger lines based on background color class.
 */
export function getLineStrokeClass(activeLine: string): string {
  if (activeLine.includes('stroke-')) return activeLine;
  if (activeLine.includes('bg-white')) return 'stroke-white';
  if (activeLine.includes('bg-[#3f0038]')) return 'stroke-[#3f0038]';
  if (activeLine.startsWith('bg-')) return activeLine.replace('bg-', 'stroke-');
  return '';
}

export type ResolveNavStylesInput = {
  pathname?: string | null;
  routeConfigs?: RouteNavConfigs;
  bgClassName?: string;
  bgColor?: string;
  dark?: boolean;
  logoColor?: 'white' | 'dark';
  lineColor?: string;
  inkColor?: string;
  animateOnMount?: boolean;
  position?: 'absolute' | 'relative' | 'fixed' | 'sticky';
};

export type ResolvedNavStyles = {
  resolvedBg: string;
  resolvedDark: boolean;
  resolvedLogoColor: 'white' | 'dark';
  resolvedLineColor: string;
  resolvedInkColor: string;
  resolvedPosition: 'absolute' | 'relative' | 'fixed' | 'sticky';
  shouldAnimate: boolean;
  activeRouteConfig: RouteNavConfig;
};

/**
 * Resolves all navbar styles (colors, logos, line strokes, animations)
 * by merging current route configuration with any manual prop overrides.
 */
export function resolveNavStyles({
  pathname,
  routeConfigs,
  bgClassName,
  bgColor,
  dark,
  logoColor,
  lineColor,
  inkColor,
  animateOnMount,
  position,
}: ResolveNavStylesInput): ResolvedNavStyles {
  const normalizedPath = pathname ? pathname.replace(/\/$/, '') || '/' : '/';

  const activeRouteConfig =
    findMatchingRouteConfig(normalizedPath, routeConfigs) ??
    findMatchingRouteConfig(normalizedPath, ROUTE_NAV_CONFIGS) ??
    DEFAULT_FALLBACK_CONFIG;

  const isHomeOrAbout = normalizedPath === '/' || normalizedPath === '/company/about';
  const shouldAnimate =
    animateOnMount !== undefined
      ? animateOnMount
      : activeRouteConfig.animate !== undefined
      ? activeRouteConfig.animate
      : isHomeOrAbout;

  const resolvedBg = bgClassName || bgColor || activeRouteConfig.bg || 'bg-transparent';
  const resolvedDark = dark !== undefined ? dark : (activeRouteConfig.dark ?? false);
  const resolvedLogoColor: 'white' | 'dark' =
    logoColor ||
    activeRouteConfig.logoColor ||
    (resolvedDark ? 'dark' : 'white');
  const resolvedLineColor =
    lineColor ||
    activeRouteConfig.lineColor ||
    (resolvedDark ? 'bg-[#3f0038]' : 'bg-white');
  const resolvedInkColor =
    inkColor ||
    activeRouteConfig.inkColor ||
    (resolvedDark || resolvedLogoColor === 'dark' ? 'text-[#3f0038]' : 'text-white');
  const resolvedPosition =
    position || activeRouteConfig.position || 'absolute';

  return {
    resolvedBg,
    resolvedDark,
    resolvedLogoColor,
    resolvedLineColor,
    resolvedInkColor,
    resolvedPosition,
    shouldAnimate,
    activeRouteConfig,
  };
}
