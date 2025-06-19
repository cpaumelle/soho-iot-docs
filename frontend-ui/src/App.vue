<template>
  <nav>
    <ul>
      <li><router-link to="/">Dashboard</router-link></li>
      <li><router-link to="/locations">Locations</router-link></li>
    </ul>
  </nav>

  <router-view />
</template>

<style>
nav ul {
  display: flex;
  gap: 1rem;
  padding: 1rem;
  background-color: #eee;
  list-style: none;
  margin: 0;
}
nav a {
  text-decoration: none;
  color: #333;
}
nav a.router-link-active {
  font-weight: bold;
}
</style>
