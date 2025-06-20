document.addEventListener('DOMContentLoaded', () => {
  const galleryItems = Array.from(document.querySelectorAll('.gallery-item'));
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = lightbox.querySelector('.lightbox-img');
  const closeBtn = lightbox.querySelector('.close');
  const prevBtn = lightbox.querySelector('.prev');
  const nextBtn = lightbox.querySelector('.next');
  const filterButtons = document.querySelectorAll('.filter-btn');

  let currentIndex = 0;

  // Show lightbox with selected image
  function showLightbox(index) {
    currentIndex = index;
    const imgSrc = galleryItems[currentIndex].querySelector('img').src;
    lightboxImg.src = imgSrc;
    lightbox.classList.add('active');
  }

  // Hide lightbox
  function hideLightbox() {
    lightbox.classList.remove('active');
    lightboxImg.src = '';
  }

  // Show previous image
  function showPrev() {
    currentIndex = (currentIndex - 1 + galleryItems.length) % galleryItems.length;
    showLightbox(currentIndex);
  }

  // Show next image
  function showNext() {
    currentIndex = (currentIndex + 1) % galleryItems.length;
    showLightbox(currentIndex);
  }

  // Click on gallery item to open lightbox
  galleryItems.forEach((item, index) => {
    item.addEventListener('click', () => {
      showLightbox(index);
    });
  });

  // Close lightbox on close button click
  closeBtn.addEventListener('click', hideLightbox);

  // Navigate with prev/next buttons
  prevBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    showPrev();
  });

  nextBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    showNext();
  });

  // Close lightbox when clicking outside the image
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) {
      hideLightbox();
    }
  });

  // Filter gallery items by category
  filterButtons.forEach(button => {
    button.addEventListener('click', () => {
      const filter = button.getAttribute('data-filter');

      // Update active button
      filterButtons.forEach(btn => btn.classList.remove('active'));
      button.classList.add('active');

      galleryItems.forEach(item => {
        if (filter === 'all' || item.getAttribute('data-category') === filter) {
          item.style.display = 'block';
        } else {
          item.style.display = 'none';
        }
      });
    });
  });
});
