
export default (name, default_value) => {
	return {
		data: () => ({
			[name]: localStorage.getItem(name) || default_value,
		}),
		// watch: {
		// 	[name]: {
		// 		handler() {
		// 			// https://github.com/electron/electron/issues/26338
		// 			const value = JSON.parse(JSON.stringify(this[name]));

		// 			localStorage.setItem(name, value);
		// 		},
		// 		deep: true,
		// 	},
		// },
	};
};
