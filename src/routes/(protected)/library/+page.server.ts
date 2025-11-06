import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ depends, locals: { supabase } }) => {
	depends('supabase:db:books');
	const { data: books } = await supabase.from('books').select('*');
	return {  
        books: books ?? [] 
    };
};
