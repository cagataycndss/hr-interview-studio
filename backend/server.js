const express = require('express');
const cors = require('cors');
const { OpenAI } = require('openai');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const openai = new OpenAI({
    baseURL: process.env.LM_STUDIO_URL || "http://localhost:1234/v1",
    apiKey: process.env.LM_STUDIO_KEY || "lm-studio",
});

const getSystemPrompt = (position, level, cv) => {
    return `
Sen bir yazılım şirketinde teknik ve davranışsal mülakatlar yapan uzman bir İK Mülakatçısısın.
Adayın başvurduğu pozisyon: ${position}
Adayın deneyim seviyesi: ${level}
Adayın Özgeçmişi (CV):
${cv}

Hedeflerin:
1. Adayın özgeçmişine, pozisyonuna ve seviyesine uygun teknik ve davranışsal sorular sor.
2. Her seferinde sadece BİR (1) soru sor. Bir sonraki soruyu sormadan önce adayın cevap vermesini bekle.
3. Profesyonel, doğrudan ve adil ol; çok az da olsa zorlayıcı olabilirsin.
4. Yanıtlarını kısa ve mülakata odaklı tut.
5. Tüm diyalogu ve soracağın soruları tamamen TÜRKÇE olarak gerçekleştir.
Mülakat açıkça bitene kadar adayı mülakat sırasında değerlendirme.
Sadece bir sonraki soruyu sor veya adayın önceki yanıtına dayanarak kısa bir takip sorusu yönelt.

Adaya sıcak bir şekilde hoş geldin diyerek ve ilk soruyu sorarak başla.
`;
};

app.post('/api/chat', async (req, res) => {
    const { position, level, cv, messages } = req.body;
    
    // Ensure system prompt is the first message
    const systemMessage = {
        role: "system",
        content: getSystemPrompt(position, level, cv)
    };

    const conversation = [systemMessage, ...messages];

    try {
        const stream = await openai.chat.completions.create({
            model: process.env.MODEL_NAME || "meta-llama-3.1-8b-instruct",
            messages: conversation,
            stream: true,
            temperature: 0.7,
        });

        // Set headers for SSE
        res.setHeader('Content-Type', 'text/event-stream');
        res.setHeader('Cache-Control', 'no-cache');
        res.setHeader('Connection', 'keep-alive');

        for await (const chunk of stream) {
            const content = chunk.choices[0]?.delta?.content || '';
            if (content) {
                res.write(`data: ${JSON.stringify({ text: content })}\n\n`);
            }
        }
        res.write('data: [DONE]\n\n');
        res.end();

    } catch (error) {
        console.error("LM Studio Error:", error);
        if (!res.headersSent) {
            res.status(500).json({ error: "LM Studio ile iletişim kurulamadı." });
        }
    }
});

app.post('/api/evaluate', async (req, res) => {
    const { position, level, cv, messages } = req.body;

    const filteredMessages = messages.filter(m => m.role !== 'system');
    const interviewHistoryText = filteredMessages.map(m => `${m.role === 'user' ? 'Aday' : 'Mülakatçı'}: ${m.content}`).join('\n\n');

    const evaluationPrompt = `
Sen uzman bir İK Değerlendiricisisin.
Aşağıda bir adayın mülakat geçmişi bulunmaktadır. Adayın başvurduğu pozisyon: ${position} (${level}).
Adayın Özgeçmişi (CV):
${cv}

Mülakat Geçmişi:
${interviewHistoryText}

Lütfen bu mülakat geçmişini dikkatlice incele ve aday için kapsamlı bir geri bildirim raporu sun. Şunlara odaklan:
1. Dil bilgisi ve ifade netliği.
2. Profesyonel üslup.
3. Teknik tutarlılık ve doğruluk.
4. Adayın güçlü yanları.
5. Geliştirilmesi gereken alanlar.

Raporu yapılandırılmış, yapıcı ve doğrudan adaya hitaben, tamamen TÜRKÇE dilinde yaz.
`;

    const conversation = [
        { role: "user", content: evaluationPrompt }
    ];

    try {
        console.log("Evaluating interview...");
        const response = await openai.chat.completions.create({
            model: process.env.MODEL_NAME || "meta-llama-3.1-8b-instruct",
            messages: conversation,
            temperature: 0.5,
        });

        console.log("Evaluation response:", response.choices[0]?.message?.content);
        const reportContent = response.choices[0]?.message?.content || "Modelden boş yanıt döndü. Belki mülakat çok kısaydı veya model hata verdi.";
        res.json({ report: reportContent });
    } catch (error) {
        console.error("LM Studio Evaluation Error:", error);
        let errorMessage = "Değerlendirme oluşturulamadı.";
        if (error.message && error.message.toLowerCase().includes("context")) {
            errorMessage = "LM Studio bağlam sınırı (Context Size) aşıldı. Lütfen LM Studio'da sağ panelden 'Context Length' ayarını yükseltin (örn. 8192 veya 16384) ve modeli yeniden yükleyin.";
        }
        res.status(500).json({ error: errorMessage });
    }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log('Backend server running on port ' + PORT);
});
