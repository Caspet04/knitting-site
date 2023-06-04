export type StitchData =
	| {
			name: string;
			identifier: string;
			type: 'empty';
	  }
	| {
			name: string;
			identifier: string;
			type: 'filled';
			filled: number;
	  }
	| {
			name: string;
			identifier: string;
			type: 'image';
			image: string;
	  };
