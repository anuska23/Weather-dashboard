export interface Polygon {
  id: string
  coordinates: [number, number][]
  dataSourceId: string
  name: string
  currentValue?: number
  color?: string
}
