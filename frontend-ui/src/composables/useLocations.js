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
    site_id: null,
    name: '',
    rooms: [],
  })

  const editingRoom = reactive({
    id: null,
    floor_id: null,
    name: '',
    zones: [],
  })

  const editingZone = reactive({
    id: null,
    room_id: null,
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

  // Selection functions (expand hierarchy)
  async function selectSite(site) {
    selectedSite.value = site
    selectedFloor.value = null
    selectedRoom.value = null
    if (site?.id) {
      await fetchFloors(site.id)
    }
  }

  async function selectFloor(floor) {
    selectedFloor.value = floor
    selectedRoom.value = null
    if (floor?.id && selectedSite.value?.id) {
      await fetchRooms(floor.id, selectedSite.value.id)
    }
  }

  async function selectRoom(room) {
    selectedRoom.value = room
    if (room?.id && selectedFloor.value?.id && selectedSite.value?.id) {
      await fetchZones(room.id, selectedFloor.value.id, selectedSite.value.id)
    }
  }

  // Site handlers
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

  async function saveSite() {
    if (!editingSite.name.trim()) {
      alert('Site name is required')
      return
    }
    try {
      const method = editingSite.id ? 'PUT' : 'POST'
      const url = editingSite.id ? `/v1/sites/${editingSite.id}` : '/v1/sites'
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: editingSite.name,
          address: editingSite.address,
          latitude: editingSite.latitude,
          longitude: editingSite.longitude,
          icon_name: editingSite.icon_name,
        }),
      })
      if (!res.ok) throw new Error(`Failed to save site: ${res.statusText}`)
      await fetchSites()
      modals.site = false
    } catch (error) {
      alert(error.message)
    }
  }

  async function deleteSite(site) {
    if (!confirm(`Delete site "${site.name}"?`)) return
    try {
      const res = await fetch(`/v1/sites/${site.id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error(`Failed to delete site: ${res.statusText}`)
      await fetchSites()
      if (selectedSite.value?.id === site.id) selectedSite.value = null
    } catch (error) {
      alert(error.message)
    }
  }

  // Floor handlers
  function startNewFloor() {
    if (!selectedSite.value) {
      alert('Please select a site first')
      return
    }
    editingFloor.id = null
    editingFloor.site_id = selectedSite.value.id
    editingFloor.name = ''
    editingFloor.rooms = []
    modals.floor = true
  }

  function editFloor(floor) {
    editingFloor.id = floor.id
    editingFloor.site_id = floor.site_id
    editingFloor.name = floor.name
    editingFloor.rooms = floor.rooms || []
    modals.floor = true
  }

  async function saveFloor() {
    if (!editingFloor.name.trim()) {
      alert('Floor name is required')
      return
    }
    try {
      const method = editingFloor.id ? 'PUT' : 'POST'
      const url = editingFloor.id ? `/v1/floors/${editingFloor.id}` : '/v1/floors'
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          site_id: editingFloor.site_id,
          name: editingFloor.name,
        }),
      })
      if (!res.ok) throw new Error(`Failed to save floor: ${res.statusText}`)
      if (editingFloor.site_id) await fetchFloors(editingFloor.site_id)
      modals.floor = false
    } catch (error) {
      alert(error.message)
    }
  }

  async function deleteFloor(floor) {
    if (!confirm(`Delete floor "${floor.name}"?`)) return
    try {
      const res = await fetch(`/v1/floors/${floor.id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error(`Failed to delete floor: ${res.statusText}`)
      if (floor.site_id) await fetchFloors(floor.site_id)
      if (selectedFloor.value?.id === floor.id) selectedFloor.value = null
    } catch (error) {
      alert(error.message)
    }
  }

  // Room handlers
  function startNewRoom() {
    if (!selectedFloor.value) {
      alert('Please select a floor first')
      return
    }
    editingRoom.id = null
    editingRoom.floor_id = selectedFloor.value.id
    editingRoom.name = ''
    editingRoom.zones = []
    modals.room = true
  }

  function editRoom(room) {
    editingRoom.id = room.id
    editingRoom.floor_id = room.floor_id
    editingRoom.name = room.name
    editingRoom.zones = room.zones || []
    modals.room = true
  }

  async function saveRoom() {
    if (!editingRoom.name.trim()) {
      alert('Room name is required')
      return
    }
    try {
      const method = editingRoom.id ? 'PUT' : 'POST'
      const url = editingRoom.id ? `/v1/rooms/${editingRoom.id}` : '/v1/rooms'
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          floor_id: editingRoom.floor_id,
          name: editingRoom.name,
        }),
      })
      if (!res.ok) throw new Error(`Failed to save room: ${res.statusText}`)
      if (editingRoom.floor_id) await fetchRooms(editingRoom.floor_id, selectedSite.value.id)
      modals.room = false
    } catch (error) {
      alert(error.message)
    }
  }

  async function deleteRoom(room) {
    if (!confirm(`Delete room "${room.name}"?`)) return
    try {
      const res = await fetch(`/v1/rooms/${room.id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error(`Failed to delete room: ${res.statusText}`)
      if (room.floor_id) await fetchRooms(room.floor_id, selectedSite.value.id)
      if (selectedRoom.value?.id === room.id) selectedRoom.value = null
    } catch (error) {
      alert(error.message)
    }
  }

  // Zone handlers
  function startNewZone() {
    if (!selectedRoom.value) {
      alert('Please select a room first')
      return
    }
    editingZone.id = null
    editingZone.room_id = selectedRoom.value.id
    editingZone.name = ''
    modals.zone = true
  }

  function editZone(zone) {
    editingZone.id = zone.id
    editingZone.room_id = zone.room_id
    editingZone.name = zone.name
    modals.zone = true
  }

  async function saveZone() {
    if (!editingZone.name.trim()) {
      alert('Zone name is required')
      return
    }
    try {
      const method = editingZone.id ? 'PUT' : 'POST'
      const url = editingZone.id ? `/v1/zones/${editingZone.id}` : '/v1/zones'
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          room_id: editingZone.room_id,
          name: editingZone.name,
        }),
      })
      if (!res.ok) throw new Error(`Failed to save zone: ${res.statusText}`)
      if (editingZone.room_id) {
        // reload zones for room
        await fetchZones(editingZone.room_id, selectedFloor.value.id, selectedSite.value.id)
      }
      modals.zone = false
    } catch (error) {
      alert(error.message)
    }
  }

  async function deleteZone(zone) {
    if (!confirm(`Delete zone "${zone.name}"?`)) return
    try {
      const res = await fetch(`/v1/zones/${zone.id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error(`Failed to delete zone: ${res.statusText}`)
      if (zone.room_id) await fetchZones(zone.room_id, selectedFloor.value.id, selectedSite.value.id)
    } catch (error) {
      alert(error.message)
    }
  }

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
    closeModal(modalName) {
      modals[modalName] = false
    },
  }
}
