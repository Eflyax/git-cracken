<template>
	<div class="file-path">
		<!-- https://stackoverflow.com/questions/70886734/how-do-i-control-the-order-in-which-flexbox-items-grow-shrink -->
		<div
			v-if="parts.length > 2"
			class="opacity-path"
		>
			{{ parts[0] }}
		</div>
		<div v-if="parts.length > 2" class="opacity-path">/</div>
		<div
			v-if="parts.length > 1"
			class="opacity-path"
		>
			<!-- https://stackoverflow.com/questions/24800720/how-not-to-make-dir-rtl-send-special-characters-like-to-the-left-side -->
			<bdi>{{ parts.at(-2) }}/</bdi>
		</div>
		<div class="ellipsis">
			{{ parts.at(-1) }}
		</div>
	</div>
</template>

<script>
export default {
	props: {
		path: {
			type: String,
			required: true
		}
	},
	computed: {
		parts() {
			const
				parts = this.path.split('/'),
				result = [];

			if (parts.length > 2) {
				result.push(parts.slice(0, -2).join('/'));
			}

			result.push(...parts.slice(-2));

			return result;
		},
	},
};
</script>

<style scoped>
.file-path {
	display: flex;
	flex-grow: 1;
	white-space: nowrap;
	overflow: hidden;
	text-overflow: ellipsis;
	margin-left: 8px;
	font-weight: 500;

	.opacity-path {
		opacity: 0.35;
	}
}
</style>
