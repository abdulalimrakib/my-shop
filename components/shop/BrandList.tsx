import { BRANDS_QUERY_RESULT } from "@/sanity.types";
import React from "react";
import Title from "../Title";
import FilterOption from "./FilterOption";

interface Props {
  brands: BRANDS_QUERY_RESULT;
  selectedBrands: string[];
  setSelectedBrands: React.Dispatch<React.SetStateAction<string[]>>;
}

const BrandList = ({ brands, selectedBrands, setSelectedBrands }: Props) => {
  return (
    <div className="w-full bg-white p-5">
      <Title className="text-base font-black">Brands</Title>
      <div className="mt-2 space-y-1">
        {brands?.map((brand) => (
          <FilterOption
            key={brand?._id}
            value={brand?.slug?.current as string}
            label={brand?.title}
            selected={selectedBrands}
            setSelected={setSelectedBrands}
          />
        ))}
      </div>
    </div>
  );
};

export default BrandList;
