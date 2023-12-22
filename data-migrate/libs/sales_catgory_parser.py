from dataclasses import dataclass
from typing import List, TypeVar, TypedDict

from .parser import SalesCategory, Parser


class SalesCategoryBound(TypedDict):
    sales_category: List[str]

T = TypeVar("T", bound=SalesCategoryBound)

@dataclass(frozen=True)
class SalesCategoryParser(Parser[T, SalesCategory]):
    def parse_all(self, raw: List[T]) -> List[SalesCategory]:
        result: List[SalesCategory] = []
        unique_keys = set()

        for obj in raw:
            for i in obj["sales_category"]:
                if i not in unique_keys:
                    unique_keys.add(i)
                    result.append({"name": i})
            
        return result

    @property
    def label(self) -> str:
        return "sales-categories"

    def parse(self, raw: T) -> List[SalesCategory]:
        sales: List[SalesCategory] = []

        for i in raw["sales_category"]:
            sales.append(SalesCategory(name=i))

        return sales
