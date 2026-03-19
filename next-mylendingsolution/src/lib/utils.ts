export const isValidPhone = (phone: string) =>
  /^01[0-46-9][0-9]{7,8}$/.test(phone);

export const formatPhoneForApi = (value: string) => {
  if (value.startsWith("0")) return "60" + value.slice(1);
  return value;
};

export const formatIC = (value: string) => {
  const digits = value.replace(/\D/g, "").slice(0, 12);
  if (digits.length <= 6) return digits;
  if (digits.length <= 8) return `${digits.slice(0, 6)}-${digits.slice(6)}`;
  return `${digits.slice(0, 6)}-${digits.slice(6, 8)}-${digits.slice(8)}`;
};

export const formatCurrency = (amount: number) => {
  return `RM ${amount.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`;
};

export const compressImage = (file: File, maxSizeMB = 10): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const maxDim = 2048;

        let { width, height } = img;
        if (width > maxDim || height > maxDim) {
          const ratio = Math.min(maxDim / width, maxDim / height);
          width *= ratio;
          height *= ratio;
        }

        canvas.width = width;
        canvas.height = height;
        canvas.getContext("2d")!.drawImage(img, 0, 0, width, height);

        let quality = 0.8;
        let result = canvas.toDataURL("image/jpeg", quality);

        while (result.length > maxSizeMB * 1024 * 1024 * 1.37 && quality > 0.1) {
          quality -= 0.1;
          result = canvas.toDataURL("image/jpeg", quality);
        }

        resolve(result);
      };
      img.onerror = reject;
      img.src = e.target!.result as string;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

export const getInterestRate = (tenor: number): number => {
  if (tenor <= 12) return 0.8;
  if (tenor <= 24) return 0.6;
  if (tenor <= 36) return 0.5;
  if (tenor <= 48) return 0.4;
  if (tenor <= 60) return 0.35;
  return 0.3;
};

export const loanAmounts = [
  5000, 6000, 8000, 10000, 15000, 20000, 25000, 30000, 35000, 40000, 45000,
  50000, 60000, 70000, 80000, 90000, 100000, 150000, 200000,
];

export const tenorOptions = [6, 12, 24, 36, 48, 60, 72];

export const loanStatusMap: Record<number, { label: string; color: string }> = {
  [-1]: { label: "Ditolak", color: "bg-red-500/20 text-red-400" },
  0: { label: "Dalam Proses", color: "bg-yellow-500/20 text-yellow-400" },
  1: { label: "Diluluskan", color: "bg-green-500/20 text-green-400" },
  2: { label: "Ditolak", color: "bg-red-500/20 text-red-400" },
};
