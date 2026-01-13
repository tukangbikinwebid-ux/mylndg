<template>
    <section class="pt-20 md:pt-24 py-20">
        <AtomsContainer>
            <div class="grid md:grid-cols-1 gap-10 xl:gap-14 relative">
                <div class="md:py-2 lg:py-4 relative">
                    <div class="absolute left-0 top-0 h-full w-full flex justify-end">
                        <span class="flex opacity-20">
                            <span class="w-16 h-32 rounded-l-full flex bg-primary blur-2xl"></span>
                            <span class="w-16 h-32 rounded-r-full flex bg-[#f88fc2] blur-2xl mt-14"></span>
                        </span>
                    </div>
                    <div class="relative">
                        <AtomsTitle texte="VERIFIED TEAM" />
                        <h3 class="text-dark-800 dark:text-dark-200 font-semibold text-xl pt-8">
                            Di PT. Auto Electrician Indonesia, tim kami adalah fondasi  perusahaan. Kami bangga memiliki kelompok profesional  terampil dan berdedikasi, yang membawa keahlian mereka ke  proyek. Tim kami berkomitmen untuk memberikan layanan  dan memastikan kepuasan pelanggan.
                        </h3>
                    </div>
                </div>
            </div>
        </AtomsContainer>
        <AtomsContainer>
            <div class="lg:h-full w-full">
                <div class="relative">
                    <AtomsTitle class="pt-12 py-6" texte="Our Team" />
                    <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                        <div v-for="(member, index) in teamMembers" :key="index" class="text-center transform transition duration-300 ease-in-out hover:scale-105">
                            <img 
                                :src="member.image" 
                                alt="Team Member" 
                                class="object-cover rounded-xl w-full h-80 opacity-0 animate-fade-in transition duration-500 ease-in-out"
                            />
                            <h3 class="mt-4 text-dark-800 dark:text-dark-200 text-lg font-semibold">{{ member.name }}</h3>
                            <p class="text-dark-800 dark:text-dark-200 ">{{ member.position }}</p>
                        </div>
                    </div>
                </div>
            </div>
        </AtomsContainer>
    </section>
</template>

<script>
export default {
  setup() {
    const teamMembers = [
      { image: '/images/team1.webp', name: 'John Doe', position: 'CEO' },
      { image: '/images/team1.webp', name: 'Jane Smith', position: 'CTO' },
      { image: '/images/team1.webp', name: 'Mike Johnson', position: 'Lead Designer' },
      { image: '/images/team1.webp', name: 'Emily Davis', position: 'Marketing Manager' },
      { image: '/images/team1.webp', name: 'Emily Davis', position: 'Marketing Manager' },
      { image: '/images/team1.webp', name: 'Emily Davis', position: 'Marketing Manager' },
    ];
    return { teamMembers };
  },
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
