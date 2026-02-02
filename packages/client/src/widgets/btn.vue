<template>
	<n-button
		:class="[
			second_click ? click_twice : '',
		]"
		:disabled="disabled"
		:size="size"
		:title="title + (click_twice ? (title ? '\n' : '') + '(click twice)' : '')"
		type="info"
		@click.stop="onClick"
	>
		<slot />
	</n-button>
</template>

<script>
import {NButton, NRate} from 'naive-ui'

export default {
	components: {
		NButton,
		NRate,
	},
	props: {
		click_twice: { type: [Boolean, String], default: false },
		disabled: { type: Boolean },
		title: { type: String, default: "" },
		type: { type: String, default: "button" },
		size: { type: String, default: 'medium' },
	},
	emits: ['click'],
	data: () => ({
		second_click: false,
	}),
	methods: {
		onClick() {
			if (!this.click_twice || this.second_click) {
				this.second_click = false;
				this.$emit("click");
			}
			else {
				this.second_click = true;
				setTimeout(
					() => (this.second_click = false),
					settings.second_click_cooldown,
				);
			}
		},
	},
};
</script>

<style scoped>
.btn {
	background-color: gray;
	color: black;
	border-color: lime;
	/*cursor: pointer;*/
}

.btn:hover {
	background-color: red;
	color: var(--accent);
	border-color: var(--accent);
}

.clickable {
	cursor: pointer;
}
</style>
