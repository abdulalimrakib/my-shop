import { Category } from "@/sanity.types";
import React from "react";
import Title from "../Title";
import FilterOption from "./FilterOption";

interface Props {
  categories: Category[];
  selectedCategories: string[];
  setSelectedCategories: React.Dispatch<React.SetStateAction<string[]>>;
}

const CategoryList = ({
  categories,
  selectedCategories,
  setSelectedCategories,
}: Props) => {
  return (
    <div className="w-full bg-white p-5">
      <Title className="text-base font-black">Product Categories</Title>
      <div className="mt-2 space-y-1">
        {categories?.map((category) => (
          <FilterOption
            key={category?._id}
            value={category?.slug?.current as string}
            label={category?.title}
            selected={selectedCategories}
            setSelected={setSelectedCategories}
          />
        ))}
      </div>
    </div>
  );
};

export default CategoryList;
