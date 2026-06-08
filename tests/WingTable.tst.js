// tests/WingTables.test.js
import { describe, it } from 'node:test'
import assert from 'node:assert'
import WingTables from '../classes/WingTables.js'

describe('WingTables Data Parsing Engine', () => {
  // Test Case 1
  it('should successfully parse FX rack data into a clean array structure', () => {
    // 1. Arrange (Load a known testing snapshot file)
    const tablesEngine = new WingTables('./snapshots/SundayService.snap')

    // 2. Act (Invoke your pure on-demand function)
    const fxTable = tablesEngine.getFxRackTable()

    // 3. Assert (Prove the data matches expectations)
    assert.ok(Array.isArray(fxTable), 'FX Table must return an array')
    assert.strictEqual(
      fxTable.length,
      16,
      'The WING console always exposes 16 FX slots'
    )

    // Check structural formatting of the first row
    assert.strictEqual(typeof fxTable[0].slotNum, 'number')
    assert.ok(
      Object.hasOwn(fxTable[0], 'pluginType'),
      'Rows must have a pluginType property'
    )
  })

  // Test Case 2
  it('should filter out inactive fader strips', () => {
    const tablesEngine = new WingTables('./snapshots/SundayService.snap')
    const activeChannels = tablesEngine.getActiveChannelsTable()

    // Ensure every single item returned passes the filter rule
    activeChannels.forEach((ch) => {
      assert.strictEqual(
        ch.active,
        true,
        'Returned channel was inactive but not filtered out'
      )
    })
  })
})
