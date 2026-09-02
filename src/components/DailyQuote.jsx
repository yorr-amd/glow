import { useState, useEffect } from 'react';
import { Sparkles, MessageCircle, RotateCcw } from 'lucide-react';

const quotes = {
  pagi: [
    { text: "Bangun pagi, cuci muka, kulit langsung segar & siap beraktivitas! ☀️", emoji: "☀️" },
    { text: "Sunscreen pagi itu pelindung nomor 1 dari penuaan dini & flek 🛡️", emoji: "🛡️" },
    { text: "Jangan skip moisturizer pagi biar makeup / liptint nempel sempurna ✨", emoji: "🧴" },
    { text: "Dua ruas jari sunscreen sebelum berangkat kuliah, jangan pelit ya! ✌️", emoji: "✌️" },
    { text: "Kulit glowing di pagi hari bikin mood seharian auto bagus! 🌸", emoji: "🌸" },
    { text: "Minum segelas air putih hangat begitu bangun tidur = detoks alami 💧", emoji: "💧" },
  ],
  siang: [
    { text: "Matahari lagi terik-teriknya, waktu yang tepat buat reapply sunscreen! 🌤️", emoji: "🌤️" },
    { text: "Semprot face mist biar wajah nggak kusam & ngantuk pas jam kuliah 💦", emoji: "💦" },
    { text: "Touch up liptint sehabis makan siang biar bibir tetap segar & manis 💋", emoji: "💋" },
    { text: "Ruangan ber-AC bikin kulit kering, jangan lupa oles hand cream / body lotion ❄️", emoji: "❄️" },
    { text: "Tetap minum air putih di siang hari biar kulit tetap terhidrasi dari dalam 🥤", emoji: "🥤" },
  ],
  sore: [
    { text: "Muka tetep glowing walau koding & kuliah seharian 💻✨", emoji: "💻" },
    { text: "Skincare sore = investasi buat nongkrong nanti 🏍️", emoji: "🏍️" },
    { text: "SPF 20 di Vaseline Soft & Glow, jaga kulit dari UV sore! ☀️", emoji: "☀️" },
    { text: "Cuci muka dulu baru santai, deal? 🤝", emoji: "🛁" },
    { text: "Moisturizer adem biar wajah glowing pas ketemu temen-temen 😎", emoji: "🧴" },
    { text: "Pre-nongkrong routine: wajib biar makin percaya diri! 💃", emoji: "💃" },
    { text: "Lip serum biar bibir nggak kusam pas foto bareng 📸", emoji: "📸" },
    { text: "Glowing skin is the best accessory ✨", emoji: "✨" },
  ],
  malam: [
    { text: "Double cleansing dulu baru rebahan! 🛌", emoji: "🛌" },
    { text: "Micellar water angkat debu jalanan, bersih tuntas sampai pori 🫧", emoji: "🫧" },
    { text: "Toner Merah (Rabu & Sabtu) buat eksfoliasi lipatan ✨", emoji: "🧪" },
    { text: "Lip Mask Jeruk oles tebal, besok bibir lembut kenyal 🍊", emoji: "🍊" },
    { text: "Vaseline Soft & Glow = kunci kelembapan badan sebelum tidur 🔑", emoji: "🔑" },
    { text: "Skincare malam = self love terbaik setelah seharian lelah 💖", emoji: "💖" },
    { text: "The Originote Gel malam biar besok bangun wajah plump 🌙", emoji: "🌙" },
    { text: "Rebahan sambil kulit ternutrisi? Best feeling ever! 😴", emoji: "😴" },
  ],
  general: [
    { text: "Konsisten skincare = investasi masa depan 💰", emoji: "💰" },
    { text: "Air putih 2L sehari = glow gratis dari dalam! 💧", emoji: "💧" },
    { text: "Jangan lupa ganti sarung bantal berkala untuk wajah bebas jerawat 🛏️", emoji: "🛏️" },
    { text: "Sunscreen indoor tetep wajib, sinar UV tembus jendela! 🏠", emoji: "🏠" },
    { text: "Hindari sering sentuh wajah dengan tangan kotor ya 🙅", emoji: "🙅" },
    { text: "Tidur cukup = regenerasi sel kulit maksimal 😴", emoji: "😴" },
    { text: "Kulit sehat berawal dari konsistensi kecil setiap hari 🌸", emoji: "🌸" },
  ]
};

export default function DailyQuote({ mode }) {
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

  return (
    <div className={`relative bg-white/70 backdrop-blur-md border border-white/40 rounded-2xl p-4 shadow-sm transition-all duration-500 hover:shadow-md animate-slide-up ${showNew ? 'animate-bounce-in' : ''}`}>
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl flex-shrink-0 bg-gradient-to-br from-blush-300 to-rose-300">
          <Sparkles size={20} className="text-white" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-bold tracking-wider uppercase px-2 py-0.5 rounded-full bg-blush-100 text-blush-600 border border-blush-200">
              Daily Glow Tip
            </span>
            <button
              onClick={handleNewQuote}
              className="ml-auto w-7 h-7 rounded-xl bg-slate-100/80 hover:bg-slate-200 flex items-center justify-center transition-colors"
              title="Ganti tips baru"
            >
              <RotateCcw size={14} className="text-slate-500" />
            </button>
          </div>
          <p className="text-sm text-[#3D1F2A] leading-relaxed">{quote.emoji} {quote.text}</p>
        </div>
      </div>
    </div>
  );
}