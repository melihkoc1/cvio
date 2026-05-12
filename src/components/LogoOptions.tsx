/**
 * Logo seçenekleri — birini beğenirseniz Navbar'a entegre edelim.
 * Tarayıcıda görmek için geçici olarak LandingPage'e ekleyebilirsiniz.
 */

export function LogoA({ size = 40 }: { size?: number }) {
  // Minimal document + checkmark
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="40" height="40" rx="10" fill="#1e293b"/>
      <rect x="10" y="8" width="16" height="20" rx="2" fill="white" fillOpacity="0.15" stroke="white" strokeOpacity="0.3" strokeWidth="1"/>
      <rect x="13" y="13" width="10" height="1.5" rx="0.75" fill="white" fillOpacity="0.5"/>
      <rect x="13" y="16.5" width="7" height="1.5" rx="0.75" fill="white" fillOpacity="0.5"/>
      <rect x="13" y="20" width="8" height="1.5" rx="0.75" fill="white" fillOpacity="0.5"/>
      <circle cx="27" cy="27" r="7" fill="#3b82f6"/>
      <path d="M23.5 27L26 29.5L30.5 24.5" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

export function LogoB({ size = 40 }: { size?: number }) {
  // Bold "CV" monogram with gradient
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="40" height="40" rx="10" fill="url(#logoB_grad)"/>
      <defs>
        <linearGradient id="logoB_grad" x1="0" y1="0" x2="40" y2="40">
          <stop offset="0%" stopColor="#2563eb"/>
          <stop offset="100%" stopColor="#7c3aed"/>
        </linearGradient>
      </defs>
      <text x="5" y="27" fontFamily="'Inter', Arial, sans-serif" fontWeight="900" fontSize="17" fill="white" letterSpacing="-0.5">CV</text>
      <rect x="5" y="30" width="30" height="2" rx="1" fill="white" fillOpacity="0.3"/>
      <text x="5" y="37" fontFamily="'Inter', Arial, sans-serif" fontWeight="700" fontSize="7" fill="white" fillOpacity="0.7" letterSpacing="2">IO</text>
    </svg>
  );
}

export function LogoC({ size = 40 }: { size?: number }) {
  // Abstract "C" shape — clean and modern
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="40" height="40" rx="12" fill="#0f172a"/>
      <path d="M26 13C23.8 11.7 21.1 11 18.5 11C12.7 11 8 15.5 8 21C8 26.5 12.7 31 18.5 31C21.1 31 23.8 30.3 26 29" stroke="#3b82f6" strokeWidth="3" strokeLinecap="round"/>
      <path d="M26 13C23.8 11.7 21.1 11 18.5 11C12.7 11 8 15.5 8 21C8 26.5 12.7 31 18.5 31C21.1 31 23.8 30.3 26 29" stroke="url(#logoC_grad)" strokeWidth="3" strokeLinecap="round"/>
      <defs>
        <linearGradient id="logoC_grad" x1="8" y1="11" x2="26" y2="31">
          <stop offset="0%" stopColor="#3b82f6"/>
          <stop offset="100%" stopColor="#22d3ee"/>
        </linearGradient>
      </defs>
      <circle cx="29" cy="21" r="4" fill="#3b82f6"/>
      <circle cx="29" cy="21" r="2" fill="#1e3a8a"/>
    </svg>
  );
}

export function LogoD({ size = 40 }: { size?: number }) {
  // Document with spark — AI feel
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="40" height="40" rx="10" fill="#0ea5e9"/>
      <rect x="9" y="7" width="17" height="22" rx="2.5" fill="white"/>
      <rect x="12" y="12" width="11" height="1.5" rx="0.75" fill="#cbd5e1"/>
      <rect x="12" y="15.5" width="8" height="1.5" rx="0.75" fill="#cbd5e1"/>
      <rect x="12" y="19" width="9" height="1.5" rx="0.75" fill="#cbd5e1"/>
      <rect x="12" y="22.5" width="6" height="1.5" rx="0.75" fill="#cbd5e1"/>
      <path d="M28 18L29.5 22L33 23L29.5 24L28 28L26.5 24L23 23L26.5 22L28 18Z" fill="white"/>
    </svg>
  );
}

export function LogoE({ size = 40 }: { size?: number }) {
  // Minimalist bracket + dot
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="40" height="40" rx="10" fill="#18181b"/>
      <path d="M14 10 L10 20 L14 30" stroke="#3b82f6" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M26 10 L30 20 L26 30" stroke="#22d3ee" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
      <circle cx="20" cy="20" r="2.5" fill="white"/>
    </svg>
  );
}

// Preview component — geçici test için
export function LogoPreview() {
  return (
    <div style={{ padding: 40, background: '#f8fafc', display: 'flex', gap: 32, flexWrap: 'wrap', alignItems: 'center' }}>
      {[LogoA, LogoB, LogoC, LogoD, LogoE].map((Logo, i) => (
        <div key={i} style={{ textAlign: 'center' }}>
          <Logo size={56} />
          <div style={{ marginTop: 8, fontSize: 12, color: '#64748b', fontWeight: 600 }}>Opsiyon {String.fromCharCode(65 + i)}</div>
        </div>
      ))}
    </div>
  );
}
