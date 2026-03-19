<template>
  <div class="fixed bottom-0 left-0 right-0 z-50 px-4 pb-6 pt-2">
    <nav 
      class="max-w-md mx-auto bg-[#0A052E]/80 backdrop-blur-xl border border-white/10 shadow-[0_-10px_40px_rgba(0,0,0,0.5)] rounded-[2rem] flex justify-around items-center py-3 px-2 transition-all duration-500"
    >
      <NuxtLink 
        :to="t('nav-home')" 
        @click="setActiveMenu('home')" 
        class="relative flex flex-col items-center justify-center flex-1 transition-all duration-300"
        :class="activeMenu === 'home' ? 'text-blue-400' : 'text-slate-500 hover:text-slate-300'"
      >
        <div class="relative py-1">
          <i class="fa-solid fa-house mb-1" style="font-size: 20px;"></i>
          <span v-if="activeMenu === 'home'" class="absolute -top-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-blue-400 rounded-full shadow-[0_0_8px_#60a5fa]"></span>
        </div>
        <span 
          class="text-[10px] uppercase tracking-widest font-bold"
          :class="activeMenu === 'home' ? 'opacity-100' : 'opacity-70'"
        >
          Laman Utama
        </span>
      </NuxtLink>

      <NuxtLink 
        :to="t('nav-wallet')" 
        @click="setActiveMenu('wallet')" 
        class="relative flex flex-col items-center justify-center flex-1 transition-all duration-300"
        :class="activeMenu === 'wallet' ? 'text-blue-400' : 'text-slate-500 hover:text-slate-300'"
      >
        <div class="relative py-1">
          <i class="fa-solid fa-wallet mb-1" style="font-size: 20px;"></i>
          <span v-if="activeMenu === 'wallet'" class="absolute -top-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-blue-400 rounded-full shadow-[0_0_8px_#60a5fa]"></span>
        </div>
        <span 
          class="text-[10px] uppercase tracking-widest font-bold"
          :class="activeMenu === 'wallet' ? 'opacity-100' : 'opacity-70'"
        >
          Dompet
        </span>
      </NuxtLink>

      <NuxtLink
        :to="t('nav-chat')"
        @click="setActiveMenu('chat')"
        class="relative flex flex-col items-center justify-center flex-1 transition-all duration-300"
        :class="activeMenu === 'chat' ? 'text-blue-400' : 'text-slate-500 hover:text-slate-300'"
      >
        <div class="relative py-1">
          <i class="fa-solid fa-headset mb-1" style="font-size: 20px;"></i>
          <span v-if="activeMenu === 'chat'" class="absolute -top-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-blue-400 rounded-full shadow-[0_0_8px_#60a5fa]"></span>
        </div>
        <span
          class="text-[8px] uppercase tracking-wider font-bold text-center leading-tight max-w-[60px]"
          :class="activeMenu === 'chat' ? 'opacity-100' : 'opacity-70'"
        >
          PERKHIDMAT<br>PELANGGAN
        </span>
      </NuxtLink>

      <NuxtLink
        :to="t('nav-my-account')"
        @click="setActiveMenu('my-account')"
        class="relative flex flex-col items-center justify-center flex-1 transition-all duration-300"
        :class="activeMenu === 'my-account' ? 'text-blue-400' : 'text-slate-500 hover:text-slate-300'"
      >
        <div class="relative py-1">
          <i class="fa-solid fa-user mb-1" style="font-size: 20px;"></i>
          <span v-if="activeMenu === 'my-account'" class="absolute -top-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-blue-400 rounded-full shadow-[0_0_8px_#60a5fa]"></span>
        </div>
        <span
          class="text-[10px] uppercase tracking-widest font-bold"
          :class="activeMenu === 'my-account' ? 'opacity-100' : 'opacity-70'"
        >
          SAYA
        </span>
      </NuxtLink>
    </nav>
  </div>
</template>

<script lang="ts" setup>
import { ref } from "vue";

const { t, setLocale } = useI18n();

const props = defineProps<{
    title: string,
    type: string,
}>()

const activeMenu = ref(props.title);

const setActiveMenu = (menu: string) => {
  activeMenu.value = menu;
};
</script>

<style scoped>
/* Animasi halus saat berpindah menu */
nav a {
  -webkit-tap-highlight-color: transparent;
}

/* Mengatur agar teks tidak wrap pada layar kecil */
span {
  white-space: nowrap;
}

/* Efek cahaya halus di belakang menu aktif */
nav a.text-blue-400::after {
  content: "";
  position: absolute;
  bottom: -5px;
  left: 50%;
  transform: translateX(-50%);
  width: 20px;
  height: 20px;
  background: rgba(37, 99, 235, 0.15);
  filter: blur(10px);
  border-radius: 50%;
  z-index: -1;
}
</style>