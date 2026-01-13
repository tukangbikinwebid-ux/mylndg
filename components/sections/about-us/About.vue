<template>
    <section class="pt-14 md:pt-14">
      <AtomsContainer>
        <div class="grid md:grid-cols-2 gap-10 xl:gap-14 relative">
          <div class="flex md:h-full">
            <div
              class="w-full md:h-full rounded-3xl bg-white dark:bg-body shadow-lg shadow-box-shadow border border-box-border"
            >
              <img
                src="/images/about.webp"
                alt="Illustratuin about"
                width="500"
                class="w-full h-full object-cover rounded-2xl"
              />
            </div>
          </div>
          <div class="md:py-2 lg:py-4 relative">
            <div class="absolute right-0 top-0 h-full w-full flex justify-end">
              <span class="flex opacity-20">
                <span
                  class="w-16 h-32 rounded-l-full flex bg-primary blur-2xl"
                ></span>
                <span
                  class="w-16 h-32 rounded-r-full flex bg-[#f88fc2] blur-2xl mt-14"
                ></span>
              </span>
            </div>
            <div class="relative">
              <AtomsTitle texte="Tentang Kami" id="about" />
              <p class="text-dark-600 dark:text-dark pt-5">
                PT. Auto Electrician Indonesia
                  adalah perusahaan yang
                  bergerak di bidang layanan
                  dan solusi kelistrikan
                  khususnya untuk sektor
                  otomotif dan industri alat
                  berat. Kami berdedikasi
                  untuk memberikan layanan
                  berkualitas tinggi dengan
                  mengutamakan kepuasan
                  pelanggan, efisiensi kerja,
                  dan inovasi teknologi
              </p>
              <div class="pt-5">
                <AtomsTitle texte="Sejarah" id="why-join" />
                <p class="text-dark-600 dark:text-dark pt-5">
                    PT. Auto Electrician Indonesia bermula dari sebuah komunitas bernama Auto Electrician Team yang terbentuk pada tanggal 24 November 2022,
                    yang terdiri dari para profesional dengan berbagai latar belakang di industri alat berat dan kelistrikan, termasuk Auto Electrician, High Voltage,
                    Mechanic Instrument, serta bidang terkait lainnya. Komunitas ini didirikan dengan tujuan untuk saling berbagi ilmu, pengalaman dan peluang kerja dalam
                    industri alat berat, hingga akhirnya berkembang menjadi sebuah perusahaan yang berfokus pada penyediaan layanan berkualitas tinggi.
                </p>
                <p class="text-dark-600 dark:text-dark pt-5">
                    Sebagai perusahaan yang berawal dari komunitas, kami memahami betul kebutuhan teknis dilapangan dan berupaya memberikan solusi terbaik
                    melalui layanan kami. Kami terus berkembang dengan mengadopsi teknologi terbaru serta mengedepankan standar keselamatan dan kualitas
                    dalam setiap pekerjaan yang kami lakukan.
                </p>
              </div>
            </div>
          </div>
        </div>
      </AtomsContainer>
    </section>
  </template>
  