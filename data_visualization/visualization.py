import numpy as np
import pandas as pd
import seaborn as sns
import matplotlib.pyplot as plt


def load_data() -> pd.DataFrame:
    path = "prof_data/ratings_by_prof.json"

    df = pd.read_json(path, orient="index")

    df["year"] = pd.to_numeric(df["year"], errors="coerce") # remove unknowns nulls and letter years

    df = df[df["avg_wta"] >= 0]
    df = df[df["avg_rating"] > 0]

    df["is_male"] = df["gender"].map({"M": 1, "F": 0})

    return df.drop(columns=["college", "department", "gender"]).astype(float)


def visualize_data(df: pd.DataFrame) -> None:
    
    # correlation heatmap
    plt.figure(figsize=(12, 10))
    correlation_matrix = df.corr()
    sns.heatmap(correlation_matrix, annot=True, fmt=".2f", cmap="coolwarm", center=0, square=True, linewidths=0.1)
    plt.title("Correlation Heatmap")
    plt.tight_layout()
    plt.show()

    # histogram of avg_rating
    plt.figure(figsize=(10, 6))
    plt.hist(df["avg_rating"], bins=16, edgecolor="black")
    plt.title("Distribution of Average Rating")
    plt.xlabel("Average Rating")
    plt.ylabel("Number of Professors")
    plt.tight_layout()
    plt.show()

    # scatter plots of difficulty and avg_grade vs avg_rating
    fig, axes = plt.subplots(1, 2, figsize=(15, 6))
    fig.suptitle("Difficulty and Average Grade vs Average Rating", fontsize=16)

    features = ["difficulty", "avg_grade"]
    for i, feature in enumerate(features):
        x = df[feature]
        axes[i].scatter(x, df["avg_rating"], alpha=0.5)
        axes[i].set_xlabel(feature)
        axes[i].set_ylabel("Average Rating")
        axes[i].set_title(feature + " vs Average Rating")

    plt.tight_layout()
    plt.show()


if __name__ == "__main__":
    visualize_data(load_data())