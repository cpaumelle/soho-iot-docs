import { ref, reactive } from 'vue'

export function useLocations() {
  const sites = ref([])

  const selectedSite = ref(null)
  const selectedFloor = ref(null)
  const selectedRoom = ref(null)

  const editingSite = reactive({
    id: null,
    name: '',
    address: '',
    latitude: '',
    longitude: '',
    icon_name: '',
    floors: [],
  })

  const editingFloor = reactive({
    id: null,
    name: '',
    rooms: [],
  })

  const editingRoom = reactive({
    id: null,
    name: '',
    zones: [],
  })

  const editingZone = reactive({
    id: null,
    name: '',
  })

  const modals = reactive({
    site: false,
    floor: false,
    room: false,
    zone: false,
  })

  // Fetch all sites from backend
  async function fetchSites() {
    try {
      const res = await fetch('/v1/sites')
      sites.value = await res.json()
    } catch (error) {
      alert('Failed to load sites')
    }
  }

  // Fetch floors for a given site and update site in state
  async function fetchFloors(siteId) {
    try {
      const res = await fetch(`/v1/sites/${siteId}/floors`)
      const floors = await res.json()
      const site = sites.value.find(s => s.id === siteId)
      if (site) site.floors = floors
    } catch (error) {
      alert('Failed to load floors')
    }
  }

  // Fetch rooms for a given floor and update floor in state
  async function fetchRooms(floorId, siteId) {
    try {
      const res = await fetch(`/v1/floors/${floorId}/rooms`)
      const rooms = await res.json()
      const site = sites.value.find(s => s.id === siteId)
      const floor = site?.floors.find(f => f.id === floorId)
      if (floor) floor.rooms = rooms
    } catch (error) {
      alert('Failed to load rooms')
    }
  }

  // Fetch zones for a given room and update room in state
  async function fetchZones(roomId, floorId, siteId) {
    try {
      const res = await fetch(`/v1/rooms/${roomId}/zones`)
      const zones = await res.json()
      const site = sites.value.find(s => s.id === siteId)
      const floor = site?.floors.find(f => f.id === floorId)
      const room = floor?.rooms.find(r => r.id === roomId)
      if (room) room.zones = zones
    } catch (error) {
      alert('Failed to load zones')
    }
  }

  // Site selection - fetch floors after selecting site
  async function selectSite(site) {
    selectedSite.value = site
    selectedFloor.value = null
    selectedRoom.value = null
    if (site?.id) {
      await fetchFloors(site.id)
    }
  }

  // Floor selection - fetch rooms after selecting floor
  async function selectFloor(floor) {
    selectedFloor.value = floor
    selectedRoom.value = null
    if (floor?.id && selectedSite.value?.id) {
      await fetchRooms(floor.id, selectedSite.value.id)
    }
  }

  // Room selection - fetch zones after selecting room
  async function selectRoom(room) {
    selectedRoom.value = room
    if (room?.id && selectedFloor.value?.id && selectedSite.value?.id) {
      await fetchZones(room.id, selectedFloor.value.id, selectedSite.value.id)
    }
  }

  // Create or update a site
  async function saveSite() {
    try {
      const payload = {
        name: editingSite.name,
        address: editingSite.address,
        latitude: editingSite.latitude,
        longitude: editingSite.longitude,
        icon_name: editingSite.icon_name,
      }

      let res
      if (editingSite.id) {
        res = await fetch(`/v1/sites/${editingSite.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        })
      } else {
        res = await fetch(`/v1/sites`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        })
      }

      if (!res.ok) throw new Error('Failed to save site')

      const savedSite = await res.json()

      // Update local state
      const idx = sites.value.findIndex(s => s.id === savedSite.id)
      if (idx !== -1) {
        sites.value[idx] = savedSite
      } else {
        sites.value.push(savedSite)
      }

      selectedSite.value = savedSite
      modals.site = false
    } catch (error) {
      alert(error.message)
    }
  }

  // Delete a site
  async function deleteSite(site) {
    if (!confirm(`Delete site ${site.name}?`)) return
    try {
      const res = await fetch(`/v1/sites/${site.id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error('Failed to delete site')
      sites.value = sites.value.filter(s => s.id !== site.id)
      if (selectedSite.value?.id === site.id) selectedSite.value = null
    } catch (error) {
      alert(error.message)
    }
  }

  // Similarly, create, update, delete floors
  async function saveFloor() {
    try {
      const payload = { name: editingFloor.name, site_id: selectedSite.value.id }
      let res
      if (editingFloor.id) {
        res = await fetch(`/v1/floors/${editingFloor.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        })
      } else {
        res = await fetch(`/v1/sites/${selectedSite.value.id}/floors`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        })
      }
      if (!res.ok) throw new Error('Failed to save floor')
      const savedFloor = await res.json()
      const site = sites.value.find(s => s.id === selectedSite.value.id)
      const idx = site.floors.findIndex(f => f.id === savedFloor.id)
      if (idx !== -1) {
        site.floors[idx] = savedFloor
      } else {
        site.floors.push(savedFloor)
      }
      selectedFloor.value = savedFloor
      modals.floor = false
    } catch (error) {
      alert(error.message)
    }
  }

  async function deleteFloor(floor) {
    if (!confirm(`Delete floor ${floor.name}?`)) return
    try {
      const res = await fetch(`/v1/floors/${floor.id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error('Failed to delete floor')
      const site = sites.value.find(s => s.id === selectedSite.value.id)
      site.floors = site.floors.filter(f => f.id !== floor.id)
      if (selectedFloor.value?.id === floor.id) selectedFloor.value = null
    } catch (error) {
      alert(error.message)
    }
  }

  // Rooms CRUD
  async function saveRoom() {
    try {
      const payload = { name: editingRoom.name, floor_id: selectedFloor.value.id }
      let res
      if (editingRoom.id) {
        res = await fetch(`/v1/rooms/${editingRoom.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        })
      } else {
        res = await fetch(`/v1/floors/${selectedFloor.value.id}/rooms`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        })
      }
      if (!res.ok) throw new Error('Failed to save room')
      const savedRoom = await res.json()
      const site = sites.value.find(s => s.id === selectedSite.value.id)
      const floor = site.floors.find(f => f.id === selectedFloor.value.id)
      const idx = floor.rooms.findIndex(r => r.id === savedRoom.id)
      if (idx !== -1) {
        floor.rooms[idx] = savedRoom
      } else {
        floor.rooms.push(savedRoom)
      }
      selectedRoom.value = savedRoom
      modals.room = false
    } catch (error) {
      alert(error.message)
    }
  }

  async function deleteRoom(room) {
    if (!confirm(`Delete room ${room.name}?`)) return
    try {
      const res = await fetch(`/v1/rooms/${room.id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error('Failed to delete room')
      const site = sites.value.find(s => s.id === selectedSite.value.id)
      const floor = site.floors.find(f => f.id === selectedFloor.value.id)
      floor.rooms = floor.rooms.filter(r => r.id !== room.id)
      if (selectedRoom.value?.id === room.id) selectedRoom.value = null
    } catch (error) {
      alert(error.message)
    }
  }

  // Zones CRUD
  async function saveZone() {
    try {
      const payload = { name: editingZone.name, room_id: selectedRoom.value.id }
      let res
      if (editingZone.id) {
        res = await fetch(`/v1/zones/${editingZone.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        })
      } else {
        res = await fetch(`/v1/rooms/${selectedRoom.value.id}/zones`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        })
      }
      if (!res.ok) throw new Error('Failed to save zone')
      const savedZone = await res.json()
      const site = sites.value.find(s => s.id === selectedSite.value.id)
      const floor = site.floors.find(f => f.id === selectedFloor.value.id)
      const room = floor.rooms.find(r => r.id === selectedRoom.value.id)
      const idx = room.zones.findIndex(z => z.id === savedZone.id)
      if (idx !== -1) {
        room.zones[idx] = savedZone
      } else {
        room.zones.push(savedZone)
      }
      modals.zone = false
    } catch (error) {
      alert(error.message)
    }
  }

  async function deleteZone(zone) {
    if (!confirm(`Delete zone ${zone.name}?`)) return
    try {
      const res = await fetch(`/v1/zones/${zone.id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error('Failed to delete zone')
      const site = sites.value.find(s => s.id === selectedSite.value.id)
      const floor = site.floors.find(f => f.id === selectedFloor.value.id)
      const room = floor.rooms.find(r => r.id === selectedRoom.value.id)
      room.zones = room.zones.filter(z => z.id !== zone.id)
      modals.zone = false
    } catch (error) {
      alert(error.message)
    }
  }

  // Site modal controls
  function startNewSite() {
    editingSite.id = null
    editingSite.name = ''
    editingSite.address = ''
    editingSite.latitude = ''
    editingSite.longitude = ''
    editingSite.icon_name = ''
    editingSite.floors = []
    modals.site = true
  }

  function editSite(site) {
    editingSite.id = site.id
    editingSite.name = site.name
    editingSite.address = site.address || ''
    editingSite.latitude = site.latitude || ''
    editingSite.longitude = site.longitude || ''
    editingSite.icon_name = site.icon_name || ''
    editingSite.floors = site.floors || []
    modals.site = true
  }

  function closeModal(modalName) {
    modals[modalName] = false
  }

  // Similar modal functions for floor, room, zone can be added here if needed

  return {
    sites,
    selectedSite,
    selectedFloor,
    selectedRoom,
    editingSite,
    editingFloor,
    editingRoom,
    editingZone,
    modals,
    fetchSites,
    fetchFloors,
    fetchRooms,
    fetchZones,
    selectSite,
    selectFloor,
    selectRoom,
    saveSite,
    deleteSite,
    saveFloor,
    deleteFloor,
    saveRoom,
    deleteRoom,
    saveZone,
    deleteZone,
    startNewSite,
    editSite,
    closeModal,
  }
}
