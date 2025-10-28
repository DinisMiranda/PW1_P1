<script setup></script>

<template>
  <div class="min-h-full bg-slate-50 text-slate-900">
    <!-- Header -->
    <header class="sticky top-0 z-10 border-b border-slate-200 bg-white/80 backdrop-blur">
      <div class="mx-auto max-w-5xl px-4 py-4 flex items-center justify-between">
        <h1 class="text-xl font-semibold tracking-tight">Habit Tracker</h1>
        <button class="inline-flex items-center gap-2 rounded-md bg-slate-900 px-3 py-2 text-white hover:bg-slate-800 active:bg-slate-900">
          <span class="text-sm font-medium">Add Habit</span>
          <span aria-hidden>＋</span>
        </button>
      </div>
    </header>

    <!-- Content -->
    <main class="mx-auto max-w-5xl px-4 py-8">
      <!-- Stats -->
      <section class="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div class="rounded-lg border border-slate-200 bg-white p-4">
          <p class="text-xs uppercase tracking-wide text-slate-500">Current Streak</p>
          <p class="mt-2 text-3xl font-bold">12</p>
        </div>
        <div class="rounded-lg border border-slate-200 bg-white p-4">
          <p class="text-xs uppercase tracking-wide text-slate-500">Habits Tracked</p>
          <p class="mt-2 text-3xl font-bold">6</p>
        </div>
        <div class="rounded-lg border border-slate-200 bg-white p-4">
          <p class="text-xs uppercase tracking-wide text-slate-500">Completion</p>
          <p class="mt-2 text-3xl font-bold">78%</p>
        </div>
      </section>

      <!-- Habit list + Calendar -->
      <div class="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <!-- Habit list -->
        <section class="lg:col-span-1 space-y-3">
          <div class="rounded-lg border border-slate-200 bg-white p-4">
            <div class="flex items-start justify-between">
              <div>
                <h3 class="font-medium">Drink Water</h3>
                <p class="text-sm text-slate-500">8 cups a day</p>
              </div>
              <span class="rounded-full bg-emerald-50 px-2 py-1 text-xs font-medium text-emerald-700">Daily</span>
            </div>
            <div class="mt-4 flex items-center gap-2">
              <button class="rounded-md border border-slate-200 px-3 py-2 text-sm hover:bg-slate-50">Log</button>
              <button class="rounded-md border border-slate-200 px-3 py-2 text-sm hover:bg-slate-50">Edit</button>
            </div>
          </div>

          <div class="rounded-lg border border-slate-200 bg-white p-4">
            <div class="flex items-start justify-between">
              <div>
                <h3 class="font-medium">Read</h3>
                <p class="text-sm text-slate-500">20 minutes</p>
              </div>
              <span class="rounded-full bg-indigo-50 px-2 py-1 text-xs font-medium text-indigo-700">Daily</span>
            </div>
            <div class="mt-4 flex items-center gap-2">
              <button class="rounded-md border border-slate-200 px-3 py-2 text-sm hover:bg-slate-50">Log</button>
              <button class="rounded-md border border-slate-200 px-3 py-2 text-sm hover:bg-slate-50">Edit</button>
            </div>
          </div>
        </section>

        <!-- Calendar heatmap -->
        <section class="lg:col-span-2 rounded-lg border border-slate-200 bg-white p-4">
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
            <div class="aspect-square rounded bg-slate-100"></div>
            <div class="aspect-square rounded bg-emerald-100"></div>
            <div class="aspect-square rounded bg-emerald-200"></div>
            <div class="aspect-square rounded bg-emerald-300"></div>
            <div class="aspect-square rounded bg-emerald-400"></div>
            <div class="aspect-square rounded bg-emerald-500"></div>
            <div class="aspect-square rounded bg-slate-100"></div>

            <!-- Repeat to fill a month-ish look (static design) -->
            <template v-for="i in 28" :key="i">
              <div class="aspect-square rounded bg-slate-100"></div>
            </template>
          </div>
        </section>
      </div>
    </main>
  </div>
</template>

<style scoped></style>
