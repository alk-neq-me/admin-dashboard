import logging
import polars as pl
from dataclasses import dataclass
from pathlib import Path
from typing import Generic, List, TypeVar


T = TypeVar("T")

@dataclass(frozen=True)
class ExcelHandler(Generic[T]):
    data: List[T]
    save_as: Path

    def export(self) -> None:
        df =  pl.DataFrame(self.data)
        df.write_excel(self.save_as)
        logging.info("📑 Success export excel.")
