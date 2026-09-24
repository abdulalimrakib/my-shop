import { defineQuery } from "next-sanity";

const BRANDS_QUERY = defineQuery(`*[_type=='brand'] | order(title asc)`);

const CATEGORIES_QUERY = defineQuery(
  `*[_type == 'category'] | order(title asc) [0...$quantity] {
    ...,
    "productCount": count(*[_type == "product" && references(^._id)])
  }`
);

const LATEST_BLOG_QUERY = defineQuery(
  ` *[_type == 'blog' && isLatest == true]|order(name asc){
      ...,
      blogcategories[]->{
      title
    }
    }`
);

const DEAL_PRODUCTS = defineQuery(
  `*[_type == 'product' && status == 'hot'] | order(name asc){
    ...,"categories": categories[]->title
  }`
);

const PRODUCT_BY_SLUG_QUERY = defineQuery(
  `*[_type == "product" && slug.current == $slug][0]{
    ...,
    "brandName": brand->title,
    "brandSlug": brand->slug.current
  }`
);

const BRAND_BY_SLUG_QUERY = defineQuery(
  `*[_type == "brand" && slug.current == $slug][0]{
    _id,
    title,
    description,
    image,
    "products": *[_type == "product" && references(^._id)] | order(name asc){
      ...,"categories": categories[]->title
    }
  }`
);

const MY_ORDERS_QUERY =
  defineQuery(`*[_type == 'order' && clerkUserId == $userId] | order(orderDate desc){
...,products[]{
  ...,product->
}
}`);
const BLOGS_PAGE_QUERY = defineQuery(
  `{
    "blogs": *[_type == 'blog'] | order(publishedAt desc)[$start...$end]{
      ...,
      blogcategories[]->{
        title
      }
    },
    "total": count(*[_type == 'blog'])
  }`
);

const SINGLE_BLOG_QUERY =
  defineQuery(`*[_type == "blog" && slug.current == $slug][0]{
  ..., 
    author->{
    name,
    image,
  },
  blogcategories[]->{
    title,
    "slug": slug.current,
  },
}`);

const BLOG_CATEGORIES = defineQuery(
  `*[_type == "blogcategory"] | order(title asc){
    _id,
    title,
    "count": count(*[_type == "blog" && references(^._id)])
  }[count > 0]`
);

const OTHERS_BLOG_QUERY = defineQuery(`*[
  _type == "blog"
  && defined(slug.current)
  && slug.current != $slug
]|order(publishedAt desc)[0...$quantity]{
...
  publishedAt,
  title,
  mainImage,
  slug,
  author->{
    name,
    image,
  },
  categories[]->{
    title,
    "slug": slug.current,
  }
}`);
export {
  BRANDS_QUERY,
  CATEGORIES_QUERY,
  LATEST_BLOG_QUERY,
  DEAL_PRODUCTS,
  PRODUCT_BY_SLUG_QUERY,
  BRAND_BY_SLUG_QUERY,
  MY_ORDERS_QUERY,
  BLOGS_PAGE_QUERY,
  SINGLE_BLOG_QUERY,
  BLOG_CATEGORIES,
  OTHERS_BLOG_QUERY,
};
