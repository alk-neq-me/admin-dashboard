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


BASE_DIR = Path().parent

DATA_DIR = BASE_DIR / Path("data")

INPUT_RAW_FILES = DATA_DIR.glob("*.json")

OUTPUT_RAW_DATA = Path("./products[:2].json")

logging.basicConfig(
    format="[ %(levelname)s::%(asctime)s ] %(message)s",
    level=logging.INFO
)


def fileds_export(raw: Path) -> None:
    serializer = JSONSerializer[List[RawProduct]]()
    exporter = Exporter()

    # Parsers
    brand_parser = BrandParser()
    category_parser = CategoryParser()
    sales_category_parser = SalesCategoryParser()

    exporter.export(serializer, brand_parser, raw)
    exporter.export(serializer, category_parser, raw)
    exporter.export(serializer, sales_category_parser, raw)


def product_export() -> None:
    serializer = JSONSerializer[List[RawProduct]]()
    products = []

    for raw in INPUT_RAW_FILES:
        installer = InstallFields(raw)
        product = installer.install(serializer)

        products.extend(product)

    excel_handler = ExcelHandler(data=products[:2], save_as=Path(OUTPUT_RAW_DATA.with_suffix(".xlsx")))
    excel_handler.export()
    # excel_handler.log()


def main() -> None:
    logging.warning("Some images in products are filtted, which is being base64")

    product_export()


if __name__ == "__main__":
    main()
