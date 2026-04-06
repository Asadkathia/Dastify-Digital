import type { Block } from 'payload';

export const VideoEmbedBlock: Block = {
  slug: 'video-embed-block',
  interfaceName: 'VideoEmbedBlock',
  fields: [
    {
      name: 'url',
      type: 'text',
      required: true,
      admin: { description: 'YouTube or Vimeo URL (e.g. https://www.youtube.com/watch?v=...)' },
    },
    { name: 'title', type: 'text' },
    { name: 'caption', type: 'text' },
    { name: 'autoplay', type: 'checkbox', defaultValue: false },
  ],
};
