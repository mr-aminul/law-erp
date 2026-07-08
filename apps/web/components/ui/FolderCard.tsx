import { cn } from "@/lib/utils";

export type FolderCardVariant = "blue" | "red" | "green" | "amber" | "sidebar";
export type FolderCardSize = "md" | "sm";

export interface FolderCardMetric {
  label: string;
  value: string | number;
  highlight?: boolean;
}

export interface FolderCardProps {
  variant?: FolderCardVariant;
  size?: FolderCardSize;
  fluid?: boolean;
  title: string;
  subtitle?: string;
  highlightValue: string | number;
  highlightLabel?: string | null;
  metrics?: FolderCardMetric[];
  className?: string;
}

interface CardLayout {
  width: number;
  height: number;
  border: number;
  outerRadius: number;
  innerRadius: number;
  folderTabY: number;
  folderShelfY: number;
  titleTop: number;
  docsTop: number;
  docsHeight: number;
  docsWidth: number;
  bleed: number;
  contentX: number;
  contentBottom: number;
  titleSize: number;
  subtitleSize: number;
  metricLabelSize: number;
  metricValueSize: number;
  highlightLabelSize: number;
  sheetRadius: number;
  sheetPaddingX: number;
  sheetPaddingTop: number;
  sheetLineGap: number;
  sheetTranslate: readonly [number, number, number];
}

const CARD_LAYOUTS: Record<FolderCardSize, CardLayout> = {
  md: {
    width: 288,
    height: 260,
    border: 6,
    outerRadius: 36,
    innerRadius: 30,
    folderTabY: 113,
    folderShelfY: 128,
    titleTop: 123,
    docsTop: 59,
    docsHeight: 100,
    docsWidth: 144,
    bleed: 4,
    contentX: 24,
    contentBottom: 20,
    titleSize: 15,
    subtitleSize: 13,
    metricLabelSize: 11,
    metricValueSize: 14,
    highlightLabelSize: 13,
    sheetRadius: 14,
    sheetPaddingX: 14,
    sheetPaddingTop: 16,
    sheetLineGap: 7,
    sheetTranslate: [-18, 0, 20],
  },
  sm: {
    width: 228,
    height: 206,
    border: 5,
    outerRadius: 28,
    innerRadius: 23,
    folderTabY: 90,
    folderShelfY: 101,
    titleTop: 98,
    docsTop: 47,
    docsHeight: 78,
    docsWidth: 114,
    bleed: 3,
    contentX: 18,
    contentBottom: 16,
    titleSize: 13,
    subtitleSize: 11,
    metricLabelSize: 10,
    metricValueSize: 12,
    highlightLabelSize: 11,
    sheetRadius: 11,
    sheetPaddingX: 11,
    sheetPaddingTop: 13,
    sheetLineGap: 5,
    sheetTranslate: [-14, 0, 16],
  },
};

const COLORS = {
  folder: "#1A1A1A",
  sheetLine: "#E4E4E4",
  subtitle: "#8A8A8A",
  label: "#9B9B9B",
  highlight: "var(--color-green)",
} as const;

const SHEET_LINES = ["100%", "82%", "100%", "70%", "90%"] as const;
const SHEET_ROTATIONS = [-13, 1, 15] as const;

const GRADIENT_LAYERS: Record<FolderCardVariant, readonly string[]> = {
  blue: [
    "radial-gradient(125% 100% at 12% 16%, rgba(199,228,255,0.95) 0%, rgba(199,228,255,0) 42%)",
    "radial-gradient(140% 130% at 93% 6%, #2A69D4 0%, rgba(42,105,212,0) 58%)",
    "radial-gradient(130% 120% at 28% 102%, rgba(157,204,250,0.6) 0%, rgba(157,204,250,0) 52%)",
    "linear-gradient(135deg, #5BA1ED 0%, #3D83E4 48%, #2C6FDA 100%)",
  ],
  red: [
    "radial-gradient(118% 92% at 87% 15%, rgba(255,216,228,0.96) 0%, rgba(255,216,228,0) 44%)",
    "radial-gradient(132% 122% at 83% 104%, #FFA572 0%, rgba(255,165,114,0) 52%)",
    "radial-gradient(120% 120% at 6% 8%, #E23A3A 0%, rgba(226,58,58,0) 56%)",
    "linear-gradient(122deg, #E63C46 0%, #ED5667 42%, #F0789A 72%, #FB9479 100%)",
  ],
  green: [
    "radial-gradient(125% 100% at 12% 16%, rgba(210,245,225,0.95) 0%, rgba(210,245,225,0) 42%)",
    "radial-gradient(140% 130% at 93% 6%, #1a5c45 0%, rgba(26,92,69,0) 58%)",
    "radial-gradient(130% 120% at 28% 102%, rgba(140,200,170,0.55) 0%, rgba(140,200,170,0) 52%)",
    "linear-gradient(135deg, #4a9e7a 0%, #2d7a5c 48%, #1a5c45 100%)",
  ],
  amber: [
    "radial-gradient(118% 92% at 87% 15%, rgba(255,236,200,0.96) 0%, rgba(255,236,200,0) 44%)",
    "radial-gradient(132% 122% at 83% 104%, #e8a04a 0%, rgba(232,160,74,0) 52%)",
    "radial-gradient(120% 120% at 6% 8%, #c47a20 0%, rgba(196,122,32,0) 56%)",
    "linear-gradient(122deg, #d4923a 0%, #c47a20 42%, #b87d2b 72%, #e8a85c 100%)",
  ],
  sidebar: [
    "radial-gradient(125% 100% at 12% 16%, rgba(180,210,195,0.5) 0%, rgba(180,210,195,0) 42%)",
    "radial-gradient(140% 130% at 93% 6%, #0f3d2e 0%, rgba(15,61,46,0) 58%)",
    "radial-gradient(130% 120% at 28% 102%, rgba(60,120,95,0.45) 0%, rgba(60,120,95,0) 52%)",
    "linear-gradient(135deg, #2d6b52 0%, #1a5c45 48%, #0f3d2e 100%)",
  ],
};

const CARD_SHADOW = {
  md: "shadow-[0_18px_34px_-12px_rgba(0,0,0,0.38),0_6px_14px_-6px_rgba(0,0,0,0.22)]",
  sm: "shadow-[0_10px_20px_-8px_rgba(0,0,0,0.32),0_4px_10px_-4px_rgba(0,0,0,0.18)]",
} as const;

function pct(value: number, total: number) {
  return `${(value / total) * 100}%`;
}

function buildFolderPath(layout: CardLayout) {
  const { width, height, bleed, folderTabY, folderShelfY, titleTop } = layout;
  const shelfCurve = folderShelfY - 2;

  return [
    `M -${bleed} ${height + bleed}`,
    `L -${bleed} ${titleTop}`,
    `Q -${bleed} ${folderTabY} 12 ${folderTabY}`,
    `L 120 ${folderTabY}`,
    `C 138 ${folderTabY} 140 ${shelfCurve} 162 ${folderShelfY}`,
    `L ${width + bleed} ${folderShelfY}`,
    `L ${width + bleed} ${height + bleed}`,
    "Z",
  ].join(" ");
}

function highlightFontSize(value: string | number, size: FolderCardSize) {
  const length = String(value).length;
  if (size === "sm") {
    if (length > 12) return 15;
    if (length > 8) return 18;
    return 22;
  }
  if (length > 12) return 18;
  if (length > 8) return 22;
  return 28;
}

function DocumentSheet({
  layout,
  transform,
}: {
  layout: CardLayout;
  transform: string;
}) {
  return (
    <div
      className="absolute inset-0 bg-surface shadow-[0_12px_24px_-8px_rgba(0,0,0,0.28)]"
      style={{
        transform,
        transformOrigin: "bottom center",
        borderRadius: layout.sheetRadius,
        paddingLeft: layout.sheetPaddingX,
        paddingRight: layout.sheetPaddingX,
        paddingTop: layout.sheetPaddingTop,
      }}
    >
      <div className="flex flex-col" style={{ gap: layout.sheetLineGap }}>
        {SHEET_LINES.map((width, i) => (
          <div
            key={i}
            className="rounded-full"
            style={{
              width,
              height: layout.sheetLineGap <= 4 ? 2 : 3,
              backgroundColor: COLORS.sheetLine,
            }}
          />
        ))}
      </div>
    </div>
  );
}

function DocumentStack({
  layout,
  fluid,
}: {
  layout: CardLayout;
  fluid: boolean;
}) {
  return (
    <div
      className="pointer-events-none absolute left-1/2 z-10 -translate-x-1/2"
      style={{
        top: fluid ? pct(layout.docsTop, layout.height) : layout.docsTop,
        height: fluid ? pct(layout.docsHeight, layout.height) : layout.docsHeight,
        width: fluid ? pct(layout.docsWidth, layout.width) : layout.docsWidth,
      }}
    >
      {SHEET_ROTATIONS.map((rotate, i) => {
        const offset = layout.sheetTranslate[i];
        const translateX = fluid
          ? `${(offset / layout.docsWidth) * 100}%`
          : `${offset}px`;

        return (
          <DocumentSheet
            key={rotate}
            layout={layout}
            transform={`rotate(${rotate}deg) translateX(${translateX})`}
          />
        );
      })}
    </div>
  );
}

function FolderBody({ layout }: { layout: CardLayout }) {
  return (
    <svg
      viewBox={`0 0 ${layout.width} ${layout.height}`}
      preserveAspectRatio="none"
      className="absolute inset-0 z-20 h-full w-full"
      aria-hidden="true"
    >
      <path d={buildFolderPath(layout)} fill={COLORS.folder} />
    </svg>
  );
}

export function FolderCard({
  variant = "blue",
  size = "md",
  fluid = false,
  title,
  subtitle,
  highlightValue,
  highlightLabel,
  metrics,
  className,
}: FolderCardProps) {
  const layout = CARD_LAYOUTS[size];
  const background = GRADIENT_LAYERS[variant].join(", ");
  const highlightText = String(highlightValue);
  const highlightSize = highlightFontSize(highlightValue, size);

  return (
    <div
      className={cn(
        CARD_SHADOW[size],
        fluid && "w-full self-start",
        className
      )}
      style={{
        width: fluid ? undefined : layout.width,
        aspectRatio: `${layout.width} / ${layout.height}`,
        backgroundColor: COLORS.folder,
        borderRadius: layout.outerRadius,
        padding: layout.border,
      }}
    >
      <div
        className="relative isolate h-full w-full overflow-hidden"
        style={{ borderRadius: layout.innerRadius }}
      >
        <div className="absolute inset-0 z-0" style={{ background }} />

        <DocumentStack layout={layout} fluid={fluid} />
        <FolderBody layout={layout} />

        <div className="absolute inset-0 z-30">
          <div
            style={{
              position: "absolute",
              top: fluid ? pct(layout.titleTop, layout.height) : layout.titleTop,
              left: fluid ? pct(layout.contentX, layout.width) : layout.contentX,
              right: fluid ? pct(layout.contentX, layout.width) : layout.contentX,
            }}
          >
            <h3
              className="font-semibold leading-none tracking-[-0.01em] text-white"
              style={{ fontSize: layout.titleSize }}
            >
              {title}
            </h3>
            {subtitle && (
              <p
                className="leading-none"
                style={{
                  marginTop: size === "sm" ? 4 : 7,
                  fontSize: layout.subtitleSize,
                  color: COLORS.subtitle,
                }}
              >
                {subtitle}
              </p>
            )}

            {metrics && metrics.length > 0 && (
              <div
                className="grid grid-cols-2 gap-2"
                style={{ marginTop: size === "sm" ? 10 : 12 }}
              >
                {metrics.map((metric) => (
                  <div key={metric.label} className="min-w-0">
                    <p
                      className="leading-none"
                      style={{
                        fontSize: layout.metricLabelSize,
                        color: COLORS.label,
                      }}
                    >
                      {metric.label}
                    </p>
                    <p
                      className="mt-0.5 font-semibold leading-none tabular-nums"
                      style={{
                        fontSize: layout.metricValueSize,
                        color: metric.highlight
                          ? COLORS.highlight
                          : "#ffffff",
                      }}
                    >
                      {metric.value}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div
            className="max-w-[55%] text-right"
            style={{
              position: "absolute",
              bottom: fluid
                ? pct(layout.contentBottom, layout.height)
                : layout.contentBottom,
              right: fluid ? pct(layout.contentX, layout.width) : layout.contentX,
            }}
          >
            <p
              className="font-semibold leading-none tracking-[-0.03em] text-white tabular-nums"
              style={{ fontSize: highlightSize }}
            >
              {highlightText}
            </p>
            {highlightLabel && (
              <p
                className="mt-0.5 font-medium leading-none"
                style={{
                  fontSize: layout.highlightLabelSize,
                  color: COLORS.label,
                }}
              >
                {highlightLabel}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
