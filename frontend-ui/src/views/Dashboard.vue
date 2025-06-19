<template>
  <div class="dashboard">
    <h1>Dashboard</h1>
    <div v-if="loading">Loading...</div>
    <div v-else>
      <p>Devices online: {{ stats.devices_online }}</p>
      <p>Orphan devices: {{ stats.orphan_devices }}</p>
      <p>Uplinks today: {{ stats.uplinks_today }}</p>
      <p>Last seen device: {{ stats.last_seen_device.deveui }} at {{ stats.last_seen_device.timestamp }}</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const stats = ref({
  devices_online: 0,
  orphan_devices: 0,
  uplinks_today: 0,
  last_seen_device: { deveui: '-', timestamp: '-' }
})
const loading = ref(true)

onMounted(async () => {
  try {
    const res = await fetch('/v1/devices/api/summary')
    stats.value = await res.json()
  } catch {
    stats.value = {
      devices_online: 0,
      orphan_devices: 0,
      uplinks_today: 0,
      last_seen_device: { deveui: '-', timestamp: '-' }
    }
  } finally {
    loading.value = false
  }
})
</script>

<style>
.dashboard {
  font-family: Arial, sans-serif;
  padding: 1rem;
}
</style>
