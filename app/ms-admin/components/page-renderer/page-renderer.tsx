import { Page, PageSection } from '@prisma/client';
import React from 'react'

type Props = {
    page: Page;
    sections: PageSection[];
}

export default function PageRenderer({ page, sections }: Props) {
  return (
    <div>
        <h1>{page.name}</h1>
        <div>
            {sections.map((section) => (
                <div key={section.id}>{section.name}</div>
            ))}
        </div>
    </div>
  )
}