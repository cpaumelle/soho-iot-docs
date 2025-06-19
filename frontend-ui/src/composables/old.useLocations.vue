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

  // CRUD methods for Sites
  function editSite(site) {
    editingSite.id = site.id
    editingSite.name = site.name
    editingSite.address = site.address || ''
    editingSite.latitude = site.latitude || ''
    editingSite.longitude = site.longitude || ''
    editingSite.icon_name = site.icon_name || ''
    modals.site = true
  }

  async function saveSite() {
    try {
      const method = editingSite.id ? 'PUT' : 'POST'
      const url = editingSite.id ? `/v1/sites/${editingSite.id}` : '/v1/sites'

      const payload = {
        name: editingSite.name,
        address: editingSite.address,
        latitude: editingSite.latitude,
        longitude: editingSite.longitude,
        icon_name: editingSite.icon_name,
      }

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      if (!res.ok) {
        throw new Error(`Failed to save site: ${res.statusText}`)
      }

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

      if (!res.ok) {
        throw new Error(`Failed to delete site: ${res.statusText}`)
      }

      await fetchSites()
    } catch (error) {
      alert(error.message)
    }
  }

  function closeModal(modalName) {
    modals[modalName] = false
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
    editSite,
    saveSite,
    deleteSite,
    closeModal,
  }
}
