export type element = {
  component: string;
  styles: object;
  key?: string;
  value: string;
  children: element[];
};

export type post_short = {
  title?: string;
  description?: string;
  title_picture?: string;
  likes?: number;
  views?: number;
  date?: string;
};
