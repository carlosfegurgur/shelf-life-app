// src/routes/(protected)/+layout.server.ts
import { redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ locals: { user, session } }) => {
  if (!session || !user) {
    throw redirect(303, '/login');
  }
  
  return {
   user,
   session
  };
};