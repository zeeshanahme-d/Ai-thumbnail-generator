import { Link } from "react-router-dom";
import Button from "../../../components/Button";

interface UserNotFoundProps {
  username?: string;
}

export default function UserNotFound({ username }: UserNotFoundProps) {
  return (
    <main className="flex min-h-[60vh] flex-col items-center justify-center px-4 py-16 text-center">
      <h1 className="text-3xl font-bold text-text-primary">User Not Found</h1>
      <p className="mt-2 text-sm text-text-secondary">
        No creator profile found for{" "}
        <span className="font-semibold">@{username}</span>.
      </p>
      <Link to="/community" className="mt-6">
        <Button variant="primary" size="sm">
          Explore Community Gallery
        </Button>
      </Link>
    </main>
  );
}
