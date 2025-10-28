<script setup>
import Navbar from './components/Navbar.vue'
import Footer from './components/Footer.vue'
import XPBar from './components/XPBar.vue'
import LevelIndicator from './components/LevelIndicator.vue'
import StreakCounter from './components/StreakCounter.vue'
</script>

<template>
  <div class="min-h-full bg-background text-textmain">
    <Navbar />

    <!-- Content -->
    <main class="mx-auto max-w-6xl px-4 py-8">
      <!-- Gamification widgets -->
      <section class="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <LevelIndicator />
        <StreakCounter />
        <div class="rounded-xl border border-slate-200 bg-white p-4 shadow-card">
          <XPBar />
        </div>
      </section>

      <!-- Stats -->
      <section class="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div class="rounded-xl border border-slate-200 bg-white p-4 shadow-card">
          <p class="text-xs uppercase tracking-wide text-slate-500">Streak atual</p>
          <p class="mt-2 text-3xl font-bold">12 🔥</p>
        </div>
        <div class="rounded-xl border border-slate-200 bg-white p-4 shadow-card">
          <p class="text-xs uppercase tracking-wide text-slate-500">Hábitos ativos</p>
          <p class="mt-2 text-3xl font-bold">6</p>
        </div>
        <div class="rounded-xl border border-slate-200 bg-white p-4 shadow-card">
          <p class="text-xs uppercase tracking-wide text-slate-500">Conclusão</p>
          <p class="mt-2 text-3xl font-bold">78%</p>
        </div>
      </section>

      <!-- Habit list + Calendar -->
      <div class="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <!-- Habit list -->
        <section class="lg:col-span-1 space-y-3">
          <div class="rounded-xl border border-slate-200 bg-white p-4 shadow-card">
            <div class="flex items-start justify-between">
              <div>
                <h3 class="font-medium">Beber Água</h3>
                <p class="text-sm text-slate-500">8 copos por dia</p>
              </div>
              <span class="rounded-full bg-emerald-50 px-2 py-1 text-xs font-medium text-emerald-700">Diário</span>
            </div>
            <div class="mt-4 flex items-center gap-2">
              <button class="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-3 py-2 text-sm hover:bg-slate-50">
                <span class="material-symbols-rounded">check_circle</span>
                Registar
              </button>
              <button class="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-3 py-2 text-sm hover:bg-slate-50">
                <span class="material-symbols-rounded">edit</span>
                Editar
              </button>
            </div>
          </div>

          <div class="rounded-xl border border-slate-200 bg-white p-4 shadow-card">
            <div class="flex items-start justify-between">
              <div>
                <h3 class="font-medium">Ler</h3>
                <p class="text-sm text-slate-500">20 minutos</p>
              </div>
              <span class="rounded-full bg-indigo-50 px-2 py-1 text-xs font-medium text-indigo-700">Diário</span>
            </div>
            <div class="mt-4 flex items-center gap-2">
              <button class="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-3 py-2 text-sm hover:bg-slate-50">
                <span class="material-symbols-rounded">check_circle</span>
                Registar
              </button>
              <button class="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-3 py-2 text-sm hover:bg-slate-50">
                <span class="material-symbols-rounded">edit</span>
                Editar
              </button>
            </div>
          </div>
        </section>

        <!-- Calendar heatmap -->
        <section class="lg:col-span-2 rounded-xl border border-slate-200 bg-white p-4 shadow-card">
          <div class="flex items-center justify-between">
            <h2 class="text-lg font-semibold">October 2025</h2>
            <div class="flex items-center gap-2">
              <button class="rounded-md border border-slate-200 px-2 py-1 text-sm hover:bg-slate-50">Prev</button>
              <button class="rounded-md border border-slate-200 px-2 py-1 text-sm hover:bg-slate-50">Next</button>
            </div>
          </div>

          <!-- Weekday labels -->
          <div class="mt-4 grid grid-cols-7 text-center text-xs text-slate-500">
            <div>Sun</div>
            <div>Mon</div>
            <div>Tue</div>
            <div>Wed</div>
            <div>Thu</div>
            <div>Fri</div>
            <div>Sat</div>
          </div>

          <!-- Grid -->
          <div class="mt-2 grid grid-cols-7 gap-2">
            <!-- Example cells with varying completion states -->
            <div class="aspect-square rounded-xl bg-slate-100"></div>
            <div class="aspect-square rounded-xl bg-emerald-100"></div>
            <div class="aspect-square rounded-xl bg-emerald-200"></div>
            <div class="aspect-square rounded-xl bg-emerald-300"></div>
            <div class="aspect-square rounded-xl bg-emerald-400"></div>
            <div class="aspect-square rounded-xl bg-emerald-500"></div>
            <div class="aspect-square rounded-xl bg-slate-100"></div>

            <!-- Repeat to fill a month-ish look (static design) -->
            <template v-for="i in 28" :key="i">
              <div class="aspect-square rounded-xl bg-slate-100"></div>
            </template>
          </div>
        </section>
      </div>

      
    </main>
    <Footer />
  </div>
</template>

<style scoped></style>
