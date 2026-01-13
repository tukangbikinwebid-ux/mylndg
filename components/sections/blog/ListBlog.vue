<template>
  <section class="pt-6 md:pt-6 py-20">
    <CardsNavigasiHeader title="Artikel" type="menu" />
    <AtomsContainer>
      <div class="lg:h-full w-full">
        <div class="relative">
          <h3
            class="text-dark-800 dark:text-dark-200 font-semibold text-xl pt-14"
          >
            Selamat datang di halaman artikel islami. Di sini, Anda dapat
            menemukan berbagai informasi artikel islami.
          </h3>
          <div
            class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 pt-14"
          >
            <div
              v-for="(blog, index) in blogPosts"
              :key="index"
              style="background-color: #775b4c"
              class="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-lg transform transition duration-300 ease-in-out hover:scale-105"
            >
              <img
                :src="blog.image"
                :alt="blog.title"
                class="object-cover rounded-xl w-full h-60 opacity-0 animate-fade-in transition duration-500 ease-in-out"
              />
              <h3
                class="mt-4 text-dark-800 dark:text-dark-200 text-lg font-semibold"
                style="color: #fefaf5"
              >
                {{ blog.title }}
              </h3>
              <p
                class="text-dark-600 dark:text-dark mt-2"
                style="color: #fefaf5"
              >
                {{ blog.description }}
              </p>
              <button
                class="mt-4 px-4 py-2 bg-primary text-white rounded-lg hover:bg-opacity-80 transition duration-300"
                @click="goToBlog(blog.id)"
                style="background-color: #d6aa84"
              >
                {{ t("see-detail") }}
              </button>
            </div>
          </div>
        </div>
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

const blogPosts = [
  {
    id: 1,
    image: "/images/vission.webp",
    title: "Strategi Digital Marketing 2025",
    description:
      "Bagaimana strategi pemasaran digital berkembang dan apa yang harus dilakukan bisnis agar tetap kompetitif.",
  },
  {
    id: 2,
    image: "/images/vission.webp",
    title: "Tips Desain UI/UX untuk Website Modern",
    description:
      "Pahami tren terbaru dalam UI/UX dan bagaimana mendesain website yang menarik dan fungsional.",
  },
  {
    id: 3,
    image: "/images/vission.webp",
    title: "AI dan Masa Depan Teknologi",
    description:
      "Bagaimana kecerdasan buatan akan mengubah cara kita bekerja dan hidup di masa depan.",
  },
  {
    id: 4,
    image: "/images/vission.webp",
    title: "Mengoptimalkan SEO untuk Bisnis Anda",
    description:
      "Teknik SEO terbaru untuk meningkatkan visibilitas website di mesin pencari.",
  },
  {
    id: 5,
    image: "/images/vission.webp",
    title: "Pentingnya Cybersecurity di Era Digital",
    description:
      "Bagaimana melindungi data pribadi dan bisnis dari ancaman siber.",
  },
  {
    id: 6,
    image: "/images/vission.webp",
    title: "Membangun Startup Teknologi",
    description:
      "Panduan langkah demi langkah dalam membangun startup teknologi yang sukses.",
  },
];

const goToBlog = (id) => {
  // Ganti dengan navigasi ke halaman blog detail
  router.push(`/blog/${id}`);
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
