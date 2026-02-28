'use client'

import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { Briefcase } from 'lucide-react'
import { ThemeToggle } from '@/components/theme-toggle'
import { Button } from '@/components/ui/button'
import { logout } from '@/app/actions/auth'

interface HeaderProps {
  userRole?: 'student' | 'recruiter' | 'admin'
  userName?: string
}

export function Header({ userRole, userName }: HeaderProps) {
  const pathname = usePathname()

  const handleSignOut = async () => {
    await logout()
  }

  const getRoleDisplay = () => {
    switch (userRole) {
      case 'student':
        return 'Student'
      case 'recruiter':
        return 'Recruiter'
      case 'admin':
        return 'Admin'
      default:
        return ''
    }
  }

  const isDemoOrAuthPage = pathname === '/login' || pathname === '/'

  return (
    <div className="fixed top-0 inset-x-0 z-50 flex justify-center p-4 pointer-events-none">
      <header className="pointer-events-auto rounded-full glass-light px-6 py-3 flex items-center justify-between w-full max-w-5xl shadow-lg shadow-black/5 dark:shadow-black/20 transition-all duration-300">
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-2 font-heading font-bold tracking-tight text-xl transition-transform hover:scale-105">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-indigo-600 text-white shadow-md">
              <Briefcase className="h-5 w-5" />
            </div>
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70">
              PlacementHub
            </span>
          </Link>

          {!isDemoOrAuthPage && (
            <nav className="hidden items-center gap-2 md:flex">
              <Link
                href={userRole ? `/dashboard?role=${userRole}` : '/dashboard'}
                className={`rounded-full px-4 py-2 text-sm font-medium transition-all ${pathname?.startsWith('/dashboard')
                  ? 'bg-primary/10 text-primary shadow-sm'
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                  }`}
              >
                Dashboard
              </Link>
              {userRole !== 'admin' && (
                <Link
                  href={userRole === 'recruiter' ? '/candidates' : '/jobs'}
                  className={`rounded-full px-4 py-2 text-sm font-medium transition-all ${pathname === (userRole === 'recruiter' ? '/candidates' : '/jobs')
                    ? 'bg-primary/10 text-primary shadow-sm'
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                    }`}
                >
                  {userRole === 'recruiter' ? 'Candidates' : 'Jobs'}
                </Link>
              )}
            </nav>
          )}
        </div>

        <div className="flex items-center gap-4">
          {userRole && (
            <div className="hidden text-right sm:block mr-2">
              <p className="text-sm font-semibold">{userName || 'User'}</p>
              <p className="text-xs font-medium text-primary uppercase tracking-wider">{getRoleDisplay()}</p>
            </div>
          )}
          <ThemeToggle />
          {userRole ? (
            <Button variant="ghost" size="sm" onClick={handleSignOut} className="rounded-full hover:bg-destructive/10 hover:text-destructive">
              Sign Out
            </Button>
          ) : (
            pathname !== '/login' && (
              <Button asChild size="sm" className="rounded-full rounded-full shadow-lg shadow-primary/20">
                <Link href="/login">Sign In</Link>
              </Button>
            )
          )}
        </div>
      </header>
    </div>
  )
}
