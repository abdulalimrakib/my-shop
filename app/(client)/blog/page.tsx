import BlogCard from "@/components/BlogCard";
import Container from "@/components/Container";
import Title from "@/components/Title";
import { getAllBlogs } from "@/sanity/queries";
import React from "react";

const BlogPage = async () => {
  const blogs = await getAllBlogs(6);

  return (
    <div>
      <Container>
        <Title>Blog page</Title>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mt-5 md:mt-10">
          {blogs?.map((blog) => (
            <BlogCard key={blog?._id} blog={blog} />
          ))}
        </div>
      </Container>
    </div>
  );
};

export default BlogPage;
