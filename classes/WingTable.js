import WingSnap from './WingSnap.js'
export default class WingTable extends WingSnap {
  constructor(fileName) {
    super(fileName)
    console.log(`Table constructor ${fileName}`)
  }
}
