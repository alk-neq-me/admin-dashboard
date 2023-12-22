from dataclasses import dataclass
from typing import Dict, List, TypeVar, TypedDict

from .parser import Specification, Parser


class SpecificationBound(TypedDict):
    specification: Dict[str, str]

T = TypeVar("T", bound=SpecificationBound)

@dataclass(frozen=True)
class SpecificationParser(Parser[T, Specification]):
    def parse_all(self, raw: List[T]) -> List[Specification]:
        result: List[Specification] = []

        for obj in raw:
            for k, v in obj["specification"].items():
                result.append({ "name": k, "value": v })
            
        return result

    @property
    def label(self) -> str:
        return "specifications"

    def parse(self, raw: T) -> List[Specification]:
        specs: List[Specification] = []

        for k, v in raw["specification"].items():
            specs.append(Specification(name=k, value=v))

        return specs
