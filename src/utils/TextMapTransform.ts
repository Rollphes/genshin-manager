import { Transform } from 'stream'

export class TextMapTransform extends Transform {
  private filterList: number[]
  private buffer: string = ''
  private firstFlag: boolean = true

  constructor(filterList: number[] = []) {
    super()
    this.filterList = filterList
  }

  public _transform(
    chunk: Buffer,
    encoding: BufferEncoding,
    callback: () => void,
  ) {
    const str = this.buffer + chunk.toString()
    const lines = str.split('\n')
    const isFirstChunk = str.startsWith('{')

    if (isFirstChunk) this.push('{\n')

    this.buffer = lines.pop() || ''

    lines.forEach((line) => {
      const matchArray = line.match(/(?<=")([^"\\]|\\.)*?(?=")/g)
      if (!matchArray) return
      const [key, , value] = matchArray
      if (this.filterList.includes(+key)) {
        if (!this.firstFlag) this.push(',\n')
        this.firstFlag = false
        this.push(`"${key}":"${value.replace(/\\\\n/g, '\\n')}"`)
      }
    })

    callback()
  }

  public _flush(callback: () => void) {
    this.push('\n}')
    callback()
  }
}
