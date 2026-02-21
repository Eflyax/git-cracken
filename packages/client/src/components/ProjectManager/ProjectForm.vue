<template>
	<div v-if="editableProject">
		<n-card
			:title="editableProject.id ? 'Edit Project' : 'Add Project'"
			:bordered="false"
			size="huge"
			role="dialog"
			aria-modal="true"
		>
			<n-form @submit.prevent="handleSave">
				<n-form-item label="Alias">
					<n-input v-model:value="editableProject.alias" placeholder="Project Alias" />
				</n-form-item>
				<n-form-item label="Path">
					<n-input v-model:value="editableProject.path" placeholder="Project Path" />
				</n-form-item>
				<n-form-item label="Server">
					<n-input v-model:value="editableProject.server" placeholder="Server Address" />
				</n-form-item>
				<n-form-item label="Port">
					<n-input-number v-model:value="editableProject.port" placeholder="Port" />
				</n-form-item>
				<n-button type="primary" attr-type="submit">Save</n-button>
			</n-form>
		</n-card>
	</div>
</template>

<script setup lang="ts">
import {useProject} from '@/composables/useProject';
import {NButton, NInput, NModal, NCard, NForm, NFormItem, NInputNumber} from 'naive-ui';

const
	{addProject, updateProject, editableProject} = useProject();

function handleSave() {
	if (!editableProject.value.alias || !editableProject.value.path) {
		alert('Alias and Path are required.');
		return;
	}

	if (editableProject.value.id) {
		updateProject(editableProject.value.id, editableProject.value);
	}
	else {
		addProject(editableProject.value);
	}

	editableProject.value = null;
	success();
}

</script>
