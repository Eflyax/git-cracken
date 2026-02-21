import {readdirSync, statSync} from 'fs';
import {join} from 'path';

export const run = async (ws, data) => {
	const {requestId, path: dirPath = '/'} = data;

	try {
		const names = readdirSync(dirPath);

		const entries = names
			.map(name => {
				const fullPath = join(dirPath, name);

				let isDirectory = false;
				try {
					isDirectory = statSync(fullPath).isDirectory();
				} catch {
					// Ignore entries I can't stat (e.g. permission errors, broken symlinks)
				}
				return {
					name,
					isDirectory
				};
			})
			.sort((a, b) => {
				if (a.isDirectory !== b.isDirectory) {
					return a.isDirectory ? -1 : 1;
				}
				return a.name.localeCompare(b.name);
			});

		ws.send(JSON.stringify({
			requestId,
			status: 'success',
			data: { path: dirPath, entries }
		}));
	} catch (error: any) {
		ws.send(JSON.stringify({
			requestId,
			status: 'error',
			message: error.message
		}));
	}
};
