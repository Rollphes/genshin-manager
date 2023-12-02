import Module from 'module'
import path from 'path'

/**
 * Get class names from module.children recursively.
 * @param children module.children
 * @param temp Temporary Set
 * @returns Class names
 */
export function getClassNamesRecursive(
  children: Module[],
  temp?: Set<string>,
): Set<string> {
  const classNames = temp ? temp : new Set<string>()
  children.forEach((child) => {
    const className = path.basename(child.id).split('.')[0]
    if (
      child.id.match(/genshin-manager(\/|\\)(src|dist)/) &&
      !classNames.has(className)
    ) {
      classNames.add(className)
      getClassNamesRecursive(child.children, classNames)
    }
  })
  return classNames
}
