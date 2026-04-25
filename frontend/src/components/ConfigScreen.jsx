import { useState } from 'react';
import { User, Briefcase, FileText } from 'lucide-react';

const ConfigScreen = ({ onStart }) => {
  const [position, setPosition] = useState('');
  const [level, setLevel] = useState('Mid-Level (Orta Düzey)');
  const [cv, setCv] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (position.trim() && cv.trim()) {
      onStart({ position, level, cv });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-200 p-4">
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-xl p-8 border border-slate-100">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-extrabold text-slate-900 mb-2">İK Mülakat Stüdyosu</h1>
          <p className="text-slate-500">Yapay zeka destekli mülakat deneyiminizi yapılandırın.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="flex items-center text-sm font-semibold text-slate-700">
              <Briefcase className="w-4 h-4 mr-2" /> Pozisyon Adı
            </label>
            <input
              type="text"
              value={position}
              onChange={(e) => setPosition(e.target.value)}
              placeholder="örn. Backend Developer, Proje Yöneticisi"
              className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="flex items-center text-sm font-semibold text-slate-700">
              <User className="w-4 h-4 mr-2" /> Deneyim Seviyesi
            </label>
            <select
              value={level}
              onChange={(e) => setLevel(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
            >
              <option value="Junior (Başlangıç)">Junior (Başlangıç)</option>
              <option value="Mid-Level (Orta Düzey)">Mid-Level (Orta Düzey)</option>
              <option value="Senior (Kıdemli)">Senior (Kıdemli)</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="flex items-center text-sm font-semibold text-slate-700">
              <FileText className="w-4 h-4 mr-2" /> Özgeçmiş (CV)
            </label>
            <textarea
              value={cv}
              onChange={(e) => setCv(e.target.value)}
              placeholder="Özgeçmiş metninizi buraya yapıştırın..."
              rows={6}
              className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              required
            ></textarea>
          </div>

          <button
            type="submit"
            className="w-full py-4 px-6 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg transition-colors duration-200 shadow-md flex justify-center items-center"
          >
            Mülakatı Başlat
          </button>
        </form>
      </div>
    </div>
  );
};

export default ConfigScreen;
