from dataclasses import dataclass
from typing import List, TypeVar, TypedDict

from .parser import Category, Parser


class CategoryBound(TypedDict):
    category: List[str]

T = TypeVar("T", bound=CategoryBound)

@dataclass(frozen=True)
class CategoryParser(Parser[T]):
    def parse(self, raw: List[T]) -> List[Category]:
        result: List[Category] = []
        unique_keys = set()

        for obj in raw:
            for i in obj["category"]:
                if i not in unique_keys:
                    unique_keys.add(i)
                    result.append({"name": i})
            
        return result

    @property
    def label(self) -> str:
        return "categories"
