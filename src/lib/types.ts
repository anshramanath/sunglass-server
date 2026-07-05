export type CategoryNode = {
  id: string;
  name: string;
  slug: string;
  children?: CategoryNode[];
};

export type LeafEntry = {
  id: string;
  name: string;
  path: string;
  breadcrumbs: string[];
};
