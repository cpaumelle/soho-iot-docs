<template>
  <div class="locations-manager">
    <h1>Locations Manager</h1>

    <button @click="startNewSite">+ New Site</button>

    <ul>
      <li v-for="site in sites" :key="site.id">
        <strong @click="selectSite(site)" :style="{ cursor: 'pointer', textDecoration: selectedSite?.id === site.id ? 'underline' : 'none' }">
          {{ site.name }}
        </strong>
        <button @click="editSite(site)">Edit</button>
        <button @click="deleteSite(site)">Delete</button>

        <ul v-if="selectedSite?.id === site.id">
          <li v-for="floor in site.floors" :key="floor.id">
            <span @click="selectFloor(floor)" :style="{ cursor: 'pointer', fontWeight: selectedFloor?.id === floor.id ? 'bold' : 'normal' }">
              Floor: {{ floor.name }}
            </span>
            <button @click="editFloor(floor)">Edit</button>
            <button @click="deleteFloor(floor)">Delete</button>

            <ul v-if="selectedFloor?.id === floor.id">
              <li v-for="room in floor.rooms" :key="room.id">
                <span @click="selectRoom(room)" :style="{ cursor: 'pointer', fontStyle: selectedRoom?.id === room.id ? 'italic' : 'normal' }">
                  Room: {{ room.name }}
                </span>
                <button @click="editRoom(room)">Edit</button>
                <button @click="deleteRoom(room)">Delete</button>

                <ul v-if="selectedRoom?.id === room.id">
                  <li v-for="zone in room.zones" :key="zone.id">
                    Zone: {{ zone.name }}
                    <button @click="editZone(zone)">Edit</button>
                    <button @click="deleteZone(zone)">Delete</button>
                  </li>
                  <li><button @click="startNewZone">+ New Zone</button></li>
                </ul>
              </li>
              <li><button @click="startNewRoom">+ New Room</button></li>
            </ul>
          </li>
          <li><button @click="startNewFloor">+ New Floor</button></li>
        </ul>
      </li>
    </ul>

    <!-- Site Modal -->
    <div v-if="modals.site">
      <h3>{{ editingSite.id ? 'Edit Site' : 'New Site' }}</h3>
      <input v-model="editingSite.name" placeholder="Site Name" />
      <input v-model="editingSite.address" placeholder="Address" />
      <input v-model="editingSite.latitude" placeholder="Latitude" />
      <input v-model="editingSite.longitude" placeholder="Longitude" />
      <input v-model="editingSite.icon_name" placeholder="Icon (emoji or text)" />
      <button @click="saveSite">Save</button>
      <button @click="closeModal('site')">Cancel</button>
    </div>

    <!-- You can add similar modals for Floor, Room, Zone -->

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
  modals,
  fetchSites,
  selectSite,
  selectFloor,
  selectRoom,
  startNewSite,
  editSite,
  saveSite,
  deleteSite,
  closeModal,
  // Add floor, room, zone handlers here as implemented in composable
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
  padding-left: 0;
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
</style>
