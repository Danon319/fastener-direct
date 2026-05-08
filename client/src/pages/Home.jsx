import { useState } from 'react'
import { motion } from 'motion/react'

import Hero from '@/components/sections/Hero'
import {
  useViewport,
  useCountUp,
  useScrollDirection,
  useMomentumLift,
  useElementHeight,
} from '@/hooks'
import {
  Button,
  IconButton,
  Logo,
  BrandMark,
  User,
  YouTube,
  VK,
  Plus,
  Close,
  Burger,
  Arrow,
} from '@/components/ui'

export default function Home() {
  const { canHover, isTouch } = useViewport()
  const { isPastThreshold, direction } = useScrollDirection({ threshold: 400 })
  const [countStarted, setCountStarted] = useState(false)
  const counter = useCountUp(1234, 1800, countStarted)

  const lift = useMomentumLift()
  const footerH = useElementHeight('footer')

  return (
    <>
      <Hero />
      <div className="h-screen" aria-hidden="true" />

      <motion.section
        style={{ y: lift }}
        className="relative z-10 rounded-2xl bg-light shadow-[0_-8px_30px_rgba(0,0,0,0.12),0_8px_30px_rgba(0,0,0,0.12)] will-change-transform"
      >
        <main className="mx-auto max-w-5xl space-y-12 px-6 py-10">
          <div className="rounded-md border border-sky-300 bg-sky-50 p-3 text-sm text-sky-900">
            Phase 2 playground — primitives + hooks.
          </div>

          {/* Icons */}
          <section>
            <h2 className="mb-4 mt-12 text-xl font-medium">Icons</h2>
            <hr className="mb-6" />
            <div className="flex flex-wrap gap-8">
              {[
                ['BrandMark', BrandMark, 40],
                ['User', User, 24],
                ['YouTube', YouTube, 24],
                ['VK', VK, 24],
                ['Plus', Plus, 24],
                ['Close', Close, 24],
                ['Burger', Burger, 40],
                ['Arrow', Arrow, 24],
              ].map(([name, Icon, defaultSize]) => (
                <div key={name} className="flex flex-col items-center gap-2">
                  <span className="mb-1 text-xs text-muted">{name}</span>
                  <div className="flex items-center gap-4">
                    <Icon size={defaultSize} />
                    <Icon size={32} className="text-red" />
                    <Icon size={48} className="text-navy" />
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Button — sm/md/lg, light bg */}
          <section>
            <h2 className="mb-4 mt-12 text-xl font-medium">Button — sm/md/lg, light bg</h2>
            <hr className="mb-6" />
            <div className="flex items-center gap-4 rounded-xl bg-light p-8">
              <Button size="sm" onClick={() => console.log('Button sm clicked')} />
              <Button size="md" onClick={() => console.log('Button md clicked')} />
              <Button size="lg" onClick={() => console.log('Button lg clicked')} />
            </div>
          </section>

          {/* Button — sm/md/lg, dark bg */}
          <section>
            <h2 className="mb-4 mt-12 text-xl font-medium">Button — sm/md/lg, dark bg</h2>
            <hr className="mb-6" />
            <div className="flex items-center gap-4 rounded-xl bg-navy p-8">
              <Button size="sm" onClick={() => console.log('Button sm clicked')} />
              <Button size="md" onClick={() => console.log('Button md clicked')} />
              <Button size="lg" onClick={() => console.log('Button lg clicked')} />
            </div>
          </section>

          {/* Logo — variant=full, theme=dark */}
          <section>
            <h2 className="mb-4 mt-12 text-xl font-medium">Logo — variant=full, theme=dark</h2>
            <hr className="mb-6" />
            <div className="flex items-center gap-8 rounded-xl bg-light p-8">
              <Logo size={40} variant="full" theme="dark" />
              <Logo size={54} variant="full" theme="dark" />
              <Logo size={80} variant="full" theme="dark" />
            </div>
          </section>

          {/* Logo — variant=full, theme=light */}
          <section>
            <h2 className="mb-4 mt-12 text-xl font-medium">Logo — variant=full, theme=light</h2>
            <hr className="mb-6" />
            <div className="flex items-center gap-8 rounded-xl bg-navy p-8">
              <Logo size={40} variant="full" theme="light" />
              <Logo size={54} variant="full" theme="light" />
              <Logo size={80} variant="full" theme="light" />
            </div>
          </section>

          {/* Logo — variant=mark */}
          <section>
            <h2 className="mb-4 mt-12 text-xl font-medium">Logo — variant=mark</h2>
            <hr className="mb-6" />
            <div className="flex items-center gap-8 rounded-xl bg-light p-8">
              <Logo size={40} variant="mark" theme="dark" />
              <div className="inline-flex rounded-lg bg-navy p-2">
                <Logo size={40} variant="mark" theme="light" />
              </div>
              <Logo size={80} variant="mark" theme="dark" />
              <div className="inline-flex rounded-lg bg-navy p-2">
                <Logo size={80} variant="mark" theme="light" />
              </div>
            </div>
          </section>

          {/* IconButton — variant=light, on white */}
          <section>
            <h2 className="mb-4 mt-12 text-xl font-medium">IconButton — variant=light, on white</h2>
            <hr className="mb-6" />
            <div className="flex items-center gap-4 rounded-xl bg-light p-8">
              <IconButton
                variant="light"
                size={32}
                ariaLabel="Далее"
                onClick={() => console.log('IconButton light 32 clicked')}
              >
                <Arrow />
              </IconButton>
              <IconButton
                variant="light"
                size={44}
                ariaLabel="Далее"
                onClick={() => console.log('IconButton light 44 clicked')}
              >
                <Arrow />
              </IconButton>
              <IconButton
                variant="light"
                size={56}
                ariaLabel="Далее"
                onClick={() => console.log('IconButton light 56 clicked')}
              >
                <Arrow />
              </IconButton>
            </div>
          </section>

          {/* IconButton — variant=dark, on dark */}
          <section>
            <h2 className="mb-4 mt-12 text-xl font-medium">IconButton — variant=dark, on dark</h2>
            <hr className="mb-6" />
            <div className="flex items-center gap-4 rounded-xl bg-navy p-8">
              <IconButton
                variant="dark"
                size={32}
                ariaLabel="Далее"
                onClick={() => console.log('IconButton dark 32 clicked')}
              >
                <Arrow />
              </IconButton>
              <IconButton
                variant="dark"
                size={44}
                ariaLabel="Далее"
                onClick={() => console.log('IconButton dark 44 clicked')}
              >
                <Arrow />
              </IconButton>
              <IconButton
                variant="dark"
                size={56}
                ariaLabel="Далее"
                onClick={() => console.log('IconButton dark 56 clicked')}
              >
                <Arrow />
              </IconButton>
            </div>
          </section>

          {/* IconButton — variant=filled, normal vs pressed */}
          <section>
            <h2 className="mb-4 mt-12 text-xl font-medium">
              IconButton — variant=filled, normal vs pressed
            </h2>
            <hr className="mb-6" />
            <div className="flex items-center gap-4 rounded-xl bg-light p-8">
              <IconButton
                variant="filled"
                size={56}
                pressed={false}
                ariaLabel="Далее"
                onClick={() => console.log('IconButton filled 56 clicked')}
              >
                <Arrow />
              </IconButton>
              <IconButton
                variant="filled"
                size={56}
                pressed={true}
                ariaLabel="Далее"
                onClick={() => console.log('IconButton filled pressed 56 clicked')}
              >
                <Arrow />
              </IconButton>
            </div>
          </section>

          {/* IconButton — interactive=false */}
          <section>
            <h2 className="mb-4 mt-12 text-xl font-medium">IconButton — interactive=false</h2>
            <hr className="mb-6" />
            <div className="flex items-center gap-4 rounded-xl bg-light p-8">
              <IconButton variant="light" size={44} interactive={false} ariaLabel="Иконка">
                <Arrow />
              </IconButton>
            </div>
            <p className="mt-2 text-sm text-muted">No hover response — visual indicator only.</p>
          </section>

          {/* IconButton — visible toggle */}
          <section>
            <h2 className="mb-4 mt-12 text-xl font-medium">IconButton — visible toggle</h2>
            <hr className="mb-6" />
            <div className="flex items-center gap-4 rounded-xl bg-light p-8">
              <IconButton
                variant="light"
                size={44}
                visible={true}
                ariaLabel="Далее"
                onClick={() => console.log('IconButton visible 44 clicked')}
              >
                <Arrow />
              </IconButton>
              <IconButton variant="light" size={44} visible={false} ariaLabel="Далее">
                <Arrow />
              </IconButton>
            </div>
            <p className="mt-2 text-sm text-muted">
              Right one is rendered with visible=false (faded out + translated 20px right).
            </p>
          </section>

          {/* IconButton — different icons */}
          <section>
            <h2 className="mb-4 mt-12 text-xl font-medium">IconButton — different icons</h2>
            <hr className="mb-6" />
            <div className="flex items-center gap-4 rounded-xl bg-light p-8">
              <IconButton
                variant="light"
                size={44}
                ariaLabel="Далее"
                onClick={() => console.log('IconButton light Arrow clicked')}
              >
                <Arrow />
              </IconButton>
              <IconButton
                variant="light"
                size={44}
                ariaLabel="Открыть"
                onClick={() => console.log('IconButton light Plus clicked')}
              >
                <Plus />
              </IconButton>
              <IconButton
                variant="light"
                size={44}
                ariaLabel="Закрыть"
                onClick={() => console.log('IconButton light Close clicked')}
              >
                <Close />
              </IconButton>
            </div>
          </section>

          {/* Hooks: useViewport */}
          <section>
            <h2 className="mb-4 mt-12 text-xl font-medium">useViewport (live)</h2>
            <hr className="mb-6" />
            <div className="rounded-xl bg-light p-8">
              <div className="grid max-w-md grid-cols-2 gap-4">
                <div className="text-sm text-muted">canHover:</div>
                <div className="font-mono">{String(canHover)}</div>
                <div className="text-sm text-muted">isTouch:</div>
                <div className="font-mono">{String(isTouch)}</div>
              </div>
              <p className="mt-4 text-sm text-muted">
                Resize the browser or open DevTools device emulation to toggle these values.
              </p>
            </div>
          </section>

          {/* Hooks: useScrollDirection */}
          <section>
            <h2 className="mb-4 mt-12 text-xl font-medium">
              useScrollDirection (threshold = 400px, live)
            </h2>
            <hr className="mb-6" />
            <div className="rounded-xl bg-light p-8">
              <div className="grid max-w-md grid-cols-2 gap-4">
                <div className="text-sm text-muted">isPastThreshold:</div>
                <div className="font-mono">{String(isPastThreshold)}</div>
                <div className="text-sm text-muted">direction:</div>
                <div className="font-mono">{direction ?? 'null'}</div>
              </div>
              <p className="mt-4 text-sm text-muted">
                Scroll up and down to see direction flip. isPastThreshold flips at 400px from top.
              </p>
            </div>
          </section>

          {/* Hooks: useCountUp */}
          <section>
            <h2 className="mb-4 mt-12 text-xl font-medium">useCountUp</h2>
            <hr className="mb-6" />
            <div className="flex flex-col items-start gap-4 rounded-xl bg-light p-8">
              <div className="font-mono text-5xl font-medium tabular-nums">{counter}</div>
              <Button
                size="sm"
                text={countStarted ? 'Запустить заново' : 'Запустить'}
                onClick={() => {
                  setCountStarted(false)
                  setTimeout(() => setCountStarted(true), 50)
                }}
              />
              <p className="text-sm text-muted">
                Count-up animates 0 → 1234 over 1800ms with ease-out cubic.
              </p>
            </div>
          </section>
        </main>
      </motion.section>

      <div style={{ height: footerH }} aria-hidden="true" />
    </>
  )
}
