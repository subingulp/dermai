/** A rounded photo, optionally with the AI "region" box drawn on top. */
export default function PhotoFrame({ src, alt, region, regionLabel, className = '', children }) {
  return (
    <div className={`photo ${className}`}>
      {src ? <img src={src} alt={alt} draggable="false" /> : <div className="photo__empty" />}
      {region && (
        <div
          className="photo__region"
          style={{ left: `${region.x}%`, top: `${region.y}%`, width: `${region.w}%`, height: `${region.h}%` }}
          aria-hidden="true"
        >
          {regionLabel && <span>{regionLabel}</span>}
        </div>
      )}
      {children}
    </div>
  );
}

/** Shows only the cropped region of a photo (the "ROI crop" step). */
export function RoiCrop({ src, region, className = '' }) {
  const px = region.x / (100 - region.w);
  const py = region.y / (100 - region.h);
  return (
    <div
      className={`roicrop ${className}`}
      role="img"
      aria-label="Cropped region of the photo"
      style={{
        backgroundImage: `url(${src})`,
        backgroundSize: `${(100 / region.w) * 100}% ${(100 / region.h) * 100}%`,
        backgroundPosition: `${px * 100}% ${py * 100}%`,
      }}
    />
  );
}
