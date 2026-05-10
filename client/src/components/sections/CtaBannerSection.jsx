import Button from '@/components/ui/Button'
import { CTA_BANNER } from '@/content/ctaBanner'

/**
 * CTA-баннер с фоновым фото, затемнением и кнопкой связи.
 * Полностью статичная секция без анимаций.
 */
export default function CtaBannerSection() {
  return (
    <section className="bg-tagDate px-4 py-16 md:px-8 md:py-20 lg:px-16 lg:py-24">
      <div className="mx-auto max-w-7xl">
        <div className="relative overflow-hidden rounded-3xl aspect-[4/3] md:aspect-[12/5]">
          <img
            src={CTA_BANNER.image}
            alt=""
            className="absolute inset-0 h-full w-full object-cover"
          />

          <div className="absolute inset-0 bg-black/55" />

          <div className="relative flex h-full flex-col justify-start p-6 md:p-10 lg:p-14">
            <h2 className="max-w-md text-2xl font-medium text-white md:max-w-lg md:text-3xl lg:max-w-xl lg:text-4xl">
              {CTA_BANNER.title}
            </h2>

            <div className="mt-6">
              <Button text={CTA_BANNER.buttonText} size="md" />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
