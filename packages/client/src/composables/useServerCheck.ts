import {ref} from 'vue';
import {ECheckStatuses} from '@/types'

const
	TIMEOUT_MS = 4_000;

export function useServerCheck() {
	const status = ref<ECheckStatuses>(ECheckStatuses.Idle);

	function check(server: string, port: number): Promise<boolean> {
		status.value = ECheckStatuses.Checking;

		return new Promise((resolve) => {
			let settled = false;

			const
				ws = new WebSocket(`ws://${server}:${port}`),
				timeout = setTimeout(() => settle(false), TIMEOUT_MS);

			function settle(online: boolean) {
				if (settled) return;
				settled = true;
				clearTimeout(timeout);
				ws.close();
				status.value = online
					? ECheckStatuses.Online
					: ECheckStatuses.Offline;

				resolve(online);
			}

			ws.onopen  = () => settle(true);
			ws.onerror = () => settle(false);
			ws.onclose = (e) => {
				if (!e.wasClean) {
					settle(false);
				}
			};
		});
	}

	function reset() {
		status.value = 'idle';
	}

	return {
		status,
		check,
		reset
	};
}
