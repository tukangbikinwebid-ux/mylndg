<template>
  <section class="pt-8 md:pt-6 py-24">
    <!-- Cards Section -->
    <AtomsContainer>
      <div class="lg:h-full w-full mt-[-80px]">
        <div class="relative">
          <h2 class="text-xl font-bold mb-4">Riwayat Transaksi</h2>

          <div v-if="isLoading" class="text-gray-500">Memuat data...</div>
          <div v-else-if="errorMessage" class="text-red-500">
            {{ errorMessage }}
          </div>

          <div v-else class="space-y-4">
            <div
              v-for="(item, index) in transactionHistory"
              :key="index"
              class="bg-white dark:bg-white p-4 rounded-xl shadow-lg transform transition duration-300 ease-in-out hover:scale-105"
            >
              <div class="flex items-center justify-between w-full">
                <div class="flex items-center space-x-4">
                  <div class="flex flex-col">
                    <h3 class="text-lg font-semibold text-black">
                      {{ item.description }}
                    </h3>
                    <h4 class="text-sm text-black opacity-80">
                      {{ formatDate(item.created_at) }}
                    </h4>
                  </div>
                </div>
                <!-- Kanan: Nominal -->
                <div class="text-black font-bold">
                  RM {{ item.balance.toLocaleString("en-MY") }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AtomsContainer>
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { getCookie } from "@/composables/utils"; // pastikan util ini tersedia
const { t } = useI18n();

const transactionHistory = ref([]);
const isLoading = ref(false);
const errorMessage = ref("");

const formatDate = (dateStr: string): string => {
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const fetchTransactionHistory = async () => {
  isLoading.value = true;
  errorMessage.value = "";

  const token = getCookie("token");

  if (!token) {
    errorMessage.value = "Token tidak ditemukan. Silakan login ulang.";
    isLoading.value = false;
    return;
  }

  try {
    const response = await fetch(
      "https://cms.mysolutionlending.com/api/v1/wallet/transactions",
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    transactionHistory.value = data?.data.data ?? [];
  } catch (error: any) {
    console.error("Gagal mengambil data:", error);
    errorMessage.value = error.message || "Gagal mengambil data transaksi.";
  } finally {
    isLoading.value = false;
  }
};

onMounted(() => {
  fetchTransactionHistory();
});
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
