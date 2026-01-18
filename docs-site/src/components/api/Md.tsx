import type { ReactElement } from 'react'
import ReactMarkdown from 'react-markdown'

interface MdProps {
  children: string
}

/**
 * Inline Markdown renderer for JSDoc descriptions
 * Renders Markdown content inline without wrapping in paragraph tags
 */
export function Md({ children }: MdProps): ReactElement {
  return (
    <ReactMarkdown
      components={{
        // Remove paragraph wrapper for inline display
        p: ({ children: c }) => <>{c}</>,
        // Style code inline
        code: ({ children: c }) => (
          <code className="px-1 py-0.5 rounded bg-fd-muted text-fd-muted-foreground text-xs">
            {c}
          </code>
        ),
        // Style links
        a: ({ href, children: c }) => (
          <a
            href={href}
            className="text-fd-primary underline hover:opacity-80"
            target="_blank"
            rel="noopener noreferrer"
          >
            {c}
          </a>
        ),
      }}
    >
      {children}
    </ReactMarkdown>
  )
}
