import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

function useBlockBackNavigation() {
    const router = useRouter();

    useEffect(() => {
        const handlePopState = (event) => {
            if (window.location.pathname === '/') {
                // Prevent navigating back
                router.replace('/');
                window.history.pushState(null, '', window.location.href);
            }
        };

        window.addEventListener('popstate', handlePopState);

        // Push the current state to start the history stack from this point
        window.history.pushState(null, '', window.location.href);

        return () => {
            window.removeEventListener('popstate', handlePopState);
        };
    }, [router]);
}

export default useBlockBackNavigation;
