import { promises as fs } from "fs";
import path from "path";

const DATA_DIR = path.join(process.cwd(), "data");
const CONTENT_FILE = path.join(DATA_DIR, "content.json");
const UPLOADS_DIR = path.join(DATA_DIR, "uploads");

export interface Service {
  emoji: string;
  title: string;
  text: string;
}

export interface Testimonial {
  name: string;
  text: string;
  dog: string;
}

export interface GalleryItem {
  src: string;
  caption: string;
}

export interface SiteContent {
  home: {
    heroTitle: string;
    heroSubtitle: string;
    introTitle: string;
    intro: string;
    ctaText: string;
    services: Service[];
  };
  about: {
    title: string;
    body: string;
    badges: string[];
  };
  testimonials: Testimonial[];
  gallery: GalleryItem[];
  contact: {
    phone: string;
    email: string;
    location: string;
    facebook: string;
    linkedin: string;
    blurb: string;
  };
}

export async function readContent(): Promise<SiteContent> {
  const raw = await fs.readFile(CONTENT_FILE, "utf-8");
  return JSON.parse(raw) as SiteContent;
}

export async function writeContent(content: SiteContent): Promise<void> {
  const tmp = CONTENT_FILE + ".tmp";
  await fs.writeFile(tmp, JSON.stringify(content, null, 2));
  await fs.rename(tmp, CONTENT_FILE);
}

export { UPLOADS_DIR, DATA_DIR };
