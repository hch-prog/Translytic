import React from "react";
import {
  IconBriefcase,
  IconBulb,
  IconSchool,
  IconWriting,
  IconMoodSmile,
  IconHeart,
  IconProps
} from "@tabler/icons-react";

const categories = [
  { icon: IconBriefcase, label: "Business" },
  { icon: IconSchool, label: "Education" },
  { icon: IconBulb, label: "Creative" },
  { icon: IconHeart, label: "Health" },
  { icon: IconWriting, label: "Journaling" },
  { icon: IconMoodSmile, label: "Postive" },
];

const CategoryLink = ({
  icon: Icon,
  label,
}: {
  icon: React.FC<IconProps>;
  label: string;
}) => (
  <div className="text-center">
    <a
      className="m-1 py-2 px-3 inline-flex flex-col items-center gap-y-2 text-sm font-medium rounded-lg border 
      border-gray-200 bg-white text-gray-800 shadow-sm hover:bg-gray-50 dark:bg-neutral-900 dark:border-neutral-700 
      dark:text-white dark:hover:bg-neutral-800"
      href="#"
      onClick={(e) => e.preventDefault()} 
    >
      <Icon size={24} />
      {label}
    </a>
  </div>
);

const CategoryLinks: React.FC = () => (
  <div>
    <p className="mt-3 pt-16 text-red-400"> 
    Exciting New Features on the Horizon – Stay Tuned!
    </p>
    <div className="mt-2 sm:mt-4 flex flex-wrap justify-center"> 
      {categories.map(({ icon, label }) => (
        <CategoryLink key={label} icon={icon} label={label} />
      ))}
    </div>
  </div>
);


export default CategoryLinks;
