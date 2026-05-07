// Shared TypeScript interfaces matching the MySQL schema

export interface Product {
  id:               number;
  name:             string;
  slug:             string;
  category_slug:    string;
  description:      string;
  full_description: string;
  features:         string;       // newline-separated
  specifications:   string;       // "Key: Value" newline-separated
  meta_title:       string;
  meta_description: string;
  tag:              string;
  badge:            string;
  image_url:        string;
  image_path:       string;
  sort_order:       number;
  is_active:        number;
  is_featured:      number;
  // joined fields
  cat_name?:        string;
  cat_slug?:        string;
}

export interface Category {
  id:               number;
  name:             string;
  slug:             string;
  icon:             string;
  sort_order:       number;
  description?:      string;
  meta_title?:      string;
  meta_description?: string;
}

export interface Division {
  id:          number;
  title:       string;
  description: string;
  icon:        string;
  icon_bg:     string;
  icon_color:  string;
  image_url:   string;
  image_path:  string;
  badge_text:  string;
  link_href:   string;
  cta_text:    string;
  sort_order:  number;
  is_active:   number;
}

export interface SiteSetting {
  setting_key:   string;
  setting_value: string;
}

export interface PageVisit {
  id:         number;
  page:       string;
  ip:         string;
  user_agent: string;
  visited_at: string;
}

// Parsed from features string  (one per line)
export type Feature = string;

// Parsed from specifications string  ("Key: Value" per line)
export type Specification = { key: string; value: string };
