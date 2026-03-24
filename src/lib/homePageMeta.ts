export interface HomePageMeta {
  heroTitle: string
  heroDescription: string
  heroImage: string
  articlesTitle: string
  servicesTitle: string
  teamTitle: string
  linksTitle: string
  links: {
    title: string
    url: string
    description: string
  }[]
  aboutTitle: string
  aboutContent: string
  contactTitle: string
}

export async function getHomePageMeta(): Promise<HomePageMeta> {
  return {
    heroTitle: 'Yeditepe Hukuk Bürosu',
    heroDescription: 'Uzun yıllara dayanan deneyimimiz ve uzman kadromuzla, gerçek ve tüzel kişilere kapsamlı hukuki çözümler sunuyoruz.',
    heroImage: '/images/background.jpg',
    articlesTitle: 'Blogumuz / Makaleler',
    servicesTitle: 'Hizmetlerimiz',
    teamTitle: 'Ekibimiz',
    linksTitle: 'Faydalı Linkler',
    links: [
      { title: 'e-Devlet Kapısı', url: 'https://www.turkiye.gov.tr', description: 'Türkiye Cumhuriyeti Vatandaş Bilgi Sistemi' },
      { title: 'UYAP Vatandaş', url: 'https://vatandas.uyap.gov.tr', description: 'Ulusal Yargı Ağı Bilişim Sistemi (UYAP)' },
      { title: 'Resmî Gazete', url: 'https://www.resmigazete.gov.tr', description: 'T.C. Cumhurbaşkanlığı Resmî Gazete' },
      { title: 'Anayasa Mahkemesi', url: 'https://www.anayasa.gov.tr', description: 'T.C. Anayasa Mahkemesi (AYM)' },
      { title: 'Yargıtay Başkanlığı', url: 'https://www.yargitay.gov.tr', description: 'Yargıtay Karar Arama ve İletişim Formu' },
      { title: 'Türkiye Barolar Birliği', url: 'https://www.barobirlik.org.tr', description: 'TBB ve Baro Levhaları' }
    ],
    aboutTitle: 'Hakkımızda',
    aboutContent: 'Yeditepe Hukuk Bürosu, uzman kadrosu ile müvekkillerine şeffaf, dürüst ve çözüm odaklı avukatlık hizmeti sunmaktadır.',
    contactTitle: 'İletişim'
  }
}