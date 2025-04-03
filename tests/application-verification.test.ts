import { describe, it, expect, beforeEach } from 'vitest';
import { mockBlockchain } from './helpers';

// Mock the blockchain environment
const blockchain = mockBlockchain();

describe('Funder Registration Contract', () => {
  beforeEach(() => {
    // Reset blockchain state before each test
    blockchain.reset();
  });
  
  it('should fail when registering with empty name', () => {
    const result = blockchain.callPublic('register-funder', [
      '',
      'Supporting educational initiatives worldwide',
      'www.education-foundation.org',
      1000000
    ]);
    
    expect(result.success).toBe(false);
    expect(result.error).toBe(1);
  });
  
  it('should update funder status', () => {
    // First register a funder
    blockchain.callPublic('register-funder', [
      'Education Foundation',
      'Supporting educational initiatives worldwide',
      'www.education-foundation.org',
      1000000
    ]);
    
    // Update status to inactive
    const result = blockchain.callPublic('update-funder-status', [1, false]);
    expect(result.success).toBe(true);
    
    // Verify the status was updated
    const funderDetails = blockchain.callReadOnly('get-funder', [1]);
    expect(funderDetails.active).toBe(false);
  });
  
});
