import { user } from '$lib/stores/auth';
import { goto } from '$app/navigation';
import { get } from 'svelte/store';

export function requireAuth() {
	const currentUser = get(user);
	if (!currentUser) {
		goto('/login');
		return false;
	}
	return true;
}

export function requireGuest() {
	const currentUser = get(user);
	if (currentUser) {
		goto('/');
		return false;
	}
	return true;
}
