import { TestBed, inject } from '@angular/core/testing';

import { CancelSubmissionComponent } from './Cancel-Submission.component';

describe('a Cancel-Submission component', () => {
	let component: CancelSubmissionComponent;

	// register all needed dependencies
	beforeEach(() => {
		TestBed.configureTestingModule({
			providers: [
				CancelSubmissionComponent
			]
		});
	});

	// instantiation through framework injection
	beforeEach(inject([CancelSubmissionComponent], (CancelSubmissionComponent) => {
		component = CancelSubmissionComponent;
	}));

	it('should have an instance', () => {
		expect(component).toBeDefined();
	});
});