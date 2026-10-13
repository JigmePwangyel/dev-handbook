export interface PageMeta {
  id: string;
  title: string;
  file: string;
  summary: string;
}

export interface Section {
  id: string;
  title: string;
  icon?: string;
  blurb?: string;
  pages: PageMeta[];
}

export interface Topic {
  id: string;
  title: string;
  icon: string;
  blurb: string;
  sections: Section[];
}

export interface SearchEntry {
  t: string;
  s: string;
  p: string;
  title: string;
  section: string;
  text: string;
}

/** A page together with where it lives, used for prev/next navigation. */
export interface FlatPage extends PageMeta {
  topicId: string;
  section: Section;
}

export interface TocItem {
  id: string;
  text: string;
  level: 2 | 3;
}
