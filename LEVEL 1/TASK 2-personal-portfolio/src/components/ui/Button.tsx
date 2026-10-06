import { forwardRef, type AnchorHTMLAttributes, type ButtonHTMLAttributes, type ReactNode, type Ref } from 'react'
import { ArrowUpRight } from 'lucide-react'

type Variant = 'primary' | 'secondary' | 'ghost'

const base =
  'group relative inline-flex items-center gap-2 font-mono text-xs tracking-[0.18em] uppercase px-6 py-3 transition-all duration-300 focus-visible:outline-2'

const variants: Record<Variant, string> = {
  primary:
    'bg-accent text-on-accent border border-accent hover-glow hover:-translate-y-0.5',
  secondary:
    'bg-transparent text-ink border border-line-strong hover:border-accent hover:text-accent hover-glow',
  ghost: 'bg-transparent text-ink-muted border border-transparent hover:text-accent',
}

interface CommonProps {
  variant?: Variant
  children: ReactNode
  icon?: boolean
  className?: string
}

type ButtonAsButton = CommonProps &
  ButtonHTMLAttributes<HTMLButtonElement> & { href?: undefined }

type ButtonAsLink = CommonProps &
  AnchorHTMLAttributes<HTMLAnchorElement> & { href: string }

export const Button = forwardRef<HTMLButtonElement | HTMLAnchorElement, ButtonAsButton | ButtonAsLink>(
  function Button(props, ref) {
    const { variant = 'primary', children, icon = true, className = '', ...rest } = props
    const classes = `${base} ${variants[variant]} ${className}`

    if ('href' in rest && rest.href) {
      const { href, ...anchorRest } = rest as AnchorHTMLAttributes<HTMLAnchorElement>
      return (
        <a ref={ref as Ref<HTMLAnchorElement>} href={href} className={classes} {...anchorRest}>
          <span>{children}</span>
          {icon && (
            <ArrowUpRight
              size={14}
              className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            />
          )}
        </a>
      )
    }

    return (
      <button
        ref={ref as Ref<HTMLButtonElement>}
        className={classes}
        {...(rest as ButtonHTMLAttributes<HTMLButtonElement>)}
      >
        <span>{children}</span>
        {icon && (
          <ArrowUpRight
            size={14}
            className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
          />
        )}
      </button>
    )
  },
)
