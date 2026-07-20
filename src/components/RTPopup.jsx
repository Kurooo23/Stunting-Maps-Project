import { getColorLabel } from "../lib/colors";

export default function RTPopup({ feature }) {
  if (!feature) return null;

  const { rt_number, stunting_count, kelurahan } = feature.properties;

  return (
    <div className="rt-detail-panel">
      <h2>RT {rt_number}</h2>
      <p>
        <strong>Kelurahan:</strong> {kelurahan}
      </p>
      <p>
        <strong>Kasus Stunting:</strong> {stunting_count}
      </p>
      <p>
        <strong>Kategori:</strong> {getColorLabel(stunting_count)}
      </p>
    </div>
  );
}
