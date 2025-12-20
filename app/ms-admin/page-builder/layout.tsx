import { PageBuilderProvider } from '../context/page-builder.context';
import { PageBuilderPreviewProvider } from '../context/page-builder-preview.context';
import { getPageBuilderData } from '@/lib/page-builder.lib';

export default async function PageBuilderLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  try {
    const { website, pages, sections, widgets, colorVariables } = await getPageBuilderData();

    return (
      <PageBuilderProvider initialWebsite={website} initialColorVariables={colorVariables || []}>
        <PageBuilderPreviewProvider
          initialPages={pages}
          initialSections={sections}
          initialWidgets={widgets}
        >
          {children}
        </PageBuilderPreviewProvider>
      </PageBuilderProvider>
    );
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('Failed to load page builder data:', error);

    if (errorMessage.includes('Unauthorized')) {
      return (
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-2">Unauthorized</h1>
            <p className="text-muted-foreground">Please log in to access the page builder</p>
          </div>
        </div>
      );
    }

    if (errorMessage.includes('Access denied')) {
      return (
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-2">Access Denied</h1>
            <p className="text-muted-foreground">You do not have access to this organization</p>
          </div>
        </div>
      );
    }

    if (errorMessage.includes('not found')) {
      return (
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-2">Website Not Found</h1>
            <p className="text-muted-foreground">The website for this subdomain could not be found</p>
          </div>
        </div>
      );
    }

    if (errorMessage.includes('required')) {
      return (
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-2">Access Denied</h1>
            <p className="text-muted-foreground">Please access this page from a project subdomain</p>
          </div>
        </div>
      );
    }

    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">Error Loading Page Builder</h1>
          <p className="text-muted-foreground">Failed to load page builder data</p>
        </div>
      </div>
    );
  }
}

