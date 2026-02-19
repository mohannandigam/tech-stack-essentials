# Data Science Fundamentals: From Basics to Advanced

## 📋 Table of Contents

1. [Statistical Analysis Basics](#statistical-analysis-basics)
2. [Exploratory Data Analysis (EDA)](#exploratory-data-analysis-eda)
3. [Feature Engineering Techniques](#feature-engineering-techniques)
4. [Model Selection and Evaluation](#model-selection-and-evaluation)
5. [Hyperparameter Tuning](#hyperparameter-tuning)
6. [Ensemble Methods](#ensemble-methods)
7. [Model Interpretability](#model-interpretability)
8. [Production Optimization](#production-optimization)

---

## Statistical Analysis Basics

### Understanding Distributions

```python
import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns
from scipy import stats

# Generate sample data
np.random.seed(42)
data = {
    'normal': np.random.normal(100, 15, 1000),
    'skewed': np.random.gamma(2, 2, 1000),
    'uniform': np.random.uniform(0, 100, 1000),
    'bimodal': np.concatenate([
        np.random.normal(40, 10, 500),
        np.random.normal(80, 10, 500)
    ])
}

def analyze_distribution(data, name):
    """
    Comprehensive distribution analysis
    """
    print(f"\n=== {name.upper()} DISTRIBUTION ===")

    # Descriptive statistics
    print(f"\nDescriptive Statistics:")
    print(f"Mean: {np.mean(data):.2f}")
    print(f"Median: {np.median(data):.2f}")
    print(f"Mode: {stats.mode(data, keepdims=True)[0][0]:.2f}")
    print(f"Std Dev: {np.std(data):.2f}")
    print(f"Variance: {np.var(data):.2f}")
    print(f"Skewness: {stats.skew(data):.2f}")
    print(f"Kurtosis: {stats.kurtosis(data):.2f}")

    # Quantiles
    print(f"\nQuantiles:")
    print(f"25th percentile: {np.percentile(data, 25):.2f}")
    print(f"50th percentile (median): {np.percentile(data, 50):.2f}")
    print(f"75th percentile: {np.percentile(data, 75):.2f}")
    print(f"IQR: {np.percentile(data, 75) - np.percentile(data, 25):.2f}")

    # Normality tests
    statistic, p_value = stats.shapiro(data[:5000])  # Shapiro-Wilk test
    print(f"\nNormality Test (Shapiro-Wilk):")
    print(f"Statistic: {statistic:.4f}, p-value: {p_value:.4f}")
    print(f"Is normal? {p_value > 0.05}")

# Analyze each distribution
for name, values in data.items():
    analyze_distribution(values, name)

# Visualize distributions
fig, axes = plt.subplots(2, 4, figsize=(20, 10))

for idx, (name, values) in enumerate(data.items()):
    # Histogram
    axes[0, idx].hist(values, bins=50, edgecolor='black', alpha=0.7)
    axes[0, idx].set_title(f'{name.capitalize()} - Histogram')
    axes[0, idx].set_xlabel('Value')
    axes[0, idx].set_ylabel('Frequency')

    # Q-Q plot (quantile-quantile)
    stats.probplot(values, dist="norm", plot=axes[1, idx])
    axes[1, idx].set_title(f'{name.capitalize()} - Q-Q Plot')

plt.tight_layout()
plt.savefig('/tmp/distributions_analysis.png', dpi=300)
print("\n✅ Distribution analysis complete!")
```

### Hypothesis Testing

```python
def hypothesis_test_example():
    """
    Common hypothesis tests
    """

    # Generate two samples
    group_a = np.random.normal(100, 15, 100)  # Treatment group
    group_b = np.random.normal(105, 15, 100)  # Control group

    print("\n=== HYPOTHESIS TESTING ===")

    # 1. T-test (comparing means of two groups)
    t_stat, p_value = stats.ttest_ind(group_a, group_b)
    print(f"\n1. Independent T-Test:")
    print(f"   Null hypothesis: Groups have equal means")
    print(f"   T-statistic: {t_stat:.4f}")
    print(f"   P-value: {p_value:.4f}")
    print(f"   Result: {'Reject null' if p_value < 0.05 else 'Fail to reject null'}")
    print(f"   Interpretation: Groups are {'significantly different' if p_value < 0.05 else 'not significantly different'}")

    # 2. Chi-square test (categorical data)
    observed = np.array([[30, 10], [20, 40]])  # Contingency table
    chi2, p_value, dof, expected = stats.chi2_contingency(observed)
    print(f"\n2. Chi-Square Test:")
    print(f"   Null hypothesis: Variables are independent")
    print(f"   Chi-square statistic: {chi2:.4f}")
    print(f"   P-value: {p_value:.4f}")
    print(f"   Degrees of freedom: {dof}")
    print(f"   Result: {'Variables are associated' if p_value < 0.05 else 'Variables are independent'}")

    # 3. ANOVA (comparing means of multiple groups)
    group_c = np.random.normal(110, 15, 100)
    f_stat, p_value = stats.f_oneway(group_a, group_b, group_c)
    print(f"\n3. ANOVA Test:")
    print(f"   Null hypothesis: All groups have equal means")
    print(f"   F-statistic: {f_stat:.4f}")
    print(f"   P-value: {p_value:.4f}")
    print(f"   Result: {'At least one group differs' if p_value < 0.05 else 'No significant difference'}")

    # 4. Correlation test
    x = np.random.normal(0, 1, 100)
    y = 2 * x + np.random.normal(0, 0.5, 100)  # Correlated
    corr, p_value = stats.pearsonr(x, y)
    print(f"\n4. Pearson Correlation Test:")
    print(f"   Null hypothesis: No correlation")
    print(f"   Correlation coefficient: {corr:.4f}")
    print(f"   P-value: {p_value:.4f}")
    print(f"   Result: {'Significant correlation' if p_value < 0.05 else 'No significant correlation'}")

hypothesis_test_example()
```

### Effect Size and Power Analysis

```python
from statsmodels.stats.power import ttest_power

def effect_size_analysis():
    """
    Calculate effect sizes and power analysis
    """

    group_a = np.random.normal(100, 15, 100)
    group_b = np.random.normal(105, 15, 100)

    # Cohen's d (effect size)
    mean_diff = np.mean(group_b) - np.mean(group_a)
    pooled_std = np.sqrt((np.var(group_a) + np.var(group_b)) / 2)
    cohens_d = mean_diff / pooled_std

    print("\n=== EFFECT SIZE ANALYSIS ===")
    print(f"Cohen's d: {cohens_d:.4f}")
    print(f"Interpretation:")
    print(f"  Small effect: |d| ~ 0.2")
    print(f"  Medium effect: |d| ~ 0.5")
    print(f"  Large effect: |d| ~ 0.8")

    # Power analysis
    power = ttest_power(cohens_d, nobs=100, alpha=0.05)
    print(f"\nStatistical Power: {power:.4f}")
    print(f"Probability of detecting effect if it exists: {power*100:.1f}%")

effect_size_analysis()
```

---

## Exploratory Data Analysis (EDA)

### Comprehensive EDA Framework

```python
import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns

class EDAAnalyzer:
    """
    Comprehensive EDA toolkit
    """

    def __init__(self, df):
        self.df = df

    def basic_info(self):
        """
        Display basic information about dataset
        """
        print("=== BASIC INFORMATION ===")
        print(f"\nDataset Shape: {self.df.shape}")
        print(f"Rows: {self.df.shape[0]:,}")
        print(f"Columns: {self.df.shape[1]}")

        print(f"\nColumn Types:")
        print(self.df.dtypes.value_counts())

        print(f"\nMemory Usage:")
        print(f"{self.df.memory_usage(deep=True).sum() / 1024**2:.2f} MB")

    def missing_data_analysis(self):
        """
        Analyze missing data
        """
        print("\n=== MISSING DATA ANALYSIS ===")

        missing = self.df.isnull().sum()
        missing_pct = 100 * missing / len(self.df)

        missing_df = pd.DataFrame({
            'Missing_Count': missing,
            'Missing_Percentage': missing_pct
        })

        missing_df = missing_df[missing_df['Missing_Count'] > 0].sort_values(
            'Missing_Percentage', ascending=False
        )

        if len(missing_df) > 0:
            print(missing_df)

            # Visualize
            plt.figure(figsize=(10, 6))
            missing_df['Missing_Percentage'].plot(kind='barh')
            plt.xlabel('Missing Percentage (%)')
            plt.title('Missing Data by Column')
            plt.tight_layout()
            plt.savefig('/tmp/missing_data.png', dpi=300)
        else:
            print("No missing data found!")

    def numerical_analysis(self):
        """
        Analyze numerical columns
        """
        print("\n=== NUMERICAL ANALYSIS ===")

        numerical_cols = self.df.select_dtypes(include=[np.number]).columns

        # Descriptive statistics
        print("\nDescriptive Statistics:")
        print(self.df[numerical_cols].describe())

        # Distribution plots
        n_cols = len(numerical_cols)
        n_rows = (n_cols + 2) // 3

        fig, axes = plt.subplots(n_rows, 3, figsize=(15, 5*n_rows))
        axes = axes.flatten() if n_cols > 1 else [axes]

        for idx, col in enumerate(numerical_cols):
            if idx < len(axes):
                self.df[col].hist(bins=50, ax=axes[idx], edgecolor='black')
                axes[idx].set_title(f'{col} Distribution')
                axes[idx].set_xlabel('Value')
                axes[idx].set_ylabel('Frequency')

        # Hide extra subplots
        for idx in range(n_cols, len(axes)):
            axes[idx].axis('off')

        plt.tight_layout()
        plt.savefig('/tmp/numerical_distributions.png', dpi=300)

    def categorical_analysis(self):
        """
        Analyze categorical columns
        """
        print("\n=== CATEGORICAL ANALYSIS ===")

        categorical_cols = self.df.select_dtypes(include=['object', 'category']).columns

        for col in categorical_cols:
            print(f"\n{col}:")
            value_counts = self.df[col].value_counts()
            print(f"  Unique values: {self.df[col].nunique()}")
            print(f"  Top 5 values:")
            print(value_counts.head())

            # Bar plot for top categories
            plt.figure(figsize=(10, 6))
            value_counts.head(10).plot(kind='barh')
            plt.xlabel('Count')
            plt.title(f'{col} - Top 10 Categories')
            plt.tight_layout()
            plt.savefig(f'/tmp/categorical_{col}.png', dpi=300)

    def correlation_analysis(self):
        """
        Analyze correlations
        """
        print("\n=== CORRELATION ANALYSIS ===")

        numerical_cols = self.df.select_dtypes(include=[np.number]).columns

        if len(numerical_cols) > 1:
            # Correlation matrix
            corr_matrix = self.df[numerical_cols].corr()

            # Find highly correlated pairs
            high_corr = []
            for i in range(len(corr_matrix.columns)):
                for j in range(i+1, len(corr_matrix.columns)):
                    if abs(corr_matrix.iloc[i, j]) > 0.7:
                        high_corr.append({
                            'Feature 1': corr_matrix.columns[i],
                            'Feature 2': corr_matrix.columns[j],
                            'Correlation': corr_matrix.iloc[i, j]
                        })

            if high_corr:
                print("\nHighly Correlated Features (|r| > 0.7):")
                print(pd.DataFrame(high_corr))

            # Heatmap
            plt.figure(figsize=(12, 10))
            sns.heatmap(corr_matrix, annot=True, fmt='.2f', cmap='coolwarm',
                       center=0, square=True, linewidths=1)
            plt.title('Correlation Matrix')
            plt.tight_layout()
            plt.savefig('/tmp/correlation_matrix.png', dpi=300)

    def outlier_detection(self):
        """
        Detect outliers using multiple methods
        """
        print("\n=== OUTLIER DETECTION ===")

        numerical_cols = self.df.select_dtypes(include=[np.number]).columns

        outlier_summary = []

        for col in numerical_cols:
            data = self.df[col].dropna()

            # IQR method
            Q1 = data.quantile(0.25)
            Q3 = data.quantile(0.75)
            IQR = Q3 - Q1
            lower_bound = Q1 - 1.5 * IQR
            upper_bound = Q3 + 1.5 * IQR
            outliers_iqr = ((data < lower_bound) | (data > upper_bound)).sum()

            # Z-score method
            z_scores = np.abs(stats.zscore(data))
            outliers_z = (z_scores > 3).sum()

            outlier_summary.append({
                'Column': col,
                'IQR_Outliers': outliers_iqr,
                'ZScore_Outliers': outliers_z,
                'Outlier_Percentage': (outliers_iqr / len(data)) * 100
            })

        outlier_df = pd.DataFrame(outlier_summary)
        print(outlier_df)

    def run_full_eda(self):
        """
        Run complete EDA pipeline
        """
        self.basic_info()
        self.missing_data_analysis()
        self.numerical_analysis()
        self.categorical_analysis()
        self.correlation_analysis()
        self.outlier_detection()

        print("\n✅ EDA Complete!")

# Example usage
# Load sample data
from sklearn.datasets import load_boston
boston = load_boston()
df = pd.DataFrame(boston.data, columns=boston.feature_names)
df['target'] = boston.target

# Run EDA
eda = EDAAnalyzer(df)
eda.run_full_eda()
```

---

## Feature Engineering Techniques

### Comprehensive Feature Engineering

```python
class FeatureEngineer:
    """
    Advanced feature engineering techniques
    """

    def __init__(self, df):
        self.df = df.copy()

    def create_polynomial_features(self, columns, degree=2):
        """
        Create polynomial features
        """
        from sklearn.preprocessing import PolynomialFeatures

        poly = PolynomialFeatures(degree=degree, include_bias=False)
        poly_features = poly.fit_transform(self.df[columns])

        feature_names = poly.get_feature_names_out(columns)

        poly_df = pd.DataFrame(poly_features, columns=feature_names, index=self.df.index)

        return pd.concat([self.df, poly_df], axis=1)

    def create_interaction_features(self, col1, col2):
        """
        Create interaction between two features
        """
        self.df[f'{col1}_x_{col2}'] = self.df[col1] * self.df[col2]
        self.df[f'{col1}_div_{col2}'] = self.df[col1] / (self.df[col2] + 1e-6)

        return self.df

    def create_binned_features(self, column, n_bins=5, strategy='quantile'):
        """
        Create binned categorical features from numerical
        """
        from sklearn.preprocessing import KBinsDiscretizer

        discretizer = KBinsDiscretizer(n_bins=n_bins, encode='ordinal', strategy=strategy)
        binned = discretizer.fit_transform(self.df[[column]])

        self.df[f'{column}_binned'] = binned

        return self.df

    def create_time_features(self, datetime_column):
        """
        Extract time-based features
        """
        dt = pd.to_datetime(self.df[datetime_column])

        self.df[f'{datetime_column}_year'] = dt.dt.year
        self.df[f'{datetime_column}_month'] = dt.dt.month
        self.df[f'{datetime_column}_day'] = dt.dt.day
        self.df[f'{datetime_column}_dayofweek'] = dt.dt.dayofweek
        self.df[f'{datetime_column}_hour'] = dt.dt.hour
        self.df[f'{datetime_column}_is_weekend'] = dt.dt.dayofweek.isin([5, 6]).astype(int)
        self.df[f'{datetime_column}_quarter'] = dt.dt.quarter
        self.df[f'{datetime_column}_is_month_start'] = dt.dt.is_month_start.astype(int)
        self.df[f'{datetime_column}_is_month_end'] = dt.dt.is_month_end.astype(int)

        return self.df

    def create_aggregation_features(self, group_by_col, agg_col, agg_functions=['mean', 'std', 'min', 'max']):
        """
        Create aggregation features by group
        """
        agg_features = self.df.groupby(group_by_col)[agg_col].agg(agg_functions)
        agg_features.columns = [f'{agg_col}_{func}_by_{group_by_col}' for func in agg_functions]

        self.df = self.df.merge(agg_features, on=group_by_col, how='left')

        return self.df

    def create_lag_features(self, column, lags=[1, 7, 30]):
        """
        Create lag features for time series
        """
        for lag in lags:
            self.df[f'{column}_lag_{lag}'] = self.df[column].shift(lag)

        return self.df

    def create_rolling_features(self, column, windows=[7, 30], functions=['mean', 'std']):
        """
        Create rolling window features
        """
        for window in windows:
            for func in functions:
                self.df[f'{column}_rolling_{func}_{window}'] = \
                    self.df[column].rolling(window=window).agg(func)

        return self.df

    def create_target_encoding(self, categorical_col, target_col):
        """
        Create target encoding for categorical features
        """
        target_mean = self.df.groupby(categorical_col)[target_col].mean()
        self.df[f'{categorical_col}_target_encoded'] = \
            self.df[categorical_col].map(target_mean)

        return self.df

    def create_frequency_encoding(self, categorical_col):
        """
        Encode categorical variable by frequency
        """
        freq = self.df[categorical_col].value_counts()
        self.df[f'{categorical_col}_freq'] = self.df[categorical_col].map(freq)

        return self.df

# Example usage
df_engineered = FeatureEngineer(df)

# Create various features
df_engineered = df_engineered.create_polynomial_features(['CRIM', 'RM'], degree=2)
df_engineered = df_engineered.create_interaction_features('CRIM', 'RM')
df_engineered = df_engineered.create_binned_features('AGE', n_bins=5)

print(f"Original features: {len(df.columns)}")
print(f"Engineered features: {len(df_engineered.df.columns)}")
print(f"New features created: {len(df_engineered.df.columns) - len(df.columns)}")
```

### Feature Selection

```python
from sklearn.feature_selection import (
    SelectKBest, f_classif, mutual_info_classif,
    RFE, SelectFromModel
)
from sklearn.ensemble import RandomForestClassifier

class FeatureSelector:
    """
    Feature selection methods
    """

    def __init__(self, X, y):
        self.X = X
        self.y = y

    def univariate_selection(self, k=10):
        """
        Select K best features using statistical tests
        """
        selector = SelectKBest(f_classif, k=k)
        selector.fit(self.X, self.y)

        # Get selected features
        selected_features = self.X.columns[selector.get_support()].tolist()

        # Get scores
        scores = pd.DataFrame({
            'Feature': self.X.columns,
            'Score': selector.scores_
        }).sort_values('Score', ascending=False)

        print(f"\n=== Univariate Selection (Top {k}) ===")
        print(scores.head(k))

        return selected_features

    def mutual_information_selection(self, k=10):
        """
        Select features based on mutual information
        """
        mi_scores = mutual_info_classif(self.X, self.y, random_state=42)

        mi_df = pd.DataFrame({
            'Feature': self.X.columns,
            'MI_Score': mi_scores
        }).sort_values('MI_Score', ascending=False)

        print(f"\n=== Mutual Information Selection (Top {k}) ===")
        print(mi_df.head(k))

        selected_features = mi_df.head(k)['Feature'].tolist()

        return selected_features

    def recursive_feature_elimination(self, n_features=10):
        """
        Recursive Feature Elimination
        """
        estimator = RandomForestClassifier(n_estimators=100, random_state=42)
        selector = RFE(estimator, n_features_to_select=n_features)
        selector.fit(self.X, self.y)

        selected_features = self.X.columns[selector.support_].tolist()

        # Get feature rankings
        rankings = pd.DataFrame({
            'Feature': self.X.columns,
            'Ranking': selector.ranking_
        }).sort_values('Ranking')

        print(f"\n=== Recursive Feature Elimination (Top {n_features}) ===")
        print(rankings.head(n_features))

        return selected_features

    def model_based_selection(self, threshold='median'):
        """
        Select features based on model importance
        """
        estimator = RandomForestClassifier(n_estimators=100, random_state=42)
        estimator.fit(self.X, self.y)

        selector = SelectFromModel(estimator, threshold=threshold, prefit=True)
        selected_features = self.X.columns[selector.get_support()].tolist()

        # Get feature importances
        importances = pd.DataFrame({
            'Feature': self.X.columns,
            'Importance': estimator.feature_importances_
        }).sort_values('Importance', ascending=False)

        print(f"\n=== Model-Based Selection ===")
        print(importances)

        return selected_features

    def correlation_filter(self, threshold=0.9):
        """
        Remove highly correlated features
        """
        corr_matrix = self.X.corr().abs()

        # Upper triangle of correlation matrix
        upper = corr_matrix.where(
            np.triu(np.ones(corr_matrix.shape), k=1).astype(bool)
        )

        # Find features with correlation greater than threshold
        to_drop = [column for column in upper.columns if any(upper[column] > threshold)]

        print(f"\n=== Correlation Filter (threshold={threshold}) ===")
        print(f"Features to drop due to high correlation: {to_drop}")

        selected_features = [col for col in self.X.columns if col not in to_drop]

        return selected_features
```

---

*Continue in next section...*

## Model Selection and Evaluation

### Cross-Validation Strategies

```python
from sklearn.model_selection import (
    cross_val_score, cross_validate,
    StratifiedKFold, TimeSeriesSplit, GroupKFold
)

def compare_models_cv(X, y, models):
    """
    Compare multiple models using cross-validation
    """
    results = []

    for name, model in models.items():
        # Perform cross-validation
        cv_results = cross_validate(
            model, X, y,
            cv=5,
            scoring=['accuracy', 'precision', 'recall', 'f1', 'roc_auc'],
            return_train_score=True
        )

        results.append({
            'Model': name,
            'Accuracy_mean': cv_results['test_accuracy'].mean(),
            'Accuracy_std': cv_results['test_accuracy'].std(),
            'Precision_mean': cv_results['test_precision'].mean(),
            'Recall_mean': cv_results['test_recall'].mean(),
            'F1_mean': cv_results['test_f1'].mean(),
            'ROC_AUC_mean': cv_results['test_roc_auc'].mean()
        })

    results_df = pd.DataFrame(results).sort_values('F1_mean', ascending=False)

    print("\n=== Model Comparison ===")
    print(results_df)

    return results_df
```

---

**Related Resources**:
- [Anomaly Detection Guide](./ANOMALY_DETECTION.md)
- [MLOps Guide](./MLOPS_GUIDE.md)
- [Team Structure](./TEAM_STRUCTURE.md)

*Last Updated: 2026-02-19*
