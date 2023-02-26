import { useState } from 'react'
import { Link, Outlet, useLocation } from 'react-router-dom'
import { type RouteRecord, componentsRoutes, featuresRoutes } from '@/router'

export default function App() {
  const { pathname } = useLocation()
  const [showSidemenu, setShowSidemenu] = useState(false)

  const sidemenu = [
    { title: 'Features', routes: featuresRoutes },
    { title: 'Components', routes: componentsRoutes },
  ]

  function toggleSidemenu() {
    setShowSidemenu(!showSidemenu)
  }

  function getRouteTitle(route: RouteRecord) {
    if (route.title)
      return route.title
    return route.path
      .replace(/^\//, '')
      .replace(/^([a-z])/, (_, char: string) => char.toUpperCase())
      .replace('-', ' ')
  }

  return (
    <>
      <header className="relative z-[100] py-4 bg-white border-b border-gray-200 md:fixed md:top-0 md:inset-x-0">
        <h1 className="text-center text-gray-800 text-2xl font-bold">
        Headless UI Float - React Example
        </h1>
      </header>

      <div className="p-5 border-b border-gray-200 md:fixed md:top-[65px] md:bottom-0 md:w-[210px] md:p-6 md:border-r md:border-b-0">
        <button type="button" className="block text-left py-1 md:hidden" onClick={toggleSidemenu}>
          <h2 className="text-gray-600 text-sm font-semibold">
            Menu {showSidemenu ? '▲' : '▼'}
          </h2>
        </button>
        <div className={`${showSidemenu ? 'flex' : 'hidden'} mt-4 gap-6 md:flex md:flex-col md:mt-0`}>
          {sidemenu.map(({ title, routes }) => (
            <div key={title} className="min-w-0 grow md:grow-0">
              <h3 className="font-bold">{title}</h3>
              <ul className="mt-3 space-y-1.5">
                {routes.map(route => (
                  <li key={route.path}>
                    {!route.soon ? (
                      <Link
                        to={route.path}
                        className={`block text-sm font-semibold transition-colors duration-150 ease-in-out ${
                          pathname === route.path ? 'text-gray-700' : 'text-gray-400 hover:text-gray-700'
                        }`}
                      >
                        {getRouteTitle(route)}
                      </Link>
                    ) : (
                      <div className="text-gray-300 text-sm cursor-default">
                        {getRouteTitle(route)} <span> (soon)</span>
                      </div>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      <div className="p-4 space-y-4 md:mt-[65px] md:ml-[211px]">
        <Outlet />
      </div>
    </>
  )
}
