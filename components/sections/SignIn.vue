<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { getSetting } from "@/composables/utils";

// I18n Integration
const { t, setLocale } = useI18n();

interface LoginForm {
  email: string;
  password: string;
}

const settings = ref(null);
const locale = ref("my");
const showDropdown = ref(false);

const languages = [
  { code: "en", label: "English", flag: "united-kingdom.avif" },
  { code: "my", label: "Melayu", flag: "malaysia.avif" },
  { code: "cn", label: "Chinese", flag: "china.avif" },
];

onMounted(async () => {
  try {
    settings.value = await getSetting();
  } catch (error) {
    console.log(error);
  }
});

// Update style untuk background premium
const loginBackgroundStyle = computed(() => {
  return {
    // backgroundColor: "#0A052E",
    // backgroundImage: `radial-gradient(circle at 20% 30%, #1a154d 0%, transparent 50%), 
                      // radial-gradient(circle at 80% 70%, #0f0a3d 0%, transparent 50%)`,
    // backgroundSize: "cover",
  };
});

const form = ref<LoginForm>({
  email: "",
  password: "",
});

const errors = ref<Partial<LoginForm>>({});
const isLoading = ref(false);
const showPassword = ref(false);

const notification = ref<{ type: 'success' | 'error'; message: string; visible: boolean }>({ type: 'success', message: '', visible: false });

function showNotification(type: 'success' | 'error', message: string) {
  notification.value = { type, message, visible: true };
  setTimeout(() => {
    notification.value.visible = false;
  }, 3500);
}

const changeLocale = (code: string) => {
  locale.value = code;
  setLocale(code);
  showDropdown.value = false;
};

const validateForm = async (): Promise<boolean> => {
  errors.value = {};
  if (!form.value.email) errors.value.email = "Sila masukkan nombor telefon";
  if (!form.value.password) {
    errors.value.password = "Password wajib diisi";
  } else if (form.value.password.length < 6) {
    errors.value.password = "Password minimal 6 karakter";
  }
  return Object.keys(errors.value).length === 0;
};

const submitForm = async () => {
  if (await validateForm()) {
    isLoading.value = true;
    try {
      // Format email pertama kali
      let email = /^\d+$/.test(form.value.email)
        ? `${form.value.email}@mysolutionlending.com`
        : form.value.email;

      // Fungsi untuk melakukan login attempt
      const attemptLogin = async (emailToUse: string) => {
        const submitData = {
          email: emailToUse,
          password: form.value.password,
        };

        const response = await fetch("https://cms.mysolutionlending.com/api/v1/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(submitData),
        });

        const result = await response.json();
        return { response, result };
      };

      // Fungsi helper untuk mengganti domain email
      const changeEmailDomain = (currentEmail: string, newDomain: string): string => {
        const emailParts = currentEmail.split('@');
        if (emailParts.length === 2) {
          return `${emailParts[0]}@${newDomain}`;
        } else {
          // Jika format email tidak valid, tambahkan domain baru
          return currentEmail.includes('@') 
            ? currentEmail.replace(/@[^@]+$/, `@${newDomain}`) 
            : `${currentEmail}@${newDomain}`;
        }
      };

      // Attempt pertama dengan email asli
      const firstAttempt = await attemptLogin(email);
      let { response, result } = firstAttempt;
      
      // Simpan response pertama untuk error message jika semua attempt gagal
      const firstResponse = firstAttempt.response;
      const firstResult = firstAttempt.result;

      // Jika response tidak ok atau tidak ada data, coba dengan @flexyduit.com
      if (!response.ok || !result.data) {
        email = changeEmailDomain(email, 'flexyduit.com');
        
        // Retry dengan @flexyduit.com
        const retryResult = await attemptLogin(email);
        response = retryResult.response;
        result = retryResult.result;

        // Jika masih gagal, coba dengan @flexy.com
        if (!response.ok || !result.data) {
          email = changeEmailDomain(email, 'flexy.com');
          
          // Retry dengan @flexy.com
          const finalRetryResult = await attemptLogin(email);
          response = finalRetryResult.response;
          result = finalRetryResult.result;
        }
      }

      // Cek hasil akhir
      if (!response.ok) {
        // Jika semua attempt gagal, gunakan error message dari attempt pertama
        const errorMessage = firstResult?.message || result?.message || "Terjadi kesalahan. Silakan coba lagi.";
        showNotification('error', errorMessage);
        return;
      }

      if (!result.data || !result.data.token) {
        // Jika semua attempt tidak mengembalikan data, gunakan error message dari attempt pertama
        const errorMessage = firstResult?.message || "Data tidak ditemukan. Sila cuba lagi.";
        showNotification('error', errorMessage);
        return;
      }

      const token = result.data.token;
      document.cookie = `token=${token}; path=/; max-age=${60 * 30}`;

      // 1. Tampilkan notifikasi sukses
      showNotification('success', "Log masuk berjaya!");

      // 2. Tunggu selama 3 detik (3000ms) agar user bisa melihat pesan
      await new Promise(resolve => setTimeout(resolve, 3000));

      // 3. Baru pindah halaman
      window.location.href = "/";

    } catch (error: any) {
      console.error("Network Error:", error);
      showNotification('error', "Gagal terhubung ke server. Sila periksa koneksi internet anda.");
    } finally {
      isLoading.value = false;
    }
  }
};
</script>

<template>
  <section
    class="relative flex items-center justify-center min-h-screen px-4 py-8 overflow-hidden font-sans"
    :style="loginBackgroundStyle"
  >
    <!-- Notifikasi Custom -->
    <transition name="notify-center">
      <div v-if="notification.visible">
        <div class="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"></div>
        
        <div 
          :class="[ 
            'fixed left-1/2 top-1/2 z-50 -translate-x-1/2 -translate-y-1/2 px-8 py-8 rounded-3xl shadow-2xl border flex flex-col items-center', 
            notification.type === 'success' ? 'bg-blue-500/40 border-blue-500/30' : 'bg-red-500/40 border-red-500/30' 
          ]" 
          style="backdrop-filter: blur(24px); min-width: 320px; max-width: 95vw;"
        >
          <span v-if="notification.type === 'success'" class="inline-flex items-center justify-center w-20 h-20 mb-4 rounded-full bg-blue-500/60 text-white text-5xl shadow-lg">✔️</span>
          <span v-else class="inline-flex items-center justify-center w-20 h-20 mb-4 rounded-full bg-red-500/60 text-white text-5xl shadow-lg">❌</span>
          <span class="text-white font-bold text-lg text-center leading-snug">{{ notification.message }}</span>
        </div>
      </div>
    </transition>

    <div class="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/20 blur-[120px] rounded-full"></div>
    <div class="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-600/20 blur-[120px] rounded-full"></div>

    <div
      class="relative w-full max-w-md bg-white/5 backdrop-blur-2xl shadow-[0_8px_32px_0_rgba(0,0,0,0.8)] border border-white/10 rounded-[2.5rem] overflow-hidden"
    >
      <div class="p-8 md:p-12">
        <div class="flex justify-center mb-6">
          <div class="p-3 bg-white/5 rounded-2xl border border-white/10 backdrop-blur-md">
            <img
              src="/mylendingsolution.png"
              alt="My Solution Lending"
              class="h-24 object-contain brightness-110 contrast-125"
            />
          </div>
        </div>

        <div class="text-center mb-10">
          <h2 class="text-3xl font-bold text-white tracking-tight">
            Selamat Datang
          </h2>
          <p class="text-slate-400 mt-2 font-light">Sila log masuk ke akaun anda</p>
        </div>

        <form @submit.prevent="submitForm" class="space-y-6">
          <div class="space-y-2">
            <label class="block text-xs font-semibold text-slate-300 uppercase tracking-widest ml-1"
              >Nombor Telefon</label
            >
            <div class="relative group">
              <input
                v-model="form.email"
                type="text"
                placeholder="0123456789"
                class="w-full px-5 py-4 bg-white/5 border border-white/10 rounded-2xl focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 focus:bg-white/10 outline-none transition-all text-white placeholder:text-slate-500"
                :class="{ 'border-red-500/50 bg-red-500/5': errors.email }"
              />
            </div>
            <transition name="fade">
                <p v-if="errors.email" class="text-red-400 text-xs mt-1 ml-1 flex items-center gap-1">
                    <span class="w-1 h-1 bg-red-400 rounded-full"></span> {{ errors.email }}
                </p>
            </transition>
          </div>

          <div class="space-y-2">
            <label class="block text-xs font-semibold text-slate-300 uppercase tracking-widest ml-1"
              >Kata Laluan</label
            >
            <div class="relative group">
              <input
                :type="showPassword ? 'text' : 'password'"
                v-model="form.password"
                placeholder="••••••••"
                class="w-full px-5 py-4 bg-white/5 border border-white/10 rounded-2xl focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 focus:bg-white/10 outline-none transition-all text-white placeholder:text-slate-500"
                :class="{ 'border-red-500/50 bg-red-500/5': errors.password }"
              />
              <button
                type="button"
                @click="showPassword = !showPassword"
                class="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white transition-colors p-1"
              >
                <svg v-if="!showPassword" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18" />
                </svg>
              </button>
            </div>
            <transition name="fade">
                <p v-if="errors.password" class="text-red-400 text-xs mt-1 ml-1 flex items-center gap-1">
                    <span class="w-1 h-1 bg-red-400 rounded-full"></span> {{ errors.password }}
                </p>
            </transition>
          </div>

          <button
            type="submit"
            :disabled="isLoading"
            class="group relative w-full py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl font-bold text-lg transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden shadow-[0_0_20px_rgba(37,99,235,0.3)]"
          >
            <div class="absolute inset-0 w-1/2 h-full bg-white/10 skew-x-[-25deg] -translate-x-full group-hover:translate-x-[250%] transition-transform duration-700"></div>
            <span class="relative flex justify-center items-center">
                <span v-if="isLoading" class="animate-spin h-5 w-5 border-2 border-white/30 border-t-white rounded-full mr-3"></span>
                {{ isLoading ? "Memproses..." : "Log Masuk" }}
            </span>
          </button>
        </form>

        <div class="mt-10 pt-8 border-t border-white/10 flex flex-col items-center gap-6">
          <NuxtLink
            to="/sign-up"
            class="text-sm font-medium text-blue-400 hover:text-blue-300 transition-colors"
          >
            Tiada Akaun? <span class="underline underline-offset-4">Daftar Sekarang</span>
          </NuxtLink>

          <div class="relative">
            <button
              @click="showDropdown = !showDropdown"
              class="flex items-center gap-3 px-4 py-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all text-sm text-slate-300"
            >
              <img
                :src="`/images/${languages.find((l) => l.code === locale)?.flag}`"
                class="w-5 h-3.5 object-cover rounded-sm shadow-sm"
              />
              <span class="font-medium">{{ languages.find((l) => l.code === locale)?.label }}</span>
              <svg
                class="w-4 h-4 text-slate-500 transition-transform duration-300"
                :class="{ 'rotate-180': showDropdown }"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            <transition name="fade-slide">
              <div
                v-if="showDropdown"
                class="absolute bottom-full mb-3 right-0 w-44 bg-[#0F0A3D]/95 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl z-50 overflow-hidden"
              >
                <div
                  v-for="lang in languages"
                  :key="lang.code"
                  @click="changeLocale(lang.code)"
                  class="flex items-center gap-3 px-4 py-3.5 hover:bg-blue-600/20 cursor-pointer transition-colors border-b border-white/5 last:border-0"
                >
                  <img :src="`/images/${lang.flag}`" class="w-5 h-3.5 object-cover rounded-sm" />
                  <span class="text-sm font-medium text-slate-200">{{ lang.label }}</span>
                </div>
              </div>
            </transition>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
/* Animasi Transisi */
.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}
.fade-slide-enter-from,
.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(-15px) scale(0.95);
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* Custom Scrollbar untuk Dropdown jika dibutuhkan */
div::-webkit-scrollbar {
  width: 4px;
}
div::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 10px;
}
</style>