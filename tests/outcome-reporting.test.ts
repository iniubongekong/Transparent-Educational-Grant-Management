import { describe, it, expect, beforeEach } from 'vitest';
import { mockBlockchain } from './helpers';

// Mock the blockchain environment
const blockchain = mockBlockchain();

describe('Outcome Reporting Contract', () => {
  beforeEach(() => {
    // Reset blockchain state before each test
    blockchain.reset();
  });
  
  it('should submit a new report', () => {
    const result = blockchain.callPublic('submit-report', [
      1, // grant ID
      'First Quarter Results',
      'Detailed description of the outcomes achieved in the first quarter',
      'Students reached: 500, Graduation rate: 95%'
    ]);
    
    expect(result.success).toBe(true);
    expect(result.value).toBe(1); // First report ID should be 1
    
    const reportDetails = blockchain.callReadOnly('get-report', [1]);
    expect(reportDetails.title).toBe('First Quarter Results');
    expect(reportDetails.verified).toBe(false);
  });
  
  it('should fail when submitting with empty title', () => {
    const result = blockchain.callPublic('submit-report', [
      1, // grant ID
      '',
      'Detailed description of the outcomes achieved in the first quarter',
      'Students reached: 500, Graduation rate: 95%'
    ]);
    
    expect(result.success).toBe(false);
    expect(result.error).toBe(1);
  });
});
