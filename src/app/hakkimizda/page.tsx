import { type Metadata } from 'next'
import Image from 'next/image'
import { getHakkimizdaMeta } from '@/lib/hakkimizdaMeta'
import { getMediaContent } from '@/lib/mediaContent'

function getYouTubeEmbedUrl(url: string) {
  try {
    const urlObj = new URL(url)
    let videoId = ''

    if (urlObj.hostname === 'youtu.be') {
      videoId = urlObj.pathname.slice(1)
    } else if (
      urlObj.hostname === 'www.youtube.com' ||
      urlObj.hostname === 'youtube.com'
    ) {
      if (urlObj.pathname === '/watch') {
        videoId = urlObj.searchParams.get('v') || ''
      } else if (urlObj.pathname.startsWith('/embed/')) {
        videoId = urlObj.pathname.split('/')[2]
      } else if (urlObj.pathname.startsWith('/live/')) {
        videoId = urlObj.pathname.split('/')[2]
      }
    }

    if (!videoId) {
      videoId =
        urlObj.searchParams.get('v') ||
        url.split('/').pop()?.split('?')[0] ||
        ''
    }

    if (!videoId) return url
    return `https://www.youtube.com/embed/${videoId}?autoplay=0&mute=0&controls=1&playsinline=1&showinfo=0&rel=0&iv_load_policy=3&modestbranding=1&disablekb=1&fs=1&color=white`
  } catch {
    return url
  }
}

export async function generateMetadata(): Promise<Metadata> {
  const meta = await getHakkimizdaMeta()

  return {
    title: 'Hakkımızda',
    description: meta.description,
  }
}

export default async function Hakkimizda() {
  const meta = await getHakkimizdaMeta()
  const mediaContent = await getMediaContent()

  return (
    <div className="bg-white">
      <main className="isolate">
        <div className="relative isolate -z-10">
          <svg
            aria-hidden="true"
            className="absolute inset-x-0 top-0 -z-10 h-[64rem] w-full stroke-gray-200 [mask-image:radial-gradient(32rem_32rem_at_center,white,transparent)]"
          >
            <defs>
              <pattern
                x="50%"
                y={-1}
                id="1f932ae7-37de-4c0a-a8b0-a6e3b4d44b84"
                width={200}
                height={200}
                patternUnits="userSpaceOnUse"
              >
                <path d="M.5 200V.5H200" fill="none" />
              </pattern>
            </defs>
            <svg x="50%" y={-1} className="overflow-visible fill-gray-50">
              <path
                d="M-200 0h201v201h-201Z M600 0h201v201h-201Z M-400 600h201v201h-201Z M200 800h201v201h-201Z"
                strokeWidth={0}
              />
            </svg>
            <rect
              fill="url(#1f932ae7-37de-4c0a-a8b0-a6e3b4d44b84)"
              width="100%"
              height="100%"
              strokeWidth={0}
            />
          </svg>
          <div
            aria-hidden="true"
            className="absolute left-1/2 right-0 top-0 -z-10 -ml-24 transform-gpu overflow-hidden blur-3xl lg:ml-24 xl:ml-48"
          >
            <div
              style={{
                clipPath:
                  'polygon(63.1% 29.5%, 100% 17.1%, 76.6% 3%, 48.4% 0%, 44.6% 4.7%, 54.5% 25.3%, 59.8% 49%, 55.2% 57.8%, 44.4% 57.2%, 27.8% 47.9%, 35.1% 81.5%, 0% 97.7%, 39.2% 100%, 35.2% 81.4%, 97.2% 52.8%, 63.1% 29.5%)',
              }}
              className="aspect-[801/1036] w-[50.0625rem] bg-gradient-to-tr from-[#0c0065] via-[#01002c] to-[#000000] opacity-50"
            />
          </div>
          <div className="overflow-hidden">
            <div className="mx-auto max-w-7xl px-6 pb-2 pt-36 sm:pt-60 lg:px-8 lg:pt-32">
              <div className="mx-auto max-w-2xl gap-x-14 lg:mx-0 lg:flex lg:max-w-none lg:items-center">
                <div className="w-full max-w-xl lg:-mt-60 lg:shrink-0 xl:max-w-2xl">
                  <h1 className="text-xl font-bold tracking-tight text-gray-900 sm:text-6xl">
                    {meta.title.map((line, index) => (
                      <span key={index}>
                        {line}
                        <br />
                      </span>
                    ))}
                  </h1>
                  <p className="relative mt-6 text-xl leading-8 text-gray-600 sm:max-w-md lg:max-w-none">
                    {meta.description}
                  </p>
                </div>
                <div className="mt-14 flex justify-end gap-8 sm:-mt-44 sm:justify-start sm:pl-20 lg:mt-0 lg:pl-0">
                  <div className="ml-auto w-44 flex-none space-y-8 pt-32 sm:ml-0 sm:pt-80 lg:order-last lg:pt-36 xl:order-none xl:pt-80">
                    <div className="relative">
                      <Image
                        src={meta.images[0]}
                        alt="Hakkımızda 1"
                        width={176}
                        height={264}
                        className="aspect-[2/3] w-full rounded-xl bg-gray-900/5 object-cover shadow-lg"
                      />
                      <div className="pointer-events-none absolute inset-0 rounded-xl ring-1 ring-inset ring-gray-900/10" />
                    </div>
                  </div>
                  <div className="mr-auto w-44 flex-none space-y-8 sm:mr-0 sm:pt-52 lg:pt-36">
                    <div className="relative">
                      <Image
                        src={meta.images[1]}
                        alt="Hakkımızda 2"
                        width={176}
                        height={264}
                        className="aspect-[2/3] w-full rounded-xl bg-gray-900/5 object-cover shadow-lg"
                      />
                      <div className="pointer-events-none absolute inset-0 rounded-xl ring-1 ring-inset ring-gray-900/10" />
                    </div>
                    <div className="relative">
                      <Image
                        src={meta.images[2]}
                        alt="Hakkımızda 3"
                        width={176}
                        height={264}
                        className="aspect-[2/3] w-full rounded-xl bg-gray-900/5 object-cover shadow-lg"
                      />
                      <div className="pointer-events-none absolute inset-0 rounded-xl ring-1 ring-inset ring-gray-900/10" />
                    </div>
                  </div>
                  <div className="w-44 flex-none space-y-8 pt-32 sm:pt-0">
                    <div className="relative">
                      <Image
                        src={meta.images[3]}
                        alt="Hakkımızda 4"
                        width={176}
                        height={264}
                        className="aspect-[2/3] w-full rounded-xl bg-gray-900/5 object-cover shadow-lg"
                      />
                      <div className="pointer-events-none absolute inset-0 rounded-xl ring-1 ring-inset ring-gray-900/10" />
                    </div>
                    <div className="relative">
                      <Image
                        src={meta.images[4]}
                        alt="Hakkımızda 5"
                        width={176}
                        height={264}
                        className="aspect-[2/3] w-full rounded-xl bg-gray-900/5 object-cover shadow-lg"
                      />
                      <div className="pointer-events-none absolute inset-0 rounded-xl ring-1 ring-inset ring-gray-900/10" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <div className="bg-white py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h1 className="text-6xl font-bold tracking-tight text-gray-900 sm:text-6xl">
              {meta.mediaTitle}
            </h1>
          </div>

          {/* Videos Section */}
          <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
            <h3 className="mb-8 text-2xl font-bold tracking-tight text-gray-900">
              Videolar
            </h3>
            <div className="grid grid-cols-1 gap-x-8 gap-y-16 lg:grid-cols-2">
              {mediaContent
                .filter((item) => item.type === 'video')
                .map((video) => (
                  <div key={video._id} className="flex flex-col items-start">
                    <div className="relative aspect-video w-full overflow-hidden rounded-2xl">
                      {video.youtubeUrl ? (
                        <div className="relative aspect-video w-full overflow-hidden rounded-2xl">
                          <iframe
                            src={getYouTubeEmbedUrl(video.youtubeUrl)}
                            title={video.title || 'Video'}
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                            allowFullScreen
                            className="absolute inset-0 h-full w-full"
                            loading="lazy"
                            referrerPolicy="strict-origin-when-cross-origin"
                          />
                        </div>
                      ) : video.videoFile?.asset?.url ? (
                        <video
                          src={video.videoFile.asset.url}
                          controls
                          className="absolute inset-0 h-full w-full object-cover"
                        />
                      ) : null}
                    </div>
                    {video.title && (
                      <h4 className="mt-4 text-lg font-semibold leading-8 text-gray-900">
                        {video.title}
                      </h4>
                    )}
                    {video.description && (
                      <p className="mt-2 text-base leading-7 text-gray-600">
                        {video.description}
                      </p>
                    )}
                  </div>
                ))}
            </div>
          </div>

          {/* News Section */}
          <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
            <h3 className="mb-8 text-2xl font-bold tracking-tight text-gray-900">
              Haberler
            </h3>
            <div className="grid grid-cols-1 gap-x-8 gap-y-16 lg:grid-cols-3">
              {mediaContent
                .filter((item) => item.type === 'news')
                .map((news) => (
                  <div key={news._id} className="flex flex-col items-start">
                    {news.newsImage && (
                      <div className="relative aspect-[3/2] w-full overflow-hidden rounded-2xl">
                        <Image
                          src={news.newsImage}
                          alt={news.title || 'Haber görseli'}
                          fill
                          className="object-cover"
                        />
                      </div>
                    )}
                    {news.title && (
                      <h4 className="mt-4 text-lg font-semibold leading-8 text-gray-900">
                        {news.title}
                      </h4>
                    )}
                    {news.description && (
                      <p className="mt-2 text-base leading-7 text-gray-600">
                        {news.description}
                      </p>
                    )}
                    {news.newsUrl && (
                      <a
                        href={news.newsUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-4 text-sm font-semibold leading-6 text-blue-600 hover:text-blue-500"
                      >
                        Haberi oku <span aria-hidden="true">→</span>
                      </a>
                    )}
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export const revalidate = 60
