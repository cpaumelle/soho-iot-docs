<template>
  <div class="locations-manager">
    <h1>Locations Manager</h1>

    <button @click="startNewSite" class="new-site-btn">+ New Site</button>

    <ul class="tree">
      <li v-for="site in sites" :key="site.id">
        <span class="expand-toggle" v-if="site.floors.length" @click="toggleSite(site)">
          {{ site.expanded ? '▾' : '▸' }}
        </span>
        <span v-else class="no-expand">•</span>
        <strong @click="selectSite(site)" :class="{ selected: selectedSite?.id === site.id }">
          {{ site.name }}
        </strong>
        <button @click="editSite(site)" title="Edit" class="icon-btn">✏️</button>
        <button @click="deleteSite(site)" title="Delete" class="icon-btn">🗑️</button>

        <ul v-show="site.expanded" class="nested-list">
          <li v-for="floor in site.floors" :key="floor.id">
            <span class="expand-toggle" v-if="floor.rooms.length" @click="toggleFloor(floor)">
              {{ floor.expanded ? '▾' : '▸' }}
            </span>
            <span v-else class="no-expand">•</span>
            <span @click="selectFloor(floor)" :class="{ selected: selectedFloor?.id === floor.id }">
              Floor: {{ floor.name }}
            </span>
            <button @click="editFloor(floor)" title="Edit" class="icon-btn">✏️</button>
            <button @click="deleteFloor(floor)" title="Delete" class="icon-btn">🗑️</button>

            <ul v-show="floor.expanded" class="nested-list">
              <li v-for="room in floor.rooms" :key="room.id">
                <span class="expand-toggle" v-if="room.zones.length" @click="toggleRoom(room)">
                  {{ room.expanded ? '▾' : '▸' }}
                </span>
                <span v-else class="no-expand">•</span>
                <span @click="selectRoom(room)" :class="{ selected: selectedRoom?.id === room.id }">
                  Room: {{ room.name }}
                </span>
                <button @click="editRoom(room)" title="Edit" class="icon-btn">✏️</button>
                <button @click="deleteRoom(room)" title="Delete" class="icon-btn">🗑️</button>

                <ul v-show="room.expanded" class="nested-list">
                  <li v-for="zone in room.zones" :key="zone.id">
                    Zone: {{ zone.name }}
                    <button @click="editZone(zone)" title="Edit" class="icon-btn">✏️</button>
                    <button @click="deleteZone(zone)" title="Delete" class="icon-btn">🗑️</button>
                  </li>
                  <li><button @click="startNewZone" class="add-btn">+ New Zone</button></li>
                </ul>
              </li>
              <li><button @click="startNewRoom" class="add-btn">+ New Room</button></li>
            </ul>
          </li>
          <li><button @click="startNewFloor" class="add-btn">+ New Floor</button></li>
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

    <!-- Floor, Room, Zone modals can be added similarly -->

  </div>
</template>

<script setup>
import { reactive, toRefs } from 'vue'
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
  // add others...
} = useLocations()

// Add reactive "expanded" state to sites, floors, rooms for toggle UI
sites.value.forEach(site => {
  if (site.expanded === undefined) site.expanded = false
  site.floors.forEach(floor => {
    if (floor.expanded === undefined) floor.expanded = false
    floor.rooms.forEach(room => {
      if (room.expanded === undefined) room.expanded = false
    })
  })
})

function toggleSite(site) {
  site.expanded = !site.expanded
}

function toggleFloor(floor) {
  floor.expanded = !floor.expanded
}

function toggleRoom(room) {
  room.expanded = !room.expanded
}

fetchSites()
</script>

<style scoped>
.locations-manager {
  font-family: Arial, sans-serif;
  max-width: 700px;
  margin: 0 auto;
}
ul.tree {
  list-style: none;
  padding-left: 0;
}
ul.tree > li {
  margin-bottom: 1rem;
}
.nested-list {
  list-style: none;
  margin-left: 20px;
  padding-left: 15px;
  border-left: 1px dotted #aaa;
}
.expand-toggle {
  cursor: pointer;
  user-select: none;
  font-weight: bold;
  margin-right: 4px;
}
.no-expand {
  margin-right: 14px;
}
strong, span {
  cursor: pointer;
}
.selected {
  text-decoration: underline;
}
.icon-btn {
  background: none;
  border: none;
  cursor: pointer;
  margin-left: 6px;
  font-size: 1rem;
}
.add-btn {
  background: none;
  border: none;
  color: #0b5ed7;
  cursor: pointer;
  margin-top: 0.5rem;
  margin-left: 0;
  font-weight: bold;
  padding: 0;
}
</style>
