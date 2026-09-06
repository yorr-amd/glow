import { useState, useEffect } from 'react';
import { Sparkles, RotateCcw } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';

const quotes = {
  pagi: [
    { text: "Bangun pagi, cuci muka, kulit langsung segar & siap beraktivitas! ☀️", text_en: "Wake up, wash face, fresh skin ready for the day ahead! ☀️", emoji: "☀️" },
    { text: "Sunscreen pagi itu pelindung nomor 1 dari penuaan dini & flek 🛡️", text_en: "Morning sunscreen is your #1 defense against premature aging & spots 🛡️", emoji: "🛡️" },
    { text: "Jangan skip moisturizer pagi biar makeup / liptint nempel sempurna ✨", text_en: "Never skip morning moisturizer for seamless makeup & lip tint ✨", emoji: "🧴" },
    { text: "Dua ruas jari sunscreen sebelum beraktivitas, jangan pelit ya! ✌️", text_en: "Two fingers of sunscreen before heading out — never skimp on SPF! ✌️", emoji: "✌️" },
    { text: "Kulit glowing di pagi hari bikin mood seharian auto bagus! 🌸", text_en: "Glowing skin in the morning instantly boosts your daily mood! 🌸", emoji: "🌸" },
    { text: "Minum segelas air putih begitu bangun tidur = detoks alami 💧", text_en: "A glass of water right after waking up is nature's detox 💧", emoji: "💧" },
  ],
  siang: [
    { text: "Matahari lagi terik-teriknya, waktu yang tepat buat reapply sunscreen! 🌤️", text_en: "Sun is at its peak, the perfect time to reapply sunscreen! 🌤️", emoji: "🌤️" },
    { text: "Semprot face mist biar wajah nggak kusam & ngantuk pas beraktivitas 💦", text_en: "Spritz face mist to refresh your skin and wake up midday 💦", emoji: "💦" },
    { text: "Touch up liptint sehabis makan siang biar bibir tetap segar & manis 💋", text_en: "Touch up lip tint after lunch to keep lips fresh and lively 💋", emoji: "💋" },
    { text: "Ruangan ber-AC bikin kulit kering, jangan lupa oles hand cream / body lotion ❄️", text_en: "AC rooms dry out skin — remember your hand cream and lotion ❄️", emoji: "❄️" },
    { text: "Tetap minum air putih di siang hari biar kulit tetap terhidrasi dari dalam 🥤", text_en: "Keep sipping water all afternoon for inner hydration glow 🥤", emoji: "🥤" },
  ],
  sore: [
    { text: "Muka tetep glowing walau aktivitas seharian ✨", text_en: "Skin stays glowing even after a full productive day ✨", emoji: "✨" },
    { text: "Skincare sore = investasi buat nongkrong nanti 🏍️", text_en: "Evening skincare = the best prep before hanging out 🏍️", emoji: "🏍️" },
    { text: "SPF 20 di Vaseline Soft & Glow, jaga kulit dari UV sore! ☀️", text_en: "SPF in Vaseline Soft & Glow shields you from late afternoon UV! ☀️", emoji: "☀️" },
    { text: "Cuci muka dulu baru santai, deal? 🤝", text_en: "Cleanse your face first, then relax. Deal? 🤝", emoji: "🛁" },
    { text: "Moisturizer adem biar wajah glowing pas ketemu temen-temen 😎", text_en: "Soothing moisturizer keeps your face glowing when meeting friends 😎", emoji: "🧴" },
    { text: "Glowing skin is the best accessory ✨", text_en: "Glowing skin is the best accessory ✨", emoji: "✨" },
  ],
  malam: [
    { text: "Double cleansing dulu baru rebahan! 🛌", text_en: "Double cleanse first, then dive into bed! 🛌", emoji: "🛌" },
    { text: "Micellar water angkat debu jalanan, bersih tuntas sampai pori 🫧", text_en: "Micellar water sweeps away city dust deep down into pores 🫧", emoji: "🫧" },
    { text: "Toner Merah (Rabu & Sabtu) buat eksfoliasi lipatan ✨", text_en: "Red Toner (Wed & Sat) for gentle body fold exfoliation ✨", emoji: "🧪" },
    { text: "Lip Mask oles tebal, besok bibir lembut kenyal 💋", text_en: "Generous lip mask tonight = soft, supple lips tomorrow 💋", emoji: "💋" },
    { text: "Vaseline Soft & Glow = kunci kelembapan badan sebelum tidur 🔑", text_en: "Soft & Glow body lotion = lock in nighttime hydration 🔑", emoji: "🔑" },
    { text: "Skincare malam = self love terbaik setelah seharian lelah 💖", text_en: "Nighttime skincare is the purest form of evening self-care 💖", emoji: "💖" },
    { text: "The Originote Gel malam biar besok bangun wajah plump 🌙", text_en: "Originote Gel overnight so you wake up to plump, bouncy skin 🌙", emoji: "🌙" },
  ],
  general: [
    { text: "Konsisten skincare = investasi masa depan 💰", text_en: "Consistent skincare is an investment in your future self 💰", emoji: "💰" },
    { text: "Air putih 2L sehari = glow gratis dari dalam! 💧", text_en: "2L of water daily = free natural glow from the inside out! 💧", emoji: "💧" },
    { text: "Sunscreen indoor tetep wajib, sinar UV tembus jendela! 🏠", text_en: "Indoor sunscreen is essential — UV rays pass through windows! 🏠", emoji: "🏠" },
    { text: "Tidur cukup = regenerasi sel kulit maksimal 😴", text_en: "Quality sleep = maximum cellular skin regeneration 😴", emoji: "😴" },
    { text: "Kulit sehat berawal dari konsistensi kecil setiap hari 🌸", text_en: "Healthy skin begins with small, loving daily consistency 🌸", emoji: "🌸" },
  ]
};

export default function DailyQuote({ mode }) {
  const { isEn } = useLanguage();
  const [quote, setQuote] = useState(null);
  const [showNew, setShowNew] = useState(false);

  useEffect(() => {
    const modeQuotes = quotes[mode] || quotes.sore;
    const allQuotes = [...modeQuotes, ...quotes.general];
    const randomQuote = allQuotes[Math.floor(Math.random() * allQuotes.length)];
    setQuote(randomQuote);
  }, [mode]);

  const handleNewQuote = () => {
    const modeQuotes = quotes[mode] || quotes.sore;
    const allQuotes = [...modeQuotes, ...quotes.general];
    const randomQuote = allQuotes[Math.floor(Math.random() * allQuotes.length)];
    setQuote(randomQuote);
    setShowNew(true);
    setTimeout(() => setShowNew(false), 500);
  };

  if (!quote) return null;

  const quoteText = isEn && quote.text_en ? quote.text_en : quote.text;

  return (
    <div className={`relative bg-white/70 backdrop-blur-md border border-white/40 rounded-2xl p-4 shadow-sm transition-all duration-500 hover:shadow-md animate-slide-up ${showNew ? 'animate-bounce-in' : ''}`}>
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl flex-shrink-0 bg-gradient-to-br from-blush-300 to-rose-300">
          <Sparkles size={20} className="text-white" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-bold tracking-wider uppercase px-2 py-0.5 rounded-full bg-blush-100 text-blush-600 border border-blush-200">
              {isEn ? 'Daily Glow Tip' : 'Tips Harian Glow'}
            </span>
            <button
              onClick={handleNewQuote}
              className="ml-auto w-7 h-7 rounded-xl bg-slate-100/80 hover:bg-slate-200 flex items-center justify-center transition-colors cursor-pointer"
              title={isEn ? 'Get another tip' : 'Ganti tips baru'}
            >
              <RotateCcw size={14} className="text-slate-500" />
            </button>
          </div>
          <p className="text-sm text-[#3D1F2A] leading-relaxed">{quote.emoji} {quoteText}</p>
        </div>
      </div>
    </div>
  );
}