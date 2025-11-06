import type { PageServerLoad } from "./$types";

// In the same folder as your +page.svelte
export const load: PageServerLoad = async ({ locals: { user, userProfile } }) => {
    return {
      user,
      userProfile,
    };
  };