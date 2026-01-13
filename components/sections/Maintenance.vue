<script setup lang="ts">
import { ref, onMounted } from "vue";
import { getSetting } from "@/composables/utils";

const settings = ref(null);
const isLoading = ref(true);

onMounted(async () => {
  try {
    settings.value = await getSetting();
  } catch (error) {
    console.log(error);
  } finally {
    isLoading.value = false;
  }
});

// Meta Information
useHead({
  title: "Penyelenggaraan Sistem - Flexyduit",
});
</script>

<template>
  <section 
    class="relative flex items-center justify-center min-h-screen bg-[#0A052E] px-4 overflow-hidden" 
    id="maintenance"
  >
    <div class="absolute top-[-10%] left-[-10%] w-[60%] h-[50%] bg-blue-600/10 blur-[120px] rounded-full"></div>
    <div class="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-indigo-600/10 blur-[100px] rounded-full"></div>

    <div class="absolute top-1/4 left-1/4 w-2 h-2 bg-blue-400 rounded-full animate-pulse opacity-50"></div>
    <div class="absolute bottom-1/3 right-1/4 w-3 h-3 bg-indigo-400 rounded-full animate-pulse opacity-30"></div>

    <div class="relative w-full max-w-xl z-10">
      <div 
        class="bg-white/[0.03] backdrop-blur-3xl border border-white/10 shadow-[0_30px_60px_rgba(0,0,0,0.5)] rounded-[3rem] p-10 md:p-16 text-center transform transition-all"
      >
        <div class="relative mb-10 inline-block">
          <div class="absolute inset-0 bg-blue-500/20 blur-2xl rounded-full"></div>
          <img
            src="/images/icon-maintenance.png"
            :alt="settings?.name"
            class="relative mx-auto w-40 md:w-56 object-contain brightness-110 drop-shadow-2xl"
          />
        </div>

        <h2 class="text-3xl md:text-5xl font-black text-white tracking-tight mb-6">
          <span class="bg-gradient-to-r from-white via-white to-blue-400 bg-clip-text text-transparent">
            {{ settings?.maintenance_title || 'Sistem Sedang Dikemaskini' }}
          </span>
        </h2>

        <div 
          class="text-slate-400 text-lg md:text-xl font-light leading-relaxed mb-10 maintenance-text" 
          v-html="settings?.maintenance_message || 'Kami sedang melakukan penambahbaikan untuk memberikan perkhidmatan yang lebih baik kepada anda.'"
        ></div>

        <div class="pt-8 border-t border-white/10">
          <p class="text-slate-500 text-sm font-medium uppercase tracking-[0.2em] mb-4">Perlukan Bantuan?</p>
          
          <a 
            v-if="settings?.maintenance_contact"
            :href="`mailto:${settings?.maintenance_contact}`" 
            class="inline-flex items-center gap-3 px-6 py-3 bg-white/5 border border-white/10 rounded-2xl text-blue-400 hover:bg-white/10 hover:border-blue-500/50 transition-all duration-300"
          >
            <i class="fa-solid fa-envelope"></i>
            <span class="font-bold tracking-wide">{{ settings?.maintenance_contact }}</span>
          </a>
        </div>
      </div>

      <p class="mt-8 text-center text-slate-600 text-xs font-medium tracking-widest uppercase">
        &copy; 2026 FlexyDuit Premium System
      </p>
    </div>
  </section>
</template>

<style scoped>
/* Animasi masuk yang halus */
#maintenance .relative.z-10 {
  animation: slideUpFade 1s cubic-bezier(0.22, 1, 0.36, 1) both;
}

@keyframes slideUpFade {
  from {
    opacity: 0;
    transform: translateY(40px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Penyelarasan gaya untuk teks v-html */
.maintenance-text :deep(strong) {
  color: #fff;
  font-weight: 700;
}

.maintenance-text :deep(br) {
  margin-bottom: 0.5rem;
  display: block;
  content: "";
}

/* Mengelakkan teks contact melimpah pada skrin kecil */
a span {
  word-break: break-all;
}
</style>