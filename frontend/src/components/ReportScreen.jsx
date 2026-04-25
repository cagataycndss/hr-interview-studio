import { useState, useEffect } from 'react';
import { FileSearch, RotateCcw } from 'lucide-react';

const ReportScreen = ({ config, messages, onRestart }) => {
  const [report, setReport] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchReport = async () => {
      try {
        const response = await fetch('http://localhost:3001/api/evaluate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            position: config.position,
            level: config.level,
            cv: config.cv,
            messages,
          }),
        });

        if (!response.ok) {
          const errData = await response.json().catch(() => ({}));
          throw new Error(errData.error || 'Rapor alınamadı');
        }
        
        const data = await response.json();
        setReport(data.report);
      } catch (error) {
        console.error(error);
        setReport(error.message || "Üzgünüm, rapor oluşturulurken bir hata meydana geldi. Lütfen tekrar deneyin.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchReport();
  }, [config, messages]);

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4">
      <div className="max-w-4xl mx-auto">
        <header className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-800">Mülakat Değerlendirmesi</h1>
            <p className="text-slate-500">Pozisyon: {config.position} ({config.level})</p>
          </div>
          <button
            onClick={onRestart}
            className="flex items-center px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-lg transition-colors"
          >
            <RotateCcw className="w-4 h-4 mr-2" /> Yeni Mülakat
          </button>
        </header>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center p-20 bg-white rounded-2xl shadow-sm border border-slate-200">
            <FileSearch className="w-16 h-16 text-blue-500 animate-pulse mb-6" />
            <h2 className="text-2xl font-semibold text-slate-700">Performansınız analiz ediliyor...</h2>
            <p className="text-slate-500 mt-2 text-center max-w-md">Yapay zekamız yanıtlarınıza dayanarak dil bilgisini, teknik doğruluğu ve profesyonel üslubu inceliyor.</p>
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
            <div className="prose prose-slate max-w-none whitespace-pre-wrap text-slate-800">
              {report || "Değerlendirme yapılamadı veya model boş yanıt döndürdü."}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReportScreen;
