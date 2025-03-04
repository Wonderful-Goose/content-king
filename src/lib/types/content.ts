export type ContentType = {
  id: string;
  name: string;
  color: string;
  description: string;
  icon: string;
};

export const CONTENT_TYPES: ContentType[] = [
  {
    id: 'tweet',
    name: 'Tweet',
    color: '#1DA1F2', // Twitter blue
    description: 'Short-form social media post',
    icon: '🐦'
  },
  {
    id: 'linkedin',
    name: 'LinkedIn Post',
    color: '#0A66C2', // LinkedIn blue
    description: 'Professional social media post',
    icon: '💼'
  },
  {
    id: 'newsletter',
    name: 'Newsletter',
    color: '#FF6B6B', // Coral red
    description: 'Email newsletter content',
    icon: '📧'
  },
  {
    id: 'blog',
    name: 'Blog Post',
    color: '#4CAF50', // Green
    description: 'Long-form written content',
    icon: '✍️'
  },
  {
    id: 'video',
    name: 'Video',
    color: '#FF4081', // Pink
    description: 'Video content',
    icon: '🎥'
  },
  {
    id: 'podcast',
    name: 'Podcast',
    color: '#9C27B0', // Purple
    description: 'Audio content',
    icon: '🎙️'
  },
  {
    id: 'instagram',
    name: 'Instagram',
    color: '#E4405F', // Instagram pink
    description: 'Visual social media content',
    icon: '📸'
  },
  {
    id: 'thread',
    name: 'Thread',
    color: '#1DA1F2', // Twitter blue
    description: 'Long-form social media thread',
    icon: '🧵'
  }
];

export const getContentType = (id: string): ContentType | undefined => {
  return CONTENT_TYPES.find(type => type.id === id);
}; 