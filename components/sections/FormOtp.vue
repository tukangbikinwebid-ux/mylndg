<script setup lang="ts">
import { ref, onMounted } from "vue";

const otp = ref(["", "", "", "", "", ""]);
const isLoading = ref(false);
const errors = ref<{ otp?: string }>({});
const isResending = ref(false);

// Ambil token dari cookie
const getCookie = (name: string): string | null => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(";").shift() ?? null;
  return null;
};

// Kirim ulang OTP
const resendOtp = async () => {
  const token = getCookie("token");
  if (!token) {
    alert("Token tidak ditemukan. Silakan login ulang.");
    window.location.href = "/sign-in";
    return;
  }

  isResending.value = true;
  try {
    const response = await fetch(
      "https://cms.mysolutionlending.com/api/v1/resend-register-otp",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) throw new Error("Gagal mengirim ulang OTP");

    alert("Kode OTP berhasil dikirim ulang.");
  } catch (error) {
    console.error(error);
    alert("Terjadi kesalahan saat mengirim ulang OTP.");
  } finally {
    isResending.value = false;
  }
};

// Submit Form
const submitForm = async (e: Event) => {
  e.preventDefault();
  const otpCode = otp.value.join("");

  if (otpCode.length < 6) {
    errors.value.otp = "Sila masukkan kod 6-digit yang lengkap.";
    return;
  }

  errors.value.otp = "";
  isLoading.value = true;

  const token = getCookie("token");
  if (!token) {
    alert("Token tidak ditemui. Sila log masuk semula.");
    window.location.href = "/sign-in";
    return;
  }

  try {
    const response = await fetch(
      "https://cms.mysolutionlending.com/api/v1/validate-register-otp",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ otp: otpCode }),
      }
    );

    if (!response.ok) {
      const errorResponse = await response.json();
      throw new Error(errorResponse.message || "Gagal verifikasi OTP");
    }

    alert("OTP berjaya disahkan!");
    window.location.href = "/";
  } catch (error: any) {
    console.error("Error OTP:", error);
    alert(error.message || "Kod OTP tidak sah atau telah tamat tempoh.");
  } finally {
    isLoading.value = false;
  }
};

// Handle input OTP
const handleInput = (e: Event, index: number) => {
  const input = e.target as HTMLInputElement;
  const value = input.value.replace(/\D/g, ""); 

  otp.value[index] = value;

  if (value && index < otp.value.length - 1) {
    const nextInput = document.getElementById(`otp-${index + 1}`);
    nextInput?.focus();
  }
};

// Handle backspace
const handleBackspace = (e: KeyboardEvent, index: number) => {
  const input = e.target as HTMLInputElement;
  if (e.key === "Backspace" && !input.value && index > 0) {
    const prevInput = document.getElementById(`otp-${index - 1}`);
    prevInput?.focus();
  }
};
</script>

<template>
  <section
    class="relative flex items-center justify-center min-h-screen bg-[#0A052E] px-4 overflow-hidden"
  >
    <div class="absolute top-[-10%] left-[-10%] w-72 h-72 bg-blue-600/20 blur-[120px] rounded-full"></div>
    <div class="absolute bottom-[-10%] right-[-10%] w-72 h-72 bg-indigo-600/20 blur-[120px] rounded-full"></div>

    <div class="relative w-full max-w-md z-10">
      <div 
        class="bg-white/[0.03] backdrop-blur-2xl border border-white/10 shadow-[0_25px_50px_-12px_rgba(0,0,0,0.5)] rounded-[2.5rem] p-8 md:p-10"
      >
        <div class="text-center">
          <div class="mb-8 inline-block p-4 bg-white/5 rounded-2xl border border-white/10 shadow-xl">
            <img
              src="/logo-flexyduit.png"
              alt="My Solution Lending"
              class="mx-auto h-12 w-auto brightness-110"
            />
          </div>

          <h2 class="text-3xl font-bold text-white tracking-tight mb-2">
            Sahkan Kod OTP
          </h2>
          <p class="text-slate-400 text-sm font-light mb-10">
            Kod 6-digit telah dihantar ke peranti anda. Sila masukkan kod di bawah.
          </p>

          <form @submit="submitForm" class="space-y-8">
            <div class="flex justify-between gap-2 md:gap-3">
              <input
                v-for="(digit, index) in otp"
                :key="index"
                :id="`otp-${index}`"
                v-model="otp[index]"
                maxlength="1"
                type="number"
                @input="handleInput($event, index)"
                @keydown="handleBackspace($event, index)"
                class="w-full h-14 md:h-16 text-center bg-white/5 border border-white/10 rounded-xl text-white text-2xl font-bold focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 focus:bg-white/10 outline-none transition-all appearance-none"
              />
            </div>
            
            <p v-if="errors.otp" class="text-red-400 text-xs mt-2 text-center animate-pulse">
              {{ errors.otp }}
            </p>

            <button
              type="submit"
              :disabled="isLoading"
              class="group relative w-full py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl font-bold text-lg transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden shadow-[0_10px_30px_rgba(37,99,235,0.3)] mt-6"
            >
              <div class="absolute inset-0 w-1/2 h-full bg-white/10 skew-x-[-25deg] -translate-x-full group-hover:translate-x-[250%] transition-transform duration-700"></div>
              <span class="relative flex justify-center items-center">
                <span
                  v-if="isLoading"
                  class="animate-spin h-5 w-5 border-2 border-white/30 border-t-white rounded-full mr-3"
                ></span>
                {{ isLoading ? "Mengesahkan..." : "Sahkan OTP" }}
              </span>
            </button>
          </form>

          <div class="mt-10 pt-6 border-t border-white/5 flex flex-col items-center gap-4">
            <p class="text-slate-500 text-sm">Tidak menerima kod?</p>
            <button
              @click="resendOtp"
              :disabled="isResending"
              class="flex items-center gap-2 text-sm font-bold text-blue-400 hover:text-blue-300 transition-colors focus:outline-none uppercase tracking-widest"
            >
              <span
                v-if="isResending"
                class="animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full"
              ></span>
              Hantar Semula Kod
            </button>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
/* Menghilangkan panah spinner pada input number */
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

input[type=number] {
  -moz-appearance: textfield;
}

/* Animasi Entrance */
.relative {
  animation: slideUpFade 0.8s cubic-bezier(0.22, 1, 0.36, 1) both;
}

@keyframes slideUpFade {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>