export const formatNumber = (num: number): string => {
    if (num >= 1000000) {
        return (num / 1000000).toFixed(1).replace(/\.0$/, '') + 'M';
    }
    if (num >= 1000) {
        return (num / 1000).toFixed(1).replace(/\.0$/, '') + 'K';
    }
    return num.toString();
};

export const parseContent = (content: any): string => {
    if (typeof content === 'string') return content;
    if (content?.type === 'doc' && Array.isArray(content.content)) {
        return content.content.map((block: any) => {
            if (block.type === 'paragraph' && Array.isArray(block.content)) {
                return block.content.map((t: any) => t.text).join(' ');
            }
            return '';
        }).join('\n');
    }
    return 'Content available';
};
