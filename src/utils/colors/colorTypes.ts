
export interface ColorInfo {
  name: string;
  hex: string;
  category?: string;
}

export interface ColorCategories {
  blues: ColorInfo[];
  reds: ColorInfo[];
  greens: ColorInfo[];
  whites: ColorInfo[];
  blacks: ColorInfo[];
  oranges: ColorInfo[];
  purples: ColorInfo[];
  teals: ColorInfo[];
  pinks?: ColorInfo[];
  yellows?: ColorInfo[];
}
