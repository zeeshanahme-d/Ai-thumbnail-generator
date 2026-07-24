import { User } from "lucide-react";
import DashboardPage from "../components/DashboardPage";
import { ThumbnailData } from "../../../data/thumbnail";
import ThumbnailCard from "../../../components/ThumbnailCard";

export default function Profile() {
  const generations = ThumbnailData.slice(0, 9);

  return (
    <DashboardPage
      icon={User}
      title="Your gallery"
      description="Everything you have generated so far."
    >
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {generations.map((thumbnail, index) => (
          <ThumbnailCard
            key={thumbnail._id}
            thumbnail={thumbnail}
            index={index}
          />
        ))}
      </div>
    </DashboardPage>
  );
}
