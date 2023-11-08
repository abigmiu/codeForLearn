function addRouteRecord (
  pathList,
  pathMap,
  route,
  parent
) {

  const path = parent ? `${parent.path}/${route.path}` : route.path;

  const record = {
    path,
    component: route.component,
    parent: parent
  }


  if (!pathMap[record.path]) {
    pathList.push(record.path)
    pathMap[record.path] = record
  }


  if (route.children) {
    route.children.forEach((child) => {
      addRouteRecord(pathList, pathMap, child, record)
    })
  }
}

export function createRouteMap (
  routes,
  oldPathList,
  oldPathMap,
  patentRoute
) {
  const pathList = oldPathList || []
  const pathMap = oldPathMap || Object.create(null)

  routes.forEach(route => {
    addRouteRecord(pathList, pathMap, route)
  })


  return {
    pathList,
    pathMap
  }
}
