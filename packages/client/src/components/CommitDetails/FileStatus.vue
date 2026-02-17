<template>
	<div class="file-status">
		<icon
			v-if="status === 'M'"
			name="mdi-pencil"
			class="file-status modified"
		/>
		<icon
			v-else-if="status === 'A'"
			name="mdi-plus"
			class="added"
		/>
		<icon
			v-else-if="status === 'D'"
			name="mdi-minus"
			class="deleted"
		/>
	</div>
</template>

<script>
export default {
	props: {
		status: {
			type: String,
			required: true
		}
	}
}
</script>

<style>
.file-status {
	.modified {
		fill: #FFC107;
	}

	.added {
		fill: #4CAF50;
	}

	.deleted {
		fill: #F44336;
	}
}
</style>
