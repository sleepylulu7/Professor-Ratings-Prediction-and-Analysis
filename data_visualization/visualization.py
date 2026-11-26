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


def to_title(s):
    return s.replace("_", " ").title()

def visualize_data(df: pd.DataFrame) -> None:
    
    # correlation heatmap
    plt.figure(figsize=(12, 10))
    correlation_matrix = df.corr()
    labels = list(map(to_title, df.keys()))
    sns.heatmap(correlation_matrix, annot=True, fmt=".2f", cmap="coolwarm", center=0, square=True, linewidths=0.1, 
                xticklabels=labels, yticklabels=labels)
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
    fig.suptitle("Teaching Style vs Average Rating", fontsize=16)

    for i, feature in enumerate(["difficulty", "avg_grade"]):
        x = df[feature]
        axes[i].scatter(x, df["avg_rating"], alpha=0.5)
        axes[i].set_xlabel(to_title(feature))
        axes[i].set_ylabel("Average Rating")
        axes[i].set_title(to_title(feature) + " vs Average Rating")

    plt.tight_layout()
    plt.show()

    # violinplots of teaching style vs target
    fig, axes = plt.subplots(1, 3, figsize=(12, 5))
    fig.suptitle("Teaching Style vs Average Rating", fontsize=16)

    for i, feature in enumerate(["lecture_heavy", "test_heavy", "gives_feedback"]):
        sns.violinplot(x=df[feature], y=df["avg_rating"], ax=axes[i])
        axes[i].set_xticks([0, 1])
        axes[i].set_xticklabels(["No", "Yes"])
        axes[i].set_xlabel(to_title(feature))
        axes[i].set_ylabel("Average Rating")
        axes[i].set_title(to_title(feature) + " vs Average Rating")

    plt.tight_layout()
    plt.show()

    # horizontal histograms of lecture heavy and test heavy vs target
    fig, axes = plt.subplots(1, 3, figsize=(15, 6))
    fig.suptitle("Teaching Style vs Average Rating", fontsize=16)
    for k, feature in enumerate(["lecture_heavy", "test_heavy", "gives_feedback"]):
        ratings_feature = df[df[feature] == 1]["avg_rating"]
        ratings_not_feature = df[df[feature] == 0]["avg_rating"]

        bins = np.arange(1,5.1,0.5)

        hist_feature = np.histogram(ratings_feature, bins)[0] / len(ratings_feature)
        hist_not_feature = np.histogram(ratings_not_feature, bins)[0]  / len(ratings_not_feature)

        # plot the bars
        axes[k].set_title(to_title(feature) + " vs Average Rating")
        axes[k].barh(bins[:-1], -hist_feature, height = 0.5, edgecolor="black", align = "center", label = "Yes")
        axes[k].barh(bins[:-1], hist_not_feature, height = 0.5, edgecolor="black", align = "center", label = "No")
        axes[k].set_xlim(-0.5,0.5)
        axes[k].set_xticks(np.arange(-0.5,0.6,0.1))
        axes[k].set_xticklabels([str(i) + "%" for i in abs(np.arange(-50,60,10))])
        axes[k].set_xlabel(to_title(feature))
        axes[k].set_ylabel("Average Rating")
        axes[k].legend()
        fig.suptitle("Difficulty and Average Grade vs Average Rating", fontsize=16)

    plt.tight_layout()
    plt.show()
        
    
    

if __name__ == "__main__":
    visualize_data(load_data())