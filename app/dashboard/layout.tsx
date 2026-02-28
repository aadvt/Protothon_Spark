import { Header } from '@/components/header'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

interface DashboardLayoutProps {
    children: React.ReactNode
}

export default async function DashboardLayout({ children }: DashboardLayoutProps) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        redirect('/login')
    }

    const userData = {
        full_name: (user.user_metadata as any).full_name || user.email?.split('@')[0],
        user_role: (user.user_metadata as any).user_role || 'student'
    }

    return (
        <div className="min-h-screen bg-background text-foreground selection:bg-primary/10">
            <Header userRole={userData.user_role as any} userName={userData.full_name} />
            {children}
        </div>
    )
}
