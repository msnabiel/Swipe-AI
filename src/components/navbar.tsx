"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState } from "react"
import { Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import clsx from "clsx"

const components = [
  { name: "Button", slug: "button" },
  { name: "Card", slug: "card" },
  { name: "Badge", slug: "badge" },
]

export function NavBar() {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)
  const [query, setQuery] = useState("")

  const navLinks = [
    { label: "Home", href: "/" },
    { label: "Interviewee", href: "/interviewee" },
    { label: "Interviewer", href: "/interviewer" },
    {
      label: "GitHub",
      href: "https://github.com/msnabiel/Swipe-AI",
      external: true,
    },
  ]

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    const match = components.find(
      (comp) => comp.name.toLowerCase() === query.trim().toLowerCase()
    )
    if (match) {
      window.location.href = `/components/${match.slug}`
    }
  }

  return (
<nav className="sticky top-0 z-50 border-b bg-background/60 backdrop-blur-lg supports-[backdrop-filter]:bg-background/40">
  <div className="flex items-center justify-between px-4 py-3 max-w-7xl mx-auto">
    {/* Logo */}
    <Link 
      href="/" 
      className="text-2xl font-extrabold tracking-tight bg-gradient-to-r from-primary to-purple-500 bg-clip-text text-transparent"
    >
      ▨ Swipe AI
    </Link>

    {/* Desktop Nav */}
    <div className="hidden md:flex items-center gap-8">
      {navLinks.map(({ label, href, external }) => {
        const isActive = pathname === href
        return external ? (
          <a
            key={label}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="relative text-sm font-medium transition-colors hover:text-primary"
          >
            {label}
          </a>
        ) : (
          <Link
            key={label}
            href={href}
            className={clsx(
              "relative text-sm font-medium transition-colors hover:text-primary",
              isActive && "text-primary"
            )}
          >
            {label}
            {isActive && (
              <span className="absolute left-0 -bottom-1 w-full h-[2px] bg-primary rounded-full transition-all duration-300" />
            )}
          </Link>
        )
      })}
    </div>

    {/* Desktop Search + Login */}
    <form onSubmit={handleSearch} className="hidden md:flex items-center gap-3">
      <Input
        placeholder="Search..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="w-[220px] rounded-full"
      />
      <Link href="/auth/login">
        <Button className="rounded-full shadow-md">Login</Button>
      </Link>
    </form>

    {/* Mobile Toggle */}
    <Button
      variant="ghost"
      className="md:hidden"
      onClick={() => setIsOpen(!isOpen)}
    >
      {isOpen ? <X size={20} /> : <Menu size={20} />}
    </Button>
  </div>

  {/* Mobile Menu */}
  {isOpen && (
    <div className="px-4 pb-4 space-y-4 md:hidden animate-in fade-in-50 slide-in-from-top-2">
      {navLinks.map(({ label, href, external }) =>
        external ? (
          <a
            key={label}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="block text-sm font-medium"
          >
            {label}
          </a>
        ) : (
          <Link
            key={label}
            href={href}
            onClick={() => setIsOpen(false)}
            className={clsx(
              "block text-sm font-medium",
              pathname === href && "text-primary"
            )}
          >
            {label}
          </Link>
        )
      )}
    </div>
  )}
</nav>

  )
}
