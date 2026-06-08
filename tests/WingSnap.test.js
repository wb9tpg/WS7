import { describe, it, beforeEach } from 'node:test' // 1. Import beforeEach
import assert from 'node:assert'
import WingSnap from '../classes/WingSnap.js'

describe('WingSnap Data Parsing Engine', () => {
  let tablesEngine // 2. Declare a variable to hold your instance

  // 3. This runs automatically right before EVERY "it" block below it
  beforeEach(() => {
    tablesEngine = new WingSnap('./snaps/Console.json')
  })

  it('should successfully parse Snap data with a type key', () => {
    // Look how clean! No "new WingSnap" line needed here anymore
    assert.ok(
      Object.hasOwn(tablesEngine.snapData, 'type'),
      'Object must have a "type" property'
    )
  })

  it('should successfully parse Snap data with a ae_data key', () => {
    assert.ok(
      Object.hasOwn(tablesEngine.snapData, 'ae_data'),
      'Object must have a "ae_data" property'
    )
  })

  it('should successfully parse Snap data with a ce_data key', () => {
    assert.ok(
      Object.hasOwn(tablesEngine.snapData, 'ce_data'),
      'Object must have a "ce_data" property'
    )
  })
})
