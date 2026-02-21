import {ref, isRef} from 'vue';

const
	stashes = ref({});

export function useStash(repoOrRef) {

	function getRepo() {
		return isRef(repoOrRef) ? repoOrRef.value : repoOrRef;
	}

	async function getStashes() {
		const repo = getRepo();

		if (!repo) return;

		stashes.value = {};

		const
			output = await repo.callGit('stash', 'list', '--format="%gd|%H|%P|%s"');

		output.split('\n').filter(Boolean).map(line => {
			const
				[id, hash, parents, message] = line.split('|'),
				parentList = parents.split(' ');

			stashes.value[id] = {
				id,
				hash,
				parentHash: parentList[0],
				message,
				isStash: true
			};
		});
	};

	return {
		getStashes,
		stashes
	};
}
