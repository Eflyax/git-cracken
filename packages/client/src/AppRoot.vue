<template>
	<n-config-provider :theme="darkTheme">
		<div class="app-root">

			<div class="repos">
				<!-- <draggable v-model="tabs" item-key="id" class="flex items-center overflow-x-auto">
										<template #item="{ element: tab }">
												<div
														class="clickable pl-4 pr-2 py-1.5 flex gap-3 whitespace-nowrap"
														:class="{ active: tab.id === selected_tab_id }"
														@click="selected_tab_id = tab.id"
												>
														{{ tab.title ?? 'New tab' }}
														<btn title="Close" @click="closeTab(tab)">
																<icon name="mdi-close" class="size-4" />
														</btn>
												</div>
										</template>
								</draggable> -->
				<n-button
					title="Add tab"
					type="default"
					class="open-repo"
					@click="addTab"
				>
					<icon name="mdi-plus" />
				</n-button>
			</div>

			<div class="tab-wrapper">
				<template v-for="tab in tabs" :key="tab.id">
					<TabContent
						v-if="tabs_initialized.has(tab.id)"
						:active="tab.id === selected_tab_id"
						:repo_details="tab"
					/>
				</template>
			</div>

		</div>
	</n-config-provider>
</template>

<script>
import WindowEventMixin from '@/mixins/WindowEventMixin';
import TabContent from './components/TabContent.vue';
import {WebSocketClient} from './utils/websocket';
import {electronMock} from './electronMock';
import {darkTheme, NButton, NConfigProvider, NInput, NDatePicker, NSpace} from 'naive-ui';

export default {
	components: {
		NButton,
		TabContent,
		NConfigProvider,
		NInput,
		NDatePicker,
		NSpace,
	},
	mixins: [
		WindowEventMixin('keydown', 'onKeyDown')
	],
	provide() {
		return {
			websocket: this.websocket,
		};
	},
	setup() {

		return {
			darkTheme
		}
	},
	data: () => ({
		tabs: [],
		selected_tab_id: 1,
		tabs_initialized: new Set(),
		websocket: new WebSocketClient('ws://localhost:3000'),
	}),
	watch: {
		selected_tab_id: {
			handler() {
				this.tabs_initialized.add(this.selected_tab_id);
			},
			immediate: true,
		},
	},
	created() {
		let last_id = _.max(_.map(this.tabs, "id")) ?? 0;
		this.getNextId = () => ++last_id;
		window.electron = electronMock;
	},
	mounted() {
		this.addTab();
	},
	beforeUnmount() {
		if (this.websocket) {
			this.websocket.close();
		}
	},
	methods: {
		closeTab(tab) {
			_.remove(this.tabs, { id: tab.id });

			if (this.selected_tab_id === tab.id) {
				this.selected_tab_id = _.last(this.tabs)?.id;
			}
			if (this.selected_tab_id === undefined) {
				this.addTab();
			}
		},
		addTab() {
			const id = this.getNextId();
			this.tabs.push({ id });
			this.selected_tab_id = id;
		},
		onKeyDown(event) {
			if (event.ctrlKey && event.key === "t") {
				this.addTab();
			}
		},
	},
};
</script>
