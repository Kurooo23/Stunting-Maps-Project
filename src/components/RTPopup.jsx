import { getColorLabel } from "../lib/colors";

export default function RTPopup({ feature, diseaseName = "Kasus" }) {
  if (!feature) return null;

  const { rt_number, stunting_count, case_count, kelurahan } = feature.properties;
  const count = Number(case_count ?? stunting_count ?? 0);

  return (
    <div className="rt-detail-panel">
      <h2>RT {rt_number}</h2>
      <p>
        <strong>Kelurahan:</strong> {kelurahan}
      </p>
      <p>
        <strong>{diseaseName}:</strong> {count}
      </p>
      <p>
        <strong>Kategori:</strong> {getColorLabel(count)}
      </p>
    </div>
  );
}
