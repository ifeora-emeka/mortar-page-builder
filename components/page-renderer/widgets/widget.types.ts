import { PageSectionWidget } from "@prisma/client";

export type WidgetProps = {
    widget: PageSectionWidget & {
        children?: (PageSectionWidget & { children?: PageSectionWidget[] })[];
    };
    allWidgets: (PageSectionWidget & { children?: PageSectionWidget[] })[];
    editMode?: boolean;
    isActive?: boolean;
}
