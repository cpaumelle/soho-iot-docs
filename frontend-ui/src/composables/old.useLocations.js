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

  // Selectors with data fetch
  async function selectSite(site) {
    selectedSite.value = site
    selectedFloor.value = null
    selectedRoom.value = null
    if (site?.id) await fetchFloors(site.id)
  }

  async function selectFloor(floor) {
    selectedFloor.value = floor
    selectedRoom.value = null
    if (floor?.id && selectedSite.value?.id) await fetchRooms(floor.id, selectedSite.value.id)
  }

  async function selectRoom(room) {
    selectedRoom.value = room
    if (room?.id && selectedFloor.value?.id && selectedSite.value?.id) {
      await fetchZones(room.id, selectedFloor.value.id, selectedSite.value.id)
    }
  }

  // Other modal and CRUD methods can be added here...

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
    // plus other handlers...
  }
}
