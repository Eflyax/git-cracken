<template>
	<div class="commit-browser">
		<div class="graph-container">
			<svg
				class="svg"
				:width="svgDimensions.width"
				:height="svgDimensions.height"
			>
				<g v-for="commit in commits" :key="commit.hash">

					<template v-for="parentHash in commit.parents" :key="parentHash">
						<path
							v-if="commitMap.get(parentHash)"
							:d="getBezierPath(commit, parentHash)"
							:stroke="getColor(commit.level)"
							:stroke-width="CONFIG.LINE_WIDTH"
							fill="none"
							opacity="0.7"
						/>
					</template>

					<circle
						:cx="CONFIG.PADDING_LEFT + commit.level * this.CONFIG.X_STEP"
						:cy="CONFIG.PADDING_TOP + commit.index * this.CONFIG.Y_STEP"
						:r="CONFIG.CIRCLE_R"
						:fill="getColor(commit.level)"
						stroke="#1e1e1e"
						stroke-width="2"
					/>
				</g>
			</svg>
		</div>

		<div class="list-container" :style="{ paddingTop: '0px' }">
			<div
				v-for="commit in commits"
				:key="commit.hash"
				class="commit-row"
				:style="{ height: `${CONFIG.Y_STEP}px` }"
			>
				<div class="commit-subject" :title="commit.subject">
					{{ commit.subject }}
				</div>
				<div class="commit-meta">
					<span class="author">{{ commit.author_name }}</span>
					<span class="hash">{{ commit.hash_abbr }}</span>
				</div>
			</div>
		</div>

	</div>
</template>

<script>
import colors from '@/theme/colors';
import {ECommitHashes} from '@/types';


export default {
	inject: [
		'commits',
		'commit_by_hash',
		'selected_commits',
	],
	props: {
		row_height: {
			type: Number,
			required: true
		},
		scroll_position: {
			type: Number,
			required: true
		},
	},
	data() {
		return {
			CONFIG: {
				X_STEP: 20,
				Y_STEP: 36,
				CIRCLE_R: 5,
				LINE_WIDTH: 2,
				PADDING_LEFT: 15,
				PADDING_TOP: 18,
				COLORS: ['#00BFFF', '#F06292', '#66BB6A', '#FFD54F', '#FF7043', '#AB47BC']
			}
		}
	},
	watch: {
		// commits() {
		// 	this.draw();
		// },
		// scroll_position() {
		// 	this.draw();
		// },
		// selected_commits() {
		// 	this.draw();
		// }
	},
	computed: {
		commitMap() {
			const map = new Map();
			this.commits.forEach(c => map.set(c.hash, c));
			return map;
		},
		svgDimensions() {
			if (this.commits.length === 0) {
				return { width: 0, height: 0 };
			}

			const maxLevel = Math.max(...this.commits.map(c => c.level || 0));

			return {
				width: (maxLevel + 1) * this.CONFIG.X_STEP + this.CONFIG.PADDING_LEFT + 20,
				height: this.commits.length * this.CONFIG.Y_STEP + 20
			};
		}
	},
	methods: {
		getBezierPath(commit, parentHash) {
			const parent = this.commitMap.get(parentHash);

			if (!parent) {
				return null;
			}

			const startX = this.CONFIG.PADDING_LEFT + commit.level * this.CONFIG.X_STEP;
			const startY = this.CONFIG.PADDING_TOP + commit.index * this.CONFIG.Y_STEP;

			const endX = this.CONFIG.PADDING_LEFT + parent.level * this.CONFIG.X_STEP;
			const endY = this.CONFIG.PADDING_TOP + parent.index * this.CONFIG.Y_STEP;

			return `
				M ${startX} ${startY}
				C ${startX} ${startY + this.CONFIG.Y_STEP / 2},
					${endX}   ${endY - this.CONFIG.Y_STEP / 2},
					${endX}   ${endY}
			`;
		},
		getColor(level) {
			return this.CONFIG.COLORS[level % this.CONFIG.COLORS.length];
		},
	},
};
</script>


<style scoped>
.commit-browser {
	display: flex;
	font-family: 'Fira Code', monospace;
	background-color: #1e1e1e;
	color: #d4d4d4;
	overflow: auto;
}

.graph-container {
	flex-shrink: 0;
	border-right: 1px solid #333;
}

.list-container {
	flex-grow: 1;
	min-width: 0;
}

.commit-row {
	display: flex;
	align-items: center;
	padding: 0 10px;
	border-bottom: 1px solid #2a2a2a;
	cursor: pointer;
	transition: background 0.2s;
	box-sizing: border-box;
}

.commit-row:hover {
	background-color: #2a2d2e;
}

.commit-subject {
	flex-grow: 1;
	white-space: nowrap;
	overflow: hidden;
	text-overflow: ellipsis;
	margin-right: 15px;
	font-weight: 500;
}

.commit-meta {
	display: flex;
	gap: 15px;
	font-size: 0.85em;
	color: #888;
	flex-shrink: 0;
}

.hash {
	color: #569cd6;
}

.svg {
	height: unset;
	width: unset;
}
</style>
