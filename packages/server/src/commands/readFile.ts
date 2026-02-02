import fs from 'fs/promises';
import path from 'path';

export const run = async (ws, data) => {
	const { requestId, repo_path, file_path, options = {} } = data;
	const { as_buffer = false, null_if_not_exists = false } = options;

	try {
		const full_file_path = path.join(repo_path, file_path);

		let content;
		try {
			content = await fs.readFile(full_file_path, { encoding: as_buffer ? null : 'utf8' });
		} catch (e: any) {
			if (null_if_not_exists && e.code === 'ENOENT') {
				content = null;
			} else {
				throw e;
			}
		}

		ws.send(JSON.stringify({ requestId, status: 'success', data: content }));
	} catch (e: any) {
		console.error("Failed to read file:", e);
		ws.send(JSON.stringify({ requestId, status: 'error', message: e.message }));
	}
};
