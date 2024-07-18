/**
 * Returns the raw type of a given value
 */
export function toRawType(value: unknown): string {
    return Object.prototype.toString.call(value).slice(8, -1);
}

export  function isObject(value: unknown) {
    return typeof value === 'object' && value !== null;
}

export const isArray = (value: any): value is Array<any> => Array.isArray(value)

export const hasOwn = (target: any, key: string) => Object.prototype.hasOwnProperty.call(target, key)

export const isSymbol = (val: unknown): val is symbol => typeof val === 'symbol'

export function makeMap(
    str: string,
    expectsLowerCase?: boolean
  ): (key: string) => boolean {
    const map: Record<string, boolean> = Object.create(null)
    const list: Array<string> = str.split(',')
    for (let i = 0; i < list.length; i++) {
      map[list[i]] = true
    }
    return expectsLowerCase ? val => !!map[val.toLowerCase()] : val => !!map[val]
  }

  export const extend = Object.assign

  export const isMap = (val) => toRawType(val) === 'Map'

  export const isIntegerKey = (key) => parseInt(key) + "" === key