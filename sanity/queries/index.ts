import { sanityFetch } from "../lib/live";
import { serverClient } from "../lib/serverClient";
import {
  BLOG_CATEGORIES,
  BLOGS_PAGE_QUERY,
  BRAND_BY_SLUG_QUERY,
  BRANDS_QUERY,
  CATEGORIES_QUERY,
  DEAL_PRODUCTS,
  LATEST_BLOG_QUERY,
  MY_ORDERS_QUERY,
  OTHERS_BLOG_QUERY,
  PRODUCT_BY_SLUG_QUERY,
  SINGLE_BLOG_QUERY,
} from "./query";

// Errors are not swallowed here: a failed fetch reaches the nearest
// error.tsx instead of rendering as "no products" or "no orders".

const getCategories = async (quantity = 1000) => {
  const { data } = await sanityFetch({
    query: CATEGORIES_QUERY,
    params: { quantity },
  });
  return data ?? [];
};

const getAllBrands = async () => {
  const { data } = await sanityFetch({ query: BRANDS_QUERY });
  return data ?? [];
};

const getLatestBlogs = async () => {
  const { data } = await sanityFetch({ query: LATEST_BLOG_QUERY });
  return data ?? [];
};

const getDealProducts = async () => {
  const { data } = await sanityFetch({ query: DEAL_PRODUCTS });
  return data ?? [];
};

const getProductBySlug = async (slug: string) => {
  const { data } = await sanityFetch({
    query: PRODUCT_BY_SLUG_QUERY,
    params: { slug },
  });
  return data ?? null;
};

const getBrandBySlug = async (slug: string) => {
  const { data } = await sanityFetch({
    query: BRAND_BY_SLUG_QUERY,
    params: { slug },
  });
  return data ?? null;
};

// Orders are private and must be fresh right after checkout, so they skip
// the cached catalog fetch and use the uncached token client
const getMyOrders = async (userId: string) => {
  const data = await serverClient.fetch(MY_ORDERS_QUERY, { userId });
  return data ?? [];
};

const getBlogsPage = async (page: number, pageSize: number) => {
  const start = (page - 1) * pageSize;
  const { data } = await sanityFetch({
    query: BLOGS_PAGE_QUERY,
    params: { start, end: start + pageSize },
  });
  return { blogs: data?.blogs ?? [], total: data?.total ?? 0 };
};

const getSingleBlog = async (slug: string) => {
  const { data } = await sanityFetch({
    query: SINGLE_BLOG_QUERY,
    params: { slug },
  });
  return data ?? null;
};

const getBlogCategories = async () => {
  const { data } = await sanityFetch({ query: BLOG_CATEGORIES });
  return data ?? [];
};

const getOthersBlog = async (slug: string, quantity: number) => {
  const { data } = await sanityFetch({
    query: OTHERS_BLOG_QUERY,
    params: { slug, quantity },
  });
  return data ?? [];
};

export {
  getCategories,
  getAllBrands,
  getLatestBlogs,
  getDealProducts,
  getProductBySlug,
  getBrandBySlug,
  getMyOrders,
  getBlogsPage,
  getSingleBlog,
  getBlogCategories,
  getOthersBlog,
};
