<script setup>
import Navbar from './components/Navbar.vue'
import Footer from './components/Footer.vue'
</script>

<template>
  <div class="min-h-screen flex flex-col bg-background">
    <Navbar />
    <main class="flex-1 p-4 md:p-6">
      <router-view />
    </main>
    <Footer />
  </div>
</template>

<style scoped></style>
