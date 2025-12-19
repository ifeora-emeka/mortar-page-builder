- Don't add code comments.
- Read the Conceptual Overview
- Break components down into smaller components in it's own dir.
- Check the Prisma schema to understand the project.

# Conceptual Overview
- Subdomain: by default the app runs on port 3000, which only shows the user their project on the home page.
When they click on a project we redirect them to the project's website subdomain website.slug Ex acme.localhost:3000.
If there's no subdomain (ie no subdomain or subdomain is wwww), we render the users projects on the home page.
If there's a subdomain (ie no empty and not wwww), we show the user the home page of their website (ie page renderer).
If the user has their project opened on it's subdomain and they navigate to /ms-admin/ we show them the admin panel where they can login and make changes to the site both in prod and dev.
- Users can point their custom domain to the platforms IP address and also add it to the list of domains they have,
that way we can get the domain (when the site is live), check if it's registered in our system and load the pages and sections for it.

## Authentication
There are two ways to authenticate:
1. From the home page (no subdomain)
2. From the user's site at /ms-admin/

## Components to create
1. Page renderer: This will iterate through the list of sections for that page and render them. It'll take in all the needed props.
2. Org projects: This will take in all the needed props including the org data which holds the ID and uses that to 
load all their org's projects.


## URL structure
1. /ms-admin/: This is where the user can login to update the website, make payments and more.
2. /content/:content_type/:content_slug: This is where we render content like events, blog, news, and more (CMSEntry).

Examples:
www.acme.com/blog/my-first-post -> loads the blog with slug my-first-post for the project with domain acme.com
www.acme.com/event/summer-fest -> loads the event with slug summer-fest for the project with domain acme.com
www.acme.com/ -> loads the home page for the project with domain acme.com
www.acme.com/about -> loads the about page for the project with domain acme.com
www.acme.com/ms-admin/ -> loads the admin panel for the project with domain acme.com

## Lib functions to create
1. domain checker: This will export a function which returns the subdomain if it's there.
2. 
