import { describe, it, expect, beforeEach } from 'vitest';
import { mockBlockchain } from './helpers';

// Mock the blockchain environment
const blockchain = mockBlockchain();

describe('Fund Disbursement Contract', () => {
  beforeEach(() => {
    // Reset blockchain state before each test
    blockchain.reset();
  });
  
  it('should create a new grant', () => {
    const result = blockchain.callPublic('create-grant', [
      1, // applicant ID
      1, // funder ID
      50000, // amount
      'Research project on educational technology'
    ]);
    
    expect(result.success).toBe(true);
    expect(result.value).toBe(1); // First grant ID should be 1
    
    const grantDetails = blockchain.callReadOnly('get-grant', [1]);
    expect(grantDetails.amount).toBe(50000);
    expect(grantDetails.status).toBe('pending');
  });
  
  it('should fail when creating a grant with zero amount', () => {
    const result = blockchain.callPublic('create-grant', [
      1, // applicant ID
      1, // funder ID
      0, // amount
      'Research project on educational technology'
    ]);
    
    expect(result.success).toBe(false);
    expect(result.error).toBe(1);
  });
  
  it('should approve a grant', () => {
    // First create a grant
    blockchain.callPublic('create-grant', [
      1, // applicant ID
      1, // funder ID
      50000, // amount
      'Research project on educational technology'
    ]);
    
    // Approve the grant
    const result = blockchain.callPublic('approve-grant', [1]);
    expect(result.success).toBe(true);
    
    // Verify the status was updated
    const grantDetails = blockchain.callReadOnly('get-grant', [1]);
    expect(grantDetails.status).toBe('approved');
  });
  
 
});
