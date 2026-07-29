import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "react-hot-toast";
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
                <Toaster
                    position="top-right"
                    toastOptions={{
                        duration: 3500,
                        style: {
                            background: "var(--color-background-card)",
                            color: "var(--color-text-primary)",
                            border: "1px solid var(--color-border)",
                            borderRadius: "12px",
                            fontSize: "14px",
                        },
                        success: {
                            iconTheme: {
                                primary: "var(--color-success)",
                                secondary: "var(--color-background-card)",
                            },
                        },
                        error: {
                            iconTheme: {
                                primary: "#ef4444",
                                secondary: "var(--color-background-card)",
                            },
                        },
                    }}
                />
            </SessionProvider>
        </QueryClientProvider>
    );
}

