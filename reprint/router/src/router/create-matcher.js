import { createRouteMap } from './create-route-map'
import { createRoute } from './history/base'

export function createMatcher (routes, router) {
  const { pathList, pathMap } = createRouteMap(routes)
  console.log("🚀 ~ createMatcher ~ pathMap:", pathMap);
  console.log("🚀 ~ createMatcher ~ pathList:", pathList);

  function addRoutes (routes) {
    createRouteMap(routes, pathList, pathMap)
  }

  function match(location) {
    console.log("🚀 ~ match ~ location:", location);
    if (pathMap[location]) {
        return createRoute(pathMap[location], {
            path: location
        })
    }

    return createRoute(null, {
        path: location,
    })
  }

  return {
    match,
    addRoutes
  }
}
