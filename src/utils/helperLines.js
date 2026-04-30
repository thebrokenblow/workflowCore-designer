/**
 * Расчёт линий-помощников и позиции для привязки узла
 * @param {Object} change - объект изменения позиции узла
 * @param {Array} nodes - массив всех узлов
 * @param {number} distance - расстояние срабатывания привязки (по умолчанию 5px)
 * @returns {Object} объект с горизонтальной, вертикальной линиями и позицией привязки
 */
export function getHelperLines(change, nodes, distance = 5) {
  const defaultResult = {
    horizontal: undefined,
    vertical: undefined,
    snapPosition: { x: undefined, y: undefined },
  }

  // Находим перемещаемый узел
  const nodeA = nodes.find((node) => node.id === change.id)

  if (!nodeA || !change.position) {
    return defaultResult
  }

  // Границы узла A (перемещаемого)
  const nodeABounds = {
    left: change.position.x,
    right:
      change.position.x +
      ((nodeA.dimensions?.width ?? nodeA.style?.width)
        ? parseFloat(nodeA.style?.width)
        : (nodeA.width ?? 200)),
    top: change.position.y,
    bottom:
      change.position.y +
      ((nodeA.dimensions?.height ?? nodeA.style?.height)
        ? parseFloat(nodeA.style?.height)
        : (nodeA.height ?? 100)),
    width:
      (nodeA.dimensions?.width ?? nodeA.style?.width)
        ? parseFloat(nodeA.style?.width)
        : (nodeA.width ?? 200),
    height:
      (nodeA.dimensions?.height ?? nodeA.style?.height)
        ? parseFloat(nodeA.style?.height)
        : (nodeA.height ?? 100),
  }

  let horizontalDistance = distance
  let verticalDistance = distance

  // Проходим по всем остальным узлам
  return nodes
    .filter((node) => node.id !== nodeA.id)
    .reduce((result, nodeB) => {
      // Получаем ширину и высоту узла B
      const nodeBWidth =
        (nodeB.dimensions?.width ?? nodeB.style?.width)
          ? parseFloat(nodeB.style?.width)
          : (nodeB.width ?? 200)
      const nodeBHeight =
        (nodeB.dimensions?.height ?? nodeB.style?.height)
          ? parseFloat(nodeB.style?.height)
          : (nodeB.height ?? 100)

      // Границы узла B
      const nodeBBounds = {
        left: nodeB.position.x,
        right: nodeB.position.x + nodeBWidth,
        top: nodeB.position.y,
        bottom: nodeB.position.y + nodeBHeight,
        width: nodeBWidth,
        height: nodeBHeight,
      }

      // ----- Вертикальные линии (X) -----

      // Левая сторона A к левой стороне B
      const distanceLeftLeft = Math.abs(nodeABounds.left - nodeBBounds.left)
      if (distanceLeftLeft < verticalDistance) {
        result.snapPosition.x = nodeBBounds.left
        result.vertical = nodeBBounds.left
        verticalDistance = distanceLeftLeft
      }

      // Правая сторона A к правой стороне B
      const distanceRightRight = Math.abs(nodeABounds.right - nodeBBounds.right)
      if (distanceRightRight < verticalDistance) {
        result.snapPosition.x = nodeBBounds.right - nodeABounds.width
        result.vertical = nodeBBounds.right
        verticalDistance = distanceRightRight
      }

      // Левая сторона A к правой стороне B
      const distanceLeftRight = Math.abs(nodeABounds.left - nodeBBounds.right)
      if (distanceLeftRight < verticalDistance) {
        result.snapPosition.x = nodeBBounds.right
        result.vertical = nodeBBounds.right
        verticalDistance = distanceLeftRight
      }

      // Правая сторона A к левой стороне B
      const distanceRightLeft = Math.abs(nodeABounds.right - nodeBBounds.left)
      if (distanceRightLeft < verticalDistance) {
        result.snapPosition.x = nodeBBounds.left - nodeABounds.width
        result.vertical = nodeBBounds.left
        verticalDistance = distanceRightLeft
      }

      // ----- Горизонтальные линии (Y) -----

      // Верхняя сторона A к верхней стороне B
      const distanceTopTop = Math.abs(nodeABounds.top - nodeBBounds.top)
      if (distanceTopTop < horizontalDistance) {
        result.snapPosition.y = nodeBBounds.top
        result.horizontal = nodeBBounds.top
        horizontalDistance = distanceTopTop
      }

      // Нижняя сторона A к верхней стороне B
      const distanceBottomTop = Math.abs(nodeABounds.bottom - nodeBBounds.top)
      if (distanceBottomTop < horizontalDistance) {
        result.snapPosition.y = nodeBBounds.top - nodeABounds.height
        result.horizontal = nodeBBounds.top
        horizontalDistance = distanceBottomTop
      }

      // Нижняя сторона A к нижней стороне B
      const distanceBottomBottom = Math.abs(nodeABounds.bottom - nodeBBounds.bottom)
      if (distanceBottomBottom < horizontalDistance) {
        result.snapPosition.y = nodeBBounds.bottom - nodeABounds.height
        result.horizontal = nodeBBounds.bottom
        horizontalDistance = distanceBottomBottom
      }

      // Верхняя сторона A к нижней стороне B
      const distanceTopBottom = Math.abs(nodeABounds.top - nodeBBounds.bottom)
      if (distanceTopBottom < horizontalDistance) {
        result.snapPosition.y = nodeBBounds.bottom
        result.horizontal = nodeBBounds.bottom
        horizontalDistance = distanceTopBottom
      }

      return result
    }, defaultResult)
}
