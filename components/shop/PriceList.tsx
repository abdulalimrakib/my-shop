import React from "react";
import Title from "../Title";
import FilterOption from "./FilterOption";

const priceArray = [
  { title: "Under $100", value: "0-100" },
  { title: "$100 - $200", value: "100-200" },
  { title: "$200 - $300", value: "200-300" },
  { title: "$300 - $500", value: "300-500" },
  { title: "Over $500", value: "500-10000" },
];

interface Props {
  selectedPrices: string[];
  setSelectedPrices: React.Dispatch<React.SetStateAction<string[]>>;
}
const PriceList = ({ selectedPrices, setSelectedPrices }: Props) => {
  return (
    <div className="w-full bg-white p-5">
      <Title className="text-base font-black">Price</Title>
      <div className="mt-2 space-y-1">
        {priceArray?.map((price) => (
          <FilterOption
            key={price.value}
            id={`price-${price.value}`}
            value={price.value}
            label={price.title}
            selected={selectedPrices}
            setSelected={setSelectedPrices}
          />
        ))}
      </div>
    </div>
  );
};

export default PriceList;
