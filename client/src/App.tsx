import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import SessionProvider from "./components/SessionProvider";
import AppRoutes from "./routes/routes";

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            refetchOnWindowFocus: false,
            retry: 1,
        },
    },
});

export default function App() {
    return (
        <QueryClientProvider client={queryClient}>
            <SessionProvider>
                <AppRoutes />
            </SessionProvider>
        </QueryClientProvider>
    );
}
