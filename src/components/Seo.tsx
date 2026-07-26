import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export const SITE_URL = 'https://e-co.shop';
export const SITE_NAME = 'B-ECO';
const DEFAULT_IMAGE = `${SITE_URL}/og-image.jpg`;
const TITLE_SUFFIX = ' | B-ECO';

interface SeoProps {
  title: string;
  description: string;
  /** Ảnh đại diện khi chia sẻ link. Dùng đường dẫn tuyệt đối hoặc đường dẫn tương đối trong site. */
  image?: string;
  /** 'product' cho trang chi tiết sản phẩm, còn lại để mặc định. */
  type?: 'website' | 'article' | 'product';
  /** Trang riêng tư (giỏ hàng, thanh toán, admin) — không cho công cụ tìm kiếm lập chỉ mục. */
  noindex?: boolean;
  /** Dữ liệu có cấu trúc schema.org, giúp Google hiển thị giá / đánh giá. */
  jsonLd?: Record<string, unknown> | Record<string, unknown>[];
}

const upsertMeta = (selector: string, attr: 'name' | 'property', key: string, content: string) => {
  let el = document.head.querySelector<HTMLMetaElement>(selector);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
};

const upsertLink = (rel: string, href: string) => {
  let el = document.head.querySelector<HTMLLinkElement>(`link[rel="${rel}"]`);
  if (!el) {
    el = document.createElement('link');
    el.setAttribute('rel', rel);
    document.head.appendChild(el);
  }
  el.setAttribute('href', href);
};

const JSON_LD_ID = 'beco-jsonld';

/**
 * Quản lý thẻ meta theo từng route.
 *
 * Đây là SPA nên toàn site chỉ có một thẻ <title> tĩnh trong index.html —
 * mọi trang chia sẻ lên Facebook/Zalo đều hiện cùng một tiêu đề. Component này
 * cập nhật head theo trang đang xem, không cần thêm thư viện ngoài.
 */
export const Seo = ({
  title,
  description,
  image = DEFAULT_IMAGE,
  type = 'website',
  noindex = false,
  jsonLd,
}: SeoProps) => {
  const { pathname } = useLocation();

  useEffect(() => {
    const fullTitle = title.includes(SITE_NAME) ? title : `${title}${TITLE_SUFFIX}`;
    const canonical = `${SITE_URL}${pathname === '/' ? '' : pathname}`;
    const absoluteImage = image.startsWith('http') ? image : `${SITE_URL}${image}`;

    document.title = fullTitle;

    upsertMeta('meta[name="title"]', 'name', 'title', fullTitle);
    upsertMeta('meta[name="description"]', 'name', 'description', description);
    upsertMeta('meta[name="robots"]', 'name', 'robots', noindex ? 'noindex, nofollow' : 'index, follow');

    upsertMeta('meta[property="og:title"]', 'property', 'og:title', fullTitle);
    upsertMeta('meta[property="og:description"]', 'property', 'og:description', description);
    upsertMeta('meta[property="og:url"]', 'property', 'og:url', canonical);
    upsertMeta('meta[property="og:image"]', 'property', 'og:image', absoluteImage);
    upsertMeta('meta[property="og:type"]', 'property', 'og:type', type === 'product' ? 'product' : type);

    upsertMeta('meta[name="twitter:title"]', 'name', 'twitter:title', fullTitle);
    upsertMeta('meta[name="twitter:description"]', 'name', 'twitter:description', description);
    upsertMeta('meta[name="twitter:url"]', 'name', 'twitter:url', canonical);
    upsertMeta('meta[name="twitter:image"]', 'name', 'twitter:image', absoluteImage);

    upsertLink('canonical', canonical);
  }, [title, description, image, type, noindex, pathname]);

  useEffect(() => {
    document.getElementById(JSON_LD_ID)?.remove();
    if (!jsonLd) return;

    const script = document.createElement('script');
    script.id = JSON_LD_ID;
    script.type = 'application/ld+json';
    script.textContent = JSON.stringify(jsonLd);
    document.head.appendChild(script);

    return () => {
      document.getElementById(JSON_LD_ID)?.remove();
    };
  }, [jsonLd]);

  return null;
};
