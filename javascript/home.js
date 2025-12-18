// home slider logic


document.addEventListener("DOMContentLoaded", () => {
  const section = document.querySelector(".testimonial");
  if (!section) return;

  const dots = section.querySelectorAll(".dot");
  const quotes = section.querySelectorAll(".testimonial__quote");
  const images = section.querySelectorAll(".testimonial__image");

  let currentIndex = 0;

  function showSlide(index) {
    dots.forEach((d) => d.classList.remove("active"));
    quotes.forEach((q) => q.classList.remove("active"));
    images.forEach((i) => i.classList.remove("active"));

    dots[index].classList.add("active");
    quotes[index].classList.add("active");
    images[index].classList.add("active");

    currentIndex = index;
  }

  dots.forEach((dot, index) => {
    dot.addEventListener("click", () => {
      showSlide(index);
    });
  });
});
