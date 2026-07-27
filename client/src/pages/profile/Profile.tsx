import { Link } from "react-router-dom";
import { Settings, Plus, Heart, LayoutGrid } from "lucide-react";
import Wrapper from "../../components/Wrapper";
import Button from "../../components/Button";
import ThumbnailCard from "../../components/ThumbnailCard";
import { ThumbnailData } from "../../data/thumbnail";
import Banner from "./components/Banner";

export default function Profile() {
  const dummyGenerations = ThumbnailData.slice(0, 9);
  const creationsCount = dummyGenerations.length;
  const likesCount = 0;

  return (
    <main className="min-h-screen bg-background-surface pb-20">
      <Banner />

      <Wrapper className="relative -mt-12 sm:-mt-16 mb-8">
        <div className="flex items-end justify-between">
          <div className="flex flex-col">
            <div className="size-24 shrink-0 rounded-full border-4 border-background-surface bg-[#00897b] flex items-center justify-center text-4xl font-medium text-white sm:size-32 sm:text-5xl">
              A
            </div>
          </div>

          <div className="mb-2 sm:mb-4">
            <Button variant="secondary" size="sm" fullWidth={false} className="gap-2 text-xs">
              <Settings size={14} />
              Edit Profile
            </Button>
          </div>
        </div>

        <div className="mt-4">
          <h1 className="text-2xl font-bold text-text-primary">Ahtisham khan</h1>
          <p className="text-sm text-text-secondary">@ahtisham_khan</p>

          <div className="mt-6 flex gap-6">
            <div className="flex flex-col items-start">
              <span className="text-lg font-semibold text-text-primary">{creationsCount}</span>
              <span className="flex items-center gap-1 text-xs text-text-secondary">
                <LayoutGrid size={12} /> Creations
              </span>
            </div>
            <div className="flex flex-col items-start">
              <span className="text-lg font-semibold text-text-primary">{likesCount}</span>
              <span className="flex items-center gap-1 text-xs text-text-secondary">
                <Heart size={12} /> Likes
              </span>
            </div>
          </div>
        </div>

        <hr className="my-8 border-border" />

        <div className="mb-6 flex items-center justify-between">
          <h2 className="flex items-center gap-2 text-lg font-semibold text-text-primary">
            My Creations <span className="text-sm font-normal text-text-muted">({creationsCount})</span>
          </h2>

          <div className="flex items-center gap-3">
            <Link to="/generate">
              <Button variant="primary" size="sm" fullWidth={false} className="gap-2">
                <Plus size={16} />
                New Thumbnail
              </Button>
            </Link>
            <Link to="/recreate">
              <Button variant="secondary" size="sm" fullWidth={false} className="gap-2 bg-transparent">
                Recreate
              </Button>
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {dummyGenerations.map((thumbnail, index) => (
            <ThumbnailCard
              key={thumbnail._id}
              thumbnail={thumbnail}
              index={index}
            />
          ))}
        </div>
      </Wrapper>
    </main>
  );
}
