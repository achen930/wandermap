/* eslint-disable */

// @ts-nocheck

// noinspection JSUnusedGlobalSymbols

// This file was automatically generated by TanStack Router.
// You should NOT make any changes in this file as it will be overwritten.
// Additionally, you should also exclude this file from your linter and/or formatter to prevent it from being checked or modified.

// Import Routes

import { Route as rootRoute } from './routes/__root'
import { Route as LocationsImport } from './routes/locations'
import { Route as AddLocationImport } from './routes/add-location'
import { Route as AboutImport } from './routes/about'
import { Route as IndexImport } from './routes/index'

// Create/Update Routes

const LocationsRoute = LocationsImport.update({
  id: '/locations',
  path: '/locations',
  getParentRoute: () => rootRoute,
} as any)

const AddLocationRoute = AddLocationImport.update({
  id: '/add-location',
  path: '/add-location',
  getParentRoute: () => rootRoute,
} as any)

const AboutRoute = AboutImport.update({
  id: '/about',
  path: '/about',
  getParentRoute: () => rootRoute,
} as any)

const IndexRoute = IndexImport.update({
  id: '/',
  path: '/',
  getParentRoute: () => rootRoute,
} as any)

// Populate the FileRoutesByPath interface

declare module '@tanstack/react-router' {
  interface FileRoutesByPath {
    '/': {
      id: '/'
      path: '/'
      fullPath: '/'
      preLoaderRoute: typeof IndexImport
      parentRoute: typeof rootRoute
    }
    '/about': {
      id: '/about'
      path: '/about'
      fullPath: '/about'
      preLoaderRoute: typeof AboutImport
      parentRoute: typeof rootRoute
    }
    '/add-location': {
      id: '/add-location'
      path: '/add-location'
      fullPath: '/add-location'
      preLoaderRoute: typeof AddLocationImport
      parentRoute: typeof rootRoute
    }
    '/locations': {
      id: '/locations'
      path: '/locations'
      fullPath: '/locations'
      preLoaderRoute: typeof LocationsImport
      parentRoute: typeof rootRoute
    }
  }
}

// Create and export the route tree

export interface FileRoutesByFullPath {
  '/': typeof IndexRoute
  '/about': typeof AboutRoute
  '/add-location': typeof AddLocationRoute
  '/locations': typeof LocationsRoute
}

export interface FileRoutesByTo {
  '/': typeof IndexRoute
  '/about': typeof AboutRoute
  '/add-location': typeof AddLocationRoute
  '/locations': typeof LocationsRoute
}

export interface FileRoutesById {
  __root__: typeof rootRoute
  '/': typeof IndexRoute
  '/about': typeof AboutRoute
  '/add-location': typeof AddLocationRoute
  '/locations': typeof LocationsRoute
}

export interface FileRouteTypes {
  fileRoutesByFullPath: FileRoutesByFullPath
  fullPaths: '/' | '/about' | '/add-location' | '/locations'
  fileRoutesByTo: FileRoutesByTo
  to: '/' | '/about' | '/add-location' | '/locations'
  id: '__root__' | '/' | '/about' | '/add-location' | '/locations'
  fileRoutesById: FileRoutesById
}

export interface RootRouteChildren {
  IndexRoute: typeof IndexRoute
  AboutRoute: typeof AboutRoute
  AddLocationRoute: typeof AddLocationRoute
  LocationsRoute: typeof LocationsRoute
}

const rootRouteChildren: RootRouteChildren = {
  IndexRoute: IndexRoute,
  AboutRoute: AboutRoute,
  AddLocationRoute: AddLocationRoute,
  LocationsRoute: LocationsRoute,
}

export const routeTree = rootRoute
  ._addFileChildren(rootRouteChildren)
  ._addFileTypes<FileRouteTypes>()

/* ROUTE_MANIFEST_START
{
  "routes": {
    "__root__": {
      "filePath": "__root.tsx",
      "children": [
        "/",
        "/about",
        "/add-location",
        "/locations"
      ]
    },
    "/": {
      "filePath": "index.tsx"
    },
    "/about": {
      "filePath": "about.tsx"
    },
    "/add-location": {
      "filePath": "add-location.tsx"
    },
    "/locations": {
      "filePath": "locations.tsx"
    }
  }
}
ROUTE_MANIFEST_END */
