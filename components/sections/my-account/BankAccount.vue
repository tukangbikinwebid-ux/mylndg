<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
import { getUserData, getSetting, getCookie } from "@/composables/utils";

const isLoading = ref(false);
const isEditMode = ref(false); 
const { t } = useI18n();

const titleMenu = computed(
  () => `${t("my-account.title-menu")} - ${t("my-account.menu-bank")}`
);

const user = ref(null);
const settings = ref(null);

const form = ref({
  bank_name: "",
  account_name: "",
  account_number: "",
});

const showAccountNumber = ref(false);
const baseURL = "https://cms.mysolutionlending.com/";

onMounted(async () => {
  await loadData();
});

const loadData = async () => {
  try {
    isLoading.value = true;
    user.value = await getUserData();
    settings.value = await getSetting();

    const bank = user.value?.anggota?.anggota_bank;

    if (!bank || !bank.bank_name) {
      isEditMode.value = true;
    }

    form.value.bank_name = bank?.bank_name || "";
    form.value.account_name = bank?.account_name || "";
    form.value.account_number = bank?.account_number || "";
  } catch (error) {
    console.error(error);
  } finally {
    isLoading.value = false;
  }
};

const saveBankInfo = async () => {
  isLoading.value = true;
  try {
    const token = getCookie("token");
    await $fetch(`${baseURL}api/v1/profile/anggota-bank`, {
      method: "PUT",
      body: form.value,
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
    });

    alert("Maklumat bank berjaya dikemaskini!");
    isEditMode.value = false;
    await loadData();
  } catch (error: any) {
    alert(error.data?.message || "Gagal mengemaskini maklumat bank.");
  } finally {
    isLoading.value = false;
  }
};

// Update Background Style - Premium Deep Navy
const myAccountBackgroundStyle = computed(() => {
  return {
    backgroundColor: "#0A052E",
    backgroundImage: `radial-gradient(circle at 50% -20%, rgba(37, 99, 235, 0.15) 0%, transparent 50%)`,
  };
});
</script>

<template>
  <section
    class="relative flex justify-center items-start min-h-screen bg-[#0A052E] py-24 overflow-hidden"
    :style="myAccountBackgroundStyle"
  >
    <div class="absolute top-[-10%] right-[-10%] w-80 h-80 bg-blue-600/10 blur-[120px] rounded-full"></div>
    <div class="absolute bottom-[-10%] left-[-10%] w-72 h-72 bg-indigo-600/10 blur-[100px] rounded-full"></div>

    <div class="w-full relative z-10 px-5">
      <CardsNavigasiHeader :title="titleMenu" type="menu" />
      
      <AtomsContainer class-name="relative pt-6">
        
        <div class="animate-enter bg-white/[0.03] backdrop-blur-3xl border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.5)] rounded-[2.5rem] p-8 md:p-10">
          
          <div class="flex items-center justify-between mb-10">
            <div class="space-y-1">
                <h1 class="text-2xl md:text-3xl font-bold text-white tracking-tight">
                {{ t("my-account.bank-data.title") }}
                </h1>
                <p class="text-blue-400 text-[10px] font-bold uppercase tracking-[0.2em]">Secure Encryption</p>
            </div>
            <button 
                @click="isEditMode = !isEditMode"
                class="p-3 bg-white/5 border border-white/10 rounded-2xl text-blue-400 hover:bg-white/10 transition-all active:scale-95"
            >
                <i class="fa-solid" :class="isEditMode ? 'fa-xmark' : 'fa-pen-to-square'"></i>
            </button>
          </div>

          <div v-if="!isEditMode" class="text-left space-y-6">
            <div class="flex flex-col space-y-1 border-b border-white/5 pb-3">
              <span class="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{{ t("my-account.bank-data.bank") }}</span>
              <span class="text-white font-medium text-lg">{{ form.bank_name || "-" }}</span>
            </div>
            
            <div class="flex flex-col space-y-1 border-b border-white/5 pb-3">
              <span class="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{{ t("my-account.bank-data.name") }}</span>
              <span class="text-white font-medium text-lg">{{ form.account_name || "-" }}</span>
            </div>

            <div class="flex flex-col space-y-1 border-b border-white/5 pb-3">
              <span class="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{{ t("my-account.bank-data.nomor") }}</span>
              <div class="flex items-center justify-between">
                <span class="text-white font-mono text-lg tracking-widest">
                  {{ showAccountNumber ? form.account_number : "•••• •••• ••••" }}
                </span>
                <button 
                    @click="showAccountNumber = !showAccountNumber"
                    class="text-slate-500 hover:text-white transition-colors"
                >
                    <i class="fa-solid" :class="showAccountNumber ? 'fa-eye-slash' : 'fa-eye'"></i>
                </button>
              </div>
            </div>

            <div class="mt-8 p-6 bg-blue-600/10 border border-blue-500/20 rounded-[2rem]">
              <div class="flex items-start gap-4">
                <div class="w-10 h-10 bg-blue-500/10 rounded-xl flex items-center justify-center border border-blue-500/20 flex-shrink-0">
                  <i class="fa-solid fa-shield-check text-blue-400"></i>
                </div>
                <div>
                  <h3 class="text-xs font-bold text-blue-400 mb-2 uppercase tracking-[0.2em]">Nota Penting</h3>
                  <p class="text-[11px] text-slate-400 leading-relaxed">
                    Sila pastikan maklumat akaun bank anda adalah tepat untuk memudahkan proses pengeluaran dana. Semua maklumat akan dienkripsi dan dilindungi dengan selamat.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <form v-else @submit.prevent="saveBankInfo" class="space-y-6">
             <div class="space-y-2">
                <label class="block text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Nama Bank</label>
                <input 
                  v-model="form.bank_name" 
                  type="text" 
                  placeholder="Contoh: Maybank, CIMB" 
                  class="input-glass" 
                  required
                />
             </div>
             <div class="space-y-2">
                <label class="block text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Nama Pemegang Akaun</label>
                <input 
                  v-model="form.account_name" 
                  type="text" 
                  placeholder="Nama penuh anda" 
                  class="input-glass" 
                  required
                />
             </div>
             <div class="space-y-2">
                <label class="block text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Nombor Akaun</label>
                <input 
                  v-model="form.account_number" 
                  type="text" 
                  inputmode="numeric"
                  placeholder="Nombor akaun bank" 
                  class="input-glass" 
                  required
                />
             </div>

             <div class="pt-6">
               <button 
                  type="submit" 
                  :disabled="isLoading"
                  class="group relative w-full py-5 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl font-bold shadow-xl shadow-blue-600/20 transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden uppercase tracking-widest text-xs"
               >
                  <div class="absolute inset-0 w-1/2 h-full bg-white/10 skew-x-[-25deg] -translate-x-full group-hover:translate-x-[250%] transition-transform duration-700"></div>
                  <span class="relative flex justify-center items-center gap-3">
                    <span
                      v-if="isLoading"
                      class="animate-spin h-5 w-5 border-2 border-white/30 border-t-white rounded-full"
                    ></span>
                    {{ isLoading ? 'Menyimpan...' : 'Kemaskini Maklumat' }}
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

/* Hide arrow on number input */
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

/* Custom Scrollbar */
::-webkit-scrollbar {
  display: none;
}
</style>