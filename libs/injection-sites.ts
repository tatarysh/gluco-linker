export type InjectionSiteId =
  | 'left_thigh'
  | 'right_thigh'
  | 'left_buttock'
  | 'right_buttock'
  | 'abdomen_above_navel_left'
  | 'abdomen_above_navel_right'
  | 'abdomen_below_navel_left'
  | 'abdomen_below_navel_right'
  | 'abdomen_left_of_navel_top'
  | 'abdomen_left_of_navel_bottom'
  | 'abdomen_right_of_navel_top'
  | 'abdomen_right_of_navel_bottom'
  | 'abdomen_side_left_top'
  | 'abdomen_side_left_bottom'
  | 'abdomen_side_right_top'
  | 'abdomen_side_right_bottom'

export interface InjectionSite {
  id: InjectionSiteId
  labelKey: string
}

export const nightInjectionSites: InjectionSite[] = [
  { id: 'left_thigh', labelKey: 'injection_site:left_thigh' },
  { id: 'right_thigh', labelKey: 'injection_site:right_thigh' },
  { id: 'left_buttock', labelKey: 'injection_site:left_buttock' },
  { id: 'right_buttock', labelKey: 'injection_site:right_buttock' },
]

// Day injection sites grouped by day (0-3) with 3 meals each (breakfast, lunch, dinner)
export const dayInjectionSiteGroups: InjectionSite[][] = [
  // Day 0 (mod 4)
  [
    { id: 'abdomen_above_navel_left', labelKey: 'injection_site:abdomen_above_navel_left' },
    { id: 'abdomen_below_navel_right', labelKey: 'injection_site:abdomen_below_navel_right' },
    { id: 'abdomen_side_right_top', labelKey: 'injection_site:abdomen_side_right_top' },
  ],
  // Day 1 (mod 4)
  [
    { id: 'abdomen_below_navel_left', labelKey: 'injection_site:abdomen_below_navel_left' },
    { id: 'abdomen_left_of_navel_top', labelKey: 'injection_site:abdomen_left_of_navel_top' },
    { id: 'abdomen_side_left_bottom', labelKey: 'injection_site:abdomen_side_left_bottom' },
  ],
  // Day 2 (mod 4)
  [
    { id: 'abdomen_above_navel_right', labelKey: 'injection_site:abdomen_above_navel_right' },
    { id: 'abdomen_right_of_navel_bottom', labelKey: 'injection_site:abdomen_right_of_navel_bottom' },
    { id: 'abdomen_side_left_top', labelKey: 'injection_site:abdomen_side_left_top' },
  ],
  // Day 3 (mod 4)
  [
    { id: 'abdomen_left_of_navel_bottom', labelKey: 'injection_site:abdomen_left_of_navel_bottom' },
    { id: 'abdomen_right_of_navel_top', labelKey: 'injection_site:abdomen_right_of_navel_top' },
    { id: 'abdomen_side_right_bottom', labelKey: 'injection_site:abdomen_side_right_bottom' },
  ],
]
