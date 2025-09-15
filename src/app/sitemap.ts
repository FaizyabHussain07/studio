import { MetadataRoute } from 'next'
import { allResources } from './resources/page';
 
export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://faizyab-al-quran.vercel.app';

  const resourcePages = allResources.map((resource) => ({
    url: `${baseUrl}/resources/${resource.id}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }));

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 1,
    },
    {
      url: `${baseUrl}/resources`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    ...resourcePages,
    {
      url: `${baseUrl}/login`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${baseUrl}/signup`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
  ]
}
