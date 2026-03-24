export interface PageMeta {
  title: string
  description: string
  intro: string
}

export async function getPageMeta(pageId: string): Promise<PageMeta> {
  const meta: Record<string, PageMeta> = {
    blog: {
      title: 'Blog',
      description: "Yeditepe Hukuk Bürosu'nun blog yazıları.",
      intro: "Yeditepe Hukuk Bürosu olarak, güncel hukuki konular hakkındaki düşüncelerimizi ve görüşlerimizi paylaşıyoruz."
    },
    ekibimiz: {
      title: 'Ekibimiz',
      description: 'Uzman avukat kadromuzla tanışın.',
      intro: 'Hukuki süreçlerinizde size en iyi hizmeti sunmak için tecrübeli ekibimizle yanınızdayız.'
    }
  }

  return meta[pageId] || meta['blog'];
}