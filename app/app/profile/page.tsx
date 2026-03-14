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
      <div className="max-w-[760px] mx-auto px-4 sm:pt-10 pt-20">

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
                  'https://api.pentasent.com/storage/v1/object/public/avatars/placeholders/icon.png'
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

        {/* Analytics */}
        <div className="bg-warm-200/30 mt-8 rounded-2xl border border-warm-200 shadow-sm p-6">

          <h2 className="text-lg font-semibold text-warm-800 mb-6">
            Profile Analytics
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">

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

        {/* Links */}
        <div className="bg-warm-200/30 mt-6 rounded-2xl border border-warm-200 shadow-sm">

          <button
            onClick={() => router.push('/contact')}
            className="w-full flex items-center justify-between p-5 hover:bg-warm-50 transition rounded-2xl"
          >
            <div className="flex items-center gap-4">
              <div className="h-10 w-10 rounded-full bg-[#fceeea] text-[#e05e46] flex items-center justify-center">
                <Mail className="h-5 w-5"/>
              </div>

              <span className="text-sm font-medium text-warm-900">
                Contact Us
              </span>
            </div>

            <ChevronRight className="h-5 w-5 text-warm-400"/>
          </button>
        </div>

        {/* Logout */}
        <div className="mt-8">
          <Button
            variant="outline"
            onClick={handleLogout}
            className="w-full py-7 rounded-2xl border-red-200 text-red-500 hover:bg-red-50 bg-warm-200/50"
          >
            Sign Out from Pentasent
          </Button>
        </div>

        {/* Footer */}
        <div className="text-center mt-10 text-xs text-warm-500 space-y-1">
          <p>Web Version 1.0.0</p>
          <p>Developed by Pentasent Inc.</p>
          <p className="font-serif text-warm-700">
            Take Back Control of Your Mind and Senses
          </p>
        </div>
      </div>
    </div>
  )
}

/* Small stat component for cleaner structure */
function Stat({ icon, label, value }: any) {
  return (
    <div className="flex items-start gap-3">
      <div className="h-10 w-10 rounded-xl bg-warm-50 border border-warm-100 flex items-center justify-center text-warm-500">
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