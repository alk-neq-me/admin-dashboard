from dataclasses import dataclass
from typing import List, TypeVar, TypedDict

from .parser import Brand, Parser


class BrandBound(TypedDict):
    brand: str

T = TypeVar("T", bound=BrandBound)

@dataclass(frozen=True)
class BrandParser(Parser[T, Brand]):
    def parse_all(self, raw: List[T]) -> List[Brand]:
        result: List[Brand] = []
        unique_keys = set()

        for obj in raw:
            i = obj["brand"]
            if i not in unique_keys:
                unique_keys.add(i)
                result.append({"name": i})
            
        return result

    @property
    def label(self) -> str:
        return "brands"

    def parse(self, raw: T) -> Brand:
        return Brand(name=raw["brand"])
