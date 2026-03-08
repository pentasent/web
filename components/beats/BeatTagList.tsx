import React from 'react';
import { BeatTag } from '@/types/database';

interface BeatTagListProps {
    tags: BeatTag[];
    selectedTag: string | null;
    onSelect: (tagId: string | null) => void;
}

export const BeatTagList: React.FC<BeatTagListProps> = ({ tags, selectedTag, onSelect }) => {
    return (
        <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar">
            <button
                onClick={() => onSelect(null)}
                className={`flex-shrink-0 px-4 py-1.5 rounded-full text-sm font-medium transition-colors border ${selectedTag === null
                        ? 'bg-[#3d2f4d] text-white border-[#3d2f4d]'
                        : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                    }`}
            >
                All Beats
            </button>
            {tags.map((tag) => (
                <button
                    key={tag.id}
                    onClick={() => onSelect(tag.id)}
                    className={`flex-shrink-0 px-4 py-1.5 rounded-full text-sm font-medium transition-colors border ${selectedTag === tag.id
                            ? 'bg-[#3d2f4d] text-white border-[#3d2f4d]'
                            : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                        }`}
                >
                    {tag.name}
                </button>
            ))}
        </div>
    );
};
