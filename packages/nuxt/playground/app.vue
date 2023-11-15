<template>
  <header class="relative z-[100] py-4 bg-white border-b border-gray-200 md:fixed md:top-0 md:inset-x-0">
    <h1 class="text-center text-gray-800 text-2xl font-bold">
      Headless UI Float - Nuxt Example
    </h1>
  </header>

  <div class="p-5 border-b border-gray-200 md:fixed md:top-[65px] md:bottom-0 md:w-[210px] md:p-6 md:border-r md:border-b-0">
    <button type="button" class="block text-left py-1 md:hidden" @click="toggleSidemenu">
      <h2 class="text-gray-600 text-sm font-semibold">
        Menu {{ showSidemenu ? '▲' : '▼' }}
      </h2>
    </button>
    <div class="mt-4 gap-6 md:flex md:flex-col md:mt-0" :class="showSidemenu ? 'flex' : 'hidden'">
      <div v-for="{ title, routes } in sidemenu" :key="title" class="min-w-0 grow md:grow-0">
        <h3 class="font-bold">{{ title }}</h3>
        <ul class="mt-3 space-y-1.5">
          <li v-for="route in routes" :key="route.path">
            <NuxtLink
              v-if="!route.soon"
              :to="route.path"
              class="block text-sm font-semibold transition-colors duration-150 ease-in-out"
              :class="currentRoute.path === route.path ? 'text-gray-700' : 'text-gray-400 hover:text-gray-700'"
            >
              {{ getRouteTitle(route) }}
            </NuxtLink>
            <div v-else class="text-gray-300 text-sm cursor-default">
              {{ getRouteTitle(route) }} <span> (soon)</span>
            </div>
          </li>
        </ul>
      </div>
    </div>
  </div>

  <div class="p-4 space-y-4 md:mt-[65px] md:ml-[211px]">
    <NuxtPage />
  </div>
</template>

<script setup lang="ts">
import { type RouteRecord, componentsRoutes, featuresRoutes } from '@/routes'

const sidemenu = [
  { title: 'Features', routes: featuresRoutes },
  { title: 'Components', routes: componentsRoutes },
]

const currentRoute = useRoute()
const showSidemenu = ref(false)

function toggleSidemenu() {
  showSidemenu.value = !showSidemenu.value
}

function getRouteTitle(route: RouteRecord) {
  if (route.title)
    return route.title
  return route.path
    .replace(/^\//, '')
    .replace(/^([a-z])/, (_, char: string) => char.toUpperCase())
    .replace('-', ' ')
}
</script>
