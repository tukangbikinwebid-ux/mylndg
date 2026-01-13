<template>
  <header 
    class="fixed top-0 left-0 w-full bg-[#0A052E]/60 backdrop-blur-xl border-b border-white/10 p-4 flex items-center z-[100] transition-all duration-300"
  >
    <div class="max-w-7xl mx-auto w-full flex items-center px-1">
      <button 
        @click="goBack" 
        class="group mr-5 w-10 h-10 flex items-center justify-center rounded-xl bg-white/5 border border-white/10 hover:bg-blue-600/20 hover:border-blue-500/30 transition-all active:scale-90"
        aria-label="Go back"
      >
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          fill="none" 
          viewBox="0 0 24 24" 
          stroke-width="2.5" 
          stroke="currentColor" 
          class="w-5 h-5 text-white group-hover:text-blue-400 transition-colors"
        >
          <path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      <div class="flex flex-col">
        <h2 class="text-base font-bold text-white tracking-tight leading-none uppercase tracking-widest">
          {{ title }}
        </h2>
        <span class="text-[9px] text-blue-400 font-bold uppercase tracking-[0.2em] mt-1 opacity-80">
          {{ type === 'menu' ? 'Secure Page' : type }}
        </span>
      </div>

      <div class="ml-auto opacity-20">
        <div class="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
      </div>
    </div>
  </header>
</template>

<script lang="ts" setup>
import { useRouter } from "vue-router";

const router = useRouter();

const { title, type } = defineProps<{
    title: string,
    type: string,
}>()

const goBack = () => {
    router.back();
};
</script>

<style scoped>
/* Memastikan kandungan di bawah header tidak tertutup secara mengejut */
header {
  box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
}

/* Animasi muncul apabila header dimuatkan */
header {
  animation: slideDown 0.5s cubic-bezier(0.22, 1, 0.36, 1);
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-100%);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>