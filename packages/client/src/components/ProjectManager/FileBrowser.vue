<template>
	<div class="file-browser">
		<div v-if="status !== ECheckStatuses.Online" class="status-bar">
			<span v-if="status === ECheckStatuses.Checking" class="checking">Connecting to server...</span>
			<span v-else class="offline">Server offline ({{ status }})</span>
		</div>
		<template v-else>
			<div class="breadcrumb">
				<span
					v-for="(segment, i) in pathSegments"
					:key="i"
					class="segment"
					@click="navigateTo(pathUpTo(i))"
				>
					{{ segment || '/' }}<span v-if="i < pathSegments.length - 1" class="sep">/</span>
				</span>
			</div>

			<div class="file-list">
				<div v-if="loading" class="loading">Loading...</div>

				<template v-else>
					<div
						v-if="currentPath !== '/'"
						class="entry entry--dir"
						@click="navigateUp"
					>
						<icon name="mdi-arrow-up" />
						<span>..</span>
					</div>

					<div
						v-for="entry in entries"
						:key="entry.name"
						class="entry"
						:class="{ 'entry--dir': entry.isDirectory, 'entry--file': !entry.isDirectory }"
						@click="entry.isDirectory && navigateTo(joinPath(currentPath, entry.name))"
					>
						<icon :name="entry.isDirectory ? 'mdi-folder' : 'mdi-file-outline'" />
						<span>{{ entry.name }}</span>
					</div>

					<div v-if="entries.length === 0" class="empty">
						Empty directory
					</div>
				</template>
			</div>

			<div class="footer">
				<span class="current-path">{{ currentPath }}</span>
				<n-button type="success" size="small" @click="selectPath">
					Select this folder
				</n-button>
			</div>
		</template>
	</div>
</template>

<script setup lang="ts">
import {ref, computed, onMounted, onUnmounted} from 'vue';
import {NButton} from 'naive-ui';
import {useServerCheck} from '@/composables/useServerCheck';
import {useProject} from '@/composables/useProject';
import {ECheckStatuses} from '@/types';
import {WebSocketClient} from '@/utils/websocket';

interface FileEntry {
	name: string;
	isDirectory: boolean;
}

const emit = defineEmits<{
	select: [path: string];
}>();

const
	{ status, check } = useServerCheck(),
	{ editableProject } = useProject(),
	currentPath = ref<string>(editableProject.value?.path || '/'),
	entries = ref<FileEntry[]>([]),
	loading = ref(false);

let ws: WebSocketClient | null = null;

const pathSegments = computed(() => {
	if (currentPath.value === '/') return ['/'];
	return ['/', ...currentPath.value.split('/').filter(Boolean)];
});

function pathUpTo(index: number): string {
	if (index === 0) return '/';
	const segments = currentPath.value.split('/').filter(Boolean);
	return '/' + segments.slice(0, index).join('/');
}

function joinPath(base: string, name: string): string {
	return base === '/' ? `/${name}` : `${base}/${name}`;
}

const parentPath = computed(() => {
	const parts = currentPath.value.split('/').filter(Boolean);
	if (parts.length <= 1) return '/';
	return '/' + parts.slice(0, -1).join('/');
});

async function loadDirectory(path: string) {
	if (!ws) {
		return;
	}

	loading.value = true;

	try {
		const result = await ws.call('browse-files', { path });
		entries.value = result.entries;
		currentPath.value = result.path;
	}
	catch (e: any) {
		window.error(e.message, 'Browse error');
	}
	finally {
		loading.value = false;
	}
}

function navigateTo(path: string) {
	loadDirectory(path);
}

function navigateUp() {
	navigateTo(parentPath.value);
}

function selectPath() {
	emit('select', currentPath.value);
}

onMounted(async () => {
	const
		{server, port} = editableProject.value,
		online = await check(server, port);

	if (online) {
		ws = new WebSocketClient(`ws://${server}:${port}`);
		loadDirectory(currentPath.value);
	}
});

onUnmounted(() => {
	ws?.close();
	ws = null;
});
</script>

<style scoped lang="scss">
.file-browser {
	display: flex;
	flex-direction: column;
	height: 480px;
	gap: 8px;
}

.status-bar {
	padding: 16px;
	color: #aaa;
	font-size: 0.9em;

	.checking { color: #7ec8e3; }
	.offline  { color: #e38787; }
}

.breadcrumb {
	display: flex;
	flex-wrap: wrap;
	align-items: center;
	gap: 2px;
	padding: 6px 10px;
	background: #1e1e1e;
	border-radius: 4px;
	font-size: 0.85em;

	.segment {
		cursor: pointer;
		color: #aaa;
		white-space: nowrap;

		&:hover { color: #fff; }
		&:last-child { color: #fff; cursor: default; }

		.sep {
			margin: 0 2px;
			color: #555;
		}
	}
}

.file-list {
	flex: 1;
	overflow-y: auto;
	display: flex;
	flex-direction: column;
	gap: 1px;
}

.loading,
.empty {
	padding: 12px;
	color: #666;
	font-size: 0.9em;
}

.entry {
	display: flex;
	align-items: center;
	gap: 8px;
	padding: 5px 10px;
	border-radius: 4px;
	user-select: none;
	font-size: 0.9em;

	&--dir {
		cursor: pointer;
		color: #7ec8e3;
		&:hover { background: #2a2a2a; }
	}

	&--file {
		color: #ccc;
		cursor: default;
	}
}

.footer {
	display: flex;
	align-items: center;
	justify-content: space-between;
	gap: 12px;
	padding-top: 8px;
	border-top: 1px solid #333;

	.current-path {
		flex: 1;
		font-size: 0.8em;
		color: #888;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}
}
</style>
