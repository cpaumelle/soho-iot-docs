<template>
  <div class="locations-manager">
    <h1>Locations Manager</h1>

    <button @click="startNewSite">+ New Site</button>

    <ul>
      <li v-for="site in sites" :key="site.id">
        <strong
          @click="toggleSite(site)"
          :style="{ cursor: 'pointer', textDecoration: isSiteExpanded(site) ? 'underline' : 'none' }"
        >
          {{ site.name }}
        </strong>
        <button @click="editSite(site)">Edit</button>
        <button @click="deleteSite(site)">Delete</button>

        <ul v-if="isSiteExpanded(site)">
          <li v-for="floor in site.floors" :key="floor.id">
            <strong
              @click="toggleFloor(floor)"
              :style="{ cursor: 'pointer', fontWeight: isFloorExpanded(floor) ? 'bold' : 'normal' }"
            >
              Floor: {{ floor.name }}
            </strong>
            <button @click="editFloor(floor)">Edit</button>
            <button @click="deleteFloor(floor)">Delete</button>

            <ul v-if="isFloorExpanded(floor)">
              <li v-for="room in floor.rooms" :key="room.id">
                <strong
                  @click="toggleRoom(room)"
                  :style="{ cursor: 'pointer', fontStyle: isRoomExpanded(room) ? 'italic' : 'normal' }"
                >
                  Room: {{ room.name }}
                </strong>
                <button @click="editRoom(room)">Edit</button>
                <button @click="deleteRoom(room)">Delete</button>

                <ul v-if="isRoomExpanded(room)">
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

    <!-- Floor Modal -->
    <div v-if="modals.floor">
      <h3>{{ editingFloor.id ? 'Edit Floor' : 'New Floor' }}</h3>
      <input v-model="editingFloor.name" placeholder="Floor Name" />
      <button @click="saveFloor">Save</button>
      <button @click="closeModal('floor')">Cancel</button>
    </div>

    <!-- Room Modal -->
    <div v-if="modals.room">
      <h3>{{ editingRoom.id ? 'Edit Room' : 'New Room' }}</h3>
      <input v-model="editingRoom.name" placeholder="Room Name" />
      <button @click="saveRoom">Save</button>
      <button @click="closeModal('room')">Cancel</button>
    </div>

    <!-- Zone Modal -->
    <div v-if="modals.zone">
      <h3>{{ editingZone.id ? 'Edit Zone' : 'New Zone' }}</h3>
      <input v-model="editingZone.name" placeholder="Zone Name" />
      <button @click="saveZone">Save</button>
      <button @click="closeModal('zone')">Cancel</button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useLocations } from '../composables/useLocations'

const {
  sites,
  editingSite,
  editingFloor,
  editingRoom,
  editingZone,
  modals,
  fetchSites,
  startNewSite,
  editSite,
  saveSite,
  deleteSite,
  startNewFloor,
  editFloor,
  saveFloor,
  deleteFloor,
  startNewRoom,
  editRoom,
  saveRoom,
  deleteRoom,
  startNewZone,
  editZone,
  saveZone,
  deleteZone,
} = useLocations()

// Track which items are expanded
const expandedSites = ref(new Set())
const expandedFloors = ref(new Set())
const expandedRooms = ref(new Set())

function toggleSite(site) {
  if (expandedSites.value.has(site.id)) {
    expandedSites.value.delete(site.id)
  } else {
    expandedSites.value.add(site.id)
  }
}

function isSiteExpanded(site) {
  return expandedSites.value.has(site.id)
}

function toggleFloor(floor) {
  if (expandedFloors.value.has(floor.id)) {
    expandedFloors.value.delete(floor.id)
  } else {
    expandedFloors.value.add(floor.id)
  }
}

function isFloorExpanded(floor) {
  return expandedFloors.value.has(floor.id)
}

function toggleRoom(room) {
  if (expandedRooms.value.has(room.id)) {
    expandedRooms.value.delete(room.id)
  } else {
    expandedRooms.value.add(room.id)
  }
}

function isRoomExpanded(room) {
  return expandedRooms.value.has(room.id)
}

fetchSites()
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
