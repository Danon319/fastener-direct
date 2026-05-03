// src/components/sections/Footer.jsx
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'

import { Logo, Button } from '@/components/ui'
import { YouTube, VK } from '@/components/ui/icons'
import {
  CATALOG_LINKS,
  NAV_LINKS,
  CONTACT_INFO,
  SOCIAL_LINKS,
  FOOTER_CTA,
  FOOTER_LEGAL,
} from '@/content/footer'
import { cn } from '@/utils/cn'

// Внутренний хелпер для ссылок с hover white → slateHover.
// Inline вместо отдельного компонента — это footer-специфика, не примитив.
function FooterLink({ children, className, ...rest }) {
  return (
    <Link
      {...rest}
      className={cn(
        'inline-block leading-tight text-white transition-colors duration-300 hover:text-slateHover',
        className
      )}
    >
      {children}
    </Link>
  )
}
FooterLink.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
}

// Тот же хелпер, но для href (mailto:, tel:, внешние ссылки).
function FooterAnchor({ children, className, target, ...rest }) {
  return (
    <a
      {...rest}
      target={target}
      rel={target === '_blank' ? 'noopener noreferrer' : undefined}
      className={cn(
        'inline-block leading-tight text-white transition-colors duration-300 hover:text-slateHover',
        className
      )}
    >
      {children}
    </a>
  )
}
FooterAnchor.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
  target: PropTypes.string,
}

function Footer() {
  return (
    <footer className="w-full bg-footerBg px-4 py-10 font-sans text-white sm:px-6 sm:py-11 md:px-9 md:py-[50px] lg:px-10 lg:py-[60px] xl:px-[50px] xl:py-[70px]">
      {/* ── TOP BLOCK — 3 columns ── */}
      <div className="grid grid-cols-1 gap-9 pb-9 sm:grid-cols-3 sm:gap-x-5 sm:gap-y-9 sm:pb-11 md:gap-x-7 md:gap-y-10 md:pb-14 lg:gap-x-8 lg:gap-y-[72px] lg:pb-[72px] xl:gap-x-10 xl:gap-y-[90px] xl:pb-[90px]">
        {/* Column 1 — catalog */}
        <div className="flex flex-col items-start gap-3.5 sm:gap-4 md:gap-5 lg:gap-[22px] xl:gap-7">
          {CATALOG_LINKS.map(({ label, to }) => (
            <FooterLink
              key={label}
              to={to}
              className="text-lg font-medium sm:text-xl md:text-2xl lg:text-[1.6rem] xl:text-[2rem]"
            >
              {label}
            </FooterLink>
          ))}
        </div>

        {/* Column 2 — site nav */}
        <div className="flex flex-col items-start gap-3.5 sm:gap-4 md:gap-5 lg:gap-[22px] xl:gap-7">
          {NAV_LINKS.map(({ label, to }) => (
            <FooterLink
              key={label}
              to={to}
              className="text-lg font-medium sm:text-xl md:text-2xl lg:text-[1.6rem] xl:text-[2rem]"
            >
              {label}
            </FooterLink>
          ))}
        </div>

        {/* Column 3 — question + CTA + contacts */}
        <div className="flex flex-col items-start">
          <h3 className="m-0 text-lg font-medium leading-tight text-white sm:text-xl md:text-2xl lg:text-[1.6rem] xl:text-[2rem]">
            {FOOTER_CTA.heading}
          </h3>

          <div className="mt-7">
            <Button size="md" to={FOOTER_CTA.buttonTo}>
              {FOOTER_CTA.buttonLabel}
            </Button>
          </div>

          <div className="mt-8 w-full sm:mt-10 md:mt-12 lg:mt-[60px] xl:mt-20">
            <div className="mb-4 text-sm font-medium text-slateHover md:text-[0.9375rem] xl:text-base">
              {FOOTER_CTA.contactsLabel}
            </div>

            {/* Two sub-columns */}
            <div className="flex w-full flex-row flex-wrap justify-between gap-3 md:gap-6 xl:gap-8">
              <div className="flex flex-col items-start gap-1.5">
                <FooterAnchor
                  href={CONTACT_INFO.emailHref}
                  className="text-sm md:text-[0.9375rem] xl:text-base"
                >
                  {CONTACT_INFO.email}
                </FooterAnchor>
                <FooterAnchor
                  href={CONTACT_INFO.phoneHref}
                  className="text-sm md:text-[0.9375rem] xl:text-base"
                >
                  {CONTACT_INFO.phone}
                </FooterAnchor>
              </div>
              <div className="flex flex-col items-start">
                <FooterAnchor
                  href={CONTACT_INFO.mapHref}
                  target="_blank"
                  className="text-sm md:text-[0.9375rem] xl:text-base"
                >
                  <span className="block">{CONTACT_INFO.cityLine}</span>
                  <span className="mt-1.5 block">{CONTACT_INFO.streetLine}</span>
                </FooterAnchor>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── BOTTOM BAR ── */}
      <div className="flex flex-col items-center gap-6 border-t border-white/10 pt-7 md:flex-row md:items-center md:justify-between md:gap-0 md:pt-7 lg:pt-8 xl:pt-9">
        <Logo variant="full" theme="light" to="/" />

        <div className="flex items-center gap-8 md:gap-10 lg:gap-11 xl:gap-12">
          <FooterLink
            to={FOOTER_LEGAL.documentsTo}
            className="text-sm md:text-[0.9375rem] xl:text-base"
          >
            {FOOTER_LEGAL.documentsLabel}
          </FooterLink>
          <a
            href={SOCIAL_LINKS.youtube}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="YouTube"
            className="inline-flex text-white transition-[color,transform] duration-300 hover:scale-110 hover:text-slateHover"
          >
            <YouTube size={22} />
          </a>
          <a
            href={SOCIAL_LINKS.vk}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="VK"
            className="inline-flex text-white transition-[color,transform] duration-300 hover:scale-110 hover:text-slateHover"
          >
            <VK size={30} />
          </a>
        </div>
      </div>
    </footer>
  )
}

export default Footer
