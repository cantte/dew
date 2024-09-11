import { OrbitingCircle } from '~/components/home/orbiting-circle'

export const OrbitingCircles = () => {
  return (
    <div className="relative flex h-[500px] w-full items-center justify-center overflow-hidden rounded-lg">
      <span className="pointer-events-none whitespace-pre-wrap bg-gradient-to-b from-black to-gray-500/80 bg-clip-text text-center font-semibold text-8xl text-transparent leading-none dark:from-white dark:to-slate-900/10">
        Vende rápido
      </span>

      <OrbitingCircle
        className="h-[30px] w-[30px] border-none bg-transparent"
        duration={20}
        delay={20}
        radius={80}
      >
        <span className="h-2 w-2 rounded-full bg-primary" />
      </OrbitingCircle>

      <OrbitingCircle
        className="h-[30px] w-[30px] border-none bg-transparent"
        duration={20}
        delay={10}
        radius={80}
      >
        <span className="h-2 w-2 rounded-full bg-primary" />
      </OrbitingCircle>

      <OrbitingCircle
        className="h-[50px] w-[50px] border-none bg-transparent"
        reverse
        radius={190}
        duration={20}
      >
        <span className="h-2 w-2 rounded-full bg-primary" />
      </OrbitingCircle>

      <OrbitingCircle
        className="h-[70px] w-[70px] border-none bg-transparent"
        radius={250}
        duration={20}
        delay={15}
      >
        <span className="h-2 w-2 rounded-full bg-primary" />
      </OrbitingCircle>
    </div>
  )
}
