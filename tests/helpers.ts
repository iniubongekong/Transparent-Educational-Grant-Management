// Mock blockchain helper for testing Clarity contracts
export function mockBlockchain() {
	let state = {
		blockHeight: 1,
		contracts: {
			'funder-registration': {
				data: {
					'next-funder-id': 1,
					'funders': {}
				},
				functions: {
					'register-funder': (name, description, website, fundsCommitted) => {
						if (name.length === 0) {
							return { success: false, error: 1 };
						}
						
						const funderId = state.contracts['funder-registration'].data['next-funder-id'];
						state.contracts['funder-registration'].data['funders'][funderId] = {
							name,
							description,
							website,
							'contact-address': 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM', // Mock sender
							active: true,
							'total-funds-committed': fundsCommitted,
							'registration-time': state.blockHeight
						};
						
						state.contracts['funder-registration'].data['next-funder-id']++;
						return { success: true, value: funderId };
					},
					'get-funder': (funderId) => {
						return state.contracts['funder-registration'].data['funders'][funderId];
					},
					'update-funder-status': (funderId, active) => {
						const funder = state.contracts['funder-registration'].data['funders'][funderId];
						if (!funder) {
							return { success: false, error: 404 };
						}
						
						funder.active = active;
						return { success: true };
					},
					'update-committed-funds': (funderId, additionalFunds) => {
						const funder = state.contracts['funder-registration'].data['funders'][funderId];
						if (!funder) {
							return { success: false, error: 404 };
						}
						
						funder['total-funds-committed'] += additionalFunds;
						return { success: true };
					}
				}
			},
			'applicant-verification': {
				data: {
					'next-applicant-id': 1,
					'applicants': {}
				},
				functions: {
					'register-applicant': (name, institutionType, location) => {
						if (name.length === 0) {
							return { success: false, error: 1 };
						}
						
						const applicantId = state.contracts['applicant-verification'].data['next-applicant-id'];
						state.contracts['applicant-verification'].data['applicants'][applicantId] = {
							name,
							'institution-type': institutionType,
							location,
							'contact-address': 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM', // Mock sender
							verified: false,
							'verification-time': 0,
							'registration-time': state.blockHeight
						};
						
						state.contracts['applicant-verification'].data['next-applicant-id']++;
						return { success: true, value: applicantId };
					},
					'get-applicant': (applicantId) => {
						return state.contracts['applicant-verification'].data['applicants'][applicantId];
					},
					'verify-applicant': (applicantId) => {
						const applicant = state.contracts['applicant-verification'].data['applicants'][applicantId];
						if (!applicant) {
							return { success: false, error: 404 };
						}
						
						applicant.verified = true;
						applicant['verification-time'] = state.blockHeight;
						return { success: true };
					},
					'is-verified': (applicantId) => {
						const applicant = state.contracts['applicant-verification'].data['applicants'][applicantId];
						return applicant ? applicant.verified : false;
					}
				}
			},
			'fund-disbursement': {
				data: {
					'next-grant-id': 1,
					'grants': {}
				},
				functions: {
					'create-grant': (applicantId, funderId, amount, description) => {
						if (amount === 0) {
							return { success: false, error: 1 };
						}
						
						const grantId = state.contracts['fund-disbursement'].data['next-grant-id'];
						state.contracts['fund-disbursement'].data['grants'][grantId] = {
							'applicant-id': applicantId,
							'funder-id': funderId,
							amount,
							description,
							status: 'pending',
							'creation-time': state.blockHeight,
							'disbursement-time': 0
						};
						
						state.contracts['fund-disbursement'].data['next-grant-id']++;
						return { success: true, value: grantId };
					},
					'get-grant': (grantId) => {
						return state.contracts['fund-disbursement'].data['grants'][grantId];
					},
					'approve-grant': (grantId) => {
						const grant = state.contracts['fund-disbursement'].data['grants'][grantId];
						if (!grant) {
							return { success: false, error: 404 };
						}
						if (grant.status !== 'pending') {
							return { success: false, error: 403 };
						}
						
						grant.status = 'approved';
						return { success: true };
					},
					'reject-grant': (grantId) => {
						const grant = state.contracts['fund-disbursement'].data['grants'][grantId];
						if (!grant) {
							return { success: false, error: 404 };
						}
						if (grant.status !== 'pending') {
							return { success: false, error: 403 };
						}
						
						grant.status = 'rejected';
						return { success: true };
					},
					'disburse-funds': (grantId) => {
						const grant = state.contracts['fund-disbursement'].data['grants'][grantId];
						if (!grant) {
							return { success: false, error: 404 };
						}
						if (grant.status !== 'approved') {
							return { success: false, error: 403 };
						}
						
						grant.status = 'disbursed';
						grant['disbursement-time'] = state.blockHeight;
						return { success: true };
					}
				}
			},
			'outcome-reporting': {
				data: {
					'next-report-id': 1,
					'reports': {}
				},
				functions: {
					'submit-report': (grantId, title, description, metrics) => {
						if (title.length === 0) {
							return { success: false, error: 1 };
						}
						
						const reportId = state.contracts['outcome-reporting'].data['next-report-id'];
						state.contracts['outcome-reporting'].data['reports'][reportId] = {
							'grant-id': grantId,
							title,
							description,
							metrics,
							'submitted-by': 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM', // Mock sender
							'submission-time': state.blockHeight,
							verified: false,
							'verification-time': 0
						};
						
						state.contracts['outcome-reporting'].data['next-report-id']++;
						return { success: true, value: reportId };
					},
					'get-report': (reportId) => {
						return state.contracts['outcome-reporting'].data['reports'][reportId];
					},
					'verify-report': (reportId) => {
						const report = state.contracts['outcome-reporting'].data['reports'][reportId];
						if (!report) {
							return { success: false, error: 404 };
						}
						
						report.verified = true;
						report['verification-time'] = state.blockHeight;
						return { success: true };
					},
					'get-reports-by-grant': (grantId) => {
						// Simplified implementation
						return { success: true };
					}
				}
			}
		}
	};
	
	return {
		callPublic: (functionName, args) => {
			// Determine which contract the function belongs to
			for (const contractName in state.contracts) {
				if (state.contracts[contractName].functions[functionName]) {
					return state.contracts[contractName].functions[functionName](...args);
				}
			}
			throw new Error(`Function ${functionName} not found in any contract`);
		},
		callReadOnly: (functionName, args) => {
			// Determine which contract the function belongs to
			for (const contractName in state.contracts) {
				if (state.contracts[contractName].functions[functionName]) {
					return state.contracts[contractName].functions[functionName](...args);
				}
			}
			throw new Error(`Function ${functionName} not found in any contract`);
		},
		reset: () => {
			state.blockHeight = 1;
			state.contracts['funder-registration'].data['next-funder-id'] = 1;
			state.contracts['funder-registration'].data['funders'] = {};
			state.contracts['applicant-verification'].data['next-applicant-id'] = 1;
			state.contracts['applicant-verification'].data['applicants'] = {};
			state.contracts['fund-disbursement'].data['next-grant-id'] = 1;
			state.contracts['fund-disbursement'].data['grants'] = {};
			state.contracts['outcome-reporting'].data['next-report-id'] = 1;
			state.contracts['outcome-reporting'].data['reports'] = {};
		}
	};
}
