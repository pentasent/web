'use client'

import React, { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/contexts/AuthContext'
import {
  Loader2,
  Mail,
  Calendar,
  Edit3,
  ChevronRight,
  MapPin,
  Grid,
  Users,
  BookOpen
} from 'lucide-react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { useToast } from '@/hooks/use-toast'
import { formatNumber } from '@/lib/format'
import { GlobalLayout } from '@/components/layout/global-layout'

export default function ProfilePage() {
  const { user, loading: authLoading, logout } = useAuth()
  const router = useRouter()
  const { toast } = useToast()

  const [postCount, setPostCount] = useState<number | null>(null)
  const [communityCount, setCommunityCount] = useState<number | null>(null)
  const [journalCount, setJournalCount] = useState<number | null>(null)

  useEffect(() => {
    if (!authLoading && !user) router.replace('/signin')
  }, [user, authLoading, router])

  useEffect(() => {
    const fetchStats = async () => {
      if (!user) return

      try {
        const { count: pCount } = await supabase
          .from('posts')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', user.id)

        const { count: cCount } = await supabase
          .from('community_followers')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', user.id)

        const { count: jCount } = await supabase
          .from('user_journals')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', user.id)

        setPostCount(pCount ?? 0)
        setCommunityCount(cCount ?? 0)
        setJournalCount(jCount ?? 0)
      } catch {
        toast({
          title: 'Error',
          description: 'Failed to load profile statistics.',
          variant: 'destructive'
        })
      }
    }

    if (user) fetchStats()
  }, [user, toast])

  const handleLogout = async () => {
    try {
      await logout()
      router.replace('/signin')
    } catch {
      toast({
        title: 'Error',
        description: 'Failed to logout.',
        variant: 'destructive'
      })
    }
  }

    if (authLoading) {
        return (
          <GlobalLayout />
        );
    }

    if (!user) return null;

  return (
    <div className="min-h-screen bg-[#fffbf7] pb-20">
      <div className="max-w-[760px] mx-auto px-4 mt-20 xl:mt-6 lg:mt-4">

        {/* Banner */}
        <div className="relative h-48 rounded-3xl overflow-hidden bg-gradient-to-br from-[#fdf8f4] via-[#f7f2ec] to-[#eef6f1] border border-warm-200/40">

          <div className="absolute -top-16 right-10 w-56 h-56 bg-emerald-200/40 blur-3xl rounded-full"/>
          <div className="absolute -bottom-16 left-16 w-56 h-56 bg-orange-100/50 blur-3xl rounded-full"/>

          <Button
            variant="ghost"
            size="icon"
            className="absolute top-4 right-4 bg-white/80 backdrop-blur rounded-full shadow-sm hover:bg-white"
            onClick={() => router.push('/app/profile/edit')}
          >
            <Edit3 className="h-5 w-5 text-warm-700"/>
          </Button>
        </div>

        {/* Avatar + Name */}
        <div className="relative -mt-16 flex flex-col items-start px-4">

          <div className="border-4 border-[#fffbf7] rounded-full shadow-md overflow-hidden">
            <Avatar className="h-28 w-28">
              <AvatarImage
                src={
                  user.avatar_url ||
                  'https://cdn.pentasent.com/storage/object/public/avatars/placeholders/icon.png'
                }
              />
              <AvatarFallback className="bg-warm-100 text-warm-800 text-3xl font-serif">
                {user.name?.charAt(0)?.toUpperCase() || 'U'}
              </AvatarFallback>
            </Avatar>
          </div>

          <div className="mt-4">
            <h1 className="text-3xl font-semibold text-warm-900 font-serif">
              {user.name || 'User'}
            </h1>

            {user.bio && (
              <p className="text-warm-600 mt-2 max-w-xl leading-relaxed">
                {user.bio}
              </p>
            )}
          </div>
        </div>

        {/* Analytics Card */}
        <div className="bg-white mt-8 rounded-3xl border border-warm-200 shadow-sm p-8">
          <h2 className="text-xl font-bold text-[#3d2f4d] mb-8 font-serif">
            Profile Analytics
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
            <Stat
              icon={<Mail className="h-5 w-5"/>}
              label="Email"
              value={user.email}
            />

            <Stat
              icon={<Calendar className="h-5 w-5"/>}
              label="Member Since"
              value={new Date(user.created_at || Date.now()).toLocaleDateString(
                undefined,
                { month: 'long', year: 'numeric' }
              )}
            />

            <Stat
              icon={<Grid className="h-5 w-5"/>}
              label="Posts"
              value={formatNumber(postCount || 0)}
            />

            <Stat
              icon={<Users className="h-5 w-5"/>}
              label="Communities"
              value={formatNumber(communityCount || 0)}
            />

            <Stat
              icon={<BookOpen className="h-5 w-5"/>}
              label="Journals"
              value={formatNumber(journalCount || 0)}
            />

            <Stat
              icon={<MapPin className="h-5 w-5"/>}
              label="Location"
              value={user.country || 'Unknown'}
            />
          </div>
        </div>

        {/* Action Links */}
        <div className="bg-white mt-6 rounded-3xl border border-warm-200 shadow-sm overflow-hidden">
          <button
            onClick={() => router.push('/contact')}
            className="w-full flex items-center justify-between p-6 hover:bg-warm-50 transition-colors"
          >
            <div className="flex items-center gap-4">
              <div className="h-10 w-10 rounded-full bg-orange-50 text-[#D49499] flex items-center justify-center">
                <Mail className="h-5 w-5"/>
              </div>

              <span className="text-sm font-semibold text-[#3d2f4d]">
                Contact Support
              </span>
            </div>

            <ChevronRight className="h-5 w-5 text-warm-300"/>
          </button>
        </div>

        {/* Logout Section */}
        <div className="mt-10">
          <Button
            variant="outline"
            onClick={handleLogout}
            className="w-full h-16 rounded-2xl border-warm-200 text-red-500 hover:bg-red-50 bg-white hover:border-red-100 transition-all font-medium"
          >
            Sign Out from Pentasent
          </Button>
        </div>

        {/* Footer */}
        <div className="text-center mt-12 text-xs text-warm-400 space-y-2">
          <p className="font-medium tracking-wide">WEB VERSION 1.0.0</p>
          <p>Developed by Pentasent Inc.</p>
          <div className="pt-2">
            <p className="font-serif text-[#3d2f4d] text-base opacity-80 italic">
              &quot;Take Back Control of Your Mind and Senses&quot;
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

/* Small stat component for cleaner structure */
function Stat({ icon, label, value }: any) {
  return (
    <div className="flex items-start gap-3">
      <div className="h-10 w-10 rounded-xl bg-warm-50 border border-warm-100 flex items-center justify-center text-[#3d2f4d]/70">
        {icon}
      </div>

      <div className="flex flex-col">
        <span className="text-xs uppercase tracking-wide text-warm-400">
          {label}
        </span>

        <span className="text-sm font-semibold text-warm-800">
          {value}
        </span>
      </div>
    </div>
  )
}