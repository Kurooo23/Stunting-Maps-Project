import { useEffect, useState } from "react";
import {
  submitStuntingData,
  getRTNumbers,
  getCurrentPeriod,
} from "../lib/dataService";
import { useAuth } from "../lib/useAuth";

const currentPeriod = getCurrentPeriod();

export default function InputPage() {
  const { user } = useAuth();
  const kelurahan = user?.user_metadata?.kelurahan;
  const [rtNumbers, setRTNumbers] = useState([]);
  const [formData, setFormData] = useState({
    rtNumber: "",
    stuntingCount: "",
    period: currentPeriod,
    notes: "",
  });

  const [status, setStatus] = useState(null); // { type: 'success' | 'error', message: '' }
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    getRTNumbers(kelurahan).then(setRTNumbers);
  }, [kelurahan]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.rtNumber) {
      setStatus({ type: "error", message: "Pilih nomor RT terlebih dahulu." });
      return;
    }
    if (formData.stuntingCount === "" || Number(formData.stuntingCount) < 0) {
      setStatus({ type: "error", message: "Masukkan jumlah kasus yang valid." });
      return;
    }

    setIsSubmitting(true);
    setStatus(null);

    const result = await submitStuntingData({
      rtNumber: formData.rtNumber,
      stuntingCount: Number(formData.stuntingCount),
      period: formData.period,
      notes: formData.notes,
      kelurahan,
    });

    if (result.success) {
      setStatus({
        type: "success",
        message: `Data RT ${formData.rtNumber} berhasil disimpan!`,
      });
      // Reset form
      setFormData({
        rtNumber: "",
        stuntingCount: "",
        period: currentPeriod,
        notes: "",
      });
    } else {
      setStatus({ type: "error", message: result.error });
    }

    setIsSubmitting(false);
  };

  return (
    <div className="input-page">
      <div className="input-card">
        <div className="input-header">
          <h2>Input Data Stunting</h2>
          <p>Formulir pengisian data kasus stunting per RT oleh kader posyandu.</p>
        </div>

        <form onSubmit={handleSubmit} className="input-form">
          {/* Pilih RT */}
          <div className="form-group">
            <label htmlFor="rtNumber">Nomor RT</label>
            <select
              id="rtNumber"
              name="rtNumber"
              value={formData.rtNumber}
              onChange={handleChange}
              required
            >
              <option value="">-- Pilih RT --</option>
              {rtNumbers.map((rt) => (
                <option key={rt} value={rt}>
                  RT {rt}
                </option>
              ))}
            </select>
          </div>

          {/* Jumlah Kasus */}
          <div className="form-group">
            <label htmlFor="stuntingCount">Jumlah Kasus Stunting</label>
            <input
              type="number"
              id="stuntingCount"
              name="stuntingCount"
              min="0"
              max="100"
              value={formData.stuntingCount}
              onChange={handleChange}
              placeholder="0"
              required
            />
          </div>

          {/* Periode */}
          <div className="form-group">
            <label htmlFor="period">Periode</label>
            <input
              type="month"
              id="period"
              name="period"
              value={formData.period}
              onChange={handleChange}
              required
            />
          </div>

          {/* Catatan */}
          <div className="form-group">
            <label htmlFor="notes">Catatan (opsional)</label>
            <textarea
              id="notes"
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              placeholder="Tambahkan catatan jika perlu..."
              rows={3}
            />
          </div>

          {/* Status message */}
          {status && (
            <div className={`form-status ${status.type}`}>
              {status.message}
            </div>
          )}

          {/* Submit button */}
          <button type="submit" className="btn-submit" disabled={isSubmitting}>
            {isSubmitting ? "Menyimpan..." : "Simpan Data"}
          </button>
        </form>
      </div>

      {/* Info panel */}
      <div className="input-info">
        <h3>Panduan Pengisian</h3>
        <div className="info-items">
          <div className="info-item">
            <span className="info-dot green"></span>
            <span><strong>0 kasus</strong> = Hijau (tidak ada stunting)</span>
          </div>
          <div className="info-item">
            <span className="info-dot yellow"></span>
            <span><strong>1 - 2 kasus</strong> = Kuning (waspada)</span>
          </div>
          <div className="info-item">
            <span className="info-dot red"></span>
            <span><strong>3+ kasus</strong> = Merah (perlu penanganan)</span>
          </div>
        </div>
        <p className="info-note">
          Data yang disimpan akan otomatis muncul di halaman peta.
          Pastikan data sesuai dengan hasil pengukuran posyandu terbaru.
        </p>
      </div>
    </div>
  );
}
