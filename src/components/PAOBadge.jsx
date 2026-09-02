import { AlertCircle, Clock, CheckCircle } from 'lucide-react';
import { getPAOStatus, PAO_COLORS } from '../data/skincareData';

export default function PAOBadge({ pao, compact = false }) {
  if (!pao) return null;
  
  const status = getPAOStatus(pao);
  
  if (compact) {
    return (
      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold border ${status.color}`}>
        {status.remaining <= 0 ? <AlertCircle size={10} /> : status.remaining <= 2 ? <Clock size={10} /> : <CheckCircle size={10} />}
        {status.label}
      </span>
    );
  }
  
  return (
    <div className={`flex items-center gap-2 px-3 py-2 rounded-xl border ${status.color}`}>
      {status.remaining <= 0 ? (
        <AlertCircle size={18} className="text-red-500 flex-shrink-0" />
      ) : status.remaining <= 2 ? (
        <Clock size={18} className="text-amber-500 flex-shrink-0" />
      ) : (
        <CheckCircle size={18} className="text-green-500 flex-shrink-0" />
      )}
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-xs leading-tight">{status.label}</p>
        <p className="text-[10px] opacity-75">
          {status.remaining <= 0 
            ? 'Produk sudah expired! Segera ganti baru.' 
            : status.remaining <= 2 
              ? `Sisa ${status.remaining} bulan. Persiapkan stok baru!`
              : `Masih aman ${status.remaining} bulan lagi.`}
        </p>
      </div>
    </div>
  );
}