/**
 * EnkaStatusTypes
 */
export interface APIStatus {
  /**
   * data type
   */
  type: string
  /**
   * node datas
   */
  nodes: Array<APINode | null>
}

interface APINode {
  type: string
  data: Array<number | { [key: string]: number } | string>
  uses: APIUses
}

interface APIUses {}
