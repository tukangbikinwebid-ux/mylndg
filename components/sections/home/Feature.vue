<template>
    <section class="pt-4 md:pt-4" style="margin-top: -40px">
        <AtomsContainer>
            <div class="grid grid-cols-4 sm:grid-cols-4 md:grid-cols-4 gap-1">
                <NuxtLink
                    v-for="(feature, index) in featurePosts"
                    :key="index"
                    :to="`${feature.link}`"
                    class="transform transition duration-300 ease-in-out hover:scale-105 pt-1 py-1 block"
                >
                    <div class="flex justify-center">
                        <img
                            :src="feature.image"
                            :alt="feature.title"
                            class="w-20 h-20 object-contain"
                        />
                    </div>
                    <h3
                        class="text-dark-800 text-center dark:text-dark-200 text-md font-semibold"
                        style="margin-top: -5px"
                    >
                        {{ feature.title }}
                    </h3>
                </NuxtLink>
            </div>
        </AtomsContainer>
    </section>
</template>

<script setup>
import { useRoute, useRouter } from "vue-router";
import { ref, onMounted } from "vue";
const { t } = useI18n();
const route = useRoute();
const router = useRouter();

const featurePosts = [
    {
        id: 1,
        image: "/images/ICON1.png",
        title: t("menu.masjid"),
        link: "/wallet",
    },
    {
        id: 2,
        image: "/images/ICON2.png",
        title: t("menu.doa"),
        link: "/wallet",
    },
    {
        id: 3,
        image: "/images/ICON3.png",
        title: t("menu.donation"),
        link: "/wallet",
    },
];

const goToFeature = (id) => {
    // Ganti dengan navigasi ke halaman feature detail
    router.push(`/feature/${id}`);
};
</script>

<style>
@keyframes fade-in {
    from {
        opacity: 0;
        transform: translateY(20px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

.animate-fade-in {
    animation: fade-in 1s ease-out forwards;
}
</style>
