<template>
  <div class="locations-manager">
    <h1>Locations Manager</h1>

    <button @click="startNewSite">+ New Site</button>

    <ul>
      <li v-for="site in sites" :key="site.id">
        <span @click="selectSite(site)" style="cursor: pointer;">
          {{ site.name }}
          <span v-if="site.floors?.length">▶</span>
        </span>
        <button @click="editSite(site)">✏️</button>
        <button @click="deleteSite(site)">🗑️</button>

        <ul v-if="selectedSite?.id === site.id && site.floors?.length">
          <li v-for="floor in site.floors" :key="floor.id">
            <span @click="selectFloor(floor)" style="cursor: pointer;">
              Floor: {{ floor.name }}
              <span v-if="floor.rooms?.length">▶</span>
            </span>
            <button @click="editFloor(floor)">✏️</button>
            <button @click="deleteFloor(floor)">🗑️</button>

            <ul v-if="selectedFloor?.id === floor.id && floor.rooms?.length">
              <li v-for="room in floor.rooms" :key="room.id">
                <span style="cursor: default;">
                  Room: {{ room.name }}
                  <span v-if="room.zones?.length">▶</span>
                </span>
                <!-- TODO: Add edit/delete for room -->

                <ul v-if="selectedRoom?.id === room.id && room.zones?.length">
                  <li v-for="zone in room.zones" :key="zone.id">
                    Zone: {{ zone.name }}
                    <!-- TODO: Add edit/delete for zone -->
                  </li>
                  <!-- TODO: Add new zone button -->
                </ul>
              </li>
              <!-- TODO: Add new room button -->
            </ul>
          </li>
          <li><button @click="startNewFloor">+ New Floor</button></li>
        </ul>
      </li>
    </ul>

    <!-- Site Modal -->
    <div v-if="modals.site" class="modal">
      <h3>{{ editingSite.id ? 'Edit Site' : 'New Site' }}</h3>
      <input v-model="editingSite.name" placeholder="Site Name" />
      <input v-model="editingSite.address" placeholder="Address" />
      <input v-model="editingSite.latitude" placeholder="Latitude" />
      <input v-model="editingSite.longitude" placeholder="Longitude" />
      <input v-model="editingSite.icon_name" placeholder="Icon (emoji or text)" />
      <button @click="saveSite">Save</button>
      <button @click="closeModal('site')">Cancel</button>
    </div>

    <!-- Floor Modal -->
    <div v-if="modals.floor" class="modal">
      <h3>{{ editingFloor.id ? 'Edit Floor' : 'New Floor' }}</h3>
      <input v-model="editingFloor.name" placeholder="Floor Name" />
      <button @click="saveFloor">Save</button>
      <button @click="closeModal('floor')">Cancel</button>
    </div>

  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useLocations } from '../composables/useLocations'

const {
  sites,
  selectedSite,
  selectedFloor,
  selectedRoom,
  editingSite,
  editingFloor,
  modals,
  fetchSites,
  selectSite,
  selectFloor,
  startNewSite,
  editSite,
  saveSite,
  deleteSite,
  startNewFloor,
  editFloor,
  saveFloor,
  deleteFloor,
  closeModal,
} = useLocations()

onMounted(() => {
  fetchSites()
})
</script>

<style scoped>
.locations-manager {
  font-family: Arial, sans-serif;
  max-width: 700px;
  margin: 0 auto;
}
ul {
  list-style-type: none;
  padding-left: 1rem;
}
li {
  margin-bottom: 0.5rem;
}
button {
  margin-left: 0.5rem;
}
input {
  display: block;
  margin-bottom: 0.5rem;
  padding: 0.3rem;
  width: 100%;
  box-sizing: border-box;
}
.modal {
  background-color: #f9f9f9;
  padding: 1rem;
  margin-top: 1rem;
  border: 1px solid #ccc;
}
</style>
