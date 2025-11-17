<script setup>
import Navbar from './components/Navbar.vue'
import Footer from './components/Footer.vue'
</script>

<template>
  <div class="min-h-full bg-background text-textmain">
    <Navbar />
    <main class="mx-auto max-w-6xl px-4 py-8">
      <router-view />
    </main>
    <Footer />
  </div>
</template>

<style scoped></style>
