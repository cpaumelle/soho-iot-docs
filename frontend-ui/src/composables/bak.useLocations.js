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
    site_id: null,
    rooms: [],
  })

  const editingRoom = reactive({
    id: null,
    name: '',
    floor_id: null,
    zones: [],
  })

  const editingZone = reactive({
    id: null,
    name: '',
    room_id: null,
  })

  const modals = reactive({
    site: false,
    floor: false,
    room: false,
    zone: false,
  })

  // Fetch all sites (with nested floors, rooms, zones)
  async function fetchSites() {
    try {
      const res = await fetch('/v1/sites')
      sites.value = await res.json()
    } catch (error) {
      alert('Failed to load sites')
    }
  }

  // Selection handlers
  async function selectSite(site) {
    selectedSite.value = site
    selectedFloor.value = null
    selectedRoom.value = null
  }

  async function selectFloor(floor) {
    selectedFloor.value = floor
    selectedRoom.value = null
  }

  async function selectRoom(room) {
    selectedRoom.value = room
  }

  // Modal openers
  function startNewSite() {
    Object.assign(editingSite, {
      id: null,
      name: '',
      address: '',
      latitude: '',
      longitude: '',
      icon_name: '',
      floors: [],
    })
    modals.site = true
  }
  function editSite(site) {
    Object.assign(editingSite, site)
    modals.site = true
  }

  function startNewFloor() {
    if (!selectedSite.value) {
      alert('Select a site first')
      return
    }
    Object.assign(editingFloor, {
      id: null,
      name: '',
      site_id: selectedSite.value.id,
      rooms: [],
    })
    modals.floor = true
  }
  function editFloor(floor) {
    Object.assign(editingFloor, floor)
    modals.floor = true
  }

  function startNewRoom() {
    if (!selectedFloor.value) {
      alert('Select a floor first')
      return
    }
    Object.assign(editingRoom, {
      id: null,
      name: '',
      floor_id: selectedFloor.value.id,
      zones: [],
    })
    modals.room = true
  }
  function editRoom(room) {
    Object.assign(editingRoom, room)
    modals.room = true
  }

  function startNewZone() {
    if (!selectedRoom.value) {
      alert('Select a room first')
      return
    }
    Object.assign(editingZone, {
      id: null,
      name: '',
      room_id: selectedRoom.value.id,
    })
    modals.zone = true
  }
  function editZone(zone) {
    Object.assign(editingZone, zone)
    modals.zone = true
  }

  // Save Site (POST or PUT)
  async function saveSite() {
    try {
      let res
      if (editingSite.id) {
        res = await fetch(`/v1/sites/${editingSite.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(editingSite),
        })
      } else {
        res = await fetch('/v1/sites', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(editingSite),
        })
      }
      if (!res.ok) throw new Error(await res.text())
      modals.site = false
      await fetchSites()
    } catch (error) {
      alert('Failed to save site: ' + error.message)
    }
  }

  // Save Floor (POST or PUT)
  async function saveFloor() {
    try {
      let res
      if (editingFloor.id) {
        res = await fetch(`/v1/floors/${editingFloor.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(editingFloor),
        })
      } else {
        res = await fetch('/v1/floors', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(editingFloor),
        })
      }
      if (!res.ok) throw new Error(await res.text())
      modals.floor = false
      await fetchSites()
    } catch (error) {
      alert('Failed to save floor: ' + error.message)
    }
  }

  // Save Room (POST or PUT)
  async function saveRoom() {
    try {
      let res
      if (editingRoom.id) {
        res = await fetch(`/v1/rooms/${editingRoom.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(editingRoom),
        })
      } else {
        res = await fetch('/v1/rooms', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(editingRoom),
        })
      }
      if (!res.ok) throw new Error(await res.text())
      modals.room = false
      await fetchSites()
    } catch (error) {
      alert('Failed to save room: ' + error.message)
    }
  }

  // Save Zone (POST or PUT)
  async function saveZone() {
    try {
      let res
      if (editingZone.id) {
        res = await fetch(`/v1/zones/${editingZone.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(editingZone),
        })
      } else {
        res = await fetch('/v1/zones', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(editingZone),
        })
      }
      if (!res.ok) throw new Error(await res.text())
      modals.zone = false
      await fetchSites()
    } catch (error) {
      alert('Failed to save zone: ' + error.message)
    }
  }

  // Delete handlers
  async function deleteSite(site) {
    if (!confirm(`Delete site ${site.name}?`)) return
    try {
      const res = await fetch(`/v1/sites/${site.id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error(await res.text())
      await fetchSites()
    } catch (error) {
      alert('Failed to delete site: ' + error.message)
    }
  }
  async function deleteFloor(floor) {
    if (!confirm(`Delete floor ${floor.name}?`)) return
    try {
      const res = await fetch(`/v1/floors/${floor.id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error(await res.text())
      await fetchSites()
    } catch (error) {
      alert('Failed to delete floor: ' + error.message)
    }
  }
  async function deleteRoom(room) {
    if (!confirm(`Delete room ${room.name}?`)) return
    try {
      const res = await fetch(`/v1/rooms/${room.id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error(await res.text())
      await fetchSites()
    } catch (error) {
      alert('Failed to delete room: ' + error.message)
    }
  }
  async function deleteZone(zone) {
    if (!confirm(`Delete zone ${zone.name}?`)) return
    try {
      const res = await fetch(`/v1/zones/${zone.id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error(await res.text())
      await fetchSites()
    } catch (error) {
      alert('Failed to delete zone: ' + error.message)
    }
  }

  function closeModal(name) {
    modals[name] = false
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
    closeModal,
  }
}
