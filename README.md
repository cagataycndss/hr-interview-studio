# 🎙️ HR Interview Studio — Mülakat Agent'ı

> Rol bazlı akıllı mülakat simülasyonu ve geri bildirim sistemi

![HR Interview Studio Preview](assets/images/hr-interview-studio-image.png)

---

## 📌 Proje Özeti

**HR Interview Studio**, yapay zeka destekli bir mülakat simülasyon arayüzüdür. Kullanıcının girdiği pozisyon, deneyim seviyesi ve özgeçmiş (CV) detaylarına göre yerel bilgisayarda çalışan (LM Studio vb.) yapay zeka modelleriyle etkileşimli ve gerçek zamanlı (streaming) mülakatlar gerçekleştirir. Mülakat tamamlandığında, adayın dil bilgisi, teknik doğruluğu ve profesyonelliğine göre detaylı ve yapılandırılmış bir değerlendirme raporu sunar.

Verilerin tamamen yerel (localhost) ortamda işlenmesi sayesinde kullanıcı gizliliği korunur.

---

### 👥 Ekip Üyeleri
- Çağatay Candaş  
- Gökdeniz Erten  
- Furkan Kasalak  

---

## ✨ Özellikler

- 🎯 **Dinamik Mülakat Kurgusu** — Seçilen pozisyon (yazılım geliştirici, pazarlama vb.), deneyim seviyesi ve adayın CV'sine özel, hedefe yönelik soru üretimi.
- ⚡ **Gerçek Zamanlı Akış (SSE Streaming)** — Cevap beklerken zaman kaybettirmeyen, modelden yanıt geldikçe anında ekranda gösteren modern arayüz.
- 🔒 **Güvenli ve Yerel Bağlantı** — Tüm süreç dış bir bulut hizmeti yerine doğrudan localhost (1234 portu) üzerinden LM Studio ile yönetilir.
- 📝 **Otomatik ve Kapsamlı Geri Bildirim** — Mülakat bitiminde adayın güçlü/zayıf yönlerini, teknik tutarlılığını ve profesyonel üslubunu değerlendiren rapor ekranı.

---

## 🛠️ Kullanılan Teknolojiler

| Bileşen | Teknoloji | Kullanım Amacı |
|-----------|-----------|---------------|
| **Frontend** | React.js (Vite) + Tailwind CSS | Hızlı, modern ve dinamik mülakat arayüzünün oluşturulması |
| **Backend** | Node.js + Express.js | İsteklerin yönetimi, prompt (sistem komutları) enjeksiyonu ve streaming |
| **LLM Engine** | LM Studio (OpenAI API Formatı) | Yerel sunucu olarak çalışarak modellerin (örn. Llama 3) çalıştırılması |
| **Bağlantı** | Server-Sent Events (SSE) | Metin akışının (stream) sağlanması |

---

## 🚀 Nasıl Çalıştırılır?

Projeyi kendi bilgisayarınızda çalıştırmak için aşağıdaki adımları sırasıyla uygulayın:

### 1. LM Studio'yu Hazırlama
1. LM Studio'yu açıp dilediğiniz bir Instruction modelini (örn. `meta-llama-3.1-8b-instruct`) yükleyin.
2. Sağ menüden **Context Length** değerini (en az 8192) artırdığınızdan emin olun.
3. Local Server'ı **Port 1234** üzerinden başlatın.

### 2. Backend'i Başlatma
Projenin ana dizininde bir terminal açıp arka uç sunucusunu başlatın:
```bash
cd backend
npm install
node server.js
```
*(Sunucu 3001 portunda çalışmaya başlayacaktır.)*

### 3. Frontend'i Başlatma
Ayrı bir terminal sekmesi açıp arayüz sunucusunu çalıştırın:
```bash
cd frontend
npm install
npm run dev
```
*(Uygulama `http://localhost:5173` adresinde açılacaktır.)*

---

<p align="center"> HR Interview Studio</p>
