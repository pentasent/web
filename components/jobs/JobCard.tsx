'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  MapPin,
  IndianRupee,
  Clock,
  ArrowRight,
  Sparkles,
  Eye,
  Users,
  Building2,
  ExternalLink,
  AlertCircle,
} from 'lucide-react';
import { JobOpening } from '@/types/jobs';

interface JobCardProps {
  job: JobOpening;
  basePath?: string;
  index?: number;
  actions?: React.ReactNode;
  isOwner?: boolean;
}

export default function JobCard({
  job,
  basePath = '/company/careers/open-roles',
  index = 0,
  actions,
  isOwner = false,
}: JobCardProps) {
  const targetHref = `${basePath}/${job.slug}`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.04 }}
      className="group"
    >
      <div className="flex flex-col w-full">
        <Link
          href={targetHref}
          className="block pt-6 sm:pt-7 pb-2.5 transition-colors cursor-pointer w-full"
        >
          <div className="flex flex-col gap-2.5">
          {/* Header Row: Category, badges, work mode, and experience */}
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex flex-wrap items-center gap-2 text-[12px] sm:text-[12.5px]">
              <span className="font-bold uppercase tracking-[0.16em] text-[#6b185f]">
                {job.department}
              </span>

              {job.isPromoted && (
                <>
                  <span className="text-[#ded9d5]">·</span>
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-bold bg-amber-50 text-amber-800 border border-amber-200">
                    <Sparkles size={11} className="text-amber-600 fill-amber-500" />
                    Promoted
                  </span>
                </>
              )}

              {job.employerName && job.employerName !== 'Pentasent' && (
                <>
                  <span className="text-[#ded9d5]">·</span>
                  <span className="inline-flex items-center gap-1 font-semibold text-foreground">
                    <Building2 size={13} className="text-muted-foreground" />
                    {job.employerName}
                  </span>
                </>
              )}

              <span className="text-[#ded9d5]">·</span>
              <span className="font-semibold text-[#1b6d47]">
                {job.locationType}
              </span>

              <span className="text-[#ded9d5]">·</span>
              <span className="text-primary-text font-medium">
                {job.employmentType}
              </span>

              {(job.status === 'paused' || job.status === 'closed') && (
                <>
                  <span className="text-[#ded9d5]">·</span>
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-bold bg-amber-50 text-amber-800 border border-amber-200">
                    <AlertCircle size={11} className="text-amber-600" />
                    {job.status === 'paused' ? 'Hiring Paused' : 'Closed'}
                  </span>
                </>
              )}
            </div>

            <div className="flex items-center gap-3 text-[12.5px] font-medium text-primary-text">
              <span>{job.experienceLevel}</span>
              {job.applicationMode === 'external' && (
                <span className="inline-flex items-center gap-1 text-[11.5px] font-medium text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                  <ExternalLink size={11} />
                  External
                </span>
              )}
            </div>
          </div>

          {/* Title & Arrow */}
          <div className="flex items-center justify-between gap-4 mt-0.5">
            <h2 className="text-[20px] sm:text-[23px] font-bold text-foreground group-hover:text-primary transition-colors duration-200">
              {job.title}
            </h2>
            {!isOwner && (
              <div className="shrink-0 flex items-center gap-1.5 text-primary font-bold text-[14px] opacity-0 group-hover:opacity-100 transition-opacity">
                <span>{job.applicationMode === 'external' ? 'View & Apply' : 'Apply'}</span>
                <ArrowRight
                  size={16}
                  className="group-hover:translate-x-1 transition-transform duration-200"
                />
              </div>
            )}
          </div>

          {/* Summary */}
          <p className="text-[14px] sm:text-[15.5px] leading-[1.65] text-primary-text line-clamp-2 max-w-4xl">
            {job.summary}
          </p>

          {/* Specs Row: Location, Salary, Timing & Stats */}
          <div className="mt-2 flex flex-wrap items-center justify-between gap-y-2 gap-x-6 text-[13px] sm:text-[14px] text-primary-text">
            <div className="flex flex-wrap items-center gap-y-2 gap-x-5">
              <span className="inline-flex items-center gap-1.5">
                <MapPin size={14} className="text-primary shrink-0" />
                <span>{job.location}</span>
              </span>

              {job.salary && (
                <span className="inline-flex items-center gap-1.5">
                  <IndianRupee size={14} className="text-primary shrink-0" />
                  <span>{job.salary}</span>
                </span>
              )}

              {job.timing && (
                <span className="inline-flex items-center gap-1.5">
                  <Clock size={14} className="text-primary shrink-0" />
                  <span>{job.timing}</span>
                </span>
              )}
            </div>

            {/* Engagement Stats: Views / Clicks & Applications Count */}
            <div className="flex items-center gap-4 text-[12px] text-muted-foreground ml-auto">
              <span
                className="inline-flex items-center gap-1 font-medium"
                title={`${job.viewsCount || 0} clicks / views`}
              >
                <Eye size={13} className="text-muted-foreground/80" />
                <span>{job.viewsCount || 0} views</span>
              </span>

              <span
                className="inline-flex items-center gap-1 font-medium text-emerald-700"
                title={`${job.applicationsCount || 0} candidates applied`}
              >
                <Users size={13} className="text-emerald-600" />
                <span>{job.applicationsCount || 0} applied</span>
              </span>
            </div>
          </div>
        </div>
      </Link>

        {actions && (
          <div className="w-full pt-3 pb-6 border-t border-[#f0ece9]/90">
            {actions}
          </div>
        )}
      </div>
    </motion.div>
  );
}
