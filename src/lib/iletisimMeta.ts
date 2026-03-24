export interface IletisimMeta {
  title: string
  description: string
  workingHours: string
  address: string
  phone: string
  email: string
  mapUrl: string
  whatsappPhone: string
}

export async function getIletisimMeta(): Promise<IletisimMeta> {
  return {
    title: 'İletişim',
    description: 'Bizimle iletişime geçmek için aşağıdaki bilgileri kullanabilirsiniz. Size en kısa sürede dönüş yapacağız.',
    workingHours: 'Pazartesi – Cuma: 09:00-19:00',
    address: 'Akşemsettin Mah., Fevzipaşa Cad. No:107, Kat:3, 34080 Fatih / İSTANBUL',
    phone: '+90 532 224 20 87',
    email: 'av.kaptanyilmaz@gmail.com',
    mapUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3010.2045301338517!2d28.941261888148578!3d41.020781044791654!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x14caba22171a66bb%3A0x48e10c37f27b9291!2sAv.%20Kaptan%20YILMAZ%20%2F%20Yeditepe%20Hukuk%20B%C3%BCrosu!5e0!3m2!1sen!2sus!4v1729485589655!5m2!1sen!2sus',
    whatsappPhone: '5322242087'
  }
}