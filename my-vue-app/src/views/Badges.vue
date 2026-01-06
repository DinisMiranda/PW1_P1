<template>
  <div>
    <h2 class="mb-6 text-2xl font-bold font-solo text-white uppercase tracking-wider">Badges</h2>

    <div class="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
      <BadgeCard
        title="Primeiro Passo"
        description="Completa o 1º hábito"
        icon="footprint"
        :isLocked="!userStore.badges.includes('primeiro-passo')"
      />
      <BadgeCard
        title="Foco Diário"
        description="7 dias seguidos"
        icon="local_fire_department"
        :isLocked="!userStore.badges.includes('foco-diario')"
      />
      <BadgeCard
        title="Produtivo"
        description="5 hábitos num dia"
        icon="workspace_premium"
        :isLocked="!userStore.badges.includes('produtivo')"
      />
      <BadgeCard
        title="Mestre do Hábito"
        description="Atinge nível 10"
        icon="military_tech"
        :isLocked="!userStore.badges.includes('mestre')"
      />
      <BadgeCard
        title="Ecológico"
        description="Hábito verde"
        icon="ecology"
        :isLocked="!userStore.badges.includes('ecologico')"
      />
      <BadgeCard
        title="Leitor"
        description="100 páginas"
        icon="menu_book"
        :isLocked="!userStore.badges.includes('leitor')"
      />
    </div>

    <div class="mt-8 border-2 border-primary/50 bg-card-solo p-6 hover:border-primary hover:glow-cyan transition-all">
      <h3 class="mb-4 font-bold font-solo text-primary uppercase tracking-wider">Badges Desbloqueadas: <span class="text-white text-glow">{{ userStore.badges.length }}</span></h3>
      <div v-if="userStore.badges.length === 0" class="text-sm text-white/60">
        Ainda não desbloqueaste nenhuma badge. Continua a completar hábitos!
      </div>
      <div v-else class="flex flex-wrap gap-2">
        <span
          v-for="badge in userStore.badges"
          :key="badge"
          class="px-3 py-1 text-sm font-bold font-solo border-2 border-primary/50 bg-primary/10 text-primary"
        >
          {{ getBadgeName(badge) }}
        </span>
      </div>
    </div>
  </div>
</template>

<script setup>
import BadgeCard from '../components/BadgeCard.vue'
import { useUserStore } from '../stores/user'

const userStore = useUserStore()

function getBadgeName(badge) {
  const names = {
    'primeiro-passo': 'Primeiro Passo',
    'foco-diario': 'Foco Diário',
    'produtivo': 'Produtivo',
    'mestre': 'Mestre do Hábito',
    'ecologico': 'Ecológico',
    'leitor': 'Leitor'
  }
  return names[badge] || badge
}
</script>

<style scoped></style>

