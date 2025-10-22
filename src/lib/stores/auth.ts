import { writable } from 'svelte/store';
import { supabase } from '$lib/supabaseClient';
import type { AuthChangeEvent, Session, User } from '@supabase/supabase-js';

export const user = writable<User | null | undefined>(undefined)
export const authInitialized = writable<boolean>(false)

export async function initAuth() {
    const { data: { session } } = await supabase.auth.getSession()
    user.set(session?.user ?? null)
    authInitialized.set(true)

    supabase.auth.onAuthStateChange((event: AuthChangeEvent, session: Session | null) => {
        user.set(session?.user ?? null)
    })
}