/* MEDIA — Watch FuryTalks.
   VIDEOS: url accepts any YouTube link (watch, youtu.be, shorts) or the 11-character ID.
     category: 'Talk' | 'Highlight' | 'Clip' (label only). thumbnail optional (defaults to the YouTube thumbnail).
     { title: 'Talk title', url: 'https://youtu.be/VIDEO_ID', category: 'Talk', thumbnail: '' },
   PHOTOS: put image files in images/gallery/ and add one line each:
     { src: 'images/gallery/photo-1.jpg', alt: 'Describe the photo', caption: 'Optional caption' },
   Empty lists show a "Coming Soon" message. */
window.FURYTALKS_MEDIA = {
  videos: [],
  photos: [],
};
