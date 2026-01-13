<template>
  <section class="relative py-12 overflow-hidden bg-[#0A052E]">
    <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-blue-600 opacity-5 blur-[120px] rounded-full -z-10"></div>

    <AtomsContainer>
      <div class="relative group">
        <div
          class="flex absolute top-1/2 -left-4 md:-left-6 -translate-y-1/2 z-20 transition-all duration-500 ease-out"
          :class="prevIsVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-75 pointer-events-none'"
        >
          <button 
            @click="scrollToLeft"
            type="button"
            class="p-3 rounded-full bg-white bg-opacity-10 backdrop-blur-xl border border-white border-opacity-20 text-white shadow-2xl hover:bg-blue-600 hover:bg-opacity-40 hover:border-blue-400 transition-all active:scale-90"
          >
            <IconsPrevIco class="w-6 h-6" />
          </button>
        </div>

        <div
          class="flex absolute top-1/2 -right-4 md:-right-6 -translate-y-1/2 z-20 transition-all duration-500 ease-out"
          :class="nextIsVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-75 pointer-events-none'"
        >
          <button 
            @click="scrollToRight"
            type="button"
            class="p-3 rounded-full bg-white bg-opacity-10 backdrop-blur-xl border border-white border-opacity-20 text-white shadow-2xl hover:bg-blue-600 hover:bg-opacity-40 hover:border-blue-400 transition-all active:scale-90"
          >
            <IconsNextIco class="w-6 h-6" />
          </button>
        </div>

        <div
          ref="sliderRef"
          @scroll="initScroll"
          class="flex items-stretch gap-6 overflow-x-auto invisible-scroll snap-x snap-mandatory py-4"
        >
          <div
            v-for="(banner, index) in banners || []"
            :key="index"
            class="w-10/12 min-w-[83%] xs:w-80 xs:min-w-[20rem] md:w-4/12 md:min-w-[33%] lg:w-3/12 lg:min-w-[25%] snap-center"
          >
            <div class="relative h-full rounded-[2rem] overflow-hidden border border-white border-opacity-10 bg-white bg-opacity-5 backdrop-blur-sm transition-all duration-500 hover:border-blue-500 hover:border-opacity-30 hover:bg-opacity-10 shadow-xl">
              <CardsRecentPod
                :title="banner.title"
                duration=""
                href="#"
                :cover-image="`https://cms.flexyduit.com${fixStoragePath(banner.image)}`"
              />
              <div class="absolute inset-0 pointer-events-none bg-gradient-to-t from-[#0A052E] via-transparent to-transparent opacity-60"></div>
            </div>
          </div>
        </div>
      </div>
    </AtomsContainer>
  </section>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { getCookie, getSetting } from "@/composables/utils";

const sliderRef = ref<HTMLElement | null>(null);
const nextIsVisible = ref(false);
const prevIsVisible = ref(false);
const banners = ref([]);
const settings = ref(null);

const initScroll = (): void => {
  const el = sliderRef.value;
  if (!el) return;
  prevIsVisible.value = el.scrollLeft > 10;
  nextIsVisible.value = el.scrollLeft < el.scrollWidth - el.offsetWidth - 10;
};

const scrollToLeft = (): void => {
  sliderRef.value?.scrollBy({ left: -300, behavior: 'smooth' });
};

const scrollToRight = (): void => {
  sliderRef.value?.scrollBy({ left: 300, behavior: 'smooth' });
};

const fetchLoan = async () => {
  const token = getCookie("token");
  try {
    const response = await fetch("https://cms.flexyduit.com/api/v1/banner", {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    const data = await response.json();
    banners.value = data?.data ?? [];
    setTimeout(initScroll, 500);
  } catch (error) {
    console.error(error);
  }
};

const fixStoragePath = (path: string | null) => {
  if (!path) return "";
  return path.startsWith('/storage/') 
    ? path.replace('/storage/', '/storage/app/public/') 
    : path;
};

onMounted(async () => {
  await fetchLoan();
  settings.value = await getSetting();
  initScroll();
});

const homeBackgroundStyle = computed(() => {
  if (settings.value?.background_home) {
    return {
      backgroundImage: `url('https://cms.flexyduit.com/${settings.value.background_home}')`,
      backgroundSize: 'cover'
    };
  }
  return {};
});
</script>

<style scoped>
.invisible-scroll::-webkit-scrollbar {
  display: none;
}
.invisible-scroll {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>