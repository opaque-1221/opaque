document.addEventListener("DOMContentLoaded", () => {
  /* ========================================================================
     🌟 魔法 Z-Index 遮罩演算法
     ======================================================================== */
  const navbar = document.getElementById("navbar");
  const brandLogo = document.getElementById("brandLogo");
  const heroSection = document.getElementById("heroSection");
  const backToTop = document.getElementById("backToTop");

  // 因為在 CSS 中我們把大 Logo 高度寫死了，這邊也要對齊！
  const TARGET_LOGO_HEIGHT = 22;
  let INITIAL_LOGO_HEIGHT = parseFloat(getComputedStyle(brandLogo).height);
  let SCALE_RATIO = TARGET_LOGO_HEIGHT / INITIAL_LOGO_HEIGHT;
  const NAVBAR_CENTER_Y = 36;   

  function handleScroll() {
    const scrollY = window.scrollY || window.pageYOffset;
    const heroHeight = heroSection.offsetHeight;
    const windowHeight = window.innerHeight;

    // 1. 設定極具氣勢的偏低起始點 (70vh 處)
    const initialY = windowHeight * 0.70;

    // 2. 嚴格定義終點距離：剛好是首圖底部碰到 Navbar 底部的那一刻
    const transitionDistance = heroHeight - 72; 
    const scrollProgress = Math.min(1, Math.max(0, scrollY / transitionDistance));

    // 3. 完美線性計算
    const currentY = initialY + (NAVBAR_CENTER_Y - initialY) * scrollProgress;
    const currentScale = 1 - (1 - SCALE_RATIO) * scrollProgress;

    brandLogo.style.top = `${currentY}px`;
    brandLogo.style.transform = `translate(-50%, -50%) scale(${currentScale})`;

    // 4. 最關鍵的 Z-index 跳轉！
    // 在滾動過程中 (進度 < 1)，Logo 永遠待在圖層 50，會自然地被下方白色區塊 (圖層 100) 蓋住吃掉
    if (scrollProgress >= 1) {
      navbar.classList.add("scrolled");
      brandLogo.style.color = "var(--color-text-dark)";
      // 一旦進度滿了，瞬間跳到圖層 1001，浮現在已經變白的導覽列前方
      brandLogo.style.zIndex = "1001"; 
    } else {
      navbar.classList.remove("scrolled");
      brandLogo.style.color = "#ffffff";
      // 滾動中退回圖層 50，讓白色區塊充當物理遮罩
      brandLogo.style.zIndex = "50"; 
    }

    // 5. 回頂端按鈕顯隱控制
    if (scrollY > 300) {
      backToTop.classList.add("show");
    } else {
      backToTop.classList.remove("show");
    }
  }

  window.addEventListener("scroll", handleScroll, { passive: true });
  handleScroll(); 

  /* ========================================================================
     回頂端點擊平滑滾動
     ======================================================================== */
  backToTop.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  /* ========================================================================
     分類滑動指示線
     ======================================================================== */
  const categoryTrack = document.getElementById("categoryTrack");
  const categoryItems = document.querySelectorAll(".category-item");
  const activeLine = document.getElementById("categoryActiveLine");

  function updateActiveLine(targetItem) {
    if (!targetItem || !activeLine || !categoryTrack) return;
    const trackRect = categoryTrack.getBoundingClientRect();
    const itemRect = targetItem.getBoundingClientRect();

    const relativeLeft = itemRect.left - trackRect.left;
    const itemWidth = itemRect.width;

    activeLine.style.transform = `translateX(${relativeLeft}px)`;
    activeLine.style.width = `${itemWidth}px`;
  }

  categoryItems.forEach(item => {
    item.addEventListener("click", () => {
      categoryItems.forEach(el => el.classList.remove("active"));
      item.classList.add("active");
      updateActiveLine(item);
    });
  });

  const defaultActiveItem = document.querySelector(".category-item.active") || categoryItems[0];
  if (defaultActiveItem) {
    requestAnimationFrame(() => updateActiveLine(defaultActiveItem));
  }

  window.addEventListener("resize", () => {
      INITIAL_LOGO_HEIGHT = parseFloat(getComputedStyle(brandLogo).height);
    SCALE_RATIO = TARGET_LOGO_HEIGHT / INITIAL_LOGO_HEIGHT;
    const currentActive = document.querySelector(".category-item.active");
    if (currentActive) updateActiveLine(currentActive);
    handleScroll();
  });
});