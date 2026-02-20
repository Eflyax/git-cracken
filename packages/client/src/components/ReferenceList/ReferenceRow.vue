<template>
	<div
		class="reference-row"
		@click="setSelectedReference(reference)"
		@dblclick="
			hidden || commit === undefined ? {} : setSelectedCommits([reference.hash])
		"
	>
		<n-button
			:title="(hidden ? 'Show' : 'Hide')"
			@click="toggleVisibility"
			size="tiny"
			strong
			secondary
		>
			<icon
				:name="hidden ? 'mdi-eye-outline' : 'mdi-eye-off-outline'"
				class="size-4"
			/>
		</n-button>

		<div class="grow ellipsis" :title>
			{{ reference.name }}
		</div>
	</div>
</template>

<script>
import {NButton} from 'naive-ui';

export default {
	inject: [
		'selected_reference',
		'hidden_references',
		'commit_by_hash',
		'setSelectedReference',
		'setSelectedCommits',
		'refreshHistory',
	],
	components: {
		NButton
	},
	props: {
		reference: {
			type: Object,
			required: true
		},
	},
	computed: {
		active() {
			return this.reference.id === this.selected_reference?.id;
		},
		hidden() {
			return this.hidden_references.has(this.reference.id);
		},
		commit() {
			return this.commit_by_hash[this.reference.hash];
		},
		title() {
			let title = this.reference.name;

			if (this.hidden) {
				title += "\n(hidden in the graph)";
			}
			else if (this.commit === undefined) {
				title += "\n(not in the graph)";
			}
			else {
				title += "\n(double-click to view commit)";
			}

			return title;
		},
	},
	methods: {
		async toggleVisibility() {
			const f = this.hidden ? "delete" : "add";
			this.hidden_references[f](this.reference.id);

			await this.refreshHistory({ skip_references: true });
		},
	},
};
</script>
