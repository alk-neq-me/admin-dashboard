import logging
import json
from abc import ABC, abstractmethod
from pathlib import Path
from typing import Generic, TypeVar

from .exceptions import SerializeError


T = TypeVar("T")

class Serializer(Generic[T], ABC):
    """Complex object read and get raw data"""
    @abstractmethod
    def serialize(self, path: Path) -> T:
        """Complex object to python data type convertor"""


class JSONSerializer(Serializer[T]):
    """JSON file read and raw data"""
    def serialize(self, path: Path) -> T:
        """JSON file to python dict convertor"""
        with path.open(mode="r", encoding="utf-8") as fp:
            try:
                data: T = json.load(fp)
                return data
            except json.JSONDecodeError as e:
                logging.error(f"JSON Decoding error: {e}")
                raise SerializeError()
