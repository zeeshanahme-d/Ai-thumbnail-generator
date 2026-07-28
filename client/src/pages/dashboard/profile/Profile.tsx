import { User } from "lucide-react";
import DashboardPage from "../components/DashboardPage";
import ThumbnailCard from "../../../components/ThumbnailCard";
import useMyThumbnails from "../core/hooks/use-my-thumbnails";

export default function Profile() {
  const { data: generations = [], isLoading } = useMyThumbnails();

  return (
    <DashboardPage
      icon={User}
      title="Your gallery"
      description="Everything you have generated so far."
    >
      {isLoading ? (
        <p className="text-sm text-text-muted">Loading your gallery...</p>
      ) : generations.length === 0 ? (
        <p className="text-sm text-text-muted">
          Your gallery is empty. Head to Generate to create your first thumbnail.
        </p>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {generations.map((thumbnail, index) => (
            <ThumbnailCard
              key={thumbnail._id}
              thumbnail={thumbnail}
              index={index}
            />
          ))}
        </div>
      )}
    </DashboardPage>
  );
}
