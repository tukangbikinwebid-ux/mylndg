<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { getSetting } from "@/composables/utils";

// I18n Integration
const { t, setLocale } = useI18n();

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

// Update Background Style - Premium Deep Navy with subtle glow
const loginBackgroundStyle = computed(() => {
  return {
    backgroundColor: "#0A052E",
    backgroundImage: `radial-gradient(circle at 10% 20%, rgba(37, 99, 235, 0.15) 0%, transparent 40%), 
                      radial-gradient(circle at 90% 80%, rgba(79, 70, 229, 0.15) 0%, transparent 40%)`,
    backgroundSize: "cover",
  };
});

interface LoginForm {
  email: string;
  name: string;
  phone: string;
  address: string;
  password: string;
  password_confirmation: string;
}

const form = ref<LoginForm>({
  name: "",
  email: "",
  phone: "",
  address: "-",
  password: "",
  password_confirmation: "",
});

const errors = ref<Partial<LoginForm> & { confirmation?: string }>({});
const isLoading = ref(false);
const showPassword = ref(false);
const showConfirmPassword = ref(false);

const changeLocale = (code: string) => {
  locale.value = code;
  setLocale(code);
  showDropdown.value = false;
};

const validateForm = async (): Promise<boolean> => {
  errors.value = {};
  if (!form.value.name) errors.value.name = "Nama wajib diisi";
  
  if (!form.value.phone) {
    errors.value.phone = "Nombor telefon wajib diisi";
  } else {
    const myPhoneRegex = /^01[0-46-9][0-9]{7,8}$/;
    if (!myPhoneRegex.test(form.value.phone)) {
      errors.value.phone = "Format nombor tidak sah (Cth: 0123456789)";
    }
  }

  if (!form.value.password) {
    errors.value.password = "Kata laluan wajib diisi";
  } else if (form.value.password.length < 6) {
    errors.value.password = "Kata laluan minimal 6 karakter";
  }

  if (form.value.password !== form.value.password_confirmation) {
    errors.value.password_confirmation = "Kata laluan tidak sepadan";
  }

  return Object.keys(errors.value).length === 0;
};

const handlePhoneInput = (e: Event) => {
  let val = form.value.phone.replace(/\D/g, '');
  if (val.startsWith('60')) {
    val = '0' + val.substring(2);
  }
  form.value.phone = val;
};

const submitForm = async () => {
  if (await validateForm()) {
    isLoading.value = true;
    try {
      const submitData = {
        ...form.value,
        email: `${form.value.phone}@flexy.com`,
      };

      const response = await fetch("https://cms.flexyduit.com/api/v1/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(submitData),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Terjadi kesalahan.");

      alert(data.message || "Pendaftaran Berhasil!");
      window.location.href = "/sign-in";
    } catch (error: any) {
      alert(error?.message || "Terjadi kesalahan.");
    } finally {
      isLoading.value = false;
    }
  }
};
</script>

<template>
  <section
    class="relative flex items-center justify-center min-h-screen px-4 py-12 overflow-hidden"
    id="register"
    :style="loginBackgroundStyle"
  >
    <div class="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-600/10 rounded-full blur-[100px]"></div>
    <div class="absolute bottom-1/4 right-1/4 w-80 h-80 bg-indigo-600/10 rounded-full blur-[120px]"></div>

    <div
      class="relative w-full max-w-md bg-white/[0.03] backdrop-blur-2xl shadow-[0_8px_32px_rgba(0,0,0,0.5)] border border-white/10 rounded-[2.5rem] overflow-hidden my-8"
    >
      <div class="p-8 md:p-10">
        <div class="flex justify-center mb-6">
          <div class="p-3 bg-white/5 rounded-2xl border border-white/10">
            <img
              src="/FlexyDuit-flat-transparent.avif"
              alt="FlexyDuit"
              class="h-14 object-contain brightness-110"
            />
          </div>
        </div>

        <div class="text-center mb-8">
          <h2 class="text-3xl font-bold text-white tracking-tight">
            Daftar Akaun Baharu
          </h2>
          <p class="text-slate-400 mt-2 font-light">
            Sertai komuniti kami dalam beberapa langkah mudah
          </p>
        </div>

        <form @submit.prevent="submitForm" class="space-y-5">
          <div>
            <label class="block text-xs font-semibold text-slate-300 uppercase tracking-widest mb-2 ml-1">Nama Penuh</label>
            <input
              v-model="form.name"
              type="text"
              placeholder="Contoh: Ahmad Ali"
              class="w-full px-5 py-4 bg-white/5 border border-white/10 rounded-2xl focus:ring-2 focus:ring-blue-500/50 focus:bg-white/10 outline-none transition-all text-white placeholder:text-slate-600"
              :class="{ 'border-red-500/50 bg-red-500/5': errors.name }"
            />
            <p v-if="errors.name" class="text-red-400 text-xs mt-1.5 ml-1">{{ errors.name }}</p>
          </div>

          <div>
            <label class="block text-xs font-semibold text-slate-300 uppercase tracking-widest mb-2 ml-1">Nombor Telefon</label>
            <input
              v-model="form.phone"
              type="tel"
              maxlength="11"
              placeholder="Cth: 0123456789"
              class="w-full px-5 py-4 bg-white/5 border border-white/10 rounded-2xl focus:ring-2 focus:ring-blue-500/50 focus:bg-white/10 outline-none transition-all text-white placeholder:text-slate-600"
              @input="handlePhoneInput"
              :class="{ 'border-red-500/50 bg-red-500/5': errors.phone }"
            />
            <p v-if="errors.phone" class="text-red-400 text-xs mt-1.5 ml-1">{{ errors.phone }}</p>
          </div>

          <div>
            <label class="block text-xs font-semibold text-slate-300 uppercase tracking-widest mb-2 ml-1">Kata Laluan</label>
            <div class="relative group">
              <input
                :type="showPassword ? 'text' : 'password'"
                v-model="form.password"
                placeholder="••••••••"
                class="w-full px-5 py-4 bg-white/5 border border-white/10 rounded-2xl focus:ring-2 focus:ring-blue-500/50 focus:bg-white/10 outline-none transition-all text-white placeholder:text-slate-600 pr-12"
                :class="{ 'border-red-500/50 bg-red-500/5': errors.password }"
              />
              <button
                type="button"
                @click="showPassword = !showPassword"
                class="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white transition-colors"
              >
                <svg v-if="!showPassword" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18" />
                </svg>
              </button>
            </div>
            <p v-if="errors.password" class="text-red-400 text-xs mt-1.5 ml-1">{{ errors.password }}</p>
          </div>

          <div>
            <label class="block text-xs font-semibold text-slate-300 uppercase tracking-widest mb-2 ml-1">Sahkan Kata Laluan</label>
            <div class="relative group">
              <input
                :type="showConfirmPassword ? 'text' : 'password'"
                v-model="form.password_confirmation"
                placeholder="••••••••"
                class="w-full px-5 py-4 bg-white/5 border border-white/10 rounded-2xl focus:ring-2 focus:ring-blue-500/50 focus:bg-white/10 outline-none transition-all text-white placeholder:text-slate-600 pr-12"
                :class="{ 'border-red-500/50 bg-red-500/5': errors.password_confirmation }"
              />
              <button
                type="button"
                @click="showConfirmPassword = !showConfirmPassword"
                class="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white transition-colors"
              >
                <svg v-if="!showConfirmPassword" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18" />
                </svg>
              </button>
            </div>
            <p v-if="errors.password_confirmation" class="text-red-400 text-xs mt-1.5 ml-1">{{ errors.password_confirmation }}</p>
          </div>

          <button
            type="submit"
            :disabled="isLoading"
            class="group relative w-full py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl font-bold text-lg transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden shadow-[0_0_20px_rgba(37,99,235,0.2)] mt-8"
          >
            <div class="absolute inset-0 w-1/2 h-full bg-white/10 skew-x-[-25deg] -translate-x-full group-hover:translate-x-[250%] transition-transform duration-700"></div>
            <span class="relative flex justify-center items-center">
                <span v-if="isLoading" class="animate-spin h-5 w-5 border-2 border-white/30 border-t-white rounded-full mr-3"></span>
                {{ isLoading ? "Mendaftar..." : "Daftar Sekarang" }}
            </span>
          </button>
        </form>

        <div class="mt-10 pt-8 border-t border-white/10 flex flex-col items-center gap-6">
          <NuxtLink
            to="/sign-in"
            class="text-sm font-medium text-blue-400 hover:text-blue-300 transition-colors"
          >
            Sudah punya akaun? <span class="underline underline-offset-4">Log Masuk</span>
          </NuxtLink>

          <div class="relative">
            <button
              @click="showDropdown = !showDropdown"
              class="flex items-center gap-3 px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all text-sm text-slate-300"
            >
              <img
                :src="`/images/${languages.find((l) => l.code === locale)?.flag}`"
                class="w-5 h-3.5 object-cover rounded-sm shadow-sm"
              />
              <span class="font-medium">{{ languages.find((l) => l.code === locale)?.label }}</span>
              <svg class="w-4 h-4 text-slate-500 transition-transform" :class="{ 'rotate-180': showDropdown }" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}
.fade-slide-enter-from,
.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(15px) scale(0.95);
}

/* Chrome/Safari Hide Scrollbar */
::-webkit-scrollbar {
  display: none;
}
</style>