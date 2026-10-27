/**
 * HexMark — the official NextGen Learners hexagon </> logo mark as an inline SVG.
 * Used as a decorative brand watermark in hero / about / CTA panels.
 * Colors are overridable so it works on dark backgrounds and on the mint gradient.
 */
export default function HexMark({
  size = 190,
  className,
  style,
  mint = '#2ee0a1',
  contrast = '#f5f7fa',
  strokeWidth = 3.5,
}) {
  return (
    <svg
      className={className}
      style={style}
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      aria-hidden="true"
    >
      <g strokeLinecap="round" strokeLinejoin="round" strokeWidth={strokeWidth}>
        {/* hexagon: mint left half, contrast right half */}
        <path d="M 28 8.6 L 9.5 19.3 L 9.5 44.7 L 28 55.4" stroke={mint} />
        <path d="M 36 55.4 L 54.5 44.7 L 54.5 19.3 L 36 8.6" stroke={contrast} />
        {/* code glyph </> */}
        <path d="M 25.5 25 L 18.5 32 L 25.5 39" stroke={contrast} />
        <path d="M 36.5 23.5 L 28.5 40.5" stroke={mint} />
        <path d="M 38.5 25 L 45.5 32 L 38.5 39" stroke={contrast} />
      </g>
    </svg>
  );
}
