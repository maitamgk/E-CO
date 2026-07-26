/** Bỏ các ký tự dễ đọc nhầm khi khách đọc mã qua điện thoại: I, O, 0, 1. */
const ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
const RANDOM_LEN = 5;

const randomSuffix = (): string => {
  const bytes = new Uint8Array(RANDOM_LEN);

  if (typeof crypto !== 'undefined' && typeof crypto.getRandomValues === 'function') {
    crypto.getRandomValues(bytes);
  } else {
    for (let i = 0; i < RANDOM_LEN; i += 1) {
      bytes[i] = Math.floor(Math.random() * 256);
    }
  }

  let out = '';
  for (let i = 0; i < RANDOM_LEN; i += 1) {
    out += ALPHABET[bytes[i] % ALPHABET.length];
  }
  return out;
};

/**
 * Mã đơn dạng BCO-260726-K7P2M.
 *
 * Phần ngày giúp nhân viên tra đơn nhanh, phần ngẫu nhiên khiến mã không thể
 * đoán tuần tự — mã cũ dựa trên Date.now() nên ai cũng suy ra được mã đơn khác.
 */
export const generateOrderCode = (now: Date = new Date()): string => {
  const yy = String(now.getFullYear()).slice(-2);
  const mm = String(now.getMonth() + 1).padStart(2, '0');
  const dd = String(now.getDate()).padStart(2, '0');
  return `BCO-${yy}${mm}${dd}-${randomSuffix()}`;
};
