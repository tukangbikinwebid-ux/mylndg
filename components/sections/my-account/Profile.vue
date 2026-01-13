<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
import { getUserData, getCookie, getSetting } from "@/composables/utils";

const { t } = useI18n();
const titleMenu = computed(
  () => `${t("my-account.title-menu")} - ${t("my-account.menu-profile")}`
);

const user = ref(null);
const settings = ref(null);
const isLoading = ref(false);
const defaultPhoto =
  "https://img.freepik.com/free-photo/happy-man-student-with-afro-hairdo-shows-white-teeth-being-good-mood-after-classes_273609-16608.jpg?semt=ais_hybrid&w=740";

const form = ref({
  name: "",
  email: "",
  phone: "",
  address: "",
  image: null as File | null,
});

const previewPhoto = ref<string | null>(null);

onMounted(async () => {
  try {
    user.value = await getUserData();
    settings.value = await getSetting();
    form.value.name = user.value.name;
    form.value.email = user.value.email;
    form.value.phone = user.value.anggota.phone;
    form.value.address = user.value.anggota.address;
    previewPhoto.value = "https://cms.flexyduit.com/" + user.value.image;
  } catch (error) {
    console.error(error);
    window.location.href = "/sign-in";
  }
});

// Premium Dark Background Style
const myAccountBackgroundStyle = computed(() => {
  return {
    backgroundColor: "#0A052E",
    backgroundImage: `radial-gradient(circle at 50% 10%, rgba(37, 99, 235, 0.1) 0%, transparent 50%)`,
  };
});

const handleFileChange = (event: Event) => {
  const target = event.target as HTMLInputElement;
  const file = target.files?.[0];
  if (file) {
    form.value.image = file;
    const reader = new FileReader();
    reader.onload = (e: any) => {
      previewPhoto.value = e.target.result;
    };
    reader.readAsDataURL(file);
  }
};

const submitForm = async (e: Event) => {
  e.preventDefault();
  isLoading.value = true;

  const token = getCookie("token");
  if (!token) {
    alert("Sesi tamat. Sila log masuk semula.");
    window.location.href = "/sign-in";
    return;
  }

  try {
    const formData = new FormData();
    formData.append("_method", "PUT");
    formData.append("name", form.value.name);
    formData.append("email", form.value.email);
    formData.append("phone", form.value.phone);
    formData.append("address", form.value.address);

    if (form.value.image) {
      formData.append("image", form.value.image);
    }

    const response = await fetch("https://cms.flexyduit.com/api/v1/profile", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Gagal memperbarui profil");
    }

    alert("Profil berjaya dikemaskini!");
    window.location.href = "/my-account";
  } catch (error: any) {
    alert(error.message || "Terjadi ralat semasa mengemaskini profil.");
  } finally {
    isLoading.value = false;
  }
};
</script>

<template>
  <section
    class="relative flex justify-center items-start min-h-screen bg-[#0A052E] py-24 overflow-hidden"
    :style="myAccountBackgroundStyle"
  >
    <div class="absolute top-[-10%] left-[-10%] w-80 h-80 bg-blue-600/10 blur-[120px] rounded-full"></div>
    <div class="absolute bottom-[-10%] right-[-10%] w-72 h-72 bg-indigo-600/10 blur-[100px] rounded-full"></div>

    <div class="w-full relative z-10 px-5">
      <CardsNavigasiHeader :title="titleMenu" type="menu" class="bg-[#0A052E]/60 backdrop-blur-xl border-b border-white/5" />
      
      <AtomsContainer class-name="relative pt-6">
        <div class="animate-enter bg-white/[0.03] backdrop-blur-3xl border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.5)] rounded-[2.5rem] p-8 md:p-10">
          
          <form @submit="submitForm" class="space-y-6">
            <div class="flex flex-col items-center mb-8">
              <div class="relative group">
                <div class="absolute inset-0 bg-blue-500/20 blur-xl rounded-full scale-110 group-hover:bg-blue-500/40 transition-all"></div>
                <img
                  :src="previewPhoto || defaultPhoto"
                  alt="Profile"
                  class="relative w-32 h-32 rounded-full object-cover border-2 border-white/20 shadow-2xl transition-transform group-hover:scale-[1.02]"
                />
                <label for="profile-upload" class="absolute bottom-0 right-0 w-10 h-10 bg-blue-600 border-2 border-[#0A052E] rounded-full flex items-center justify-center cursor-pointer hover:bg-blue-500 transition-colors shadow-lg">
                  <i class="fa-solid fa-camera text-white text-sm"></i>
                  <input
                    id="profile-upload"
                    type="file"
                    accept="image/*"
                    @change="handleFileChange"
                    class="hidden"
                  />
                </label>
              </div>
              <p class="text-slate-400 text-[10px] font-bold uppercase tracking-[0.2em] mt-4">Tukar Foto Profil</p>
            </div>

            <div class="grid grid-cols-1 gap-6">
              <div class="space-y-2">
                <label class="block text-[10px] font-bold text-slate-300 uppercase tracking-widest ml-1">
                  {{ t("my-account.profile.name") }}
                </label>
                <div class="relative">
                  <input
                    v-model="form.name"
                    type="text"
                    :placeholder="t('my-account.profile.name')"
                    class="input-glass"
                  />
                </div>
              </div>

              <div class="space-y-2">
                <label class="block text-[10px] font-bold text-slate-300 uppercase tracking-widest ml-1">
                  {{ t("my-account.profile.email") }}
                </label>
                <input
                  v-model="form.email"
                  type="email"
                  :placeholder="t('my-account.profile.email')"
                  class="input-glass"
                />
              </div>

              <div class="space-y-2">
                <label class="block text-[10px] font-bold text-slate-300 uppercase tracking-widest ml-1">
                  {{ t("my-account.profile.phone") }}
                </label>
                <input
                  v-model="form.phone"
                  type="tel"
                  maxlength="11"
                  :placeholder="t('my-account.profile.phone')"
                  class="input-glass"
                  @input="form.phone = form.phone.replace(/\D/g, '')"
                />
              </div>

              <div class="space-y-2">
                <label class="block text-[10px] font-bold text-slate-300 uppercase tracking-widest ml-1">
                  {{ t("my-account.profile.address") }}
                </label>
                <textarea
                  v-model="form.address"
                  :placeholder="t('my-account.profile.address')"
                  rows="3"
                  class="input-glass resize-none"
                ></textarea>
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
                  {{ t("my-account.profile.submit") }}
                </span>
              </button>
            </div>
          </form>

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