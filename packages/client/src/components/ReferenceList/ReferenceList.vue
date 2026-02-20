<template>
	<div
		class="reference-list"
		:dbl-click-splitter="false"
		horizontal
		@resized="
			references_list_pane_sizes = Object.fromEntries(
				$_.zip(referenceTypes, $_.map($event, 'size')),
			)
		"
	>
		<pane
			v-for="(type, i) in referenceTypes"
			:size="references_list_pane_sizes[type]"
		>
			<div>
				<hr v-if="i > 0" />

				<div class="header">
					<icon :name="$settings.icons[type]" />
					<span class="title">
						{{ titleByType(type) }}
					</span>
					<div class="count">
						{{ references_by_type[type]?.length ?? 0 }}
					</div>
				</div>

				<NVirtualList
					v-if="references_by_type[type] !== undefined"
					:items="references_by_type[type]"
					:item-size="32"
					key-field="name"
				>
					<template #default="{ item }">
						<ReferenceRow
							:key="item.name"
							:reference="item"
						/>
					</template>
				</NVirtualList>
			</div>
		</pane>
	</div>
</template>

<script>
import StoreMixin from "@/mixins/StoreMixin";
import ReferenceRow from "./ReferenceRow.vue";
import {NVirtualList} from 'naive-ui';

export default {
	components: {
		ReferenceRow,
		NVirtualList
	},
	mixins: [
		StoreMixin("references_list_pane_sizes", {})
	],
	inject: [
		'references_by_type'
	],
	computed: {
		referenceTypes() {
			return _.without(settings.referenceTypeOrder, "head");
		},
	},
	methods: {
		titleByType(type) {
			switch (type){
				case 'local_branch':
					return 'local';
				case 'remote_branch':
					return 'remote';
				case 'tag':
					return 'tags';
			}
		}
	}
}
</script>
