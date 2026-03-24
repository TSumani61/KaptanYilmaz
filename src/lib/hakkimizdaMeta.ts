export interface HakkimizdaMeta {
  title: string[]
  description: string
  images: string[]
  mediaTitle: string
}

export async function getHakkimizdaMeta(): Promise<HakkimizdaMeta> {
  return {
    title: ['Uzman Kadro,', 'Köklü Deneyim:', '', 'Yeditepe Hukuk Bürosu', ''],
    description: 'Yeditepe Hukuk Bürosu, Av. Kaptan YILMAZ tarafından kurulmuş, uzun yıllara dayanan deneyimi ve uzman kadrosuyla gerçek ve tüzel kişilere danışmanlık, avukatlık ve arabuluculuk hizmeti sunan bir hukuk bürosudur.',
    images: [
      '/images/hakkimizda/hakkimizda-1.jpg',
      '/images/hakkimizda/hakkimizda-2.jpg',
      '/images/hakkimizda/hakkimizda-3.jpg',
      '/images/hakkimizda/hakkimizda-4.jpg',
      '/images/hakkimizda/hakkimizda-5.jpg'
    ],
    mediaTitle: 'Basında Biz'
  }
}