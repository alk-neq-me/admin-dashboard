#!/bin/python3.10

import logging
from pathlib import Path
from typing import List

from helpers.get_keys import RawProduct
from helpers.install_fields import InstallFields
from libs.category_parser import CategoryParser
from libs.excel import ExcelHandler
from libs.sales_catgory_parser import SalesCategoryParser

from libs.serializer import JSONSerializer
from libs.exporter import Exporter
from libs.brand_parser import BrandParser


INPUT_RAW_DATA = Path("./data/laptops.json")
OUTPUT_RAW_DATA = Path("./products[:2].json")

logging.basicConfig(
    format="[ %(levelname)s::%(asctime)s ] %(message)s",
    level=logging.INFO
)


def fileds_export() -> None:
    serializer = JSONSerializer[List[RawProduct]]()
    exporter = Exporter()

    # Parsers
    brand_parser = BrandParser()
    category_parser = CategoryParser()
    sales_category_parser = SalesCategoryParser()

    exporter.export(serializer, brand_parser, INPUT_RAW_DATA)
    exporter.export(serializer, category_parser, INPUT_RAW_DATA)
    exporter.export(serializer, sales_category_parser, INPUT_RAW_DATA)


def product_export() -> None:
    serializer = JSONSerializer[List[RawProduct]]()
    installer = InstallFields(INPUT_RAW_DATA)

    product = installer.install(serializer)

    excel_handler = ExcelHandler(data=product[:2], save_as=Path(OUTPUT_RAW_DATA.with_suffix(".xlsx")))
    excel_handler.export()


def main() -> None:
    product_export()


if __name__ == "__main__":
    main()
