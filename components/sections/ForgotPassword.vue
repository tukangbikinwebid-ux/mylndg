<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { getSetting } from "@/composables/utils";

const settings = ref(null);

interface ForgotForm {
  email: string;
}

const form = ref<ForgotForm>({
  email: "",
});

onMounted(async () => {
  try {
    settings.value = await getSetting();
  } catch (error) {
    console.log(error);
  }
});

// Premium Dark Background with Radial Glows
const loginBackgroundStyle = computed(() => {
  const baseStyle: any = {
    backgroundColor: "#0A052E",
    backgroundImage: `radial-gradient(circle at 20% 30%, rgba(37, 99, 235, 0.1) 0%, transparent 50%), 
                      radial-gradient(circle at 80% 70%, rgba(79, 70, 229, 0.1) 0%, transparent 50%)`,
  };

  if (settings.value && settings.value.background_login) {
    baseStyle.backgroundImage = `linear-gradient(rgba(10, 5, 46, 0.85), rgba(10, 5, 46, 0.85)), url('https://cms.mysolutionlending.com/${settings.value.background_login}')`;
    baseStyle.backgroundSize = "cover";
    baseStyle.backgroundPosition = "center";
  }
  return baseStyle;
});

const errors = ref<Partial<ForgotForm>>({});
const isLoading = ref(false);

const validateForm = async (): Promise<boolean> => {
  errors.value = {};

  if (!form.value.email) {
    errors.value.email = "Email wajib diisi";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.value.email)) {
    errors.value.email = "Format email tidak valid";
  }

  return Object.keys(errors.value).length === 0;
};

const submitForm = async (event: Event) => {
  event.preventDefault();

  if (await validateForm()) {
    isLoading.value = true;
    try {
      // Menggunakan endpoint sesuai template user (login/reset)
      const response = await fetch("https://api.ifc.web.id/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form.value),
      });

      if (!response.ok) throw new Error("Gagal memproses");

      alert("Pautan set semula kata laluan telah dihantar ke email anda.");
    } catch (error) {
      alert("Terjadi kesalahan. Silakan coba lagi.");
    } finally {
      isLoading.value = false;
    }
  }
};
</script>

<template>
  <section
    class="flex items-center justify-center min-h-screen px-4 py-12 relative overflow-hidden"
    id="login"
    :style="loginBackgroundStyle"
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
              v-if="settings?.logo"
              :src="`https://cms.flexyduit.com${settings?.logo}`"
              :alt="settings?.name"
              class="mx-auto h-12 w-auto brightness-110 object-contain"
            />
            <div v-else class="h-12 w-32 bg-white/10 animate-pulse rounded-lg"></div>
          </div>

          <h2 class="text-white font-bold text-3xl tracking-tight mb-2">
             Reset Password
          </h2>
          <p class="text-slate-400 text-sm font-light mb-10">
            Sila masukkan email anda untuk mendapatkan pautan set semula.
          </p>

          <form @submit="submitForm" class="space-y-6">
            <div class="text-left space-y-2">
              <label class="block text-xs font-semibold text-slate-300 uppercase tracking-widest ml-1">
                Alamat Email
              </label>
              <div class="relative group">
                <input
                  v-model="form.email"
                  type="email"
                  placeholder="name@example.com"
                  class="w-full px-5 py-4 bg-white/5 border border-white/10 rounded-2xl focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 focus:bg-white/10 outline-none transition-all text-white placeholder:text-slate-600"
                  :class="{ 'border-red-500/50 bg-red-500/5': errors.email }"
                />
              </div>
              <p v-if="errors.email" class="text-red-400 text-xs mt-1.5 ml-1 flex items-center gap-1">
                <span class="w-1 h-1 bg-red-400 rounded-full"></span> {{ errors.email }}
              </p>
            </div>

            <button
              type="submit"
              :disabled="isLoading"
              class="group relative w-full py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl font-bold text-lg transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden shadow-[0_10px_30px_rgba(37,99,235,0.3)] mt-4"
            >
              <div class="absolute inset-0 w-1/2 h-full bg-white/10 skew-x-[-25deg] -translate-x-full group-hover:translate-x-[250%] transition-transform duration-700"></div>
              <span class="relative flex justify-center items-center">
                <span
                  v-if="isLoading"
                  class="animate-spin h-5 w-5 border-2 border-white/30 border-t-white rounded-full mr-3"
                ></span>
                {{ isLoading ? "Menghantar..." : "Send Request" }}
              </span>
            </button>
          </form>

          <div class="flex items-center justify-between mt-10 pt-6 border-t border-white/5">
            <NuxtLink
              to="/sign-up"
              class="text-xs font-bold text-blue-400 hover:text-blue-300 uppercase tracking-widest transition-colors"
            >
              Daftar Akaun
            </NuxtLink>
            <NuxtLink
              to="/sign-in"
              class="text-xs font-bold text-slate-400 hover:text-white uppercase tracking-widest transition-colors"
            >
              Log Masuk
            </NuxtLink>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
/* Chrome/Safari hide scrollbar */
::-webkit-scrollbar {
  display: none;
}

/* Animasi Masuk */
#login .relative {
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