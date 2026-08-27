import { Link } from 'react-router-dom'
import { ChevronRight } from 'lucide-react'

interface BreadcrumbProps {
  items: { name: string; path: string }[]
}

export default function Breadcrumb({ items }: BreadcrumbProps) {
  return (
    <nav aria-label="Fil d'Ariane" className="mx-auto max-w-7xl px-4 py-3">
      <ol className="flex flex-wrap items-center gap-1 font-poppins text-xs text-wasp-gray">
        {items.map((item, i) => {
          const isLast = i === items.length - 1
          return (
            <li key={item.path} className="flex items-center gap-1">
              {i > 0 && <ChevronRight className="h-3 w-3 shrink-0" aria-hidden="true" />}
              {isLast ? (
                <span aria-current="page" className="font-semibold text-wasp-black">
                  {item.name}
                </span>
              ) : (
                <Link to={item.path} className="hover:text-wasp-yellow transition-colors">
                  {item.name}
                </Link>
              )}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
