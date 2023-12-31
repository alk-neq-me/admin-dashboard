import { useNavigate } from "react-router-dom"
import { LinkLabel } from "@/components";
import { Category } from "@/services/types";

export function RenderCategoryLabel({category}: {category: Category}) {
  const navigate = useNavigate()
  const to = "/category/detail/" + category.id

  const handleNavigate = () => {
    navigate(to)
  }

  return <LinkLabel onClick={handleNavigate}>
    {category.name}
  </LinkLabel>
}

