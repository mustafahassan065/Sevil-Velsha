import { config } from './config.js';

const fileUrl = (name) => (name ? `${config.clientUrl}/api/files/${name}` : null);

// Admin ko sab kuch dikhta hai
export function adminRitual(r) {
  return {
    id: r.id,
    title: r.title,
    description: r.description,
    category: r.category,
    durationMin: r.duration_min,
    access: r.access,
    isActive: !!r.is_active,
    sortOrder: r.sort_order,
    imageUrl: fileUrl(r.image_file),
    audioUrl: fileUrl(r.audio_file),
  };
}

// Users ke liye: premium ritual ka audio free user se chhupa rehta hai
export function publicRitual(r, canSeePremium) {
  const locked = r.access === 'premium' && !canSeePremium;
  return {
    id: r.id,
    title: r.title,
    description: r.description,
    category: r.category,
    durationMin: r.duration_min,
    access: r.access,
    locked,
    imageUrl: fileUrl(r.image_file),
    audioUrl: locked ? null : fileUrl(r.audio_file),
  };
}