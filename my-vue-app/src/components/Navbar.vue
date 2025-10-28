<template>
  <header class="sticky top-0 z-10 border-b border-slate-200 bg-white/80 backdrop-blur">
    <div class="mx-auto max-w-6xl px-4 py-4 flex items-center justify-between">
      <div class="flex items-center gap-2">
        <span class="material-symbols-rounded text-primary">bolt</span>
        <h1 class="text-xl font-semibold tracking-tight font-display">LevelUp Habits</h1>
      </div>
      <nav class="hidden md:flex items-center gap-6 text-sm">
        <a href="#" class="hover:text-primary">Dashboard</a>
        <a href="#" class="hover:text-primary">Hábitos</a>
        <a href="#" class="hover:text-primary">Estatísticas</a>
        <a href="#" class="hover:text-primary">Badges</a>
        <a href="#" class="hover:text-primary">Quotes</a>
      </nav>
      <div class="flex items-center gap-2">
        <button class="inline-flex items-center gap-2 rounded-xl bg-primary px-3 py-2 text-white hover:brightness-95">
          <span class="material-symbols-rounded">add</span>
          <span class="text-sm font-medium">Novo Hábito</span>
        </button>
        <button class="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 hover:bg-slate-50">
          <span class="material-symbols-rounded">dark_mode</span>
        </button>
      </div>
    </div>
  </header>
</template>

<script setup></script>

<style scoped></style>


