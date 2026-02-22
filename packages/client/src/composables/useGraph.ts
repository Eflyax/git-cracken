import {computed, ref} from 'vue';
import {useProject} from '@/composables/useProject';
import {useCommits} from '@/composables/useCommits';
import {CONFIG} from '@/settings';

const
	ROW_MARGIN_BOTTOM = 5 / 1;

export function useGraph() {
	const
		{commits, commitMap} = useCommits(),
		svgDimensions = computed(() => {
			if (commits.value.length === 0) {
				return { width: 0, height: 0 };
			}

			const
				maxLevel = Math.max(...commits.value.map(c => c.level || 0));

			return {
				width: (maxLevel + 1) * CONFIG.X_STEP + CONFIG.PADDING_LEFT + 20,
				height: commits.value.length * CONFIG.Y_STEP + 20
			};
		});

	function getCommitRadius(commit) {
		const
			radiusDivider = commit.parents.length > 1 ? 2 : 1;

		return CONFIG.CIRCLE_R / radiusDivider;
	}

	function getTopologyPath(commit, parentHash) {
		const
			parent = commitMap.value.get(parentHash);

		if (!parent) {
			return null;
		}

		const
			startX = CONFIG.PADDING_LEFT + commit.level * CONFIG.X_STEP,
			startY = CONFIG.PADDING_TOP + commit.index * CONFIG.Y_STEP - ROW_MARGIN_BOTTOM,
			endX = CONFIG.PADDING_LEFT + parent.level * CONFIG.X_STEP,
			endY = CONFIG.PADDING_TOP + parent.index * CONFIG.Y_STEP - ROW_MARGIN_BOTTOM;

		if (commit.level === parent.level) {
			return `M ${startX} ${startY + CONFIG.CIRCLE_R} L ${endX} ${endY - CONFIG.CIRCLE_R}`;
		}

		const
			deltaLevel = commit.level - parent.level,
			xDir = endX > startX ? 1 : -1,
			yDir = 1;

		if (deltaLevel < 0) {
			const
				fromX = startX + (CONFIG.CIRCLE_R * xDir),
				fromY = startY,
				targetX = endX,
				targetY = endY - CONFIG.CIRCLE_R,
				width = Math.abs(endX - startX),
				height = Math.abs(endY - startY),
				r = Math.min(CONFIG.CORNER_RADIUS / 1.5, width / 2, height / 2);

			return `
				M ${fromX} ${fromY}
				L ${targetX - (r * xDir)} ${fromY}
				Q ${targetX} ${fromY} ${targetX} ${fromY + r}
				L ${targetX} ${targetY}
			`;
		}
		else {
			const
				fromX = startX,
				fromY = startY + (CONFIG.CIRCLE_R * yDir),
				targetX = endX - (CONFIG.CIRCLE_R * xDir),
				targetY = endY,
				r = Math.min(CONFIG.CORNER_RADIUS / 1.5, Math.abs(endY - startY) / 2);

			return `
				M ${fromX} ${fromY}
				L ${fromX} ${targetY - r}
				Q ${fromX} ${targetY} ${fromX + (r * xDir)} ${targetY}
				L ${targetX} ${targetY}
			`;
		}
	}

	function getColor(level) {
		return CONFIG.COLORS[level % CONFIG.COLORS.length];
	}

	return {
		svgDimensions,
		ROW_MARGIN_BOTTOM,
		getColor,
		getCommitRadius,
		getTopologyPath
	};
}
