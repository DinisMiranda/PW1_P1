<template>
  <div>
    <p>Count: {{ count }}</p>
    <button @click="increment">Add {{ step }}</button>
  </div>
</template>

<script>
export default {
  props: {
    initialCount: {
      type: Number,
      default: 0
    },
    step: {
      type: Number,
      default: 1
    }
  },
  data() {
    return {
      count: this.initialCount
    }
  },
  methods: {
    increment() {
      this.count += this.step
    }
  }
}
</script>

<style scoped></style>
