<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { getCookie, getSetting } from "@/composables/utils";

const { t } = useI18n();
const titleMenu = computed(
  () => `${t("my-account.title-menu")} - ${t("my-account.menu-password")}`
);

const isLoading = ref(false);
const showCurrentPassword = ref(false);
const showNewPassword = ref(false);
const showConfirmPassword = ref(false);

const form = ref({
  current_password: "",
  password: "",
  password_confirmation: "",
});

const settings = ref(null);

onMounted(async () => {
  try {
    settings.value = await getSetting();
  } catch (error) {
    console.log(error);
  }
});

// Premium Dark Background with Radial Glows
const myAccountBackgroundStyle = computed(() => {
  return {
    // backgroundColor: "#0A052E",
    // backgroundImage: `radial-gradient(circle at 50% 10%, rgba(37, 99, 235, 0.1) 0%, transparent 50%)`,
  };
});

const submitForm = async (e: Event) => {
  e.preventDefault();

  if (!form.value.current_password || !form.value.password || !form.value.password_confirmation) {
    alert("Sila isi semua ruangan.");
    return;
  }

  if (form.value.password !== form.value.password_confirmation) {
    alert("Kata laluan baru dan pengesahan tidak sepadan!");
    return;
  }

  const token = getCookie("token");
  if (!token) {
    alert("Sesi tamat. Sila log masuk semula.");
    window.location.href = "/sign-in";
    return;
  }

  isLoading.value = true;

  try {
    const response = await fetch(
      "https://cms.mysolutionlending.com/api/v1/profile/password",
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          current_password: form.value.current_password,
          password: form.value.password,
          password_confirmation: form.value.password_confirmation,
        }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Gagal mengemaskini kata laluan.");
    }

    alert("Kata laluan berjaya dikemaskini!");
    window.location.href = "/my-account";
  } catch (error: any) {
    alert(error.message || "Terjadi ralat semasa mengemaskini kata laluan.");
  } finally {
    isLoading.value = false;
  }
};
</script>

<template>
  <section
    class="relative flex justify-center items-start min-h-screen py-24 overflow-hidden"
    :style="myAccountBackgroundStyle"
  >
    <div class="absolute top-[-10%] left-[-10%] w-80 h-80 bg-blue-600/10 blur-[120px] rounded-full"></div>
    <div class="absolute bottom-[-10%] right-[-10%] w-72 h-72 bg-indigo-600/10 blur-[100px] rounded-full"></div>

    <div class="w-full relative z-10 px-5">
      <CardsNavigasiHeader :title="titleMenu" type="menu" />
      
      <AtomsContainer class-name="relative pt-6">
        <div class="animate-enter bg-white/[0.03] backdrop-blur-3xl border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.5)] rounded-[2.5rem] p-8 md:p-10">
          
          <div class="text-center mb-10">
            <div class="w-16 h-16 bg-blue-600/10 rounded-2xl border border-blue-500/20 flex items-center justify-center mx-auto mb-4">
              <i class="fa-solid fa-shield-keyhole text-blue-400 text-2xl"></i>
            </div>
            <h1 class="text-2xl md:text-3xl font-bold text-white tracking-tight">
              Keselamatan Akaun
            </h1>
            <p class="text-slate-400 text-sm font-light mt-2">Kemas kini kata laluan anda secara berkala</p>
          </div>

          <form @submit="submitForm" class="space-y-6">
            <div class="space-y-2">
              <label class="block text-[10px] font-bold text-slate-300 uppercase tracking-widest ml-1">
                {{ t("my-account.change-password.password") }}
              </label>
              <div class="relative group">
                <input
                  v-model="form.current_password"
                  :type="showCurrentPassword ? 'text' : 'password'"
                  :placeholder="t('my-account.change-password.password')"
                  class="input-glass"
                  required
                />
                <button type="button" @click="showCurrentPassword = !showCurrentPassword" class="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white transition-colors">
                  <i class="fa-solid" :class="showCurrentPassword ? 'fa-eye-slash' : 'fa-eye'"></i>
                </button>
              </div>
            </div>

            <div class="space-y-2">
              <label class="block text-[10px] font-bold text-slate-300 uppercase tracking-widest ml-1">
                {{ t("my-account.change-password.new_password") }}
              </label>
              <div class="relative group">
                <input
                  v-model="form.password"
                  :type="showNewPassword ? 'text' : 'password'"
                  :placeholder="t('my-account.change-password.new_password')"
                  class="input-glass"
                  required
                />
                <button type="button" @click="showNewPassword = !showNewPassword" class="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white transition-colors">
                  <i class="fa-solid" :class="showNewPassword ? 'fa-eye-slash' : 'fa-eye'"></i>
                </button>
              </div>
            </div>

            <div class="space-y-2">
              <label class="block text-[10px] font-bold text-slate-300 uppercase tracking-widest ml-1">
                {{ t("my-account.change-password.confirmation") }}
              </label>
              <div class="relative group">
                <input
                  v-model="form.password_confirmation"
                  :type="showConfirmPassword ? 'text' : 'password'"
                  :placeholder="t('my-account.change-password.confirmation')"
                  class="input-glass"
                  required
                />
                <button type="button" @click="showConfirmPassword = !showConfirmPassword" class="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white transition-colors">
                  <i class="fa-solid" :class="showConfirmPassword ? 'fa-eye-slash' : 'fa-eye'"></i>
                </button>
              </div>
            </div>

            <div class="pt-6">
              <button
                type="submit"
                :disabled="isLoading"
                class="group relative w-full py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl font-bold text-lg transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden shadow-[0_10px_30px_rgba(37,99,235,0.3)]"
              >
                <div class="absolute inset-0 w-1/2 h-full bg-white/10 skew-x-[-25deg] -translate-x-full group-hover:translate-x-[250%] transition-transform duration-700"></div>
                <span class="relative flex justify-center items-center">
                  <span
                    v-if="isLoading"
                    class="animate-spin h-5 w-5 border-2 border-white/30 border-t-white rounded-full mr-3"
                  ></span>
                  {{ t("my-account.change-password.submit") }}
                </span>
              </button>
            </div>
          </form>
          
          <div class="mt-8 p-4 bg-blue-500/5 border border-blue-500/10 rounded-2xl">
            <p class="text-[11px] text-slate-400 text-center leading-relaxed italic">
              Nota: Gunakan sekurang-kurangnya 6 aksara dengan gabungan huruf dan nombor untuk keselamatan yang lebih baik.
            </p>
          </div>
        </div>
      </AtomsContainer>
    </div>
  </section>
</template>

<style scoped>
/* Input Glass Style */
.input-glass {
  @apply w-full px-5 py-4 bg-white/5 border border-white/10 rounded-2xl focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 focus:bg-white/10 outline-none transition-all text-white placeholder:text-slate-600;
}

/* Animasi Entrance */
.animate-enter {
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

/* Hide scrollbar */
::-webkit-scrollbar {
  display: none;
}
</style>