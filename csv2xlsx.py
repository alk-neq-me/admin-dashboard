import polars
import pathlib

csv_path = input("CSV: ")

df = polars.read_csv(csv_path)
df.write_excel(pathlib.Path(csv_path).with_suffix(".xlsx"))
