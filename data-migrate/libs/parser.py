from abc import ABC, abstractmethod
from typing import Generic, List, Literal, TypeVar, TypedDict


class Brand(TypedDict):
    name: str


class Specification(TypedDict):
    name: str
    value: str


class Category(TypedDict):
    name: str


class SalesCategory(TypedDict):
    name: str


class Exchange(TypedDict):
    to: Literal["USD", "SGD", "MMK", "THB", "KRW"]
    from_: Literal["USD", "SGD", "MMK", "THB", "KRW"]
    rate: float
    date: str


T = TypeVar("T")
U = TypeVar("U")

class Parser(Generic[T, U], ABC):
    """Object parser"""
    @abstractmethod
    def parse_all(self, raw: List[T]) -> List[U]:
        """parser objectABC"""

    @abstractmethod
    def parse(self, raw: T) -> U | List[U]:
        """parser objectABC"""

    @property
    @abstractmethod
    def label(self) -> str:
        """get parser name"""
