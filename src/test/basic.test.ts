import { describe, it, expect } from 'vitest'
import { ok, err } from 'neverthrow'

describe('Basic functionality', () => {
  it('should handle neverthrow results', () => {
    const successResult = ok('success')
    const errorResult = err(new Error('test error'))

    expect(successResult.isOk()).toBe(true)
    expect(successResult.isErr()).toBe(false)
    
    expect(errorResult.isOk()).toBe(false)
    expect(errorResult.isErr()).toBe(true)
  })

  it('should validate environment is set up', () => {
    expect(process.env.NODE_ENV).toBeDefined()
  })
})
