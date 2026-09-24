import React from "react";
import Title from "./Title";
import { getLatestBlogs } from "@/sanity/queries";
import BlogCard from "./BlogCard";

const LatestBlog = async () => {
  const blogs = await getLatestBlogs();
  return (
    <div className="mb-10 lg:mb-20">
      <Title>Latest Blog</Title>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mt-5">
        {blogs?.map((blog) => (
          <BlogCard key={blog?._id} blog={blog} />
        ))}
      </div>
    </div>
  );
};

export default LatestBlog;
