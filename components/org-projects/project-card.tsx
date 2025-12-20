import { Project } from '@prisma/client';
import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';

type ProjectWithWebsites = Project & {
  thumbnailURL?: string | null;
  websites: Array<{
    id: string;
    subdomain: string | null;
  }>;
};

type ProjectCardProps = {
  project: ProjectWithWebsites;
  onClick?: () => void;
};

export function ProjectCard({ project, onClick }: ProjectCardProps) {
  const thumbnailUrl = project.thumbnailURL || 'https://dummyimage.com/720x400';
  const subdomain = project.websites[0]?.subdomain;

  return (
    <Card
      className="group cursor-pointer transition-all hover:shadow-lg hover:scale-[1.02]"
      onClick={onClick}
    >
      <div className="relative aspect-video w-full overflow-hidden rounded-t-xl">
        <Image
          src={thumbnailUrl}
          alt={project.name}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-110"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
      </div>
      <CardContent className="p-4">
        <h3 className="font-semibold text-lg mb-1 truncate">{project.name}</h3>
        {subdomain && (
          <p className="text-sm text-muted-foreground truncate">
            {subdomain}.localhost:3000
          </p>
        )}
      </CardContent>
    </Card>
  );
}

