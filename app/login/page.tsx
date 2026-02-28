'use client'

import { useState } from 'react'
import { login, signup } from '@/app/actions/auth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Briefcase, Loader2, Rocket, ShieldCheck, Zap, Sparkles } from 'lucide-react'
import { toast } from 'sonner'
import { Toaster } from '@/components/ui/sonner'
import { Carousel, CarouselContent, CarouselItem, type CarouselApi } from '@/components/ui/carousel'
import React, { useEffect } from 'react'

const features = [
    {
        title: "AI-Powered Analysis",
        description: "Gemini 3 Pro deep-dives into your GitHub repos to verify your skills.",
        icon: Sparkles,
        color: "text-blue-500"
    },
    {
        title: "Strict Governance",
        description: "Placement cells can enforce hard GPA policies and audit trails with ease.",
        icon: ShieldCheck,
        color: "text-green-500"
    },
    {
        title: "Elite Matching",
        description: "Direct connection between top students and demanding recruiters.",
        icon: Rocket,
        color: "text-purple-500"
    }
]

export default function LoginPage() {
    const [loading, setLoading] = useState(false)
    const [selectedRole, setSelectedRole] = useState('student')
    const [api, setApi] = React.useState<CarouselApi>()

    useEffect(() => {
        if (!api) return

        const intervalId = setInterval(() => {
            if (api.canScrollNext()) {
                api.scrollNext()
            } else {
                api.scrollTo(0)
            }
        }, 4000)

        return () => clearInterval(intervalId)
    }, [api])

    async function handleLogin(formData: FormData) {
        setLoading(true)
        const result = await login(formData)
        if (result?.error) {
            toast.error(result.error)
            setLoading(false)
        }
    }

    async function handleSignup(formData: FormData) {
        setLoading(true)
        const result = await signup(formData)
        if (result?.error) {
            toast.error(result.error)
        } else if (result?.success) {
            toast.success(result.success)
        }
        setLoading(false)
    }

    return (
        <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-background via-secondary/10 to-background p-6 md:p-12">
            <div className="grid w-full max-w-5xl gap-12 lg:grid-cols-2 lg:items-center">

                {/* Left Column: Feature Slider */}
                <div className="hidden lg:flex flex-col gap-8 pr-12">
                    <div className="flex items-center gap-3">
                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary shadow-lg shadow-primary/20 text-primary-foreground">
                            <Briefcase className="h-6 w-6" />
                        </div>
                        <h1 className="text-4xl font-black tracking-tight">PlacementHub</h1>
                    </div>

                    <div className="relative mt-8">
                        <Carousel
                            setApi={setApi}
                            className="w-full max-w-sm"
                            opts={{
                                align: "start",
                                loop: true,
                            }}
                        >
                            <CarouselContent>
                                {features.map((feature, index) => (
                                    <CarouselItem key={index}>
                                        <div className="flex flex-col gap-4 p-2">
                                            <feature.icon className={`h-12 w-12 ${feature.color}`} />
                                            <h3 className="text-2xl font-bold">{feature.title}</h3>
                                            <p className="text-lg text-muted-foreground leading-relaxed">
                                                {feature.description}
                                            </p>
                                        </div>
                                    </CarouselItem>
                                ))}
                            </CarouselContent>
                        </Carousel>
                    </div>

                    <div className="mt-8 flex gap-4 overflow-hidden py-1 opacity-50 grayscale transition-all hover:grayscale-0">
                        {/* Partner Logos Placeholder Style */}
                        <div className="flex h-8 w-max items-center gap-12 animate-marquee">
                            {[1, 2, 3, 4].map((i) => (
                                <div key={i} className="flex items-center gap-2 font-bold text-xl">
                                    <Zap className="h-5 w-5" /> COMP_0{i}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Right Column: Login Box */}
                <div className="mx-auto w-full max-w-md">
                    <Card className="glass relative overflow-hidden border-border/50 shadow-2xl shadow-black/5 dark:shadow-primary/5">
                        <div className="absolute top-0 left-0 h-1 w-full bg-gradient-to-r from-primary/50 via-primary to-primary/50" />

                        <Tabs defaultValue="login" className="w-full">
                            <TabsList className="grid w-full grid-cols-2 h-14 p-1.5 bg-muted/50 backdrop-blur-md">
                                <TabsTrigger value="login" className="text-sm font-bold data-[state=active]:shadow-lg">Login</TabsTrigger>
                                <TabsTrigger value="register" className="text-sm font-bold data-[state=active]:shadow-lg">Register</TabsTrigger>
                            </TabsList>

                            <div className="p-4 md:p-8">
                                <TabsContent value="login" className="m-0 mt-4 outline-none">
                                    <form action={handleLogin} className="space-y-6">
                                        <div className="space-y-2">
                                            <CardHeader className="p-0 mb-6">
                                                <CardTitle className="text-3xl font-black">Welcome Back</CardTitle>
                                                <CardDescription className="text-base">Enter your credentials to access your portal</CardDescription>
                                            </CardHeader>
                                        </div>
                                        <CardContent className="p-0 space-y-6">
                                            <div className="space-y-3">
                                                <Label htmlFor="email" className="font-bold">Email Address</Label>
                                                <Input
                                                    id="email"
                                                    name="email"
                                                    type="email"
                                                    placeholder="name@college.edu"
                                                    required
                                                    className="h-12 bg-white/10 dark:bg-black/10 border-white/20"
                                                />
                                            </div>
                                            <div className="space-y-3">
                                                <div className="flex items-center justify-between">
                                                    <Label htmlFor="password" className="font-bold">Password</Label>
                                                    <Button variant="link" className="h-auto p-0 text-xs font-semibold text-primary">Forgot Password?</Button>
                                                </div>
                                                <Input
                                                    id="password"
                                                    name="password"
                                                    type="password"
                                                    required
                                                    className="h-12 bg-white/10 dark:bg-black/10 border-white/20"
                                                />
                                            </div>
                                        </CardContent>
                                        <CardFooter className="p-0 pt-4">
                                            <Button className="w-full h-12 text-lg font-bold shadow-lg shadow-primary/20 hover:scale-[1.02] transition-transform active:scale-95" type="submit" disabled={loading}>
                                                {loading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : 'Log In'}
                                            </Button>
                                        </CardFooter>
                                    </form>
                                </TabsContent>

                                <TabsContent value="register" className="m-0 mt-4 outline-none">
                                    <form action={handleSignup} className="space-y-6">
                                        <CardHeader className="p-0 mb-6">
                                            <CardTitle className="text-3xl font-black">Create Account</CardTitle>
                                            <CardDescription className="text-base">Join the placement hub network today</CardDescription>
                                        </CardHeader>
                                        <CardContent className="p-0 space-y-5">
                                            <div className="space-y-2">
                                                <Label htmlFor="fullName" className="font-bold">Full Name</Label>
                                                <Input id="fullName" name="fullName" placeholder="Aarav Patel" required className="h-11 bg-white/10 dark:bg-black/10 border-white/20" />
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="reg-email" className="font-bold">Email Domain</Label>
                                                <Input id="reg-email" name="email" type="email" placeholder="name@college.edu" required className="h-11 bg-white/10 dark:bg-black/10 border-white/20" />
                                            </div>
                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="space-y-2">
                                                    <Label htmlFor="reg-password" className="font-bold">Password</Label>
                                                    <Input id="reg-password" name="password" type="password" required className="h-11 bg-white/10 dark:bg-black/10 border-white/20" />
                                                </div>
                                                <div className="space-y-2">
                                                    <Label htmlFor="role" className="font-bold">Role</Label>
                                                    <select
                                                        id="role"
                                                        name="role"
                                                        value={selectedRole}
                                                        onChange={(e) => setSelectedRole(e.target.value)}
                                                        className="flex h-11 w-full rounded-md border border-white/20 bg-white/10 dark:bg-black/10 px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                                        required
                                                    >
                                                        <option value="student">Student</option>
                                                        <option value="recruiter">Recruiter</option>
                                                        <option value="admin">Admin</option>
                                                    </select>
                                                </div>
                                            </div>

                                            {selectedRole === 'student' && (
                                                <div className="grid grid-cols-2 gap-4 animate-in fade-in slide-in-from-top-2 duration-300">
                                                    <div className="space-y-2">
                                                        <Label htmlFor="githubUsername" className="font-bold">GitHub</Label>
                                                        <Input id="githubUsername" name="githubUsername" placeholder="username" className="h-11 bg-white/10 dark:bg-black/10 border-white/20" />
                                                    </div>
                                                    <div className="space-y-2">
                                                        <Label htmlFor="leetcodeUsername" className="font-bold">LeetCode</Label>
                                                        <Input id="leetcodeUsername" name="leetcodeUsername" placeholder="username" className="h-11 bg-white/10 dark:bg-black/10 border-white/20" />
                                                    </div>
                                                </div>
                                            )}
                                        </CardContent>
                                        <CardFooter className="p-0 pt-4">
                                            <Button className="w-full h-11 text-lg font-bold shadow-lg shadow-primary/20 hover:scale-[1.02] transition-transform active:scale-95" type="submit" disabled={loading}>
                                                {loading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : 'Get Started'}
                                            </Button>
                                        </CardFooter>
                                    </form>
                                </TabsContent>
                            </div>
                        </Tabs>
                    </Card>
                    <p className="mt-8 text-center text-sm text-muted-foreground">
                        By signing in, you agree to our <span className="font-semibold text-foreground underline decoration-primary/30 underline-offset-4">Terms</span> and <span className="font-semibold text-foreground underline decoration-primary/30 underline-offset-4">Privacy Policy</span>.
                    </p>
                </div>
            </div>
            <Toaster />
        </div>
    )
}

