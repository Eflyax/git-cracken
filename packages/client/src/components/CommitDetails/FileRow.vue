<template>
	<div
		class="file-row"
		:class="{active}"
		:title="
			(['R', 'C'].includes(file.status) ? `${file.old_path} -> ` : '') +
			file.path
		"
		@click="selected_file = file"
	>
		<div class="status">
			<file-status :status="file.status" />
			<!-- {{ file.status }} -->
		</div>

		<file-path :path="file.path" />

		<div
			class="flex w-0 overflow-hidden group-hover:w-auto group-hover:overflow-visible"
		>
			<btn
				v-for="action in file.area === 'unstaged'
					? ['discard', 'stage']
					: file.area === 'staged'
						? ['unstage']
						: []"
				:click_twice="action === 'discard' && 'text-red'"
				:title="$_.title(action)"
				@click="run(action)"
			>
				<icon :name="$settings.icons[action]" class="size-5" />
			</btn>
		</div>
	</div>
</template>

<script>
export default {
	inject: ["repo", "selected_file", "updateFileStatus", "saveSelectedFile"],
	props: {
		file: { type: Object, required: true },
	},
	computed: {
		active() {
			return _.isEqual(this.file, this.selected_file);
		},
	},
	methods: {
		async run(action) {
			await this.saveSelectedFile();

			if (action === "stage") {
				await this.repo.callGit("add", "--", this.file.path);
			} else if (action === "unstage") {
				await this.repo.callGit(
					"restore",
					"--staged",
					"--",
					this.file.path,
					..._.filter([this.file.old_path]),
				);
			} else if (action === "discard") {
				if (this.file.status === "A") {
					await this.repo.callGit("clean", "--force", "--", this.file.path);
				} else {
					await this.repo.callGit("checkout", "--", this.file.path);
				}
			}
			await this.updateFileStatus(this.file);
		},
	},
};
</script>

<style scoped lang="scss">
@use '../../styles/colors.scss';

.file-row {
	display: flex;
	align-items: center;
	padding: 0 5px;
	cursor: pointer;
	border-bottom: 1px solid colors.$secondary;

	&:hover {
		background-color: colors.$secondary;
		color: black;
	}

	&.active {
		background-color: colors.$secondary;
		color: black;
	}
}
</style>
