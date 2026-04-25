# HR Interview Studio - Gereksinim Analizi (MVP)

## 1. Proje Özeti
**HR Interview Studio**, adayların iş mülakatlarına hazırlanmalarını sağlayan, yerel bir yapay zeka (LM Studio) ile çalışan web tabanlı bir simülasyon platformudur. Sistem, adaylara gerçekçi mülakat soruları yöneltir ve mülakat sonunda performanslarına dair yazılı analiz sunar.

---

## 2. Kullanıcı Rolleri
* **Aday (Kullanıcı):** Mülakat simülasyonunu başlatan, soruları yanıtlayan ve değerlendirme raporunu alan ana kullanıcı.

---

## 3. Sistem Mimarisi (Klasik Yaklaşım)
* **Frontend:** React.js (Vite) + Tailwind CSS
* **Backend:** Node.js + Express.js
* **LLM Engine:** LM Studio (Localhost:1234 üzerinden OpenAI uyumlu API)
* **Platform:** Web (Localhost)

---

## 4. Fonksiyonel Gereksinimler

### 4.1. Yapılandırma ve Giriş Modülü
* **Pozisyon Tanımlama:** Kullanıcı, mülakat yapılacak pozisyonu (örn. Backend Developer, Project Manager) metin olarak girebilmelidir.
* **Deneyim Seviyesi Seçimi:** Kullanıcı; Junior, Mid-Level veya Senior seçeneklerinden birini belirleyebilmelidir.
* **CV Entegrasyonu:** Kullanıcı, mülakatın kişiselleştirilmesi için CV içeriğini düz metin olarak sisteme yapıştırabilmelidir.
* **Mülakat Başlatma:** Sistem, girilen verilere göre uygun bir "System Prompt" oluşturarak mülakatı tetiklemelidir.

### 4.2. Mülakat (Sohbet) Modülü
* **Dinamik Soru Üretimi:** Yapay zeka, adayın verdiği cevaplara göre derinleştirici ve takip edici (follow-up) sorular sormalıdır.
* **Gerçek Zamanlı Yazışma:** Kullanıcı ve yapay zeka arasında metin tabanlı bir sohbet akışı olmalıdır.
* **Akış Kontrolü:** Kullanıcı mülakatı istediği an sonlandırabilmeli veya "Değerlendir" komutunu verebilmelidir.

### 4.3. Değerlendirme ve Analiz Modülü
* **Performans Raporu:** Mülakat bittiğinde sistem; dil bilgisi, ifade netliği, profesyonel üslup ve teknik tutarlılık üzerinden bir analiz üretmelidir.
* **Geri Bildirim:** Adayın güçlü olduğu noktalar ve geliştirmesi gereken alanlar raporlanmalıdır.

---

## 5. Fonksiyonel Olmayan Gereksinimler

### 5.1. Performans ve Deneyim
* **Streaming (Akış):** LM Studio'dan gelen yanıtlar, kullanıcıya bekletilmeden (kelime kelime) akış halinde gösterilmelidir.
* **Otomatik Kaydırma:** Yeni mesajlar geldiğinde sohbet penceresi otomatik olarak aşağı kaydırılmalıdır.
* **Yanıtlama Gecikmesi:** Yerel modelin yanıt süresi boyunca kullanıcıya bir "yazıyor..." göstergesi sunulmalıdır.

### 5.2. Gizlilik ve Güvenlik
* **Veri Yerelliği:** Tüm veriler localhost üzerinde kalmalı; CV veya mülakat içeriği harici bir bulut servisine (OpenAI, Anthropic vb.) gönderilmemelidir.
* **Senaryo Bağlılığı:** Yapay zekanın mülakat dışı konulara (kod yazdırma, genel sohbet vb.) sapması "System Instruction" ile engellenmelidir.

### 5.3. Teknik Kısıtlar
* **Durum Yönetimi:** Sayfa yenilendiğinde aktif mülakatın kaybolmaması için veriler tarayıcı belleğinde (Local/Session Storage) tutulmalıdır.
* **Bağlantı Kontrolü:** Backend, LM Studio sunucusunun (port 1234) ayakta olup olmadığını kontrol etmelidir.

---

## 6. Proje Yol Haritası (MVP)
1.  **Aşama:** Node.js backend kurulumu ve LM Studio API bağlantısının test edilmesi.
2.  **Aşama:** React ile temel sohbet arayüzünün (UI) oluşturulması.
3.  **Aşama:** Backend ve Frontend arasında Streaming (akış) yapısının kurulması.
4.  **Aşama:** Değerlendirme promptlarının optimize edilmesi ve rapor ekranının tasarımı.