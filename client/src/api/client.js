import { QueryClient } from '@tanstack/react-query';

export const STALE_TIME = 1000 * 60 * 5; // 5 minutes cached query or api call.
// Create a client
const queryConfig = {
    queries: {
        refetchOnWindowFocus: true
    }
};

export const queryClient = new QueryClient({ defaultOptions: queryConfig });
