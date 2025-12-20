# Agent instruction
- Don't add code comments.
- Read the Conceptual Overview & Website page architecture.
- Break components down into smaller components in it's own dir.
- Check the Prisma schema to understand the project.
- Components should always be powered by props and not have any context in them for easy unit testing.

# Conceptual Overview (Mortar Page Builder)
- Subdomain: by default the app runs on port 3000, which only shows the user their project on the home page.
When they click on a project we redirect them to the project's website subdomain website.slug Ex acme.localhost:3000.
If there's no subdomain (ie no subdomain or subdomain is wwww), we render the users projects on the home page.
If there's a subdomain (ie no empty and not wwww), we show the user the home page of their website (ie page renderer).
If the user has their project opened on it's subdomain and they navigate to /ms-admin/ we show them the admin panel where they can login and make changes to the site both in prod and dev.
- Users can point their custom domain to the platforms IP address and also add it to the list of domains they have,
that way we can get the domain (when the site is live), check if it's registered in our system and load the pages and sections for it.
- All types should be in the root types dir. Ex auth.types.ts, page.types.ts

## Authentication
There are two ways to authenticate:
1. From the home page (no subdomain)
2. From the user's site at /ms-admin/

## Components to create
1. Page renderer: This will iterate through the list of sections for that page and render them. It'll take in all the needed props.
2. Org projects: This will take in all the needed props including the org data which holds the ID and uses that to 
load all their org's projects.

## Projects and Subdomain
When a project is created on the backend, we generate a unique subdomain (website.subdomain) for the user

## URL structure
1. /ms-admin/: This is where the user can login to update the website, make payments and more.
2. /content/:content_type/:content_slug: This is where we render content like events, blog, news, and more (CMSEntry).

Examples using acme as the user's custom doamin (project's assigned subdomain will applies):
www.acme.com/blog/my-first-post -> loads the blog with slug my-first-post for the project with domain acme.com
www.acme.com/event/summer-fest -> loads the event with slug summer-fest for the project with domain acme.com
www.acme.com/ -> loads the home page for the project with domain acme.com
www.acme.com/about -> loads the about page for the project with domain acme.com
www.acme.com/ms-admin/ -> loads the admin panel for the project with domain acme.com

## Lib functions to create
1. domain checker: This will export a function which returns the subdomain if it's there.
2. 

## API endpoints
These endpoints we'll be called with the user's http only cookies.
1. Get project by subdomain (full): ```GET /api/private/project/:project_id```. This will get all the pages, section, website, org and much more.
2. Get page data (for loading final page based on route): ```GET /api/public/page?route=<route>```. This will return all the data needed for that particular page including org, sections, widgets and much more.

## Custom domains
We allow users create a custom domain on the

## Frontend routes (no subdomin)
``/``: by default shows the org's projects or the login page if they're not logged in.
## Frontend routes (with subdomin or custom domain)
``/``: will show the home page of the final website built
``/ms-admin``: will show the admin page for that project (based on the subdomain) or the login page if the user isn't logged in.
``/ms-admin/page-builder``: Should render the page builder with the page renderer in it. 
``/content/:type``: This shows the list of that content with pagination.
``/content/:type/:slug``: This shows the details page for that contnet.

# Website page architecture
A website has pages, a page has sections and sections have widgets. Widgets can be stack (vertical or horizontal), headers (h1 - h6), embbings (like iframe), forms, image, video and much more.
A widget can also have multiple widget children.