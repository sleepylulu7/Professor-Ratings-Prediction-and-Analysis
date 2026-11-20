import pandas as pd

print("Fetching prof data...")
prof_data = pd.read_json("prof_data/prof_list.json")
print(prof_data)