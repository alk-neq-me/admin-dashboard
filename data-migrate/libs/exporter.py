from dataclasses import dataclass
from pathlib import Path

from libs.excel import ExcelHandler
from libs.parser import Parser
from libs.serializer import Serializer


@dataclass(frozen=True)
class Exporter:
    def export(self, serializer: Serializer, parser: Parser, path: Path):
        raw_products = serializer.serialize(path)

        categories = parser.parse_all(raw_products)
        
        output = path.parent / (path.stem + "_" + parser.label)

        excel_handler = ExcelHandler(data=categories, save_as=Path(output.with_suffix(".xlsx")))
        excel_handler.export()
