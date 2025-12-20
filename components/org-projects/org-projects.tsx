'use client';

import { useState, useEffect, useMemo } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useAuth } from '@/context/auth.context';
import { OrganizationUserWithOrg } from '@/context/auth.context';
import { Project } from '@prisma/client';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ProjectCard } from './project-card';
import { Empty, EmptyHeader, EmptyTitle, EmptyDescription } from '@/components/ui/empty';
import Login from '@/components/auth/login';

type ProjectWithWebsites = Project & {
  thumbnailURL?: string | null;
  websites: Array<{
    id: string;
    subdomain: string | null;
  }>;
};

type OrgProjectsProps = {
  orgUsers: OrganizationUserWithOrg[];
  projects: ProjectWithWebsites[];
  selectedOrgId: string;
  onProjectClick?: (project: ProjectWithWebsites) => void;
};

function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

export function OrgProjects({ orgUsers: propOrgUsers, projects: propProjects, selectedOrgId: propSelectedOrgId, onProjectClick }: Partial<OrgProjectsProps>) {
  const { user, orgUsers: contextOrgUsers } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [searchQuery, setSearchQuery] = useState('');
  const debouncedSearchQuery = useDebounce(searchQuery, 300);

  if (!user) {
    return <Login />;
  }

  const orgUsers = propOrgUsers || contextOrgUsers;
  const projects = propProjects || [];
  const selectedOrgId = propSelectedOrgId || orgUsers[0]?.organizationId || '';

  const selectedOrg = orgUsers.find(ou => ou.organizationId === selectedOrgId);

  const handleOrgChange = (orgId: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (orgId) {
      params.set('org', orgId);
    } else {
      params.delete('org');
    }
    router.push(`?${params.toString()}`);
  };

  const filteredProjects = useMemo(() => {
    if (!debouncedSearchQuery.trim()) {
      return projects;
    }

    const query = debouncedSearchQuery.toLowerCase();
    return projects.filter(project =>
      project.name.toLowerCase().includes(query) ||
      project.websites.some(w => w.subdomain?.toLowerCase().includes(query) || false)
    );
  }, [projects, debouncedSearchQuery]);

  const handleProjectClick = (project: ProjectWithWebsites) => {
    if (onProjectClick) {
      onProjectClick(project);
    } else {
      const subdomain = project.websites[0]?.subdomain;
      if (subdomain) {
        window.location.href = `http://${subdomain}.localhost:3000`;
      }
    }
  };

  if (!selectedOrg) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-muted-foreground">No organization selected</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="flex flex-col sm:flex-row gap-4 mb-8">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search projects..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={selectedOrgId} onValueChange={handleOrgChange}>
          <SelectTrigger className="w-full sm:w-[200px]">
            <SelectValue placeholder="Select organization" />
          </SelectTrigger>
          <SelectContent>
            {orgUsers.map((orgUser) => (
              <SelectItem
                key={orgUser.organizationId}
                value={orgUser.organizationId}
              >
                {orgUser.organization.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {filteredProjects.length === 0 ? (
        <Empty>
          <EmptyHeader>
            <EmptyTitle>
              {debouncedSearchQuery ? 'No projects found' : 'No projects'}
            </EmptyTitle>
            <EmptyDescription>
              {debouncedSearchQuery
                ? 'Try adjusting your search query'
                : 'Get started by creating your first project'}
            </EmptyDescription>
          </EmptyHeader>
        </Empty>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              onClick={() => handleProjectClick(project)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

